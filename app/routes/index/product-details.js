import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    webrtc: service(),
    model(options) {
        var images = [];
        return new Promise(res => {
            const product = this.get('store').peekRecord(
                'product',
                options.product_id
            );

            if (product.get('images.length')) {
                images = product.get('images').map(imageId => {
                    console.log(imageId);
                    let image = this.get('store').peekRecord('image', imageId);
                    if (!image) {
                        this.get('webrtc').send(
                            product.get('author'),
                            { entity: 'image', id: imageId },
                            'entity::request_data'
                        );
                    }
                    console.log(image);
                    return image;
                });
            }

            console.log(images);

            res({ product, images });
        });
    },
});
