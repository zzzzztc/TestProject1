import request from '../../../utils/request'
// import qs from 'qs'

// 列表数据
export function queryThemeList (data) {
  return request({
    url: '/luckdraw/v1/activity/list',
    method: 'post',
    data: data
  })
}

// 添加 / 修改 / 删除 / 启用、禁用 / 详情
export function queryThemeActivity (data) {
  if (!data.type) {
    return request({
      url: '/luckdraw/v1/activity',
      method: 'post',
      data: data
    })
  } else if (data.type && data.type === 'upDate') {
    return request({
      url: '/luckdraw/v1/activity',
      method: 'put',
      data: data.data
    })
  } else if (data.type && data.type === 'status') {
    return request({
      url: '/luckdraw/v1/activity/' + data.id + '/state/' + data.status + '',
      method: 'PUT'
    })
  } else if (data.type && data.type === 'delete') {
    return request({
      url: '/luckdraw/v1/activity/' + data.id,
      method: 'DELETE'
    })
  } else if (data.type && data.type === 'detail') {
    return request({
      url: '/luckdraw/v1/activity/' + data.id,
      method: 'get'
    })
  }
}

// 上传图片
export function queryUpload (data) {
  return request({
    url: '/luckdraw/v1/file/image/upload',
    method: 'post',
    data: data
  })
}
export function logoff (data) {
  return request({
    url: 'mid_manager/toPage/logoff',
    method: 'get'
  })
}
