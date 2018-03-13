import Controller from '@ember/controller';

export default Controller.extend({
    actions: {
        submit() {
            const model = this.get('model');

            // model.set('author', )
            console.log(this.get('model'))
        },
    }
});
