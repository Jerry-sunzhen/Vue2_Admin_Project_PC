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
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar(可以从src/icons中寻找,或者elementUI中的icon图标类名)
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

// 注意: 界面上的router-link与routes是响应式的,删除路由后相应的router-link也会自动删除
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/Production',
    name: 'production',
    component: Layout,
    meta: {
      title: '商品管理',
      icon:"el-icon-goods"
    },
    redirect: '',
    children: [
      {
        name: 'Trademark',
        path: 'trademark/list',
        component: () => import('views/product/Trademark/Trademark'),
        meta: {
          title: '品牌管理',
          icon: "el-icon-price-tag"
        },
      },
      {
        name: 'Category',
        path: 'category/list',
        component: () => import('views/product/Category/Category'),
        meta: {
          title: '分类管理',
          icon: "el-icon-s-operation"
        },
      },

      {
        name: 'Attr',
        path: 'attr/list',
        component: () => import('views/product/Attr/Attr'),
        meta: {
          title: '平台属性管理',
          icon: "el-icon-info"
        },
      },
      {
        name: 'Spu',
        path: 'spu/list',
        component: () => import('views/product/Spu/Spu'),
        meta: {
          title: 'SPU管理',
          icon: "el-icon-s-grid"
        },
      },
      {
        name: 'Sku',
        path: 'sku/list',
        component: () => import('views/product/Sku/Sku'),
        meta: {
          title: 'SKU管理',
          icon: "el-icon-menu"
        },
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0,behavior:"smooth" }),
  routes: constantRoutes
})

const router = createRouter()


// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
