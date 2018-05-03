import DS from 'ember-data';

import WriteBlockMixin from '../mixins/write-block';
import { computed } from '@ember/object';

export default DS.Model.extend(WriteBlockMixin, {
    title: DS.attr('string'),
    description: DS.attr('string'),
    price: DS.attr('number'),
    preferablePrice: DS.attr('number'),
    author: DS.attr('string'),

    images: DS.hasMany(),

    sold: DS.attr('boolean', { defaultValue: false }),

    bids: DS.hasMany('bid'),
    bidStep: DS.attr('number'),
    timestamp: DS.attr('number'),

    comments: computed(() => []),
});
