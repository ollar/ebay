import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import EmberObject from '@ember/object';

import { run, later } from '@ember/runloop';

import trace from '../utils/trace';
import str from '../utils/str';
import Middleware from '../utils/middleware';

const pcConfig = {
    iceServers: [
        { url: 'stun:stun01.sipphone.com' },
        { url: 'stun:stun.ekiga.net' },
        { url: 'stun:stun.fwdnet.net' },
        { url: 'stun:stun.ideasip.com' },
        { url: 'stun:stun.iptel.org' },
        { url: 'stun:stun.rixtelecom.se' },
        { url: 'stun:stun.schlund.de' },
        { url: 'stun:stun.l.google.com:19302' },
        { url: 'stun:stun1.l.google.com:19302' },
        { url: 'stun:stun2.l.google.com:19302' },
        { url: 'stun:stun3.l.google.com:19302' },
        { url: 'stun:stun4.l.google.com:19302' },
        { url: 'stun:stunserver.org' },
        { url: 'stun:stun.softjoys.com' },
        { url: 'stun:stun.voiparound.com' },
        { url: 'stun:stun.voipbuster.com' },
        { url: 'stun:stun.voipstunt.com' },
        { url: 'stun:stun.voxgratia.org' },
        { url: 'stun:stun.xten.com' },
        {
            url: 'turn:numb.viagenie.ca',
            credential: 'muazkh',
            username: 'webrtc@live.com',
        },
        {
            url: 'turn:192.158.29.39:3478?transport=udp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808',
        },
        {
            url: 'turn:192.158.29.39:3478?transport=tcp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808',
        },
    ],
};

const pcConstraints = null;
const dataConstraint = null;

function bindChannelEventsOnMessage(event) {
    let message;
    var store = this.get('store');

    try {
        message = JSON.parse(event.data);
    } catch (e) {
        const messageChunks = this.get('messageChunks');
        messageChunks.pushObject(event.data);
        if (messageChunks.join('').length === this.get('long_message_length')) {
            message = JSON.parse(messageChunks.join(''));
            this.set('messageChunks', []);
            this.set('long_message_length', '');
        } else {
            return;
        }
    }

    switch (message.eventName) {
        case 'block::create':
            store.push(store.normalize('block', message.data)).saveApply();
            break;

        case 'entity::create':
            store
                .push(store.normalize(message.data.entity, message.data.data))
                .save();
            break;

        case 'block::index_check':
            var lastBlockIndex = this.get('store')
                .peekAll('block')
                .sortBy('timestamp')
                .getWithDefault('lastObject.index', 0);

            // debugger;

            if (lastBlockIndex > message.data.index) {
                var blocks = this.get('store')
                    .peekAll('block')
                    .slice(message.data.index);

                for (let i = 0; i < blocks.length; i += 10) {
                    run(() => {
                        this.send(
                            event.currentTarget.toUid,
                            blocks
                                .slice(i, i + 10)
                                .map(item =>
                                    item.serialize({ includeId: true })
                                ),
                            'block::update_indexes'
                        );
                    });
                }
            }
            break;

        case 'block::update_indexes':
            message.data.forEach(block =>
                this.get('store')
                    .createRecord('block', block)
                    .saveApply()
            );

            break;

        case 'entity::request_data':
            this.get('store')
                .findRecord(message.data.entity, message.data.id, {
                    quite: true,
                })
                .then(entity => {
                    if (entity) {
                        run(() => {
                            this.send(
                                event.currentTarget.toUid,
                                {
                                    entity: message.data.entity,
                                    data: entity.serialize({ includeId: true }),
                                },
                                'entity::create'
                            );
                        });
                    }
                });

            break;

        case 'message::long_message::length':
            this.set('long_message_length', message.data.length);
            break;

        default:
            trace(message);
    }
}
function onSendChannelStateChangeHandler(channel) {
    if (channel.readyState === 'open') {
        this.set(`opened.${channel.toUid}`, true);
        var lastBlock = this.get('store')
            .peekAll('block')
            .filter(item => item.id !== this.id)
            .sortBy('timestamp')
            .getWithDefault('lastObject', new EmberObject());

        this.send(
            channel.toUid,
            {
                index: lastBlock.getWithDefault('index', 0),
                timestamp: lastBlock.getWithDefault('timestamp', 0),
            },
            'block::index_check'
        );

        this.getWithDefault(`messageQueue.${channel.toUid}`, []).forEach(
            message => {
                this.send(channel.toUid, message.data, message.eventName);
            }
        );
        this.set(`messageQueue.${channel.toUid}`, []);
    } else {
        this.set(`opened.${channel.toUid}`, false);
    }
}

