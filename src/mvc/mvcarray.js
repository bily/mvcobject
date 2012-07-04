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
 * @fileoverview An implementation of Google Maps' MVCArray.
 * @see https://developers.google.com/maps/documentation/javascript/reference
 */

goog.provide('mvc.MVCArray');
goog.provide('mvc.MVCArrayEvent');
goog.provide('mvc.MVCArrayEventType');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.events.Event');
goog.require('mvc.MVCObject');


/**
 * @enum {string}
 */
mvc.MVCArrayEventType = {
  INSERT_AT: 'insert_at',
  REMOVE_AT: 'remove_at',
  SET_AT: 'set_at'
};



/**
 * @constructor
 * @extends {goog.events.Event}
 * @param {mvc.MVCArrayEventType} type Type.
 * @param {number} i Index.
 * @param {*=} opt_value Value.
 * @param {Object=} opt_target Target.
 */
mvc.MVCArrayEvent = function(type, i, opt_value, opt_target) {

  goog.base(this, type, opt_target);

  /**
   * @type {number}
   */
  this.i = i;

  /**
   * @type {*}
   */
  this.value = opt_value;

};
goog.inherits(mvc.MVCArrayEvent, goog.events.Event);



/**
 * @constructor
 * @extends {mvc.MVCObject}
 * @param {Array=} opt_array Array.
 */
mvc.MVCArray = function(opt_array) {

  goog.base(this);

  /**
   * @private
   * @type {Array}
   */
  this.array_ = goog.isDefAndNotNull(opt_array) ? opt_array : [];

  this.updateLength_();

};
goog.inherits(mvc.MVCArray, mvc.MVCObject);


/**
 * @const
 * @type {string}
 */
mvc.MVCArray.LENGTH = 'length';


/**
 * @param {mvc.MVCArray|Array} arg Argument.
 * @return {mvc.MVCArray} MVCArray.
 */
mvc.MVCArray.create = function(arg) {
  if (arg instanceof mvc.MVCArray) {
    return arg;
  } else {
    return new mvc.MVCArray(arg);
  }
};


/**
 */
mvc.MVCArray.prototype.clear = function() {
  while (this[mvc.MVCArray.LENGTH]) {
    this.pop();
  }
};


/**
 * @param {function(*, number)} callback Callback.
 */
mvc.MVCArray.prototype.forEach = function(callback) {
  goog.array.forEach(this.array_, callback);
};


/**
 * @return {Array} Array.
 */
mvc.MVCArray.prototype.getArray = function() {
  return this.array_;
};


/**
 * @param {number} i Index.
 * @return {*} Element.
 */
mvc.MVCArray.prototype.getAt = function(i) {
  return this.array_[i];
};


/**
 * @return {number} Length.
 */
mvc.MVCArray.prototype.getLength = function() {
  return /** @type {number} */ (this.get(mvc.MVCArray.LENGTH));
};


/**
 * @param {number} i Index.
 * @param {*} elem Element.
 */
mvc.MVCArray.prototype.insertAt = function(i, elem) {
  goog.array.insertAt(this.array_, elem, i);
  this.updateLength_();
  this.dispatchEvent(new mvc.MVCArrayEvent(
      mvc.MVCArrayEventType.INSERT_AT, i, undefined, this));
  if (this[mvc.MVCArrayEventType.INSERT_AT]) {
    this[mvc.MVCArrayEventType.INSERT_AT](i);
  }
};


/**
 * @return {*} Element.
 */
mvc.MVCArray.prototype.pop = function() {
  return this.removeAt(this.getLength() - 1);
};


/**
 * @param {*} elem Element.
 * @return {number} Length.
 */
mvc.MVCArray.prototype.push = function(elem) {
  var n = this.array_.length;
  this.insertAt(n, elem);
  return n;
};


/**
 * @param {number} i Index.
 * @return {*} Value.
 */
mvc.MVCArray.prototype.removeAt = function(i) {
  var value = this.array_[i];
  goog.array.removeAt(this.array_, i);
  this.updateLength_();
  this.dispatchEvent(
      new mvc.MVCArrayEvent(mvc.MVCArrayEventType.REMOVE_AT, i, value, this));
  if (this[mvc.MVCArrayEventType.REMOVE_AT]) {
    this[mvc.MVCArrayEventType.REMOVE_AT](i);
  }
  return value;
};


/**
 * @param {number} i Index.
 * @param {*} elem Element.
 */
mvc.MVCArray.prototype.setAt = function(i, elem) {
  var n = this[mvc.MVCArray.LENGTH];
  if (i < n) {
    var value = this.array_[i];
    this.array_[i] = elem;
    this.dispatchEvent(
        new mvc.MVCArrayEvent(mvc.MVCArrayEventType.SET_AT, i, value, this));
    if (this[mvc.MVCArrayEventType.SET_AT]) {
      this[mvc.MVCArrayEventType.SET_AT](i, value);
    }
  } else {
    var j;
    for (j = n; j < i; ++j) {
      this.insertAt(j, undefined);
    }
    this.insertAt(i, elem);
  }
};


/**
 * @private
 */
mvc.MVCArray.prototype.updateLength_ = function() {
  this.set('length', this.array_.length);
};
