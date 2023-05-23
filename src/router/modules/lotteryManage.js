const lottery = [
  {
    path: '/themeManage',
    name: 'ThemeManage',
    component: () => import('@/views/lotteryManage/themeManage/index.vue'),
    meta: {
      title: '主题管理'
    }
  },
  {
    path: '/prizeManage',
    name: 'PrizeManage',
    component: () => import('@/views/lotteryManage/prizeManage/index.vue'),
    meta: {
      title: '奖品管理'
    }
  },
  {
    path: '/ruleManage',
    name: 'RuleManage',
    component: () => import('@/views/lotteryManage/ruleManage/index.vue'),
    meta: {
      title: '规则管理'
    }
  },
  {
    path: '/userManage',
    name: 'UserManage',
    component: () => import('@/views/lotteryManage/userManage/index.vue'),
    meta: {
      title: '用户管理'
    }
  },
  {
    path: '/changeLotteryNum',
    name: 'ChangeLotteryNum',
    component: () => import('@/views/lotteryManage/changeLotteryNum/index.vue'),
    meta: {
      title: '可兑换抽奖次数'
    }
  },
  {
    path: '/lotteryRecordManage',
    name: 'LotteryRecordManage',
    component: () => import('@/views/lotteryManage/lotteryRecordManage/index.vue'),
    meta: {
      title: '抽奖记录管理'
    }
  },
  {
    path: '/pointExchangeRecord',
    name: 'PointExchangeRecord',
    component: () => import('@/views/lotteryManage/pointExchangeRecord/index.vue'),
    meta: {
      title: '积分兑换记录'
    }
  }
]

export default lottery
