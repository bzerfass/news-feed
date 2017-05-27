import request from 'request';
import xml2js from 'xml2js';
import { parseJSON, parseATOM, parseXML } from './utils';

export default class NewsFeed {
    constructor(url) {
        this.url = url;
        this.type = null;
    }
    load(cb) {
        request({
            url: this.url,
        }, (error, response, body) => {
            if (error || response.statusCode !== 200) {
                cb({ error: `Bad status code: ${response.statusCode}` });
            }

            this.type = response.headers['content-type'].split(';')[0].trim();

            switch (this.type) {
                case 'application/json':
                    cb(parseJSON(JSON.parse(body), this.type));
                    break;
                case 'application/xml':
                case 'application/rss+xml':
                case 'application/atom+xml':
                case 'text/xml': {
                    const parse = new xml2js.Parser({
                        trim: false,
                        normalize: true,
                        mergeAttrs: true,
                    });
                    parse.addListener('error', (err) => cb({ erro: err }));
                    parse.parseString(body, (er, result) => {
                        if (er) {
                            cb({ error: er });
                        }

                        cb(result.rss ? parseXML(result.rss) : parseATOM(result.feed));
                    });
                    break;
                }
                default:
                    cb({ error: `${this.type}, not a valid feed type` });
            }
        });
    }
}
