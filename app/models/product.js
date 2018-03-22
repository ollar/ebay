import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr('string'),
    description: DS.attr('string'),
    price: DS.attr('number'),
    author: DS.attr('string'),
    sold: DS.attr('boolean', { defaultValue: false }),

    bids: DS.hasMany('bid'),
    // bids: DS.attr({ defaultValue: () => [] }),

    save(options = {}) {
        this._super(options);
        if (!options.norelations) {
            const block = this.get('store').createRecord('block', {
                entry: this.toJSON(),
                entity: 'product'
            });

            block.save();
        }
    }
});
