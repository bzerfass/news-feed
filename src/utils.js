import { FEED, ITEM } from './constant';

/* eslint-disable no-mixed-operators, no-nested-ternary */
export function parseJSON(data, type) {
    FEED.type = type;
    FEED.title = data.title;
    FEED.description = data.description || null;
    FEED.website = data.home_page_url || null;
    FEED.url = data.feed_url || null;
    FEED.author.url = data.author && data.author.url || null;
    FEED.author.name = data.author && data.author.name || null;
    FEED.categories = data.tags || [];
    FEED.icon = data.icon || null;
    FEED.favicon = data.favicon || `https://www.google.com/s2/favicons?domain_url=${FEED.url}`;

    const items = data.items.map((item) => {
        return Object.assign({}, ITEM, {
            date: item.date_published,
            url: item.url || item.external_url || null,
            title: item.title || null,
            content: item.content_html || null,
            text: item.content_text || item.summary || parseHTML(item.content_html) || null,
            author: Object.assign(ITEM.author, {
                url: item.author && item.author.url || FEED.author.url || null,
                name: item.author && item.author.url || FEED.author.name || null,
            }),
            image: item.image || item.banner_image || null,
            categories: item.tags || [],
        });
    });

    FEED.items = items;
    return FEED;
}

export function parseXML(data, type) {
    let { channel } = data;
    channel = channel[0];

    FEED.type = type;
    FEED.title = channel.title ? channel.title[0] : null;
    FEED.description = channel.descriptions ? channel.descriptions[0] : null;
    FEED.website = channel.link ? channel.link[0] : null;

    FEED.url = channel['atom:link'] && channel['atom:link'][0] ? channel['atom:link'][0].href[0] :
        channel['atom10:link'] && channel['atom10:link'][0] ? channel['atom10:link'][0].href[0] : FEED.website;

    FEED.categories = channel.category || null;

    FEED.icon = channel.image && channel.image[0] ? channel.image[0].url : null;
    FEED.favicon = channel.favicon ? channel.favicon[0] : `https://www.google.com/s2/favicons?domain_url=${FEED.url}`;

    const items = channel.item.map((item) => {
        return Object.assign({}, ITEM, {
            date: item.pubDate ? item.pubDate[0] : null,
            url: item.link ? item.link[0] : null,
            title: item.title ? item.title[0] : null,
            text: item.description ? parseHTML(item.description[0]) : null,
            content: item.description ? item.description[0] : null,
            author: Object.assign(ITEM.author, {
                name: item['dc:creator'] ? item['dc:creator'][0] : null,
            }),
            image: parseXMLImage(item['media:thumbnail'], item['media:content'], item['media:group'], item.description),
            categories: item.category || null,
        });
    });

    FEED.items = items;
    return FEED;
}

function parseXMLImage(thumbnail, content, group, html) {
    if (thumbnail && thumbnail[0] && thumbnail[0].url && thumbnail[0].url.length > 0) {
        return thumbnail[0].url[0];
    } else if (content && content[0] && content[0].url && content[0].url.length > 0) {
        return content[0].url[0];
    } else if (group && group[0]) {
        return parseXMLImage(group[0]['media:thumbnail'], group[0]['media:content'], null, html);
    } else if (html && html[0]) {
        return parseImage(html[0]);
    }
    return null;
}

export function parseATOM(data, type) {
    FEED.type = type;
    FEED.title = data.title ? data.title[0] : null;
    FEED.description = data.subtitle ? data.subtitle[0] : null;
    FEED.website = data.link ? data.link[0].href : null;
    FEED.url = data['atom:link'] && data['atom:link'][0] ? data['atom:link'][0].href[0] :
        data['atom10:link'] && data['atom10:link'][0] ? data['atom10:link'][0].href[0] : FEED.website;

    FEED.icon = data.logo ? data.logo : null;
    FEED.categories = data.category ? data.category.map((item) => item.term) : null;

    const items = data.entry.map((item) => {
        return Object.assign({}, ITEM, {
            date: item.updated ? item.updated[0] : null,
            url: item.link ? item.link[0].href : null,
            title: item.title ? item.title[0] : null,
            author: Object.assign(ITEM.author, {
                url: item.author ? item.author[0].uri : null,
                name: item.author ? item.author[0].name : null,
            }),
            categories: item.category ? item.category.map((cat) => cat.term) : null,
            text: item.content ? (item.content[0] && item.content[0]._ ?
                parseHTML(item.content[0]._) : null) : null,
            content: item.content ? (item.content[0] && item.content[0]._ ?
                item.content[0]._ : null) : null,
            image: item.content ? (item.content[0] && item.content[0]._ ?
                parseImage(item.content[0]._) : null) : null,
        });
    });

    FEED.items = items;
    return FEED;
}

export function parseHTML(html) {
    return html ? html.replace(/<\/?[^>]+(>|$)/g, '').replace(/\r?\n|\r/g, '').trim() : null;
}


export function parseImage(html) {
    const regex = /<img[^>]+src="([^">]+)/g;
    const result = regex.exec(html);
    return (result && result[1]) ? result[1] : null;
}
