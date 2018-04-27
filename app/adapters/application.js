import DS from 'ember-data';

import localforage from 'npm:localforage';
import { computed } from '@ember/object';
import { all } from 'rsvp';
import { run } from '@ember/runloop';
import { inject as service } from '@ember/service';
import trace from '../utils/trace';

export default DS.Adapter.extend({
    webrtc: service(),
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

    _notFoundRecordError(modelName, id) {
        return `Couldn't find record of type '${modelName}' for the id '${id}'.`;
    },

    _requestData(entity, id) {
        return run(() =>
            this.get('webrtc').broadcast({ entity, id }, 'entity::request_data')
        );
    },

    findRecord(store, type, id, snapshot, opts = {}) {
        const db = this._getModelDb(this._modelNamespace(type));

        // check if item no found
        return db
            .getItem(id)
            .then(record => {
                if (!record) {
                    trace(this._notFoundRecordError(type.modelName, id));
                    if (!opts.quite) {
                        this._requestData(type.modelName, id);
                    }
                    record = { id };
                }

                return record;
            })
            .catch(e => trace(e));
    },
    createRecord(store, type, snapshot) {
        const db = this._getModelDb(this._modelNamespace(type));
        const data = snapshot.serialize();

        return db.setItem(data.id, data);
    },
    updateRecord(store, type, snapshot) {
        var data = this.serialize(snapshot);
        var id = snapshot.id;
        const db = this._getModelDb(this._modelNamespace(type));

        return this.findRecord(store, type, id, snapshot, { quite: true })
            .then(record => Object.assign({}, record, data))
            .then(newRecord => db.setItem(id, newRecord));
    },
    deleteRecord(store, type, snapshot) {
        const db = this._getModelDb(this._modelNamespace(type));
        const data = snapshot.serialize();

        return db.removeItem(data.id);
    },
    findAll(store, type /*sinceToken, snapshotRecordArray*/) {
        const db = this._getModelDb(this._modelNamespace(type));
        return db
            .keys()
            .then(keys =>
                all(keys.map(key => this.findRecord(store, type, key, null)))
            );
    },
    query(store, type /*query, recordArray*/) {
        return this.findAll(store, type);
    },
});
