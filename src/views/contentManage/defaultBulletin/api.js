import request from '../../../utils/request'
import qs from 'qs'

// export function fetchList (data) { // 获取列表数据
//   return request({
//     url: '/mid_manager/business/infoNoticeList',
//     method: 'post',
//     data: qs.stringify(data)
//   })
// }

// 新的接口
export function fetchList (data) { // 获取列表数据
	return request({
		url: '/file-manager/business/infoNoticeList',
		method: 'post',
		data: data
	})
}

// export function queryContentInfo (data) { // 获取公告详情
//   return request({
//     url: '/mid_manager/business/queryContentInfo',
//     method: 'post',
//     data: qs.stringify(data)
//   })
// }

export function queryContentInfo (data) { // 获取公告详情
	return request({
		url: '/file-manager/business/queryContentInfo',
		method: 'post',
		data: data
	})
}

// export function saveNotice (data) { // 新增首页公告
//   return request({
//     url: '/mid_manager/business/saveNotice',
//     method: 'post',
//     data: qs.stringify(data)
//   })
// }

// 新增协议条款新街口
export function saveNotice (data) { // 新增协议条款
	return request({
		url: '/file-manager/business/saveNotice',
		method: 'post',
		data: data
	})
}

// export function updateNotice (data) { // 编辑首页公告
//   return request({
//     url: '/mid_manager/business/updateNotice',
//     method: 'post',
//     data: qs.stringify(data)
//   })
// }

// 隐私协议条款新街口
export function updateNotice (data) { // 编辑协议条款
	return request({
		url: '/file-manager/business/updateNotice',
		method: 'post',
		data: data
	})
}

// // 删除首页公告
// export function deleteNotice (data) {
//   return request({
//     url: '/mid_manager/business/deleteNotice',
//     method: 'post',
//     data: qs.stringify(data)
//   })
// }

// 删除首页公告
export function deleteNotice (data) {
	return request({
		url: '/file-manager/business/deleteNotice',
		method: 'post',
		data: data
	})
}

// // 置顶首页公告
// export function stickNotice (data) {
//   return request({
//     url: '/mid_manager/business/stickNotice',
//     method: 'post',
//     data: qs.stringify(data)
//   })
// }

// 置顶首页公告
export function stickNotice (data) {
	return request({
		url: '/file-manager/business/stickNotice',
		method: 'post',
		data: data
	})
}

// // 过期首页公告
// export function outdateNotice (data) {
//   return request({
//     url: '/mid_manager/business/outdateNotice',
//     method: 'post',
//     data: qs.stringify(data)
//   })
// }

// 过期首页公告
export function outdateNotice (data) {
	return request({
		url: '/file-manager/business/outdateNotice',
		method: 'post',
		data: data
	})
}

export function uploadImg (data) { // 上传图片
  return request({
    url: '/mid_manager/business/uploadNotice',
    method: 'post',
    data: data
  })
}
