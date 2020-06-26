import type { SchemaProperty } from "./types";

export type ObjectTypes = "null" | "string" | "object" | "array" | "number" | "boolean" | "undefined";

export enum ErrorMessage {
    MISSING_NAME = "Gotta have a name!",
    UNSUPPORTED = "Should not happen: unsupported or deprecated",
}

function getType(json: any): ObjectTypes {
    if (json === null) return "null";
    if (Array.isArray(json)) return "array";
    return typeof json as ObjectTypes;
}

export function assertEqual(a: any, b: any) {
    if (a !== b) throw new Error(`'${JSON.stringify(a)}' is not ${JSON.stringify(b)}`);
}

export function assertSupported(prop: SchemaProperty) {
    if (prop.deprecated || prop.unsupported) throw ErrorMessage.UNSUPPORTED;
}

export function assertOneOfX(value: any, validValues: any[]) {
    if (!validValues.includes(value)) throw new Error(`'${value}' is not one of ${JSON.stringify(validValues)}`);
}

export function assertOneOf(value: any, ...validValues: any[]) {
    assertOneOfX(value, validValues);
}

export function assertType(json: any, ...validTypes: ObjectTypes[]) {
    assertOneOfX(getType(json), validTypes);
}

export function assertArray(json: any, callback: (json: any) => void) {
    json?.forEach(callback);
}

export function assertMap(json: any, callback: (json: any) => void) {
    if (json) {
        for (const key of Object.keys(json)) callback(json[key]);
    }
}

export function assertValidOjectKeys(json: any, keys: string[]) {
    const names = Object.keys(json);
    for (const name of names) assertOneOfX(name, keys);
}
