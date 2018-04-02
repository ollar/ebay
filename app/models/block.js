import DS from 'ember-data';
import CryptoJS from 'cryptojs';

import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default DS.Model.extend({
    webrtc: service(),
    index: DS.attr('number'),
    timestamp: DS.attr('number'),
    entry: DS.attr(),
    entity: DS.attr('string'),
    hash: DS.attr('string'),
    previousHash: DS.attr('string'),

    latestBlock: computed(function() {
        return this.get('store')
            .peekAll('block')
            .filter(item => item.id !== this.id)
            .sortBy('timestamp')
            .get('lastObject');
    }),

    calculateHash() {
        return CryptoJS.SHA256(
            this.get('index') +
                this.get('previousHash') +
                this.get('timestamp') +
                this.get('entity') +
                JSON.stringify(this.get('entry'))
        ).toString();
    },

    save(options) {
        this.set('timestamp', new Date().valueOf());
        this.set('hash', this.calculateHash());
        const prev = this.get('latestBlock');

        if (prev) {
            this.set('index', prev.get('index') + 1);
            this.set('previousHash', prev.get('hash'));
        } else {
            this.set('index', 0);
            this.set('previousHash', this.get('hash'));
        }

        this.get('webrtc').broadcast(this.serialize(), 'block::create');
        return this._super(options);
    },

    saveApply() {
        const id = this.get('entry.id');

        var entity = this.get('store').peekRecord(this.get('entity'), id);

        if (entity) {
            entity.setProperties(this.get('entry'));
        } else {
            entity = this.get('store').createRecord(
                this.get('entity'),
                this.get('entry')
            );
        }
        entity.save({ norelations: true });
        DS.Model.prototype.save.apply(this, arguments);
    },
});
