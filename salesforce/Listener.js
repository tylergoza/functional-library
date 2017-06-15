'use strict';

class Listener {
  constructor(label, listenerTypes) {
    this.label = label;
    this.listeners = {};
    this.makeListenerTypes(listenerTypes);
    this._listenerId = 1;
  }

  /**
   * @method makeListenerTypes
   * replaces list of listeners with new list
   * @param {String[]} arr - list of names to create
   * @return {Boolean} - true if added else false
   */
  makeListenerTypes(arr) {
    var obj = {};
    arr.forEach(name => obj[name] = []);
    this.listeners = obj;
    return true;
  }

  /**
   * @method addListenerType
   * add listener type to list of listeners if it doesn't exist
   * @param {String} name - type of listener to remove
   * @return {Boolean} - true if added else false
   */
  addListenerType(name) {
    if (!this.listeners[name]) {
      this.listeners[name] = [];
      return true;
    }
    return false;
  }

  /**
   * @method removeListenerType
   * remove listener type from list of listeners
   * @param {String} name - type of listener to remove
   * @return {Boolean} - true if removed else false
   */
  removeListenerType(name) {
    if (this.listeners[name]) {
      //TODO: double check that we don't generate garbage
      delete this.listeners[name];
      return true;
    }
    return false;
  }

/******************************************==******************************************
 *                                   LISTENER EVENTS
 **************************************************************************************/

  /**
   * @method registerListener
   * adds event to listener queue
   * @param {String} listenerType - type of listener to attach
   * @param {Function} cb - function to execute. receives opts param
   * @return {Number} - id of callback. Used to unregister listener
   */
  registerListener(listenerType, cb) {
    var self = this;

    if (!self.listeners[listenerType]) {
      throw new Error(`${self.label} does not have a listener of type: ${listenerType}`);
    }
    self._listenerId += 1; //update before attach
    self.listeners[listenerType].push({
      cb, id: self._listenerId
    });
    return self._listenerId;
  }

  /**
   * @method unregisterListener
   * removes event from listener queue
   * @param {Number} id - id of listener to remove
   * @return {Boolean} - true if success
   */
  unregisterListener(id) {
    var self = this;
    var key, temp, isRemoved = false; //isRemoved tracks if removal happened

    //iterate listener types
    //note: we don't short-circuit in case an id somehow was copied. Defensive FTW!
    //      we don't expect to have a ton of listeners, so the overhead is probably small anyway
    for (key in self.listeners) {
      if (self.listeners.hasOwnProperty(key)) {
        //only keep item in listener list that do NOT have the id in question
        temp = self.listeners[key].filter(item => item.id !== id);
        //toggle isRemoved if something was removed
        if (temp.length !== self.listeners[key].length) {
          isRemoved = true;
        }
        //assign new list of listeners
        self.listeners[key] = temp;
      }
    }
    return isRemoved;
  }

  /**
   * @method triggerListeners
   * trigger listeners of given type
   * @param {String} listenerType - type of listener to attach
   * @param {Object} opts - optional list of options to pass
   * @return {Boolean} - true if success
   */
  triggerListeners(opts, ...listenerTypes) {
    var self = this;
    listenerTypes.forEach(listenerType => {
      if (!self.listeners[listenerType]) {
        throw new Error(`${self.label} does not have a listener of type: ${listenerType}`);
      }
      self.listeners[listenerType].forEach(item => item.cb(opts));
    });
    return true;
  }
}

export default Listener;
