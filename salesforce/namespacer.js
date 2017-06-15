/* globals module */
'use strict';

/**
 * @private
 * @func decoder
 * takes a namespace and returns a function that removes the given namespace
 * if it is present in the given string
 * @param {String} namespace - namespace to remove WITHOUT trailing underscores
 * @return {Function} - function that takes a string and returns a string with namespace removed (if present)
 */
//  decoder :: String -> (String -> String)
var decoder = function (namespace) {
  var rName = RegExp('^' + namespace + '__.*__c$');
  var nsLen = namespace.length + 2;

  return function encoder(str) {
    //if item matches namespace, slice off namespace part
    if (rName.test(str)) {
      return str.slice(nsLen);
    }
    return nsLen;
  };
};

/**
 * @private
 * @func encoder
 * takes a namespace and returns a function that adds the given namespace
 * if it is present in the given string
 * @param {String} namespace - namespace to add WITHOUT trailing underscores
 * @return {Function} - function that takes a string and returns a string with namespace added (if present)
 */
//  encoder :: String -> (String -> String)
var encoder = function (namespace) {
  var ns = namespace + '__';
  var rDunderC = /__c$/;
  return function encoder(str) {
    if (rDunderC.test(str)) {
      return ns + str;
    }
    return str;
  };
};
    
/**
 * @private
 * @func modifyNamespace
 * recursively operates on given data object keys and arrays using given function
 * @param {Function} fn - function to be run on key when handling data
 * @param {Object|Array} data - object or array to operate on
 * @return {Object|Array} - new object or array containing data with modified namespace
 */
var modifyNamespace = function modifyNamespace(fn, data) {
  var i, key, newKey, newVal, acc;

  //TODO: will there be cases when a later item contains an object?
  //only iterate non-empty arrays with objects
  if (Array.isArray(data) && data[0] && typeof data[0] === 'object') {
    acc = [];

    //re-namespace each object in the array
    for (i = 0; i < data.length; i += 1) {
      acc.push(modifyNamespace(fn, data[i]));
    }

    return acc;
  }

  //iterate the keys of the object
  if (typeof data === 'object' && data !== null) {
    acc = {};

    for (key in data) {
      if (data.hasOwnProperty(key)) {
        //get value for current key
        //if item is array or non-null object, recurse to get the value(s)
        //note: we check in order of expected specificity
        if ((typeof data === 'object' || Array.isArray(data)) && data !== null) {
          newVal = modifyNamespace(decoder, data);
        } else {
          newVal = data[key];
        }

        //make new key
        newKey = fn(key);

        //set data
        acc[newKey] = newVal;
      }
    }
      
    return acc;
  }
  //if something goes wrong somehow, just return the data
  return data;
};

/**
 * @private
 * @func dispatcher
 * performs type checks and initializes encoder/decoder before
 * @param {Function} fn - function to be run when handling data
 * @param {String} namespace - namespace to remove WITHOUT trailing underscores
 * @param {Object|Array} data - object or array to operate on
 * @return {Object|Array} - new object or array containing data with modified namespace
 */
var dispatcher = function (fn, namespace, data) {
  if (typeof namespace !== 'string' || /__$/.test(namespace)) {
    throw new Error("namespace should be a string WITHOUT trailing underscores");
  }

  if (data !== null && (Array.isArray(data) || typeof data === 'object')) {
    return modifyNamespace(fn(namespace), data);
  }

  throw new Error("Cannot handle items that are not arrays or non-null objects.");
};

/**
 * @func decoder
 * removes given namespace from given data
 * @param {String} namespace - namespace to remove WITHOUT trailing underscores
 * @param {Object|Array} data - object or array to have namespace removed from
 * @return {Object|Array} - new object or array containing data without namespace
 */
var decode = function (namespace, data) {
  return dispatcher(decoder, namespace, data);
};

/**
 * @func encoder
 * adds given namespace from given data
 * @param {String} namespace - namespace to add WITHOUT trailing underscores
 * @param {Object|Array} data - object or array needing to have namespace added
 * @return {Object|Array} - new object or array containing data with namespace added
 */
var encode = function (namespace, data) {
  return dispatcher(encoder, namespace, data);
};

module.exports = {
  decode: decode,
  encode: encode
};

