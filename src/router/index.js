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
  {
    path: '/user',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'userManage',
    meta: {
      title: '用户管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/user/user'),
        name: 'user',
        meta: {
          perms: ['GET /members'],
          title: '用户管理',
          noCache: true
        }
      },
      {
        path: 'userlook',
        component: () => import('@/views/user/userlook'),
        name: 'userlook',
        meta: {
          perms: ['GET /members', 'GET /members/{memberId}'],
          title: '用户详情',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'address',
        component: () => import('@/views/user/address'),
        name: 'address',
        meta: {
          perms: ['GET /memberAddress'],
          title: '用户收货地址',
          noCache: true
        }
      },
      {
        path: 'listLoginRecord',
        component: () => import('@/views/user/userLoginRecord'),
        path: 'listLoginRecord',
        name: 'listLoginRecord',
        meta: {
          perms: ['GET /loginRecords'],
          title: '用户登录记录',
          noCache: true
        }
      },
      {
        path: 'history',
        component: () => import('@/views/user/history'),
        name: 'history',
        meta: {
          perms: ['GET /pointRecords'],
          title: '用户积分记录',
          noCache: true
        }
      }
      // {
      //   path: 'feedback',
      //   component: () => import('@/views/user/feedback'),
      //   name: 'feedback',
      //   meta: {
      //     perms: ['GET /admin/feedback/list'],
      //     title: '浏览记录',
      //     noCache: true
      //   }
      // }
    ]
  },
  // 商家管理
  // {
  //   path: '/merchant',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   alwaysShow: true,
  //   name: 'merchant',
  //   meta: {
  //     title: '商家管理',
  //     icon: 'chart'
  //   },
  //   children: [
  //     {
  //       path: 'merchant',
  //       component: () => import('@/views/merchant/merchant'),
  //       name: 'merchant',
  //       meta: {
  //         perms: ['GET /merchants'],
  //         title: '商家管理',
  //         noCache: true
  //       }
  //     },
  //     {
  //       path: 'merchantEdit',
  //       component: () => import('@/views/merchant/merchantEdit'),
  //       name: 'merchantEdit',
  //       meta: {
  //         perms: ['GET /merchants', 'PUT /merchant/{id}', 'PUT /merchant/status/{id}'],
  //         title: '修改商家信息',
  //         noCache: true
  //       },
  //       hidden: true
  //     },
  //     {
  //       path: 'merchantAdd',
  //       component: () => import('@/views/merchant/merchantAdd'),
  //       name: 'merchantAdd',
  //       meta: {
  //         perms: ['POST /merchant'],
  //         title: '添加商家',
  //         noCache: true
  //       }
  //     }
  //   ]
  // },
  // 营销
  {
    path: '/marketing',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'marketing',
    meta: {
      title: '营销管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'lunbotu',
        component: () => import('@/views/marketing/lunbotu'),
        name: 'lunbotu',
        meta: {
          perms: ['GET /banners'],
          title: '轮播图管理',
          noCache: true
        }
      },
      {
        path: 'youhuiquan',
        component: () => import('@/views/marketing/youhuiquan'),
        name: 'youhuiquan',
        meta: {
          perms: ['GET /coupons'],
          title: '优惠券管理',
          noCache: true,
          THeader: ['优惠券ID','面值','优惠券价格','优惠券内容','优惠券状态','适用范围','优惠券种类','是否显示','排序','添加时间','更新时间','备注'],
          TDataField: ['id','faceValue','price','next','status','type','kind','statys','sort','createTime','updateTime','remark'],
          TTitle: '优惠券表'
        }
      },
      {
        path: 'youhuiquanedit',
        component: () => import('@/views/marketing/youhuiquanedit'),
        name: 'quanedyouhuiquaneditit',
        meta: {
          perms: ['GET /coupons', 'PUT /coupon/{id}', 'PUT /coupon/status/{id}', 'GET /coupon/{id}'],
          title: '修改优惠券',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'youhuiquanadd',
        component: () => import('@/views/marketing/youhuiquanadd'),
        name: 'youhuiquanadd',
        meta: {
          perms: ['POST /coupon'],
          title: '添加优惠券',
          noCache: true
        },
        hidden:true
      },
      {
        path:'prize',
        component: () => import('@/views/marketing/prize'),
        name: 'prize',
        meta: {
          perms: ['GET /prize'],
          title: '奖品管理',
          noCache: true
        }
      },
      {
        path:'activityadd',
        component: () => import('@/views/marketing/activityadd'),
        name: 'activityadd',
        meta: {
          perms: ['POST /activityadd'],
          title: '添加活动',
          noCache: true
        },
        hidden: true
      },
      {
        path:'activity',
        component: () => import('@/views/marketing/activity'),
        name: 'activity',
        meta: {
          perms: ['GET /activity'],
          title: '活动管理',
          noCache: true
        }
      },
      {
        path:'showactivity',
        component: () => import('@/views/marketing/showactivity'),
        name: 'showactivity',
        meta: {
          perms: ['POST /showactivity'],
          title: '查看活动',
          noCache: true
      },
      hidden: true
    },
      {
        path: 'activityedit',
        component: () => import('@/views/marketing/activityedit'),
        name: 'activityedit',
        meta: {
          perms: ['PUT /activity/{id}'],
          title: '活动编辑',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'prizeroc',
        component: () => import('@/views/marketing/prizeroc'),
        name: 'prizeroc',
        meta: {
          perms: ['PUT //prizeRecord'],
          title: '用户中奖记录',
          noCache: true
        },
      },
    ]
  },
  {
    path: '/gift',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'gift',
    meta: {
      title: '礼品管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'liping',
        component: () => import('@/views/gift/liping'),
        name: 'liping',
        meta: {
          perms: ['POST /gifts'],
          title: '礼品管理',
          noCache: true
        }
      },
      {
        path: 'lipingedit',
        component: () => import('@/views/gift/lipingedit'),
        name: 'lipingedit',
        meta: {
          perms: ['POST /gifts', 'PUT /gift/{id}', 'PUT /gift/status/{id}'],
          title: '礼品编辑',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'lipingadd',
        component: () => import('@/views/gift/lipingadd'),
        name: 'lipingadd',
        meta: {
          perms: ['POST /gift'],
          title: '礼品添加',
          noCache: true
        },
        hidden:true
      },
      {
        path: 'giftorder',
        component: () => import('@/views/gift/giftorder'),
        name: 'giftorder',
        meta: {
          perms: ['GET /giftOrders'],
          title: '礼品订单管理',
          noCache: true
        }
      },
      {
        path: 'giftfenlei',
        component: () => import('@/views/gift/giftfenlei'),
        name: 'giftfenlei',
        meta: {
          perms: ['GET /giftCategorys'],
          title: '礼品分类',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/mall',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'mallManage',
    meta: {
      title: '商场管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'rules',
        component: () => import('@/views/mall/rules'),
        name: 'rules',
        meta: {
          perms: ['GET /rules'],
          title: '活动规则',
          noCache: true
        }
      },
      {
        path: 'rulesedit',
        component: () => import('@/views/mall/rulesedit'),
        name: 'rulesedit',
        meta: {
          perms: [ 'PUT /rule/{id}', 'GET /rule/{id}'],
          title: '修改活动规则',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'notices',
        component: () => import('@/views/mall/notices'),
        name: 'notices',
        meta: {
          perms: ['GET /notices'],
          title: '系统通知',
          noCache: true
        }
      },
      {
        path: 'issue',
        component: () => import('@/views/mall/issue'),
        name: 'issue',
        meta: {
          perms: ['GET /comment'],
          title: '问答管理',
          noCache: true
        }
      },
      {
        path: 'region',
        component: () => import('@/views/mall/region'),
        name: 'region',
        meta: {
          perms: ['GET /regions','GET /regions/short'],
          title: '行政区域',
          noCache: true
        }
      }
    ]
  },

  {
    path: '/goods',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'goodsManage',
    meta: {
      title: '汽车模块管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'merchant',
        component: () => import('@/views/goods/merchant'),
        name: 'merchant',
        meta: {
          perms: ['GET /merchants'],
          title: '商家管理',
          noCache: true
        }
      },
      {
        path: 'merchantEdit',
        component: () => import('@/views/goods/merchantEdit'),
        name: 'merchantEdit',
        meta: {
          perms: ['GET /merchants', 'PUT /merchant/{id}', 'PUT /merchant/status/{id}'],
          title: '修改商家信息',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'merchantAdd',
        component: () => import('@/views/goods/merchantAdd'),
        name: 'merchantAdd',
        meta: {
          perms: ['POST /merchant'],
          title: '添加商家',
          noCache: true
        },
        hidden:true
      },
      {
        path: 'order',
        component: () => import('@/views/goods/order'),
        name: 'order',
        meta: {
          perms: ['GET /orders'],
          title: '订单管理',
          noCache: true
        }
      },
      {
        path: 'orderlook',
        component: () => import('@/views/goods/orderlook'),
        name: 'orderlook',
        meta: {
          perms: ['GET /orders', 'GET /order/{id}'],
          title: '订单详情',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'brand',
        component: () => import('@/views/goods/brand'),
        name: 'brand',
        meta: {
          perms: ['GET /brands'],
          title: '汽车品牌',
          noCache: true
        }
      },
      {
        path: 'list',
        component: () => import('@/views/goods/list'),
        name: 'goodsList',
        meta: {
          perms: ['GET /cars'],
          title: '汽车列表',
          noCache: true
        }
      },
      {
        path: 'create',
        component: () => import('@/views/goods/create'),
        name: 'goodsCreate',
        meta: {
          perms: ['POST /car'],
          title: '添加汽车',
          noCache: true
        },
        hidden:true
      },
      {
        path: 'cartype',
        component: () => import('@/views/goods/cartype'),
        name: 'goodsCarType',
        meta: {
          perms: ['GET /commonParam/{type}'],
          title: "车型列表",
          noCache: true
        }
      },
      {
        path: 'edit',
        component: () => import('@/views/goods/edit'),
        name: 'goodsEdit',
        meta: {
          perms: ['PUT /car/{id}', 'PUT /car/status/{id}'],
          title: '编辑汽车',
          noCache: true
        },
        hidden: true
      }
    ]
  },
  {
    path: '/sys',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'sysManage',
    meta: {
      title: '系统管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'admin',
        component: () => import('@/views/sys/admin'),
        name: 'admin',
        meta: {
          perms: ['GET /admin',],
          title: '管理员',
          noCache: true
        }
      },
      {
        path: 'role',
        component: () => import('@/views/sys/role'),
        name: 'role',
        meta: {
          perms: ['GET /roles'],
          title: '角色管理',
          noCache: true
        }
      },
      {
        path: 'os',
        component: () => import('@/views/sys/os'),
        name: 'os',
        meta: {
          perms: ['GET /storage/list'],
          title: '对象存储',
          noCache: true
        }
      }
    ]
  },
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

  { path: '*', redirect: '/404', hidden: true }
]
