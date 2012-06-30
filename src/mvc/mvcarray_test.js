goog.require('goog.testing.jsunit');
goog.require('goog.array');
goog.require('mvc.MVCArray');


function testEmpty() {
  var a = new mvc.MVCArray();
  assertEquals(a.getLength(), 0);
  assertTrue(goog.array.equals(a.getArray(), []));
  assertUndefined(a.getAt(0));
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


function testSetAt() {
  var a = new mvc.MVCArray();
  a.setAt(1, 1);
  assertEquals(a.getLength(), 2);
  assertUndefined(a.getAt(0));
  assertEquals(a.getAt(1), 1);
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
