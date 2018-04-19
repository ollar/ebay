import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
    username: DS.attr('string'),
    image: DS.attr('string'),

    connection: computed(() => ({})),
    channel: computed(() => ({})),
});
