import DS from 'ember-data';
import CryptoJS from 'cryptojs';

export default DS.Model.extend({
    index: DS.attr('number'),
    timestamp: DS.attr('number'),
    entry: DS.attr(),
    hash: DS.attr('string'),
    previousHash: DS.attr('string'),

    calculateHash() {
        return CryptoJS.SHA256(this.get('index') + this.get('previousHash') + this.get('timestamp') + this.get('entry')).toString();
    },

    save(options) {
        this.set('timestamp', new Date().valueOf());
        this.set('hash', this.calculateHash());
        const prev = this.get('store')
                         .peekAll('block')
                         .filter((item) => item.id !== this.id)
                         .sortBy('timestamp')
                         .get('lastObject');

        if (prev) {
            this.set('index', prev.get('index') + 1);
            this.set('previousHash', prev.get('hash'));
        } else {
            this.set('index', 0);
            this.set('previousHash', this.get('hash'));
        }

        return this._super(options);
    }
});
