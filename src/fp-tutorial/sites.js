import { Maybe } from 'ramda-fantasy'
import { curry, path } from 'ramda'

// User 对象
const joeUser = {
  name: 'joe',
  email: 'joe@example.com',
  prefs: {
    languages: {
      primary: 'sp',
      secondary: 'en',
    },
  },
}
// 全局的 indexURLs，映射不同的语言
const indexURLs = {
  en: 'http://mysite.com/en', // English
  sp: 'http://mysite.com/sp', // Spanish
  jp: 'http://mysite.com/jp', // Japanese
}

// 应用 url 到 window.location
const showIndexPage = (url) => {
  const div = document.createElement('div')
  div.innerHTML = `<h1>${url}</h1>`
  const app = document.querySelector('#app')
  app.appendChild(div)
}

// TODO 分别用命令式、函数式风格写
/* const getUrlForUser = (user) => {
 *   // TODO
 * }
 */

const getUrlForUserImperative = (user) => {
  if (user == null) {
    return indexURLs['en']
  }
  if (user.prefs.languages.primary && user.prefs.languages.primary != undefined) {
    if (indexURLs[user.prefs.languages.primary]) {
      return indexURLs[user.prefs.languages.primary]
    }
    else {
      return indexURLs['en']
    }
  }
}

showIndexPage(getUrlForUserImperative(joeUser))

const getUrlForUserDeclarative = (user) => {
  return Maybe(user)
    .map(path(['prefs', 'languages', 'primary']))
    .chain(maybeGetUrl)
}

const maybeGetUrl = curry((allUrls, lang) => {
  return Maybe(allUrls[lang])
})(indexURLs)

function boot(user, defaultUrl) {
  showIndexPage(getUrlForUserDeclarative(user).getOrElse(defaultUrl))
}

boot(joeUser, indexURLs['en'])
