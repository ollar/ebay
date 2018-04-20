import Component from '@ember/component';

export default Component.extend({
    tagName: '',
    opened: false,

    actions: {
        toggleDrawer() {
            this.toggleProperty('opened');
        },
    },
});
