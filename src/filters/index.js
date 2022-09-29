// import Vue from 'vue'
// import moment from 'moment'
// export const formatdate = (val) => {
//   return moment(val).format('YYYY-MM-DD')
// }
// Vue.filter('formatdate', formatdate)

// import moment from 'moment'
// export const formatdate = (val) => {
//   return moment(val).format('YYYY-MM-DD')
// }
// export const formatDate = formatdate
// // 只要一个参数可以省略(),如果只要一句话可以省略{}
// import employeesEnum from '@/api/constant/employees.js'
// export const formatHireType = val => {
//   const f = employeesEnum.hireType.find(t => t.id === val)
//   return f ? f.value : '未知'
// }
import moment from 'moment'
export const formatdate = (val, format = 'YYYY-MM-DD') => {
  return moment(val).format(format)
}
export const formDate = formatdate
import employeesEum from '@/api/constant/employees.js'
export const formatHireType = val => {
  const f = employeesEum.hireType.find(t => t.id === val)
  return f ? f.value : '未知'
}
