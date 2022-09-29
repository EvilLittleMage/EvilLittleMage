import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// eslint-disable-next-line no-unused-vars
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import '@/directives'
// import '@/filters'
// 批量注册过滤器
// {formatdate: fn}
import * as filters from '@/filters'
// 循环对象方式1-通过for in
/*
for (var k in filters) {
  Vue.filter(k, filters[k])
}
*/
// 循环对象方式2-通过Object.keys
// ['formatdate']
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

// import '@/components'
import Ui from '@/components'
Vue.use(Ui)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// 模拟数据,前端模拟后端的接口
/*
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
*/
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

// 在vue全局放方法-方式1-原型链
/*
Vue.prototype.hasPerm = function(key) {
  return this.$store.getters.points.includes(key)
}
*/
// 在vue全局放方法-方式2-混入
import '@/mixins'
import '@/utils/mock.js'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

