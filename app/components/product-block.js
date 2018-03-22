import Component from '@ember/component';

export default Component.extend({
    actions: {
        makeBid() {
            this.makeBid(this.product);
        },
    },
});
