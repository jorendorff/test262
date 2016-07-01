// Copyright (C) 2013 the V8 project authors. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
es6id: 25.3.1.4
description: >
    When a generator is paused within a `catch` block that is declared within a
    `try` block of a `try..catch` statement, `throw` should interrupt control
    flow as if a `throw` statement had appeared at that location in the
    function body.
---*/

var unreachable = 0;
function* g() {
  try {
    yield 1;
    try {
      yield 2;
      throw exception;
    } catch (e) {
      yield e;
      unreachable += 1;
    }
    yield 3;
  } finally {
    yield 4;
  }
  yield 5;
}
var exception = new Error();
var iter = g();
var result;

result = iter.next();
assert.sameValue(result.value, 1, 'First result `value`');
assert.sameValue(result.done, false, 'First result `done` flag');

result = iter.next();
assert.sameValue(result.value, 2, 'Second result `value`');
assert.sameValue(result.done, false, 'Second result `done` flag');

result = iter.next();
assert.sameValue(result.value, exception, 'Third result `value`');
assert.sameValue(result.done, false, 'Third result `done` flag');

result = iter.throw(new Test262Error());
assert.sameValue(result.value, 4, 'Fourth result `value`');
assert.sameValue(result.done, false, 'Fourth result `done` flag');

assert.throws(Test262Error, function() { iter.next(); });

assert.sameValue(
  unreachable,
  0,
  'statement following `yield` not executed (following `throw`)'
);

result = iter.next();
assert.sameValue(
  result.value, undefined, 'Result `value` is undefined when done'
);
assert.sameValue(result.done, true, 'Result `done` flag is `true` when done');
assert.sameValue(
  unreachable, 0, 'statement following `yield` not executed (once "completed")'
);

iter.next();
