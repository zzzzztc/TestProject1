const subway = [
  {
    path: '/subwayOrder',
    name: 'SubwayOrder',
    component: () => import('@/views/subway/subwayOrder/index.vue')
  },
  {
    path: '/subwayRefund',
    name: 'SubwayRefund',
    component: () => import('@/views/subway/subwayRefund/index.vue')
  }
]

export default subway
