import DS from 'ember-data';

export default DS.JSONSerializer.extend({
    serialize(snapshot, options) {
        const _options = Object.assign({}, options, { includeId: true });
        return this._super(snapshot, _options);
    },
});
