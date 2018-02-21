import request from 'request';
import xml2js from 'xml2js';
import { parseJSON, parseATOM, parseXML } from './utils';

export default class NewsFeed {
    constructor(url) {
        this.url = url;
        this.type = null;
    }
    load() {
        return new Promise((resolve, reject) => {
            // eslint-disable-next-line consistent-return
            request({ url: this.url }, (error, response, body) => {
                if (error || response.statusCode !== 200) {
                    return reject({ error: `Bad status code: ${response.statusCode}` });
                }
                this.type = response.headers['content-type'].split(';')[0].trim();

                switch (this.type) {
                    case 'application/json':
                        return resolve(parseJSON(JSON.parse(body), this.type));
                    case 'application/xml':
                    case 'application/rss+xml':
                    case 'application/x-rss+xml':
                    case 'application/atom+xml':
                    case 'text/xml': {
                        const parse = new xml2js.Parser({
                            trim: false,
                            normalize: true,
                            mergeAttrs: true,
                        });
                        parse.addListener('error', (err) => reject({ error: err }));
                        parse.parseString(body, (er, result) => {
                            if (er) {
                                reject({ error: er });
                            }

                            return resolve(result.rss
                                ? parseXML(result.rss, this.type)
                                : parseATOM(result.feed, this.type),
                            );
                        });
                        break;
                    }
                    default:
                        return reject({ error: `${this.type}, not a valid feed type` });
                }
            });
        });
    }
}
