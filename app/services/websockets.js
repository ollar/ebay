import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

import str from '../utils/str';

export default Service.extend({
    bathPath: 'ws://0.0.0.0:8765/',
    authenticated: computed.readOnly('session.data.authenticated'),

    webrtc: service(),
    session: service(),

    init() {
        this._super(...arguments);
        window.addEventListener('beforeunload', () => {
            this.handleOnClose();
            return null;
        });
    },

    connect() {
        const socket = new WebSocket(this.get('bathPath'));
        this.set('socket', socket);

        socket.onopen = this.handleOnOpen.bind(this);
        socket.onmessage = this.handleOnMessage.bind(this);
        socket.onclose = this.handleOnClose.bind(this);

        return socket;
    },

    disconnect() {
        const socket = this.get('socket');
        socket.close();
    },

    handleOnOpen() {
        this.get('socket').send(
            str({
                type: 'enterRoom',
                uid: this.get('authenticated.modelId'),
            })
        );
    },

    handleOnClose() {
        this.get('webrtc').dropAllConnections();
        this.get('socket').send(
            str({
                type: 'channelClose',
                uid: this.get('me.id'),
            })
        );
    },

    handleOnMessage(e) {
        const data = JSON.parse(e.data);
        const webrtc = this.get('webrtc');

        switch (data.type) {
            case 'newUser':
                // create new webrtc connection
                webrtc.createConnection(data.uid, data.username, data.image);
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
});
