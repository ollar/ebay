import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import { hash } from 'rsvp';

import {uuid} from 'ember-cli-uuid';

export default Route.extend({
    websockets: service(),

    activate() {
        this._super(...arguments);

        const socket = this.get('websockets').socketFor('ws://0.0.0.0:8765/');

        socket.on('open', this.handleOnOpen, this);
        // socket.on('message', this.myMessageHandler, this);
        socket.on('close', this.handleOnClose, this);

        this.set('socket', socket);
    },

    handleOnOpen() {
        this.get('socket').send({
            type: 'enterRoom',
            uid: uuid(),
        }, true);
    },

    handleOnClose() {
        this.get('socket').send({
            type: 'channelClose',
            uid: 'UID',
        });
    },

    model() {
        return hash({
            me: this.get('store').findAll('me').then(me => {
                if (!me.get('length')) {
                    this.transitionTo('login');
                    return false;
                }

                return me;
            })
        });
    },





    deactivate() {
        this._super(...arguments);

        const socket = this.get('socket');

        // socket.off('open', this.myOpenHandler);
        // socket.off('message', this.myMessageHandler);
        // socket.off('close', this.myCloseHandler);
    },
});
