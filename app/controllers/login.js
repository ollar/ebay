import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { uuid } from 'ember-cli-uuid';

import imageResize from '../utils/image-resize';

export default Controller.extend({
    username: '',
    session: service(),

    actions: {
        uploadImage(file) {
            if (!file.type.match(/(png|jpg|jpeg)/ig)) return;

            imageResize(file).then(image => {
                console.log(image)
            });
        },
        submit() {
            if (!this.get('username')) return;

            this.get('session').authenticate('authenticator:local', {
                username: this.get('username'),
                id: uuid(),
            }).then(() => {
                this.transitionToRoute('index');
            });

            return;
        }
    }
});
