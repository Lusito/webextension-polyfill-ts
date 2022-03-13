#! /usr/bin/env node
/* eslint-disable max-classes-per-file */
import { readAllSchemaFiles, SchemaFileData } from "./helpers/readSchemaFile";
import { Assert } from "./helpers/assert";
import { workArray, workMap } from "./helpers/utils";

const typeById: Record<string, any> = {};

class SchemaBasePropertyValidator {
    public static getValidKeys() {
        return [
            "id",
            "name",
            "$extend",
            "description",
            "optional",
            "skipableParameter",
            "unsupported",
            "deprecated",
            "permissions",
            "allowedContexts",
            "onError",
            "inline_doc",
            "nodoc",
            "preprocess",
            "postprocess",
            "min_manifest_version",
            "max_manifest_version",
        ];
    }

    public static validate(json: any) {
        const assert = new Assert("SchemaBasePropertyValidator");
        assert.typeOf(json, "object");
        assert.typeOf(json.id, "string", "undefined");
        assert.typeOf(json.name, "string", "undefined");
        assert.typeOf(json.$extend, "string", "undefined");
        assert.typeOf(json.description, "string", "undefined");
        assert.oneOf(json.optional, true, false, "true", "false", "omit-key-if-missing", undefined);
        assert.typeOf(json.skipableParameter, "boolean", "undefined");
        assert.oneOf(json.unsupported, true, false, "true", "false", undefined);
        assert.typeOf(json.deprecated, "boolean", "string", "undefined");
        assert.typeOf(json.permissions, "array", "undefined");
        workArray(json.permissions, (s) => assert.typeOf(s, "string"));
        assert.typeOf(json.allowedContexts, "array", "undefined");
        workArray(json.allowedContexts, (s) => assert.typeOf(s, "string"));
        assert.oneOf(json.onError, "warn", undefined);
        assert.oneOf(json.inline_doc, true, false, "true", "false", undefined);
        assert.oneOf(json.nodoc, true, false, "true", "false", undefined);
        assert.typeOf(json.preprocess, "string", "undefined");
        assert.typeOf(json.postprocess, "string", "undefined");
        assert.typeOf(json.min_manifest_version, "number", "undefined");
        assert.typeOf(json.max_manifest_version, "number", "undefined");
    }
}

let currentNamespace = "";
function getReducedRefJson(assert: Assert, json: any, attr: string) {
    const id = json[attr];
    assert.typeOf(id, "string");
    const normalizedId = id.indexOf(".") >= 0 ? id : `${currentNamespace}.${id}`;
    const inherit = typeById[normalizedId];
    if (!inherit) throw new Error(`Could not find id '${normalizedId}' in registry`);
    const result = { ...json };
    if (inherit.choices) result.choices = inherit.choices;
    else if (inherit.type) result.type = inherit.type;
    delete result[attr];
    return result;
}

