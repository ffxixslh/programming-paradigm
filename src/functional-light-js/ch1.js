const composeImpl = fns =>
  x => fns.reduceRight((res, fn) => fn(res), x)

const filterReducerImpl = filter => reducer => (acc, current) =>
  filter(current) ? reducer(acc, current) : acc

const pipeImpl = fns => x => fns.reduce((res, fn) => fn(res), x)

const reduceImpl = (fn, init) => arr => arr.reduce(fn, init)

const lteImpl = limit => x => x <= limit

const gteImpl = limit => x => x >= limit

const FP = {
  compose: composeImpl,
  filterReducer: filterReducerImpl,
  lte: lteImpl,
  gte: gteImpl,
  pipe: pipeImpl,
  reduce: reduceImpl,
}

// var numbers = [4, 10, 0, 27, 42, 17, 15, -6, 58]
// var faves = []
// var magicNumber = 0
//
// pickFavoriteNumbers()
// calculateMagicNumber()
// outputMsg() // The magic number is: 42
//
// ***************
//
// function calculateMagicNumber() {
//   for (let fave of faves) {
//     magicNumber = magicNumber + fave
//   }
// }
//
// function pickFavoriteNumbers() {
//   for (let num of numbers) {
//     if (num >= 10 && num <= 20) {
//       faves.push(num)
//     }
//   }
// }
//
// function outputMsg() {
//   var msg = `The magic number is: ${magicNumber}`
//   console.log(msg)
// }
//

// ---------------
const numbers = [4, 10, 0, 27, 42, 17, 15, -6, 58]

const sum = (x, y) => x + y

const constructMsg = n => `The magic number is: ${n}`

// sumOnlyFavoriteNumbers :: [Number] -> Number
const sumOnlyFavoriteNumbers = FP.compose([
  FP.filterReducer(FP.gte(10)),
  FP.filterReducer(FP.lte(20)),
])(sum)

// printMagicNumber :: [Number] -> Void
const printMagicNumber = FP.pipe([
  FP.reduce(sumOnlyFavoriteNumbers, 0),
  constructMsg,
  console.log,
])

printMagicNumber(numbers)
