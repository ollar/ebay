import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
    tagName: 'header',
    session: service(),
    router: service(),

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
