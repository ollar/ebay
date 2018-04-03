import DS from 'ember-data';

import WriteBlockMixin from '../mixins/write-block';

export default DS.Model.extend(WriteBlockMixin, {
    title: DS.attr('string'),
    description: DS.attr('string'),
    price: DS.attr('number'),
    preferablePrice: DS.attr('number'),
    author: DS.attr('string'),

    images: DS.hasMany('image'),
    sold: DS.attr('boolean', { defaultValue: false }),

    bids: DS.hasMany('bid'),
    bidStep: DS.attr('number'),
});
