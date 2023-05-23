const insurance = [
  {
    path: '/insuranceQuery',
    name: 'InsuranceStatistics',
    component: () => import('@/views/insurance/insuranceStatistics/index.vue'),
    meta: {
      title: '保险统计查询',
      parentId: '1899'
    }
  },
  {
    path: '/insuranceTypes',
    name: 'InsuranceCategory',
    component: () => import('@/views/insurance/insuranceCategory/index'),
    meta: {
      title: '保险种类管理',
      parentId: '10000'
    }
  },
  {
    path: '/insuranceRefundApply',
    name: 'RecedeApply',
    component: () => import('@/views/insurance/recedeApply/index'),
    meta: {
      title: '保险退保申请',
      parentId: '10000'
    }
  },
  {
    path: '/insuranceRefundAudit',
    name: 'RecedeReview',
    component: () => import('@/views/insurance/recedeReview/index'),
    meta: {
      title: '退保审核',
      parentId: '10000'
    }
  },
  {
    path: '/insuranceRefundConfirm',
    name: 'Refund',
    component: () => import('@/views/insurance/refund/index'),
    meta: {
      title: '退保退款',
      parentId: '10000'
    }
  }
]

export default insurance
