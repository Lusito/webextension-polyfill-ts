#! /usr/bin/env node
import got from 'got';
import fs from 'fs';
import rimraf from 'rimraf';

async function getJsonFileList(url: string) {
    try {
        const response = await got(url);
        const lines = response.body.split('\n');
        return lines.filter((l) => l.endsWith('.json') && !l.endsWith(" telemetry.json")).map((l) => url + l.split(' ')[2]);
    } catch (error) {
        console.error(error.response.body);
        return null;
    }
}

async function downloadFile(url: string) {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    try {
        console.log('downloading ' + filename);
        const response = await got(url);
        fs.writeFileSync("./schemas/" + filename, response.body);
        console.log(filename + ' saved');
    } catch (error) {
        console.error('Error downloading ' + filename + ': ' + error.response.body);
    }
}

const baseURL = 'https://hg.mozilla.org/integration/autoland/raw-file/tip/';
Promise.all([
    getJsonFileList(baseURL + 'toolkit/components/extensions/schemas/'),
    getJsonFileList(baseURL + 'browser/components/extensions/schemas/')
]).then((result) => {
    const files = result.reduce<string[]>((dest, files) => files ? dest.concat(files) : dest, []);

    rimraf.sync('./schemas');
    fs.mkdirSync('./schemas');
    Promise.all(files.map(downloadFile)).then((result) => {
        console.log('done');
    });
});
