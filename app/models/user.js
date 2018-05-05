import DS from 'ember-data';
import { computed } from '@ember/object';

import Validator from '../mixins/model-validator';

export default DS.Model.extend(Validator, {
    fingerprint: DS.attr('string'),
    username: DS.attr('string'),
    images: DS.hasMany('image'),

    isMe: false,
    connection: computed(() => ({})),
    channel: computed(() => ({})),

    validations: computed(() => ({
        username: {
            presence: true,
        },
    })),
});
