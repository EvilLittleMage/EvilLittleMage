import request from '@/utils/request'
import store from '@/store/index.js'

export function login(data) {
  return request({
    method: 'POST',
    url: '/sys/login',
    // 模拟服务器状态不为200的错误
    // url: '/sys/login1111',
    data
  })
}
// 获取用户基本资料
export function getUserBaseInfo() {
  return request({
    // 注意:method,写成post,POST,不要写成Post有部分大写, 'post '前后有空格
    method: 'post',
    // 注意:url前后不能有空格,例如'/sys/profile '
    url: '/sys/profile'
    // 传token方式1-在接口单独传token
    /*
    headers: {
      Authorization: store.state.user.token
    }
    */
  })
}
// 获取员工基本信息
export function getEmplyeeBaseInfo(id) {
  return request({
    method: 'get',
    // 注意,这里在路径上面传id,最后要有/,不要写成'/sys/user'+id
    url: '/sys/user/' + id
  })
}

export const getUserDetailById = getEmplyeeBaseInfo
