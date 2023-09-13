#! /usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-unresolved
import got from "got";
import fs from "fs";
import { rimraf } from "rimraf";

async function getJsonFileList(url: string) {
    try {
        const response = await got(url);
        const lines = response.body.split("\n");
        return lines
            .filter((l) => l.endsWith(".json") && !l.endsWith(" telemetry.json"))
            .map((l) => url + l.split(" ")[2]);
    } catch (error) {
        throw new Error(`Error downloading file list from ${url}: ${(error as any)?.response?.body || String(error)}`);
    }
}

async function downloadFile(url: string) {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    try {
        console.log(`downloading ${filename}`);
        const response = await got(url);
        fs.writeFileSync(`./schemas/${filename}`, response.body);
        console.log(`${filename} saved`);
    } catch (error) {
        throw new Error(`Error downloading ${url}: ${(error as any)?.response?.body || String(error)}`);
    }
}

async function downloadChromeFile(url: string) {
    const parts = url.split("?")[0].split("/");
    const filename = parts[parts.length - 1];
    try {
        console.log(`downloading ${filename}`);
        const response = await got(url);
        const buffer = Buffer.from(response.body, "base64");
        fs.writeFileSync(`./schemas/${filename}`, buffer.toString("utf8"));
        console.log(`${filename} saved`);
    } catch (error) {
        throw new Error(`Error downloading ${url}: ${(error as any)?.response?.body || String(error)}`);
    }
}

const baseURL = "https://hg.mozilla.org/integration/autoland/raw-file/tip/";
const baseChromeURL =
    "https://chromium.googlesource.com/chromium/src/+/main/chrome/common/extensions/api/{FILENAME}?format=TEXT";
const chromeFiles = ["declarative_content.json"].map((filename) => baseChromeURL.replace("{FILENAME}", filename));

async function run() {
    try {
        const result = await Promise.all([
            getJsonFileList(`${baseURL}toolkit/components/extensions/schemas/`),
            getJsonFileList(`${baseURL}browser/components/extensions/schemas/`),
        ]);

        rimraf.sync("./schemas");
        fs.mkdirSync("./schemas");
        await Promise.all([...result.flat().map(downloadFile), ...chromeFiles.map(downloadChromeFile)]);
        console.log("done");
    } catch (e) {
        console.log("Failed fetching files", e);
        process.exit(-1);
    }
}

run();
