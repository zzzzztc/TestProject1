const parameter = [
  {
    path: '/airCityPre',
    name: 'AirCityPre',
    component: () => import('@/views/system/planCity/index.vue'),
    meta: {
      title: '机场城市管理',
      parentId: '4799'
    }
  },
  {
    path: '/airlinePre',
    name: 'AirlinePre',
    component: () => import('@/views/system/dobCity/index.vue'),
    meta: {
      title: '城市对管理',
      parentId: '4799'
    }
  },
  {
    path: '/checkinCity',
    name: 'CheckinCity',
    component: () => import('@/views/system/checkin/index.vue'),
    meta: {
      title: '值机城市管理',
      parentId: '4799'
    }
  },
  {
    path: '/mail',
    name: 'Mail',
    component: () => import('@/views/system/posttage/index.vue'),
    meta: {
      title: '邮寄费管理',
      parentId: '4799'
    }
  },
  {
    path: '/agreement',
    name: 'Agreement',
    component: () => import('@/views/system/service/index.vue'),
    meta: {
      title: '业务协议管理',
      parentId: '4799'
    }
  },
  {
    path: '/bussParamConfig',
    name: 'BussParamConfig',
    component: () => import('@/views/system/parameters/index.vue'),
    meta: {
      title: '后台功能管控',
      parentId: '4799'
    }
  },
  {
    path: '/surname',
    name: 'Surname',
    component: () => import('@/views/system/infant/index.vue'),
    meta: {
      title: '婴儿姓氏维护',
      parentId: '4799'
    }
  },
  {
    path: '/cabinName',
    name: 'CabinName',
    component: () => import('@/views/system/cabinName/index.vue'),
    meta: {
      title: '舱位名称维护',
      parentId: '4799'
    }
  },
  {
    path: '/versionUpgrade',
    name: 'VersionUpgrade',
    component: () => import('@/views/system/version/index.vue'),
    meta: {
      title: '版本升级记录',
      parentId: '4499'
    }
  },
  {
    path: '/interRefundRulePre',
    name: 'InterRefundRulePre',
    component: () => import('@/views/system/International/index.vue'),
    meta: {
      title: '国际退改签管理',
      parentId: '411'
    }
  },
  {
    path: '/refundfeeRule',
    name: 'RefundfeeRule',
    component: () => import('@/views/system/domestic/index.vue'),
    meta: {
      title: '国内退改签管理',
      parentId: '411'
    }
  },
	{
		path: '/freightRateSend',
		name: 'FreightRateSend',
		component: () => import('@/views/system/freightRateSend/index.vue'),
		meta: {
			title: 'OTA折扣推送',
			parentId: '411'
		}
	}
]

export default parameter
