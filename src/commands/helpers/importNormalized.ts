import * as fs from 'fs';
import { readSchemaFile } from './readSchemaFile';
import { SchemaEntry } from './types';
import { fixes } from './fixes';

function isExtensionNamespace(entry: SchemaEntry) {
    if (entry.types && entry.types.find((t) => !!t.$extend))
        return true;
    if (Object.getOwnPropertyNames(entry).length === 2 && entry.permissions)
        return entry.namespace !== 'privacy';
    return false;
}

export class ImportedNamespace {
    public readonly file: string;
    public comments: string = '';
    public readonly entry: SchemaEntry;
    public constructor(file: string, comments: string, entry: SchemaEntry) {
        this.file = file;
        this.entry = entry;
        const lines = comments.split('\n');
        this.comments = lines.map((line)=> {
            line = line.trim();
            if(line.startsWith('// ') || line.startsWith('/* '))
                return line.substr(3).trim();
            else if(line.startsWith('* ')) {
                if(line.endsWith('*/'))
                    return line.substr(2, line.length-4).trim();
                else
                    return line.substr(2).trim();
            }
            else if(line === '')
                return '';
            else
                throw 'Unknown comment style:' + line + comments;
        }).join('\n');
    }

    public appendComments(comments:string) {
        if(this.comments.indexOf(comments) === -1)
            this.comments += '\n\n' + comments;
    }
}

export class ImportedNamespaces {
    public readonly namespaceExtensions: ImportedNamespace[] = [];
    public readonly namespaces: { [s: string]: ImportedNamespace } = {};

    public getSubNamespaces(namespace: string) {
        const result = [];
        const prefix = namespace + '.';
        for (const key in this.namespaces) {
            if (key.startsWith(prefix))
                result.push(key);
        }
        return result;
    }

    public importFile(data: { file: string, json: SchemaEntry[], comments: string }) {
        if (data.file === 'native_manifest.json')
            return;
        data.json.forEach((entry) => {
            if (entry.namespace === 'test')
                return;
            if (isExtensionNamespace(entry)) {
                this.namespaceExtensions.push(new ImportedNamespace(data.file, data.comments, entry));
                return;
            }
            if (this.namespaces.hasOwnProperty(entry.namespace))
                throw 'Namespace already exists: ' + entry.namespace;
            this.namespaces[entry.namespace] = new ImportedNamespace(data.file, data.comments, entry);
        });
    }
}

export function importAndFixAll() {
    const result = new ImportedNamespaces();
    try {
        const files = fs.readdirSync('./schemas');
        files.map(readSchemaFile).forEach((data) => {
            console.log('- ' + data.file);
            result.importFile(data);
        });
    } catch (e) {
        console.error('Error:', e);
        return null;
    }
    console.log('--------------------');
    for(let i=0; i<fixes.length; i++) {
        const fix = fixes[i];
        try {
            console.log(fix.name);
            fix.apply(result);
        } catch(e) {
            console.error('Error:', e);
            return null;
        }
    }
    console.log('--------------------');
    return result;
}
