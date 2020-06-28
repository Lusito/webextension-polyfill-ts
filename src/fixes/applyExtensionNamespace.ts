import { SchemaEntry } from "../helpers/types";
import { SchemaVisitorFactory, VisitorAction } from "../helpers/visitor";
import { assertValidOjectKeys } from "../helpers/assert";

// There are namespaces and namespaces that extend existing namespaces.
// This fix merges the extending namespaces into the namespace they extend and then removes the extending namespaces.

function visitor(entry: SchemaEntry, entryToExtend: SchemaEntry) {
    if (!entryToExtend.types) entryToExtend.types = [];
    const { types } = entryToExtend;

    entry.types?.forEach((t) => {
        if (!t.$extend) {
            types.push(t);
            return;
        }

        const extended = types.find((t2) => t2.id === t.$extend);
        if (!extended) throw new Error(`Could not find type to extend: ${t.$extend}`);

        if (t.type === "choices") {
            assertValidOjectKeys(t, ["type", "$extend", "choices"]);
            t.type = "choices";
        } else if (t.type === "object") {
            assertValidOjectKeys(t, ["type", "$extend", "properties"]);
            t.type = "object";
        } else {
            throw new Error(`Unknown extension type ${t.$extend}`);
        }

        if (t.type === "choices" && t.choices && extended.type === "choices" && extended.choices) {
            const { choices } = extended;
            const onlyEnums = t.choices.every((c) => c.type === "string" && c.enum);
            const enumToExtend = choices.find((c) => c.type === "string" && !!c.enum);
            if (onlyEnums && enumToExtend && enumToExtend.type === "string" && enumToExtend.enum) {
                const enumArray = enumToExtend.enum;
                t.choices.forEach((c) => {
                    if (c.type === "string" && c.enum) c.enum.forEach((e) => enumArray.push(e));
                });
            } else {
                t.choices.forEach((c) => choices.push(c));
            }
        } else if (t.type === "object" && t.properties && extended.type === "object" && extended.properties) {
            const { properties } = extended;
            for (const key of Object.keys(t.properties)) properties[key] = t.properties[key];
        } else {
            throw new Error("Bad $extend");
        }
    });

    if (!entryToExtend.functions) entryToExtend.functions = [];
    const { functions } = entryToExtend;
    entry.functions?.forEach((t) => functions.push(t));

    return VisitorAction.REMOVE;
}

export const applyExtensionNamespace: SchemaVisitorFactory = (namespace, namespaces) => {
    if (!namespace.isExtension) return null;

    const toExtend = namespaces.find((ns) => ns.entry.namespace === namespace.entry.namespace && !ns.isExtension);
    if (!toExtend) throw new Error(`Missing namespace to extend: ${namespace.entry.namespace}`);
    toExtend.appendComments(namespace.comments);
    return {
        name: "applying namespace extensions",
        visitors: {
            Namespace: (t) => visitor(t, toExtend.entry),
        },
    };
};
