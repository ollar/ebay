import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

import trace from '../utils/trace';
import str from '../utils/str';

const pcConfig = {
  iceServers: [
    {urls:'stun:stun3.l.google.com:19302'},
    {
      urls: 'turn:192.158.29.39:3478?transport=udp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808'
    },
  ]
};

const pcConstraints = null;
const dataConstraint = null;

let bindChannelEventsOnMessage = () => {};
let onSendChannelStateChangeHandler = () => {};

// =============================================================================

function bindChannelEvents(channel) {
  channel.onopen = () => _onSendChannelStateChange(channel);
  channel.onclose = () => _onSendChannelStateChange(channel);

  channel.onmessage = bindChannelEventsOnMessage;
}

function _onSendChannelStateChange(channel) {
  trace('channel state changed: ' + channel.readyState);

  return onSendChannelStateChangeHandler(channel);
}

export default Service.extend({
    store: service(),

    me: computed(function() {
        return this.get('store').peekAll('me').get('firstObject');
    }),

    UID: computed('me', function() {
        return this.get('me.id');
    }),

    _setWS(ws) {
        this.set('ws', ws);
    },

    createConnection(toUid, username) {
        trace('new connection creating');
        const connection = new RTCPeerConnection(pcConfig, pcConstraints);
        const _this = this;

        connection.ondatachannel = (e) => {
            trace('receive datachannel event');
            return _this._receivedChannelCallback(e, toUid);
        };

        connection.onicecandidate = (e) => {
            trace('received icecandidate');
            return _this._onIceCandidate(e, toUid);
        };

        this.get('store').createRecord('user', {
            id: toUid,
            username,
            connection,
        });

      return connection;
    },

    createChannel({ uid: toUid }) {
        const peer = this.get('store').peekRecord('user', toUid);
        const channel = peer.get('connection').createDataChannel(toUid, dataConstraint);

        trace('create channel: ' + toUid);

        peer.set('channel', channel);

        // bind channel events
        bindChannelEvents(channel);

        return channel;
    },

    createOffer({ uid: toUid }) {
        const peer = this.get('store').peekRecord('user', toUid);
        const connection = peer.get('connection');

        connection.createOffer().then((offer) => {
            connection.setLocalDescription(offer);
            this.get('ws').send(str({
                type: 'offer',
                fromUid: this.get('UID'),
                username: this.get('me.username'),
                toUid: toUid,
                offer: str(offer),
            }));
        }).catch(e => console.log(e));
    },

    handleOffer(data) {
        trace('handle offer from ' + data.fromUid);

        const offer = new RTCSessionDescription(JSON.parse(data.offer));
        const connection = this.createConnection(data.fromUid, data.username);

        connection.setRemoteDescription(offer);

        connection.createAnswer().then(answer => {
            connection.setLocalDescription(answer);
            this.get('ws').send(str({
                type: 'answer',
                fromUid: this.get('UID'),
                toUid: data.fromUid,
                answer: str(answer),
            }));
        }).catch(e => console.log(e));
    },

    handleAnswer(data) {
        trace('handle answer from ' + data.fromUid);

        const answer = new RTCSessionDescription(JSON.parse(data.answer));
        const peer = this.get('store').peekRecord('user', data.fromUid);

        const connection = peer.get('connection');

        connection.setRemoteDescription(answer);
    },

    handleIceCandidate(data) {
        const peer = this.get('store').peekRecord('user', data.fromUid);

        // FIXME: bug there
        // if (!peer) return;

        const connection = peer.get('connection');
        connection.addIceCandidate(new RTCIceCandidate(JSON.parse(data.iceCandidate)));
    },

    dropConnection(toUid) {
        console.log('asdasdasdasd 2222222')
        const peer = this.get('store').peekRecord('user', toUid);
        let connection = peer.get('connection');
        let channel = peer.get('channel');

        if (channel) channel.close();
        if (connection) connection.close();

        peer.deleteRecord();
        // if (peers.length === 0) Sync.trigger('channelClose');
    },

    _receivedChannelCallback(e, toUid) {
        const channel = e.channel;
        const peer = this.get('store').peekRecord('user', toUid);

        peer.set('channel', channel);

        bindChannelEvents(channel);
    },

    _onIceCandidate(e, toUid) {
        if (e.candidate) {
            this.get('ws').send(str({
              type: 'iceCandidate',
              fromUid: this.get('UID'),
              toUid: toUid,
              iceCandidate: str(e.candidate.toJSON()),
            }));
        }
    },

});
