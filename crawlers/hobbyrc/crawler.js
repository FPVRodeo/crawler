const parser = require('fast-xml-parser');
const axios = require('axios').default;

class HobbyrcCrawler {
    constructor() {
        // super(props);
        this.sitemap = 'https://www.hobbyrc.co.uk/sitemap.xml';
    }

    async startCrawl() {
        const response = await this.fetchData();
        if (parser.validate(response.data) !== true) {
            console.error('DATA INVALID!');
            throw new Error('DATA INVALID');
        }
        return parser.parse(response.data);
    }

    async fetchData() {
        return await axios.get(this.sitemap);
    }
}

module.exports = HobbyrcCrawler;