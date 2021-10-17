#! /usr/bin/env node
// eslint-disable-next-line import/no-extraneous-dependencies
import rimraf from "rimraf";
import fs from "fs";

import { SchemaEntry, SchemaProperty, SchemaFunctionProperty } from "./helpers/types";
import { importAndFixAll, ImportedNamespace } from "./helpers/importNormalized";
import { filterUnique, workMap, toUpperCamelCase, lowerFirstChar } from "./helpers/utils";
import { CodeWriter } from "./helpers/CodeWriter";
import { ErrorMessage, Assert } from "./helpers/assert";
import {
    getProperty,
    getEnumType,
    getUnionType,
    getType,
    getParameters,
    setCurrentTypeId,
    fixRef,
    getReturnType,
    getArrayType,
    setCurrentNamespace,
} from "./helpers/getType";

function getImports(entry: SchemaEntry, subNamespaces: string[]) {
    const imports: string[] = [];
    if (entry.$import) imports.push(toUpperCamelCase(entry.$import));
    subNamespaces.forEach((ns) => imports.push(ns.replace(/\./g, "_")));
    function checkAndAddImport(ref?: string) {
        if (ref && !ref.startsWith(`${entry.namespace}.`) && ref.indexOf(".") > 0 && !ref.startsWith("menusInternal"))
            imports.push(toUpperCamelCase(ref.split(".")[0]));
    }
    function addFromProperty(prop: SchemaProperty) {
        checkAndAddImport(prop.$ref);
        if (prop.type === "function") {
            if (prop.returns?.$ref) checkAndAddImport(prop.returns.$ref);
            prop.parameters?.forEach(addFromProperty);
        }
        if (prop.type === "object") {
            workMap(prop.properties, addFromProperty);

            if (prop.additionalProperties && typeof prop.additionalProperties === "object") {
                if (prop.additionalProperties.$ref) checkAndAddImport(prop.additionalProperties.$ref);
            }
            prop.functions?.forEach(addFromProperty);
            prop.events?.forEach(addFromProperty);
            if (prop.events?.find((e) => !e.assignableEvent)) imports.push("Events");
        } else if (prop.type === "choices") prop.choices?.forEach(addFromProperty);
        else if (prop.type === "array" && prop.items) addFromProperty(prop.items);
    }
    entry.types?.forEach(addFromProperty);
    entry.functions?.forEach(addFromProperty);
    entry.events?.forEach(addFromProperty);
    if (entry.events?.length) imports.push("Events");
    workMap(entry.properties, addFromProperty);
    return imports.filter(filterUnique);
}

function addProperties(
    id: string | undefined,
    properties: Record<string, SchemaProperty> | undefined,
    writer: CodeWriter
) {
    const assert = new Assert(`build/addProperties(${id})`);
    workMap(properties, (prop, key) => {
        if (key === "instanceType") return;
        assert.supported(prop);

        if (prop.type === "function") {
            if ("isEvent" in prop) addEvent(prop, writer);
            else {
                prop.name = key;
                addFunction(prop, prop.parameters, writer);
            }
            return;
        }
        if (prop.description || prop.optional) {
            if (prop.description) writer.comment(prop.description.trim());
            if (prop.optional) writer.comment("Optional.");
        }
        writer.code(`${getProperty(key, prop, true)};`);
        writer.emptyLine();
    });
}

