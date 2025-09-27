import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN.js'
import enUS from './en-US.js'

const messages = {
  'zh-CN': zhCN,
  'en-US': enUS
}

// 获取浏览器语言设置
function getDefaultLocale() {
  const browserLang = navigator.language || navigator.userLanguage
  
  // 支持的语言列表
  const supportedLocales = ['zh-CN', 'en-US']
  
  // 检查浏览器语言是否在支持列表中
  if (supportedLocales.includes(browserLang)) {
    return browserLang
  }
  
  // 检查语言前缀匹配
  const langPrefix = browserLang.split('-')[0]
  const matchedLocale = supportedLocales.find(locale => locale.startsWith(langPrefix))
  
  if (matchedLocale) {
    return matchedLocale
  }
  
  // 默认返回中文
  return 'zh-CN'
}

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || getDefaultLocale(),
  fallbackLocale: 'zh-CN',
  messages
})

export default i18n

export const supportedLanguages = [
  { code: 'zh-CN', name: zhCN.language.chinese },
  { code: 'en-US', name: enUS.language.english}
]