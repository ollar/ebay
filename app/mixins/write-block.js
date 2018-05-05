import Mixin from '@ember/object/mixin';

export default Mixin.create({
    save(options = {}) {
        if (!options.norelations) {
            const block = this.get('store').createRecord('block', {
                entry: this.serialize({ includeId: true }),
                entity: this.get('_internalModel.modelName'),
            });

            block.save();
        }
        return this._super(options);
    },
});
