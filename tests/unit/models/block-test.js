import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';
import CryptoJS from 'cryptojs';

import str from '../../../utils/str';

var product1stub = {
    title: 'test',
    description: 'test',
    price: 1,
    preferablePrice: 1,
    bidStep: 1,
    author: 'tester',
};

var product2stub = {
    title: 'test2',
    description: 'test2',
    price: 1,
    preferablePrice: 1,
    bidStep: 1,
    author: 'tester',
};

module('Unit | Model | block', function(hooks) {
    setupTest(hooks);

    // Replace this with your real tests.
    test('it exists', function(assert) {
        let store = this.owner.lookup('service:store');
        let model = run(() => store.createRecord('block', {}));
        assert.ok(model);
    });

    test('it creates hash', function(assert) {
        let store = this.owner.lookup('service:store');
        run(() => {
            var product = store.createRecord('product', product1stub);

            run(() => {
                var model = store.createRecord('block', {
                    entity: 'product',
                    entry: product,
                });
                model.save();
                assert.ok(model.get('hash'));
            });
        });
    });

    test('check hashes chain', function(assert) {
        let store = this.owner.lookup('service:store');
        run(() => {
            var product1 = store.createRecord('product', product1stub);
            var product2 = store.createRecord('product', product2stub);

            run(() => {
                var block1 = store.createRecord('block', {
                    entity: 'product',
                    entry: product1,
                });
                var block2 = store.createRecord('block', {
                    entity: 'product',
                    entry: product2,
                });
                block1.save();
                block2.save();

                assert.equal(block1.get('hash'), block2.get('previousHash'));
            });
        });
    });

    test('check hash validity', function(assert) {
        let store = this.owner.lookup('service:store');
        run(() => {
            var product1 = store.createRecord('product', product1stub);

            run(() => {
                var block1 = store.createRecord('block', {
                    entity: 'product',
                    entry: product1,
                });

                block1.save();

                var hash = CryptoJS.SHA256(
                    str(block1.get('index')) +
                        str(block1.get('previousHash')) +
                        str(block1.get('timestamp')) +
                        str(block1.get('entity')) +
                        str(block1.get('entry'))
                ).toString();

                assert.equal(block1.get('hash'), hash);
            });
        });
    });
});
