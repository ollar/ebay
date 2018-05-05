import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import imageResize from '../utils/image-resize';

export default Controller.extend({
    session: service(),
    actions: {
        uploadImage(files) {
            files.forEach(file => {
                if (!file.type.match(/(png|jpg|jpeg)/gi)) return;

                imageResize(file).then(image => {
                    const _image = this.get('store').createRecord(
                        'image',
                        image
                    );

                    this.get('model.images').addObject(_image);
                });
            });
        },
        removeImage(image) {
            this.get('model.images').removeObject(image);
        },
        submit() {
            const model = this.get('model');

            if (!model.validate()) return;

            model.set('author', this.get('session.data.authenticated.id'));

            this.get('model.images').forEach(image => image.save());

            return model.save().then(() => this.transitionToRoute('index'));
        },
    },
});
