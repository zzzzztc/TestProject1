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
export function queryCategoryId (data) { // 获取公告类型
  return request({
    url: '/mid_manager/business/queryCategoryid',
    method: 'post',
    data: qs.stringify(data)
  })
}

// export function deleteNotice (data) { // 删除信息公告
//   return request({
//     url: '/mid_manager/business/deleteNotice',
//     method: 'post',
//     data: qs.stringify(data)
//   })
// }

export function deleteNotice (data) { // 删除信息公告
	return request({
		url: '/file-manager/business/deleteNotice',
		method: 'post',
		data: data
	})
}

// export function outDateNotice (data) { // 过期信息公告
//   return request({
//     url: '/mid_manager/business/outdateNotice',
//     method: 'post',
//     data: qs.stringify(data)
//   })
// }

export function outDateNotice (data) { // 过期信息公告
	return request({
		url: '/file-manager/business/outdateNotice',
		method: 'post',
		data: data
	})
}

// export function stickNotice (data) { // 置顶信息公告
//   return request({
//     url: '/mid_manager/business/stickNotice',
//     method: 'post',
//     data: qs.stringify(data)
//   })
// }

export function stickNotice (data) { // 置顶信息公告
	return request({
		url: '/file-manager/business/stickNotice',
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

// export function saveNotice (data) { // 新增信息公告
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

// export function updateNotice (data) { // 编辑信息公告
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

export function uploadImg (data) { // 上传图片
  return request({
    url: '/mid_manager/business/uploadNotice',
    method: 'post',
    data: data
  })
}
