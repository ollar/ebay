import Route from '@ember/routing/route';

import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { hash } from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
    model() {
        return hash({
            blocks: this.get('store').findAll('block'),
            users: this.get('store').findAll('user'),
        });
    },
});
