const discount = [
  {
    path: '/freightRateRule',
    name: 'FreightRateRule',
    component: () => import('@/views/discount/index.vue'),
    meta: {
      title: '折扣运价管理',
      parentId: '405'
    }
  }
]

export default discount
