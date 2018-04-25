import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
    fingerprint: DS.attr('string'),
    username: DS.attr('string'),
    images: DS.hasMany('image'),
    isMe: DS.attr('boolean', { defaultValue: false }),

    connection: computed(() => ({})),
    channel: computed(() => ({})),
});
