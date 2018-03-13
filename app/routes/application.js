import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

import str from '../utils/str';

import { hash } from 'rsvp';

export default Route.extend(ApplicationRouteMixin, {
    webrtc: service(),
    session: service(),

    activate() {
        this._super(...arguments);

        // const socket = this.get('websockets').socketFor('ws://0.0.0.0:8765/');
        const socket = new WebSocket('ws://0.0.0.0:8765/');

        // socket.on('open', this.handleOnOpen, this);
        socket.onopen = this.handleOnOpen.bind(this);
        socket.onmessage = this.handleOnMessage.bind(this);
        // socket.onclose = this.handleOnClose.bind(this);

        this.set('socket', socket);

        this.get('webrtc')._setWS(socket);

        console.log(this.get('session'))

        window.addEventListener('beforeunload', () => {
            this.handleOnClose();
            return null;
        });
    },

    handleOnOpen() {
        this.get('socket').send(str({
            type: 'enterRoom',
            uid: this.get('me.id'),
            username: this.get('me.username'),
        }));
    },

    handleOnClose() {
        this.get('socket').send(str({
            type: 'channelClose',
            uid: this.get('me.id'),
        }));
    },

    handleOnMessage(e) {
        const data = JSON.parse(e.data);
        const webrtc = this.get('webrtc');

        switch (data.type) {
            case 'newUser':
                // create new webrtc connection
                webrtc.createConnection(data.uid, data.username);
                // create channel
                webrtc.createChannel(data);
                // create offer ->
                webrtc.createOffer(data);
                break;

            case 'offerFrom':
                webrtc.handleOffer(data);
                break;

            case 'answerFrom':
                webrtc.handleAnswer(data);
                break;

            case 'iceCandidateFrom':
                webrtc.handleIceCandidate(data);
                break;

            case 'channelClose':
                webrtc.dropConnection(data.uid);
                break;
          }
    },

    model() {
        return hash({
            me: this.get('store').findAll('me').then(me => {
                if (!me.get('length')) {
                    this.transitionTo('login');
                    return false;
                }

                this.set('me', me.get('firstObject'));

                return me.get('firstObject');
            })
        });
    },

    deactivate() {
        this._super(...arguments);

        // const socket = this.get('socket');

        // socket.off('open', this.myOpenHandler);
        // socket.off('message', this.myMessageHandler);
        // socket.off('close', this.myCloseHandler);
    },
});
