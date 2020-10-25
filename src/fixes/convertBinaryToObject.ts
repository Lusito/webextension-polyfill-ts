import { SchemaProperty } from "../helpers/types";
import { SchemaVisitorFactory } from "../helpers/visitor";

// In chrome schemas, there are some "binary" types, which are essentially the same as "object"

function visitor<T extends SchemaProperty>(value: T) {
    return {
        ...value,
        type: value.type === "binary" ? "object" : value.type,
    };
}

export const convertBinaryToObject: SchemaVisitorFactory = () => {
    return {
        name: "convert binary types to object types",
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
