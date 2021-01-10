const BaseScraper = require('../BaseScraper');
const Product = require('../../models/product');

class DroneislifeScraper extends BaseScraper {
    constructor() {
        super({
            type: 'json-ld'
        });
    }

    async getProduct(url) {
        const product = new Product();
        const categoryMetadata = [];
        const dataStaging = await this._scrapeUrl(url);
        const data = Array.isArray(dataStaging) ? dataStaging : [ dataStaging ];

        data.forEach((item) => {
            if (item['@type'] === 'BreadcrumbList') {
                const listTotal = item.itemListElement.length;
                item.itemListElement.filter((catData) => {
                    // Could be simplified but lets keep rules explicit
                    if (catData.item.name === 'Home') return false;
                    if (catData.position === listTotal) return false;
                    return true;
                }).forEach((catData) => {
                    categoryMetadata.push(catData.item.name);
                });
            }

            if (item['@type'] === 'Product') {
                let price = {
                    currency: item.offers.priceCurrency,
                    price: Number(item.offers.price.trim().replace(/[^0-9.]/g, '')),
                };

                product.name = item.name;
                product.price_metadata = price;
                product.price1_type = 'main';
                product.price1_currency = price.currency;
                product.price1_value = price.price;
                product.url = url;
                product.images = [item.image];
                product.description = item.description.trim();
                product.source = 'droneislife';
            }
        });

        if (categoryMetadata.length > 0) {
            product.category_metadata = categoryMetadata;
        }

        return product.source === null ? null : product;
    }
}

module.exports = DroneislifeScraper;
