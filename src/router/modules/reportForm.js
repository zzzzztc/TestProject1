const reportForm = [
  {
    path: '/salesReport',
    name: 'CollectReport',
    component: () => import('@/views/reportForm/collectReport/index.vue'),
    meta: {
      title: '汇总报表',
      parentId: '1200'
    }
  },
  {
    path: '/saleReport',
    name: 'SellReport',
    component: () => import('@/views/reportForm/sellReport/index.vue'),
    meta: {
      title: '销售报表',
      parentId: '1200'
    }
  },
  {
    path: '/shippingReport',
    name: 'CabinReport',
    component: () => import('@/views/reportForm/cabinReport/index.vue'),
    meta: {
      title: '舱位报表',
      parentId: '1200'
    }
  },
  {
    path: '/financeReport',
    name: 'FinanceReport',
    component: () => import('@/views/reportForm/financeReport/index.vue'),
    meta: {
      title: '财务对账',
      parentId: '1200'
    }
  },
  {
    path: '/legReport',
    name: 'Segment',
    component: () => import('@/views/reportForm/segment/index.vue'),
    meta: {
      title: '航段明细',
      parentId: '1200'
    }
  },
  {
    path: '/payReport',
    name: 'PayReport',
    component: () => import('@/views/reportForm/payReport/index.vue'),
    meta: {
      title: '支付报表',
      parentId: '1200'
    }
  },
  {
    path: '/checkInReport',
    name: 'CheckInReport',
    component: () => import('@/views/reportForm/checkInReport/index.vue'),
    meta: {
      title: '值机数据',
      parentId: '1200'
    }
  },
  {
    path: '/insuranceReport',
    name: 'InsuranceReport',
    component: () => import('@/views/reportForm/insuranceReport/index.vue'),
    meta: {
      title: '保险销售报表',
      parentId: '1200'
    }
  },
  {
    path: '/refundReport',
    name: 'RefundReport',
    component: () => import('@/views/reportForm/refundReport/index.vue'),
    meta: {
      title: '退票报表'
    }
  },
  {
    path: '/umeBoardingReport',
    name: 'UmeBoardPass',
    component: () => import('@/views/reportForm/umeBoardPass/index.vue'),
    meta: {
      title: '无纸化通关数据',
      parentId: '1200'
    }
  },
  {
    path: '/subwayReport',
    name: 'SubwayReport',
    component: () => import('@/views/reportForm/subwayReport/index.vue'),
    meta: {
      title: '轨道票统计报表'
    }
  },
  {
    path: '/couponReport',
    name: 'CouponReport',
    component: () => import('@/views/reportForm/couponReport/index.vue'),
    meta: {
      title: '优惠券统计报表'
    }
  },
  {
    path: '/activityReport',
    name: 'ActivityReport',
    component: () => import('@/views/reportForm/activityReport/index.vue'),
    meta: {
      title: '活动统计报表'
    }
  },
  {
    path: '/upgradeNumReport',
    name: 'UpgradeNumReport',
    component: () => import('@/views/reportForm/upgradeNumReport/index.vue'),
    meta: {
      title: '乐享升舱数量统计报表'
    }
  },
  {
    path: '/productSaleReport',
    name: 'ProductSaleReport',
    component: () => import('@/views/reportForm/productSaleReport/index.vue'),
    meta: {
      title: '商品销售报表'
    }
  }
]

export default reportForm
