const BaseSitemapCrawler = require('../BaseSitemapCrawler');

class UMTCrawler extends BaseSitemapCrawler{
    constructor() {
        super({
            sitemap: 'https://www.unmannedtechshop.co.uk/sitemap.xml'
        });
    }

    async fetchUrls() {
        const sitemap = await this._startCrawl(this.sitemap);

        let productPostPromises = sitemap.sitemapindex.sitemap
            .filter(url => {
                const regex = /^https:\/\/.*\/wp-sitemap-posts-product-[0-9]*.xml$/g
                return url.loc.match(regex) !== null;
            })
            .map((url) => {
                return this._fetchProductsFromPosts(url.loc);
            });

        let products = await Promise.all(productPostPromises);

        return [...new Set(products.flat())];
    }

    async _fetchProductsFromPosts(sitemapUrl) {
        const sitemap = await this._startCrawl(sitemapUrl);

        /**
         * Grab full posts sitemap.
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
