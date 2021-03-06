import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/admin',
    name: 'Index',
    hidden: true,
    // children: [{
    //   path: 'dashboard',
    //   component: () => import('@/views/dashboard/index')
    // }]
  },

  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/adminList',
    name: 'Admin',
    meta: { title: '管理员', icon: 'example' },
    children: [
      {
        path: 'adminList',
        name: 'AdminList',
        component: () => import('@/views/admin/index'),
        meta: { title: '管理员列表', icon: 'peoples' }
      },
      {
        path: 'memberList',
        name: 'MemberList',
        component: () => import('@/views/member/index'),
        meta: { title: '会员管理', icon: 'peoples' }
      },
    ]
  }, 
{
  path: '/device',
    component: Layout,
    redirect: 'deviceList',
    name: 'Device',
    meta: { title: '设备管理', icon: 'example' },
    children: [
      {
        path: 'deviceList',
        name: 'DeviceList',
        component: () => import('@/views/device/index'),
        meta: { title: '设备列表', icon: 'peoples' }
      }
    ]
  }, 
  {
    path: '/product',
      component: Layout,
      redirect: 'productList',
      name: 'Product',
      meta: { title: '商品管理', icon: 'example' },
      children: [
        {
          path: 'productList',
          name: 'ProductList',
          component: () => import('@/views/product/index'),
          meta: { title: '商品列表', icon: 'peoples' }
        }
      ]
    }, 
    {
      path: '/merchant',
        component: Layout,
        redirect: 'merchantList',
        name: 'Merchant',
        meta: { title: '商家管理', icon: 'example' },
        children: [
          {
            path: 'merchantList',
            name: 'MerchantList',
            component: () => import('@/views/merchant/index'),
            meta: { title: '商家列表', icon: 'peoples' }
          },
          {
            path: 'merchantChartList',
            name: 'MerchantChartList',
            component: () => import('@/views/merchant/chart'),
            meta: { title: '商家月报表', icon: 'peoples' }
          },
        ]
      }, 
      {
        path: '/order',
          component: Layout,
          redirect: 'orderList',
          name: 'Order',
          meta: { title: '订单管理', icon: 'example' },
          children: [
            {
              path: 'orderList',
              name: 'OrderList',
              component: () => import('@/views/order/index'),
              meta: { title: '订单列表', icon: 'peoples' }
            }
          ]
        }, 

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap,
  base:'/peakevisitor/'
})

