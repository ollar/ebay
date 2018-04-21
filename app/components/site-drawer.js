import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { run, schedule } from '@ember/runloop';

export default Component.extend({
    tagName: '',
    opened: false,

    router: service('-routing'),

    init() {
        this._super(arguments);

        const router = this.get('router');
        router.addObserver('currentRouteName', this, 'closeDrawer');
    },

    closeDrawer() {
        run(() => schedule('afterRender', () => this.set('opened', false)));
    },

    actions: {
        toggleDrawer() {
            run(() => this.toggleProperty('opened'));
        },
    },
});
