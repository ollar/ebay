import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    session: service(),
    actions: {
        submit() {
            const model = this.get('model');
            model.set('author', this.get('session.data.authenticated.id'));

            const block = this.get('store').createRecord('block', { entry: model.toJSON() });

            // model.set('author', )
            console.log(this.get('model'))

            model.save();
            block.save();
        },
    }
});
