const axios = require('axios').default;
const scraper = require('html-metadata');
const cheerio = require('cheerio');

class BaseScraper {
    constructor(props) {
        const validType = {
            'microdata': scraper.parseSchemaOrgMicrodata,
            'json-ld': scraper.parseJsonLd,
        };

        if (!validType.hasOwnProperty(props.type)) {
            throw new Error(`Invalid Scraper Type "${props.type}"`);
        }

        this.scraper = validType[props.type];
    }

    async _scrapeUrl(url) {
        const response = await this._fetchData(url);
        const $ = cheerio.load(response.data);
        return await this.scraper($);
    }

    async _fetchData(url) {
        return await axios.get(url);
    }
}

module.exports = BaseScraper;