function curry(fn, arity = fn.length) {
  return (function nextCurried(prevArgs) {
    return function curried(nextArgs) {
      var args = prevArgs.concat([nextArgs])

      if (args.length >= arity) {
        return fn(...args)
      }
      else {
        return nextCurried(args)
      }
    }
  })([])
}

function uncurry(fn) {
  return function uncurried(...args) {
    var ret = fn
    for (let i = 0; i < args.length; i++) {
      ret = ret(args[i])
    }
    return ret
  }
}

function uncurry2(fn) {
  return function uncurried(...args) {
    function recur(ret, index) {
      if (index === args.length) {
        return ret
      }
      return recur(ret(args[index]), index + 1)
    }
    return recur(fn, 0)
  }
}

function sum(...args) {
  var sum = 0
  for (let i = 0; i < args.length; i++) {
    sum += args[i]
  }
  return sum
}

var curriedSum = curry(sum, 5)

const res1 = uncurry(curriedSum)(1, 2, 3, 4, 5)
const res2 = uncurry2(curriedSum)(1, 2, 3, 4, 5)

function identity(x) {
  return x
}

var words = '   Now is the time for all...  '.split(/\s|\b/)
const filteredWords = words.filter(identity)
console.log(words, filteredWords)
