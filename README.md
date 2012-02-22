JS Pattern Matcher
==================

JS Pattern Matcher is a naive pattern matcher. No special tricks or optimizations.

## Install

Install via NPM by running

`npm install js-matcher`

## API Docs


### match(pattern, obj)

* pattern - the pattern to match against.
* obj - object to match against the pattern.

Match recursively walks through the pattern space and the object to be matched against checking that each part match.  The pattern space can specify variables that can be matched against multiple times and will only match if the same variable matches itself on every occurance. Variables are specified by a string with '$' as the first character.

You can use variables as keys to objects.  Since there could be more than one result with this case the variable needs to be determined. ie. it must appear somewhere else in the pattern that isn't the key to an object.  ( `{ '$a': 1, x: '$a' }` )

#### Examples

Ones that will match and return true:

```javascript
var matcher = require('js-matcher')
  , match = matcher.match
  , rest = matcher.rest
match({ a: 1 }, { a: 1})
match([1,2,3,4], [1,2,3,4])
match([1, rest], [1, 2, 3, 4])
match({ a: 1 }, { a: 1, b: 3, c: 3})
match({ a: '$v', d: [1,2,'$v']}, { a: 1, b: 3, c: 3, d: [1,2,1]})
match({ '$v': 3, d: [1,2,'$v']}, { a: 1, b: 3, c: 3, d: [1,2,'b']})
match(['$v',2], [1,2])
```

Ones that will return false:

```javascript
match({ a: 2 }, { a: 1})
match([1,2,7,4], [1,2,3,4])
match([4, rest], [1, 2, 3, 4])
```

### mapMatch(patterns, obj, defaultVal)

* patterns - an array of patterns - val pairs. The first part of the pair is a pattern to run in match.  The second is the value to return if that pattern matched.
* obj - the object to run against the list of patterns.
* defaultVal - the value to return if none of the patterns matched.

mapMatch runs through the list and returns the first value of a [pattern, value] where the pattern matches.

#### Examples

```javascript
var matcher = require('js-matcher')
  , mapMatch = matcher.mapMatch
  , patterns =
    [ [ { a: 123 }, 'hi there' ]
    , [ { b: 454 }, 'b is 454' ]
    , [ { a: [1, 2] }, "123's and abc's"]
    ]

mapMatch(patterns, { a: 123, b: 454 }, "I wasn't matched") // 'hi there'
mapMatch(patterns, { d: 83, b: 454 }, "I wasn't matched") // 'b is 454'
mapMatch(patterns, { a: [1, 2], b: [454] }, "I wasn't matched") // "123's and abc's"
mapMatch(patterns, { a: [3, 2, 4], b: [454] }, "I wasn't matched") // "I wasn't matched"


var matchList =
  [ [ [0, 0]      , 1]
  , [ [0, '$v']   , 2]
  , [ ['$v', '$v'], 3]
  ]

mapMatch(matchList, [0,0], 4) // 1
mapMatch(matchList, [0,2], 4) // 2
mapMatch(matchList, [4,4], 4) // 3
mapMatch(matchList, [3,2], 4) // 4
```

### rest

Place holder for the end of an array.  When added to the end of an array in a pattern it signifies that the array to be matched can have more elements then the pattern array.

