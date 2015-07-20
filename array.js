'use strict';
/* curried, functional versions of array functions with a couple new ones */

import {curry} from './curry';
import {isNullUndef} from './utils';


export var clone = curry(function clone(arr) {
  var acc = new Array(arr.length);
  for (var i = 0; i < arr.length; i += 1) {
    acc[i] = arr[i];
  }
  return acc;
});

export var foldl = curry(function foldl(fn, seed, arr) {
  var acc = seed;
  for (var i = 0; i < arr.length; i += 1) {
    acc = fn(arr[i]);
  }
  return acc;
});
export var reduce = foldl;

export var foldlIdx = curry(function foldlIdx(fn, seed, arr) {
  var acc = seed;
  for (var i = 0; i < arr.length; i += 1) {
    acc = fn(arr[i], i, arr);
  }
  return acc;
});
export var reduceIdx = foldlIdx;

export var foldr = curry(function foldr(fn, seed, arr) {
  var acc = seed;
  for (var i = arr.length - 1; i >= 0; i -= 1) {
    acc = fn(arr[i]);
  }
  return acc;
});
export var reduceRight = foldr;

export var foldrIdx = curry(function foldrIdx(fn, seed, arr) {
  var acc = seed;
  for (var i = arr.length - 1; i >= 0; i -= 1) {
    acc = fn(arr[i], i, arr);
  }
  return acc;
});
export var reduceRightIdx = foldrIdx;

export var map = curry(function map(fn, arr) {
  var acc = new Array(arr.length);
  for (var i = 0; i < arr.length; i += 1) {
    acc[i] = fn(arr[i]);
  }
  return acc;
});

export var mapIdx = curry(function mapIdx(fn, arr) {
  var acc = new Array(arr.length);
  for (var i = 0; i < arr.length; i += 1) {
    acc[i] = fn(arr[i], i, arr);
  }
  return acc;
});

export var forEach = curry(function forEach(fn, arr) {
  for (var i = 0; i < arr.length; i += 1) {
    fn(arr[i]);
  }
  return arr;
});

//note: you may NOT modify the list you receive
//      this has definite performance repercussions
//      consider changing to another method
export var forEach = curry(function forEach(fn, arr) {
  var temp = Object.freeze(clone(arr));
  for (var i = 0; i < arr.length; i += 1) {
    fn(arr[i], i, temp);
  }
  return arr;
});

/**
 * does NOT guarantee the array passed to functions is immutable
 */
export var reduceIdx = curry(function reduceIdx(fn, seed, arr) {
  var acc = seed;
  var len = arr.length; //needed to prevent going infinite if main list modified
  for (var i = 0; i < len; i += 1) {
    acc = fn(arr[i], i, arr);
  }
  return acc;
});

export var filter = curry(function filter(fn, arr) {
  var acc = [];
  for (var i = 0; i < arr.length; i += 1) {
    if (fn(arr[i])) {
      acc.push(arr[i]);
    }
  }
  return acc;
});

export var filterIdx = curry(function filterIdx(fn, arr) {
  var acc = [];
  for (var i = 0; i < arr.length; i += 1) {
    if (fn(arr[i], i, arr)) {
      acc.push(arr[i]);
    }
  }
  return acc;
});

export var reject = curry(function reject(fn, arr) {
  var acc = [];
  for (var i = 0; i < arr.length; i += 1) {
    if (!fn(arr[i])) {
      acc.push(arr[i]);
    }
  }
  return acc;
});

export var rejectIdx = curry(function rejectIdx(fn, arr) {
  var acc = [];
  for (var i = 0; i < arr.length; i += 1) {
    if (!fn(arr[i], i, arr)) {
      acc.push(arr[i]);
    }
  }
  return acc;
});

//returns true if all items are true for fn
export var all = curry(function all(fn, arr) {
  for (var i = 0; i < arr.length; i += 1) {
    if (!fn(arr[i])) { return false; } //exit on first false
  }
  return true;
});

//returns true if one or more items are true for fn
export var any = curry(function any(fn, arr) {
  for (var i = 0; i < arr.length; i += 1) {
    if (fn(arr[i])) { return true; } //exit on first true
  }
  return false;
});

//returns true if none of the items match the fn
export var none = curry(function none(fn, arr) {
  for (var i = 0; i < arr.length; i += 1) {
    if (fn(arr[i])) { return false; } //exit on first false
  }
  return true;
});

