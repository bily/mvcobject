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
 * @fileoverview A cleanroom implementation of Google Maps' MVCObject.
 * @see https://developers.google.com/maps/articles/mvcfun
 * @see https://developers.google.com/maps/documentation/javascript/reference
 */

goog.provide('mvc.MVCObject');

goog.require('goog.array');
goog.require('goog.events.EventTarget');
goog.require('goog.object');



/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
mvc.MVCObject = function() {
  goog.base(this);
};
goog.inherits(mvc.MVCObject, goog.events.EventTarget);


/**
 * @private
 * @type {Object.<string, function(*)>}
 */
mvc.MVCObject.prototype.setters_;


/**
 * @private
 * @type {Object.<string, ?number>}
 */
mvc.MVCObject.prototype.listeners_;


/**
 * @param {string} key Key.
 * @param {mvc.MVCObject} target Target.
 * @param {string=} opt_targetKey Target key.
 * @param {boolean=} opt_noNotify No notify.
 * FIXME verify behaviour of noNotify.
 */
mvc.MVCObject.prototype.bindTo =
    function(key, target, opt_targetKey, opt_noNotify) {
  var targetKey = goog.isDef(opt_targetKey) ? opt_targetKey : key;
  this.setters_ = this.setters_ || {};
  this.listeners_ = this.listeners_ || {};
  if (goog.object.containsKey(this.setters_, key)) {
    this.unbind(key);
  }
  this.set(key, target.get(targetKey));
  this.setters_[key] = function(value) {
    target.set(targetKey, value);
  };
  var eventType = targetKey + '_changed';
  var noNotify = goog.isDef(opt_noNotify) ? opt_noNotify : false;
  this.listeners_[key] = goog.events.listen(target, eventType, function() {
    goog.object.set(this, key, target.get(targetKey));
    if (!noNotify) {
      this.notify(key);
    }
  }, false, this);
};


/**
 * @param {string} key Key.
 * @return {*} Value.
 */
mvc.MVCObject.prototype.get = function(key) {
  return goog.object.get(this, key);
};


/**
 * @param {string} key Key.
 */
mvc.MVCObject.prototype.notify = function(key) {
  goog.array.forEach([key + '_changed', 'changed'], function(type) {
    if (goog.isFunction(this[type])) {
      this[type](key);
    }
    this.dispatchEvent(type);
  }, this);
};


/**
 * @param {string} key Key.
 * @param {*} value Value.
 */
mvc.MVCObject.prototype.set = function(key, value) {
  if (goog.isDef(this.setters_) &&
      goog.object.containsKey(this.setters_, key)) {
    this.setters_[key](value);
  } else {
    goog.object.set(this, key, value);
    this.notify(key);
  }
};


/**
 * @param {Object.<string, *>} values Values.
 */
mvc.MVCObject.prototype.setValues = function(values) {
  goog.object.forEach(values, function(value, key) {
    this.set(key, value);
  }, this);
};


/**
 * @param {string} key Key.
 */
mvc.MVCObject.prototype.unbind = function(key) {
  if (goog.isDef(this.setters_) &&
      goog.object.containsKey(this.setters_, key)) {
    goog.asserts.assert(goog.object.containsKey(this.listeners_, key));
    goog.events.unlistenByKey(this.listeners_[key]);
    goog.object.remove(this.listeners_, key);
    goog.object.remove(this.setters_, key);
  }
};


/**
 */
mvc.MVCObject.prototype.unbindAll = function() {
  if (goog.isDef(this.setters_)) {
    goog.object.forEach(this.setters_, function(binding, key) {
      this.unbind(key);
    }, this);
  }
};