function addType(type: SchemaProperty, writer: CodeWriter) {
    const assert = new Assert(`build/addType(${type.id})`);
    assert.supported(type);
    setCurrentTypeId(type.id);

    if (type.description || (type.type === "string" && type.enum)) {
        if (type.description) {
            writer.comment(type.description.trim());
            if (type.type === "string" && type.enum && type.enum.length) writer.emptyLine();
        }
        if (type.type === "string") {
            type.enum?.forEach((e) => {
                if (typeof e !== "string") writer.comment(`"${e.name}": ${e.description.trim()}`);
            });
        }
    }
    if (type.type === "object") {
        const templateMap: Record<string, string> = {
            Event: "<T extends (...args: any[]) => any>",
            RuleEvent: "<TRule extends Record<string, unknown>>",
        };
        const templateParam = templateMap[type.id || ""] ?? "";
        let extendsClass = "";
        if (type.$import) {
            extendsClass = ` extends ${fixRef(type.$import)}`;
        } else if (
            type.additionalProperties &&
            typeof type.additionalProperties === "object" &&
            type.additionalProperties.$ref
        ) {
            extendsClass = ` extends ${fixRef(type.additionalProperties.$ref)}`;
        } else if (type.isInstanceOf) {
            extendsClass = ` extends ${type.isInstanceOf}`;
        }
        writer.begin(`interface ${type.id}${templateParam}${extendsClass} {`);
        const writeInstructions = writer.getWriteInstructionCount();

        if (type.additionalProperties && typeof type.additionalProperties === "object") {
            if (type.additionalProperties.type === "object")
                addProperties(type.id, type.additionalProperties.properties, writer);
            // else if(type.additionalProperties.type !== 'any')
            //     throw new Error('what now?');
        }
        addProperties(type.id, type.properties, writer);
        type.functions?.forEach((func) => addFunction(func, func.parameters, writer));
        type.events?.forEach((event) => addEvent(event, writer));

        // Empty interface, add index signature for unknown
        if (writeInstructions === writer.getWriteInstructionCount()) {
            writer.code(`[s: string]: unknown`);
        }

        writer.end("}");
    } else if (type.type === "string" && type.enum) {
        writer.code(`type ${type.id} = ${getEnumType(type.enum)};`);
    } else if (type.type === "ref") {
        writer.code(`type ${type.id} = ${type.$ref};`);
    } else if (type.type === "string") {
        writer.code(`type ${type.id} = string;`);
    } else if (type.type === "value") {
        writer.code(`type ${type.id} = ${JSON.stringify(type.value)};`);
    } else if (type.type === "choices" && type.choices) {
        writer.code(`type ${type.id} = ${getUnionType(type.choices)};`);
    } else if (type.type === "array" && type.items) {
        const suffix = type.optional ? "|undefined;" : ";";
        writer.code(`type ${type.id} = ${getArrayType(type)}${suffix}`);
    } else {
        writer.code(`// unknown type: ${type.type}`);
    }
    writer.emptyLine();
    setCurrentTypeId(undefined);
}

function formatParamComment(param: SchemaProperty) {
    const description = param.description ? `${param.description}` : "";
    const fullDescription = param.optional ? `Optional. ${description}` : description;
    return `@param ${param.name} ${fullDescription.trim()}`;
}

function addEvent(event: SchemaFunctionProperty, writer: CodeWriter) {
    const name = event.name || event.id;
    const assert = new Assert(`build/addEvent(${name})`);
    assert.supported(event);
    if (!name) {
        console.log(event);
        throw new Error(ErrorMessage.MISSING_NAME);
    }

    if (event.description) {
        writer.comment(event.description.trim());
        if (event.parameters?.length) writer.emptyLine();
    }

    if (event.options?.supportsRules) {
        const toType = (values: string[]) => values.map((value) => value.split(".")[1] || value).join(" | ");
        writer.code(`${name}: RuleEvent<${toType(event.options.conditions)}, ${toType(event.options.actions)}>;`);
    } else {
        event.parameters?.forEach((param) => writer.comment(formatParamComment(param)));

        if (event.assignableEvent) {
            writer.code(`${name}?: (${getParameters(event.parameters, false)}) => ${getReturnType(event)};`);
        } else if (event.$extend) {
            writer.code(`${name}: ${event.$extend};`);
        } else {
            writer.code(
                `${name}: Events.Event<(${getParameters(event.parameters, false)}) => ${getReturnType(event)}>;`
            );
        }
    }
    writer.emptyLine();
}

