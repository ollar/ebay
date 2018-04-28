import DS from 'ember-data';

export default DS.Model.extend({
    _broadcastOnSave: true,

    base64: DS.attr('string'),
    type: DS.attr('string'),
    name: DS.attr('string'),
    size: DS.attr('number'),
    lastModified: DS.attr('number'),
    width: DS.attr('number'),
    height: DS.attr('number'),
});
