#! /usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-unresolved
import fs from "fs";
import { rimraf } from "rimraf";

function handleError(res: Response) {
    if (!res.ok) throw new Error(`Fetch of ${res.url} was not OK!`);
    return res;
}

const toJson = (res: Response) => res.json();
const toText = (res: Response) => res.text();

async function getJsonFileList(url: string) {
    try {
        const response: Array<{ download_url: string }> = await fetch(url).then(handleError).then(toJson);
        return response.map((v) => v.download_url).filter((v) => v.endsWith(".json") && !v.endsWith("telemetry.json"));
    } catch (error) {
        throw new Error(`Error downloading file list from ${url}: ${String(error)}`);
    }
}

async function downloadFile(url: string) {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    try {
        console.log(`downloading ${filename}`);
        const response = await fetch(url).then(handleError).then(toText);
        fs.writeFileSync(`./schemas/${filename}`, response);
        console.log(`${filename} saved`);
    } catch (error) {
        throw new Error(`Error downloading ${url}: ${(error as any)?.response?.body || String(error)}`);
    }
}

async function downloadFilesWorker(urls: string[]) {
    for (let url = urls.pop(); url; url = urls.pop()) {
        // eslint-disable-next-line no-await-in-loop
        await downloadFile(url);
    }
}

async function downloadChromeFile(url: string) {
    const parts = url.split("?")[0].split("/");
    const filename = parts[parts.length - 1];
    try {
        console.log(`downloading ${filename}`);
        const response = await fetch(url).then(handleError).then(toText);
        const buffer = Buffer.from(response, "base64");
        fs.writeFileSync(`./schemas/${filename}`, buffer.toString("utf8"));
        console.log(`${filename} saved`);
    } catch (error) {
        throw new Error(`Error downloading ${url}: ${(error as any)?.response?.body || String(error)}`);
    }
}

const maxDownloadWorkers = 10;
const baseURL = "https://api.github.com/repos/mozilla-firefox/firefox/contents/";
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
        const mozillaFiles = result.flat();
        const mozillaWorkers = Array.from({ length: maxDownloadWorkers }, () => downloadFilesWorker(mozillaFiles));
        await Promise.all([...mozillaWorkers, ...chromeFiles.map(downloadChromeFile)]);
        console.log("done");
    } catch (e) {
        console.log("Failed fetching files", e);
        process.exit(-1);
    }
}

run();
