const contentManage = [
  {
    path: '/infoNotice',
    name: 'MessageManage',
    component: () => import('@/views/contentManage/message/index.vue'),
    meta: {
      title: '信息公告管理',
      parentId: '3199'
    }
  },
  {
    path: '/adPicPre',
    name: 'BannerManage',
    component: () => import('@/views/contentManage/banner/index.vue'),
    meta: {
      title: '广告图片维护',
      parentId: '3199'
    }
  },
  {
    path: '/feedbackList',
    name: 'Feedback',
    component: () => import('@/views/contentManage/feedback/index.vue'),
    meta: {
      title: '意见反馈',
      parentId: '3199'
    }
  },
  {
    path: '/survey',
    name: '/Questionnaire',
    component: () => import('@/views/contentManage/questionnaire/index.vue'),
    meta: {
      title: '问卷调查',
      parentId: '3199'
    }
  },
  {
    path: '/homePageNotice',
    name: 'DefaultBulletin',
    component: () => import('@/views/contentManage/defaultBulletin/index.vue'),
    meta: {
      title: '首页公告管理',
      parentId: '3199'
    }
  },
  {
    path: '/homePagePromotion',
    name: 'DefaultPromotion',
    component: () => import('@/views/contentManage/defaultPromotion/index.vue'),
    meta: {
      title: '首页促销管理',
      parentId: '3199'
    }
  },
  {
    path: '/protocol',
    name: 'ProtocolManage',
    component: () => import('@/views/contentManage/protocol/index.vue'),
    meta: {
      title: '协议条款管理',
      parentId: '3199'
    }
  },
  {
    path: '/recommendRoute',
    name: 'RecommendRoute',
    component: () => import('@/views/contentManage/recommendRoute/index.vue'),
    meta: {
      title: '推荐航线维护',
      parentId: '3199'
    }
  },
  {
    path: '/uploadImg',
    name: 'UploadImg',
    component: () => import('@/views/contentManage/uploadImg/index.vue'),
    meta: {
      title: '上传图片维护',
      parentId: '3199'
    }
  },
  {
    path: '/dynamicModel',
    name: 'DynamicModel',
    component: () => import('@/views/contentManage/dynamicModel/index.vue'),
    meta: {
      title: '航班动态机型维护',
      parentId: '3199'
    }
  },
  {
    path: '/cascadeTopic',
    name: 'CascadeTopic',
    component: () => import('@/views/contentManage/cascadeTopic/index.vue'),
    meta: {
      title: '级联问题维护'
    }
  },
	{
		path: '/accurateFrameMaintenance',
		name: 'AccurateFrameMaintenance',
		component: () => import('@/views/contentManage/accurateFrameMaintenance/index.vue'),
		meta: {
			title: '精准弹框维护'
		}
	}
]

export default contentManage
