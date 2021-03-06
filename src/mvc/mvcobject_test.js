goog.require('goog.testing.jsunit');
goog.require('mvc.MVCObject');


function testModel() {
  var m = new mvc.MVCObject();
  assertNotNullNorUndefined(m);
}


function testGetUndefined() {
  var m = new mvc.MVCObject();
  assertUndefined(m.get('k'));
}


function testGetSetGet() {
  var m = new mvc.MVCObject();
  assertUndefined(m.get('k'));
  m.set('k', 1);
  assertEquals(1, m.get('k'));
}


function testSetValues() {
  var m = new mvc.MVCObject();
  m.setValues({
    k1: 1,
    k2: 2
  });
  assertEquals(1, m.get('k1'));
  assertEquals(2, m.get('k2'));
}

function testNotifyCallback() {
  var m = new mvc.MVCObject();
  var callbackCalled;
  m.changed = function() {
    callbackCalled = true;
  };
  m.notify('k');
  assertTrue(callbackCalled);
}


function testNotifyKeyCallback() {
  var m = new mvc.MVCObject();
  var callbackCalled = false;
  m.k_changed = function() {
    callbackCalled = true;
  };
  m.notify('k');
  assertTrue(callbackCalled);
}


function testNotifyKeyEvent() {
  var m = new mvc.MVCObject();
  var eventDispatched = false;
  goog.events.listen(m, 'k_changed', function() {
    eventDispatched = true;
  });
  m.notify('k');
  assertTrue(eventDispatched);
}


function testSetNotifyCallback() {
  var m = new mvc.MVCObject();
  var callbackCalled;
  m.changed = function() {
    callbackCalled = true;
  };
  m.set('k', 1);
  assertTrue(callbackCalled);
}


function testSetNotifyKeyCallback() {
  var m = new mvc.MVCObject();
  var callbackCalled = false;
  m.k_changed = function(v) {
    callbackCalled = true;
  };
  m.set('k', 1);
  assertTrue(callbackCalled);
}


function testBindSetNotifyKeyCallback() {
  var m = new mvc.MVCObject();
  var n = new mvc.MVCObject();
  var callbackCalled = false;
  n.k_changed = function(v) {
    callbackCalled = true;
  };
  n.bindTo('k', m);
  m.set('k', 1);
  assertTrue(callbackCalled);
}


function testSetNotifyKeyEvent() {
  var m = new mvc.MVCObject();
  var eventDispatched = false;
  goog.events.listen(m, 'k_changed', function() {
    eventDispatched = true;
  });
  m.set('k', 1);
  assertTrue(eventDispatched);
}


function testSetBind() {
  var m = new mvc.MVCObject();
  var n = new mvc.MVCObject();
  m.set('k', 1);
  assertEquals(1, m.get('k'));
  assertUndefined(n.get('k'));
  n.bindTo('k', m);
  assertEquals(1, m.get('k'));
  assertEquals(1, n.get('k'));
}


function testBindSet() {
  var m = new mvc.MVCObject();
  var n = new mvc.MVCObject();
  n.bindTo('k', m);
  m.set('k', 1);
  assertEquals(1, m.get('k'));
  assertEquals(1, n.get('k'));
}


function testBindSetBackwards() {
  var m = new mvc.MVCObject();
  var n = new mvc.MVCObject();
  n.bindTo('k', m);
  n.set('k', 1);
  assertEquals(1, m.get('k'));
  assertEquals(1, n.get('k'));
}


function testSetBindBackwards() {
  var m = new mvc.MVCObject();
  var n = new mvc.MVCObject();
  n.set('k', 1);
  n.bindTo('k', m);
  assertUndefined(m.get('k'));
  assertUndefined(n.get('k'));
}


