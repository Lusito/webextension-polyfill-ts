import { assertType, assertOneOf, assertArray, assertValidOjectKeys, assertEqual, assertMap } from "./assert";

export const typeById: { [s: string]: any } = {};

export class SchemaBaseProperty {
    public id?: string;
    public name?: string;
    public $ref?: string;
    public $extend?: string;//only on namespace.types
    public description?: string;
    public optional?: boolean | 'true' | 'false' | 'omit-key-if-missing';
    public overloadFlag?: boolean; // for internal use only
    public unsupported?: boolean | 'true' | 'false';
    public deprecated?: boolean | string;
    public permissions?: string[];
    public allowedContexts?: string[];
    public onError?: 'warn';

    public static getValidKeys() {
        return [
            'id',
            'name',
            '$extend',
            'description',
            'optional',
            'unsupported',
            'deprecated',
            'permissions',
            'allowedContexts',
            'onError'
        ];
    }

    public static validate(json: any) {
        assertType(json, 'object');
        assertType(json.id, 'string', 'undefined');
        assertType(json.name, 'string', 'undefined');
        assertType(json.$extend, 'string', 'undefined');
        assertType(json.description, 'string', 'undefined');
        assertOneOf(json.optional, true, false, 'true', 'false', 'omit-key-if-missing', undefined);
        assertOneOf(json.unsupported, true, false, 'true', 'false', undefined);
        assertType(json.deprecated, 'boolean', 'string', 'undefined');
        assertType(json.permissions, 'array', 'undefined');
        assertArray(json.permissions, (s) => assertType(s, 'string'));
        assertType(json.allowedContexts, 'array', 'undefined');
        assertArray(json.allowedContexts, (s) => assertType(s, 'string'));
        assertOneOf(json.onError, 'warn', undefined);
    }
}

let currentNamespace = '';
function getReducedRefJson(json: any, attr: string) {
    let id = json[attr];
    assertType(id, 'string');
    //hacks due to incorrect data:
    id = id.replace('contextMenusInternal', 'menusInternal').replace('UnrecognizedProperty', 'manifest.UnrecognizedProperty');
    const normalizedId = id.indexOf('.') >= 0 ? id : (currentNamespace + '.' + id);
    const inherit = typeById[normalizedId];
    if (!inherit)
        throw new Error(`Could not find id '${normalizedId}' in registry`);
    const result = { ...json };
    if (inherit.choices)
        result.choices = inherit.choices;
    else if (inherit.type)
        result.type = inherit.type;
    delete result[attr];
    return result;
}

function validateSchemaProperty(json: any) {
    assertType(json, 'object');
    if (json.unsupported)
        return;
    if (json.$ref)
        json = getReducedRefJson(json, '$ref');
    else if (json.$extend)
        json = getReducedRefJson(json, '$extend');

    if (json.choices)
        SchemaChoicesProperty.validate(json);
    else if (json.value)
        SchemaValueProperty.validate(json);
    else {
        switch (json.type) {
            case 'number':
            case 'integer':
                return SchemaNumberProperty.validate(json);
            case 'string':
                return SchemaStringProperty.validate(json);
            case 'array':
                return SchemaArrayProperty.validate(json);
            case 'object':
                return SchemaObjectProperty.validate(json);
            case 'boolean':
                return SchemaBooleanProperty.validate(json);
            case 'function':
                return SchemaFunctionProperty.validate(json);
            case 'any':
                return SchemaAnyProperty.validate(json);
            case 'null':
                return SchemaNullProperty.validate(json);
            default:
                throw new Error('unknown type: ' + json.type);
        }
    }
}

function validateSchemaPropertyWithoutExtend(json: any) {
    validateSchemaProperty(json);
    if (json.$extend)
        throw new Error('Only types may contain $extend');
}

export class SchemaChoicesProperty extends SchemaBaseProperty {
    public type: 'choices' = 'choices'; //fixme
    public choices?: SchemaProperty[];
    public preprocess?: 'localize';

    public static getValidKeys() {
        return super.getValidKeys().concat([
            'choices',
            'preprocess'
        ]);
    }

    public static validate(json: any) {
        super.validate(json);
        assertValidOjectKeys(json, this.getValidKeys());
        assertType(json.choices, 'array', 'undefined');
        assertArray(json.allowedContexts, validateSchemaPropertyWithoutExtend);
    }
}

export class SchemaAnyProperty extends SchemaBaseProperty {
    public type: 'any' = 'any';

    public static getValidKeys() {
        return super.getValidKeys().concat([
            'type'
        ]);
    }

    public static validate(json: any) {
        super.validate(json);
        assertValidOjectKeys(json, this.getValidKeys());
        assertEqual(json.type, 'any');
    }
}

export class SchemaRefProperty extends SchemaBaseProperty {
    public type: 'ref' = 'ref';

    public static getValidKeys() {
        return super.getValidKeys().concat([
            'type'
        ]);
    }

    public static validate(json: any) {
        super.validate(json);
        assertValidOjectKeys(json, this.getValidKeys());
        assertType(json.$type, 'object');
    }
}

export class SchemaNullProperty extends SchemaBaseProperty {
    public type: 'null' = 'null';

