import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Serializer | block', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('block');

    assert.ok(serializer);
  });

  test('it serializes records', function(assert) {
    let store = this.owner.lookup('service:store');
    let record = run(() => store.createRecord('block', {}));

    let serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });

  test('it serializes correctly', function(assert) {
    let store = this.owner.lookup('service:store');
    run(() => {
      var record = store.createRecord('block', {
        entity: 'product',
        entry: {},
      });

      record.save();

      let serializedRecord = record.serialize();

      assert.equal(serializedRecord.index, 0);
      assert.equal(serializedRecord.entity, 'product');
      assert.equal(serializedRecord.previousHash, '');
      assert.ok(serializedRecord.hash);
      assert.ok(serializedRecord.timestamp);
    });
  });
});
