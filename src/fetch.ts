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
    } catch (error: any) {
        console.error(error.response.body);
        return null;
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
    } catch (error: any) {
        console.error(`Error downloading ${filename}: ${error.response.body}`);
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
    } catch (error: any) {
        console.error(`Error downloading ${filename}: ${error.response?.body || error.message}`);
    }
}

const baseURL = "https://hg.mozilla.org/integration/autoland/raw-file/tip/";
const baseChromeURL =
    "https://chromium.googlesource.com/chromium/src/+/master/chrome/common/extensions/api/{FILENAME}?format=TEXT";
const chromeFiles = ["declarative_content.json"].map((filename) => baseChromeURL.replace("{FILENAME}", filename));

Promise.all([
    getJsonFileList(`${baseURL}toolkit/components/extensions/schemas/`),
    getJsonFileList(`${baseURL}browser/components/extensions/schemas/`),
]).then((result) => {
    const files = result.reduce<string[]>((dest, files2) => (files2 ? dest.concat(files2) : dest), []);

    rimraf.sync("./schemas");
    fs.mkdirSync("./schemas");
    Promise.all([...files.map(downloadFile), ...chromeFiles.map(downloadChromeFile)]).then(() => {
        console.log("done");
    });
});
