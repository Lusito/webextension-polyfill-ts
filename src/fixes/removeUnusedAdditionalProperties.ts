import { SchemaProperty } from "../helpers/types";
import { SchemaVisitorFactory, VisitorAction } from "../helpers/visitor";

// There are quite a few additionalProperties that are not useful at all.
// This fix removes these from the data.

const IGNORE_ADDITIONAL_PROPERTIES = ["UnrecognizedProperty", "ImageDataOrExtensionURL", "ThemeColor"];

function visitor(value: SchemaProperty) {
    if ("additionalProperties" in value && typeof value.additionalProperties === "object") {
        if (value.additionalProperties.$ref && IGNORE_ADDITIONAL_PROPERTIES.includes(value.additionalProperties.$ref))
            delete value.additionalProperties;
    }
    return value.unsupported || value.deprecated ? VisitorAction.REMOVE : value;
}

export const removeUnusedAdditionalProperties: SchemaVisitorFactory = () => ({
    name: "remove unsupported and deprecated content",
    visitors: {
        Type: visitor,
        Event: visitor,
        Function: visitor,
        Parameter: visitor,
        Returns: visitor,
        Property: visitor,
    },
});
