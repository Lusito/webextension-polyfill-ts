#! /usr/bin/env node
/* eslint-disable max-classes-per-file */
import fs from "fs";

import { readSchemaFile } from "./helpers/readSchemaFile";
import { assertType, assertOneOf, assertArray, assertValidOjectKeys, assertEqual, assertMap } from "./helpers/assert";

const typeById: { [s: string]: any } = {};

class SchemaBasePropertyValidator {
    public static getValidKeys() {
        return [
            "id",
            "name",
            "$extend",
            "description",
            "optional",
            "unsupported",
            "deprecated",
            "permissions",
            "allowedContexts",
            "onError",
        ];
    }

    public static validate(json: any) {
        assertType(json, "object");
        assertType(json.id, "string", "undefined");
        assertType(json.name, "string", "undefined");
        assertType(json.$extend, "string", "undefined");
        assertType(json.description, "string", "undefined");
        assertOneOf(json.optional, true, false, "true", "false", "omit-key-if-missing", undefined);
        assertOneOf(json.unsupported, true, false, "true", "false", undefined);
        assertType(json.deprecated, "boolean", "string", "undefined");
        assertType(json.permissions, "array", "undefined");
        assertArray(json.permissions, (s) => assertType(s, "string"));
        assertType(json.allowedContexts, "array", "undefined");
        assertArray(json.allowedContexts, (s) => assertType(s, "string"));
        assertOneOf(json.onError, "warn", undefined);
    }
}

let currentNamespace = "";
function getReducedRefJson(json: any, attr: string) {
    const id = json[attr];
    assertType(id, "string");
    const normalizedId = id.indexOf(".") >= 0 ? id : `${currentNamespace}.${id}`;
    const inherit = typeById[normalizedId];
    if (!inherit) throw new Error(`Could not find id '${normalizedId}' in registry`);
    const result = { ...json };
    if (inherit.choices) result.choices = inherit.choices;
    else if (inherit.type) result.type = inherit.type;
    delete result[attr];
    return result;
}

function validateSchemaProperty(json: any) {
    assertType(json, "object");
    if (json.unsupported) return;
    if (json.$ref) json = getReducedRefJson(json, "$ref");
    else if (json.$extend) json = getReducedRefJson(json, "$extend");

    if (json.choices) SchemaChoicesPropertyValidator.validate(json);
    else if (json.value) SchemaValuePropertyValidator.validate(json);
    else {
        switch (json.type) {
            case "number":
            case "integer":
                return SchemaNumberPropertyValidator.validate(json);
            case "string":
                return SchemaStringPropertyValidator.validate(json);
            case "array":
                return SchemaArrayPropertyValidator.validate(json);
            case "object":
                return SchemaObjectPropertyValidator.validate(json);
            case "boolean":
                return SchemaBooleanPropertyValidator.validate(json);
            case "function":
                return SchemaFunctionPropertyValidator.validate(json);
            case "any":
                return SchemaAnyPropertyValidator.validate(json);
            case "null":
                return SchemaNullPropertyValidator.validate(json);
            case "ref":
                return SchemaRefPropertyValidator.validate(json);
            default:
                throw new Error(`unknown type: ${json.type}`);
        }
    }
}

function validateSchemaPropertyWithoutExtend(json: any) {
    validateSchemaProperty(json);
    if (json.$extend) throw new Error("Only types may contain $extend");
}

class SchemaChoicesPropertyValidator extends SchemaBasePropertyValidator {
    public static getValidKeys() {
        return super.getValidKeys().concat(["choices", "preprocess"]);
    }

    public static validate(json: any) {
        super.validate(json);
        assertValidOjectKeys(json, this.getValidKeys());
        assertType(json.choices, "array", "undefined");
        assertArray(json.allowedContexts, validateSchemaPropertyWithoutExtend);
    }
}

class SchemaAnyPropertyValidator extends SchemaBasePropertyValidator {
    public static getValidKeys() {
        return super.getValidKeys().concat(["type"]);
    }

    public static validate(json: any) {
        super.validate(json);
        assertValidOjectKeys(json, this.getValidKeys());
        assertEqual(json.type, "any");
    }
}

class SchemaRefPropertyValidator extends SchemaBasePropertyValidator {
    public static getValidKeys() {
        return super.getValidKeys().concat(["type"]);
    }

