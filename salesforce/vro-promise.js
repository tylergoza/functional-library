'use strict';

import {isNullUndef} from '../../../utils/utils';
/*
 * This is a proposed abstraction fix for vro-promise
 * It's located here because I'm not into breaking stuff
 * before I know the fix is both working and better
 */

var parseObjectToArray = (objectOfObjects) => {
  if (isNullUndef(objectOfObjects)) { return []; }
  return Object.keys(objectOfObjects).map(key => objectOfObjects[key]);
};

var makeObj = event => {
  return {
    records: parseObjectToArray(event.result.records),
    size: event.result.size
  };
};

export default function vroPromise(ns, obj) {
  //set default namespace if none given
  ns = (typeof ns === 'string') ? window[ns] : window['SObjectModel'];

  //if namespace already has promisable, then return that object
  if (ns.makePromiseable) {
    return ns.makePromiseable(obj);//lock in object type
  }

  //add function to namespace
  ns.makePromiseable = function (obj) {
    return function innerMakePromiseable(vars) {
      var promObj = {};
      promObj.remoteObj = new ns[obj](vars);

      promObj.set = function (f, v) {
        this.remoteObj.set(f, v);
      };

    	promObj.get = function (f) {
    		return this.remoteObj.get(f);
    	};

    	promObj.retrieve = function (opts) {
        var self = this;
        return new Promise(function (resolve, reject) {
          self.remoteObj.retrieve(opts, (err, results, event) => err ? reject(err) : resolve(makeObj(event)));
        });
  		};

  		promObj.create = function (fvs) {
        var self = this;
  			fvs = fvs ? fvs : this.remoteObj._props;

        return new Promise(function (resolve, reject) {
    			self.remoteObj.create(fvs, (err, results, event) => err ? reject(err) : resolve(event.result.id));
        });
  		};

  		promObj.update = function (ids, fvs) {
        var self = this;

  			ids = ids ? ids : '';
  			fvs = fvs ? fvs : {};

        if (!Array.isArray(ids)) {
          ids = [ids];
        }

  			console.log(this.remoteObj._props);
  			console.log(ids);

        return new Promise(function (resolve, reject) {
          //TODO: not sure if event.result.records is the correct return value
    			self.remoteObj.update(ids, fvs, (err, results/*, event*/) => err ? reject(err) : resolve(results));
        });
  		};//END update


  		promObj.upsert = function (ids, fvs) {
        var self = this;
        // If our ids object isn't an array, the user probably didn't want to include ids
        // so let's assume that the first argument should be our field-value pairs instead
  			if (!(ids instanceof Array)) {
  				fvs = ids;
  				ids = null;
  			}
  			ids = ids ? ids : [this.remoteObject._props.Id];
  			fvs = fvs ? fvs : this.remoteObject._props;

  			console.log(this.remoteObject._props);
  			console.log(ids);

        return new Promise(function (resolve, reject) {
    			self.remoteObj.upsert(ids, fvs, (err, results, event) => err ? reject(err) : resolve(makeObj(event)));
        });
  		};//END upsert

  		promObj.del = function (ids) {
        var self = this;
  			ids = ids ? ids : '';

        if (!Array.isArray(ids)) {
          ids = [ids];
        }

        return new Promise(function (resolve, reject) {
          //TODO: not sure if event.result.records is the correct return value
    			self.remoteObj.del(ids, (err, results, event) => err ? reject(err) : resolve(event.result.id));
        });
  		};
  		return promObj;
    };
  };

  //return promise object we just created
  return ns.makePromiseable(obj);//lock in object type
}
