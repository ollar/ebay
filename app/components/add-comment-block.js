import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
    store: service(),
    session: service(),

    myUid: computed.readOnly('session.data.authenticated.id'),

    init() {
        this._super(...arguments);

        this.model = this.get('store').createRecord('comment');
    },

    actions: {
        createComment() {
            this.get('model').setProperties({
                author: this.get('myUid'),
                timestamp: Date.now(),
                product: this.get('product'),
            });

            this.get('product')
                .get('comments')
                .pushObject(this.get('model'));

            this.get('model').save();
            this.set('model', this.get('store').createRecord('comment'));
            this.toggleAddComment();
        },

        cancelCommenting() {
            this.get('model').setProperties({});
            this.toggleAddComment();
        }
    },
});
