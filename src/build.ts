#! /usr/bin/env node
import rimraf from 'rimraf';
import fs from 'fs';
import { SchemaEntry, SchemaProperty, SchemaFunctionProperty } from './helpers/types';
import { importAndFixAll, ImportedNamespace } from './helpers/importNormalized';
import { filterUnique, workMap, workArray, toUpperCamelCase, lowerFirstChar } from './helpers/utils';
import { CodeWriter } from './helpers/CodeWriter';
import { ErrorMessage, assertSupported } from './helpers/assert';
import { getProperty, getEnumType, getUnionType, getType, getParameters, setCurrentTypeId, fixRef, getReturnType, getArrayType } from './helpers/getType';

function getImports(entry: SchemaEntry, subNamespaces: string[]) {
    const imports: string[] = [];
    if(entry.$import)
        imports.push(toUpperCamelCase(entry.$import));
    subNamespaces.forEach((ns) => imports.push(ns.replace(/\./g, '_')));
    function checkAndAddImport(ref?: string) {
        if (ref && !ref.startsWith(entry.namespace + '.') && ref.indexOf('.') > 0 && !ref.startsWith('menusInternal'))
            imports.push(toUpperCamelCase(ref.split('.')[0]));
    }
    function addFromProperty(prop: SchemaProperty) {
        checkAndAddImport(prop.$ref);
        if (prop.type === 'function') {
            if (prop.returns && prop.returns.$ref)
                checkAndAddImport(prop.returns.$ref);
            workArray(prop.parameters, addFromProperty);
        }
        if (prop.type === 'object') {
            workMap(prop.properties, addFromProperty);
            
            if (prop.additionalProperties && typeof (prop.additionalProperties) === 'object') {
                if (prop.additionalProperties.$ref)
                    checkAndAddImport(prop.additionalProperties.$ref);
            }
            workArray(prop.functions, addFromProperty);
            workArray(prop.events, addFromProperty);
            if (prop.events && prop.events.find((e) => !e.assignableEvent))
                imports.push('Events');
        }
        else if (prop.type === 'choices')
            workArray(prop.choices, addFromProperty);
        else if (prop.type === 'array' && prop.items)
            addFromProperty(prop.items);
    }
    workArray(entry.types, addFromProperty);
    workArray(entry.functions, addFromProperty);
    if (workArray(entry.events, addFromProperty))
        imports.push('Events');
    workMap(entry.properties, addFromProperty);
    return imports.filter(filterUnique);
}

function addProperties(properties: { [s: string]: SchemaProperty } | undefined, writer: CodeWriter) {
    workMap(properties, (prop, key) => {
        assertSupported(prop);

        if (prop.type === 'function') {
            if (prop.hasOwnProperty('isEvent'))
                addEvent(prop, writer);
            else {
                prop.name = key;
                addFunction(prop, prop.parameters, writer);
            }
            return;
        }
        if (prop.description || prop.optional) {
            if (prop.description)
                writer.comment(prop.description);
            if (prop.optional)
                writer.comment('Optional.');
        }
        writer.code(getProperty(key, prop, true) + ';');
        writer.emptyLine();
    });
}

function addType(type: SchemaProperty, writer: CodeWriter) {
    assertSupported(type);
    setCurrentTypeId(type.id);

    if (type.description || type.type === 'string' && type.enum) {
        if (type.description) {
            writer.comment(type.description);
            if (type.type === 'string' && type.enum && type.enum.length)
                writer.emptyLine();
        }
        if (type.type === 'string') {
            workArray(type.enum, (e) => {
                if (typeof e !== 'string')
                    writer.comment('"' + e.name + '": ' + e.description);
            });
        }
    }
    if (type.type === 'object') {
        const templateParam = type.id === 'Event' ? '<T extends Function>' : '';
        let extendsClass = '';
        if(type.$import) {
            extendsClass = ' extends ' + fixRef(type.$import);
        } else if (type.additionalProperties && typeof (type.additionalProperties) === 'object') {
            if (type.additionalProperties.$ref)
                extendsClass = ' extends ' + fixRef(type.additionalProperties.$ref);
        }
        writer.begin('interface ' + type.id + templateParam + extendsClass + ' {');

        if (type.additionalProperties && typeof (type.additionalProperties) === 'object') {
            if (type.additionalProperties.type === 'object')
                addProperties(type.additionalProperties.properties, writer);
            // else if(type.additionalProperties.type !== 'any')
            //     throw new Error('what now?');
        }
        addProperties(type.properties, writer);
        workArray(type.functions, (func) => addFunction(func, func.parameters, writer));
        workArray(type.events, (event) => addEvent(event, writer));
        writer.end('}');
    } else if (type.type === 'string' && type.enum) {
        writer.code('type ' + type.id + ' = ' + getEnumType(type.enum) + ';');
    } else if (type.type === 'string') {
        writer.code('type ' + type.id + ' = string;');
    } else if (type.type === 'value') {
        writer.code('type ' + type.id + ' = ' + JSON.stringify(type.value) + ';');
    } else if (type.type === 'choices' && type.choices) {
        writer.code('type ' + type.id + ' = ' + getUnionType(type.choices) + ';');
    } else if (type.type === 'array' && type.items) {
        const suffix = type.optional ? "|undefined;" : ";";
        writer.code('type ' + type.id + ' = ' + getArrayType(type) + suffix);
    } else {
        writer.code('// unknown type: ' + type.type);
    }
    writer.emptyLine();
    setCurrentTypeId(undefined);
}

