/* eslint-disable no-sparse-arrays */
/**
 *
 * @file 动态路由
 *
 */
import Layout from '@/layout';
export default function asyncRoutes(params) {
  return [
    {
      path: '/',
      component: Layout,
      redirect: {
        name: 'homePage'
      },
      meta: {
        breadcrumb: false,
        title: '',
        icon: 'gailan'
      },
      children: [
        {
          path: 'homePage',
          name: 'homePage',
          component: () => import('@/views/homePage'),
          meta: {
            title: '首页大屏',
            icon: 'home'
          }
        }
      ]
    },
    {
      path: '/realdata',
      component: Layout,
      redirect: {
        name: 'homePage'
      },
      alwaysShow: true,
      meta: {
        title: '实时数据',
        icon: 'gailan'
      },
      children: [
        {
          path: 'realdata',
          name: 'realdata',
          component: () => import('@/views/realdata'),
          meta: {
            title: '查看',
            icon: 'tree'
          }
        }
      ]
    },
    {
      path: '/comprehensiveQuery',
      component: Layout,
      redirect: 'noRedirect',
      alwaysShow: true,
      meta: {
        title: '综合查询',
        icon: 'gailan'
      },
      children: [
        {
        path: 'comprehensiveQuery',
        name: 'comprehensiveQuery',
        component: () =>import('@/views/comprehensiveQuery'),
        meta: {
          title: '查看',
          icon: 'tree'
        }
      }
      ]
    },
    {
      path: '/mine',
      component: Layout,
      redirect: 'noRedirect',
      meta: {
        title: '基础信息',
        icon: 'task'
      },
      children: [
        {
          path: 'task',
          name: 'my-task',
          component: () => import('@/views/task'),
          meta: {
            title: '添加机井',
            icon: 'task'
          }
        },
        {
          path: 'production',
          name: 'my-production',
          component: () => import('@/views/production'),
          meta: {
            title: '油井列表',
            icon: 'pd'
          }
        },
      ]
    },

    {
      path: '/task',
      component: Layout,
      redirect: 'noRedirect',
      alwaysShow: true,
      meta: {
        title: '工况诊断',
        icon: 'task',
        roles: 'manage_approve'
      },
      children: [
        {
          path: 'approve',
          name: 'approve',
          component: () => import('@/views/video/my-audit'),
          meta: {
            title: '设备状态',
            icon: 'task',
            roles: 'manage_approve'
          },
          // hidden: true
        }
      ]
    },
    {
      path: '/search-kpi',
      component: Layout,
      redirect: 'noRedirect',
      alwaysShow: true,
      meta: {
        title: '统计分析',
        icon: 'statistic-manager'
      },
      children: [
        {
          path: 'search-kpi',
          name: 'search-kpi',
          component: () => import('@/views/search-kpi'),
          meta: {
            title: '综合统计',
            icon: 'statistic-manager'
          }
        }
      ]
    },
    {
      path: '/sharefiles',
      component: Layout,
      redirect: 'noRedirect',
      alwaysShow: true,
      meta: {
        title: '告警管理',
        icon: 'list'
      },
      children: [
        {
          path: 'sharefiles',
          name: 'sharefiles',
          component: () => import('@/views/sharefiles'),
          meta: {
            title: '告警查询',
            icon: 'list'
          }
        }
      ]
    },
    {
      path: '/checking-in',
      component: Layout,
      redirect: 'noRedirect',
      alwaysShow: true,
      meta: {
        title: '用户管理',
        icon: 'kq',
        roles: 'system_auth'
      },
      children: [
        {
          path: 'extra-work',
          name: 'extra-work',
          component: () => import('@/views/checking-in/extra-work'),
          meta: {
            title: '添加用户',
            icon: 'group',
            roles: 'system_auth'
          }
        },
        {
          path: 'view-extra-work',
          name: 'view-extra-work',
          component: () => import('@/views/checking-in/view-extra-work'),
          meta: {
            title: '查看用户',
            icon: 'jbck',
            roles: 'system_auth'
          }
        }
      ]
    },
    {
      path: '/admin',
      component: Layout,
      redirect: 'noRedirect',
      meta: {
        title: '系统管理',
        icon: 'settings',
        roles: 'system_auth'
      },
      children: [
        {
          path: 'profession',
          name: 'profession',
          component: () => import('@/views/admin/userGroup'),
          meta: {
            title: '审计日志',
            icon: 'menu',
            roles: 'system_auth'
          }
        },
        {
          path: 'userGroup',
          name: 'UserGroup',
          component: () => import('@/views/admin/profession'),
          meta: {
            title: '指令结论',
            icon: 'bangding',
            roles: 'system_auth'
          }
        },
        {
          path: 'roles',
          name: 'UserGqqqroup',
          component: () => import('@/views/admin/roles'),
          meta: {
            title: '系统设置',
            icon: 'settings',
            roles: 'manage_role'||'system_auth'
          }
        }
      ]
    },
    {
      // 404必须在最后面
      path: '*',
      redirect: '/404',
      hidden: true
    }
  ]
}
