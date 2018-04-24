import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
    username: DS.attr('string'),
    images: DS.hasMany('image'),

    connection: computed(() => ({})),
    channel: computed(() => ({})),
});
