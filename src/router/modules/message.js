const message = [
  {
    path: '/messageTemplate',
    name: 'MessageTemplate',
    component: () => import('@/views/messageManage/messagePush/index.vue'),
    meta: {
      title: '小程序消息推送模板',
      parentId: '3199'
    }
  },
  {
    path: '/smsTemplate',
    name: 'SmsTemplate',
    component: () => import('@/views/messageManage/messageNotice/index.vue'),
    meta: {
      title: '客户消息通知',
      parentId: '3199'
    }
  }
]

export default message
