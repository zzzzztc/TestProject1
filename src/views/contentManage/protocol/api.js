import request from '../../../utils/request'
import qs from 'qs'

// export function fetchList (data) { // 列表数据
//   return request({
//     url: '/mid_manager/business/infoNoticeList',
//     method: 'post',
//     data: qs.stringify(data)
//   })
// }

// 查询协议新街口
export function fetchList (data) { // 列表数据
	return request({
		url: '/file-manager/business/infoNoticeList',
		method: 'post',
		data: data
	})
}

// export function saveNotice (data) { // 新增协议条款
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

// export function queryNoticeInfo (data) { // 查询详情
//   return request({
//     url: '/mid_manager/business/queryContentInfo',
//     method: 'post',
//     data: qs.stringify(data)
//   })
// }

export function queryNoticeInfo (data) { // 查询详情
	return request({
		url: '/file-manager/business/queryContentInfo',
		method: 'post',
		data: data
	})
}

// export function updateNotice (data) { // 编辑协议条款
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

// export function deleteNotice (data) { // 删除协议条款
//   return request({
//     url: '/mid_manager/business/deleteNotice',
//     method: 'post',
//     data: qs.stringify(data)
//   })
// }

export function deleteNotice (data) { // 删除协议条款
	return request({
		url: '/file-manager/business/deleteNotice',
		method: 'post',
		data: data
	})
}

// export function stickNotice (data) { // 置顶协议条款
//   return request({
//     url: '/mid_manager/business/stickNotice',
//     method: 'post',
//     data: qs.stringify(data)
//   })
// }

export function stickNotice (data) { // 置顶协议条款
	return request({
		url: '/file-manager/business/stickNotice',
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