function validateSchemaProperty(assert: Assert, json: any) {
    assert.typeOf(json, "object");
    if (json.unsupported) return;
    if (json.$ref) json = getReducedRefJson(assert, json, "$ref");
    else if (json.$extend) json = getReducedRefJson(assert, json, "$extend");

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
            case "binary":
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

function validateSchemaPropertyWithoutExtend(assert: Assert, json: any) {
    validateSchemaProperty(assert, json);
    if (json.$extend) assert.fail("Only types may contain $extend");
}

class SchemaChoicesPropertyValidator extends SchemaBasePropertyValidator {
    public static getValidKeys() {
        return super.getValidKeys().concat(["choices", "preprocess", "default"]);
    }

    public static validate(json: any) {
        super.validate(json);
        const assert = new Assert("SchemaChoicesPropertyValidator");
        assert.validOjectKeys(json, this.getValidKeys());
        assert.typeOf(json.choices, "array", "undefined");
        workArray(json.allowedContexts, (e) => validateSchemaPropertyWithoutExtend(assert, e));
    }
}

class SchemaAnyPropertyValidator extends SchemaBasePropertyValidator {
    public static getValidKeys() {
        return super.getValidKeys().concat(["type"]);
    }

    public static validate(json: any) {
        super.validate(json);
        const assert = new Assert("SchemaAnyPropertyValidator");
        assert.validOjectKeys(json, this.getValidKeys());
        assert.equal(json.type, "any");
    }
}

class SchemaRefPropertyValidator extends SchemaBasePropertyValidator {
    public static getValidKeys() {
        return super.getValidKeys().concat(["type"]);
    }

    public static validate(json: any) {
        super.validate(json);
        const assert = new Assert("SchemaRefPropertyValidator");
        assert.validOjectKeys(json, this.getValidKeys());
        assert.typeOf(json.$type, "object");
    }
}

class SchemaNullPropertyValidator extends SchemaBasePropertyValidator {
    public static getValidKeys() {
        return super.getValidKeys().concat(["type"]);
    }

    public static validate(json: any) {
        super.validate(json);
        const assert = new Assert("SchemaNullPropertyValidator");
        assert.validOjectKeys(json, this.getValidKeys());
        assert.equal(json.type, "null");
    }
}

class SchemaValuePropertyValidator extends SchemaBasePropertyValidator {
    public static getValidKeys() {
        return super.getValidKeys().concat(["value"]);
    }

    public static validate(json: any) {
        super.validate(json);
        const assert = new Assert("SchemaValuePropertyValidator");
        assert.validOjectKeys(json, this.getValidKeys());
        if (typeof json.value === "undefined") throw new Error("Value expected");
    }
}

class SchemaStringPropertyValidator extends SchemaBasePropertyValidator {
    public static getValidKeys() {
        return super.getValidKeys().concat(["type", "enum", "minLength", "maxLength", "pattern", "format", "default"]);
    }

    public static validate(json: any) {
        super.validate(json);
        const assert = new Assert("SchemaStringPropertyValidator");
        assert.validOjectKeys(json, this.getValidKeys());
        assert.equal(json.type, "string");
        assert.typeOf(json.enum, "array", "undefined");
        workArray(json.enum, assert.enumValue);
        assert.typeOf(json.minLength, "number", "undefined");
        assert.typeOf(json.maxLength, "number", "undefined");
        assert.typeOf(json.pattern, "string", "undefined");
        assert.typeOf(json.format, "string", "undefined");
        assert.typeOf(json.default, "string", "undefined");
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
                "functions",
                "events",
                "default",
            ]);
    }

    public static validate(json: any) {
        super.validate(json);
        const assert = new Assert("SchemaObjectPropertyValidator");
        assert.validOjectKeys(json, this.getValidKeys());
        assert.oneOf(json.type, "object", "binary");
        assert.typeOf(json.properties, "object", "undefined");
        workMap(json.properties, (e) => validateSchemaPropertyWithoutExtend(assert, e));
        assert.typeOf(json.additionalProperties, "object", "boolean", "undefined");
        if (typeof json.additionalProperties === "object")
            validateSchemaPropertyWithoutExtend(assert, json.additionalProperties);
        assert.typeOf(json.patternProperties, "object", "undefined");
        workMap(json.patternProperties, (e) => validateSchemaPropertyWithoutExtend(assert, e));
        assert.typeOf(json.$import, "string", "undefined");
        assert.typeOf(json.isInstanceOf, "string", "undefined");
        assert.typeOf(json.functions, "array", "undefined");
        workArray(json.functions, (e) => SchemaFunctionPropertyValidator.validate(e));
        assert.typeOf(json.events, "array", "undefined");
        workArray(json.events, (e) => SchemaFunctionPropertyValidator.validate(e));
        assert.typeOf(json.default, "object", "undefined");
    }
}

class SchemaNumberPropertyValidator extends SchemaBasePropertyValidator {
    public static getValidKeys() {
        return super.getValidKeys().concat(["type", "minimum", "maximum", "default"]);
    }

    public static validate(json: any) {
        super.validate(json);
        const assert = new Assert("SchemaNumberPropertyValidator");
        assert.validOjectKeys(json, this.getValidKeys());
        assert.oneOf(json.type, "integer", "number");
        assert.typeOf(json.minimum, "number", "undefined");
        assert.typeOf(json.maximum, "number", "undefined");
        assert.typeOf(json.default, "number", "undefined");
    }
}

class SchemaBooleanPropertyValidator extends SchemaBasePropertyValidator {
    public static getValidKeys() {
        return super.getValidKeys().concat(["type", "default", "enum"]);
    }

    public static validate(json: any) {
        super.validate(json);
        const assert = new Assert("SchemaBooleanPropertyValidator");
        assert.validOjectKeys(json, this.getValidKeys());
        assert.equal(json.type, "boolean");
        assert.typeOf(json.default, "boolean", "undefined");
        assert.typeOf(json.enum, "array", "undefined");
        json.enum?.forEach((value: any) => assert.typeOf(value, "boolean"));
    }
}

class SchemaArrayPropertyValidator extends SchemaBasePropertyValidator {
    public static getValidKeys() {
        return super.getValidKeys().concat(["type", "items", "minItems", "maxItems", "default"]);
    }

