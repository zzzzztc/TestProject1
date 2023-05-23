import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) { // 获取列表数据
  return request({
    url: '/mid_manager/business/queryAdPicList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function changeAdPicStatus (data) { // 修改图片状态
  return request({
    url: '/mid_manager/business/changeAdPicStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function querySystemInfoTree (data) { // 优惠信息
  return request({
    url: '/mid_manager/business/querySystemInfoTree',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function addAdPic (data) { // 添加广告图片
  return request({
    url: '/mid_manager/business/addAdPic',
    method: 'post',
    data: data
  })
}
export function updateAdPic (data) { // 编辑广告图片
  return request({
    url: '/mid_manager/business/updateAdPic',
    method: 'post',
    data: data
  })
}

export function deleteAdPic (data) {
  return request({
    url: '/mid_manager/business/deleteAdPic',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function saveAdPicSort (data) { // 保存
  return request({
    url: '/mid_manager/business/saveAdPicSort',
    method: 'post',
    data: qs.stringify(data)
  })
}
