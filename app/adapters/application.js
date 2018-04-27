import DS from 'ember-data';

import localforage from 'npm:localforage';
import { computed } from '@ember/object';
import { resolve, all } from 'rsvp';
import { run } from '@ember/runloop';

export default DS.Adapter.extend({
    namespace: 'ebay',
    __databases: computed(() => ({})),

    __storage() {
        return localforage;
    },

    _getModelDb(modelName) {
        if (!this.get(`__databases.${modelName}`)) {
            const db = this.__storage().createInstance({
                name: `${this._adapterNamespace()}__${modelName}`,
            });

            this.set(`__databases.${modelName}`, db);
        }
        return this.get(`__databases.${modelName}`);
    },

    _adapterNamespace() {
        return this.get('namespace');
    },

    _modelNamespace(type) {
        return type.modelName;
    },

    findRecord(store, type, id, snapshot) {
        const db = this._getModelDb(this._modelNamespace(type));

        // check if item no found
        return db.getItem(id);
    },
    createRecord(store, type, snapshot) {
        const db = this._getModelDb(this._modelNamespace(type));
        const data = snapshot.serialize({ includeId: true });

        return db.setItem(data.id, data);

    },
    updateRecord() {},
    deleteRecord(store, type, snapshot) {
        const db = this._getModelDb(this._modelNamespace(type));
        const data = snapshot.serialize({ includeId: true });

        return db.removeItem(data.id);
    },
    findAll(store, type, sinceToken, snapshotRecordArray) {
        const db = this._getModelDb(this._modelNamespace(type));
        return db
            .keys()
            .then(keys => all(keys.map(key => this.findRecord(store, type, key, null))));
    },
    query() {},
});
