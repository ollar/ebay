import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { uuid } from 'ember-cli-uuid';

export default Controller.extend({
    username: '',
    session: service(),

    actions: {
        submit() {
            if (!this.get('username')) return;

            this.get('session').authenticate('authenticator:local', {
                username: this.get('username'),
                id: uuid(),
            });

            return;
        }
    }
});
