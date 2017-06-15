/* globals Visualforce */
'use strict';


/**
 * HOW TO USE
 *
 * //import jsr file
 * import {makeJsrPromise as jsr} from '../helpers/jsr-promise';
 *
 * //default configuration
 * var foo = jsr({ buffer: false });
 *
 * //use default
 * foo.doAction(window.cs.jsr.actions.myAction, my, params, go, here)
 *   .then(res => useResponse(res))
 *   .catch(err => console.err(err));
 *
 * //override defaults for this action ONLY (then do action)
 * foo.config({ buffer: false, timeout: 50000 })
 *   .doAction(window.cs.jsr.actions.anotherAction, and, some, params)
 *   .then(res => updateData(res),
 *         err => console.err(err));
 *
 * //please note that you may string configs together and each will
 * //modify the earlier config options and give you a doAction that will use those args
 * var bar = foo.config({ timeout: 100, isFake: true, fakeData: {abc: '123'} });
 * var baz = bar.config({ timeout: 300, fakeData: {cde: 456} });
 *
 * foo.doAction(myAction, stuff); //uses default params
 * bar.doAction(myAction, stuff); //same as default except three options changed
 * baz.doAction(myAction, stuff); //same as bar except two options changed. `isFake`
 *                                //comes from bar and the rest not in bar come from default
 *
 * CONFIG OVERVIEW
 * buffer: <bool> if jsr should batch requests (default: true)
 * escape: <bool> if jsr should escape request data (default: true)
 * timeout: <num> time until request fails (default: 30000, max: 120000)
 * actionObj: <obj> object containing JSR actions
 *            default: window.cs.jsr.action if window.Visualforce else window.cs.jsr.fakeData
 * actionName: <string> name of action (default: '' UNUSED at present)
 * isFake: <bool> assume fake data if true (default: true if window.Visualforce else false)
 * fakeData: <obj> specific object to use instead of actionObj if isFake (default: null)
 */

//helper for null check
var isNullUndef = x => x === undefined || x === null;

//helper that when given an object will return new object that is a copy of all enumerable properties
var cloneObj = obj => {
  var key, acc = {};
  for(key in obj) {
    if (obj.hasOwnProperty(key)) {
      acc[key] = obj[key];
    }
  }
  return acc;
};

//helper to shallow-copy object, merge new fields, return new copy
var merge = (obj1, obj2) => {
  var k, acc = cloneObj(obj1);
  for (k in obj2) {
    if (obj2.hasOwnProperty(k)) {
      acc[k] = obj2[k];
    }
  }
  return acc;
};

/**
 * @func jsrPromise
 * makes jsrPromise to use for requests
 * @param {Object} opts - configuration options
 *        {buffer: <bool:true>, escape: <bool:true>, timeout: <num:30000>,
 *         actionObj: <obj>, actionName: <str:''>,
 *         isFake: <bool>, fakeData: <obj:null>}
 * @return {JsrPromiseObj} - has `doAction` and `config` methods
 */
export var jsrPromise = function makeJsrPromise(opts) {
  //our shared state
  var options = {
    buffer: true,
    escape: true,
    timeout: 30000,
    actionObj: window.Visualforce ? window.cs.jsr.actions : window.cs.jsr.fakeData,
    actionName: '',
    isFake: window.Visualforce ? false : true,
    fakeData: null
  };
  options = merge(options, opts);

  /**
   * @private
   * @method makeJSROpts
   * takes options and returns only the ones JSR is interested in
   * @param {Object} opts - some list of options
   * @return {Object} - JSR options only
   */
  var makeJSROpts = opts => {
    return { buffer: opts.buffer, escape: opts.escape, timeout: opts.timeout };
  };

  /**
   * @private
   * @method doFakeAction
   * takes action and misc params and gets fake data
   * @param {String} actionName - name of action to perform
   * @param {Object} opts - options object
   * @param {Any} ...params - remaining params containing request specifics
   * @return {Promise} - promise returning fake data or failure
   */
  var doFakeAction = function (actionName, opts, ...params) {
    //existing fakeData will be used automatically
    var data = !isNullUndef(opts.fakeData) ? opts.fakeData : opts.actionObj[actionName];
    var jsrOpts = makeJSROpts(opts);

    //allow complex fake data handling if desired
    if (typeof data !== 'function') {
      return new Promise(function (resolve, reject) {
        var toSend = [actionName, jsrOpts];
        toSend.push.apply(this, params);

        window.setTimeout(function () {
          var result;
          try {
            result = data.apply(this, toSend);
          } catch (e) {
            reject(e);
          }
          resolve(result);
        }, 10);
      });
    }
    //if not a function, just return the data
    //TODO: consider setTimeout here if requested
    return Promise.resolve(data);
  };

  /**
   * @private
   * @method doVFAction
   * takes action and misc params and perform JSR request
   * @param {String} actionName - name of action to perform
   * @param {Object} opts - options object
   * @param {Any} ...params - remaining params containing request specifics
   * @return {Promise} - promise returning JSR data or failure
   */
  var doVFAction = function (actionName, opts, ...params) {
    return new Promise(function (resolve, reject) {
      var jsrOpts = makeJSROpts(opts);
      var toSend = [actionName, jsrOpts];

      //add the params
      toSend.push.apply(this, params);

      //add the callback
      toSend.push((result, event) => event.status ? resolve(result) : reject(event));

      //do the request
      Visualforce.remoting.Manager.invokeAction.apply(Visualforce.remoting.Manager, toSend);
    });
  };

  /**
   * @method doAction
   * dispatches fake or real JSR based on options
   * @param {String} actionName - name of action to perform
   * @param {Object} opts - options object
   * @param {Any} ...params - remaining params containing request specifics
   * @return {Promise} - promise returning JSR data or failure
   */
  var _doAction = function (actionName, opts, ...params) {
    return opts.isFake ? doFakeAction(actionName, opts, params) : doVFAction(actionName, opts, params);
  };

  /**
   * @method config
   * extends current config with new options
   * @param {String} actionName - name of action to perform
   * @return {JsrPromiseObj} - has `doAction` and `config` methods
   */
  var _config = function (oldOpts, newOpts) {
    opts = merge(oldOpts, newOpts);
    return {
      doAction(actionName, ...params) {
        var toSend = [actionName, opts];
        toSend.push.apply(params);
        return _doAction.apply(this, toSend);
      },

      config(newestOpts) {
        return _config(opts, newestOpts);
      }
    };
  };

  //return config and action based on original config
  return {
    doAction(actionName, ...params) {
      var toSend = [actionName, options];
      toSend.push.apply(params);
      return _doAction.apply(this, toSend);
    },

    config(newOpts) {
      return _config(options, newOpts);
    }
  };
};
