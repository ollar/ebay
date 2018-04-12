import Component from '@ember/component';

import { run, schedule } from '@ember/runloop';

export default Component.extend({
    swiper: null,

    classNames: ['swiper-container'],

    didInsertElement() {
        this._super(...arguments);

        run(() => {
            schedule('afterRender', () => {
                this.set('swiper', new Swiper(this.$()));
            });
        });
    },

    willDestroyElement() {
        this._super(...arguments);

        const swiper = this.get('swiper');
        if (swiper) swiper.destroy();
    },
});
