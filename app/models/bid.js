import DS from 'ember-data';

export default DS.Model.extend({
    product: DS.belongsTo('product'),
    // product: DS.attr('string'),
    author: DS.attr('string'),
    price: DS.attr(),

    save(options = {}) {
        this._super(options);

        if (!options.norelations) {
            const block = this.get('store').createRecord('block', {
                entry: this.toJSON(),
                entity: 'bid',
            });

            block.save();
        }
    },
});
