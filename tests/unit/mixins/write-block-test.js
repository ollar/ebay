import EmberObject from '@ember/object';
import WriteBlockMixin from 'ebay/mixins/write-block';
import { module, test } from 'qunit';

module('Unit | Mixin | write-block', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let WriteBlockObject = EmberObject.extend(WriteBlockMixin);
    let subject = WriteBlockObject.create();
    assert.ok(subject);
  });
});
