import Base from 'ember-simple-auth/authenticators/base';

export default Base.extend({
    connectSocket() {
         return new WebSocket('ws://0.0.0.0:8765/');
    },
    restore(data) {
        const socket = this.connectSocket();
        return Promise.resolve(Object.assign(data, { socket }));
    },

    authenticate(args) {
        const socket = this.connectSocket();
        return Promise.resolve(Object.assign(args, { socket }));
    },

    invalidate(data) {
        return Promise.resolve();
    }
});