function testBindSetUnbind() {
  var m = new mvc.MVCObject();
  var n = new mvc.MVCObject();
  n.bindTo('k', m);
  n.set('k', 1);
  assertEquals(1, m.get('k'));
  assertEquals(1, n.get('k'));
  n.unbind('k');
  assertEquals(1, m.get('k'));
  assertEquals(1, n.get('k'));
  n.set('k', 2);
  assertEquals(1, m.get('k'));
  assertEquals(2, n.get('k'));
}


function testUnbindAll() {
  var m = new mvc.MVCObject();
  var n = new mvc.MVCObject();
  n.bindTo('k', m);
  n.set('k', 1);
  assertEquals(m.get('k'), 1);
  assertEquals(n.get('k'), 1);
  n.unbindAll();
  assertEquals(m.get('k'), 1);
  assertEquals(n.get('k'), 1);
  n.set('k', 2);
  assertEquals(m.get('k'), 1);
  assertEquals(n.get('k'), 2);
}


function testBindNotify() {
  var m = new mvc.MVCObject();
  var n = new mvc.MVCObject();
  m.bindTo('k', n);
  mCallbackCalled = false;
  m.k_changed = function() {
    mCallbackCalled = true;
  };
  nCallbackCalled = false;
  n.k_changed = function() {
    nCallbackCalled = true;
  };
  n.set('k', 1);
  assertTrue(mCallbackCalled);
  assertTrue(nCallbackCalled);
}


function testBindBackwardsNotify() {
  var m = new mvc.MVCObject();
  var n = new mvc.MVCObject();
  n.bindTo('k', m);
  mCallbackCalled = false;
  m.k_changed = function() {
    mCallbackCalled = true;
  };
  nCallbackCalled = false;
  n.k_changed = function() {
    nCallbackCalled = true;
  };
  n.set('k', 1);
  assertTrue(mCallbackCalled);
  assertTrue(nCallbackCalled);
}


function testBindRename() {
  var m = new mvc.MVCObject();
  var n = new mvc.MVCObject();
  n.bindTo('kn', m, 'km');
  m.set('km', 1);
  assertEquals(m.get('km'), 1);
  assertEquals(n.get('kn'), 1);
}


function testBindRenameCallbacks() {
  var m = new mvc.MVCObject();
  var n = new mvc.MVCObject();
  var kmCallbackCalled = false;
  m.km_changed = function() {
    kmCallbackCalled = true;
  };
  var knCallbackCalled = false;
  n.kn_changed = function() {
    knCallbackCalled = true;
  };
  n.bindTo('kn', m, 'km');
  m.set('km', 1);
  assertEquals(m.get('km'), 1);
  assertEquals(n.get('kn'), 1);
  assertTrue(kmCallbackCalled);
  assertTrue(knCallbackCalled);
}


function testTransitiveBindForwards() {
  var m = new mvc.MVCObject();
  var n = new mvc.MVCObject();
  var o = new mvc.MVCObject();
  n.bindTo('kn', m, 'km');
  o.bindTo('ko', n, 'kn');
  m.set('km', 1);
  assertEquals(1, m.get('km'));
  assertEquals(1, n.get('kn'));
  assertEquals(1, o.get('ko'));
}


function testTransitiveBindBackwards() {
  var m = new mvc.MVCObject();
  var n = new mvc.MVCObject();
  var o = new mvc.MVCObject();
  n.bindTo('kn', m, 'km');
  o.bindTo('ko', n, 'kn');
  o.set('ko', 1);
  assertEquals(1, m.get('km'));
  assertEquals(1, n.get('kn'));
  assertEquals(1, o.get('ko'));
}


function testInheritance() {
  var C = function() {};
  C.prototype = new mvc.MVCObject();
  var callbackCalled;
  C.prototype.k_changed = function() {
    callbackCalled = true;
  };
  var c = new C();
  c.set('k', 1);
  assertEquals(1, c.get('k'));
  assertTrue(callbackCalled);
}


