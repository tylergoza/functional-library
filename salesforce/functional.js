'use strict';

//import {} from './curry';

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
