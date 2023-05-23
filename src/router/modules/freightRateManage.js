const freightRate = [
  {
    path: '/cityPairManage',
    name: 'CityPairManage',
    component: () => import('@/views/freightRateManage/cityPairManage/index.vue'),
    meta: {
      title: '城市对管理'
    }
  },
  {
    path: '/FDFreightMaintain',
    name: 'FDFreightMaintain',
    component: () => import('@/views/freightRateManage/FDFreightMaintain/index.vue'),
    meta: {
      title: 'FD运价维护'
    }
  },
  {
    path: '/spreadProductManage',
    name: 'SpreadProductManage',
    component: () => import('@/views/freightRateManage/spreadProductManage/index.vue'),
    meta: {
      title: '运价维护'
    }
  },
  {
    path: '/FDFreightProduce',
    name: 'FDFreightProduce',
    component: () => import('@/views/freightRateManage/productManage/index.vue'),
    meta: {
      title: '产品维护'
    }
  },
  {
    path: '/FDFreightConfig',
    name: 'FDFreightConfig',
    component: () => import('@/views/freightRateManage/configManage/index.vue'),
    meta: {
      title: '配置维护'
    }
  },
  {
    path: '/productAS',
    name: 'ProductAs',
    component: () => import('@/views/freightRateManage/productAS/index.vue'),
    meta: {
      title: '预订提醒设置'
    }
  }
]

export default freightRate
