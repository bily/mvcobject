goog.require('goog.array');
goog.require('goog.testing.jsunit');
goog.require('mvc.MVCArray');
goog.require('mvc.MVCArrayEventType');


function testEmpty() {
  var a = new mvc.MVCArray();
  assertEquals(a.getLength(), 0);
  assertTrue(goog.array.equals(a.getArray(), []));
  assertUndefined(a.getAt(0));
}


function testConstruct() {
  var array = [0, 1, 2];
  var a = new mvc.MVCArray(array);
  assertEquals(a.getAt(0), 0);
  assertEquals(a.getAt(1), 1);
  assertEquals(a.getAt(2), 2);
}


function testPush() {
  var a = new mvc.MVCArray();
  a.push(1);
  assertEquals(a.getLength(), 1);
  assertTrue(goog.array.equals(a.getArray(), [1]));
  assertEquals(a.getAt(0), 1);
}


function testPushPop() {
  var a = new mvc.MVCArray();
  a.push(1);
  a.pop();
  assertEquals(a.getLength(), 0);
  assertTrue(goog.array.equals(a.getArray(), []));
  assertUndefined(a.getAt(0));
}


function testInsertAt() {
  var a = new mvc.MVCArray([0, 2]);
  a.insertAt(1, 1);
  assertEquals(a.getAt(0), 0);
  assertEquals(a.getAt(1), 1);
  assertEquals(a.getAt(2), 2);
}


function testSetAt() {
  var a = new mvc.MVCArray();
  a.setAt(1, 1);
  assertEquals(a.getLength(), 2);
  assertUndefined(a.getAt(0));
  assertEquals(a.getAt(1), 1);
}


function testRemoveAt() {
  var a = new mvc.MVCArray([0, 1, 2]);
  a.removeAt(1);
  assertEquals(a.getAt(0), 0);
  assertEquals(a.getAt(1), 2);
}


function testForEachEmpty() {
  var a = new mvc.MVCArray();
  var forEachCalled = false;
  a.forEach(function() {
    forEachCalled = true;
  });
  assertFalse(forEachCalled);
}


function testForEachPopulated() {
  var a = new mvc.MVCArray();
  a.push(1);
  a.push(2);
  var forEachCount = 0;
  a.forEach(function() {
    ++forEachCount;
  });
  assertEquals(forEachCount, 2);
}
