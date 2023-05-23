const upgrade = [
  {
    path: '/upgradProduct',
    name: 'UpgradProduct',
    component: () => import('@/views/upgradeManage/definition/index.vue'),
    meta: {
      title: '产品升舱定义',
      parentId: '408'
    }
  },
  {
    path: '/upgradFlightPolicy',
    name: 'UpgradFlightPolicy',
    component: () => import('@/views/upgradeManage/pricePolicy/index.vue'),
    meta: {
      title: '升舱产品价格政策设置',
      parentId: '408'
    }
  },
  {
    path: '/upgradTime',
    name: 'UpgradTime',
    component: () => import('@/views/upgradeManage/timeLimit/index.vue'),
    meta: {
      title: '升舱产品时间限制设置',
      parentId: '408'
    }
  },
  {
    path: '/upgradFlightFree',
    name: 'UpgradFlightFree',
    component: () => import('@/views/upgradeManage/upgradeFree/index.vue'),
    meta: {
      title: '升舱产品免费升舱设置',
      parentId: '408'
    }
  },
  {
    path: '/upgradLowestPrice',
    name: '',
    component: () => import('@/views/upgradeManage/guaranteePrice/index.vue'),
    meta: {
      title: '升舱产品保底价格政策设置',
      parentId: '408'
    }
  }
]

export default upgrade
