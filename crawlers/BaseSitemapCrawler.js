const parser = require('fast-xml-parser');
const axios = require('axios').default;

class BaseSitemapCrawler {
    constructor(props) {
        this.sitemap = props.sitemap;
    }

    async _startCrawl(url) {
        const response = await this._fetchData(url);
        if (parser.validate(response.data) !== true) {
            console.error('DATA INVALID!');
            throw new Error('DATA INVALID');
        }
        return parser.parse(response.data);
    }

    async _fetchData(url) {
        return await axios.get(url);
    }
}

module.exports = BaseSitemapCrawler;