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
                images = product.get('images').map(imageId =>
                    this.get('store')
                        .findRecord('image', imageId)
                        .catch(() => {
                            this.get('webrtc').send(
                                product.get('author'),
                                { entity: 'image', id: imageId },
                                'entity::request_data'
                            );
                        })
                );
            }

            res({ product, images });
        });
    },
});
