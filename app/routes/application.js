import Route from '@ember/routing/route';

import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
    // activate() {
    //     this._super(...arguments);

    //     const socket = this.get('socket');

    //     socket.onopen = this.handleOnOpen.bind(this);
    //     socket.onmessage = this.handleOnMessage.bind(this);

    //     this.set('authenticated', this.get('session.data.authenticated'));

    //     window.addEventListener('beforeunload', () => {
    //         this.handleOnClose();
    //         return null;
    //     });
    // },

    deactivate() {
        this._super(...arguments);

        // const socket = this.get('socket');

        // socket.off('open', this.myOpenHandler);
        // socket.off('message', this.myMessageHandler);
        // socket.off('close', this.myCloseHandler);
    },
});
