import LSAdapter from 'ember-localstorage-adapter';

import { inject as service } from '@ember/service';

export default LSAdapter.extend({
    namespace: 'ebay',
    webrtc: service(),

    findRecord: function findRecord(store, type, id, opts) {
        var allowRecursive = true;
        var namespace = this._namespaceForType(type);
        var record = Ember.A(namespace.records[id]);

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

        if (!record || !record.hasOwnProperty('id')) {
            this.get('webrtc').broadcast(
                {
                    entity: type.modelName,
                    id,
                },
                'entity::request_data'
            );
            return Ember.RSVP.reject(
                new Error(
                    "Couldn't find record of" +
                        " type '" +
                        type.modelName +
                        "' for the id '" +
                        id +
                        "'."
                )
            );
        }

        if (allowRecursive) {
            return this.loadRelationships(store, type, record);
        } else {
            return Ember.RSVP.resolve(record);
        }
    },
});
