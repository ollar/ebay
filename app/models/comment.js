import DS from 'ember-data';

export default DS.Model.extend({
    _broadcastOnSave: true,

    title: DS.attr('string'),
    body: DS.attr('string'),

    author: DS.attr('string'),
    timestamp: DS.attr('number'),
    product: DS.belongsTo('product'),
    // parent: DS.belongsTo('comment'),
    // children: DS.hasMany('comment'),
});
