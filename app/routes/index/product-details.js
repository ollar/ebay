import Route from '@ember/routing/route';
// import { promise } from 'rsvp';

export default Route.extend({
    model(options) {
        var images = [];
        return new Promise((res, rej) => {
            const product = this.get('store').peekRecord(
                'product',
                options.product_id
            );

            if (product.get('images.length')) {
                images = product
                    .get('images')
                    .map(imageId =>
                        this.get('store').findRecord('image', imageId)
                    );
            }

            res({ product, images });
        });
    },
});
