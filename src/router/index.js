import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../views/layout/index'
import Upgrade from './modules/upgrade'
import Order from './modules/order'
import Insurance from './modules/insurance'
import Payment from './modules/payment'
import ContentManage from './modules/contentManage'
import Ticket from './modules/ticket'
import ReportForm from './modules/reportForm'
import Permission from './modules/permission'
import System from './modules/system'
import Freight from './modules/Freight'
import RepairRefund from './modules/repairRefund'
import DelayFlight from './modules/delayFlight'
import Message from './modules/message'
import PushManage from './modules/pushManage'
import store from '../store/index'
import Authority from './modules/Authority'
import Discount from './modules/discount'
import Parameter from './modules/parameter'
import Intro from './modules/Introduction'
import Vip from './modules/vip'
import Abnormal from './modules/flightAbnormalChange'
import FreightRate from './modules/freightRateManage'
import MarketingManage from './modules/marketingManage'
import Subway from './modules/subway'
import Lottery from './modules/lotteryManage'
import ElectronicInvoiceManage from './modules/electronicInvoiceManage'
import StaffTicketManage from './modules/staffTicketManage'
import AttachProduct from './modules/attachProduct'
import InvolRefund from './modules/involRefund'
import Fma from './modules/fma'
import PayThenSeat from './modules/PayThenSeat'
import { routerMatch } from '../utils/index'
Vue.use(Router)

// 路由映射
export const routesMap = [
  {}
]

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Layout',
      component: Layout,
      redirect: '/homePage',
      meta: {
        title: 'layout'
      },
      children: [
        {
          path: '/homePage',
          component: () => import('@/views/homePage/index'),
          meta: {
            title: '主页'
          }
        },
        // 订单管理
        ...Order,
        // 保险管理
        ...Insurance,
        // 支付管理
        ...Payment,
        // 票务管理
        ...Ticket,
        // 内容管理
        ...ContentManage,
        // 报表管理
        ...ReportForm,
        // 系统管理
        ...System,
        // 补退款管理
        ...RepairRefund,
        // 延航证明管理
        ...DelayFlight,
        // 消息管理
        ...Message,
        // 推送管理
        ...PushManage,
        // 权限管理
        ...Permission,
        // 升舱产品管理
        ...Upgrade,
        // 票务管理
        ...Freight,
        //  渠道权限管理
        ...Authority,
        ...Discount,
        //  系统参数维护
        ...Parameter,
        //  仓位详情介绍管理
        ...Intro,
        //  会员管理
        ...Vip,
        // 航班不正常改期
        ...Abnormal,
        // 运价
        ...FreightRate,
        // 营销管理
        ...MarketingManage,
        // 空轨联运
        ...Subway,
        // 抽奖管理
        ...Lottery,
        // 发票管理
        ...ElectronicInvoiceManage,
        // 员工票管理
        ...StaffTicketManage,
        // 产品订单管理
        ...AttachProduct,
        // 非自愿退票管理
        ...InvolRefund,
        // 督办管理
        ...Fma,
	      // 先支付后占座管理
	      ...PayThenSeat
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index'),
      meta: {
        title: '登录'
      }
    },
    {
      path: '/notice',
      name: 'Notice',
      component: () => import('@/views/errorPage/notice.vue'),
      meta: {
        title: '提示'
      }
    },
    {
      path: '/log',
      name: 'Log',
      component: () => import('@/views/log/index.vue')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/views/errorPage/404'),
      meta: {
        title: '页面走丢了'
      }
    }
  ]
})
export default router

router.beforeEach((to, from, next) => {
  let treeList = []
  if (!treeList.length) {
    treeList = JSON.parse(window.localStorage.getItem('menuList')) || []
  }
  if (to.path !== '/login' && to.path !== '/homePage' && to.name !== '404' && to.path !== '/notice' && to.path !== '/log') {
    let activeState = routerMatch(treeList, to.path)
    store.commit('UPDATE_FIRST_ACTIVE', activeState)
    if (to.name !== '404' || to.path !== '/norice') {
      let routes = {}
      routes.path = to.path
      // 水平导航中的名字应该与左侧导航中名字保持一致， 而不是使用本地写死的名字
      routes.label = activeState.compName
      store.commit('ADD_VIEW_LIST', routes)
    }
  } else {
    store.commit('CLEAR_FIRST_ACTIVE')
  }
  // if (to.path === '/homePage' || to.name === '404' || to.path === '/login' || to.path === '/notice') {
  // } else {
  //   let routes = {}
  //   routes.path = to.path
  //   // 水平导航中的名字应该与左侧导航中名字保持一致， 而不是使用本地写死的名字
  //   routes.label = modifyTagsViewName(to.path, treeList)
  //   store.commit('ADD_VIEW_LIST', routes)
  // }
  next()
})

// function modifyTagsViewName (path, treeList) {
//   for (let i = 0; i < treeList.length; i++) {
//     if (treeList[i].children && treeList[i].children.length) {
//       for (let j = 0; j < treeList[i].children.length; j++) {
//         // 如果有三级导航
//         if (treeList[i].children[j].children && treeList[i].children[j].children.length) {
//           for (let k = 0; k < treeList[i].children[j].children.length; k++) {
//             if (path === treeList[i].children[j].children[k].attributes.url) {
//               return treeList[i].children[j].children[k].attributes.name
//             }
//           }
//         } else {
//           // 如果没有三级导航
//           if (path === treeList[i].children[j].attributes.url) {
//             return treeList[i].children[j].attributes.name
//           }
//         }
//       }
//     }
//   }
// }
