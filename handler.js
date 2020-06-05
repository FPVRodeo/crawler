'use strict';

// TODO: Break these to their own functions?

module.exports.parse = (event, context, callback) => {
    // callback(error|null, {data});
};

module.exports.crawl = (event, context, callback) => {

};

const hobbyrcCrawler = require('./crawlers/hobbyrc/crawler.js');
const hobbyrc = new hobbyrcCrawler();
hobbyrc.startCrawl().then((data) => {
    console.log(data.urlset.url[0]);
    /* Schema from above
    {
      loc: 'https://www.hobbyrc.co.uk/popular-manufacturers',
      changefreq: 'weekly',
      lastmod: '2015-04-28'
    }
     */
}).catch((error) => {
    console.log(error);
});
