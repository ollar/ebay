import Route from '@ember/routing/route';

import { hash } from 'rsvp';

export default Route.extend({
    model() {
        return hash({
            products: this.get('store').findAll('product'),
            blocks: this.get('store').findAll('block'),
        });
    },
});
