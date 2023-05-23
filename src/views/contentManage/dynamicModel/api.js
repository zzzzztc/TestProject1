import request from '../../../utils/request'
import qs from 'qs'

export function queryPlaneTypeImageList (data) { // 列表数据
  return request({
    url: '/mid_manager/planeTypeImage/queryPlaneTypeImageList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function queryAddPlaneTypeImage (data) { // 新增
  return request({
    url: '/mid_manager/planeTypeImage/addPlaneTypeImage',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function queryUpdatePlaneTypeImage (data) { // 修改
  return request({
    url: '/mid_manager/planeTypeImage/updatePlaneTypeImage',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryDeletePlaneTypeImage (data) { // 删除
  return request({
    url: '/mid_manager/planeTypeImage/deletePlaneTypeImage',
    method: 'post',
    data: qs.stringify(data)
  })
}
