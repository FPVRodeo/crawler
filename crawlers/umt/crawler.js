const BaseSitemapCrawler = require('../BaseSitemapCrawler');

class UMTCrawler extends BaseSitemapCrawler{
    constructor() {
        super({
            sitemap: 'https://www.unmannedtechshop.co.uk/image-sitemap-index-1.xml'
        });
    }

    async fetchUrls() {
        const sitemap = await this._startCrawl(this.sitemap);

        let imagesetPromises = sitemap.sitemapindex.sitemap.map((url) => {
            return this._fetchProductsFromImageset(url.loc);
        });

        let products = await Promise.all(imagesetPromises);

        return [...new Set(products.flat())];
    }

    async _fetchProductsFromImageset(sitemapUrl) {
        const sitemap = await this._startCrawl(sitemapUrl);

        /**
         * Grab full imagesitemap.
         * Spread into Set to make unique.
         * filter for product only urls.
         */
        return [...new Set( sitemap.urlset.url.map(url => { return url.loc; }) )]
            .filter(url => {
                const regex = /^https:\/\/.*\/product\//g;
                return url.match(regex) !== null;
            });
    }
}

module.exports = UMTCrawler;