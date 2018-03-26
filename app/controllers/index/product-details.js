import Controller from '@ember/controller';

export default Controller.extend({
    actions: {
        bid(model) {
            console.log('this');

            this.transitionToRoute('index.product-details.bid', model)
        },
    },
});
