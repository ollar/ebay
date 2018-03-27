import Route from '@ember/routing/route';

import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { hash } from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
    model() {
        return hash({
            products: this.get('store').findAll('product'),
            blocks: this.get('store').findAll('block'),
            bids: this.get('store').findAll('bid'),
        });
    },
});
