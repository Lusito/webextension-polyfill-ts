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

export class Assert {
    public readonly name: string;

    public constructor(name: string) {
        this.name = name;
    }

    public fail = (message: string) => {
        throw new Error(`${this.name}: ${message}`);
    };

    public equal = (a: any, b: any) => {
        if (a !== b) this.fail(`${this.name}: '${JSON.stringify(a)}' is not ${JSON.stringify(b)}`);
    };

    public supported = (prop: SchemaProperty) => {
        if (prop.deprecated || prop.unsupported) this.fail(ErrorMessage.UNSUPPORTED);
    };

    public oneOfX = (value: any, validValues: any[]) => {
        if (!validValues.includes(value)) this.fail(`'${value}' is not one of ${JSON.stringify(validValues)}`);
    };

    public oneOf = (value: any, ...validValues: any[]) => {
        this.oneOfX(value, validValues);
    };

    public typeOf = (json: any, ...validTypes: ObjectTypes[]) => {
        this.oneOfX(getType(json), validTypes);
    };

    public validOjectKeys = (json: any, allowedKeys: string[]) => {
        const actualKeys = Object.keys(json);
        for (const key of actualKeys) this.oneOfX(key, allowedKeys);
    };

    public enumValue = (json: any) => {
        this.typeOf(json, "string", "object", "undefined");
        if (typeof json === "object") {
            this.validOjectKeys(json, ["name", "description"]);
            this.typeOf(json.name, "string");
            this.typeOf(json.description, "string");
        }
    };
}
