import fs from 'fs'
import path from 'path'

require('./lib/Array')
require('./lib/Bigint')
require('./lib/Boolean')
require('./lib/Generator')
require('./lib/Number')
require('./lib/Object')
require('./lib/String')

import https from 'https'
import { json } from 'stream/consumers'

interface HTTPError {
    code: string,
    errno:number,
    hostname: string,
    syscall: string,
    message: string,
    stack: string
}

export function httpsGet(url: string,
        callback: (data: Buffer) => void,
        errorCallback?: (e: HTTPError) => void) {
    const req = https.request(url, res => res.on('data', callback))
    req.on('error', errorCallback ?? (e => console.error(e)))
    req.end()
}
export function httpsGetJSON(url: string,
        callback: (data: Object) => void,
        errorCallback?: (e: HTTPError) => void) {
    httpsGet(url, d => callback(JSON.parse(d.toString())), errorCallback)
}

export function Range(start: number, stop: number) {
    const x = [start, stop].sort((a,b) => a-b)
    return Array.from({length: x[1] - x[0] + 1}, (_, i) => x[0] + i)
}

export class Files {
    static ReadFile(localpath: string): string {
        return Files.ReadAllLines(localpath).join('\n')
    }
    static ReadAllLines(localpath: string): string[] {
        return (fs.readFileSync(path.join(__dirname, localpath), 'utf8') as string)
            .replaceAll('\r', '')
            .SplitLines()
            .filter(l => !l.startsWith('//'))
            .map(l => l.trim())
    }
}

export abstract class Sorts {
    static LeastFirst = (a: number, b: number) => a - b
    static GreatestFirst = (a: number, b: number) => b - a
    static Alphabetical = (a: string, b: string) => a.localeCompare(b)
}

// require('./ProjectEuler')
// require('./Advent2020')
// require('./Advent2021')
// require('./wordle')
// require('./Linguistics')
// require('./geology')
// require('./Lexer')
// require('./Compiler')
// require('./Emulator')


// httpsGetJSON('https://api.wwdt.me/v1.0/shows/recent', res => {
//     console.log(res)
    
// })


import RSS from 'rss';

let feed = new RSS({
    title: 'title',
    description: 'description',
    feed_url: 'http://example.com/rss.xml',
    site_url: 'http://example.com',
    image_url: 'http://example.com/icon.png',
    docs: 'http://example.com/rss/docs.html',
    managingEditor: 'Dylan Greene',
    webMaster: 'Dylan Greene',
    copyright: '2013 Dylan Greene',
    language: 'en',
    categories: ['Category 1','Category 2','Category 3'],
    pubDate: 'May 20, 2012 04:00:00 GMT',
    ttl: 60,
});

feed.item({
    title:  'item title',
    description: 'use this for the content. It can include html.',
    url: 'http://example.com/article4?this&that', // link to the item
    guid: '1123', // optional - defaults to url
    categories: ['Category 1','Category 2','Category 3','Category 4'], // optional - array of item categories
    author: 'Guest Author', // optional - defaults to feed author property
    date: 'May 27, 2012', // any format that js Date can parse.
});
var xml = feed.xml();

console.log(xml)