import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    username: '',
    session: service(),

    actions: {
        submit() {
            if (!this.get('username')) return;

            this.get('session').authenticate();

            return;

            const me = this.get('store').createRecord('me', {
                username: this.get('username'),
            });

            me.save();
        }
    }
});
