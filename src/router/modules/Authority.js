const authority = [
  {
    path: '/channelAuthority',
    name: 'ChannelAuthority',
    component: () => import('@/views/authority/index.vue'),
    meta: {
      title: '渠道权限管理',
      parentId: '406'
    }
  }
]

export default authority
