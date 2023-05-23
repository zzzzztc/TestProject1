const Intro = [
  {
    path: '/upgradPropaganda',
    name: 'UpgradPropaganda',
    component: () => import('@/views/Intro/IntroImg/index.vue'),
    meta: {
      title: '舱位宣传图',
      parentId: '409'
    }
  },
  {
    path: '/cabinLabel',
    name: 'CabinLabel',
    component: () => import('@/views/Intro/IntroLabel/index.vue'),
    meta: {
      title: '舱位标签维护',
      parentId: '409'
    }
  },
  {
    path: '/upgradIntroduce',
    name: 'UpgradIntroduce',
    component: () => import('@/views/Intro/IntroMsg/index.vue'),
    meta: {
      title: '舱位详情信息维护',
      parentId: '409'
    }
  }
]

export default Intro
