const pushManage = [
  {
    path: '/pushNotice',
    name: 'PushNotice',
    component: () => import('@/views/pushManage/newsPushManage/index.vue'),
    meta: {
      title: '消息推送管理'
    }
  },
  {
    path: '/appmsgTemplet',
    name: 'AppmsgTemplet',
    component: () => import('@/views/pushManage/appNewsPush/index.vue'),
    meta: {
      title: 'APP消息推送模板'
    }
  }
]

export default pushManage
