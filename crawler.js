'use strict';

const AWS = require('awssdk');

const HobbyRcCrawler = require('./crawlers/hobbyrc/crawler');
const UmtCrawler = require('./crawlers/umt/crawler');
const DroneislifeCrawler = require('./crawlers/droneislife/crawler');

module.exports.hobbyRcCrawl = async (event, context, callback) => {
   const hobbyrc = new HobbyRcCrawler();

    try {
        let urls = await hobbyrc.fetchUrls();


    } catch (e) {
        console.error('[ERROR] Crawl - HobbyRC')
    }
};
