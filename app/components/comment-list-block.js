import Component from '@ember/component';

import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
    classNames: ['comment', 'comment-block'],
    store: service(),
    author: computed(function() {
        return this.get('store').query('user', {
            fingerprint: this.get('comment.author'),
        });
    }),
});
