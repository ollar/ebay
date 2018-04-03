import DS from 'ember-data';

export default DS.Model.extend({
    username: DS.attr('string'),
    connection: DS.attr(),
    channel: DS.attr(),
    image: DS.attr('string'),
});
