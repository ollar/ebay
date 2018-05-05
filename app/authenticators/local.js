import Base from 'ember-simple-auth/authenticators/base';
import { inject as service } from '@ember/service';
import { all, resolve } from 'rsvp';

import Fingerprint2 from 'npm:fingerprintjs2';

export default Base.extend({
    websockets: service(),
    store: service(),

    restore(data) {
        this.get('websockets').connect();
        return resolve(data);
    },

    authenticate(args) {
        return new Promise(res => {
            new Fingerprint2().get(result => {
                this.get('websockets').connect();
                args.id = result;

                const me = this.get('store').peekRecord('user', args.modelId);
                me.set('fingerprint', result);
                me.set('isMe', true);
                me.save().then(() => res(args));
            });
        });
    },

    invalidate(data) {
        return this.get('store')
            .findAll('user')
            .then(users => {
                all(users.map(user => user.destroyRecord()));
            });
    },
});
