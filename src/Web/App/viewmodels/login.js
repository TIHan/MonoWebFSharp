define(function (require) {
    var system = require('durandal/system');
    var router = require('durandal/plugins/router');
	var api = require('api');

    function vm() {
        /*************************************************************************/
        /* Private
        /*************************************************************************/
        
        var self = this;

        /*************************************************************************/
        /* Conventional
        /*************************************************************************/

        self.activate = function () {
			return true;
        };

        self.canActivate = function () {
            return true;
        };

        /*************************************************************************/
        /* Non-Conventional
        /*************************************************************************/
        
        self.userName = ko.observable();
        
        self.password = ko.observable();
        
        self.rememberMe = ko.observable();
        
        self.login = function () {
        	api.login(self.userName(), self.password(), self.rememberMe()).done(function () {
        		router.navigateTo('#/');
        	});
        };

        /*************************************************************************/
        /* Events
        /*************************************************************************/
    }

    return new vm();
});
