(function () {
    function toObservable(obj) {
    	var observableObj = _.isArray(obj) ? [] : {};

        _.each(obj, function (v, k) {
        	if (_.contains(v, '\/') || ko.isObservableMoment(v)) { // Hack: Usually a date here.
        		observableObj[k] = ko.observableMoment(ko.utils.unwrapObservable(v));
        	} else {
            	observableObj[k] = _.isInstance(v) ? toObservable(v) : ko.observable(ko.utils.unwrapObservable(v));
        	}
        });

        return observableObj;
    }
        
    // The object value only gets updated if it is
    // a writeable observable that is not an instance.
    function updateObject(obj, value) {
        if (ko.isWriteableObservable(obj)) {
            if (_.isInstance(obj())) {
                ko.object.map(obj, value);
            } else {
                if (obj() !== value) {
                    obj(value);
                }
            }
        } else if (_.isInstance(obj)) {
            ko.object.map(obj, value);
        }
    }
    
    function mapInstance(mapped, obj) {
        var unwrapped = ko.utils.unwrapObservable(mapped);
        
        _.each(obj, function (v, k) {
            var prop = unwrapped[k];
            if (prop) {
                updateObject(prop, v);
            }
        });
    }
    
    function mapArray(mapped, obj) {
        var unwrapped = ko.utils.unwrapObservable(mapped);
        
        mapped.valueWillMutate();      
        for (var len = unwrapped.length - obj.length; len > 0; --len) {
            unwrapped.pop();
        }

        _.each(obj, function (v, k) {
            if (unwrapped.length >= k + 1) {
                ko.object.map(unwrapped[k], v);
            } else {
                if (mapped.ctor) {
                    unwrapped.push(ko.object.create(mapped.ctor, v));
                } else {
                    unwrapped.push(v);
                }
            }
        });
        
        // Let's just go ahead and tell subscribers that the array changed even though it may
        // not have, this approach is simple without having to add more complexity by checking other observables.
        // TODO: In the future, we could check to see if any of the items' observables have mutated
        // TODO: to determine if the array will be marked as mutated. This requires work though.
        mapped.valueHasMutated();
    }
    
    function isArrayUnwrapped(obj) {
    	return _.isArray(ko.utils.unwrapObservable(obj));
    }
    
    function isArrayMapping(mapped, obj) {
    	return isArrayUnwrapped(mapped) && _.isArray(obj);
    }
    
    function isMappingValid(mapped, obj) {
        // The mapped object should be an instance.
        if (!_.isInstance(mapped) && !ko.isObservableInstance(mapped))
            return false;

        // The object to map should be an instance.
        if (!_.isInstance(obj))
            return false;
            
        // The mapped object and object to map both need to be either an array or not.
        if (isArrayUnwrapped(mapped) != _.isArray(obj))
        	return false;

        return true;
    }
    
    ko.subscribable.fn.construct = function (ctor) {
    	this.ctor = ctor;
		return this;
    }
    
    _.isInstance = function (obj) {
        if (_.isObject(obj) && !_.isFunction(obj)) {
            return true;
        }
        return false;
    };
    
    ko.isObservableInstance = function (instance) {
        if (ko.isObservable(instance) && _.isInstance(instance())) {
            return true;
        }
        return false;
    };

    ko.object = {
        create: function (ctor, obj) {
        	var created;
        	
            // Only allow functions, not including observables.
            if (ko.isObservable(ctor) || !_.isFunction(ctor)) {
                return null;
            }

            created = ctor();
            ko.object.map(created, obj);
            return created;
        },
        map: function (mapped, obj) {
			// If our mapped object is observable and null, create one based on the object to map.
			if (ko.isObservable(mapped) && (mapped() == null || mapped() == undefined)) {
				if (mapped.ctor) {
					var created = ko.object.create(mapped.ctor, obj);
					mapped(created)
					return;
				}
				mapped(toObservable(obj));
				return;
			}
			
        	// Is the mapping valid?
			if (!isMappingValid(mapped, obj))
				return;

            // Check to see if we are mapping arrays.
            if (isArrayMapping(mapped, obj)) {
                mapArray(mapped, obj);
                return;
            }
			mapInstance(mapped, obj);
        }
    };
})();