function addFunction(func: SchemaFunctionProperty, parameters: SchemaProperty[] | undefined, writer: CodeWriter) {
    const assert = new Assert(`build/addFunction(${func.name})`);
    assert.supported(func);
    if (!func.name) throw new Error(ErrorMessage.MISSING_NAME);

    if (func.description) {
        writer.comment(func.description.trim());
        if (parameters || func.returns) writer.emptyLine();
    }
    let asyncParam: SchemaFunctionProperty | null = null;
    let parametersWithoutAsync = parameters;
    if (parameters) {
        if (func.async === "callback" || func.async === "responseCallback") {
            const lastParam = parameters.length && parameters[parameters.length - 1];
            if (!lastParam || lastParam.name !== func.async) throw new Error("Last param expected to be callback");
            if (lastParam.type !== "function") throw new Error("async param is expected to be function");
            parametersWithoutAsync = parameters.slice(0, parameters.length - 1);
            asyncParam = lastParam;
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        parametersWithoutAsync!.forEach((param) => writer.comment(formatParamComment(param)));
    }
    let returnType = "void";
    if (asyncParam) {
        if (func.returns) throw new Error("Error: conflict between return value and async");
        const description = asyncParam.description ? asyncParam.description.trim() : "";
        if (description) writer.comment(`@returns ${description}`);

        if (!asyncParam.parameters || !asyncParam.parameters.length) returnType = "void";
        else if (asyncParam.parameters.length === 1) returnType = getType(asyncParam.parameters[0]);
        else returnType = `[${asyncParam.parameters.map(getType).join(", ")}]`;
        returnType = `Promise<${returnType}>`;
    } else if (func.returns) {
        const description = func.returns.description ? func.returns.description.trim() : "";
        if (description) writer.comment(`@returns ${description}`);

        returnType = getType(func.returns);
    }
    const optionalPart = func.optional ? "?" : "";
    writer.code(`${func.name + optionalPart}(${getParameters(parametersWithoutAsync, true)}): ${returnType};`);
    writer.emptyLine();

    if (parameters) {
        const skipParam = parameters.find((v) => v.skipableParameter);
        if (skipParam) {
            const fixedParameters = parameters.filter((v) => v !== skipParam);
            addFunction(func, fixedParameters, writer);
        }
    }
}

function writeNamespace(namespace: ImportedNamespace, subNamespaces: string[]) {
    try {
        const { entry } = namespace;
        setCurrentNamespace(entry.namespace);
        const filename = `${namespacePath(namespace)}.d.ts`;
        console.log(`- ${filename}`);

        const writer = new CodeWriter();

        writer.comment(`Namespace: browser.${entry.namespace}`);
        writer.comment("Generated from Mozilla sources. Do not manually edit!");
        if (entry.description || entry.permissions) writer.emptyLine();
        if (entry.description) writer.comment(entry.description.trim());
        if (entry.permissions)
            writer.comment(
                `Permissions: ${
                    entry.permissions.length === 0 ? "-" : entry.permissions.map((s) => JSON.stringify(s)).join(", ")
                }`
            );
        writer.emptyLine();
        if (namespace.comments.length) {
            writer.comment("Comments found in source JSON schema files:");
            namespace.comments.split("\n").forEach((line) => {
                writer.comment(line);
            });
        }

        getImports(entry, subNamespaces)
            .map((e) => `import { ${toUpperCamelCase(e)} } from "./${lowerFirstChar(e)}";`)
            .forEach((e) => writer.code(e));
        writer.emptyLine();

        writer.begin(`export namespace ${toUpperCamelCase(entry.namespace)} {`);
        entry.types?.forEach((type) => addType(type, writer));
        const extendsPart = entry.$import ? ` extends ${toUpperCamelCase(entry.$import)}.Static` : "";
        writer.begin(`interface Static${extendsPart} {`);
        const writeInstructions = writer.getWriteInstructionCount();

        // Constructors
        entry.types?.forEach((type) => {
            if (type.type === "object" && type.properties && type.properties.instanceType) {
                writer.code(`${type.id}: { new(options?: ${type.id}): ${type.id} };`);
                writer.emptyLine();
            }
        });

        entry.functions?.forEach((func) => addFunction(func, func.parameters, writer));
        if (entry.functions?.length && entry.events?.length) writer.emptyLine();

        entry.events?.forEach((event) => addEvent(event, writer));
        if (entry.events?.length) writer.emptyLine();

        addProperties(filename, entry.properties, writer);
        subNamespaces.forEach((ns) => writer.code(`${ns.split(".")[1]}: ${toUpperCamelCase(ns)}.Static;`));

        // Empty interface, add index signature for unknown
        if (writeInstructions === writer.getWriteInstructionCount()) {
            writer.code(`[s: string]: unknown`);
        }

        writer.end("}");
        writer.end("}");
        fs.writeFileSync(`out/${filename}`, writer.toString());
    } catch (e) {
        console.error(`Error reading ${namespace.file}: `, e);
        throw e;
    }
}

function namespacePath(ns: ImportedNamespace) {
    return `namespaces/${ns.entry.namespace.replace(/\./g, "_")}`;
}

function writeIndexFile(namespaces: ImportedNamespace[]) {
    console.log("- index.d.ts");
    const writer = new CodeWriter();
    namespaces.forEach((ns) => {
        if (!ns.entry.namespace.includes(".")) {
            const name = toUpperCamelCase(ns.entry.namespace);
            writer.code(`import { ${name} as Imported${name} } from "./${namespacePath(ns)}";`);
        }
    });

    writer.emptyLine();
    writer.begin("declare namespace Browser {");
    namespaces.forEach((ns) => {
        if (!ns.entry.namespace.includes(".")) {
            writer.code(`const ${ns.entry.namespace}: ${toUpperCamelCase(ns.entry.namespace)}.Static;`);
        }
    });
    writer.emptyLine();

    writer.begin("interface Browser {");
    namespaces.forEach((ns) => {
        if (!ns.entry.namespace.includes("."))
            writer.code(`${ns.entry.namespace}: ${toUpperCamelCase(ns.entry.namespace)}.Static;`);
    });
    writer.end("}");
    writer.emptyLine();

    writer.code("/* tslint:disable:strict-export-declare-modifiers */");
    namespaces.forEach((ns) => {
        if (!ns.entry.namespace.includes(".")) {
            const name = toUpperCamelCase(ns.entry.namespace);
            writer.code(`export import ${name} = Imported${name};`);
        }
    });
    writer.code("/* tslint:enable:strict-export-declare-modifiers */");
    writer.end("}");

    const template = fs.readFileSync("./src/indexTemplate.d.ts", { encoding: "utf-8" });
    fs.writeFileSync("out/index.d.ts", template.replace("declare namespace Browser {}", writer.toString().trim()));
}

try {
    console.log("importing files: ");
    const namespaces = importAndFixAll();
    if (namespaces) {
        console.log("removing old definitions: ");
        rimraf.sync("./out");
        fs.mkdirSync("./out/namespaces", { recursive: true });
        console.log("generating new definitions: ");
        const namespaceKeys = namespaces.map((ns) => ns.entry.namespace);
        namespaces.forEach((ns) => {
            const prefix = `${ns.entry.namespace}.`;
            writeNamespace(
                ns,
                namespaceKeys.filter((key) => key.startsWith(prefix))
            );
        });
        writeIndexFile(namespaces);

        console.log("--------------------");
        console.log("All definitions generated!");
    }
} catch (e) {
    console.error(e);
}

// fixme: remove export namespace?
// fixme: remember shorter/better name for extracted parameter objects and when all types are extracted, use the better name if no conflicts exist
// fixme: descriptions might include refs: $(ref:runtime.lastError)
