import Component from '@ember/component';

export default Component.extend({
    tagName: '',
    opened: false,

    actions: {
        toggleDrawer() {
            console.log('toggleDrawer triggered');
            // this.toggleProperty('opened');
        },
    },
});
