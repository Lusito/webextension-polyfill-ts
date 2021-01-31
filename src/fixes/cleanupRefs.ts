import { SchemaProperty } from "../helpers/types";
import { SchemaVisitorFactory } from "../helpers/visitor";

// Some $ref instances can be expressed in a simpler way.
// This fix replaces the values of the following $ref ids with a new value

const REF_MAPPINGS: { [s: string]: string } = {
    UnrecognizedProperty: "any",
    PersistentBackgroundProperty: "boolean",
};

function visitor(val: SchemaProperty) {
    if (val.$ref) val.$ref = REF_MAPPINGS[val.$ref] ?? val.$ref;
    return val;
}

export const cleanupRefs: SchemaVisitorFactory = () => ({
    name: "clean up ugly $ref values",
    visitors: {
        Type: visitor,
        Event: visitor,
        Function: visitor,
        Parameter: visitor,
        Returns: visitor,
        Property: visitor,
    },
});
