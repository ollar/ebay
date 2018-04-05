import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
    session: service(),
    bidPrice: computed('model.product.price', function() {
        return (
            this.get('model.product.price') +
            (this.get('model.product.bidStep') || 10)
        );
    }),
    actions: {
        goBack() {
            this.get('model.bid').unloadRecord();
            this.get('model.product').rollbackAttributes();
            window.history.back();
        },
        makeBid() {
            const bid = this.get('model.bid');
            const product = this.get('model.product');

            bid.setProperties({
                product: product,
                price: this.get('bidPrice'),
                timestamp: Date.now(),
                author: this.get('session.data.authenticated.id'),
            });

            product.set('price', bid.get('price'));
            product.get('bids').addObject(bid);

            bid.save();
            product.save();

            this.transitionToRoute('index');
        },
    },
});
