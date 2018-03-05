import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | rest', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:rest');
    assert.ok(route);
  });
});
