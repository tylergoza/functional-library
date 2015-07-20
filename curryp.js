'use strict';

//This module is loosely based on the Ramda implementation of autocurry

import {isNullUndef} from './utils';
/*
 * What follows is a complex implementation
 * that allows the use of placeholders to
 * enable you to apply arguments out of order of appearance
 */

//make frozen object with no inheritance
//very unlikely to be replicated accidentally in application
var __inner = Object.create(null);
__inner['__fn#placeholder__'] = true;
Object.freeze(__inner);

var is__ = obj => typeof obj === 'object' &&
                  obj['__fn#placeholder__'] &&
                  Object.isFrozen(obj) &&
                  Object.keys(obj).length === 1;

export var __ = __inner;

/**
 * Returns a curried equivalent of the provided function, with the
 * specified arity. The curried function has two unusual capabilities.
 * First, its arguments needn't be provided one at a time. If `g` is
 * `R.curryN(3, f)`, the following are equivalent:
 *
 * @sig Number -> (* -> a) -> (* -> a)
 * @param {Number} length The arity for the returned function.
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curry
 * @example R.curry(4, add4Nums)
 */
var curryp = curry1(function curry(fn) {
  //special-case 1 and 2-length functions
  switch (fn.length) {
    case 1:
      return curry1(fn);
    case 2:
      return curry2(fn);
    default:
      return arity(fn.length, curryN(fn.length, [], fn));
  }
});

var arity = function arity(len, fn) {
  var self = this; //does this closure affect performance?
  // jshint unused:vars
  switch (len) {
    case 0:
      return () => fn.apply(self, arguments);
    case 1:
      return (a0) => fn.apply(self, arguments);
    case 2:
      return (a0, a1) => fn.apply(self, arguments);
    case 3:
      return (a0, a1, a2) => fn.apply(self, arguments);
    case 4:
      return (a0, a1, a2, a3) => fn.apply(self, arguments);
    case 5:
      return (a0, a1, a2, a3, a4) => fn.apply(self, arguments);
    case 6:
      return (a0, a1, a2, a3, a4, a5) => fn.apply(self, arguments);
    case 7:
      return (a0, a1, a2, a3, a4, a5, a6) => fn.apply(self, arguments);
    case 8:
      return (a0, a1, a2, a3, a4, a5, a6, a7) => fn.apply(self, arguments);
    case 9:
      return (a0, a1, a2, a3, a4, a5, a6, a7, a8) => fn.apply(self, arguments);
    case 10:
      return (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) => fn.apply(self, arguments);
    default:
      throw new Error("Can't curry more than 10 params");
  }
};

/**
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
var curry1 = function (fn) {
  return function f1(a) {
    //if no arguments, null/undef argument, or __
    //then return unapplied function else apply function to arguments
    return (arguments.length === 0 || (!isNullUndef(a) && is__(a))) ?
              f1 : fn.apply(this, arguments);
  };
};

/**
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
var curry2 = function curry2(fn) {
  return function f2(a, b) {//function that can curry both arguments
    switch (arguments.length) {
      case 0:
        return f2;
      case 1: //if null or placeholder, return fn as is else appy that arg
        return (!isNullUndef(a) && is__(a)) ? f2 : curry1(function(b) { return fn(a, b); });
      case 2:
        //if both args are null or placeholders, return fn as is
        if (!isNullUndef(a) && is__(a) && !isNullUndef(b) && is__(b)) {
          return f2;
        //if only first arg is null or placeholder, apply second arg and curry
        } else if (!isNullUndef(a) && is__(a)) {
          return curry1(function(a) { return fn(a, b); });
        //if only second arg is null or placeholder, apply first arg and curry
        } else if (!isNullUndef(b) && is__(b)) {
          return curry1(function(b) { return fn(a, b); });
        //if neither is null or placeholder, then apply
        } else {
          return fn(a, b);
        }
        break;
      default:
        throw new Error('curry2 somehow got more than two arguments');
    }
  };
};

var curryN = function (len, prevArgs, fn) {
  return function (...args) {
    var i = 0; //track args progress
    var j = 0; //track prevArgs progress
    var newArgs = []; //new list of args
    var remainingPlaceholders = 0; //tracks placeholders left to fill

    //while we have args left to deal with
    while (j < prevArgs.length || i < args.length) {
      //if we have previous args remaining is the current one is a placeholder
      if (j < prevArgs && is__(prevArgs[j])) {
        //if args has elements and current element is placeholder
        //then push placeholder and increment counters for placeholder, prevArgs, and args
        if (i < args.length && is__(args[i])) {
          newArgs.push(args[i]);
          i += 1;
          j += 1;
          remainingPlaceholders += 1;
        //if args has elements and the current one isn't a placeholder
        //then push current arg and increment counters for prevArgs and args
        } else if (i < args.length) {
          newArgs.push(args[i]);
          i += 1;
          j += 1;
        //we have nothing left in args
        //keep placeholder and increment counters for prevArgs and placeholder
        } else {
          newArgs.push(prevArgs[j]);
          j += 1;
          remainingPlaceholders += 1;
        }
      //if we have previous args remaining and current one is NOT a placeholder
      //then push this item and increment counter for prevArgs
      } else if (j < prevArgs) {
        newArgs.push(prevArgs[j]);
        j += 1;
      //since we know prevArgs are exhausted at this point, check if current args is placeholder
      //if so, add placeholder and increment couners for args and placeholder
      } else if (is__(args[i])) {
        newArgs.push(args[i]);
        i += 1;
        remainingPlaceholders += 1;
      //then push push next arg
      } else {
        newArgs.push(args[i]);
        i += 1;
      }
    }//END while

    //if we have too many args, we ignore extras and log
    if (newArgs > len) {
      console.error(`You have too many arguments(expected ${len}). Extra args will be dropped`, newArgs);
      newArgs = newArgs.slice(0, len);
    }

    //if we have no placeholders and have enough args, then apply function
    if (remainingPlaceholders === 0 && newArgs.length >= len) {
      return fn.apply(this, newArgs);
    }
    //calculate remaining args (including placeholders) and return curried function
    return arity(newArgs - remainingPlaceholders, curryN(len, newArgs, fn));
  };//END returned function
};//END curryN
