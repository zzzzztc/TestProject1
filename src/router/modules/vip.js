const upgrade = [
  {
    path: '/memberInfos',
    name: 'memberInfos',
    component: () => import('@/views/vip/memberInfos/index.vue'),
    meta: {
      title: '会员信息管理',
      parentId: '1199'
    }
  },
  {
    path: '/Address',
    name: 'Address',
    component: () => import('@/views/vip/Address/index.vue'),
    meta: {
      title: '基础地址管理',
      parentId: '1199'
    }
  },
  {
    path: '/mailAddress',
    name: 'mailAddress',
    component: () => import('@/views/vip/mailAddress/index.vue'),
    meta: {
      title: '邮寄地址管理',
      parentId: '1199'
    }
  },
  {
    path: '/loginRecord',
    name: 'loginRecord',
    component: () => import('@/views/vip/loginRecord/index.vue'),
    meta: {
      title: '登录记录管理',
      parentId: '1199'
    }
  },
  {
    path: '/problem',
    name: 'problem',
    component: () => import('@/views/vip/problem/index.vue'),
    meta: {
      title: '问题维护',
      parentId: '1199'
    }
  },
  {
    path: '/memberLogout',
    name: 'MemberLogout',
    component: () => import('@/views/vip/memberLogout/index.vue'),
    meta: {
      title: '会员注销信息',
      parentId: '1199'
    }
  },
  {
    path: '/regularPassenger',
    name: 'RegularPassenger',
    component: () => import('@/views/vip/regularPassenger/index.vue'),
    meta: {
      title: '常旅客集团化管理',
      parentId: '1199'
    }
  },
  {
    path: '/authRecord',
    name: 'AuthRecord',
    component: () => import('@/views/vip/authRecord/index.vue'),
    meta: {
      title: '常旅客集团化管理',
      parentId: '1199'
    }
  }
]

export default upgrade
