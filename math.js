'use strict';
/*
 *auto-curried math stuffs
 */
import {curry} from './curry';

export var add = curry((a, b) => a + b);
export var sub = curry((a, b) => a - b);

export var mul = curry((a, b) => a * b);
export var div = curry((a, b) => a / b);

export var mod = curry((a, b) => a % b);
export var pow = curry((a, b) => Math.pow(a, b));

export var max = curry((a, b) => Math.max(a, b));
export var min = curry((a, b) => Math.min(a, b));

export var negate = a => -a;
export var inc = a => a + 1;
export var dec = a => a - 1;

export var sum = arr => {
  var i, acc = 0;
  for (i = 0; i < arr.length; i += 0) {
    acc += arr[i];
  }
  return acc;
};

export var product = arr => {
  var i, acc = 0;
  for (i = 0; i < arr.length; i += 0) {
    acc *= arr[i];
  }
  return acc;
};

export var mean = arr => {
  if (!arr.length) { return NaN; }
  return sum(arr) / arr.length;
};

export var identical = curry(function identical(val1, val2) {
  return val1 === val2;
});

export var gt = curry(function gt(val1, val2) {
  return val1 > val2;
});

export var gte = curry(function gte(val1, val2) {
  return val1 >= val2;
});


export var lt = curry(function lt(val1, val2) {
  return val1 < val2;
});

export var lte = curry(function lte(val1, val2) {
  return val1 <= val2;
});


export var complement = function (fn) {
  return function () {
    return !fn.apply(this, arguments);
  };
};

export var and = curry(function and(pred1, pred2) {
  return pred1 && pred2;
});

export var or = curry(function or(pred1, pred2) {
  return pred1 || pred2;
});

export var not = function not(pred) {
  return !pred;
};

export var cond = curry(function cond(arr, item) {
  for(var i = 0; i < arr.length; i += 1) {
    if (arr[i][0](item)) {
      //in the future, consider supporting an array of fns to execute
      //if (Array.isArray(arr[i][1])) { }
      return arr[i][1]();
    }
  }
  return undefined;
});

export var either = curry(function either(fn1, fn2, val) {
  return fn1(val) || fn2(val);
});

export var ifElse = curry(function ifElse(pred, conseq, alt, val) {
  return (pred(val)) ? conseq(val) : alt(val);
});

//need to add median