    public static getValidKeys() {
        return super.getValidKeys().concat([
            'type'
        ]);
    }

    public static validate(json: any) {
        super.validate(json);
        assertValidOjectKeys(json, this.getValidKeys());
        assertEqual(json.type, 'null');
    }
}

export class SchemaValueProperty extends SchemaBaseProperty {
    public type: 'value' = 'value'; //fixme
    public value: any;

    public static getValidKeys() {
        return super.getValidKeys().concat([
            'value'
        ]);
    }

    public static validate(json: any) {
        super.validate(json);
        assertValidOjectKeys(json, this.getValidKeys());
        if (typeof (json.value) === "undefined")
            throw new Error('Value expected');
    }
}

export type EnumValue = string | { name: string; description: string };

function validateEnumValue(json: any) {
    assertType(json, 'string', 'object', 'undefined');
    if (typeof (json) === 'object') {
        assertValidOjectKeys(json, ['name', 'description']);
        assertType(json.name, 'string');
        assertType(json.description, 'string');
    }
}

export class SchemaStringProperty extends SchemaBaseProperty {
    public type: 'string' = 'string';
    public preprocess?: 'localize';
    public postprocess?: string;
    public enum?: EnumValue[];
    public minLength?: number;
    public maxLength?: number;
    public pattern?: string;
    public format?: string;
    public default?: string;

    public static getValidKeys() {
        return super.getValidKeys().concat([
            'type',
            'preprocess',
            'postprocess',
            'enum',
            'minLength',
            'maxLength',
            'pattern',
            'format',
            'default'
        ]);
    }

    public static validate(json: any) {
        super.validate(json);
        assertValidOjectKeys(json, this.getValidKeys());
        assertEqual(json.type, 'string');
        assertOneOf(json.preprocess, 'localize', undefined);
        assertType(json.postprocess, 'string', 'undefined');
        assertType(json.enum, 'array', 'undefined');
        assertArray(json.enum, (e) => validateEnumValue(e));
        assertType(json.minLength, 'number', 'undefined');
        assertType(json.maxLength, 'number', 'undefined');
        assertType(json.pattern, 'string', 'undefined');
        assertType(json.format, 'string', 'undefined');
        assertType(json.default, 'string', 'undefined');
    }
}

export class SchemaObjectProperty extends SchemaBaseProperty {
    public type: 'object' = 'object';
    public properties?: { [s: string]: SchemaProperty };
    public additionalProperties?: SchemaProperty | boolean;
    public patternProperties?: { [s: string]: SchemaProperty };
    public $import?: string;
    public isInstanceOf?: string;
    public postprocess?: 'convertImageDataToURL';
    public functions?: SchemaFunctionProperty[];
    public events?: SchemaFunctionProperty[];
    public default?: object[];

    public static getValidKeys() {
        return super.getValidKeys().concat([
            'type',
            'properties',
            'additionalProperties',
            'patternProperties',
            '$import',
            'isInstanceOf',
            'postprocess',
            'functions',
            'events',
            'default'
        ]);
    }

    public static validate(json: any) {
        super.validate(json);
        assertValidOjectKeys(json, this.getValidKeys());
        assertEqual(json.type, 'object');
        assertType(json.properties, 'object', 'undefined');
        assertMap(json.properties, validateSchemaPropertyWithoutExtend);
        assertType(json.additionalProperties, 'object', 'boolean', 'undefined');
        if (typeof (json.additionalProperties) === 'object')
            validateSchemaPropertyWithoutExtend(json.additionalProperties);
        assertType(json.patternProperties, 'object', 'undefined');
        assertMap(json.patternProperties, validateSchemaPropertyWithoutExtend);
        assertType(json.$import, 'string', 'undefined');
        assertType(json.isInstanceOf, 'string', 'undefined');
        assertOneOf(json.postprocess, 'convertImageDataToURL', undefined);
        assertType(json.functions, 'array', 'undefined');
        assertArray(json.functions, (e) => SchemaFunctionProperty.validate(e));
        assertType(json.events, 'array', 'undefined');
        assertArray(json.events, (e) => SchemaFunctionProperty.validate(e));
        assertType(json.default, 'object', 'undefined');
    }
}

export class SchemaNumberProperty extends SchemaBaseProperty {
    public type: 'number' | 'integer' = 'number';
    public minimum?: number;
    public maximum?: number;
    public default?: number;

    public static getValidKeys() {
        return super.getValidKeys().concat([
            'type',
            'minimum',
            'maximum',
            'default'
        ]);
    }

    public static validate(json: any) {
        super.validate(json);
        assertValidOjectKeys(json, this.getValidKeys());
        assertOneOf(json.type, 'integer', 'number');
        assertType(json.minimum, 'number', 'undefined');
        assertType(json.maximum, 'number', 'undefined');
        assertType(json.default, 'number', 'undefined');
    }
}

export class SchemaBooleanProperty extends SchemaBaseProperty {
    public type: 'boolean' = 'boolean';
    public default?: boolean;

    public static getValidKeys() {
        return super.getValidKeys().concat([
            'type',
            'default'
        ]);
    }

