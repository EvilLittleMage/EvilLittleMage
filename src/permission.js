import router from '@/router/index.js'
import store from '@/store/index.js'
// 对路由跳转做拦截
// 前置路由守卫-在页面跳转前做拦截
router.beforeEach(async(to, from, next) => {
  // to:去哪里的路由信息
  // from:从哪里来的路由信息
  // next方法: 控制能跳转
  // console.log(to, from, next)
  // 如果没有登录,跳转到登录页面,如果登录了,允许跳转(如果要去的是登录页面,即使没有登录,也可以,不要从登录要求又跳转到登录页面)
  //  注意,在.vue文件当中,可以通过this.$store.state.user,访问数据,但是在js文件不可以通过this,this不是指向组件
  // 白名单路径,允许直接访问
  // if (to.path === '/login' || to.path === '/learnVuex' || to.path === '/404') {
  if (['/login', '/learnVuex', '/404'].includes(to.path)) {
    return next()
  }

  if (store.state.user.token) {
    // 允许页面跳转
    // 获取用户信息如果为空
    // 获取用户菜单标识,方式2-从返回值
    if (!store.state.user.userInfo.userId) {
      /* 菜单权限-简单写法(不用vuex)  */
      /*
      const { roles: { menus }} = await store.dispatch('user/getUserInfo')
      // 获取用户菜单标识,方式1-从vuex取
      // const { roles: { menus }} = store.state.user.userInfo
      console.log(menus)
      // 过滤动态路由
      const filterRoutes = asyncRoutes.filter(t => menus.some(m => m.includes(t.children[0].name)))
      // 添加路由到路由配置当中
      // 注意:addRoutes不会初始配置
      router.addRoutes([
        ...filterRoutes,
        { path: '*', redirect: '/404', hidden: true }
      ])
      // 解决菜单显示不正常的问题
      router.options.routes = [...constantRoutes, ...filterRoutes]
      // 解决刷新404/白屏的问题
      // (1)把404放到路由最后面
      // (2)重新跳转一次
      next(to.path)
      */
      /* 菜单权限-标准写法(用vuex)  */
      const { roles: { menus }} = await store.dispatch('user/getUserInfo')
      const filterRoutes = await store.dispatch('permission/filterRoutes', menus)
      router.addRoutes([
        ...filterRoutes,
        { path: '*', redirect: '/404', hidden: true }
      ])
      next(to.path)
    }
    next()
  } else {
    // 跳转到登录页面
    next('/login')
  }
})
// 后置路由守卫-在页面跳转后做拦截
router.afterEach((to, from) => {

})
