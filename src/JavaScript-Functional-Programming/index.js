const identity = v => v

const reduce = (fn, initial, target) =>
  [].reduce.call(target, fn, initial)

const map = (fn, target) => [].map.call(target, fn)

const fail = msg => console.error(msg)

const existy = v => v != null

const always = v => () => v

const curry = fn => arg => fn(arg)
// direction for curry is from right to left
const curry2 = fn => arg2 => arg1 => fn(arg1, arg2)
const curry3 = fn => arg3 => arg2 => arg1 => fn(arg1, arg2, arg3)

const partial1 = (fn, arg1) =>
  (...args) => fn.apply(fn, [arg1, ...args])
const partial2 = (fn, arg1, arg2) =>
  (...args) => fn.apply(fn, [arg1, arg2, ...args])

const partial = (fn, ...pargs) =>
  (...args) => fn.apply(fn, [...pargs, ...args])

const reverse = arr => arr.reverse()

const compose = (...fns) => (...args) =>
  reduce(
    (res, f) => [f.apply(f, res)],
    args,
    reverse(fns),
  )[0]

const range = n => map((v, i) => i, Array.from({ length: n }))

const fnull = (fn, ...defaults) => {
  return (...args) => {
    const safeArgss = map(
      (e, i) => existy(e) ? e : defaults[i],
      args,
    )
    return fn.apply(null, safeArgss)
  }
}

const doWhen = (condition, cb) => condition ? cb() : undefined

const invoker = (name, method) => {
  return (target, ...args) => {
    if (!existy(target)) fail('Must provide a target')
    const targetMethod = target[name]
    return doWhen(
      (existy(targetMethod) && method === targetMethod),
      () => targetMethod.apply(target, args),
    )
  }
}

const checker = (...validators) => (obj) => {
  reduce(
    (errs, check) => check(obj) ? errs : [errs, check.message],
    [],
    validators,
  )
}

const validator = (msg, fn) => {
  const f = (...args) => fn.apply(fn, args)
  f['message'] = msg
  return f
}

const dispatch = (...fns) => {
  return (target, ...args) => {
    let ret = undefined
    for (let i = 0; i < fns.length; i += 1) {
      ret = fns[i].apply(fns[i], [target, ...args])
      if (existy(ret)) return ret
    }
    return ret
  }
}

var str = dispatch(
  invoker('toString', Array.prototype.toString),
  invoker('toString', String.prototype.toString),
)

const isString = s => typeof s === 'string'

const stringReverse = (s) => {
  if (!isString(s)) return undefined
  return s.split('').reverse().join('')
}

var rev = dispatch(
  invoker('reverse', Array.prototype.reverse),
  stringReverse,
)

const isa = (type, action) => {
  return (obj) => {
    if (type === obj.type) return action(obj)
    return undefined
  }
}

const countBy = (fn, arr) => {
  return reduce((o, item) => {
    return {
      ...(o ?? {}),
      [fn(item)]: (o[fn(item)] ?? 0) + 1,
    }
  }, {}, arr)
}

var plays = [{ artist: 'Burial', track: 'Archangel' },
  { artist: 'Ben Frost', track: 'Stomp' },
  { artist: 'Ben Frost', track: 'Stomp' },
  { artist: 'Burial', track: 'Archangel' },
  { artist: 'Emeralds', track: 'Snores' },
  { artist: 'Burial', track: 'Archangel' }]

const songToString = song => [song.artist, song.track].join(' - ')

const songCount = curry2(countBy)(songToString)

const toHex = n => n.toString(16).length < 2
  ? ['0', n.toString(16)].join('')
  : n.toString(16)

const rgbToHexString = (r, g, b) =>
  ['#', toHex(r), toHex(g), toHex(b)].join('')

const blueGreenish = curry3(rgbToHexString)(255)(200)

const greaterThan = curry2((a, b) => a > b)
const lesserThan = curry2((a, b) => a < b)

const withinRange = checker(
  validator('Must be greater than 10', greaterThan(10)),
  validator('Must be less than 20', lesserThan(20)),
)

const div = (a, b) => a / b

const over10Part1 = partial1(div, 10)

const div10By2 = partial2(div, 10, 2)

const over10Part = partial(div, 10)

const concat = (arr1, arr2) => [...arr1, ...arr2]

const mapcat = (fn, target) =>
  reduce(
    (acc, f) => concat(acc, fn(f)),
    [],
    target,
  )

const isEmpty = arr => arr.length === 0

const condition1 = (...validators) =>
  (fn, arg) => {
    const e = mapcat(
      isValid => isValid(arg) ? [] : [isValid.message],
      validators,
    )
    if (!isEmpty(e)) {
      throw new Error(e.join(', '))
    }
    return fn(arg)
  }

const complement = f => x => !f(x)

const zero = v => v === 0

const isNumber = v => typeof v === 'number'

const sqrPre = condition1(
  validator('Must not be zero', complement(zero)),
  validator('Must be less than 20', isNumber),
)

const unCheckedSqr = n => n * n

const checkedSqr = partial1(sqrPre, unCheckedSqr)

const isEven = n => n % 2 === 0

const sillySquare = partial1(
  condition1(validator('Must be even', isEven)),
  checkedSqr,
)

const isObject = o =>
  Object.prototype.toString.call(o) === '[object Object]'

const hasKey = (...args) => obj => Object.keys(obj).includes(...args)

const validateCommand = condition1(
  validator('Must be an map', isObject),
  validator('Must have the correct keys', hasKey('type', 'msg')),
)

const createCommand = partial(validateCommand, identity)

const createLaunchCommand = partial1(
  condition1(
    validator('Must have the count down', hasKey('countDown')),
  ),
  createCommand,
)

const not = x => !x

const isntString = compose(not, isString)

const sqrPost = condition1(
  validator('Must be a number', isNumber),
  validator('Must not be a zero', complement(zero)),
  validator('Must be positive', greaterThan(0)),
)

const megaCheckedSqr = compose(
  partial(sqrPost, identity),
  checkedSqr,
)

// ch6
const slice = (start, arr) => arr.slice(start)

const myLength = arr => isEmpty(arr)
  ? 0
  : myLength(slice(1, arr)) + 1

const toArray = v => Array.from(
  Array.isArray(v)
    ? v
    : [v],
)

const cat = (arr1, arr2) => [...arr1, ...arr2]

const construct = (head, tail) => cat([head], toArray(tail))

const first = arr => arr[0]
const second = arr => arr[1]
const rest = arr => arr.slice(1)

const zip = (a1, a2) =>
  (function _zip(
    arr1,
    arr2,
    result = [],
    len = Math.min(a1.length, a2.length),
  ) {
    return len === 0
      ? result
      : _zip(
        rest(arr1),
        rest(arr2),
        cat(result, [construct(arr1[0], arr2[0])]),
        len - 1,
      )
  })(a1, a2)

// {
//   const result = []
//   for (let i = 0; i < Math.min(a1.length, a2.length); i += 1) {
//     result.push([a1[i], a2[i]])
//   }
//   return result
// }

const constructPair = (pair, rests) =>
  [
    construct(first(pair), first(rests)),
    construct(second(pair), second(rests)),
  ]

const unzip = pairs =>
  isEmpty(pairs)
    ? [[], []]
    : constructPair(
      first(pairs),
      unzip(
        rest(pairs),
      ),
    )

const pairs = zip([1, 2, 3], [4, 5, 6])

console.log(
  unzip(
    pairs,
  ),
)
