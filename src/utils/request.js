import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store/index.js'
import router from '@/router/index.js'
const request = axios.create({
  // 完整地址
  // baseURL: 'http://ihrm-java.itheima.net/api'
  // 拦截的地址,相对于当前服务器的地址
  baseURL: '/api'
})
// 对的请求做拦截,统一传token
// 通过代码片段,airu
request.interceptors.request.use(config => {
// Do something before request is sent
  if (store.state.user.token) {
    // 注意,'Bearer '单词和有个空格
    config.headers.Authorization = 'Bearer ' + store.state.user.token
  }
  return config
}, error => {
// Do something with request error
  return Promise.reject(error)
})

// 对返回的数据做拦截,每一次返回回来的数据我们都要做处理处理
// 错误处理方式2-在axios当中响应拦截器里面做操作
// 拦截器写法1-通过,axios官网http://www.axios-js.com/zh-cn/docs/
// 拦截器写法2-通过代码片段,安装扩展Axios Snippets(推荐)
// 通过airu
// **注意**选择response,对然后数据做统一处理,不要选request,它是对请求的数据做处理
//     我们要对request对象做处理,而不是对axios做
request.interceptors.response.use(response => {
  // 成功的处理(状态码为2xxx)
// Do something before response is sent
  // console.log('成功', response)
  const { data: { success, data, message }} = response
  // 判断请求是否成功
  if (success) {
    // 返回数据
    return data
  } else {
    Message.error(message)
    throw new Error(message)
    // return undefined
  }
  // return response
}, error => {
// Do something with response error
  // console.log('失败', error)
  // 通过console.dir查看错误的结构
  // console.dir(error)
  if (error.response && error.response.status === 401) {
    // 退出
    store.dispatch('user/logout')
    // 跳转登录页面
    return router.push('/login')
  }
  // 失败的处理(状态码为4xx,状态码为5xx)
  Message.error('服务器异常,请稍后重试')
  return Promise.reject(error)
})
export default request
