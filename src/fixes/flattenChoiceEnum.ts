import { SchemaProperty, SchemaValueProperty } from "../helpers/types";
import { SchemaVisitorFactory } from "../helpers/visitor";
import { modifyArray } from "../helpers/utils";
import { getEnumType } from "../helpers/getType";

// extractInlineContent extracts union types where it's not helping.
// This fix inlines these in order to have nicer code

function visitor(prop: SchemaProperty, types: SchemaProperty[]) {
    const choices = prop.type === "choices" && prop.choices;
    if (choices) {
        modifyArray(choices, (c) => {
            if (c.$ref && c.$ref.endsWith("Enum")) {
                const extended = types.find((t2) => t2.id === c.$ref);
                if (!extended) throw new Error("Could not find extended");
                if (extended.type !== "string") throw new Error("error flattening single choice, both must be string");
                if (extended.enum) {
                    extended.deprecated = true; // so it gets removed in the next step
                    return { type: "value", value: getEnumType(extended.enum) } as SchemaValueProperty;
                }
            }
            return c;
        });
    }
    return prop;
}

export const flattenChoiceEnum: SchemaVisitorFactory = (namespace) => {
    const types = namespace.entry.types || [];
    return {
        name: "flatten choice enum",
        visitors: {
            Function: (t) => visitor(t, types),
            Event: (t) => visitor(t, types),
            Type: (t) => visitor(t, types),
            Property: (t) => visitor(t, types),
            Parameter: (t) => visitor(t, types),
            Returns: (t) => visitor(t, types),
        },
    };
};
