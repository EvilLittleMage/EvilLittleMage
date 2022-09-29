import Vue from 'vue'
Vue.directive('imgerror', {
  // 元素放到页面上类似于组件mouted
  inserted(el, binding) {
    if (!el.src) {
      el.src = binding.value
    }
    el.onerror = function() {
      this.src = binding.value
    }
  },
  // 当模板发生改变,触发这个方法
  update(el, binding) {
    console.log('update', el.src)
    if (!el.src) {
      el.src = binding.value
    }
  }
})
