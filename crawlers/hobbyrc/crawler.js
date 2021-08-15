const BaseSitemapCrawler = require('../BaseSitemapCrawler');

class HobbyRcCrawler extends BaseSitemapCrawler{
    constructor() {
        super({
            sitemap: 'https://www.hobbyrc.co.uk/sitemap.xml'
        });
    }

    async fetchUrls() {
        /* Schema - This is just a JSONified sitemap.xml
        {
          loc: 'https://www.hobbyrc.co.uk/popular-manufacturers',
          changefreq: 'weekly',
          lastmod: '2015-04-28'
        }
         */
        const sitemap = await this._startCrawl(this.sitemap);
        return sitemap.urlset.url.map(url => url.loc);
    }
}

module.exports = HobbyRcCrawler;
