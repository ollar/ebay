import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
    location: config.locationType,
    rootURL: config.rootURL,
});

Router.map(function() {
    this.route('login');
    this.route('create-product');

    this.route('index', { path: '/' }, function() {
        this.route(
            'product-details',
            { path: '/product/:product_id' },
            function() {
                this.route('bid');
            }
        );
    });
});

export default Router;
