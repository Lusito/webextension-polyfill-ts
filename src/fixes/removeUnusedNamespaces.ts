import { SchemaVisitorFactory, VisitorAction } from "../helpers/visitor";

// Some namespaces are not supposed to be exported.
// This fix removes these namespaces from the data

const UNUSED_NAMESPACES = ["test"];

export const removeUnusedNamespaces: SchemaVisitorFactory = () => {
    return {
        name: "remove unused namespaces",
        visitors: {
            Namespace(original) {
                return UNUSED_NAMESPACES.includes(original.namespace) ? VisitorAction.REMOVE : original;
            },
        },
    };
};
