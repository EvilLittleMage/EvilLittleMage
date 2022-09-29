import Layout from '@/layout'
export default {
  path: '/employees',
  component: Layout,
  children: [{
    // 默认路径,访问父路由/employees直接方法这个子路由
    path: '',
    name: 'employees',
    component: () => import('@/views/employees/index.vue'),
    meta: { title: '员工', icon: 'people' }
  }, {
    // path: '/xxx'相对于根路径(协议,域名,端口号)
    // path: 'xxx'相对于父路径
    path: 'detail/:id', // 路由动态传参
    component: () => import('@/views/employees/detail.vue'),
    hidden: true,
    props: true // 通过父子组件传参方式
  },
  {
    path: 'print/:id', // 路由动态传参
    component: () => import('@/views/employees/print.vue'),
    hidden: true,
    props: true // 通过父子组件传参方式
  }]
}
