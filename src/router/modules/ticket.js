const ticket = [
  {
    path: '/outTicket',
    name: 'OutTicket',
    component: () => import('@/views/ticket/outTicket/index.vue'),
    meta: {
      title: '异常订单管理',
      parentId: '1899'
    }
  },
  {
    path: '/refundApply',
    name: 'RefundTicketApply',
    component: () => import('@/views/ticket/refundApply/index.vue'),
    meta: {
      title: '退票申请',
      parentId: '2799'
    }
  },
  {
    path: '/refundAudit',
    name: 'RefundFir',
    component: () => import('@/views/ticket/refundFir/index.vue'),
    meta: {
      title: '退票一审',
      parentId: '2799'
    }
  },
  {
    path: '/refundAuditTwo',
    name: 'RefundSec',
    component: () => import('@/views/ticket/refundSec/index.vue'),
    meta: {
      title: '退票二审',
      parentId: '2799'
    }
  },
  {
    path: '/refundConfirm',
    name: 'RefundConfirm',
    component: () => import('@/views/ticket/refundConfirm/index.vue'),
    meta: {
      title: '退款确认',
      parentId: '2799'
    }
  },
  {
    path: '/refundIntegralConfirm',
    name: 'RefPointConfirm',
    component: () => import('@/views/ticket/refPointCon/index.vue'),
    meta: {
      title: '退积分确认',
      parentId: '2799'
    }
  },
  {
    path: '/refundManage',
    name: 'AllRefund',
    component: () => import('@/views/ticket/allRefund/index.vue'),
    meta: {
      title: '乐享升舱原票状态更改',
      parentId: '2799'
    }
  },
  {
    path: '/omnichannelRefundManage',
    name: 'OmnichannelRefundManage',
    component: () => import('@/views/ticket/omnichannelRefundManage/index.vue'),
    meta: {
      title: '全渠道退票管理',
      parentId: '2799'
    }
  }
]

export default ticket
