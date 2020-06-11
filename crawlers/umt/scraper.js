const BaseScraper = require('../BaseScraper');
const Product = require('../../models/product');

class UMTScraper extends BaseScraper {
    constructor() {
        super({
            type: 'json-ld'
        });
    }

    async getProduct(url) {
        const product = new Product();
        const categoryMetadata = [];
        const data = await this._scrapeUrl(url);

        data['@graph'].forEach((item) => {
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
                let price = item.offers.map((offer) => {
                    return {
                        currency: offer.priceSpecification.priceCurrency,
                        price: Number(offer.priceSpecification.price.trim().replace(/[^0-9.]/g, '')),
                    }
                });

                product.name = item.name;
                product.price_metadata = price;
                product.price1_type = 'main';
                product.price1_currency = price[0].currency;
                product.price1_value = price[0].price;
                product.url = item.url;
                product.images = [item.image];
                product.description = item.description.trim();
                product.source = 'umt';
            }
        });
        product.category_metadata = categoryMetadata;

        return product;
    }
}

module.exports = UMTScraper;