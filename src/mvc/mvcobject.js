// Copyright 2012 Tom Payne. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview An implementation of Google Maps' MVCObject.
 * @see https://developers.google.com/maps/articles/mvcfun
 * @see https://developers.google.com/maps/documentation/javascript/reference
 */

goog.provide('mvc.MVCObject');

goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.object');


/**
 * @typedef {{target: mvc.MVCObject, key: string}}
 */
mvc.MVCObjectAccessor;



/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
mvc.MVCObject = function() {
  goog.base(this);
};
goog.inherits(mvc.MVCObject, goog.events.EventTarget);


/**
 * @param {string} str String.
 * @return {string} Capitalized string.
 */
mvc.MVCObject.capitalize = function(str) {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
};


/**
 * @private
 * @type {Object.<string, string>}
 */
mvc.MVCObject.getterNameCache_ = {};


/**
 * @param {string} str String.
 * @private
 * @return {string} Capitalized string.
 */
mvc.MVCObject.getGetterName_ = function(str) {
  return mvc.MVCObject.getterNameCache_[str] ||
      (mvc.MVCObject.getterNameCache_[str] =
          'get' + mvc.MVCObject.capitalize(str));
};


/**
 * @private
 * @type {Object.<string, string>}
 */
mvc.MVCObject.setterNameCache_ = {};


/**
 * @param {string} str String.
 * @private
 * @return {string} Capitalized string.
 */
mvc.MVCObject.getSetterName_ = function(str) {
  return mvc.MVCObject.setterNameCache_[str] ||
      (mvc.MVCObject.setterNameCache_[str] =
          'set' + mvc.MVCObject.capitalize(str));
};


/**
 * @param {mvc.MVCObject} obj Object.
 * @return {Object.<string, mvc.MVCObjectAccessor>} Accessors.
 */
mvc.MVCObject.getAccessors = function(obj) {
  return obj['gm_accessors_'] || (obj['gm_accessors_'] = {});
};


/**
 * @param {mvc.MVCObject} obj Object.
 * @return {Object.<string, ?number>} Listeners.
 */
mvc.MVCObject.getListeners = function(obj) {
  return obj['gm_bindings_'] || (obj['gm_bindings_'] = {});
};


/**
 * @param {string} key Key.
 * @param {mvc.MVCObject} target Target.
 * @param {string=} opt_targetKey Target key.
 * @param {boolean=} opt_noNotify No notify.
 */
mvc.MVCObject.prototype.bindTo =
    function(key, target, opt_targetKey, opt_noNotify) {
  var targetKey = goog.isDef(opt_targetKey) ? opt_targetKey : key;
  this.unbind(key);
  var eventType = targetKey.toLowerCase() + '_changed';
  var listeners = mvc.MVCObject.getListeners(this);
  listeners[key] = goog.events.listen(target, eventType, function() {
    this.notifyInternal_(key);
  }, undefined, this);
  var accessors = mvc.MVCObject.getAccessors(this);
  accessors[key] = {target: target, key: targetKey};
  var noNotify = goog.isDef(opt_noNotify) ? opt_noNotify : false;
  if (!noNotify) {
    this.notifyInternal_(key);
  }
};


/**
 */
mvc.MVCObject.prototype.changed = function() {
};


/**
 * @param {string} key Key.
 * @return {*} Value.
 */
mvc.MVCObject.prototype.get = function(key) {
  var accessors = mvc.MVCObject.getAccessors(this);
  if (goog.object.containsKey(accessors, key)) {
    var accessor = accessors[key];
    var target = accessor.target;
    var targetKey = accessor.key;
    var getterName = mvc.MVCObject.getGetterName_(targetKey);
    if (target[getterName]) {
      return target[getterName]();
    } else {
      return target.get(targetKey);
    }
  } else {
    return this[key];
  }
};


/**
 * @param {string} key Key.
 */
mvc.MVCObject.prototype.notify = function(key) {
  var accessors = mvc.MVCObject.getAccessors(this);
  if (goog.object.containsKey(accessors, key)) {
    var accessor = accessors[key];
    var target = accessor.target;
    var targetKey = accessor.key;
    target.notify(targetKey);
  } else {
    this.notifyInternal_(key);
  }
};


/**
 * @param {string} key Key.
 * @private
 */
mvc.MVCObject.prototype.notifyInternal_ = function(key) {
  var changedMethodName = key + '_changed';
  if (this[changedMethodName]) {
    this[changedMethodName]();
  } else {
    this.changed();
  }
  var eventType = key.toLowerCase() + '_changed';
  this.dispatchEvent(eventType);
};


/**
 * @param {string} key Key.
 * @param {*} value Value.
 */
mvc.MVCObject.prototype.set = function(key, value) {
  var accessors = mvc.MVCObject.getAccessors(this);
  if (goog.object.containsKey(accessors, key)) {
    var accessor = accessors[key];
    var target = accessor.target;
    var targetKey = accessor.key;
    var setterName = mvc.MVCObject.getSetterName_(targetKey);
    if (target[setterName]) {
      target[setterName](value);
    } else {
      target.set(targetKey, value);
    }
  } else {
    this[key] = value;
    this.notifyInternal_(key);
  }
};


/**
 * @param {Object.<string, *>} options Options.
 */
mvc.MVCObject.prototype.setOptions = function(options) {
  goog.object.forEach(options, function(value, key) {
    var setterName = mvc.MVCObject.getSetterName_(key);
    if (this[setterName]) {
      this[setterName](value);
    } else {
      this.set(key, value);
    }
  }, this);
};


/**
 * @param {Object.<string, *>} values Values.
 */
mvc.MVCObject.prototype.setValues = mvc.MVCObject.prototype.setOptions;


/**
 * @param {string} key Key.
 */
mvc.MVCObject.prototype.unbind = function(key) {
  var listeners = mvc.MVCObject.getListeners(this);
  var listener = listeners[key];
  if (listener) {
    delete listeners[key];
    goog.events.unlistenByKey(listener);
    var value = this.get(key);
    var accessors = mvc.MVCObject.getAccessors(this);
    delete accessors[key];
    this[key] = value;
  }
};


/**
 */
mvc.MVCObject.prototype.unbindAll = function() {
  var listeners = mvc.MVCObject.getListeners(this);
  var keys = goog.object.getKeys(listeners);
  goog.array.forEach(keys, function(key) {
    this.unbind(key);
  }, this);
};
