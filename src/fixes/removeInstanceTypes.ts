import { SchemaProperty } from "../helpers/types";
import { SchemaVisitorFactory, VisitorAction } from "../helpers/visitor";

// Some chrome types are useless

function visitor<T extends SchemaProperty>(value: T) {
    if (value.id?.endsWith("InstanceType")) return VisitorAction.REMOVE;
    return value;
}

export const removeInstanceTypes: SchemaVisitorFactory = () => ({
    name: "remove InstanceType types",
    visitors: {
        Type: visitor,
    },
});
