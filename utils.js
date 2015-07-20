'use strict';
export var isNullUndef = x => x === undefined || x === null;
export var isUndef = x => x === undefined;

//given an object, return an array of [key, val] pairs
export var objToArr = obj => Object.keys(obj).map(key => [key, obj[key]]);

//given a blacklist return a function that takes an array of [key, val]
//then returns an array without blacklisted keys
export var filterBlacklist = blist => arr => arr.filter(item => blist.indexOf(item[0]) < 0);

//given a number, returns a function that when given an array,
//splits the array into groups of N with remainder in final item
export var splitArray = n => arr => {
  var pos = 0,
      acc = [];

  while (pos < arr.length) {
    acc.push(arr.slice(pos, pos + n));
    pos += n;
  }
  return acc;
};

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
