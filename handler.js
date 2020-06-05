'use strict';

// TODO: Break these to their own functions?

module.exports.parse = (event, context, callback) => {
    // callback(error|null, {data});
};

module.exports.crawl = (event, context, callback) => {

};

const HobbyRcCrawler = require('./crawlers/hobbyrc/crawler.js');
const hobbyrc = new HobbyRcCrawler();
hobbyrc.startCrawl().then((data) => {
    /* Schema from above
    {
      loc: 'https://www.hobbyrc.co.uk/popular-manufacturers',
      changefreq: 'weekly',
      lastmod: '2015-04-28'
    }
     */
    const urls = data.urlset.url;

    urls.map(value => {
        console.log(value.loc);
    });
    console.log(`Total URLs to parse ${urls.length}`)
}).catch((error) => {
    console.log(error);
});
