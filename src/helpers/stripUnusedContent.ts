import { SchemaProperty, SchemaEntry } from "./types";


function stripUnusedPropertiesFromProperty(val: SchemaProperty) {
    if (val.type === 'object') {
        stripUnusedPropertiesMap(val.properties);
        val.functions = stripUnusedProperties(val.functions);
        val.events = stripUnusedProperties(val.events);
    } else if (val.type === 'choices' && val.choices)
        val.choices = stripUnusedProperties(val.choices);
    if (val.type === 'function')
        val.parameters = stripUnusedProperties(val.parameters);
    if (val.$ref === 'contextMenusInternal.OnClickData')
        val.$ref = 'OnClickData';
    else if (val.$ref === 'UnrecognizedProperty')
        val.$ref = 'any';
    else if (val.$ref === 'PersistentBackgroundProperty')
        val.$ref = 'boolean';
}

function stripUnusedProperties<T extends SchemaProperty>(values?: T[]) {
    if (values) {
        values = values.filter((v) => !v.unsupported && !v.deprecated);
        values.forEach(stripUnusedPropertiesFromProperty);
    }
    return values;
}

function stripUnusedPropertiesMap(map?: { [s: string]: SchemaProperty }) {
    if (map) {
        for (const key in map) {
            const val = map[key];
            if (val.unsupported || val.deprecated)
                delete map[key];
            else
                stripUnusedPropertiesFromProperty(val);
        }
    }
}

export function stripUnusedContent(value: SchemaEntry) {
    value.events = stripUnusedProperties(value.events);
    value.functions = stripUnusedProperties(value.functions);
    value.types = stripUnusedProperties(value.types);
    stripUnusedPropertiesMap(value.properties);
}
