'use strict';


export var curry = (function () {
  var curry1 = function (fn) {
    return function curry1fn(a) {
      return (arguments.length > 0) ? fn(a) : curry1fn;
    };
  };

  var curry2 = function (fn) {
    return function curry2fn(a, b) {
      switch(arguments.length) {
        case 0: return curry2fn;
        case 1: return curry1(function(b) { return fn(a, b); });
        default: return fn(a, b);
      }
    };
  };

  var curry3 = function (fn) {
    return function curry3fn(a, b, c) {
      switch(arguments.length) {
        case 0: return curry3fn;
        case 1: return curry2(function(b, c) { return fn(a, b, c); });
        case 2: return curry1(function(c) { return fn(a, b, c); });
        default: return fn(a, b, c);
      }
    };
  };

  var curryN = function (len, prevArgs, fn) {
    return function (...args) {
      var currArgs = prevArgs.concat(args);
      return (currArgs.length >= len) ? fn.apply(this, currArgs) : curryN(len, currArgs, fn);
    };
  };

  return function (fn) {
    switch(fn.length) {
      case 0: return fn;
      case 1: return curry1(fn);
      case 2: return curry2(fn);
      case 3: return curry3(fn);
      default: return curryN(fn.length, [], fn);
    }
  };
}());





export var isNullUndef = x => x === undefined || x === null;
export var isUndef = x => x === undefined;

//given an object, return an array of [key, val] pairs
export var objToArr = obj => {
  if (isNullUndef(obj)) { return []; }
  return Object.keys(obj).map(key => [key, obj[key]]);
};

//given a blacklist return a function that takes an array of [key, val]
//then returns an array without blacklisted keys
export var filterBlacklist = blist => arr => arr.filter(item => blist.indexOf(item[0]) < 0);

//given a number, returns a function that when given an array,
//splits the array into groups of N with remainder in final item
export var splitArray = curry((n, arr) => {
  var pos = 0,
      acc = [];

  while (pos < arr.length) {
    acc.push(arr.slice(pos, pos + n));
    pos += n;
  }
  return acc;
});

//given object, return object that is a copy of all enumerable properties
export var cloneObj = obj => {
  var key, acc = {};
  for(key in obj) {
    if (obj.hasOwnProperty(key)) {
      acc[key] = obj[key];
    }
  }
  return acc;
};

export var emptyObjFromList = curry((val, arr) => {
  var obj = {};
  arr.forEach(item => obj[item] = val);
  return obj;
});

//return new object keeping all fields except for ones listed in arr
export var omit = curry(function omit(arr, obj) {
  var k, acc = {};
  for (k in obj) {
    if (obj.hasOwnProperty(k) && arr.indexOf(k) < 0) {
      acc[k] = obj[k];
    }
  }
  return acc;
});

//merge second object into first and return new object
export var merge = curry(function merge(obj1, obj2) {
  var k, acc = cloneObj(obj1);
  for (k in obj2) {
    if (obj2.hasOwnProperty(k)) {
      acc[k] = obj2[k];
    }
  }
  return acc;
});


/**
 * @func sfName2DispName
 * Takes SF object name and returns displayable name
 * @param {String} sfName - SF name to transform
 * @return {String} - name transformed into displayName
 */
export var sfName2DispName = function sf2DisplayName(sfName) {
  return sfName.replace(/__c$/, '') //FIRST remove the '__c' if it exists
               .replace(/_/g, ' ');  //turn underscores into spaces
};
