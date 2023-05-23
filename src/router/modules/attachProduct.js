const attachProduct = [
  {
    path: '/productOrderList',
    name: 'ProductOrderList',
    component: () => import('@/views/attachProduct/productOrderList/index.vue'),
    meta: {
      title: '产品订单列表'
    }
  },
  {
    path: '/groundSuitList',
    name: 'GroundSuitList',
    component: () => import('@/views/attachProduct/groundSuitList/index.vue'),
    meta: {
      title: '地服务机供品列表查询'
    }
  },
  {
    path: '/productRefund',
    name: 'ProductRefund',
    component: () => import('@/views/attachProduct/productRefund/index.vue'),
    meta: {
      title: '附加产品退款'
    }
  }
]
export default attachProduct
