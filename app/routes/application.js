import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

import str from '../utils/str';

export default Route.extend(AuthenticatedRouteMixin, {
    webrtc: service(),
    session: service(),

    socket: computed.readOnly('session.data.authenticated.socket'),

    activate() {
        this._super(...arguments);

        const socket = this.get('socket');

        socket.onopen = this.handleOnOpen.bind(this);
        socket.onmessage = this.handleOnMessage.bind(this);

        this.set('authenticated', this.get('session.data.authenticated'));

        window.addEventListener('beforeunload', () => {
            this.handleOnClose();
            return null;
        });
    },

    handleOnOpen() {
        this.get('socket').send(str({
            type: 'enterRoom',
            uid: this.get('authenticated.id'),
            username: this.get('authenticated.username'),
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

    deactivate() {
        this._super(...arguments);

        // const socket = this.get('socket');

        // socket.off('open', this.myOpenHandler);
        // socket.off('message', this.myMessageHandler);
        // socket.off('close', this.myCloseHandler);
    },
});
