	// Compare two objects to see if they are substantially the same (i.e. they have the same properties and those properties have the same values)

	function compare(o1, o2) {
		var found = [];
		if(typeof o1 !== 'object' || typeof o2 !== 'object' || o1 === null || o2 === null) {
			return false;
		}
		for(var p in o1) {
			if(o1.hasOwnProperty(p)) {
				if(o1[p] !== null && typeof o1[p] == 'object' && o2[p] !== null && typeof o2[p] == 'object') {
					if(!compare(o1[p], o2[p])) {
						return false;
					}
				} else if(o1[p] !== o2[p]) {
					return false;
				}
				found.push(p);
			}
		}
		for(var p2 in o2) {
			if(o2.hasOwnProperty(p2)) {
				if(!contains(found, p2)) {
					if(o2[p2] !== null && typeof o2[p2] == 'object' && o1[p2] !== null && typeof o1[p2] == 'object') {
						if(!compare(o2[p2], o1[p2])) {
							return false;
						}
					} else if(o2[p2] !== o1[p2]) {
						return false;
					}
					found.push(p2);
				}
			}
		}
		return true;
	}

	// Test whether an array contains a given element. If the element is an object, test by checking if the objects are substantially the same, not necessarily exact duplicates.

	function contains(arr, el) {
		return !!~indexOf(arr, el);
	}

	function indexOf(arr, el) {
		if(el === null || typeof el !== 'object') {
			return arr.indexOf(el); 
		} else {
			var location;
			for(var i=0;i<arr.length;i++) {
				if(compare(arr[i], el)) {
					return i;
				}
			}
		}
		return -1;
	}

	// Add an element to an array only if it doesn't already exist

	function addToSet(set, el) {
		if(!set) {
			set = [];
		}
		if(!contains(set, el)) {
			set.push(el);
		}
		return set;
	}

	// Add each element in an array to another array, only if they do not already exist in the array

	function addEachToSet(set, arr) {
		if(!Array.isArray(arr)) {
			arr = [arr];
		}
		arr.forEach(function(el) {
			set = addToSet(set, el);
		});
		return set;
	}

	// Remove an element from an array

	function removeFromSet(set, el) {
		while(~indexOf(set, el)) {
			set.splice(indexOf(set, el), 1);
		}
		return set;
	}

	// Remvoe each element from an array

	function removeEachFromSet(set, arr) {
		arr.forEach(function(el) {
			removeFromSet(set, el);
		});
		return set;
	}

	// Generate a random string

	function random() {
		return Math.random().toString(36).substring(2);
	}

	exports.compare = compare;
	exports.contains = contains;
	exports.indexOf = indexOf;
	exports.addToSet = addToSet;
	exports.addEachToSet = addEachToSet;
	exports.removeFromSet = removeFromSet;
	exports.removeEachFromSet = removeEachFromSet;
	exports.random = random;