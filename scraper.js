'use strict';

const S3 = require('./utils/s3');

const HobbyRcScraper = require('./crawlers/hobbyrc/scraper');

module.exports.hobbyRcScrape = async (event, context) => {
    const record = event["Records"][0];
    if (!record.hasOwnProperty('body')) {
        throw Error('Invalid Event Message');
    }

    console.log(`Total Records pulled: `,event["Records"].length);

    try {
        const { url, crawlID } = JSON.parse(record["body"]);
        console.log(`Getting ready to process: ${url} - ${crawlID}`);

        const s3 = new S3(process.env.AWS_REGION, process.env.SCRAPER_BUCKET);

        let page = [...url.matchAll(/^https:\/\/.*\/([a-z\-0-9]*)$/g)][0][1];
        let date = new Date();
        let s3Key = `HobbyRc/${date.getFullYear()}/${(date.getMonth()+1).toString().padStart(2,'0')}/${crawlID}/${page}.json`;

        const fileExists = await s3.fileExists(s3Key);
        if (fileExists) {
            console.log(`${s3Key} - File already processed`);
            return {};
        }

        const hobbyRcScrape = new HobbyRcScraper();
        const product = await hobbyRcScrape.getProduct(url);

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
};

