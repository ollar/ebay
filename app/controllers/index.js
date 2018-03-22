import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    session: service(),
    actions: {
        makeBid(product) {
            const bid = this.get('store').createRecord('bid', {
                author: this.get('session.data.authenticated.id'),
                product: product.id,
                price: product.get('price') + 2,
            });

            product.get('bids').addObject(bid.id);

            bid.save();
            product.save();
        },
    },
});
