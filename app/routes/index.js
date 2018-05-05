import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
    model() {
        return hash({
            products: this.get('store').query('product', { sold: false }),
            blocks: this.get('store').findAll('block', { reload: true }),
            users: this.get('store')
                .findAll('user')
                .then(users =>
                    users.filter(user => user.get('isMe') === false)
                ),
            bids: this.get('store').findAll('bid'),
        });
    },
});
