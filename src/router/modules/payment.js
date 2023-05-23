const payment = [
  {
    path: '/paymentDetail',
    name: 'PayDetail',
    component: () => import('@/views/payment/payDetail/index.vue'),
    meta: {
      title: '支付明细查询',
      parentId: '410'
    }
  },
  {
    path: '/paymentChannelManager',
    name: 'PaymentChannelManager',
    component: () => import('@/views/payment/paymentChannel/index.vue'),
    meta: {
      title: '支付渠道管理'
    }
  },
  {
    path: '/mistakeApply',
    name: 'RefundApply',
    component: () => import('@/views/payment/refundApply/index.vue'),
    meta: {
      title: '差错退款申请',
      parentId: '2499'
    }
  },
  {
    path: '/mistakeAudit',
    name: 'RefundReview',
    component: () => import('@/views/payment/refundReview/index.vue'),
    meta: {
      title: '差错退款审核',
      parentId: '2499'
    }
  },
  {
    path: '/mistakeAuditSure',
    name: 'RefundReviewSec',
    component: () => import('@/views/payment/refundReviewSec/index.vue'),
    meta: {
      title: '差错退款确认',
      parentId: '2499'
    }
  },
  {
    path: '/mistakeReport',
    name: 'MistakeReport',
    component: () => import('@/views/payment/refundReport/index.vue'),
    meta: {
      title: '差错退款报表',
      parentId: '2499'
    }
  },
  {
    path: '/paymentTag',
    name: 'PaymentTag',
    component: () => import('@/views/payment/paymentTag/index.vue'),
    meta: {
      title: '支付标签维护',
      parentId: '410'
    }
  },
  {
    path: '/installmentsManage',
    name: 'InstallmentsManage',
    component: () => import('@/views/payment/installmentsManage/index.vue'),
    meta: {
      title: '分期费率维护',
      parentId: '410'
    }
  }
]

export default payment
