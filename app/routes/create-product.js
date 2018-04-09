import Route from '@ember/routing/route';

export default Route.extend({
    model() {
        return this.get('store').createRecord('product');
    },
    actions: {
        willTransition() {
            const model = this.controllerFor(this.routeName).model;
            if (!model.get('isSaving')) model.unloadRecord();
            return true;
        },
    },
});