function testMrideyAccessors() {
  // http://blog.mridey.com/2010/03/maps-javascript-api-v3-more-about.html
  var a = new mvc.MVCObject();
  a.set('level', 2);
  assertEquals(2, a.get('level'));
  var b = new mvc.MVCObject();
  b.setValues({
    level: 2,
    index: 3,
    description: 'Hello world.'
  });
  assertEquals(3, b.get('index'));
}


function testMrideyBinding() {
  // http://blog.mridey.com/2010/03/maps-javascript-api-v3-more-about.html
  var a = new mvc.MVCObject();
  a.set('level', 2);
  var b = new mvc.MVCObject();
  b.bindTo('index', a, 'level');
  assertEquals(2, b.get('index'));
  a.set('level', 3);
  assertEquals(3, b.get('index'));
  b.set('index', 4);
  assertEquals(4, a.get('level'));
  var c = new mvc.MVCObject();
  c.bindTo('zoom', a, 'level');
  assertEquals(4, c.get('zoom'));
  b.unbind('index');
  assertEquals(4, b.get('index'));
  c.set('zoom', 5);
  assertEquals(5, a.get('level'));
  assertEquals(4, b.get('index'));
}


function testCircularBind() {
  var a = new mvc.MVCObject();
  var b = new mvc.MVCObject();
  a.bindTo('k', b);
  assertThrows(function() {
    b.bindTo('k', a);
  });
}


function testPriority() {
  var a = new mvc.MVCObject();
  var b = new mvc.MVCObject();
  a.set('k', 1);
  b.set('k', 2);
  a.bindTo('k', b);
  assertEquals(2, a.get('k'));
  assertEquals(2, b.get('k'));
}


function testPriorityUndefined() {
  var a = new mvc.MVCObject();
  var b = new mvc.MVCObject();
  a.set('k', 1);
  a.bindTo('k', b);
  assertUndefined(a.get('k'));
  assertUndefined(b.get('k'));
}


function testSetter() {
  var a = new mvc.MVCObject();
  var x;
  var setterCalled;
  a.setX = function(value) {
    this.x = value;
    setterCalled = true;
  };
  a.set('x', 1);
  assertEquals(1, a.get('x'));
  assertUndefined(setterCalled);
}


function testSetterBind() {
  var a = new mvc.MVCObject();
  var x;
  var setterCalled;
  a.setX = function(value) {
    this.x = value;
    setterCalled = true;
  };
  var b = new mvc.MVCObject();
  b.bindTo('x', a);
  b.set('x', 1);
  assertEquals(1, a.get('x'));
  assertEquals(1, b.get('x'));
  assertTrue(setterCalled);
}


function testGetter() {
  var a = new mvc.MVCObject();
  var getterCalled;
  a.getX = function() {
    getterCalled = true;
    return 1;
  };
  assertUndefined(a.get('x'));
  assertUndefined(getterCalled);
}


function testGetterBind() {
  var a = new mvc.MVCObject();
  var getterCalled;
  a.getX = function() {
    getterCalled = true;
    return 1;
  };
  var b = new mvc.MVCObject();
  b.bindTo('x', a);
  assertEquals(1, b.get('x'));
  assertTrue(getterCalled);
}


function testBindSelf() {
  var a = new mvc.MVCObject();
  assertThrows(function() {
    a.bindTo('k', a);
  });
}


function testChangedKey() {
  var a = new mvc.MVCObject();
  var changedKey;
  a.changed = function(key) {
    changedKey = key;
  };
  a.set('k', 1);
  assertEquals('k', changedKey);
}


function testCreateFromObject() {
  var obj = {k: 1};
  var mvcObject = mvc.MVCObject.create(obj);
  assertTrue(mvcObject instanceof mvc.MVCObject);
  assertEquals(1, mvcObject.get('k'));
}


function testCreateFromMVCObject() {
  var mvcObject1 = new mvc.MVCObject();
  var mvcObject2 = mvc.MVCObject.create(mvcObject1);
  assertTrue(mvcObject2 === mvcObject1);
}
