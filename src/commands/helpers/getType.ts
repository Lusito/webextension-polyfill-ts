import { SchemaProperty, EnumValue } from "./types";
import { ErrorMessage } from "./assert";
import { filterUnique } from "./utils";


let currentTypeId: string | undefined;

export function setCurrentTypeId(id?: string) {
    currentTypeId = id;
}

const typeMap: { [s: string]: string } = {
    integer: 'number',
    function: 'Function'
};

export function getUnionType(list: SchemaProperty[]) {
    return list.map(getType).filter(filterUnique).join(' | ');
}

export function getEnumType(list: EnumValue[]) {
    return list.map((e: any) => {
        if (e === undefined)
            return 'undefined';
        if (typeof (e) === 'string')
            return JSON.stringify(e);
        if (!e.name)
            throw ErrorMessage.MISSING_NAME;
        return JSON.stringify(e.name);
    }).join(' | ');
}
export function fixRef(ref: string) {
    if (ref.indexOf('.') >= 0)
        return ref[0].toUpperCase() + ref.substr(1);
    return ref;
}
export function getType(e: SchemaProperty): string {
    if (e.$ref === 'extensionTypes.Date')
        return 'ExtensionTypes.DateType';
    if (e.type === 'object' && e.isInstanceOf)
        return e.isInstanceOf;
    let propType = typeMap[e.type] || e.type;
    if (e.$ref)
        propType = fixRef(e.$ref);
    if (propType === 'Function' && currentTypeId === 'Event')
        propType = 'T';
    else if (e.type === 'function') {
        const returnType = e.returns ? getType(e.returns) : 'void';
        propType = '(' + getParameters(e.parameters, true) + ') => ' + returnType;
    }
    else if (e.type === 'array' && e.items) {
        if (e.items.type === 'choices' && e.items.choices)
            propType = getUnionType(e.items.choices);
        else {
            //Fixme:minItems, maxItems
            if (e.items.$ref)
                propType = fixRef(e.items.$ref);
            else if (e.items.type === 'object' && e.items.isInstanceOf)
                propType = e.items.isInstanceOf;
            else
                propType = typeMap[e.items.type] || e.items.type;
            if (e.minItems) {
                const items = [];
                for (let i = 0; i < e.minItems; i++)
                    items.push(propType);
                propType = '[' + items.join(', ') + ']';
            }
            else
                propType += '[]';
        }
    }
    else if (e.type === 'choices' && e.choices) {
        return getUnionType(e.choices);
    }
    else if (e.type === 'string' && e.enum) {
        return getEnumType(e.enum);
    }
    else if (e.type === 'value')
        return e.value;
    else if (e.type === 'object' && (!e.properties || Object.getOwnPropertyNames(e.properties).length === 0)
        && e.additionalProperties && e.additionalProperties !== true && e.additionalProperties.type === 'array'
        && e.additionalProperties.items && e.additionalProperties.items.type) {
        return `{[s:string]:${e.additionalProperties.items.type}}`;
    }
    return propType;
}


export function getProperty(name: string, prop: SchemaProperty, allowOptional: boolean) {
    let propType = getType(prop);
    const isOptional = (prop.optional && prop.optional !== 'false');
    if (!isOptional)
        return name + ': ' + propType;
    if (allowOptional)
        return name + '?' + ': ' + propType;
    if (propType.indexOf('=>') >= 0)
        propType = '(' + propType + ')';
    return name + ': ' + propType + ' | undefined';
}

export function getParameters(parameters: SchemaProperty[] | undefined, allowOptional: boolean) {
    if (!parameters)
        return '';
    return parameters.map((p) => getProperty(p.name || '', p, allowOptional)).join(', ');
}
