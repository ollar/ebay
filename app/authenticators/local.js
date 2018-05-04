import Base from 'ember-simple-auth/authenticators/base';
import { inject as service } from '@ember/service';
import { all } from 'rsvp';

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
        return this.get('store')
            .findRecord('user', data.modelId)
            .then(me => {
                this.get('websockets').disconnect();

                if (me) {
                    return all(
                        me.get('images').map(image => image.destroyRecord())
                    ).then(() => me.destroyRecord());
                } else {
                    const users = this.get('store').peekAll('user');

                    return all(users.map(user => user.destroyRecord()));
                }
            });
    },
});
