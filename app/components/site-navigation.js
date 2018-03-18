import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
    tagName: 'nav',
    id: 'main-navigation',
    session: service(),
    router: service(),

    actions: {
        invalidateSession() {
            this.get('session').invalidate().then(() => {
                this.get('router').transitionTo('login');
            });
        },
    }
});