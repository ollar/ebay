import Base from 'ember-simple-auth/authenticators/base';
import { inject as service } from '@ember/service';
import { all, resolve, Promise } from 'rsvp';

import Fingerprint2 from 'npm:fingerprintjs2';

export default Base.extend({
    websockets: service(),
    store: service(),

    restore(data) {
        this.get('websockets').connect();
        return resolve(data);
    },

    authenticate(args) {
        const promise = new Promise(res =>
            new Fingerprint2().get(result => {
                this.get('websockets').connect();
                args.id = result;

                const me = this.get('store').peekRecord('user', args.modelId);
                me.set('fingerprint', result);
                me.set('isMe', true);
                me.save().then(() => res(args));
            })
        );

        return promise;
    },

    invalidate(/*data*/) {
        const users = this.get('store').peekAll('user');
        return all(users.map(user => user.destroyRecord()));
    },
});
