JS Pattern Matcher
==================

JS Pattern Matcher is a naive pattern matcher. No special tricks or optimizations.

The API is currently unstable.

## Install

Install via NPM by running

`npm install js-matcher`

## API Docs

### rest

Place holder for the end of an array.  When added to the end of an array in a pattern it signifies that the array to be matched can have more elements then the pattern array.


### isMatch(pattern, obj)

* pattern - the pattern to match against.
* obj - object to match against the pattern.

* returns - `true` when obj matches the pattern.  `false` when obj doesn't match the pattern.

isMatch recursively walks through the pattern space and the object to be matched against checking that each part match.  The pattern space can specify variables that can be matched against multiple times and will only match if the same variable matches itself on every occurance. Variables are specified by a string with '$' as the first character.

You can use variables as keys to objects.  Since there could be more than one result with this case the variable needs to be determined. ie. it must appear somewhere else in the pattern that isn't the key to an object.  ( `{ '$a': 1, x: '$a' }` )

*compare with regex `test`*

#### Examples

Ones that will match and return true:

```javascript
var matcher = require('js-matcher')
  , isMatch = matcher.isMatch
  , rest = matcher.rest
isMatch({ a: 1 }, { a: 1})
isMatch([1,2,3,4], [1,2,3,4])
isMatch([1, rest], [1, 2, 3, 4])
isMatch({ a: 1 }, { a: 1, b: 3, c: 3})
isMatch({ a: '$v', d: [1,2,'$v']}, { a: 1, b: 3, c: 3, d: [1,2,1]})
isMatch({ '$v': 3, d: [1,2,'$v']}, { a: 1, b: 3, c: 3, d: [1,2,'b']})
isMatch(['$v',2], [1,2])
```

Ones that will return false:

```javascript
isMatch({ a: 2 }, { a: 1})
isMatch([1,2,7,4], [1,2,3,4])
isMatch([4, rest], [1, 2, 3, 4])
```

### filter(filterObj, bindings)

* filterObj - Mapping of varnames to filters.
* bindings - Mapping of varnames to values.

* returns - true if all passed, false if at least one did not pass.

Filter iterates through the the mappings making sure that each value passes its associated filter.  A filter consists of either a function that takes the value and returns true if it passes the filter false if it doesn't, or an array that contains a list of acceptable values.

#### Examples

```javascript
var matcher = require('js-matcher')
  , filter = matcher.filter

function isOdd(x) {
  return x % 2
}

filter({ $a: [1,2] }, { $a: 1 }) // true
filter({ $a: isOdd }, { $a: 99 }) //true
filter({ $a: isOdd }, { $a: 106 }) //false
```

### match(pattern, obj, filterObj)

* pattern - the pattern to match against.
* obj - object to match against the pattern.
* filterObj (*optional*) - filter to run apply bindings to after isMatch runs.

* returns - `object` that is the variable bindings when obj matches the pattern.  `null` when obj doesn't match the pattern.

match is very similar to isMatch but instead of returning true or false returns what the variables are bound to in the match.

*compare with regex `exec`*

#### Examples

```javascript
var matcher = require('js-matcher')
  , match = matcher.match
  , rest = matcher.rest

match(['$v',2], [1,2])
//{ '$v': 1 }

match({ '$v': '$y', $x: [1,2,'$v'], i: '$x'}, { i: 'd', b: [23, 44], a: 3, c: 3, d: [1,2,'b']})
//{ '$x': 'd', '$v': 'b', '$y': [ 23, 44 ] }
```

### mapMatch(patterns, obj, defaultVal)

* patterns - an array of patterns - val pairs. The first part of the pair is a pattern to run in match.  The second is the value to return if that pattern matched. Optionally the second value can be a filter (see filter section).  In this case the return value is diplaced to the third param.
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

function isOdd(x) {
  return x % 2
}

mapMatch(patterns, { a: 123, b: 454 }, "I wasn't matched") // 'hi there'
mapMatch(patterns, { d: 83, b: 454 }, "I wasn't matched") // 'b is 454'
mapMatch(patterns, { a: [1, 2], b: [454] }, "I wasn't matched") // "123's and abc's"
mapMatch(patterns, { a: [3, 2, 4], b: [454] }, "I wasn't matched") // "I wasn't matched"


var matchList =
  [ [ [0, 0]      , 1]
  , [ [0, '$v']   , 2]
  , [ ['$v', '$v'], { $v: isOdd }, 3]
  ]

mapMatch(matchList, [0,0], 4) // 1
mapMatch(matchList, [0,2], 4) // 2
mapMatch(matchList, [9,9], 4) // 3
mapMatch(matchList, [3,2], 4) // 4
mapMatch(matchList, [6,6], 4) // 4

```

