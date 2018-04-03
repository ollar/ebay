import Base from 'ember-simple-auth/authenticators/base';
import { inject as service } from '@ember/service';

import Fingerprint2 from 'npm:fingerprintjs2';

export default Base.extend({
    websockets: service(),

    restore(data) {
        this.get('websockets').connect();
        return Promise.resolve(data);
    },

    authenticate(args) {
        return new Promise(res => {
            new Fingerprint2().get(result => {
                this.get('websockets').connect();
                args.id = result;
                res(args);
            });
        });
    },

    invalidate() {
        this.get('websockets').disconnect();
        return Promise.resolve();
    },
});
