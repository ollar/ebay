import DS from 'ember-data';
import WriteBlockMixin from '../mixins/write-block';

export default DS.Model.extend(WriteBlockMixin, {
    product: DS.attr('string'),
    // product: DS.belongsTo('product'),
    author: DS.attr('string'),
    price: DS.attr(),
});
