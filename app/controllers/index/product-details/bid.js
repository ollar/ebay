import Controller from '@ember/controller';

import { computed } from '@ember/object';

export default Controller.extend({
    bidPrice: computed('model.product.price', function() {
        return (
            this.get('model.product.price') +
            (this.get('model.product.bidStep') || 10)
        );
    }),
    actions: {
        makeBid() {
            const bid = this.get('model.bid');
            const product = this.get('model.product');

            bid.set('product', product.id);
            bid.set('price', this.get('bidPrice'));
            product.set('price', bid.get('price'));
            product.get('bids').addObject(bid.id);

            bid.save();
            product.save();

            this.transitionToRoute('index');
        },
    },
});
