'use strict';

const { SQSClient, SendMessageBatchCommand } = require('@aws-sdk/client-sqs');
const { v4: uuidv4 } = require('uuid');

const HobbyRcCrawler = require('./crawlers/hobbyrc/crawler');
const UmtCrawler = require('./crawlers/umt/crawler');
const DroneislifeCrawler = require('./crawlers/droneislife/crawler');

class DoCrawl {
    constructor(crawler, queueUrl, jobName, event, context) {
        this.crawler = crawler;
        this.queueUrl = queueUrl;
        this.jobName = jobName;
        this.event = event;
        this.context = context;
    }

    async run() {
        const crawler = this.crawler;
        const sqs = new SQSClient({region: process.env.AWS_REGION});
        const crawlID = uuidv4();

        try {
            let fetchUrls = await crawler.fetchUrls();
            if (this.event == "testing") {
                fetchUrls = fetchUrls.slice(200,205);
            }
            let messages = fetchUrls.map((url, i) => {
                let msg = {};
                msg.Id = `msg_${i}`;
                msg.MessageBody = JSON.stringify({"url": url.loc, "crawlID": crawlID});
                return msg;
            });

            console.log(`Total URLs to process: ${messages.length}`);

            let requests = [];
            for (let i = 0; i < messages.length;) {
                let params = {
                    QueueUrl: this.queueUrl,
                    Entries: []
                };
                for (var j = 0; j < 10 && i < messages.length; i++ , j++) {
                    params.Entries.push(messages[i]);
                }
                requests.push(sqs.send(new SendMessageBatchCommand(params)));
            }

            let results = await Promise.all(requests);
            let failedMsgs = results.filter(msg => msg["Failed"] !== undefined);
            console.log(`Total SQS Requests Sent: ${results.length}`);
            console.log(`Total SQS Requests with Failed: ${failedMsgs.length}`);
            failedMsgs.forEach(msg => {
                console.log(msg["Failed"]);
            });

            return {
                "total_urls": messages.length,
                "total_sqs_req": results.length,
                "total_sqs_req_failed": failedMsgs.length
            };
        } catch (e) {
            console.error(`[ERROR] Crawl - ${this.jobName}`)
            console.error(e);
            throw `[ERROR] Crawl - ${this.jobName}`;
        }
    }
}

module.exports.hobbyRcCrawl = async (event, context) => {
    const hobbyrc = new HobbyRcCrawler();
    const crawl = new DoCrawl(hobbyrc, process.env.HOBBYRC_QUEUE, 'HobbyRC', event, context);
    return await crawl.run();
};

module.exports.umtCrawl = async (event, context) => {
    const crawler = new UmtCrawler();
    const crawl = new DoCrawl(crawler, process.env.UMT_QUEUE, 'Unmanned Tech', event, context);
    return await crawl.run();
};
