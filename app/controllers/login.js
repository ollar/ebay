import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

import imageResize from '../utils/image-resize';

export default Controller.extend({
    imageId: null,
    session: service(),

    actions: {
        uploadImage(files) {
            const file = files[0];
            if (!file.type.match(/(png|jpg|jpeg)/gi)) return;

            imageResize(file, {maxWidth: 96, maxHeight: 96}).then(image => {
                const userImage = this.get('store').createRecord('image', image);

                this.get('model.images').pushObject(userImage);
                this.set('imageId', userImage.id);
            });
        },
        submit() {
            if (!this.get('model.username')) return;

            this.get('model.images').forEach(image => image.save());
            this.get('model').save();

            this.get('session')
                .authenticate('authenticator:local', {
                    modelId: this.get('model.id'),
                })
                .then(() => {
                    this.transitionToRoute('index');
                });

            return;
        },
    },
});
