const staffTicketManage = [
  {
    path: '/flightStockManage',
    name: 'FlightStockManage',
    component: () => import('@/views/staffTicketManage/flightStockManage/index.vue'),
    meta: {
      title: '航班库存管理'
    }
  },
  {
    path: '/ticketLimitManage',
    name: 'TicketLimitManage',
    component: () => import('@/views/staffTicketManage/ticketLimitManage/index.vue'),
    meta: {
      title: '配额管理'
    }
  },
  {
    path: '/ticketDiscountManage',
    name: 'TicketDiscountManage',
    component: () => import('@/views/staffTicketManage/ticketDiscountManage/index.vue'),
    meta: {
      title: '折扣管理'
    }
  },
  {
    path: '/staffLimitQuery',
    name: 'StaffLimitQuery',
    component: () => import('@/views/staffTicketManage/staffLimitQuery/index.vue'),
    meta: {
      title: '员工配额查询'
    }
  },
  {
    path: '/ticketApplyQuery',
    name: 'TicketApplyQuery',
    component: () => import('@/views/staffTicketManage/ticketApplyQuery/index.vue'),
    meta: {
      title: '因公免票审核查询'
    }
  }
]

export default staffTicketManage
