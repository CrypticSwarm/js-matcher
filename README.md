JS Pattern Matcher
==================

JS Pattern Matcher is a naive pattern matcher.

## API Docs


#### match(pattern, obj)

* pattern - the pattern to match against.
* obj - object to match against the pattern.

Match recursively walks through the pattern space and the object to be matched against checking that each part match.  The pattern space can specify variables that can be matched against multiple times and will only match if the same variable matches itself on every occurance. Variables are specified by a string with '$' as the first character.

You can use variables as keys to objects.  Since there could be more than one result with this case the variable needs to be determined. ie. it must appear somewhere else in the pattern that isn't the key to an object.  ( `{ '$a': 1, x: '$a' }` )


#### rest

Place holder for the end of an array.  When added to the end of an array then it the matched array can have more elements then the pattern array.

## Examples

Ones that will match and return true:

```javascript
var matcher = require('./matcher')
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

