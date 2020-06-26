import fs from "fs";

import { typeById } from "./types";
import { assertType } from "./assert";

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
        if (text[i] === "\n") break;
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
    const json = [];
    const comments = [];
    let start = 0;
    let count = 0;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        const nc = text[i + 1];
        if (c === "/" && nc === "/") {
            if (count) json.push(text.substr(start, count + 1));
            const len = getSingleLineCommentLength(text, i + 1);
            comments.push(text.substr(i, len + 1));
            i += len + 1;
            start = i + 1;
            count = 0;
        } else if (c === "/" && nc === "*") {
            if (count) json.push(text.substr(start, count + 1));
            const len = getMultiLineCommentLength(text, i + 1);
            comments.push(text.substr(i, len + 2));
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
    if (count) json.push(text.substr(start, count + 1));
    return {
        comments: comments.join("\n"),
        json: json.join(""),
    };
}

export function readSchemaFile(file: string) {
    try {
        const value = fs.readFileSync(`./schemas/${file}`, { encoding: "utf-8" });
        const split = splitComments(value);
        const json: any = JSON.parse(split.json);
        assertType(json, "array");
        json.forEach((e: any) => {
            if (e.types)
                e.types.forEach((t: any) => {
                    if (t.id) typeById[`${e.namespace}.${t.id}`] = t;
                });
        });
        return { file, json, comments: split.comments };
    } catch (e) {
        console.error(`Error reading ${file}: `, e);
        throw e;
    }
}
