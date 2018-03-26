import DS from 'ember-data';

export default DS.Model.extend({
    seller: DS.attr('string'),
    buyer: DS.attr('string'),
    product: DS.attr('string'),
    timestamp: DS.attr('number'),
    bid: DS.attr('string'),
});
