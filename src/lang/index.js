import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh',
  messages: {
    ja: {
      title: 'これはタイトルです'
    },
    zh: {
      title: '这是一个标题'
    }
  }
})
export default i18n
