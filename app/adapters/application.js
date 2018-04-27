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
                name: `${this._adapterNamespace()}::${modelName}`,
            });

            this.set(`__databases.${modelName}`, db);
        }
        return this.get(`__databases.${modelName}`);
    },

    _adapterNamespace() {
        return this.get('namespace');
    },

    _getNamespaceData(type) {
        return this.__storage()
            .getItem(`${this._adapterNamespace()}::${type}`)
            .then(storage => storage || {})
            .catch(() => ({}));
    },

    _modelNamespace(type) {
        return type.modelName;
    },

    findRecord(store, model, id, snapshot) {
        const _modelName = this._modelNamespace(model);

        return this.__storage()
            .getItem(`${this._adapterNamespace()}::${_modelName}`)
            .then(_data => _data[id]);
    },
    createRecord(store, model, snapshot) {
        let data = this.serialize(snapshot, { includeId: true });
        const _modelName = this._modelNamespace(model);

        const db = this._getModelDb(_modelName);

        return db.setItem(data.id, data);
    },
    updateRecord() {},
    deleteRecord() {},
    findAll(store, model) {
        const _modelName = this._modelNamespace(model);

        const db = this._getModelDb(_modelName);

        all([db.iterate()]).then(val => console.log(val));

        return [];

        // return this._getNamespaceData(_modelName).then(data =>
        //     Object.values(data)
        // );
    },
    query() {},
});
