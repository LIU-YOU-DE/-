import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    perms: ['GET /aaa','POST /bbb']     will control the page perms (you can set multiple perms)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // --------------------------------————————————————————————————
  {
    path: '/test',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'sysManage',
    meta: {
      title: '用户专区',
      icon: 'chart'
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/test/user'),
        name: 'user',
        meta: {
          perms: ['GET /admin',],
          title: '用户信息',
          noCache: true
        }
      },
      {
        path: 'userlook',
        component: () => import('@/views/test/userlook'),
        name: 'userlook',
        meta: {
          perms: ['GET /members', 'GET /members/{memberId}'],
          title: '用户详情',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'useredit',
        component: () => import('@/views/test/useredit'),
        name: 'useredit',
        meta: {
          perms: ['GET /members', 'GET /members/{memberId}'],
          title: '编辑资料',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'userip',
        component: () => import('@/views/test/userip'),
        name: 'userip',
        meta: {
          perms: ['GET /members', 'GET /members/{memberId}'],
          title: '登录日志',
          noCache: true
        },
        hidden: true
      },
    ]
  },
  {
    path: '/test-goods',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'sysManage',
    meta: {
      title: '订单专区',
      icon: 'chart'
    },
    children:[
      {
        path: 'test-orderlook1',
        component: () => import('@/views/test-goods/test-orderlook1'),
        name: 'test-orderlook1',
        meta: {
          perms: ['GET /banners'],
          title: '订单编辑',
          noCache: true
        },
        hidden:true
      },
      {
        path: 'test-orderlook2',
        component: () => import('@/views/test-goods/test-orderlook2'),
        name: 'test-orderlook2',
        meta: {
          perms: ['GET /banners'],
          title: '订单编辑',
          noCache: true
        },
        hidden:true
      },
      {
        path: 'test-orderlook2-2',
        component: () => import('@/views/test-goods/test-orderlook2-2'),
        name: 'test-orderlook2-2',
        meta: {
          perms: ['GET /banners'],
          title: '订单编辑',
          noCache: true
        },
        hidden:true
      },
      {
        path: 'test-orderlook3',
        component: () => import('@/views/test-goods/test-orderlook3'),
        name: 'test-orderlook3',
        meta: {
          perms: ['GET /banners'],
          title: '订单编辑',
          noCache: true
        },
        hidden:true
      },
      {
        path: 'test-orderlook4',
        component: () => import('@/views/test-goods/test-orderlook4'),
        name: 'test-orderlook4',
        meta: {
          perms: ['GET /banners'],
          title: '订单编辑',
          noCache: true
        },
        hidden:true
      },
      {
        path: 'test-orders',
        component: () => import('@/views/test-goods/test-orders'),
        name: 'test-orders',
        meta: {
          perms: ['GET /banners'],
          title: '订单管理',
          noCache: true
        }
      },
      {
        path: 'test-logistics',
        component: () => import('@/views/test-goods/test-logistics'),
        name: 'test-logistics',
        meta: {
          perms: ['GET /banners'],
          title: '发货列表',
          noCache: true
        },
        hidden:true
      },
      {
        path: 'test-orderLogistics',
        component: () => import('@/views/test-goods/test-orderLogistics'),
        name: 'test-orderLogistics',
        meta: {
          perms: ['GET /banners'],
          title: '订单跟踪',
          noCache: true
        },
        hidden:true
      },
    ]
  },
  {
    path: '/test-marketing',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'sysManage',
    meta: {
      title: '运营专区',
      icon: 'chart'
    },
    children: [
      {
        path: 'test-lunbotu',
        component: () => import('@/views/test-marketing/test-lunbotu'),
        name: 'test-lunbotu',
        meta: {
          perms: ['GET /banners'],
          title: '轮播图广告位设置',
          noCache: true
        }
      },
      {
        path: 'test-giftfenlei',
        component: () => import('@/views/test-marketing/test-giftfenlei'),
        name: 'test-giftfenlei',
        meta: {
          perms: ['GET /banners'],
          title: '礼品分类设置',
          noCache: true
        }
      },
      {
        path: 'test-prize',
        component: () => import('@/views/test-marketing/test-prize'),
        name: 'test-prize',
        meta: {
          perms: ['GET /banners'],
          title: '礼品信息导入',
          noCache: true
        }
      },
      {
        path: 'test-brand',
        component: () => import('@/views/test-marketing/test-brand'),
        name: 'test-brand',
        meta: {
          perms: ['GET /admin',],
          title: '汽车品牌管理',
          noCache: true
        }
      },
      {
        path: 'test-merchant',
        component: () => import('@/views/test-marketing/test-merchant'),
        name: 'test-merchant',
        meta: {
          perms: ['GET /admin',],
          title: '汽车门店信息',
          noCache: true
        }
      },
      {
        path: 'test-merchantEdit',
        component: () => import('@/views/test-marketing/test-merchantEdit'),
        name: 'test-merchantEdit',
        meta: {
          perms: ['GET /admin',],
          title: '汽车门店编辑',
          noCache: true
        },
        hidden:true
      },
      {
        path: 'test-merchantAdd',
        component: () => import('@/views/test-marketing/test-merchantAdd'),
        name: 'test-merchantAdd',
        meta: {
          perms: ['GET /admin',],
          title: '添加汽车门店',
          noCache: true
        },
        hidden:true
      },
      {
        path: 'test-list',
        component: () => import('@/views/test-marketing/test-list'),
        name: 'test-list',
        meta: {
          perms: ['GET /admin',],
          title: '车辆信息管理',
          noCache: true
        }
      },
      {
        path: 'test-create',
        component: () => import('@/views/test-marketing/test-create'),
        name: 'test-create',
        meta: {
          perms: ['GET /admin',],
          title: '新增车辆',
          noCache: true
        },
        hidden:true
      },
      {
        path: 'test-edit',
        component: () => import('@/views/test-marketing/test-edit'),
        name: 'test-edit',
        meta: {
          perms: ['GET /admin',],
          title: '编辑车辆信息',
          noCache: true
        },
        hidden:true
      },
      {
        path: 'test-activity',
        component: () => import('@/views/test-marketing/test-activity'),
        name: 'test-activity',
        meta: {
          perms: ['GET /admin',],
          title: '活动管理',
          noCache: true
        }
      },
      {
        path: 'test-activityadd',
        component: () => import('@/views/test-marketing/test-activityadd'),
        name: 'test-activityadd',
        meta: {
          perms: ['GET /admin',],
          title: '添加活动',
          noCache: true
        },
        hidden:true
      },
      {
        path: 'test-activityedit',
        component: () => import('@/views/test-marketing/test-activityedit'),
        name: 'test-activityedit',
        meta: {
          perms: ['GET /admin',],
          title: '编辑活动',
          noCache: true
        },
        hidden:true
      },
      {
        path: 'test-showactivity',
        component: () => import('@/views/test-marketing/test-showactivity'),
        name: 'test-showactivity',
        meta: {
          perms: ['GET /admin',],
          title: '活动详情',
          noCache: true
        },
        hidden:true
      },
      {
        path: 'test-youhuiquan',
        component: () => import('@/views/test-marketing/test-youhuiquan'),
        name: 'test-youhuiquan',
        meta: {
          perms: ['GET /admin',],
          title: '优惠券管理',
          noCache: true
        }
      },
      {
        path: 'test-youhuiquanadd',
        component: () => import('@/views/test-marketing/test-youhuiquanadd'),
        name: 'test-youhuiquanadd',
        meta: {
          perms: ['GET /admin',],
          title: '添加优惠券',
          noCache: true
        },
        hidden:true
      },
      {
        path: 'test-youhuiquanedit',
        component: () => import('@/views/test-marketing/test-youhuiquanedit'),
        name: 'test-youhuiquanedit',
        meta: {
          perms: ['GET /admin',],
          title: '编辑优惠券',
          noCache: true
        },
         hidden:true
      },
      {
        path: 'test-gift',
        component: () => import('@/views/test-marketing/test-gift'),
        name: 'test-gift',
        meta: {
          perms: ['GET /admin',],
          title: '奖品管理',
          noCache: true
        },
      },
      {
        path: 'test-prizeroc',
        component: () => import('@/views/test-marketing/test-prizeroc'),
        name: 'test-prizeroc',
        meta: {
          perms: ['GET /admin',],
          title: '用户中奖记录',
          noCache: true
        },
      },
      {
        path: 'test-issue',
        component: () => import('@/views/test-marketing/test-issue'),
        name: 'test-issue',
        meta: {
          perms: ['GET /admin',],
          title: '问答设置',
          noCache: true
        },
      },
      {
        path: 'test-prizeadd',
        component: () => import('@/views/test-marketing/test-prizeadd'),
        name: 'test-prizeadd',
        meta: {
          perms: ['GET /banners'],
          title: '添加礼品',
          noCache: true
        },
        hidden:true
      },
      {
        path: 'prizeedit',
        component: () => import('@/views/test-marketing/prizeedit'),
        name: 'test-prizeedit',
        meta: {
          perms: ['GET /banners'],
          title: '编辑礼品',
          noCache: true
        },
        hidden:true
      },
    ]
  },
  {
    path: '/test-admin',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'sysManage',
    meta: {
      title: '系统管理',
      icon: 'chart'
    },
    children:[
      {
        path: 'test-sys',
        component: () => import('@/views/test-admin/test-sys'),
        name: 'user',
        meta: {
          perms: ['GET /admin',],
          title: '管理员',
          noCache: true
        }
      },
      {
        path: 'test-rols',
        component: () => import('@/views/test-admin/test-rols'),
        name: 'test-rols',
        meta: {
          perms: ['GET /storage/list'],
          title: '角色管理',
          noCache: true
        }
      },
    ]
  },
  {
    path: '/test-sys',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'sysManage',
    meta: {
      title: '系统设置',
      icon: 'chart'
    },
    children: [
      {
        path: 'test-os',
        component: () => import('@/views/test-admin/test-os'),
        name: 'test-os',
        meta: {
          perms: ['GET /storage/list'],
          title: '对象存储',
          noCache: true
        }
      },
      {
        path: 'test-rules',
        component: () => import('@/views/test-sys/test-rules'),
        name: 'test-rules',
        meta: {
          perms: ['GET /storage/list'],
          title: '基本设置',
          noCache: true
        }
      },
      {
        path: 'test-cartype',
        component: () => import('@/views/test-sys/test-cartype'),
        name: 'test-cartype',
        meta: {
          perms: ['GET /storage/list'],
          title: '车型设置',
          noCache: true
        }
      },
      {
        path: 'test-notices',
        component: () => import('@/views/test-sys/test-notices'),
        name: 'test-notices',
        meta: {
          perms: ['GET /storage/list'],
          title: '消息通知',
          noCache: true
        }
      },
      {
        path: 'test-region',
        component: () => import('@/views/test-sys/test-region'),
        name: 'test-region',
        meta: {
          perms: ['GET /storage/list'],
          title: '区域设置',
          noCache: true
        }
      },
      {
        path: 'test-rulesedit',
        component: () => import('@/views/test-sys/test-rulesedit'),
        name: 'test-rulesedit',
        meta: {
          perms: ['GET /storage/list'],
          title: '编辑规则',
          noCache: true
        },
        hidden:true
      },
      {
        path: 'test-rulesadd',
        component: () => import('@/views/test-sys/test-rulesadd'),
        name: 'test-rulesadd',
        meta: {
          perms: ['GET /storage/list'],
          title: '新增规则',
          noCache: true
        },
        hidden:true
      },
    ]
  },

  // ------——————————————————————————————————————————--------------------------------------------------------——————————


  {
    path: '/profile',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    children: [
      {
        path: 'password',
        component: () => import('@/views/profile/password'),
        name: 'password',
        meta: { title: '修改密码', noCache: true }
      }
    ],
    hidden: true
  },

  { path: '*', redirect: '/404', hidden: true },

  
  
]


