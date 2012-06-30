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
  assertEquals(m.get('k'), 1);
}


function testSetValues() {
  var m = new mvc.MVCObject();
  m.setValues({
    k1: 1,
    k2: 2
  });
  assertEquals(m.get('k1'), 1);
  assertEquals(m.get('k2'), 2);
}

function testNotifyCallback() {
  var m = new mvc.MVCObject();
  var callbackKey;
  m.changed = function(key) {
    callbackKey = key;
  };
  m.notify('k');
  assertEquals(callbackKey, 'k');
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


function testNotifyEvent() {
  var m = new mvc.MVCObject();
  var eventDispatched = false;
  goog.events.listen(m, 'changed', function() {
    eventDispatched = true;
  });
  m.notify('k');
  assertTrue(eventDispatched);
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
  var callbackKey;
  m.changed = function(key) {
    callbackKey = key;
  };
  m.set('k', 1);
  assertEquals(callbackKey, 'k');
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


function testSetNotifyEvent() {
  var m = new mvc.MVCObject();
  var eventDispatched = false;
  goog.events.listen(m, 'changed', function() {
    eventDispatched = true;
  });
  m.set('k', 1);
  assertTrue(eventDispatched);
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
  assertEquals(m.get('k'), 1);
  assertUndefined(n.get('k'));
  n.bindTo('k', m);
  assertEquals(m.get('k'), 1);
  assertEquals(n.get('k'), 1);
}


function testBindSet() {
  var m = new mvc.MVCObject();
  var n = new mvc.MVCObject();
  n.bindTo('k', m);
  m.set('k', 1);
  assertEquals(n.get('k'), m.get('k'));
}


function testBindSetBackwards() {
  var m = new mvc.MVCObject();
  var n = new mvc.MVCObject();
  n.bindTo('k', m);
  n.set('k', 1);
  assertEquals(n.get('k'), m.get('k'));
}


function testSetBindBackwards() {
  var m = new mvc.MVCObject();
  var n = new mvc.MVCObject();
  n.set('k', 1);
  n.bindTo('k', m);
  assertEquals(n.get('k'), m.get('k'));
}


function testBindSetUnbind() {
  var m = new mvc.MVCObject();
  var n = new mvc.MVCObject();
  n.bindTo('k', m);
  n.set('k', 1);
  assertEquals(n.get('k'), m.get('k'));
  n.unbind('k');
  assertEquals(n.get('k'), m.get('k'));
  n.set('k', 2);
  assertEquals(m.get('k'), 1);
  assertEquals(n.get('k'), 2);
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


function testMrideyAccessors() {
  // http://blog.mridey.com/2010/03/maps-javascript-api-v3-more-about.html
  var a = new mvc.MVCObject();
  a.set('level', 2);
  assertEquals(a.get('level'), 2);
  var b = new mvc.MVCObject();
  b.setValues({
    level: 2,
    index: 3,
    description: 'Hello world.'
  });
  assertEquals(b.get('index'), 3);
}

function testMrideyBinding() {
  // http://blog.mridey.com/2010/03/maps-javascript-api-v3-more-about.html
  var a = new mvc.MVCObject();
  a.set('level', 2);
  var b = new mvc.MVCObject();
  b.bindTo('index', a, 'level');
  assertEquals(b.get('index'), 2);
  a.set('level', 3);
  assertEquals(b.get('index'), 3);
  b.set('index', 4);
  assertEquals(a.get('level'), 4);
  var c = new mvc.MVCObject();
  c.bindTo('zoom', a, 'level');
  assertEquals(c.get('zoom'), 4);
  b.unbind('index');
  assertEquals(b.get('index'), 4);
  c.set('zoom', 5);
  assertEquals(a.get('level'), 5);
  assertEquals(b.get('index'), 4);
}