function addEvent(event: SchemaFunctionProperty, writer: CodeWriter) {
    assertSupported(event);
    const name = event.name || event.id;
    if (!name) {
        console.log(event);
        throw ErrorMessage.MISSING_NAME;
    }

    if (event.description) {
        writer.comment(event.description);
        if (event.parameters && event.parameters.length)
            writer.emptyLine();
    }

    workArray(event.parameters, (param) => {
        const description = param.description ? ' ' + param.description : '';
        const fullDescription = param.optional ? (' Optional.' + description) : description;
        writer.comment('@param ' + param.name + fullDescription);
    });

    if (event.assignableEvent) {
        writer.code(name + '?: (' + getParameters(event.parameters, false) + ') => ' + getReturnType(event) + ';');
    } else if(event.$extend) {
        writer.code(name + ': ' + event.$extend + ';');
    } else {
        writer.code(name + ': Events.Event<(' + getParameters(event.parameters, false) + ') => ' + getReturnType(event) + '>;');
    }
    writer.emptyLine();
}

function addFunction(func: SchemaFunctionProperty, parameters: SchemaProperty[] | undefined, writer: CodeWriter) {
    assertSupported(func);
    if (!func.name)
        throw ErrorMessage.MISSING_NAME;

    const indexToFix = getOverloadParameterIndex(parameters);
    if (indexToFix >= 0) {
        addFunction(func, fixOptionalParameter(func.parameters, indexToFix), writer);
        addFunction(func, removeOptionalParameter(func.parameters, indexToFix), writer);
        return;
    }
    if (func.description) {
        writer.comment(func.description);
        if (parameters || func.returns)
            writer.emptyLine();
    }
    let asyncParam: SchemaFunctionProperty | null = null;
    if (parameters) {
        if (func.async === 'callback' || func.async === 'responseCallback') {
            const lastParam = parameters.length && parameters[parameters.length - 1];
            if (!lastParam || lastParam.name !== func.async)
                throw new Error('Last param expected to be callback');
            if (lastParam.type !== 'function')
                throw new Error('async param is expected to be function');
            parameters = parameters.slice(0, parameters.length - 1);
            asyncParam = lastParam;
        }
        parameters.forEach((param) => {
            const description = param.description ? ' ' + param.description : '';
            const fullDescription = param.optional ? (' Optional.' + description) : description;
            writer.comment('@param ' + param.name + fullDescription);
        });
    }
    let returnType = 'void';
    if (asyncParam) {
        if (func.returns)
            throw new Error('Error: conflict between return value and async');
        const description = (asyncParam.description) ? ' ' + asyncParam.description : '';
        if (!asyncParam.parameters || !asyncParam.parameters.length)
            returnType = 'void';
        else if (asyncParam.parameters.length === 1)
            returnType = getType(asyncParam.parameters[0]);
        else
            returnType = '[' + asyncParam.parameters.map(getType).join(', ') + ']';
        returnType = 'Promise<' + returnType + '>';
        writer.comment('@returns ' + returnType + description);
    }
    else if (func.returns) {
        const description = func.returns.description ? ' ' + func.returns.description : '';
        returnType = getType(func.returns);
        writer.comment('@returns ' + returnType + description);
    }
    const optionalPart = func.optional ? '?' : '';
    writer.code(func.name + optionalPart + '(' + getParameters(parameters, true) + '): ' + returnType + ';');
    writer.emptyLine();
}

function getLastNonOptionalParam(parameters: SchemaProperty[]) {
    for (let i = parameters.length - 1; i >= 0; i--) {
        if (!parameters[i].optional && parameters[i].type !== 'function')
            return i;
    }
    return -1;
}

function fixOptionalParameter(parameters: SchemaProperty[] | undefined, indexToFix: number) {
    if (parameters && indexToFix >= 0) {
        parameters = parameters.slice();
        const param = parameters[indexToFix] = { ...parameters[indexToFix] };
        param.overloadFlag = true;
    }
    return parameters;
}

