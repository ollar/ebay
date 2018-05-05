/* eslint-env node */
'use strict';

module.exports = function(/* environment, appConfig */) {
    // See https://github.com/san650/ember-web-app#documentation for a list of
    // supported properties

    return {
        name: 'Ebay p2p',
        short_name: 'ebay',
        description: 'POK of dummy p2p trading platform',
        start_url: '/',
        display: 'fullscreen',
        background_color: '#fff',
        theme_color: '#fff',
        icons: [],
        ms: {
            tileColor: '#fff',
        },
    };
};
