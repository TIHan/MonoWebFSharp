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
        	// These are test API calls. Remove them.
        	var testGet = api.map.get(self.testGetResponse, '/test');     	
        	var testMessageGet = api.map.get(self.testMessageGetResponse, '/test/message/' + 'Custom');       	
        	var testQueryGet = api.map.get(self.testQueryGetResponse, '/testquery', { field1: 'Test1', field2: 'Test2', field3: 'Test3' });			
			var testListGet = api.map.get(self.testListGetResponse, '/testlist');			
			var testPost = api.map.post(self.testPostResponse, '/test');			
			var testMessagePost = api.map.post(self.testMessagePostResponse, '/test/message', { message: 'Custom' });			
			var testPut = api.map.put(self.testPutResponse, '/test');			
			var testMessagePut = api.map.put(self.testMessagePutResponse, '/test/message', { message: 'Custom' });			
			var testDelete = api.map.del(self.testDeleteResponse, '/test');			
			var testMessageDelete = api.map.del(self.testMessageDeleteResponse, '/test/message', { message: 'Custom' });			
			return $.when(testGet, testMessageGet, testQueryGet, testListGet, testPost,
					testMessagePost, testPut, testMessagePut, testDelete, testMessageDelete);
        };

        self.canActivate = function () {
            return true;
        };

        /*************************************************************************/
        /* Non-Conventional
        /*************************************************************************/
        
        self.testGetResponse = ko.observable().construct(function () {
        	return {
        		message: ko.observable(),
        		timestamp: ko.observableMoment()
        	};
        });
        self.testMessageGetResponse = ko.observable();
        self.testQueryGetResponse = ko.observable();
        self.testListGetResponse = ko.observableArray().construct(function () {
        	return {
        		message: ko.observable(),
        		timestamp: ko.observableMoment()
        	};
        });
        
        self.testPostResponse = ko.observable();
        self.testMessagePostResponse = ko.observable();
        
        self.testPutResponse = ko.observable();
        self.testMessagePutResponse = ko.observable();
        
        self.testDeleteResponse = ko.observable();
        self.testMessageDeleteResponse = ko.observable();
        
        self.displayName = api.displayName;
        
        self.logout = function () {
        	api.logout().done(function () {
				router.navigateTo('#/login');
        	});
        };

        /*************************************************************************/
        /* Events
        /*************************************************************************/
    }

    return new vm();
});