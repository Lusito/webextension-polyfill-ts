import fs from "fs";
import { readSchemaFile } from "./readSchemaFile";
import { SchemaEntry } from "./types";
import { applyFixes } from "./visitor";
import { fixes } from "../fixes";

const EXTENSION_NAMESPACE_FILES = ["menus_child.json", "user_scripts_content.json"];

export class ImportedNamespace {
    public readonly file: string;
    public readonly isExtension: boolean;
    public comments: string = "";
    public entry: SchemaEntry;
    public constructor(file: string, comments: string, entry: SchemaEntry) {
        this.file = file;
        this.entry = entry;
        const lines = comments.split("\n");
        this.comments = lines
            .map((line) => {
                line = line.trim();
                if (line.startsWith("// ") || line.startsWith("/* ")) return line.substr(3).trim();
                else if (line.startsWith("* ")) {
                    if (line.endsWith("*/")) return line.substr(2, line.length - 4).trim();
                    else return line.substr(2).trim();
                } else if (line === "") return "";
                else throw new Error("Unknown comment style:" + line + comments);
            })
            .join("\n");

        this.isExtension =
            EXTENSION_NAMESPACE_FILES.includes(file) ||
            !!(entry.types && entry.types.find((t) => !!t.$extend)) ||
            (Object.keys(entry).length === 2 && !!entry.permissions && entry.namespace !== "privacy");
    }

    public appendComments(comments: string) {
        if (this.comments.indexOf(comments) === -1) this.comments += "\n\n" + comments;
    }
}

export function importAndFixAll() {
    const namespaces: ImportedNamespace[] = [];
    try {
        const files = fs.readdirSync("./schemas");
        files.map(readSchemaFile).forEach((data) => {
            console.log("- " + data.file);
            if (data.file === "native_manifest.json") return;
            data.json.forEach((entry: SchemaEntry) => {
                if (entry.namespace === "test") return;
                const namespace = new ImportedNamespace(data.file, data.comments, entry);
                if (!namespace.isExtension) {
                    const ns = namespaces.find((ns) => !ns.isExtension && ns.entry.namespace === entry.namespace);
                    if (ns) throw new Error("Namespace already exists: " + entry.namespace + " in file: " + ns.file);
                }
                namespaces.push(namespace);
            });
        });
    } catch (e) {
        console.error("Error:", e);
        return null;
    }
    console.log("--------------------");
    const modified = applyFixes(namespaces, fixes);
    console.log("--------------------");
    return modified;
}
