import Controller from '@ember/controller';

export default Controller.extend({
    username: '',


    actions: {
        submit() {
            console.log(this.get('username'));

            const me = this.get('store').createRecord('me', {
                username: this.get('username'),
            });

            me.save();
        }
    }
});
