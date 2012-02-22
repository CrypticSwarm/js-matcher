var m = module.exports = 
  { match: match
  , rest: rest
  , mapMatch: mapMatch
  , isVar: isVar
  }
    

function mapMatch(matchList, obj, defaultVal) {
  var i = 0
    , len = matchList.length
  for (; i < len; i++) {
    if (match(matchList[i][0], obj)) return matchList[i][1]
  }
  return defaultVal
}

function match(input, validate, vars, later) {
  if (vars == null && later == null) {
    later = {}
    vars = {}
    var ret = match(input, validate, vars, later)
    return Object.keys(later).length > 0 ? false
         : ret
  }
  if (Array.isArray(input)) {
    return Array.isArray(validate) ? matchArray(input, validate, vars, later)
         : false
  }
  else if (typeof input === 'object') {
    return typeof validate === 'object' ? matchObj(input, validate, vars, later)
         : false
  }
  else {
    if (m.isVar(input)) {
      if (vars[input]) {
        return match(vars[input], validate, vars, later)
      }
      else {
        vars[input] = validate
      }
      if (later[input]) {
        var ltr = later[input]
        delete later[input]
        return match(ltr.m[input], ltr.v[vars[input]], vars, later)
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
    if (!match(obj[i], validate[i], vars, later)) return false
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
        return match(obj[keys[i]], validate[vars[keys[i]]], vars, later)
      }
      else { //not enough info match later
        later[keys[i]] = { m: obj, v: validate }
      }
    }
    else if (!match(obj[keys[i]], validate[keys[i]], vars, later)) {
      return false
    }
  }
  return true
}

function isVar(str) {
  return str[0] === '$'
}

function rest() {}
