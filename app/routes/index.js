import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
    model() {
        return hash({
            products: this.get('store').findAll('product', {reload: true})
                .then(products => products.filter(product => !product.get('sold'))),
            blocks: this.get('store').findAll('block'),
            bids: this.get('store').findAll('bid'),
        });
    }
});