    public static validate(json: any) {
        super.validate(json);
        assertValidOjectKeys(json, this.getValidKeys());
        assertType(json.$type, "object");
    }
}

class SchemaNullPropertyValidator extends SchemaBasePropertyValidator {
    public static getValidKeys() {
        return super.getValidKeys().concat(["type"]);
    }

    public static validate(json: any) {
        super.validate(json);
        assertValidOjectKeys(json, this.getValidKeys());
        assertEqual(json.type, "null");
    }
}

class SchemaValuePropertyValidator extends SchemaBasePropertyValidator {
    public static getValidKeys() {
        return super.getValidKeys().concat(["value"]);
    }

    public static validate(json: any) {
        super.validate(json);
        assertValidOjectKeys(json, this.getValidKeys());
        if (typeof json.value === "undefined") throw new Error("Value expected");
    }
}

function validateEnumValue(json: any) {
    assertType(json, "string", "object", "undefined");
    if (typeof json === "object") {
        assertValidOjectKeys(json, ["name", "description"]);
        assertType(json.name, "string");
        assertType(json.description, "string");
    }
}

class SchemaStringPropertyValidator extends SchemaBasePropertyValidator {
    public static getValidKeys() {
        return super
            .getValidKeys()
            .concat([
                "type",
                "preprocess",
                "postprocess",
                "enum",
                "minLength",
                "maxLength",
                "pattern",
                "format",
                "default",
            ]);
    }

    public static validate(json: any) {
        super.validate(json);
        assertValidOjectKeys(json, this.getValidKeys());
        assertEqual(json.type, "string");
        assertOneOf(json.preprocess, "localize", undefined);
        assertType(json.postprocess, "string", "undefined");
        assertType(json.enum, "array", "undefined");
        assertArray(json.enum, (e) => validateEnumValue(e));
        assertType(json.minLength, "number", "undefined");
        assertType(json.maxLength, "number", "undefined");
        assertType(json.pattern, "string", "undefined");
        assertType(json.format, "string", "undefined");
        assertType(json.default, "string", "undefined");
    }
}

class SchemaObjectPropertyValidator extends SchemaBasePropertyValidator {
    public static getValidKeys() {
        return super
            .getValidKeys()
            .concat([
                "type",
                "properties",
                "additionalProperties",
                "patternProperties",
                "$import",
                "isInstanceOf",
                "postprocess",
                "functions",
                "events",
                "default",
            ]);
    }

    public static validate(json: any) {
        super.validate(json);
        assertValidOjectKeys(json, this.getValidKeys());
        assertEqual(json.type, "object");
        assertType(json.properties, "object", "undefined");
        assertMap(json.properties, validateSchemaPropertyWithoutExtend);
        assertType(json.additionalProperties, "object", "boolean", "undefined");
        if (typeof json.additionalProperties === "object")
            validateSchemaPropertyWithoutExtend(json.additionalProperties);
        assertType(json.patternProperties, "object", "undefined");
        assertMap(json.patternProperties, validateSchemaPropertyWithoutExtend);
        assertType(json.$import, "string", "undefined");
        assertType(json.isInstanceOf, "string", "undefined");
        assertOneOf(json.postprocess, "convertImageDataToURL", undefined);
        assertType(json.functions, "array", "undefined");
        assertArray(json.functions, (e) => SchemaFunctionPropertyValidator.validate(e));
        assertType(json.events, "array", "undefined");
        assertArray(json.events, (e) => SchemaFunctionPropertyValidator.validate(e));
        assertType(json.default, "object", "undefined");
    }
}

class SchemaNumberPropertyValidator extends SchemaBasePropertyValidator {
    public static getValidKeys() {
        return super.getValidKeys().concat(["type", "minimum", "maximum", "default"]);
    }

    public static validate(json: any) {
        super.validate(json);
        assertValidOjectKeys(json, this.getValidKeys());
        assertOneOf(json.type, "integer", "number");
        assertType(json.minimum, "number", "undefined");
        assertType(json.maximum, "number", "undefined");
        assertType(json.default, "number", "undefined");
    }
}

class SchemaBooleanPropertyValidator extends SchemaBasePropertyValidator {
    public static getValidKeys() {
        return super.getValidKeys().concat(["type", "default"]);
    }

