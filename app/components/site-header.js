import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
    tagName: 'header',
    session: service(),
    router: service(),
    store: service(),

    me: computed('session.isAuthenticated', function() {
        const id = this.getWithDefault('session.data.authenticated.modelId', '');
        return this.get('store').peekRecord('user', id);
    }),

    actions: {
        toggleDrawer() {
            this.get('drawerData.toggleDrawer')();
        },
        invalidateSession() {
            this.get('session')
                .invalidate()
                .then(() => {
                    this.get('router').transitionTo('login');
                });
        },
    },
});
