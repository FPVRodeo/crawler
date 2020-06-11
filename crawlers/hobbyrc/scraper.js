const BaseScraper = require('../BaseScraper');
const Product = require('../../models/product');

class HobbyRcScraper extends BaseScraper{
    constructor() {
        super({
            type: 'microdata'
        });
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
                product.price_metadata = price;
                product.price1_value = price[0].price;
                product.price1_currency = price[0].currency;
                product.price1_type = 'main';
                product.url = url;
                product.source = 'hobbyrc';
                product.images = props.image;
                product.description = props.description[0].trim();
            }
        });
        product.category_metadata = categoryMetadata;

        return product;
    }

}

module.exports = HobbyRcScraper;