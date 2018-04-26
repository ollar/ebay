import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
    session: service(),
    myId: computed.readOnly('session.data.authenticated.id'),
    bidPrice: computed('model.product.price', {
        get() {
            return (
                this.get('model.product.price') +
                (this.get('model.product.bidStep') || 10)
            );
        },
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

            if (+this.get('bidPrice') < +this.get('model.product.price')) {
                this.set(
                    'bidPrice',
                    this.get('model.product.price') +
                        (this.get('model.product.bidStep') || 10)
                );
            }

            bid.setProperties({
                product: product,
                price: this.get('bidPrice'),
                timestamp: Date.now(),
                author: this.get('myId'),
            });

            product.set('price', bid.get('price'));
            product.get('bids').addObject(bid);

            bid.save();
            product.save();

            this.transitionToRoute('index');
        },
    },
});
