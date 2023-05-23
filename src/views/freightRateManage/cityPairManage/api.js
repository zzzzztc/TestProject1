import request from '../../../utils/request'
// import qs from 'qs'

export function queryCityPairByPage (data) { // 列表数据
  return request({
    url: '/mid_manager/cityPair/queryCityPairByPage',
    method: 'post',
    data: data
  })
}
export function queryAddList (data) { // 添加
  return request({
    url: '/mid_manager/cityPair/add',
    method: 'post',
    data: data
  })
}
export function queryDeleteList (data) { // 删除
  return request({
    url: '/mid_manager/cityPair/delete',
    method: 'post',
    data: data
  })
}
export function queryUpdateStatus (data) { // 启用/禁止
  return request({
    url: '/mid_manager/cityPair/updateStatus',
    method: 'post',
    data: data
  })
}
export function queryUploadCityPair (data) { // 上传
  return request({
    url: '/mid_manager/cityPair/uploadCityPair',
    method: 'post',
    data: data
  })
}
export function queryAirCitiesTree (data) { // 城市
  return request({
    url: '/mid_manager/cityAirport/queryAirCitiesTree',
    method: 'get',
    params: {}
  })
}
