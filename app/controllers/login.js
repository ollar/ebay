import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { uuid } from 'ember-cli-uuid';

import imageResize from '../utils/image-resize';

export default Controller.extend({
    username: '',
    userImage: null,
    imageId: null,
    session: service(),

    actions: {
        uploadImage(files) {
            const file = files[0];
            if (!file.type.match(/(png|jpg|jpeg)/gi)) return;

            imageResize(file).then(image => {
                const userImage = this.get('store').createRecord('image');

                userImage.setProperties({
                    base64: image.base64,
                    type: image.type,
                    name: image.name,
                    size: image.size,
                    width: image.width,
                    height: image.height,
                    lastModified: image.lastModified,
                });

                this.set('image', userImage);
                this.set('imageId', userImage.id);
            });
        },
        submit() {
            if (!this.get('username')) return;

            if (this.get('image')) this.get('image').save();

            this.get('session')
                .authenticate('authenticator:local', {
                    username: this.get('username'),
                    id: uuid(),
                    image: this.get('imageId'),
                })
                .then(() => {
                    this.transitionToRoute('index');
                });

            return;
        },
    },
});
