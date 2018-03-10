import * as fs from 'fs';

export function toUpperCamelCase(value: string) {
    return value[0].toUpperCase() + value.substr(1).replace(/[\-|_\.][a-z]/g, (m) => m[1].toUpperCase());
}

export function lowerFirstChar(value: string) {
    return value[0].toLowerCase() + value.substr(1);
}


export function filterUnique(e: any, i: number, a: any[]) {
    return a.indexOf(e) === i;
}

export function workMap<T>(map: { [s: string]: T }|undefined, callback:(val:T, key:string) => void) {
    if(map && Object.getOwnPropertyNames(map).length) {
        for(const key in map)
            callback(map[key], key);
        return true;
    }
    return false;
}

export function modifyMap<T>(map: { [s: string]: T }|undefined, callback:(val:T, key:string) => T) {
    if(map && Object.getOwnPropertyNames(map).length) {
        for(const key in map)
            map[key] = callback(map[key], key);
        return true;
    }
    return false;
}

export function workArray<T>(list:T[]|undefined, callback:(val:T, i:number) => void) {
    if(list && list.length) {
        list.forEach(callback);
        return true;
    }
    return false;
}

export function modifyArray<T>(list:T[]|undefined, callback:(val:T, i:number) => T) {
    if(list && list.length) {
        list.forEach((e,i)=>list[i] = callback(e, i));
        return true;
    }
    return false;
}

export function readJsonFile(file: string) {
    try {
        const value = fs.readFileSync(file, { encoding: 'utf-8' });
        return JSON.parse(value);
    } catch (e) {
        console.error('Error reading ' + file + ': ', e);
        throw e;
    }
}
