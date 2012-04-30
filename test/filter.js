var test = require('tap').test
  , matcher = require('../matcher')
  , filter = matcher.filter

function isOdd(x) {
  return x % 2
}

function isEven(x) {
  return x % 2 === 0
}

test('list filter', function (t) {
  t.is(filter({ $a: [1,2] }, { $a: 1 }), true)
  t.is(filter({ $a: [1,2] }, { $a: 3 }), false)
  t.end()
})

test('function filter', function (t) {
  t.is(filter({ $a: isOdd }, { $a: 99 }), true)
  t.is(filter({ $a: isEven }, { $a: 100 }), true)

  t.is(filter({ $a: isOdd }, { $a: 106 }), false)
  t.is(filter({ $a: isEven }, { $a: 107 }), false)
  t.end()
})
