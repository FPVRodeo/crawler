'use strict';
/*
 * This covers the working crawlers and scrapers, which should run, if not we've got an issue and they need updating.
 * Just uncomment the sections you want to play with.
 */
const HobbyRcCrawler = require('./crawlers/hobbyrc/crawler');
const HobbyRcScraper = require('./crawlers/hobbyrc/scraper');
const UmtCrawler = require('./crawlers/umt/crawler');
const UmtScraper = require('./crawlers/umt/scraper');
const DroneislifeCrawler = require('./crawlers/droneislife/crawler');
const DroneislifeScraper = require('./crawlers/droneislife/scraper');

// TODO: Break these to their own functions?

module.exports.parse = (event, context, callback) => {
    // callback(error|null, {data});
};

module.exports.crawl = (event, context, callback) => {

};

/*const DILScrape = new DroneislifeScraper();

let DILTest = [
    'https://droneislife.co.uk/fpv/video-transmitters/TBS-Unify-Pro-5G8-HV-Race-2',
    'https://droneislife.co.uk/accessories/swag/ethix-black-cap',
    'https://droneislife.co.uk/accessories/Ethix-Tempered-ND16-Filter',
    'https://droneislife.co.uk/accessories/landingpads',
].map((url) => {
    return DILScrape.getProduct(url);
});
Promise.all(DILTest).then((data) => {
    console.log(data);
}).catch((error) => {
    console.error('An Error has occurred');
    console.error(error);
});*/

/*const DILCrawl = new DroneislifeCrawler();
DILCrawl.fetchUrls().then((urls) => {

    urls.forEach((url) => {
        console.log(url);
    });

    console.log(`Total Urls ${urls.length}`);
}).catch((error) => {
    console.error('An Error has occurred');
    console.error(error);
});*/

const UMTScrape = new UmtScraper();
[
    'https://www.unmannedtechshop.co.uk/product/lumenier-micro-axii-stubby-mmcx-5-8ghz-antenna/?attribute_pa_antenna-polarisation=rhcp',
    'https://www.unmannedtechshop.co.uk/product/jumper-t16-plus-radio-transmitter/',
].forEach((url) => {
    UMTScrape.getProduct(url).then((product) => {
        console.log(product);
    }).catch((error) => {
       console.error('An Error has occurred') ;
       console.error(error);
    });
});
const umt = new UmtCrawler();
umt.fetchUrls().then((urls) => {
    urls.forEach((url) => {
       console.log(url);
    });

    console.log(`Total Urls: ${urls.length}`);
}).catch((error) => {
    console.error('An Error has occurred');
    console.error(error);
});

/*const hobbyrc = new HobbyRcCrawler();
hobbyrc.fetchUrls().then((urls) => {
    urls.forEach(url => {
        console.log(url.loc);
    });
    console.error(`Total URLs to parse ${urls.length}`)
}).catch((error) => {
    console.error('An Error has occurred');
    console.error(error);
});*/

/*const hobbyrcScrape = new HobbyRcScraper();
[
    'https://www.hobbyrc.co.uk/jumper-t16-pro-transmitter-with-hall-sensor-gimbals',
    'https://www.hobbyrc.co.uk/emax-rs2205-2300kv-red-bottom-racespec-motor',
    'https://www.hobbyrc.co.uk/hobbywing-xrotor-race-pro-2306-2700kv',
    'https://www.hobbyrc.co.uk/tbs-crossfire-nano-receiver-special-edition-5-pack',
    'https://www.hobbyrc.co.uk/tbs-crossfire-nano-receiver-special-edition',
    'https://www.hobbyrc.co.uk/armattan-badger-5-dji-edition-frame',
    'https://www.hobbyrc.co.uk/iflight-titan-dc5-5-fpv-frame-for-dji-air-unit',
    'https://www.hobbyrc.co.uk/frsky-xm-plus-eu-lbt-16ch-tiny-receiver-with-sbus',
].forEach((value => {
    hobbyrcScrape.getProduct(value).then((data) => {
        // console.log(data);
        const appSearch = axios.create({
            headers: {
                'Authorization': 'Bearer [redacted]',
                'Content-type': 'application/json',
            },
        }).post('http://localhost:3002/api/as/v1/engines/fpv-rodeo/documents', JSON.stringify(data))
            .then((response) => {
                // console.log(response);
                console.log(value, response.status);
                // console.log(response.data);
            })
            .catch((response) => {
                // console.log(response);
                console.log(value, response.status);
                // console.log(response.data);
                console.log('RESPONSE DATA',response.response);
            });
    }).catch((error) => {
        console.error(error);
    });
}));*/
