const marketingManage = [
  /* 优惠券管理 */
  {
    path: '/couponInfo', // 优惠券信息
    name: 'CouponInfo',
    component: () => import('@/views/marketingManage/couponManage/couponInfo/index.vue')
  },
  {
    path: '/couponMessage', // 优惠券短信
    name: 'CouponMessage',
    component: () => import('@/views/marketingManage/couponManage/couponMessage/index.vue')
  },
  {
    path: '/couponPackage', // 优惠券礼包
    name: 'CouponPackage',
    component: () => import('@/views/marketingManage/couponManage/couponPackage/index.vue')
  },
  {
    path: '/couponTemplet', // 优惠券模板
    name: 'CouponTemplet',
    component: () => import('@/views/marketingManage/couponManage/couponTemplet/index.vue')
  },
  {
    path: '/couponGenerate', // 优惠券生成
    name: 'CouponGenerate',
    component: () => import('@/views/marketingManage/couponManage/couponGenerate/index.vue')
  },
  /* 营销活动管理 */
  {
    path: '/actionApproval', // 活动审批
    name: 'ActionApproval',
    component: () => import('@/views/marketingManage/marketingAction/actionApproval/index.vue')
  },
  {
    path: '/IssueStatistics', // 活动发放统计
    name: 'IssueStatistics',
    component: () => import('@/views/marketingManage/marketingAction/IssueStatistics/index.vue')
  },
  {
    path: '/marketAction', // 营销活动
    name: 'MarketAction',
    component: () => import('@/views/marketingManage/marketingAction/marketAction/index.vue')
  },
  {
    path: '/receiveRule', // 领用规则
    name: 'ReceiveRule',
    component: () => import('@/views/marketingManage/marketingAction/receiveRule/index.vue')
  },
  {
    path: '/userReceive', // 用户申领
    name: 'UserReceive',
    component: () => import('@/views/marketingManage/marketingAction/userReceive/index.vue')
  },
  {
    path: '/activityDeploy', // 活动配置
    name: 'ActivityDeploy',
    component: () => import('@/views/marketingManage/marketingAction/activityDeploy/index.vue')
  }
]

export default marketingManage
