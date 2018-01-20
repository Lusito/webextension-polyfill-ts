#! /usr/bin/env node
import * as fs from 'fs';
import { readSchemaFile } from './helpers/readSchemaFile';
import { SchemaEntry } from './helpers/types';
import { assertArray } from './helpers/assert';

function validateJson(data: { file: string, json: any }) {
    try {
        console.log(data.file);
        assertArray(data.json, SchemaEntry.validate);
    } catch (e) {
        console.error('Error reading ' + data.file + ': ', e);
        throw e;
    }
}
try {
    const files = fs.readdirSync('./schemas');
    files.map(readSchemaFile).forEach(validateJson);
    console.log('--------------------');
    console.log('All files are valid!');
} catch (e) {
}
