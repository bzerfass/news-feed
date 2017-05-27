# news-feed

## Installation
```bash
yarn add news-feed
```

## Usage
```js

import newsFeed from 'news-feed';


const feed = newsFeed('http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml');

feed.load((result) => {
    if (!result.error) {
        console.log(result);
    }
});
```