    public static validate(json: any) {
        super.validate(json);
        const assert = new Assert("SchemaArrayPropertyValidator");
        assert.validOjectKeys(json, this.getValidKeys());
        assert.equal(json.type, "array");
        assert.typeOf(json.items, "object", "undefined");
        if (json.items) validateSchemaPropertyWithoutExtend(assert, json.items);
        assert.typeOf(json.minItems, "number", "undefined");
        assert.typeOf(json.maxItems, "number", "undefined");
        assert.typeOf(json.default, "array", "undefined");
        if (json.default) assert.equal(json.default.length, 0);
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
                "allowCrossOriginArguments",
                "filters",
                "options",
            ]);
    }

    public static validate(json: any) {
        super.validate(json);
        const assert = new Assert("SchemaFunctionPropertyValidator");
        assert.validOjectKeys(json, this.getValidKeys());
        assert.oneOf(json.type, "function", undefined); // hack: sometimes not set.
        assert.oneOf(json.async, "callback", "responseCallback", true, false, undefined);
        assert.typeOf(json.requireUserInput, "boolean", "undefined");
        assert.typeOf(json.parameters, "array", "undefined");
        workArray(json.parameters, (e) => validateSchemaPropertyWithoutExtend(assert, e));
        assert.typeOf(json.extraParameters, "array", "undefined");
        workArray(json.extraParameters, (e) => validateSchemaPropertyWithoutExtend(assert, e));
        assert.typeOf(json.returns, "object", "undefined");
        if (json.returns) validateSchemaPropertyWithoutExtend(assert, json.returns);
        assert.typeOf(json.allowAmbiguousOptionalArguments, "boolean", "undefined");
        assert.typeOf(json.allowCrossOriginArguments, "boolean", "undefined");
        assert.typeOf(json.filters, "array", "undefined");
        workArray(json.filters, (e) => validateSchemaPropertyWithoutExtend(assert, e));
        assert.typeOf(json.options, "object", "undefined");
        if (json.options) {
            assert.validOjectKeys(json.options, ["supportsListeners", "supportsRules", "conditions", "actions"]);
            assert.typeOf(json.options.supportsListeners, "boolean", "undefined");
            assert.typeOf(json.options.supportsRules, "boolean", "undefined");
            assert.typeOf(json.options.conditions, "array", "undefined");
            assert.typeOf(json.options.actions, "array", "undefined");
            workArray(json.options.conditions, (s) => assert.typeOf(s, "string", "undefined"));
            workArray(json.options.actions, (s) => assert.typeOf(s, "string", "undefined"));
        }
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
        const assert = new Assert("SchemaEntryValidator");
        assert.typeOf(json, "object");
        assert.typeOf(json.namespace, "string");
        currentNamespace = json.namespace;
        assert.typeOf(json.description, "string", "undefined");
        assert.typeOf(json.permissions, "array", "undefined");
        workArray(json.permissions, (e) => assert.typeOf(e, "string"));
        assert.typeOf(json.types, "array", "undefined");
        workArray(json.types, (e) => validateSchemaProperty(assert, e));

        assert.typeOf(json.functions, "array", "undefined");
        workArray(json.functions, (e) => SchemaFunctionPropertyValidator.validate(e));
        assert.typeOf(json.events, "array", "undefined");
        workArray(json.events, (e) => SchemaFunctionPropertyValidator.validate(e));

        assert.typeOf(json.properties, "object", "undefined");
        workMap(json.properties, (e) => validateSchemaPropertyWithoutExtend(assert, e));

        assert.typeOf(json.allowedContexts, "array", "undefined");
        workArray(json.allowedContexts, (e) => assert.typeOf(e, "string"));

        assert.typeOf(json.defaultContexts, "array", "undefined");
        workArray(json.defaultContexts, (e) => assert.typeOf(e, "string"));
        assert.typeOf(json.nocompile, "boolean", "undefined");
        assert.typeOf(json.$import, "string", "undefined");
    }
}

function validateJson(data: SchemaFileData) {
    try {
        console.log(data.file);
        workArray(data.json, SchemaEntryValidator.validate);
    } catch (e) {
        console.error(`Error reading ${data.file}: `, e);
        throw e;
    }
}

function updateTypeById(data: SchemaFileData) {
    data.json.forEach((e: any) => {
        if (e.types)
            e.types.forEach((t: any) => {
                if (t.id) typeById[`${e.namespace}.${t.id}`] = t;
            });
    });
}

const files = readAllSchemaFiles();
files.forEach(updateTypeById);
files.forEach(validateJson);
console.log("--------------------");
console.log("All files are valid!");
