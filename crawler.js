'use strict';

const { SQSClient, SendMessageBatchCommand } = require('@aws-sdk/client-sqs');
const { v4: uuidv4 } = require('uuid');

const HobbyRcCrawler = require('./crawlers/hobbyrc/crawler');
const UmtCrawler = require('./crawlers/umt/crawler');
const DroneislifeCrawler = require('./crawlers/droneislife/crawler');

module.exports.hobbyRcCrawl = async (event, context) => {
   const hobbyrc = new HobbyRcCrawler();
   const sqs = new SQSClient({region: process.env.AWS_REGION});
   const crawlID = uuidv4();

    try {
        let fetchUrls = await hobbyrc.fetchUrls();

        let messages = fetchUrls.slice(200,300).map((url, i) => {
                let msg = {};
                msg.Id = `msg_${i}`;
                msg.MessageBody = JSON.stringify({"url": url.loc, "crawlID": crawlID});
                return msg;
        });

        console.log(`Total URLs to process: ${messages.length}`);

        let requests = [];
        for (let i = 0; i < messages.length;) {
            let params = {
                QueueUrl: process.env.HOBBYRC_QUEUE,
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
        console.error('[ERROR] Crawl - HobbyRC')
        console.error(e);
        throw '[ERROR] Crawl - HobbyRC';
    }
};
