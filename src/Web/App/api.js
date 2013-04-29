define(function (require) {
    var system = require('durandal/system');
    var router = require('durandal/plugins/router');
    
	var info = {
		displayName: ko.observable()
	};
    var apiPath = '';
    var loginRoute = '#/login';
    var unauthorizedRedirectRoute = loginRoute;
    var contentType = 'application/json';
    
    // When the router is ready and the return status of any ajax request is 401,
    // navigate to the unauthorized redirect route.
    $.ajaxSetup({
        error: function (jqXHR) {
            if (router.ready() && jqXHR.status == 401) {
                router.navigateTo(unauthorizedRedirectRoute);
            }
        }
    });
    
    // Logs any failures on ajax calls.
    function ajaxError(type, error) {
    	system.log(type + ' Error', error);
    }
    
    // Common ajax wrapper.
    function ajax(url, data, type) {
        return $.ajax({
            url: apiPath + url,
            data: data ? ko.toJSON(data) : null,
            type: type,
            contentType: contentType,
        }).fail(function (error) {
            ajaxError(type, error);
        });
    };
    
    // Ajax get wrapper.
 	function ajaxGet(url, query) {
 		var type = 'GET';
        return $.ajax({
        	url: apiPath + url + (query ? '?' + $.param(query) : ''),
        	type: type,
        	contentType: contentType,
        	cache: false
        }).fail(function (error) {
        	ajaxError(type, error);
        });
 	}
 	
 	function ajaxMap(mapped, ajax) {
 		return ajax.success(function (response) {
 			ko.object.map(mapped, response);
 		});
 	}
    
    // Wraps promises in a newly created deferred with specified resolve values.
    function deferPromise(promise, successResolve, failResolve) {    		
    	var defer = system.defer(function () {
			promise.then(function () {
				defer.resolve(successResolve);
    		}, function () {
    			defer.resolve(failResolve);
    		});    	 		
    	});
    	return defer.promise();
    }
    
    // Gets the authorization info of the currently logged in user.
    // This is also used to check to see if the user is logged in.
    function getAuthInfo() {
    	return ajaxMap(info, ajaxGet('/auth/info'));
    }
    
    
    var api = {
    	init: function () {
			router.guardRoute = function (routeInfo, params, instance) {
				if (routeInfo.hash == loginRoute) {
			        return deferPromise(getAuthInfo(), '#/', true);
				}			
		        return deferPromise(getAuthInfo(), true, unauthorizedRedirectRoute);
			};
    	},
        get: function (url, query) {
        	return ajaxGet(url, query);
        },
        post: function (url, data) {
            return ajax(url, data, 'POST');
        },
        put: function (url, data) {
            return ajax(url, data, 'PUT');
        },
        del: function (url, data) {
            return ajax(url, data, 'DELETE');
        },
		map: {
		        get: function (mapped, url, query) {
		        	return ajaxMap(mapped, ajaxGet(url, query));
		        },
		        post: function (mapped, url, data) {
		            return ajaxMap(mapped, ajax(url, data, 'POST'));
		        },
		        put: function (mapped, url, data) {
		            return ajaxMap(mapped, ajax(url, data, 'PUT'));
		        },
		        del: function (mapped, url, data) {
		            return ajaxMap(mapped, ajax(url, data, 'DELETE'));
		        },
		},
        login: function (userName, password, rememberMe) {
        	return ajax('/auth/credentials', { userName: userName, password: password, rememberMe: rememberMe }, 'POST');
        },
        logout: function () {
        	info.displayName(null);
        	return ajax('/auth/logout', null, 'POST');
        },
        displayName: ko.computed(function () {
        	return info.displayName();
        }),
        setPath: function (path) {
        	apiPath = path;
        },
        setLoginRoute: function (route) {
        	loginRoute = route;
        },
        setUnauthorizedRedirectRoute: function (route) {
        	unauthorizedRedirectRoute = route;
        },
    };
    
    return api;
});