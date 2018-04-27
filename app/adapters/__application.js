import LSAdapter from 'ember-localstorage-adapter';

import localforage from 'npm:localforage';

import { inject as service } from '@ember/service';
import { resolve, all } from 'rsvp';
import { A } from '@ember/array';
import trace from '../utils/trace';

export default LSAdapter.extend({
    namespace: 'ebay',
    webrtc: service(),
    _localStorage: localforage,

    requestData(entity, id) {
        this.get('webrtc').broadcast({ entity, id }, 'entity::request_data');
    },

    notFoundRecordError(modelName, id) {
        return `Couldn't find record of type '${modelName}' for the id '${id}'.`;
    },

    findRecord: function findRecord(store, type, id, opts) {
        var allowRecursive = true;
        var namespace = this._namespaceForType(type);
        var record = A(namespace.records[id]);
        var _checkRecord = [];

        if (opts && typeof opts.allowRecursive !== 'undefined') {
            allowRecursive = opts.allowRecursive;
        }

        Object.keys(record).forEach(key => {
            if (key !== 'id' && record[key] !== null)
                _checkRecord.push(record[key]);
        });

        if (
            !record ||
            !record.hasOwnProperty('id') ||
            _checkRecord.length === 0
        ) {
            trace(this.notFoundRecordError(type.modelName, id));
            if (!opts.quite) {
                this.requestData(type.modelName, id);
            }
            record = { id };
        }

        if (allowRecursive) {
            return this.loadRelationships(store, type, record);
        } else {
            return resolve(record);
        }
    },

    findMany: function findMany(store, type, ids, opts) {
        return all(ids.map(id => this.findRecord(store, type, id, opts)));
    },
});
