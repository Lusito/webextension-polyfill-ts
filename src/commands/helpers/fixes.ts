import { ImportedNamespaces } from "./importNormalized";
import { workMap, workArray, readJsonFile } from './utils';
import { SchemaProperty, SchemaObjectProperty } from './types';
import { assertValidOjectKeys, assertType } from './assert';
import { stripUnusedContent } from "./stripUnusedContent";
import { extractInlineContent } from "./extractInlineContent";
import { getParameters } from "./getType";

interface Fix {
    name: string;
    apply: (namespaces: ImportedNamespaces) => void;
}

function fixPropertyType(prop: SchemaProperty) {
    if ((prop as any).choices)
        prop.type = 'choices';
    else if ((prop as any).properties)
        prop.type = 'object';
    else if (prop.hasOwnProperty('value'))
        prop.type = 'value';
    if (prop.type === 'array' && prop.items)
        fixPropertyType(prop.items);
    else if (prop.type === 'function') {
        workArray(prop.parameters, fixPropertyType);
        if (prop.returns)
            fixPropertyType(prop.returns);
    } else if (prop.type === 'object') {
        workMap(prop.properties, fixPropertyType);
        workArray(prop.functions, fixPropertyType);
    }
}

export const fixes: Fix[] = [{
    name: 'removing unused namespaces',
    apply: (namespaces) => {
        delete namespaces.namespaces.test;
    }
}, {
    name: 'correcting types',
    apply: (namespaces) => {
        workMap(namespaces.namespaces, (namespace) => {
            workArray(namespace.entry.types, fixPropertyType);
            workArray(namespace.entry.functions, (f) => {
                if (f.parameters)
                    f.parameters.forEach(fixPropertyType);
                if (f.returns)
                    fixPropertyType(f.returns);
            });
            workMap(namespace.entry.properties, fixPropertyType);
        });
    }
}, {
    name: 'applying namespace extensions',
    apply: (namespaces) => {
        namespaces.namespaceExtensions.forEach((e) => {
            const namespace = namespaces.namespaces[e.entry.namespace];
            if (!namespace)
                throw 'Missing namespace to extend: ' + e.entry.namespace;
            const types = namespace.entry.types;
            if (!types)
                throw 'Extended namespace does not have types';
            namespace.appendComments(e.comments);
            workArray(e.entry.types, (t) => {
                if (!t.$extend) {
                    fixPropertyType(t);
                    types.push(t);
                    return;
                }

                const extended = types.find((t2) => t2.id === t.$extend);
                if (!extended)
                    throw 'Could not find type to extend: ' + t.$extend;

                if ((t as any).choices) {
                    assertValidOjectKeys(t, ['$extend', 'choices']);
                    t.type = 'choices';
                } else if ((t as any).properties) {
                    assertValidOjectKeys(t, ['$extend', 'properties']);
                    t.type = 'object';
                } else {
                    throw 'Unknown extension type ' + t.$extend;
                }

                if (t.type === 'choices' && t.choices && extended.type === 'choices' && extended.choices) {
                    const choices = extended.choices;
                    t.choices.forEach((c) => choices.push(c));
                } else if (t.type === 'object' && t.properties && extended.type === 'object' && extended.properties) {
                    const properties = extended.properties;
                    for (const key in t.properties)
                        properties[key] = t.properties[key];
                } else {
                    throw 'Bad $extend';
                }
            });
        });
    }
}, {
    name: 'applying manual json fixes',
    apply: (namespaces) => {
        const fixes = readJsonFile('./fixes.json');
        for (const path in fixes) {
            const parts = path.split('.');
            let base: any = namespaces.namespaces[parts[0]].entry;
            for (let i = 1; i < (parts.length - 1); i++) {
                const part = parts[i];
                if (part[0] === '$') {
                    const id = part.substr(1);
                    assertType(base, 'array');
                    base = base.find((e: any) => e.id === id);
                    assertType(base, 'array', 'object');
                } else if (part[0] === '%') {
                    const name = part.substr(1);
                    assertType(base, 'array');
                    base = base.find((e: any) => e.name === name);
                    assertType(base, 'array', 'object');
                    assertType(base, 'array', 'object');
                } else if (part[0] === '#') {
                    assertType(base, 'array');
                    const index = parseInt(part.substr(1));
                    if (index >= base.length || index < 0)
                        throw 'Index out of bounds';
                    base = base[index];
                    assertType(base, 'array', 'object');
                } else {
                    base = base[part];
                    assertType(base, 'array', 'object');
                }
            }
            const lastPart = parts[parts.length - 1];
            const value = fixes[path];
            if (lastPart === '+[]') {
                assertType(base, 'array');
                assertType(value, 'array');
                value.forEach((e: any) => base.push(e));
            } else {
                base[lastPart] = value;
            }
        }
    }
}, {
    name: 'extracting inline content',
    apply: (namespaces) => {
        workMap(namespaces.namespaces, (ns) => extractInlineContent(ns.entry));
    }
}, {
    name: 'remove unsupported and deprecated content',
    apply: (namespaces) => {
        workMap(namespaces.namespaces, (ns) => stripUnusedContent(ns.entry));
    }
}, {
    name: 'extend events if needed',
    apply: (namespaces) => {
        const types = namespaces.namespaces.events.entry.types;
        if (!types)
            throw 'Missing events types';
        const eventType = types.find((t) => t.id === 'Event');
        if (!eventType)
            throw 'Missing Events.Event';
        if (eventType.type !== 'object')
            throw 'Events.Event should be object';
        const eventFunctions = eventType.functions;
        if (!eventFunctions)
            throw 'Events.Event.functions missing';

        const addListener = eventFunctions.find((f) => f.name === 'addListener');
        if (!addListener)
            throw 'Missing addListener in Event type';
        workMap(namespaces.namespaces, (ns) => {
            workArray(ns.entry.events, (e) => {
                if (e.extraParameters) {
                    const id = e.name + 'Event';
                    const extendedAddListener = JSON.parse(JSON.stringify(addListener));
                    const extended: SchemaObjectProperty = {
                        id,
                        type: "object",
                        additionalProperties: { $ref: 'Events.Event<(' + getParameters(e.parameters, false) + ') => void>', type: 'ref' },
                        description: e.description,
                        functions: [extendedAddListener]
                    };
                    const params = extendedAddListener.parameters;
                    if (!params)
                        throw 'Missing addListener.parameters in Event type';
                    params[0].type = '(' + getParameters(e.parameters, false) + ') => void';
                    e.extraParameters.forEach((p) => {
                        p.optional = true;
                        params.push(p);
                    });
                    e.$extend = id;
                    delete e.parameters;
                    if (!ns.entry.types)
                        ns.entry.types = [];
                    ns.entry.types.push(extended);
                }
            });
        });
    }
}];
//Fixme: copy permissions from ns to subns
