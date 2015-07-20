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
