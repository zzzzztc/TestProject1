import request from '../../../utils/request'
import qs from 'qs'

export function queryMidPicList (data) { // 列表数据
  return request({
    url: '/mid_manager/midPic/queryMidPicList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function queryAddMidPic (data) { // 新增
  return request({
    url: '/mid_manager/midPic/addMidPic',
    method: 'post',
    data: data
  })
}

export function queryUpdateMidPic (data) { // 修改
  return request({
    url: '/mid_manager/midPic/updateMidPic',
    method: 'post',
    data: data
  })
}

export function queryDeleteMidPic (data) { // 删除
  return request({
    url: '/mid_manager/midPic/deleteMidPic',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryUpdateStatus (data) { // 禁用/启用
  return request({
    url: '/mid_manager/midPic/updateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
