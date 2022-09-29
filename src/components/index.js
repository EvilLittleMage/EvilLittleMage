// 注册全局组件方式1-简单模式
/*
import Vue from 'vue'
import PageTool from './PageTool/index.vue'
Vue.component('PageTool', PageTool)
*/

// 注册全局组件方式2-以插件方式
import PageTool from './PageTool/index.vue'
import UploadExcel from './UploadExcel/index.vue'
import UploadImage from './UploadImage/index.vue'

export default {
  install(Vue) {
    Vue.component('PageTool', PageTool)
    Vue.component('PageTools', PageTool)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('UploadImage', UploadImage)
  }
}
