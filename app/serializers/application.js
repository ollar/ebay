import { LSSerializer } from 'ember-localstorage-adapter';

import DS from 'ember-data';

export default LSSerializer.extend();
//

// export default DS.Serializer.extend({
//     normalizeResponse(store, primaryModelClass, payload, id, requestType) {
//         console.log(store, primaryModelClass, payload, id, requestType);

//         return this.normalize({});
//     },
//     serialize(snapshot, options) {
//         console.log(snapshot, options);
//     },
// });
