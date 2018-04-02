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
                    const _image = this.get('store').createRecord('image');

                    _image.setProperties({
                        base64: image.base64,
                        type: image.type,
                        name: image.name,
                        size: image.size,
                        width: image.width,
                        height: image.height,
                        lastModified: image.lastModified,
                    });

                    this.get('model.images').addObject(_image);
                });
            });
        },
        submit() {
            const model = this.get('model');
            model.set('author', this.get('session.data.authenticated.id'));

            this.get('model.images').forEach(image => image.save());

            model.save();
            this.transitionToRoute('index');
        },
    },
});
