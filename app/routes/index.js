import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend({
    storeEvents: service(),
    model() {
        return hash({
            products: this.get('store').query('product', { sold: false }),
            blocks: this.get('store').findAll('block'),
            users: this.get('store')
                .findAll('user')
                .then(users =>
                    users.filter(user => user.get('isMe') === false)
                ),
            bids: this.get('store').findAll('bid'),
        });
    },

    activate() {
        this.get('storeEvents').on('createRecord::product', () =>
            this.refresh()
        );

        this.get('storeEvents').on('updateRecord::product', () =>
            this.refresh()
        );
    },

    deactivate() {
        this.get('storeEvents').off('createRecord::product');
        this.get('storeEvents').off('updateRecord::product');
    },
});
