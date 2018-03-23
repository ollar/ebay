import Component from '@ember/component';
import {computed} from '@ember/object';

export default Component.extend({
    bidsNumber: computed.readOnly('product.bids.length'),
    actions: {
        makeBid() {
            this.makeBid(this.product);
        },
    },
});
