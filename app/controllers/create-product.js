import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    session: service(),
    actions: {
        submit() {
            const model = this.get('model');
            model.set('author', this.get('session.data.authenticated.id'));

            model.save();
            this.transitionToRoute('index');
        },
    },
});
