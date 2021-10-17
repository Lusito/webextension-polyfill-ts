import { SchemaEntry, SchemaFunctionProperty, SchemaProperty } from "./types";
import type { ImportedNamespace } from "./importNormalized";

export enum VisitorAction {
    REMOVE = "WET_POLYFILL_TS_VISITOR/REMOVE",
}

export type SchemaVisitor<T, TR> = (original: T) => TR | VisitorAction;

export interface SchemaVisitors {
    Namespace?: SchemaVisitor<SchemaEntry, SchemaEntry>;
    Type?: SchemaVisitor<SchemaProperty, SchemaProperty>;
    Event?: SchemaVisitor<SchemaFunctionProperty, SchemaProperty>;
    Function?: SchemaVisitor<SchemaFunctionProperty, SchemaProperty>;
    Parameter?: SchemaVisitor<SchemaProperty, SchemaProperty>;
    Returns?: SchemaVisitor<SchemaProperty, SchemaProperty>;
    Property?: SchemaVisitor<SchemaProperty, SchemaProperty>;
}

type SchemaVisitorKey = keyof SchemaVisitors;

export interface SchemaVisitorInfo {
    name: string;
    visitors: SchemaVisitors;
}

export type SchemaVisitorFactory = (
    namespace: ImportedNamespace,
    namespaces: ImportedNamespace[]
) => SchemaVisitorInfo | null;

function handleVisit(context: WalkerContext, original: any, visitorKey: SchemaVisitorKey) {
    const visitor = context.visitorInfo.visitors[visitorKey];
    if (visitor) {
        try {
            return visitor(original);
        } catch (e: any) {
            e.message = `Error processing '${context.filename}' in visitor '${context.visitorInfo.name}' (${visitorKey}): ${e.message}`;
            throw e;
        }
    }
    return original;
}

function handlePropertyVisit<T extends SchemaProperty>(context: WalkerContext, entry: T) {
    if (entry.type === "function") return handleVisit(context, entry, "Function");
    return handleVisit(context, entry, "Property");
}

function walkArray<T extends SchemaProperty>(context: WalkerContext, original: T[], visitorKey?: SchemaVisitorKey) {
    const modified: T[] = [];
    for (const entry of original) {
        const result = visitorKey ? handleVisit(context, entry, visitorKey) : handlePropertyVisit(context, entry);
        if (result !== VisitorAction.REMOVE) {
            modified.push(result);
            walkProperty(context, result);
        }
    }
    return modified;
}

function walkMap<T extends SchemaProperty>(context: WalkerContext, original: Record<string, T>) {
    const modified: Record<string, T> = {};
    for (const key of Object.keys(original)) {
        const entry = original[key];
        const result = handlePropertyVisit(context, entry);
        if (result !== VisitorAction.REMOVE) {
            modified[key] = result;
            walkProperty(context, result);
        }
    }
    return modified;
}

function walkProperty(context: WalkerContext, entry: SchemaProperty) {
    switch (entry.type) {
        case "choices":
            if (entry.choices) entry.choices = walkArray(context, entry.choices);
            break;
        case "object":
            if (entry.properties) entry.properties = walkMap(context, entry.properties);
            if (entry.additionalProperties && typeof entry.additionalProperties !== "boolean") {
                const result = handlePropertyVisit(context, entry.additionalProperties);
                if (result === VisitorAction.REMOVE) delete entry.additionalProperties;
                else entry.additionalProperties = result;
            }
            if (entry.patternProperties) entry.patternProperties = walkMap(context, entry.patternProperties);
            if (entry.functions) entry.functions = walkArray(context, entry.functions, "Function");
            if (entry.events) entry.events = walkArray(context, entry.events, "Event");
            break;
        case "array":
            if (entry.items) {
                const result = handlePropertyVisit(context, entry.items);
                if (result === VisitorAction.REMOVE) delete entry.items;
                else entry.items = result;
            }
            break;
        case "function":
            if (entry.parameters) entry.parameters = walkArray(context, entry.parameters, "Parameter");
            if (entry.extraParameters) entry.extraParameters = walkArray(context, entry.extraParameters, "Parameter");
            if (entry.returns) {
                const modified = handleVisit(context, entry.returns, "Returns");
                if (modified === VisitorAction.REMOVE) delete entry.returns;
                else entry.returns = modified;
            }
            if (entry.filters) entry.filters = walkArray(context, entry.filters);
            break;
    }
}

interface WalkerContext {
    filename: string;
    entry: SchemaEntry;
    visitorInfo: SchemaVisitorInfo;
}

export function applyFix(namespaces: ImportedNamespace[], factory: SchemaVisitorFactory) {
    return namespaces.filter((namespace) => {
        const { entry } = namespace;
        const visitorInfo = factory(namespace, namespaces);
        if (!visitorInfo) return true;

        // console.log(`applying fix on ${namespace.file}: ${visitorInfo.name}`);
        const context: WalkerContext = {
            filename: namespace.file,
            entry,
            visitorInfo,
        };
        const modified = handleVisit(context, entry, "Namespace");
        if (modified === VisitorAction.REMOVE) return false;

        namespace.entry = modified;
        if (entry.types) entry.types = walkArray(context, entry.types, "Type");
        if (entry.functions) entry.functions = walkArray(context, entry.functions, "Function");
        if (entry.events) entry.events = walkArray(context, entry.events, "Event");
        if (entry.properties) entry.properties = walkMap(context, entry.properties);
        return true;
    });
}

export function applyFixes(namespaces: ImportedNamespace[], fixes: SchemaVisitorFactory[]) {
    for (const fix of fixes) namespaces = applyFix(namespaces, fix);
    return namespaces;
}
