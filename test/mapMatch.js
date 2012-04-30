var test = require('tap').test
  , matcher = require('../matcher')
  , mapMatch = matcher.mapMatch

test('objs', function (t) {
  var patterns =
      [ [ { a: 123 }, 'hi there' ]
      , [ { b: 454 }, 'b is 454' ]
      , [ { a: [1, 2] }, "123's and abc's"]
      ]
  t.is(mapMatch(patterns, { a: 123, b: 454 }, "I wasn't matched"),  'hi there')
  t.is(mapMatch(patterns, { d: 83, b: 454 }, "I wasn't matched"),  'b is 454')
  t.is(mapMatch(patterns, { a: [1, 2], b: [454] }, "I wasn't matched"),  "123's and abc's")
  t.is(mapMatch(patterns, { a: [3, 2, 4], b: [454] }, "I wasn't matched"),  "I wasn't matched")
  t.end()
})


test('arrays', function (t) {
  function isOdd(x) {
    return x % 2
  }
  var matchList =
    [ [ [0, 0]      , 1]
    , [ [0, '$v']   , 2]
    , [ ['$v', '$v'], { $v: isOdd }, 3]
    ]

  t.is(mapMatch(matchList, [0,0], 4),  1)
  t.is(mapMatch(matchList, [0,2], 4),  2)
  t.is(mapMatch(matchList, [9,9], 4),  3)
  t.is(mapMatch(matchList, [3,2], 4),  4)
  t.is(mapMatch(matchList, [6,6], 4),  4)
  t.end()
})
