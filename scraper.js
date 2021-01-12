'use strict';

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const HobbyRcScraper = require('./crawlers/hobbyrc/scraper');

module.exports.hobbyRcScrape = async (event, context) => {
    const record = event["Records"][0];
    if (!record.hasOwnProperty('body')) {
        throw Error('Invalid Event Message');
    }

    try {
        const { url, crawlID } = JSON.parse(record["body"]);
        console.log(`Getting ready to process: ${url} - ${crawlID}`);

        const hobbyRcScrape = new HobbyRcScraper();
        const product = await hobbyRcScrape.getProduct(url);
        console.log(`Retrieved information for product: `, product.name);
        let page = [...url.matchAll(/^https:\/\/.*\/([a-z\-0-9]*)$/g)][0][1];

        const s3 = new S3Client({region: process.env.AWS_REGION});
        const upload = await s3.send(new PutObjectCommand({
            Bucket: process.env.SCRAPER_BUCKET,
            Key: `HobbyRc/${crawlID}/${page}.json`,
            Body: JSON.stringify(product)
        }));

        console.log(`Uploading Product to S3`,upload);
        return {};
    } catch (e) {
        console.error(e);
        throw Error(e);
    }
};

