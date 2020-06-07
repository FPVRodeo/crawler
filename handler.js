'use strict';

const HobbyRcCrawler = require('./crawlers/hobbyrc/crawler');
const HobbyRcScraper = require('./crawlers/hobbyrc/scraper');

// TODO: Break these to their own functions?

module.exports.parse = (event, context, callback) => {
    // callback(error|null, {data});
};

module.exports.crawl = (event, context, callback) => {

};

/*const hobbyrc = new HobbyRcCrawler();
hobbyrc.fetchUrls().then((urls) => {
    urls.map(url => {
        console.log(url.loc);
    });
    console.error(`Total URLs to parse ${urls.length}`)
}).catch((error) => {
    console.error('An Error has occurred');
    console.error(error);
});*/

const hobbyrcScrape = new HobbyRcScraper();
hobbyrcScrape.getProduct('https://www.hobbyrc.co.uk/jumper-t16-pro-transmitter-with-hall-sensor-gimbals').then((data) => {
   console.log(data);
}).catch((error) => {
   console.error(error);
});