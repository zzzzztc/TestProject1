const abnormal = [
  {
    path: '/reschedulyTime',
    name: 'ReschedulyTime',
    component: () => import('@/views/flightAbnormalChange/reschedulyTime/index.vue'),
    meta: {
      title: '改期时间管理',
      parentId: '412'
    }
  },
  {
    path: '/cabinDiscount',
    name: 'CabinDiscount',
    component: () => import('@/views/flightAbnormalChange/cabinDiscount/index.vue'),
    meta: {
      title: '舱位折扣管理',
      parentId: '412'
    }
  },
  {
    path: '/reschedulyOrder',
    name: 'ReschedulyOrder',
    component: () => import('@/views/flightAbnormalChange/reschedulyOrder/index.vue'),
    meta: {
      title: '不正常改期订单',
      parentId: '412'
    }
  }
]

export default abnormal
