import fs from "fs";

import { SchemaEntry } from "../helpers/types";
import { SchemaVisitorFactory } from "../helpers/visitor";
import { readJsonFile } from "../helpers/utils";
import { assertType, assertEqual } from "../helpers/assert";

// There are a lot of namespace specific fixes that need to be applied.
// These fixes are written in the /fixes/<namespace>.json files and this file applies these files to their respective namespace

function visitor(entry: SchemaEntry) {
    const file = `./fixes/${entry.namespace}.json`;
    if (!fs.existsSync(file)) return entry;

    const fixes = readJsonFile(file);
    for (const path in fixes) {
        const parts = path.split(".");
        let base: any = entry;
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (part[0] === "$") {
                const id = part.substr(1);
                assertType(base, "array");
                base = base.find((e: any) => e.id === id);
            } else if (part[0] === "%") {
                const name = part.substr(1);
                assertType(base, "array");
                base = base.find((e: any) => e.name === name);
            } else if (part[0] === "#") {
                assertType(base, "array");
                const index = parseInt(part.substr(1));
                if (index >= base.length || index < 0) throw new Error("Index out of bounds");
                base = base[index];
            } else {
                base = base[part];
            }
            assertType(base, "array", "object");
        }
        const lastPart = parts[parts.length - 1];
        const value = fixes[path];
        if (lastPart === "+[]") {
            assertType(base, "array");
            assertType(value, "array");
            value.forEach((e: any) => base.push(e));
        } else if (lastPart === "-[]") {
            assertType(base, "array");
            assertType(value, "array");
            value.reverse().forEach((selector: string) => {
                let index;
                const rest = selector.substr(1);
                if (selector[0] === "$") {
                    index = base.findIndex((e: any) => e.id === rest);
                } else if (selector[0] === "%") {
                    index = base.findIndex((e: any) => e.name === rest);
                } else if (selector[0] === "#") {
                    index = parseInt(rest);
                } else {
                    throw new Error(`Unknown selector: ${selector}`);
                }
                if (index >= base.length || index < 0)
                    throw new Error(`Could not find element by selector: ${selector}`);
                base.splice(index, 1);
            });
        } else if (lastPart === "!fixAsync") {
            assertEqual(base.async, true);
            assertType(base.parameters, "array");
            base.async = "callback";
            const params = [];
            if (value) {
                const [name, type] = value.split(":");
                params.push({ name, type });
            }
            base.parameters.push({
                type: "function",
                name: "callback",
                parameters: params,
            });
        } else {
            if (value === null && Array.isArray(base)) {
                let index;
                if (lastPart[0] === "$") {
                    const id = lastPart.substr(1);
                    index = base.findIndex((e: any) => e.id === id);
                } else if (lastPart[0] === "%") {
                    const name = lastPart.substr(1);
                    index = base.findIndex((e: any) => e.name === name);
                } else {
                    throw new Error("Unknown method to remove from array: " + lastPart);
                }
                if (index === -1) throw new Error("Could not find " + lastPart);
                base.splice(index, 1);
            } else {
                base[lastPart] = value;
            }
        }
    }
    return entry;
}

export const applyJsonFixes: SchemaVisitorFactory = () => {
    return {
        name: "applying manual json fixes",
        visitors: {
            Namespace: visitor,
        },
    };
};
