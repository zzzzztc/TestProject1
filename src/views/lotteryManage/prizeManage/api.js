import request from '../../../utils/request'
// import qs from 'qs'

// 列表数据
export function queryPrizeList (data) {
  return request({
    url: '/luckdraw/v1/prize/list',
    method: 'post',
    data: data
  })
}
// 添加
export function queryPrizeAdd (data) {
  return request({
    url: '/luckdraw/v1/prize',
    method: 'post',
    data: data
  })
}

// 修改
export function queryPrizeUpdate (data) {
  return request({
    url: '/luckdraw/v1/prize',
    method: 'put',
    data: data
  })
}

// 删除
export function queryPrizeDelete (data) {
  return request({
    url: '/luckdraw/v1/prize/' + data,
    method: 'DELETE'
  })
}

// 启用、禁用
export function queryPrizeStatus (data) {
  return request({
    url: '/luckdraw/v1/prize/' + data.id + '/state/' + data.status + '',
    method: 'PUT'
  })
}

// 详情
export function queryPrizeDetail (data) {
  return request({
    url: '/luckdraw/v1/prize/' + data,
    method: 'get'
  })
}

// 上传图片
export function queryUpload (data) {
  return request({
    url: '/luckdraw/v1/file/image/upload',
    method: 'post',
    data: data
  })
}
