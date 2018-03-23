import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

import trace from '../utils/trace';
import str from '../utils/str';

const pcConfig = {
    iceServers: [
        { urls: 'stun:stun3.l.google.com:19302' },
        {
            urls: 'turn:192.158.29.39:3478?transport=udp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808',
        },
    ],
};

const pcConstraints = null;
const dataConstraint = null;

function bindChannelEventsOnMessage(event) {
    const message = JSON.parse(event.data);

    switch (message.eventName) {
        case 'block::create':
            this.get('store')
                .createRecord('block', message.data)
                .saveApply();
            break;

        case 'block::index_check':
            var lastBlockIndex = this.get('store')
                .peekAll('block')
                .filter(item => item.id !== this.id)
                .sortBy('timestamp')
                .get('lastObject.index');

            if (!message.data.index || lastBlockIndex > message.data.index) {
                this.send(
                    event.currentTarget.toUid,
                    this.get('store')
                        .peekAll('block')
                        .slice(message.data.index),
                    'block::update_indexes'
                );
            }
            break;

        case 'block::update_indexes':
            message.data.forEach(block =>
                this.get('store')
                    .createRecord('block', block)
                    .saveApply()
            );

            break;

        default:
            trace(message);
    }
}
function onSendChannelStateChangeHandler(channel) {
    if (channel.readyState === 'open') {
        this.send(
            channel.toUid,
            {
                index: this.get('store')
                    .peekAll('block')
                    .filter(item => item.id !== this.id)
                    .sortBy('timestamp')
                    .get('lastObject.index'),
            },
            'block::index_check'
        );
    }
}

// =============================================================================

export default Service.extend({
    store: service(),
    session: service(),
    websockets: service(),

    me: computed.readOnly('session.data.authenticated'),

    UID: computed.readOnly('me.id'),

    ws: computed.readOnly('websockets.socket'),

    createConnection(toUid, username) {
        trace('new connection creating');
        const connection = new RTCPeerConnection(pcConfig, pcConstraints);
        const _this = this;

        connection.ondatachannel = e => {
            trace('receive datachannel event');
            return _this._receivedChannelCallback(e, toUid);
        };

        connection.onicecandidate = e => {
            trace('received icecandidate');
            return _this._onIceCandidate(e, toUid);
        };

        const user = this.get('store').peekRecord('user', toUid);

        if (user) {
            user.setProperties({
                id: toUid,
                username,
                connection,
            });
        } else {
            this.get('store').createRecord('user', {
                id: toUid,
                username,
                connection,
            });
        }

        return connection;
    },

    createChannel({ uid: toUid }) {
        const peer = this.get('store').peekRecord('user', toUid);
        const channel = peer
            .get('connection')
            .createDataChannel(toUid, dataConstraint);

        trace('create channel: ' + toUid);

        channel.toUid = toUid;
        peer.set('channel', channel);
        peer.save();

        // bind channel events
        this._bindChannelEvents(channel);

        return channel;
    },

    createOffer({ uid: toUid }) {
        const peer = this.get('store').peekRecord('user', toUid);
        const connection = peer.get('connection');

        connection
            .createOffer()
            .then(offer => {
                connection.setLocalDescription(offer);
                this.get('ws').send(
                    str({
                        type: 'offer',
                        fromUid: this.get('UID'),
                        username: this.get('me.username'),
                        toUid: toUid,
                        offer: str(offer),
                    })
                );
            })
            .catch(e => trace(e));
    },

    handleOffer(data) {
        trace('handle offer from ' + data.fromUid);

        const offer = new RTCSessionDescription(JSON.parse(data.offer));
        const connection = this.createConnection(data.fromUid, data.username);

        connection.setRemoteDescription(offer);

        connection
            .createAnswer()
            .then(answer => {
                connection.setLocalDescription(answer);
                this.get('ws').send(
                    str({
                        type: 'answer',
                        fromUid: this.get('UID'),
                        toUid: data.fromUid,
                        answer: str(answer),
                    })
                );
            })
            .catch(e => trace(e));
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

        const connection = peer.get('connection');
        connection.addIceCandidate(
            new RTCIceCandidate(JSON.parse(data.iceCandidate))
        );
    },

    dropConnection(toUid) {
        const peer = this.get('store').peekRecord('user', toUid);

        if (!peer) return;

        let connection = peer.get('connection');
        let channel = peer.get('channel');

        if (channel) channel.close();
        if (connection) connection.close();

        peer.unloadRecord();
        // if (peers.length === 0) Sync.trigger('channelClose');
    },

    dropAllConnections() {
        const peers = this.get('store').peekAll('user');
        peers.forEach(peer => this.dropConnection(peer.id));
    },

    _receivedChannelCallback(e, toUid) {
        const channel = e.channel;
        const peer = this.get('store').peekRecord('user', toUid);
        channel.toUid = toUid;

        peer.set('channel', channel);

        this._bindChannelEvents(channel);
    },

    _onIceCandidate(e, toUid) {
        if (e.candidate) {
            this.get('ws').send(
                str({
                    type: 'iceCandidate',
                    fromUid: this.get('UID'),
                    toUid: toUid,
                    iceCandidate: str(e.candidate.toJSON()),
                })
            );
        }
    },

    _bindChannelEvents(channel) {
        channel.onopen = () => this._onSendChannelStateChange(channel);
        channel.onclose = () => this._onSendChannelStateChange(channel);

        channel.onmessage = bindChannelEventsOnMessage.bind(this);
    },

    _onSendChannelStateChange(channel) {
        trace('channel state changed: ' + channel.readyState);

        return onSendChannelStateChangeHandler.call(this, channel);
    },

    send(uid, data, eventName) {
        const peer = this.get('store').peekRecord('user', uid);

        if (peer.get('id') === this.get('UID')) return;

        const channel = peer.get('channel');

        if (channel.readyState === 'open') {
            channel.send(
                str({
                    type: 'message',
                    data,
                    eventName,
                })
            );
        }
    },

    broadcast(data, eventName) {
        const peers = this.get('store').peekAll('user');
        return peers.map(item => this.send(item.id, data, eventName));
    },
});
