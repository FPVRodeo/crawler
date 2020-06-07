const parser = require('fast-xml-parser');
const axios = require('axios').default;

class HobbyRcCrawler {
    constructor() {
        // super(props);
        this.sitemap = 'https://www.hobbyrc.co.uk/sitemap.xml';
    }

    async fetchUrls() {
        /* Schema - This is just a JSONified sitemap.xml
        {
          loc: 'https://www.hobbyrc.co.uk/popular-manufacturers',
          changefreq: 'weekly',
          lastmod: '2015-04-28'
        }
         */
        const sitemap = await this._startCrawl();
        return sitemap.urlset.url;
    }

    async _startCrawl() {
        const response = await this._fetchData();
        if (parser.validate(response.data) !== true) {
            console.error('DATA INVALID!');
            throw new Error('DATA INVALID');
        }
        return parser.parse(response.data);
    }

    async _fetchData() {
        return await axios.get(this.sitemap);
    }
}

module.exports = HobbyRcCrawler;