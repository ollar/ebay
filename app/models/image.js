import DS from 'ember-data';

export default DS.Model.extend({
    baseData: DS.attr('string'),
    width: DS.attr('number'),
    height: DS.attr('number'),
});
