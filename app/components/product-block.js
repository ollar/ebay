import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
    bidsNumber: computed.readOnly('product.bids.length'),
    classNames: ['card'],
    tagName: 'article',
});
