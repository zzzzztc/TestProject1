import request from '../../../utils/request'
import qs from 'qs'

// 列表数据查询
export function queryRecommendedRouteList (data) {
  return request({
    url: '/mid_manager/recommendedRoute/queryRecommendedRouteList',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 新增
export function addRecommendedRouteBean (data) {
  return request({
    url: '/mid_manager/recommendedRoute/addRecommendedRouteBean',
    method: 'post',
    data: data
  })
}

// 修改
export function updateRecommendedRouteBean (data) {
  return request({
    url: '/mid_manager/recommendedRoute/updateRecommendedRouteBean',
    method: 'post',
    data: data
  })
}

// 删除
export function deleteRecommendedRouteBean (data) {
  return request({
    url: '/mid_manager/recommendedRoute/deleteRecommendedRouteBean',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 修改推荐航线状态
export function updateStatus (data) {
  return request({
    url: '/mid_manager/recommendedRoute/updateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
