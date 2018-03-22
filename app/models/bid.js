import DS from 'ember-data';

export default DS.Model.extend({
    // product: DS.belongsTo('product'),
    product: DS.attr('string'),
    author: DS.attr('string'),
    price: DS.attr(),
});
