import fs from "fs";

import { Assert } from "./assert";

function getQuoteLength(text: string, start: number, c: string) {
    let i = start;
    for (; i < text.length; i++) {
        const cc = text[i];
        if (cc === "\\") i++;
        else if (cc === c) break;
    }
    return i - start;
}

function getSingleLineCommentLength(text: string, start: number) {
    let i = start;
    for (; i < text.length; i++) {
        if (text[i] === "\r" || text[i] === "\n") break;
    }
    return i - start;
}

function getMultiLineCommentLength(text: string, start: number) {
    let i = start;
    for (; i < text.length; i++) {
        if (text[i] === "*" && text[i + 1] === "/") {
            i++;
            break;
        }
    }
    return i - start;
}

function splitComments(text: string) {
    const json: string[] = [];
    const comments = [];
    let start = 0;
    let count = 0;
    function addJson(s: string) {
        if (s.trim()) json.push(s);
    }
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        const nc = text[i + 1];
        if (c === "/" && nc === "/") {
            if (count) addJson(text.substr(start, count));
            const len = getSingleLineCommentLength(text, i + 1);
            if (!json.length) comments.push(text.substr(i, len + 1));
            i += len + 1;
            start = i + 1;
            count = 0;
        } else if (c === "/" && nc === "*") {
            if (count) addJson(text.substr(start, count));
            const len = getMultiLineCommentLength(text, i + 1);
            if (!json.length) comments.push(text.substr(i, len + 2));
            i += len + 1;
            start = i + 1;
            count = 0;
        } else if (c === '"' || c === "'") {
            const len = getQuoteLength(text, i + 1, c);
            i += len + 1;
            count += len + 2;
        } else {
            count++;
        }
    }
    if (count) addJson(text.substr(start, count));
    return {
        comments: comments.join("\n"),
        json: json.join(""),
    };
}

export function readSchemaFile(folder: string, file: string) {
    const assert = new Assert("readSchemaFile");
    try {
        const value = fs.readFileSync(`./${folder}/${file}`, { encoding: "utf-8" });
        const split = splitComments(value);
        const json: any = JSON.parse(split.json);
        assert.typeOf(json, "array");
        return { file, json, comments: split.comments };
    } catch (e) {
        console.error(`Error reading ${file}: `, e);
        throw e;
    }
}

export type SchemaFileData = ReturnType<typeof readSchemaFile>;

export function readAllSchemaFiles() {
    return fs.readdirSync("./schemas").map((file) => readSchemaFile("schemas", file));
}
