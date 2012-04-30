var test = require('tap').test
  , matcher = require('../matcher')
  , isMatch = matcher.isMatch
  , rest = matcher.rest

test('literal match', function (t) {
  t.same(isMatch({ a: 1 }, { a: 1}), true)
  t.same(isMatch([1,2,3,4], [1,2,3,4]), true)
  t.same(isMatch({ a: 1 }, { a: 1, b: 3, c: 3}), true)
  t.not(isMatch({ a: 2 }, { a: 1}), true)
  t.not(isMatch([1,2,7,4], [1,2,3,4]), true)
  t.end()
})


test('variable match', function (t) {
  t.same(isMatch({ a: '$v', d: [1,2,'$v']}, { a: 1, b: 3, c: 3, d: [1,2,1]}), true)
  t.same(isMatch({ '$v': 3, d: [1,2,'$v']}, { a: 1, b: 3, c: 3, d: [1,2,'b']}), true)
  t.same(isMatch(['$v',2], [1,2]), true)
  t.same(isMatch([1, rest], [1, 2, 3, 4]), true)
  t.not(isMatch([4, rest], [1, 2, 3, 4]), true)
  t.end()
})

