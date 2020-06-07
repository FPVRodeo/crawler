'use strict';

const HobbyRcCrawler = require('./crawlers/hobbyrc/crawler');
const HobbyRcScraper = require('./crawlers/hobbyrc/scraper');
const axios = require('axios').default;

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
hobbyrcScrape.getProduct('https://www.hobbyrc.co.uk/emax-rs2205-2300kv-red-bottom-racespec-motor').then((data) => {
   // console.log(data);
   const appSearch = axios.create({
      headers: {
          'Authorization': 'Bearer [redacted]',
          'Content-type': 'application/json',
      },
   }).post('http://localhost:3002/api/as/v1/engines/fpv-rodeo/documents', JSON.stringify(data))
       .then((response) => {
         console.log(response);
         console.log(response.status);
         console.log(response.data);
      })
       .catch((response) => {
           console.log(response);
           console.log(response.status);
           console.log(response.data);
           console.log('RESPONSE DATA',response.response);
       });
}).catch((error) => {
   console.error(error);
});