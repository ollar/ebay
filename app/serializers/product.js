import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
    attrs: {
        bids: { serialize: true }
    }
});
