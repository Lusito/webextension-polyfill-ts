import { SchemaProperty, EnumValue, SchemaFunctionProperty, SchemaArrayProperty } from "./types";
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
    else if (e.type === 'array') {
        propType = getArrayType(e);
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
        const type = getType(e.additionalProperties.items);
        return `{[s:string]:${type}}`;
    }
    else if (e.type === 'object' && e.additionalProperties && e.additionalProperties !== true && e.additionalProperties.$ref && !e.properties) {
        return `{[s:string]:${e.additionalProperties.$ref}}`;
    }
    else if (e.type === 'object' && e.patternProperties) {
        const names = Object.getOwnPropertyNames(e.patternProperties);
        if (names.length !== 1)
            throw new Error('Pattern properties expected to be 1 in length');
        const patternProp = e.patternProperties[names[0]];
        const type = getType(patternProp);
        return `{[s:string]:${type}}`;
    }
    return propType;
}

export function getReturnType(e: SchemaFunctionProperty): string {
    let returnType = e.returns ? getType(e.returns) : "void";
    if (e.returns && e.returns.optional)
        returnType += " | void";
    return returnType;
}

export interface MinimumTuple<T> extends Array<T> {
    0: T;
}

const test: Array<string> = ["", ""];

console.log(test);

export function getArrayType(e: SchemaArrayProperty): string {
    if (e.items) {
        let propType: string;
        if (e.items.type === 'choices' && e.items.choices)
            propType = getUnionType(e.items.choices);
        else {
            if (e.items.$ref)
                propType = fixRef(e.items.$ref);
            else if (e.items.type === 'object' && e.items.isInstanceOf)
                propType = e.items.isInstanceOf;
            else
                propType = typeMap[e.items.type] || e.items.type;
            // fixme: arrays of minimum size can't be done easily anymore since TypeScript 2.7.. find another way.
            // fixed size:
            if (e.minItems && e.maxItems === e.minItems)
                propType = '[' + Array(e.minItems).fill(propType).join(', ') + ']';
            else
                propType += '[]';
        }
        return propType;
    }
    return typeMap[e.type] || e.type;
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

function remainingParametersOptional(parameters: SchemaProperty[], after: number) {
    for (let i = after; i < parameters.length; i++) {
        if (!parameters[i].optional)
            return false;
    }
    return true;
}

export function getParameters(parameters: SchemaProperty[] | undefined, allowOptional: boolean) {
    if (!parameters)
        return '';
    return parameters.map((p, i) => getProperty(p.name || '', p, allowOptional && remainingParametersOptional(parameters, i + 1))).join(', ');
}
