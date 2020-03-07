/**
 * 
 *@file 静态路由
 *  
 */
import Layout from '@/layout'
export default [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path*',
      component: () =>
        import('@/views/redirect/index')
    }]
  }, {
    path: '/login',
    component: () =>
      import('@/views/login/signin'),
    hidden: true
  },
  {
    path: '/login-task',
    component: () =>
      import('@/views/myTask/loginMyTask'),
    hidden: true
  },
  {
    path: '/mytaskplug',
    component: () =>
      import('@/views/myTask/myTaskPlug'),
    hidden: true
  },
  {
    path: '/forgot',
    component: () =>
      import('@/views/login/passwordReset'),
  },
  {
    path: '/signup',
    component: () =>
      import('@/views/login/signup'),
  },
  {
    path: '/projects',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '项目',
      icon: 'tree-table',
    },
    hidden: true,
    children: [{
      path: 'project-detail/:id',
      name: 'project-detail',
      component: () =>
        import('@/views/projects/project-detail'),
      meta: {
        title: '项目详情',
        icon: 'tree',
      }
    }]
  },
  {
    path: '/404',
    component: () =>
      import('@/views/404'),
    hidden: true
  }
]
