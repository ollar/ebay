import Route from '@ember/routing/route';

import { hash } from 'rsvp';

export default Route.extend({
    model(options, transition) {
        const product_id =
            transition['params']['index.product-details']['product_id'];

        const product = this.get('store').peekRecord('product', product_id);

        if (product.get('sold')) {
            transition.abort();
        }

        return hash({
            bid: this.get('store').createRecord('bid'),
            product,
        });
    },
});
