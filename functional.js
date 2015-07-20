'use strict';

//import {} from './curry';
import {curry} from './curry';


//given N functions, return a function that takes
//a parameter and executes the functions from right to left
export var compose = (...fns) => val => {
  var i, acc = val;
  for (i = fns.length - 1; i >= 0; i -= 1) {
    acc = fns[i](acc);
  }
  return acc;
};

//given N functions, return a function that takes
//a parameter and executes the functions from left to right
export var pipe = (...fns) => val => {
  var i, acc = val;
  for (i = 0; i < fns.length; i += 1) {
    acc = fns[i](acc);
  }
  return acc;
};

export var apply = curry(function apply(fn, arr)  {
  fn.apply(this, arr);
});

//TODO: this cannot deal with constructors that take multiple arguments
export var construct = curry(function construct(Fn, item)  {
  return new Fn(item);
});

//TODO: not sure if this works
export var flip = curry(function flip(fn)  {
  if (fn.length > 2) { return fn; }

  return curry(function(a, b, ...args) {
    args.unshift(b, a);
    return fn.apply(this, args);
  });
});

export var identity = x => x;

//identity function (aka Kestral)
export var always = x => () => x;
export var K = identity;

//applies val to fn then returns val
export var tap = curry(function tap(fn, val)  {
  fn(val);
  return val;
});

//fn1 takes some number of arguments
//fn2 will be passed a series of N arguments (the first if fn1)
//fn2 should call fn1 with necessary args and then manipulate them
export var wrap = curry(function wrap(fn1, fn2)  {
  return function (...args) {
    args.unshift(fn1);
    fn2.apply(this, args);
  };
})

export var memoize = curry(function memoize(fn)  {
  var memo = {}; //trap cache in closure
  return function (...args) {
    var key = JSON.stringify(args);
    if (!memo[key]) {
      memo[key] = fn.apply(this, args);
    }
    return memo[key];
  };
});


//need to implement lift, liftN, memoize, once, partial/applyLeft
//export var lift = function () { };
