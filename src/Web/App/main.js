require.config({
    paths: { "text": "durandal/amd/text" }
});

define(function (require) {
    var app = require('durandal/app');
    var viewLocator = require('durandal/viewLocator');
    var system = require('durandal/system');
    var router = require('durandal/plugins/router');
    var composition = require('durandal/composition');
    var widget = require('durandal/widget');
    var api = require('api');

    system.debug(true);

    app.start().then(function () {
        app.title = 'App'; // Change app title.
        router.useConvention();
        viewLocator.useConvention();
        composition.activateDuringComposition = true;
        api.init();
        api.setPath('/api');
        app.setRoot('viewmodels/shell');
    });
});