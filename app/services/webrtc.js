import Service from '@ember/service';

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

export default Service.extend({
    peers: computed(()=> []),
    createConnection(toUid) {
      trace('new connection creating');
      const connection = new RTCPeerConnection(pcConfig, pcConstraints);

      connection.ondatachannel = function(e) {
        trace('receive datachannel event');
        return receivedChannelCallback(e, toUid);
      };

      connection.onicecandidate = function(e) {
        trace('received icecandidate');
        return onIceCandidate(e, toUid);
      };

      peers.add({ uid: toUid, connection });

      return connection;
    }

});
