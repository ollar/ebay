import DS from 'ember-data';
import CryptoJS from 'cryptojs';

import { computed } from '@ember/object';

import str from '../utils/str';

export default DS.Model.extend({
    index: DS.attr('number', { defaultValue: 1 }),
    timestamp: DS.attr('number'),
    entry: DS.attr(),
    entity: DS.attr('string'),
    hash: DS.attr('string'),
    previousHash: DS.attr('string', { defaultValue: '' }),

    _broadcastOnSave: true,

    latestBlock: computed(function() {
        return this.get('store')
            .peekAll('block')
            .filter(item => item.id !== this.id)
            .sortBy('timestamp')
            .get('lastObject');
    }),

    calculateHash() {
        return CryptoJS.SHA256(
            str(this.get('index')) +
                str(this.get('previousHash')) +
                str(this.get('timestamp')) +
                str(this.get('entity')) +
                str(this.get('entry'))
        ).toString();
    },

    save(options) {
        this.set('timestamp', Date.now());
        const prev = this.get('latestBlock');

        if (prev) {
            this.set('index', prev.get('index') + 1);
            this.set('previousHash', prev.get('hash'));
        }

        this.set('hash', this.calculateHash());

        return this._super(options);
    },

    saveApply() {
        const store = this.get('store');
        const entity = store.push(
            store.normalize(this.get('entity'), this.get('entry'))
        );
        entity.save({ norelations: true });
        DS.Model.prototype.save.apply(this, arguments);
    },
});
