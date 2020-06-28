import { SchemaProperty } from "../helpers/types";
import { SchemaVisitorFactory, VisitorAction } from "../helpers/visitor";

// There are quite a few types that are deprecated or not supported.
// This fix removes these from the data.

function visitor<T extends SchemaProperty>(value: T) {
    return value.unsupported || value.deprecated ? VisitorAction.REMOVE : value;
}

export const removeUnsupported: SchemaVisitorFactory = () => {
    return {
        name: "remove unsupported and deprecated content",
        visitors: {
            Type: visitor,
            Event: visitor,
            Function: visitor,
            Parameter: visitor,
            Returns: visitor,
            Property: visitor,
        },
    };
};
