const order = [
  {
    path: '/queryOrder',
    name: 'OrderStatistics',
    component: () => import('@/views/order/orderStatistics/orderStatistics.vue'),
    meta: {
      title: '订单查询',
      parentId: '1899'
    }
  },
  {
    path: '/travelMailQuery',
    name: 'LtineraryPost',
    component: () => import('@/views/order/ltineraryPost/ltineraryPost.vue'),
    meta: {
      title: '行程单邮寄管理',
      parentId: '1899'
    }
  },
  {
    path: '/travelMailWait',
    name: 'TravelMailWait',
    component: () => import('@/views/order/travelMailWait/travelMailWait.vue'),
    meta: {
      title: '行程单待邮寄'
    }
  },
  {
    path: '/travelMailRecycle',
    name: 'TravelMailRecycle',
    component: () => import('@/views/order/travelMailRecycle/travelMailRecycle.vue'),
    meta: {
      title: '行程单回收'
    }
  }
]

export default order
