import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend({
    storeEvents: service(),
    model() {
        console.log('assa');
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
        console.log('activate');
        this.get('storeEvents').on('createRecord::product', () => {
            console.log('createRecord::product');
            this.refresh();
        });

        this.get('storeEvents').on('updateRecord::product', () => {
            console.log('updateRecord::product');
            this.refresh();
        });
    },

    deactivate() {
        this.get('storeEvents').off('createRecord::product');
        this.get('storeEvents').off('updateRecord::product');
    },
});
