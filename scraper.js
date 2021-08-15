'use strict';

const S3 = require('./utils/s3');

const HobbyRcScraper = require('./crawlers/hobbyrc/scraper');
const UmtScraper = require('./crawlers/umt/scraper');

class DoScrape {
    constructor(scraper, event, s3Prefix, context) {
        this.scraper = scraper;
        this.event = event;
        this.s3Prefix = s3Prefix;
        this.context = context;
    }

    async run() {
        const record = this.event["Records"][0];
        if (!record.hasOwnProperty('body')) {
            throw Error('Invalid Event Message');
        }

        console.log(`Total Records pulled: `,this.event["Records"].length);

        try {
            const { url, crawlID } = JSON.parse(record["body"]);
            console.log(`Getting ready to process: ${url} - ${crawlID}`);

            const s3 = new S3(process.env.AWS_REGION, process.env.SCRAPER_BUCKET);

            let tidyUrl = url.endsWith('/') ? url.slice(0, -1) : url;
            let page = [...tidyUrl.matchAll(/^https:\/\/.*\/([a-z\-0-9_]*)$/g)][0][1];
            let date = new Date();
            let s3Key = `${this.s3Prefix}/${date.getFullYear()}/${(date.getMonth()+1).toString().padStart(2,'0')}/${crawlID}/${page}.json`;

            const fileExists = await s3.fileExists(s3Key);
            if (fileExists) {
                console.log(`${s3Key} - File already processed`);
                return {};
            }

            const product = await this.scraper.getProduct(url);

            if (product === null) {
                console.log(`We can't find a product - OH NOES!`);
                return {};
            }

            console.log(`Retrieved information for product: `, product.name);

            const upload = await s3.upload(s3Key, JSON.stringify(product));

            console.log(`Uploading Product to S3`,upload);
            return {};
        } catch (e) {
            console.error(e);
            throw Error(e);
        }
    }
}

module.exports.hobbyRcScrape = async (event, context) => {
    const scraper = new HobbyRcScraper();
    const scrape = new DoScrape(scraper, event, 'HobbyRc', context);
    return await scrape.run();
};

module.exports.umtScrape = async (event, context) => {
    const scraper = new UmtScraper();
    const scrape = new DoScrape(scraper, event, 'UnmannedTech', context);
    return await scrape.run();
};
