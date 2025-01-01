function ajax(url, data, callback) {
  // ...
}

// function getPerson(data, cb) {
//   return ajax('https://example.com/person/1', data, cb)
// }
//
// function getOrder(data, cb) {
//   return ajax('https://example.com/order/1', data, cb)
// }

// function getCurrentUser(cb) {
//   return getPerson({ user: CURRENT_USER }, cb)
// }

function partial(fn, ...presetArgs) {
  return function partiallyApplied(...laterArgs) {
    return fn(...presetArgs, ...laterArgs)
  }
}

// after partially applied
const getPerson = partial(ajax, 'https://example.com/person/1')
// const getPerson = function partiallyApplied(...laterArgs) {
//   return ajax('https://example.com/person/1', ...laterArgs)
// }

const CURRENT_USER = { id: '1', name: 'John' }

const getCurrentUser1 = partial(ajax, 'https://example.com/person/1', {
  user: CURRENT_USER,
})

const getCurrentUser2 = partial(getPerson, { user: CURRENT_USER })

function reverseArgs(fn) {
  return function argsReversed(...args) {
    return fn(...args.reverse())
  }
}

const cache = {}

// we first partially apply the ajax with cb, then pass the other args as its original order
const cacheResult1 = reverseArgs(
  partial(reverseArgs(ajax), function onResult(obj) {
    cache[obj.id] = obj
  }),
)

cacheResult1('https://example.com/person/1', { user: CURRENT_USER })

function partialRight(fn, ...presetArgs) {
  return reverseArgs(partial(reverseArgs(fn), ...presetArgs.reverse()))
}

const cacheResult2 = partialRight(ajax, function onResult(obj) {
  cache[obj.id] = obj
})

cacheResult2('https://example.com/person/1', { user: CURRENT_USER })

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

var curriedAjax = curry(ajax)

var personFetcher = curriedAjax('https://example.com/person/1')

var getCurrentUser = personFetcher({ user: CURRENT_USER })

getCurrentUser(function onResult(user) { /* .. */ })

var adder = curry(add)

;[1, 2, 3, 4, 5].map(adder(3))

function sum(...args) {
  var sum = 0
  for (let i = 0; i < args.length; i++) {
    sum += args[i]
  }
  return sum
}

var curriedSum = curry(sum, 5)

function looseCurry(fn, arity = fn.length) {
  return (function nextCurried(prevArgs) {
    return function curried(...nextArgs) {
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

function unary(fn) {
  return function onlyOneArg(arg) {
    return fn(arg)
  }
}

function identity(v) {
  return v
}

function constant(v) {
  return function value() {
    return v
  }
}

function spreadArgs(fn) { // Ramda apply
  return function spreadFn(argsArr) {
    return fn(...argsArr)
  }
}

function gatherArgs(fn) { // Ramda unapply
  return function gatherFn(...argsArr) {
    return fn(argsArr)
  }
}
