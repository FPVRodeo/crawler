const axios = require('axios').default;
const scraper = require('html-metadata').parseSchemaOrgMicrodata;
const cheerio = require('cheerio');
const Product = require('../../models/product');

class HobbyRcScraper {
    constructor() {
        // super(props)
        this.type = 'microdata';
    }

    async getProduct(url) {
        const product = new Product();
        const categoryMetadata = [];
        const data = await this._scrapeUrl(url);

        data.items.forEach(item => {
            if (item.type.length === 1 && item.type[0] == 'http://data-vocabulary.org/Breadcrumb') {
                if (item.properties.url[0] !== '/') {
                    categoryMetadata.push(item.properties.title[0].trim());
                }
            }
            if (item.type.length === 1 && item.type[0] == 'http://schema.org/Product') {
                let props = item.properties;
                let price = item.properties.offers.map(offer => {
                    return {
                        currency: offer.properties.priceCurrency[0],
                        price: Number(offer.properties.price[0].trim().replace(/[^0-9.]/g, '')),
                    }
                });

                product.name = props.name[0].trim();
                product.price = price;
                product.image = props.image;
                product.description = props.description[0].trim();
            }
        });
        product.categoryMetadata = categoryMetadata;

        return product;
    }

    async _scrapeUrl(url) {
        const response = await this._fetchData(url);
        const $ = cheerio.load(response.data);
        return await scraper($);
    }

    async _fetchData(url) {
        return await axios.get(url);
    }
}

module.exports = HobbyRcScraper;