/**
 * 
 *@file 静态路由
 *  
 */
import Layout from '@/layout'
export default [{
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [{
            path: '/redirect/:path*',
            component: () =>
                import ('@/views/redirect/index')
        }]
    }, {
        path: '/login',
        component: () =>
            import ('@/views/login/signin'),
        hidden: true
    },
    {
        path: '/login-task',
        component: () =>
            import ('@/views/myTask/loginMyTask'),
        hidden: true
    },
    {
        path: '/mytaskplug',
        component: () =>
            import ('@/views/myTask/myTaskPlug'),
        hidden: true
    },
    {
        path: '/forgot',
        component: () =>
            import ('@/views/login/passwordReset'),
    },
    {
        path: '/signup',
        component: () =>
            import ('@/views/login/signup'),
    },
    {
        path: '/alarmManagement',
        component: Layout,
        redirect: 'noRedirect',
        meta: {
            title: '项目',
            icon: 'tree-table',
        },
        hidden: true,
        children: [{
            path: 'alarmDetail/:id',
            name: 'alarmDetail',
            component: () =>
                import ('@/views/alarmManagement/alarmDetail'),
            meta: {
                title: '告警详情',
                icon: 'tree',
            }
        },{
            path: 'deviceAlarm/:name',
            name: 'deviceAlarm',
            component: () =>
                import ('@/views/alarmManagement/deviceAlarm'),
            meta: {
                title: '设备告警',
                icon: 'tree',
            }
        }
    ]
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
            path: 'well-detail/:id',
            name: 'well-detail',
            component: () =>
                import ('@/views/projects/well-detail'),
            meta: {
                title: '油井详情',
                icon: 'tree',
            }
        }]
    },
    {
        path: '/basicInformation',
        component: Layout,
        redirect: 'noRedirect',
        meta: {
          title: '基础信息',
          icon: 'tree-basicInformation',
        },
        hidden: true,
        children: [{
            path: 'new-built/:id',
            name: 'alter-built',
            component: () =>
                import ('@/views/basicInformation/new-built'),
            meta: {
                title: '新建',
                icon: 'wellList',
                // roles: 'manage_well'
            }
        },
       
      ]
      },
    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    }
]