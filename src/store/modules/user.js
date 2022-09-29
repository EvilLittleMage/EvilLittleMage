import { getEmplyeeBaseInfo, getUserBaseInfo, login } from '@/api/user'
import { getToken, removeToken, setToken } from '@/utils/auth'
import { Message } from 'element-ui'
export default {
  namespaced: true,
  state: {
    token: getToken(),
    userInfo: {}
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    removeToken(state) {
      state.token = null
      removeToken()
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    removeUserInfo(state) {
      state.userInfo = {}
    }
  },
  actions: {
    async login(context, data) {
      // try-catch
      // 1-了解 2-不了解
      /* 请求错误处理方式1-在action当中
      try {
        // 状态码为4xx,前端错误
        // 状态码为5xx,后端错误,例如服务器故障了,数据库故障了...
        // 状态码为200,数据当中success来代表错误
        // : {},对象,层层解构,获取对象里面东西
        // : token,变量名,改名称,把获取之后改个变量名
        const { data: { success, data: token, message }} = await login(data)
        // 判断请求是否成功
        if (success) {
          context.commit('setToken', token)
        } else {
          // 在js当中没有办法通过this.$xxx来获取组件的东西
          // 提示错误
          Message.error(message)
        }
      } catch (error) {
        // 处理状态码不为200的错误
        Message.error('服务出错请稍后重试')
      }
      */
      const token = await login(data)
      context.commit('setToken', token)
    },
    logout(context) {
      context.commit('removeToken')
      context.commit('removeUserInfo')
    },
    async getUserInfo(context) {
      const u = await getUserBaseInfo()
      const e = await getEmplyeeBaseInfo(u.userId)
      const o = { ...u, ...e }
      // o.staffPhoto = 'http://q6cu3t6jv.bkt.clouddn.com/1063705989926227968?t=1582797590950'
      o.staffPhoto = null
      context.commit('setUserInfo', o)
      return o
    }
  }
}
