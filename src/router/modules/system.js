const system = [
  {
    path: '/operatorLog',
    name: 'OperatorLog',
    component: () => import('@/views/systemManage/journalQuery/index.vue'),
    meta: {
      title: '管理员操作日志查询',
      parentId: '6299'
    }
  },
  {
    path: '/changePwd',
    name: 'ChangePwd',
    component: () => import('@/views/systemManage/passwordModify/index.vue'),
    meta: {
      title: '个人账号管理',
      parentId: '6299'
    }
  },
  {
    path: '/clearCache',
    name: 'ClearCache',
    component: () => import('@/views/systemManage/cacheManage/index.vue'),
    meta: {
      title: '缓存管理',
      parentId: '4499'
    }
  },
  {
    path: '/warnDeploy',
    name: 'WarnDeploy',
    component: () => import('@/views/systemManage/warnDeploy/index.vue'),
    meta: {
      title: '预警设置'
    }
  },
  {
    path: '/blacklist',
    name: 'Blacklist',
    component: () => import('@/views/systemManage/preventOccupy/index.vue'),
    meta: {
      title: '防占座管理',
      parentId: '4499'
    }
  },
	{
		path: '/authenticationManage',
		name: 'Authentication',
		component: () => import('@/views/systemManage/authenticationManage/index.vue'),
		meta: {
			title: '防越权管理'
		}
	},
  {
    path: '/menuManage',
    name: 'Menu',
    component: () => import('@/views/system/menu/index.vue'),
    meta: {
      title: '菜单管理',
      parentId: ''
    }
  },
  {
    path: '/systemMessage',
    name: 'SystemManage',
    component: () => import('@/views/systemManage/systemMessage/index.vue'),
    meta: {
      title: '系统公告管理'
    }
  }
]

export default system
