import { SchemaObjectProperty } from "../helpers/types";
import { SchemaVisitorFactory } from "../helpers/visitor";
import { getParameters, getReturnType } from "../helpers/getType";
import { toUpperCamelCase } from "../helpers/utils";

// Some events have an extra parameter when adding a listener.
// This fix creates new type definitions to be used instead of Events.Event.

export const extendEvents: SchemaVisitorFactory = (namespace, namespaces) => {
    const eventNs = namespaces.find((ns) => ns.entry.namespace === "events");
    if (!eventNs) throw new Error("Missing events namespace");
    const { types } = eventNs.entry;
    if (!types) throw new Error("Missing events types");
    const eventType = types.find((t) => t.id === "Event");
    if (!eventType) throw new Error("Missing Events.Event");
    if (eventType.type !== "object") throw new Error("Events.Event should be object");
    const eventFunctions = eventType.functions;
    if (!eventFunctions) throw new Error("Events.Event.functions missing");

    const addListener = eventFunctions.find((f) => f.name === "addListener");
    if (!addListener) throw new Error("Missing addListener in Event type");

    return {
        name: "extend events if needed",
        visitors: {
            Event(e) {
                if (e.extraParameters) {
                    if (!e.name) throw new Error("Missing event name");

                    const id = `${toUpperCamelCase(e.name)}Event`;
                    const extendedAddListener = JSON.parse(JSON.stringify(addListener));
                    const extended: SchemaObjectProperty = {
                        id,
                        type: "object",
                        isInstanceOf: `Events.Event<(${getParameters(e.parameters, false)}) => ${getReturnType(e)}>`,
                        description: e.description,
                        functions: [extendedAddListener],
                    };
                    const params = extendedAddListener.parameters;
                    if (!params) throw new Error("Missing addListener.parameters in Event type");
                    params[0].type = `(${getParameters(e.parameters, false)}) => ${getReturnType(e)}`;
                    params.pop();
                    e.extraParameters.forEach((p) => params.push(p));
                    e.$extend = id;
                    delete e.parameters;
                    if (!namespace.entry.types) namespace.entry.types = [];
                    namespace.entry.types.push(extended);
                }
                return e;
            },
        },
    };
};
