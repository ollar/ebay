import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend({
    storeEvents: service(),
    model(params) {
        return hash({
            product: this.get('store').findRecord('product', params.product_id),
            comments: this.get('store')
                .query('comment', {
                    product: params.product_id,
                })
                .then(comments => comments.sortBy('timestamp')),
        });
    },

    activate() {
        this.get('storeEvents').on('createRecord::comment', () =>
            this.refresh()
        );
    },
});
