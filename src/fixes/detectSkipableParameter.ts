import { SchemaFunctionProperty } from "../helpers/types";
import { SchemaVisitorFactory } from "../helpers/visitor";

// If an optional parameter is followed by a non-optional, it is skipable

function visitor(val: SchemaFunctionProperty) {
    if (val.parameters) {
        const nonOptionalIndex = val.parameters.findIndex((v) => !v.optional && v.type !== "function");
        for (let i = 0; i < nonOptionalIndex; i++) {
            val.parameters[i].skipableParameter = true;
        }
    }
    return val;
}

export const detectSkipableParameters: SchemaVisitorFactory = () => ({
    name: "detect skipable parameters",
    visitors: {
        Function: visitor,
    },
});
