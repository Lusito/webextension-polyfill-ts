export interface SchemaBaseProperty {
    id?: string;
    name?: string;
    $ref?: string;
    $extend?: string; // only on namespace.types
    description?: string;
    optional?: boolean | "true" | "false" | "omit-key-if-missing";
    optionalNull?: boolean;
    skipableParameter?: boolean;
    unsupported?: boolean | "true" | "false";
    deprecated?: boolean | string;
    permissions?: string[];
    allowedContexts?: string[];
    onError?: "warn";
    inline_doc?: boolean;
    nodoc?: boolean;
    preprocess?: string;
    postprocess?: string;
    min_manifest_version?: number;
    max_manifest_version?: number;
}

export interface SchemaChoicesProperty extends SchemaBaseProperty {
    type: "choices";
    choices?: SchemaProperty[];
    default?: any[];
}

export interface SchemaAnyProperty extends SchemaBaseProperty {
    type: "unknown";
}

export interface SchemaRefProperty extends SchemaBaseProperty {
    type: "ref";
}

export interface SchemaNullProperty extends SchemaBaseProperty {
    type: "null";
}

export interface SchemaValueProperty extends SchemaBaseProperty {
    type: "value";
    value: any;
}

export type SchemaEnumValue = string | { name: string; description: string };

export interface SchemaStringProperty extends SchemaBaseProperty {
    type: "string";
    enum?: SchemaEnumValue[];
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    format?: string;
    default?: string;
}

export interface SchemaObjectProperty extends SchemaBaseProperty {
    type: "object" | "binary";
    properties?: Record<string, SchemaProperty>;
    additionalProperties?: SchemaProperty | boolean;
    patternProperties?: Record<string, SchemaProperty>;
    $import?: string;
    isInstanceOf?: string;
    functions?: SchemaFunctionProperty[];
    events?: SchemaFunctionProperty[];
    default?: any[];
}

export interface SchemaNumberProperty extends SchemaBaseProperty {
    type: "number" | "integer";
    minimum?: number;
    maximum?: number;
    default?: number;
}

export interface SchemaBooleanProperty extends SchemaBaseProperty {
    type: "boolean";
    default?: boolean;
}

export interface SchemaArrayProperty extends SchemaBaseProperty {
    type: "array";
    items?: SchemaProperty;
    minItems?: number;
    maxItems?: number;
    default?: any[];
}

export interface SchemaFunctionProperty extends SchemaBaseProperty {
    type: "function";
    async?: "callback" | "responseCallback" | boolean;
    requireUserInput?: boolean;
    templateParams?: string; // used for fixes/*.json only
    parameters?: SchemaProperty[];
    extraParameters?: SchemaProperty[];
    returns?: SchemaProperty;
    allowAmbiguousOptionalArguments?: boolean;
    allowCrossOriginArguments?: boolean;
    filters?: SchemaProperty[];
    assignableEvent?: boolean; // used for fixes/*.json only
    options?: {
        supportsListeners: boolean;
        supportsRules: boolean;
        conditions: string[];
        actions: string[];
    };
}

export type SchemaProperty =
    | SchemaChoicesProperty
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

export interface SchemaEntry {
    namespace: string;
    optional?: boolean;
    description?: string;
    permissions?: string[];
    types?: SchemaProperty[];
    functions?: SchemaFunctionProperty[];
    events?: SchemaFunctionProperty[];
    properties?: Record<string, SchemaProperty>;
    allowedContexts?: string[];
    defaultContexts?: string[];
    nocompile?: boolean;
    $import?: string;
    min_manifest_version?: number;
    max_manifest_version?: number;
}
