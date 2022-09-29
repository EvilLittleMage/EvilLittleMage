import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// 路由种类-静态路由,所用人都有页面
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/learnVuex',
    component: () => import('@/views/learnVuex/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/import',
    component: Layout,
    hidden: true,
    children: [{
      path: '',
      component: () => import('@/views/import/index')
    }]
  },
  // 首页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }
  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]
// 路由种类-动态路由,每个菜单不一样的,需要权限控制(在课程第13天)
import employees from './modules/employees.js'
import approvals from './modules/approvals.js'
import attendances from './modules/attendances.js'
import departments from './modules/departments.js'
import permission from './modules/permission.js'
import salarys from './modules/salarys.js'
import setting from './modules/setting.js'
import social from './modules/social.js'
export const asyncRoutes = [
  employees,
  approvals,
  attendances,
  departments,
  permission,
  salarys,
  setting,
  social
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  // routes: [...constantRoutes, ...asyncRoutes]
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
