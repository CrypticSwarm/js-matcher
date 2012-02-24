var m = module.exports = 
  { match: match
  , isMatch: isMatch
  , rest: rest
  , mapMatch: mapMatch
  , isVar: isVar
  , filter: filter
  }
    

function mapMatch(matchList, obj, defaultVal) {
  var i = 0
    , len = matchList.length
    , filterObj
    , retVal
  for (; i < len; i++) {
    filterObj = matchList[i].length === 3 ? matchList[i][1]
              : null
    retVal = matchList[i].length === 3 ? matchList[i][2]
              : matchList[i][1]
    if (match(matchList[i][0], obj, filterObj)) return retVal
  }
  return defaultVal
}

function match(pattern, obj, filterObj) {
  var vars = {}
    , matched = isMatch(pattern, obj, vars)
  if (matched && filterObj) matched = filter(filterObj, vars)
  return matched ? vars : null
}

function filter(filterObj, bindings) {
  function filterBinding(key, i) {
    var filterVar = filterObj[key]
      , bindingsVar = bindings[key]
    if (Array.isArray(filterVar)) {
      return filterVar.indexOf(bindingsVar) !== -1
    }
    if (typeof filterVar === 'function') {
      return filterVar(bindingsVar)
    }
  }
  return Object.keys(filterObj).every(filterBinding)
}

function isMatch(input, validate, vars, later) {
  if (vars == null || later == null) {
    vars = vars || {}
    later = {}
    var ret = isMatch(input, validate, vars, later)
    return Object.keys(later).length > 0 ? false
         : ret
  }
  if (Array.isArray(input)) {
    return Array.isArray(validate) ? matchArray(input, validate, vars, later)
         : false
  }
  else if (input == null || validate == null) {
    return input === validate
  }
  else if (typeof input === 'object') {
    return typeof validate === 'object' ? matchObj(input, validate, vars, later)
         : false
  }
  else {
    if (m.isVar(input)) {
      if (vars[input]) {
        return isMatch(vars[input], validate, vars, later)
      }
      else {
        vars[input] = validate
      }
      if (later[input]) {
        var ltr = later[input]
        delete later[input]
        return isMatch(ltr.m[input], ltr.v[vars[input]], vars, later)
      }
      return true
    }
    return input === validate
  }
}

function matchArray(obj, validate, vars, later) {
  var i = 0
    , hasRest = obj[obj.length - 1] === rest
    , len = hasRest ? obj.length - 1 : obj.length
  if (!hasRest && validate.length !== len) return false
  if (hasRest && validate.length < len) return false
  for (; i < len; i++) {
    if (!isMatch(obj[i], validate[i], vars, later)) return false
  }
  return true
}

function matchObj(obj, validate, vars, later) {
  var i = 0
    , keys = Object.keys(obj)
    , len = keys.length
  for (; i < len; i++) {
    if (m.isVar(keys[i])) {
      if (vars[keys[i]]) { //match now
        return isMatch(obj[keys[i]], validate[vars[keys[i]]], vars, later)
      }
      else { //not enough info match later
        later[keys[i]] = { m: obj, v: validate }
      }
    }
    else if (!isMatch(obj[keys[i]], validate[keys[i]], vars, later)) {
      return false
    }
  }
  return true
}

function isVar(str) {
  return str[0] === '$'
}

function rest() {}
