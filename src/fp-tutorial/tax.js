import { curry } from 'ramda'
import { Either } from 'ramda-fantasy'

let tShirt = { name: 't-shirt', price: 11 }
let pant = { name: 'pant', price: '10 美元' }
let chips = { name: 'chips', price: 5 } // 小于 10 美元错误

// Imperative
const tax = (tax, price) => {
  if (!isNumber(price)) {
    return new Error('price must be number')
  }
  return price + (tax * price)
}

const discount = (dis, price) => {
  if (!isNumber(price)) {
    return new Error('price must be number')
  }
  if (price < 10) {
    return new Error('price lower than 10 does not have discount')
  }
  return price - (dis * price)
}

const isError = e => e && e.name == 'Error'
const isNumber = n => typeof n === 'number' && !Number.isNaN(n)

const getItemPrice = item => item.price

const showTotalPriceImperative = (item, taxPerc, dis) => {
  let price = getItemPrice(item)
  let result = tax(taxPerc, price)
  if (isError(result)) {
    return console.error(result) // result
  }
  result = discount(dis, result)
  if (isError(result)) {
    return console.error(result)
  }
  return console.log(`total price: ${result}`) // result
}

showTotalPriceImperative(tShirt, 0.1, 0.25) // 总价为: 9.075
showTotalPriceImperative(pant, 0.1, 0.25) // 错误: 价格必须是数值
showTotalPriceImperative(chips, 0.1, 0.25) // 错误: 价格低于 10 美元 的商品不打折

// Declarative
const Left = Either.Left
const Right = Either.Right

const taxD = curry((tax, price) => {
  if (!isNumber(price)) return Left(new Error('price must be number'))
  return Right(price + (tax * price))
})

const discountD = (curry((dis, price) => {
  if (!isNumber(price)) return Left(new Error('price must be number'))
  if (price < 10) return Left(new Error('price lower than 10 does not have discount'))
  return Right(price - (dis * price))
}))

const addCaliTax = taxD(0.1)
const apply25PercDisc = discountD(0.25)

const getItemPriceD = item => Right(item.price)
const displayTotal = total => console.log(`total priceD: ${total}`)
const logError = error => console.error(error)
const eitherLogOrShow = Either.either(logError, displayTotal)

const showTotalPriceD = item =>
  eitherLogOrShow(
    getItemPriceD(item)
      .chain(apply25PercDisc)
      .chain(addCaliTax),
  )

showTotalPriceD(tShirt) // 总价为: 9.075
showTotalPriceD(pant) // 错误: 价格必须是数值
showTotalPriceD(chips) // 错误: 价格低于 10 美元 的商品不打折