function removeOptionalParameter(parameters: SchemaProperty[] | undefined, indexToFix: number) {
    if (parameters && indexToFix >= 0) {
        parameters = parameters.slice();
        parameters.splice(indexToFix, 1);
    }
    return parameters;
}

function getOverloadParameterIndex(parameters: SchemaProperty[] | undefined) {
    if (parameters) {
        const lastNonOptional = getLastNonOptionalParam(parameters);
        return parameters.findIndex((param, i) => {
            if (i < lastNonOptional && param.optional && !param.overloadFlag)
                return true;
            return false;
        });
    }
    return -1;
}

function writeNamespace(namespace: ImportedNamespace, subNamespaces: string[]) {
    try {
        const entry = namespace.entry;
        const filename = entry.namespace.replace(/\./g, '_') + '.d.ts';
        console.log('- ' + filename);

        const writer = new CodeWriter();

        writer.comment('Namespace: browser.' + entry.namespace);
        writer.comment('Generated from Mozilla sources. Do not manually edit!');
        if (entry.description || entry.permissions)
            writer.emptyLine();
        if (entry.description)
            writer.comment(entry.description);
        if (entry.permissions)
            writer.comment('Permissions: ' + (entry.permissions.length === 0 ? '-' : entry.permissions.map((s) => JSON.stringify(s)).join(', ')));
        writer.emptyLine();
        if(namespace.comments.length) {
            writer.comment('Comments found in source JSON schema files:');
            namespace.comments.split('\n').forEach((line) => {
                writer.comment(line);
            });
        }

        getImports(entry, subNamespaces)
            .map((e) => 'import { ' + toUpperCamelCase(e) + ' } from "./' + lowerFirstChar(e) + '";')
            .forEach((e) => writer.code(e));
        writer.emptyLine();

        writer.begin('export declare namespace ' + toUpperCamelCase(entry.namespace) +  ' {');
        workArray(entry.types, (type) => addType(type, writer));
        const extendsPart = entry.$import ? ` extends ${toUpperCamelCase(entry.$import)}.Static` : '';
        writer.begin('interface Static' + extendsPart + ' {');
        if (workArray(entry.functions, (func) => addFunction(func, func.parameters, writer))) {
            if (entry.events)
                writer.emptyLine();
        }

        if (workArray(entry.events, (event) => addEvent(event, writer)))
            writer.emptyLine();

        addProperties(entry.properties, writer);
        subNamespaces.forEach((ns) => writer.code(ns.split('.')[1] + ': ' + toUpperCamelCase(ns) + '.Static;'));

        writer.end('}');
        writer.end('}');
        fs.writeFileSync('lib/' + filename, writer.toString());
    } catch (e) {
        console.error('Error reading ' + namespace.file + ': ', e);
        throw e;
    }
}

function writeIndexFile(namespaces: ImportedNamespace[]) {
    console.log('- index.ts');
    const writer = new CodeWriter();
    namespaces.forEach((ns) => {
        if (ns.entry.namespace.indexOf('.') === -1)
            writer.code('import { ' + toUpperCamelCase(ns.entry.namespace) + ' } from "./' + ns.entry.namespace + '";');
    });
    namespaces.forEach((ns) => {
        writer.code('export { ' + toUpperCamelCase(ns.entry.namespace) + ' } from "./' + ns.entry.namespace.replace(/\./g, '_') + '";');
    });

    writer.emptyLine();
    writer.begin('export interface Browser {');
    namespaces.forEach((ns) => {
        if (ns.entry.namespace.indexOf('.') === -1)
            writer.code(ns.entry.namespace + ': ' + toUpperCamelCase(ns.entry.namespace) + '.Static;');
    });
    writer.end('}');

    writer.code('export declare const browser: Browser;');
    writer.emptyLine();
    fs.writeFileSync('lib/index.d.ts', writer.toString());
}

try {
    console.log('importing files: ');
    const namespaces = importAndFixAll();
    if (namespaces) {
        console.log('removing old definitions: ');
        rimraf.sync('./lib/*.d.ts');
        console.log('generating new definitions: ');
        const namespaceKeys = namespaces.map((ns) => ns.entry.namespace);
        namespaces.forEach((ns) => {
            const prefix = ns.entry.namespace + ".";
            writeNamespace(ns, namespaceKeys.filter((key) => key.startsWith(prefix)));
        });
        writeIndexFile(namespaces);

        console.log('--------------------');
        console.log('All definitions generated!');
    }
} catch (e) {
    console.error(e);
}

//fixme: remove export namespace?
//fixme: remember shorter/better name for extracted parameter objects and when all types are extracted, use the better name if no conflicts exist
//fixme: descriptions might include refs: $(ref:runtime.lastError)
