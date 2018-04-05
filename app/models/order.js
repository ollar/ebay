import DS from 'ember-data';

import WriteBlockMixin from '../mixins/write-block';

export default DS.Model.extend(WriteBlockMixin, {
    seller: DS.attr('string'),
    buyer: DS.attr('string'),
    product: DS.belongsTo(),
    timestamp: DS.attr('number'),
    bid: DS.belongsTo(),
});
