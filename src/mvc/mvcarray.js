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
 * @fileoverview A cleanroom implementation of Google Maps' MVCArray.
 * @see https://developers.google.com/maps/documentation/javascript/reference
 */

goog.provide('mvc.MVCArray');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('mvc.MVCObject');



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

};
goog.inherits(mvc.MVCArray, mvc.MVCObject);


/**
 */
mvc.MVCArray.prototype.clear = function() {
  for (i = this.array_.length; i > 0; --i) {
    this.removeAt(i - 1);
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
  return this.array_.length;
};


/**
 * @param {number} i Index.
 * @param {*} elem Element.
 */
mvc.MVCArray.prototype.insertAt = function(i, elem) {
  goog.array.insertAt(this.array_, elem, i);
  // FIXME dispatch event
};


/**
 * @return {*} Element.
 */
mvc.MVCArray.prototype.pop = function() {
  var n = this.array_.length;
  goog.asserts.assert(n > 0);
  if (n === 0) {
    return undefined;
  } else {
    return this.removeAt(n - 1);
  }
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
 */
mvc.MVCArray.prototype.removeAt = function(i) {
  goog.array.removeAt(this.array_, i);
  // FIXME dispatch event
};


/**
 * @param {number} i Index.
 * @param {*} elem Element.
 */
mvc.MVCArray.prototype.setAt = function(i, elem) {
  this.array_[i] = elem;
  // FIXME dispatch event
};
