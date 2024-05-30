import { SchemaVisitorFactory } from "../helpers/visitor";
import { SchemaProperty, SchemaValueProperty } from "../helpers/types";

// Some types don't have a type property set.
// This fix tries to guess them, so that we can later use the type property with confidence.

function fixPropertyType(original: any) {
    if (!original.type) {
        const prop = original as SchemaProperty;
        if ("choices" in prop) prop.type = "choices";
        else if ("properties" in prop && prop.properties) prop.type = "object";
        else if ("value" in prop) prop.type = "value";
        else if ("$ref" in prop) prop.type = "ref";
        else throw new Error(`Could not guess type for ${JSON.stringify(original)}`);
    } else if (original.type === "string" && "value" in original) {
        const prop = original as SchemaValueProperty;
        prop.value = JSON.stringify(prop.value);
        prop.type = "value";
    }
    return original;
}

export const guessPropertyType: SchemaVisitorFactory = () => ({
    name: "correcting types",
    visitors: {
        Property: fixPropertyType,
        Parameter: fixPropertyType,
        Returns: fixPropertyType,
        Type: fixPropertyType,
    },
});
