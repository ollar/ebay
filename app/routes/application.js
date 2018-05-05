import Route from '@ember/routing/route';

import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Route.extend(AuthenticatedRouteMixin, {
  notify: service(),
  notificationTypes: computed(() => [
    'info',
    'success',
    'warning',
    'alert',
    'error',
  ]),

  model() {
    return hash({
      blocks: this.get('store').findAll('block'),
      users: this.get('store').findAll('user'),
    });
  },

  actions: {
    error(e) {
      alert(e);
    },
    notify({ type, text }) {
      if (this.get('notificationTypes').indexOf(type) === -1) {
        return this.send('error', text);
      }
      return this.get('notify')[type](text);
    },
  },
});