    public static validate(json: any) {
        super.validate(json);
        assertValidOjectKeys(json, this.getValidKeys());
        assertEqual(json.type, 'boolean');
        assertType(json.default, 'boolean', 'undefined');
    }
}

export class SchemaArrayProperty extends SchemaBaseProperty {
    public type: 'array' = 'array';
    public items?: SchemaProperty;
    public minItems?: number;
    public maxItems?: number;
    public default?: any[];

    public static getValidKeys() {
        return super.getValidKeys().concat([
            'type',
            'items',
            'minItems',
            'maxItems',
            'default'
        ]);
    }

    public static validate(json: any) {
        super.validate(json);
        assertValidOjectKeys(json, this.getValidKeys());
        assertEqual(json.type, 'array');
        assertType(json.items, 'object', 'undefined');
        if (json.items)
            validateSchemaPropertyWithoutExtend(json.items);
        assertType(json.minItems, 'number', 'undefined');
        assertType(json.maxItems, 'number', 'undefined');
        assertType(json.default, 'array', 'undefined');
        if (json.default)
            assertEqual(json.default.length, 0);
    }
}

export class SchemaFunctionProperty extends SchemaBaseProperty {
    public type: 'function' = 'function';
    public async?: 'callback' | 'responseCallback' | boolean;
    public requireUserInput?: boolean;
    public parameters?: SchemaProperty[];
    public extraParameters?: SchemaProperty[];
    public returns?: SchemaProperty;
    public allowAmbiguousOptionalArguments?: boolean;
    public filters?: SchemaProperty[];
    public assignableEvent?: boolean; // used for fixes.json only

    public static getValidKeys() {
        return super.getValidKeys().concat([
            'type',
            'async',
            'requireUserInput',
            'parameters',
            'extraParameters',
            'returns',
            'allowAmbiguousOptionalArguments',
            'filters'
        ]);
    }

    public static validate(json: any) {
        super.validate(json);
        assertValidOjectKeys(json, this.getValidKeys());
        assertOneOf(json.type, 'function', undefined);//hack: sometimes not set.
        assertOneOf(json.async, 'callback', 'responseCallback', true, false, undefined);
        assertType(json.requireUserInput, 'boolean', 'undefined');
        assertType(json.parameters, 'array', 'undefined');
        assertArray(json.parameters, validateSchemaPropertyWithoutExtend);
        assertType(json.extraParameters, 'array', 'undefined');
        assertArray(json.extraParameters, validateSchemaPropertyWithoutExtend);
        assertType(json.returns, 'object', 'undefined');
        if (json.returns)
            validateSchemaPropertyWithoutExtend(json.returns);
        assertType(json.allowAmbiguousOptionalArguments, 'boolean', 'undefined');
        assertType(json.filters, 'array', 'undefined');
        assertArray(json.filters, validateSchemaPropertyWithoutExtend);
    }
}

export type SchemaProperty = SchemaChoicesProperty
    | SchemaAnyProperty
    | SchemaRefProperty
    | SchemaNullProperty
    | SchemaValueProperty
    | SchemaStringProperty
    | SchemaObjectProperty
    | SchemaNumberProperty
    | SchemaBooleanProperty
    | SchemaArrayProperty
    | SchemaFunctionProperty;

export class SchemaEntry {
    public namespace: string = '';
    public description?: string;
    public permissions?: string[];
    public types?: SchemaProperty[];
    public functions?: SchemaFunctionProperty[];
    public events?: SchemaFunctionProperty[];
    public properties?: { [s: string]: SchemaProperty };
    public allowedContexts?: string[];
    public defaultContexts?: string[];
    public nocompile?: boolean;
    public $import?: string;

    public static getValidKeys() {
        return [
            'namespace',
            'description',
            'permissions',
            'types',
            'functions',
            'events',
            'properties',
            'allowedContexts',
            'defaultContexts',
            'nocompile',
            '$import'
        ];
    }

    public static validate(json: any) {
        assertType(json, 'object');
        assertType(json.namespace, 'string');
        currentNamespace = json.namespace;
        assertType(json.description, 'string', 'undefined');
        assertType(json.permissions, 'array', 'undefined');
        assertArray(json.permissions, (e) => assertType(e, 'string'));
        assertType(json.types, 'array', 'undefined');
        assertArray(json.types, validateSchemaProperty);

        assertType(json.functions, 'array', 'undefined');
        assertArray(json.functions, (e) => SchemaFunctionProperty.validate(e));
        assertType(json.events, 'array', 'undefined');
        assertArray(json.events, (e) => SchemaFunctionProperty.validate(e));

        assertType(json.properties, 'object', 'undefined');
        assertMap(json.properties, validateSchemaPropertyWithoutExtend);

        assertType(json.allowedContexts, 'array', 'undefined');
        assertArray(json.allowedContexts, (e) => assertType(e, 'string'));

        assertType(json.defaultContexts, 'array', 'undefined');
        assertArray(json.defaultContexts, (e) => assertType(e, 'string'));
        assertType(json.nocompile, 'boolean', 'undefined');
        assertType(json.$import, 'string', 'undefined');
    }
}
