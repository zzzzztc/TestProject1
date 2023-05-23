// 全员营销
const Fma = [
  {
    path: '/fmaSuperVise',
    name: 'FmaSuperVise',
    component: () => import('@/views/fma/fmaSuperVise/index.vue'),
    meta: {
      title: '督办管理'
    }
  },
  {
    path: '/fmaReport',
    name: 'FmaReport',
    component: () => import('@/views/fma/fmaReport/index.vue'),
    meta: {
      title: '营销报表'
    }
  },
  {
    path: '/marketActivity',
    name: 'MarketActivity',
    component: () => import('@/views/fma/marketActivity/index.vue'),
    meta: {
      title: '营销活动'
    }
  },
  {
    path: '/actyAwdReport',
    name: 'ActyAwdReport',
    component: () => import('@/views/fma/actyAwdReport/index.vue'),
    meta: {
      title: '活动奖励报表'
    }
  }
]
export default Fma
