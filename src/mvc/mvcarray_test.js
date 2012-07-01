goog.require('goog.array');
goog.require('goog.testing.jsunit');
goog.require('mvc.MVCArray');
goog.require('mvc.MVCArrayEventType');


function testEmpty() {
  var a = new mvc.MVCArray();
  assertEquals(0, a.getLength());
  assertTrue(goog.array.equals(a.getArray(), []));
  assertUndefined(a.getAt(0));
}


function testConstruct() {
  var array = [0, 1, 2];
  var a = new mvc.MVCArray(array);
  assertEquals(0, a.getAt(0));
  assertEquals(1, a.getAt(1));
  assertEquals(2, a.getAt(2));
}


function testPush() {
  var a = new mvc.MVCArray();
  a.push(1);
  assertEquals(1, a.getLength());
  assertTrue(goog.array.equals(a.getArray(), [1]));
  assertEquals(1, a.getAt(0));
}


function testPushPop() {
  var a = new mvc.MVCArray();
  a.push(1);
  a.pop();
  assertEquals(0, a.getLength());
  assertTrue(goog.array.equals(a.getArray(), []));
  assertUndefined(a.getAt(0));
}


function testInsertAt() {
  var a = new mvc.MVCArray([0, 2]);
  a.insertAt(1, 1);
  assertEquals(0, a.getAt(0));
  assertEquals(1, a.getAt(1));
  assertEquals(2, a.getAt(2));
}


function testSetAt() {
  var a = new mvc.MVCArray();
  a.setAt(1, 1);
  assertEquals(2, a.getLength());
  assertUndefined(a.getAt(0));
  assertEquals(1, a.getAt(1));
}


function testRemoveAt() {
  var a = new mvc.MVCArray([0, 1, 2]);
  a.removeAt(1);
  assertEquals(0, a.getAt(0));
  assertEquals(2, a.getAt(1));
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
  assertEquals(2, forEachCount);
}


function testSetAtEvent() {
  var a = new mvc.MVCArray(['a', 'b']);
  var index, value;
  goog.events.listen(a, mvc.MVCArrayEventType.SET_AT, function(e) {
    index = e.i;
    value = e.value;
  });
  a.setAt(1, 1);
  assertEquals(1, index);
  assertEquals('b', value);
}


function testRemoveAtEvent() {
  var a = new mvc.MVCArray(['a']);
  var index, value;
  goog.events.listen(a, mvc.MVCArrayEventType.REMOVE_AT, function(e) {
    index = e.i;
    value = e.value;
  });
  a.pop();
  assertEquals(0, index);
  assertEquals('a', value);
}


function testInsertAtEvent() {
  var a = new mvc.MVCArray([0, 2]);
  var index;
  goog.events.listen(a, mvc.MVCArrayEventType.INSERT_AT, function(e) {
    index = e.i;
  });
  a.insertAt(1, 1);
  assertEquals(1, index);
}
