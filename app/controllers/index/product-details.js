import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
    session: service(),
    me: computed.readOnly('session.data.authenticated.id'),
    bidsNumber: computed.readOnly('model.bids.length'),
    lastBid: computed.readOnly('model.bids.lastObject'),

    lastBidUser: computed('lastBid', function() {
        const userId = this.get('lastBid.author');
        return this.get('store').peekRecord('user', userId);
    }),

    isAuthor: computed('me', function() {
        return this.get('model.author') === this.get('me');
    }),

    actions: {
        goBack() {
            window.history.back();
        },
        sell_product() {
            const product = this.get('model');
            const lastBid = this.get('lastBid');

            product.set('sold', true);

            const order = this.get('store').createRecord('order', {
                seller: this.get('me'),
                buyer: lastBid.get('author'),
                product: product,
                timestamp: Date.now(),
                bid: lastBid,
            });

            order.save();
            product.save();
        },
    },
});
