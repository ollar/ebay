import Component from '@ember/component';

export default Component.extend({
    classNames: ['modal-wrapper'],

    actions: {
        close() {
            if (this._close) this._close();
        },
    },
});
