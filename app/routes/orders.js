import Route from '@ember/routing/route';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend({
    session: service(),
    me: computed.readOnly('session.data.authenticated.id'),
    model() {
        return this.get('store').findAll('order')
            .then(orders => orders.filter(order => order.get('buyer') === this.get('me')));
    }
});