// =============================================================================

export default Service.extend({
    store: service(),
    session: service(),
    websockets: service(),

    opened: computed(() => ({})),
    messageQueue: computed(() => ({})),
    messageChunks: computed(() => []),

    me: computed.readOnly('session.data.authenticated'),

    UID: computed.readOnly('me.id'),

    ws: computed.readOnly('websockets.socket'),

    createConnection(toUid, username, image) {
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
                image,
                connection,
            });
        } else {
            this.get('store').createRecord('user', {
                id: toUid,
                username,
                image,
                connection,
            });
        }

        return connection;
    },

    createChannel({ uid: toUid, channelId }) {
        channelId = channelId || toUid;

        const peer = this.get('store').peekRecord('user', toUid);
        const channel = peer
            .get('connection')
            .createDataChannel(channelId, dataConstraint);
        channel.binaryType = 'arraybuffer';

        trace('create channel: ' + channelId);

        channel.toUid = toUid;

        peer.set(`channel.${channelId}`, channel);

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
                        image: this.get('me.image'),
                        offer: str(offer),
                    })
                );
            })
            .catch(e => trace(e));
    },

    handleOffer(data) {
        trace('handle offer from ' + data.fromUid);

        const offer = new RTCSessionDescription(JSON.parse(data.offer));
        const connection = this.createConnection(
            data.fromUid,
            data.username,
            data.image
        );

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
        channel.binaryType = 'arraybuffer';

        const peer = this.get('store').peekRecord('user', toUid);
        channel.toUid = toUid;

        peer.set(`channel.${channel.label}`, channel);

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
        const message = str({
            type: 'message',
            data,
            eventName,
        });

        if (!this.get(`opened.${uid}`)) {
            this.set(`messageQueue.${uid}`, [
                ...this.getWithDefault(`messageQueue.${uid}`, []),
                { eventName, data },
            ]);
            return;
        }

        if (peer.get('id') === this.get('UID')) return;

        const channel = peer.get('channel');

        if (message.length > 16384) {
            channel.send(
                str({
                    type: 'notification',
                    eventName: 'message::long_message::length',
                    data: { id: data.data.id, length: message.length },
                })
            );
            return this.sendLongMessage(uid, data, message, eventName);
            // return this.sendMessageChunked(uid, message);
        }

        if (channel.readyState === 'open') {
            channel.send(message);
        }
    },

    _createDataChannel(uid, next) {
        var channel = this.createChannel({
            uid,
            channelId: uid + '_channel_data',
        });

        channel.addEventListener('open', function() {
            next(channel);
        });
    },

    _closeDataChannels(next, channel) {
        channel.close();
        next();
    },

    _sendTransferPrepareInfo(next, channel, data) {
        if (channel && channel.readyState === 'open') {
            channel.send(
                str({
                    type: '__dataDescription',
                    data,
                })
            );
        }

        return next(channel);
    },

    _sendTransferCompleteInfo(next, channel) {
        if (channel && channel.readyState === 'open') {
            channel.send(
                str({
                    type: '__dataTransferComplete',
                    fromUid: this.get('UID'),
                })
            );
        }

        return next(channel);
    },

    sendLongMessage(uid, data, message, eventName) {
        var middleware = new Middleware();

        return;

        middleware.use(next => this._createDataChannel(uid, next));
        middleware.use((next, channel) =>
            this._sendTransferPrepareInfo(next, channel, data)
        );
        middleware.use((next, channel) => {
            console.log('sending data', channel);

            next(channel);
        });
        middleware.use((next, channel) => {
            this._sendTransferCompleteInfo(next, channel);
            next(channel);
        });

        middleware.use((next, channel) => {
            this._closeDataChannels(next, channel);
        });

        middleware.go(() => console.log(uid, data, eventName));
    },

    sendMessageChunked(uid, message) {
        const peer = this.get('store').peekRecord('user', uid);
        const channel = peer.get('channel');

        trace('sendMessageChunked', uid);

        if (channel.readyState !== 'open') return;

        channel.send(message.slice(0, 16384));

        if (message.slice(16384).length > 16384)
            return run(() =>
                this.sendMessageChunked(uid, message.slice(16384))
            );
    },

    broadcast(data, eventName) {
        run(() => {
            const peers = this.get('store').peekAll('user');
            if (peers.get('length') === 0) {
                later(this, () => this.broadcast(data, eventName), 10000);
            }
            return peers.map(item => this.send(item.id, data, eventName));
        });
    },
});
