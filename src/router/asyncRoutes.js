/* eslint-disable no-sparse-arrays */
/**
 *
 * @file 动态路由
 *
 */
import Layout from '@/layout';
export default function asyncRoutes(params) {
    return [{
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
            children: [{
                path: 'homePage',
                name: 'homePage',
                component: () =>
                    import ('@/views/homePage'),
                meta: {
                    title: '首页概况',
                    icon: 'home'
                }
            }]
        },
        {
            path: '/realdata',
            component: Layout,
            // redirect: {
            //   name: 'home-page'
            // },
            redirect: 'noRedirect',
            alwaysShow: true,
            meta: {
                title: '实时数据',
                icon: 'gailan'
            },
            children: [{
                path: 'realdata',
                name: 'realdata',
                component: () =>
                    import ('@/views/realdata'),
                meta: {
                    title: '实时数据',
                    icon: 'chakan'
                }
            }]
        },
        {
            path: '/comprehensiveQuery',
            component: Layout,
            redirect: 'noRedirect',
            alwaysShow: true,
            meta: {
                title: '综合查询',
                icon: 'comprehensiveQuery'
            },
            children: [{
                path: 'comprehensiveQuery',
                name: 'comprehensiveQuery',
                component: () =>
                    import ('@/views/comprehensiveQuery'),
                meta: {
                    title: '综合查询',
                    icon: 'chakan'
                }
            }]
        },
        {
            path: '/basicInformation',
            component: Layout,
            redirect: 'noRedirect',
            alwaysShow: true,
            meta: {
                title: '基础信息',
                icon: 'basicInformation'
            },
            children: [{
                path: 'wellList',
                name: 'wellList',
                component: () =>
                    import ('@/views/basicInformation/wellList'),
                meta: {
                    title: '油井列表',
                    icon: 'wellList'
                }
            }, ]
        },
        {
            path: '/power',
            component: Layout,
            redirect: 'noRedirect',
            alwaysShow: true,
            meta: {
                title: '能耗管理',
                icon: 'power',
            },
            children: [{
                path: 'power',
                name: 'power',
                component: () =>
                    import ('@/views/power'),
                meta: {
                    title: '能耗概览',
                    icon: 'power',
                },
                // hidden: true
            }]
        },
        {
            path: '/deviceStatus',
            component: Layout,
            redirect: 'noRedirect',
            alwaysShow: true,
            meta: {
                title: '设备管理',
                icon: 'device',
            },
            children: [{
                path: 'deviceStatus',
                name: 'deviceStatus',
                component: () =>
                    import ('@/views/deviceStatus'),
                meta: {
                    title: '设备状态',
                    icon: 'deviceStatus',
                },
                // hidden: true
            }]
        },
        {
            path: '/alarmManagement',
            component: Layout,
            redirect: 'noRedirect',
            alwaysShow: true,
            meta: {
                title: '告警管理',
                icon: 'alarmManagement'
            },
            children: [{
                    path: 'alarmQuery',
                    name: 'alarmQuery',
                    component: () =>
                        import ('@/views/alarmManagement/alarmQuery'),
                    meta: {
                        title: '泵况告警',
                        icon: 'alarmQuery'
                    }
                },
                {
                    path: 'alarmQuery',
                    name: 'alarmQuery',
                    component: () =>
                        import ('@/views/alarmManagement/alarmQuery'),
                    meta: {
                        title: '结蜡告警',
                        icon: 'alarmQuery'
                    }
                },
                {
                    path: 'alarmQuery',
                    name: 'alarmQuery',
                    component: () =>
                        import ('@/views/alarmManagement/alarmQuery'),
                    meta: {
                        title: '生产告警',
                        icon: 'alarmQuery'
                    }
                }, {
                    path: 'alarmQuery',
                    name: 'alarmQuery',
                    component: () =>
                        import ('@/views/alarmManagement/alarmQuery'),
                    meta: {
                        title: '设备告警',
                        icon: 'alarmQuery'
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
            children: [{
                    path: 'extra-work',
                    name: 'extra-work',
                    component: () =>
                        import ('@/views/checking-in/extra-work'),
                    meta: {
                        title: '添加用户',
                        icon: 'group',
                        roles: 'system_auth'
                    }
                },
                {
                    path: 'view-extra-work',
                    name: 'view-extra-work',
                    component: () =>
                        import ('@/views/checking-in/view-extra-work'),
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
                title: '系统设置',
                icon: 'settings',
            },
            children: [{
                    path: 'profession',
                    name: 'profession',
                    component: () =>
                        import ('@/views/admin/userGroup'),
                    meta: {
                        title: '用户',
                        icon: 'group',
                    }
                },
                {
                    path: 'userGroup',
                    name: 'UserGroup',
                    component: () =>
                        import ('@/views/admin/profession'),
                    meta: {
                        title: '部门',
                        icon: 'profession',
                    }
                },
                {
                    path: 'roles',
                    name: 'UserGqqqroup',
                    component: () =>
                        import ('@/views/admin/roles'),
                    meta: {
                        title: '角色管理',
                        icon: 'role',
                    }
                }
            ]
        },
        // {
        //   path: '/admin',
        //   component: Layout,
        //   redirect: 'noRedirect',
        //   meta: {
        //     title: '系统管理',
        //     icon: 'settings',
        //     roles: 'system_auth'
        //   },
        //   children: [
        //     {
        //       path: 'profession',
        //       name: 'profession',
        //       component: () => import('@/views/admin/userGroup'),
        //       meta: {
        //         title: '审计日志',
        //         icon: 'menu',
        //         roles: 'system_auth'
        //       }
        //     },
        //     {
        //       path: 'userGroup',
        //       name: 'UserGroup',
        //       component: () => import('@/views/admin/profession'),
        //       meta: {
        //         title: '指令结论',
        //         icon: 'bangding',
        //         roles: 'system_auth'
        //       }
        //     },
        //     {
        //       path: 'roles',
        //       name: 'UserGqqqroup',
        //       component: () => import('@/views/admin/roles'),
        //       meta: {
        //         title: '系统设置',
        //         icon: 'settings',
        //         roles: 'manage_role'||'system_auth'
        //       }
        //     }
        //   ]
        // },
        {
            // 404必须在最后面
            path: '*',
            redirect: '/404',
            hidden: true
        }
    ]
}