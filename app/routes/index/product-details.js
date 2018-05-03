import Route from '@ember/routing/route';

import { hash } from 'rsvp';

export default Route.extend({
    model(params) {
        return hash({
            product: this.get('store').findRecord('product', params.product_id),
            comments: this.get('store').query('comment', {
                product: params.product_id,
            }),
        });
    },

    activate() {
        // this.controllerFor(this.fullRouteName).set(
        //     'comments',
        //     this.get('store').query('comment', {
        //         product: this.get('model.id'),
        //     })
        // );
    },
});
