import DS from 'ember-data';
import WriteBlockMixin from '../mixins/write-block';
import { inject as service } from '@ember/service';

export default DS.Model.extend(WriteBlockMixin, {
    session: service(),
    product: DS.belongsTo('product'),
    author: DS.attr('string'),
    price: DS.attr(),
    timestamp: DS.attr('number'),
});
