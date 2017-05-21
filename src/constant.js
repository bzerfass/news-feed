/**
 *
 * Generic Feed Structure
 * Based on
 * RSS: http://cyber.harvard.edu/rss/rss.html
 * Atom: https://tools.ietf.org/html/rfc4287
 * JSON: https://jsonfeed.org/version/1
 */

export const FEED = {
    type: null,
    title: null,
    description: null,
    website: null,
    url: null,
    author: {
        url: null,
        name: null,
    },
    categories: [],
    icon: null,
    favicon: null,
    items: [],
};

export const ITEM = {
    date: null,
    title: null,
    url: null,
    text: null,
    content: null,
    author: {
        url: null,
        name: null
    },
    categories: [],
    image: null,
};