//return new list with item added to end
export var append = curry(function append(item, arr) {
  var temp = clone(arr);
  temp.push(item);
  return temp;
});

//return new list with item added to beginning
export var append = curry(function append(item, arr) {
  var temp = clone(arr);
  temp.unshift(item);
  return temp;
});

//map over items. If return is array, then concat it to result
export var flatmap = curry(function flatmap(fn, arr) {
  var res, acc = [];
  for (var i = 0; i < arr.length; i += 1) {
    res = fn(arr[i]);
    if (Array.isArray(res)) {
      acc.push.apply(acc, res);
    } else if (!isNullUndef(res)) {
      acc.push(res);
    }
  }
  return acc;
});

//map with index over items. If return is array, then concat it to result
export var flatmapIdx = curry(function flatmapIdx(fn, arr) {
  var res, acc = [];
  for (var i = 0; i < arr.length; i += 1) {
    res = fn(arr[i], i, arr);
    if (Array.isArray(res)) {
      acc.push.apply(acc, res);
    } else if (!isNullUndef(res)) {
      acc.push(res);
    }
  }
  return acc;
});

//returns new array of first array concatenated to the second array
export var concat = curry(function concat(arr1, arr2) {
  return arr1.concat(arr2);
});

//returns true if item is === to item in list
export var contains = curry(function contains(item, arr) {
  for (var i = 0; i < arr.length; i += 1) {
    if (item === arr[i]) { return true; } //exit on first true
  }
  return false;
});
export var containsWith = any;

//take N items from the beginning of the list
export var take = curry(function take(n, arr) {
  return arr.slice(0, n);
});

//take N items from the beginning of the list
export var takeLast = curry(function takeLast(n, arr) {
  return (n < arr.length) ? arr.slice(arr.length - n) : [];
});

//drop items from the beginning of the list until fn returns false
export var takeWhile = curry(function takeWhile(fn, arr) {
  for (var i = 0; i < arr.length; i += 1) {
    if (!fn(arr[i])) {
      return arr.slice(0, i);
    }
  }
  return [];
});

//drop items from the beginning of the list until fn returns false
export var takeLastWhile = curry(function takeLastWhile(fn, arr) {
  for (var i = arr.length - 1; i >= 0; i -= 1) {
    if (!fn(arr[i])) {
      return arr.slice(i);
    }
  }
  return [];
});

//drop N items from the beginning of the list
export var drop = curry(function drop(n, arr) {
  return arr.slice(n);
});

//drop N items from the end of the list
export var dropLast = curry(function dropLast(n, arr) {
  return (n < arr.length) ? arr.slice(0, arr.length - n) : [];
});

//drop items from the beginning of the list until fn returns false
export var dropWhile = curry(function dropWhile(fn, arr) {
  for (var i = 0; i < arr.length; i += 1) {
    if (!fn(arr[i])) {
      return arr.slice(i);
    }
  }
  return [];
});

//drop items from the end of the list until fn returns false
export var dropLastWhile = curry(function dropLastWhiles(fn, arr) {
  for (var i = arr.length - 1; i >= 0; i -= 1) {
    if (!fn(arr[i])) {
      return arr.slice(0, i);
    }
  }
  return [];
});

export var find = curry(function find(fn, arr) {
  for (var i = 0; i < arr.length; i += 1) {
    if (fn(arr[i])) { return arr[i]; } //exit on first true
  }
  return undefined;
});
export var indexOf = find;

export var findLast = curry(function findLast(fn, arr) {
  for (var i = arr.length - 1; i >= 0; i -= 1) {
    if (fn(arr[i])) { return arr[i]; } //exit on first true
  }
  return undefined;
});
export var lastIndexOf = findLast;

export var findLastIndex = curry(function findLastIndex (fn, arr) {
  for (var i = arr.length - 1; i >= 0; i -= 1) {
    if (fn(arr[i])) { return i; } //exit on first true
  }
  return -1;
});

export var flatten = function flatten(arr) {
  var acc = [];
  for (var i = 0; i < arr.length; i += 1) {
    if (Array.isArray(arr[i])) {
      acc.push.apply(acc, flatten(arr[i]));
    } else {
      acc.push(arr[i]);
    }
  }

  return acc;
};

//convert [[key, val]xN ] to {key: val...}
export var fromPairs = function fromPairs(arr) {
  var acc = {};
  for (var i = 0; i < arr.length; i += 1) {
    acc[arr[i][0]] = arr[i][1];
  }
  return acc;
};