    public static validate(json: any) {
        super.validate(json);
        assertValidOjectKeys(json, this.getValidKeys());
        assertEqual(json.type, "boolean");
        assertType(json.default, "boolean", "undefined");
    }
}

class SchemaArrayPropertyValidator extends SchemaBasePropertyValidator {
    public static getValidKeys() {
        return super.getValidKeys().concat(["type", "items", "minItems", "maxItems", "default"]);
    }

    public static validate(json: any) {
        super.validate(json);
        assertValidOjectKeys(json, this.getValidKeys());
        assertEqual(json.type, "array");
        assertType(json.items, "object", "undefined");
        if (json.items) validateSchemaPropertyWithoutExtend(json.items);
        assertType(json.minItems, "number", "undefined");
        assertType(json.maxItems, "number", "undefined");
        assertType(json.default, "array", "undefined");
        if (json.default) assertEqual(json.default.length, 0);
    }
}

class SchemaFunctionPropertyValidator extends SchemaBasePropertyValidator {
    public static getValidKeys() {
        return super
            .getValidKeys()
            .concat([
                "type",
                "async",
                "requireUserInput",
                "parameters",
                "extraParameters",
                "returns",
                "allowAmbiguousOptionalArguments",
                "filters",
            ]);
    }

    public static validate(json: any) {
        super.validate(json);
        assertValidOjectKeys(json, this.getValidKeys());
        assertOneOf(json.type, "function", undefined); // hack: sometimes not set.
        assertOneOf(json.async, "callback", "responseCallback", true, false, undefined);
        assertType(json.requireUserInput, "boolean", "undefined");
        assertType(json.parameters, "array", "undefined");
        assertArray(json.parameters, validateSchemaPropertyWithoutExtend);
        assertType(json.extraParameters, "array", "undefined");
        assertArray(json.extraParameters, validateSchemaPropertyWithoutExtend);
        assertType(json.returns, "object", "undefined");
        if (json.returns) validateSchemaPropertyWithoutExtend(json.returns);
        assertType(json.allowAmbiguousOptionalArguments, "boolean", "undefined");
        assertType(json.filters, "array", "undefined");
        assertArray(json.filters, validateSchemaPropertyWithoutExtend);
    }
}

class SchemaEntryValidator {
    public static getValidKeys() {
        return [
            "namespace",
            "description",
            "permissions",
            "types",
            "functions",
            "events",
            "properties",
            "allowedContexts",
            "defaultContexts",
            "nocompile",
            "$import",
        ];
    }

    public static validate(json: any) {
        assertType(json, "object");
        assertType(json.namespace, "string");
        currentNamespace = json.namespace;
        assertType(json.description, "string", "undefined");
        assertType(json.permissions, "array", "undefined");
        assertArray(json.permissions, (e) => assertType(e, "string"));
        assertType(json.types, "array", "undefined");
        assertArray(json.types, validateSchemaProperty);

        assertType(json.functions, "array", "undefined");
        assertArray(json.functions, (e) => SchemaFunctionPropertyValidator.validate(e));
        assertType(json.events, "array", "undefined");
        assertArray(json.events, (e) => SchemaFunctionPropertyValidator.validate(e));

        assertType(json.properties, "object", "undefined");
        assertMap(json.properties, validateSchemaPropertyWithoutExtend);

        assertType(json.allowedContexts, "array", "undefined");
        assertArray(json.allowedContexts, (e) => assertType(e, "string"));

        assertType(json.defaultContexts, "array", "undefined");
        assertArray(json.defaultContexts, (e) => assertType(e, "string"));
        assertType(json.nocompile, "boolean", "undefined");
        assertType(json.$import, "string", "undefined");
    }
}

function validateJson(data: ReturnType<typeof readSchemaFile>) {
    try {
        console.log(data.file);
        assertArray(data.json, SchemaEntryValidator.validate);
    } catch (e) {
        console.error(`Error reading ${data.file}: `, e);
        throw e;
    }
}

function updateTypeById(data: ReturnType<typeof readSchemaFile>) {
    data.json.forEach((e: any) => {
        if (e.types)
            e.types.forEach((t: any) => {
                if (t.id) typeById[`${e.namespace}.${t.id}`] = t;
            });
    });
}

const files = fs.readdirSync("./schemas").map(readSchemaFile);
files.forEach(updateTypeById);
files.forEach(validateJson);
console.log("--------------------");
console.log("All files are valid!");
