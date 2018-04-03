import DS from 'ember-data';
import WriteBlockMixin from '../mixins/write-block';
import { inject as service } from '@ember/service';

export default DS.Model.extend(WriteBlockMixin, {
    session: service(),
    product: DS.belongsTo('product'),
    author: DS.attr('string'),
    price: DS.attr(),

    save() {
        this.set('author', this.get('session.data.authenticated.id'));
        this._super(...arguments);
    },
});