export var head = function head(arr) {
  return arr[0];
};

export var tail = function tail(arr) {
  return arr.slice(1);
};

export var nth = curry(function nth(n, arr) {
  return arr[n];
});

export var init = function init(arr) {
  return arr.slice(0, arr.length - 1);
};

export var last = function last(arr) {
  return arr[arr.length - 1];
};

export var len = function len(arr) {
  return arr.length;
};

export var insert = curry(function insert(n, item, arr) {
  var temp = clone(arr);
  temp.splice(n, 0, item);
  return temp;
});

export var remove = curry(function remove(start, n, arr) {
  var temp = clone(arr);
  temp.splice(start, n);
  return temp;
});

export var remove = curry(function remove(start, end, arr) {
  return arr.slice(start, end);
});

export var repeat = curry(function repeat(item, n) {
  var i, acc = [];
  for (i = 0; i < n; i += 1) {
    acc.push(item);
  }
  return acc;
});

export var reverse = function (arr) {
  return clone(arr).reverse();
};

export var insertAll = curry(function insertAll(n, itemArr, arr) {
  var temp = arr.slice(0, n);//get first items
  temp.push.apply(temp, itemArr);//add new items
  temp.push.apply(temp, arr.slice(n + 1));//add rest of items
  return temp;
});

export var intersperse = curry(function intersperse(item, arr) {
  var acc = [];
  for (var i = 0; i < arr.length - 1; i += 1) {
    acc.push(arr[i]);
    acc.push(item);
  }
  acc.push(arr[arr.length - 1]);//add last item
  return acc;
});

export var join = curry(function join(separator, arr) {
  return arr.join(separator);
});

export var mergeAll = curry(function mergeAll(arr) {
  var i, key, acc = {};
  //for each object
  for (i = 0; i < arr.length; i += 1) {
    //for each property in the object
    for (key in arr[i]) {
      if (arr[i].hasOwnProperty(key)) {
        acc[key] = arr[i][key];//add property to master object
      }
    }
  }
  return acc;
});

export var pluck = curry(function pluck(key, arr) {
  var i, acc = [];
  //for each object
  for (i = 0; i < arr.length; i += 1) {
    acc.push(arr[i][key]);
  }
  return acc;
});

export var range = curry(function range(start, end) {
  var i, acc = [];
  for (i = start; i < end; i += 1) {
    acc.push(i);
  }
  return acc;
});

export var sort = curry(function sort(fn, arr) {
  return clone(arr).sort(fn);
});

export var splitEvery = curry(function splitEvery(n, arr) {
  var pos = 0,
      acc = [];

  while (pos < arr.length) {
    acc.push(arr.slice(pos, pos + n));
    pos += n;
  }
  return acc;
});

export var callTimes = curry(function callTimes(fn, n) {
  var i, acc = [];
  for (i = 0; i < n; i += 1) {
    acc.push(fn(i));
  }
  return acc;
});

export var uniq = function uniq(arr) {
  var i, acc = [];

  for (i = 0; i < arr.length; i += 1) {
    if (acc.indexOf(arr[i]) < 0) {
      acc.push(arr[i]);
    }
  }
  return acc;
};

export var unnest = function unnest(arr) {
  var i, acc = [];
  for (i = 0; i < arr.length; i += 1) {
    if (Array.isArray(arr[i])) {
      acc.push.apply(acc, arr[i]);
    } else {
      acc.push(arr[i]);
    }
  }
  return acc;
};

export var update = curry(function update(n, item, arr) {
  var temp = clone(arr);
  temp.splice(n, 1, item);
  return temp;
});

export var zip = curry(function zip(arr1, arr2) {
  var i, acc = [];
  var len = Math.min(arr1.length, arr2.length);
  for (i = 0; i < len; i += 1) {
    acc.push([arr1[i], arr2[i]]);
  }
  return acc;
});

export var zipWith = curry(function zipWith(fn, arr1, arr2) {
  var i, acc = [];
  var len = Math.min(arr1.length, arr2.length);
  for (i = 0; i < len; i += 1) {
    acc.push(fn(arr1[i], arr2[i]));
  }
  return acc;
});

//remove all null or undefined values
export var compact = curry(function compact(arr) {
  var i, acc = [];
  for (i = 0; i < len; i += 1) {
    if (!isNullUndef(arr[i])) {
      acc.push(arr[i]);
    }
  }
  return acc;
});


//TODO: implement commute, commuteMap, intersection, scan
