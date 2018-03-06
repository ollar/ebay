import Controller from '@ember/controller';

export default Controller.extend({
    username: '',


    actions: {
        submit() {
            if (!this.get('username')) return;

            const me = this.get('store').createRecord('me', {
                username: this.get('username'),
            });

            me.save();
        }
    }
});
