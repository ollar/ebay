import LSAdapter from 'ember-localstorage-adapter';

import { inject as service } from '@ember/service';
import { reject, resolve } from 'rsvp';
import { A } from '@ember/array';

export default LSAdapter.extend({
    namespace: 'ebay',
    webrtc: service(),

    findRecord: function findRecord(store, type, id, opts) {
        var allowRecursive = true;
        var namespace = this._namespaceForType(type);
        var record = A(namespace.records[id]);

        if (opts && typeof opts.allowRecursive !== 'undefined') {
            allowRecursive = opts.allowRecursive;
        }

        if (!record || !record.hasOwnProperty('id')) {
            if (!opts.quite) {
                this.get('webrtc').broadcast(
                    {
                        entity: type.modelName,
                        id,
                    },
                    'entity::request_data'
                );
            }
            return reject();
        }

        if (allowRecursive) {
            return this.loadRelationships(store, type, record);
        } else {
            return resolve(record);
        }
    },

    findMany: function findMany(store, type, ids, opts) {
        console.log(store, type, ids, opts);
        var namespace = this._namespaceForType(type);
        var allowRecursive = true,
            results = A([]),
            record;

        /**
         * In the case where there are relationships, this method is called again
         * for each relation. Given the relations have references to the main
         * object, we use allowRecursive to avoid going further into infinite
         * recursiveness.
         *
         * Concept from ember-indexdb-adapter
         */
        if (opts && typeof opts.allowRecursive !== 'undefined') {
            allowRecursive = opts.allowRecursive;
        }

        for (var i = 0; i < ids.length; i++) {
            record = namespace.records[ids[i]];
            if (!record || !record.hasOwnProperty('id')) {
                this.get('webrtc').broadcast(
                    {
                        entity: type.modelName,
                        id: ids[i],
                    },
                    'entity::request_data'
                );
                // reject(
                //     new Error(
                //         "Couldn't find record of type '" +
                //             type.modelName +
                //             "' for the id '" +
                //             ids[i] +
                //             "'."
                //     )
                // );
                continue;
            }
            results.push(Ember.copy(record));
        }

        if (results.get('length') && allowRecursive) {
            return this.loadRelationshipsForMany(store, type, results);
        } else {
            return resolve(results);
        }
    },
});
