import DS from 'ember-data';

import localforage from 'npm:localforage';
import { computed } from '@ember/object';
import { all } from 'rsvp';
import { run } from '@ember/runloop';
import { inject as service } from '@ember/service';
import trace from '../utils/trace';

import _ from 'npm:lodash/collection';

export default DS.Adapter.extend({
    webrtc: service(),
    storeEvents: service(),
    namespace: 'ebay',

    shouldReloadRecord: (/*store, snapshot*/) => true,
    shouldReloadAll: (/*store, snapshotsArray*/) => true,
    shouldBackgroundReloadRecord: (/*store, snapshot*/) => true,
    shouldBackgroundReloadAll: (/*store, snapshotsArray*/) => true,

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

        this.get('storeEvents').trigger('before::findRecord');
        this.get('storeEvents').trigger(
            `before::findRecord::${this._modelNamespace(type)}`
        );

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

        this.get('storeEvents').trigger('before::createRecord', snapshot);
        this.get('storeEvents').trigger(
            `before::createRecord::${this._modelNamespace(type)}`,
            snapshot
        );

        if (snapshot.record._broadcastOnSave) {
            this.get('webrtc').broadcast(
                { data, entity: snapshot.modelName },
                'entity::create'
            );
        }

        return db.setItem(data.id, data).then(record => {
            this.get('storeEvents').trigger('createRecord', record);
            this.get('storeEvents').trigger(
                `createRecord::${this._modelNamespace(type)}`,
                record
            );

            return record;
        });
    },
    updateRecord(store, type, snapshot) {
        var data = this.serialize(snapshot);
        var id = snapshot.id;
        const db = this._getModelDb(this._modelNamespace(type));

        this.get('storeEvents').trigger('before::updateRecord', snapshot);
        this.get('storeEvents').trigger(
            `before::updateRecord::${this._modelNamespace(type)}`,
            snapshot
        );

        return this.findRecord(store, type, id, snapshot, { quite: true })
            .then(record => Object.assign({}, record, data))
            .then(newRecord =>
                db.setItem(id, newRecord).then(newRecord => {
                    this.get('storeEvents').trigger('updateRecord', newRecord);
                    this.get('storeEvents').trigger(
                        `updateRecord::${this._modelNamespace(type)}`,
                        newRecord
                    );

                    return newRecord;
                })
            );
    },
    deleteRecord(store, type, snapshot) {
        const db = this._getModelDb(this._modelNamespace(type));
        const data = snapshot.serialize();

        this.get('storeEvents').trigger('before::deleteRecord', snapshot);
        this.get('storeEvents').trigger(
            `before::deleteRecord::${this._modelNamespace(type)}`,
            snapshot
        );

        return db.removeItem(data.id).then(() => {
            this.get('storeEvents').trigger('deleteRecord', snapshot);
            this.get('storeEvents').trigger(
                `deleteRecord::${this._modelNamespace(type)}`,
                snapshot
            );

            return true;
        });
    },
    findAll(store, type /*sinceToken, snapshotRecordArray*/) {
        const db = this._getModelDb(this._modelNamespace(type));
        return db
            .keys()
            .then(keys =>
                all(
                    keys.map(key => this.findRecord(store, type, key, null))
                ).then(recs => recs)
            );
    },
    query(store, type, query /*recordArray*/) {
        return this.findAll(store, type).then(items => _.filter(items, query));
    },
});
