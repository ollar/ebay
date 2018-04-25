import Base from 'ember-simple-auth/authenticators/base';
import { inject as service } from '@ember/service';

import Fingerprint2 from 'npm:fingerprintjs2';

export default Base.extend({
    websockets: service(),
    store: service(),

    restore(data) {
        this.get('websockets').connect();
        return Promise.resolve(data);
    },

    authenticate(args) {
        return new Promise(res => {
            new Fingerprint2().get(result => {
                this.get('websockets').connect();
                args.id = result;

                const me = this.get('store').peekRecord('user', args.modelId);
                me.set('fingerprint', result);
                me.set('isMe', true);
                me.save();

                res(args);
            });
        });
    },

    invalidate(data) {
        const me = this.get('store').peekRecord('user', data.modelId)
        me.get('images').forEach(image => image.destroyRecord());
        me.destroyRecord();

        this.get('websockets').disconnect();
        return Promise.resolve();
    },
});
