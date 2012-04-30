var test = require('tap').test
  , matcher = require('../matcher')
  , match = matcher.match
test('match vars', function (t) {
  t.same(match({ '$v': '$y', $x: [1,2,'$v'], i: '$x'}
              , { i: 'd', b: [23, 44], a: 3, c: 3, d: [1,2,'b']})
        , { '$x': 'd', '$v': 'b', '$y': [ 23, 44 ] })
  t.end()
})
