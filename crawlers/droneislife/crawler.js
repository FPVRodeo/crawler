const BaseSitemapCrawler = require('../BaseSitemapCrawler');

class DroneislifeCrawler extends BaseSitemapCrawler {
    constructor() {
        super({
            sitemap: 'https://droneislife.co.uk/sitemap.xml'
        });
    }

    async fetchUrls() {
        const sitemap = await this._startCrawl(this.sitemap);
        return sitemap.urlset.url.filter((url) => {
            let whitelist = [
                'https://droneislife.co.uk/electronics',
                'https://droneislife.co.uk/micro',
                'https://droneislife.co.uk/motors',
                'https://droneislife.co.uk/frames',
                'https://droneislife.co.uk/batteries',
                'https://droneislife.co.uk/props',
                'https://droneislife.co.uk/fpv',
                'https://droneislife.co.uk/radio',
                'https://droneislife.co.uk/accessories',
                'https://droneislife.co.uk/DJI',
            ].filter((wl) => url.loc.startsWith(wl));
            return !url.hasOwnProperty('image:image') && whitelist.length > 0;
        }).map((url) => url.loc);
    }
}

module.exports = DroneislifeCrawler;