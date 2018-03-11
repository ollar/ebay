import DS from 'ember-data';

export default DS.Model.extend({
    index: DS.attr('number'),
    timestamp: DS.attr('number'),
    _data: DS.attr('string'),
    hash: DS.attr('string'),
    previousHash: DS.attr('string'),
});
