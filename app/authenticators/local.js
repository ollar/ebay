import Base from 'ember-simple-auth/authenticators/base';

import { inject as service } from '@ember/service';

export default Base.extend({
    websockets: service(),
    // webrtc: service(),

    restore(data) {
        this.get('websockets').connect();
        return Promise.resolve(data);
    },

    authenticate(args) {
        this.get('websockets').connect();
        return Promise.resolve(args);
    },

    invalidate(data) {
        this.get('websockets').disconnect();
        return Promise.resolve();
    }
});
