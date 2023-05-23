import request from '../../../utils/request'
import qs from 'qs'

export function queryAbnormalTimeList (data) { // 列表数据
  return request({
    url: '/mid_manager/abnormalFlightt/queryAbnormalFlightTimeList',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryAddAbnormalTimeList (data) { // 添加
  return request({
    url: '/mid_manager/abnormalFlightt/addAbnormalFlightTime',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryUpdateAbnormalTimeList (data) { // 修改
  return request({
    url: '/mid_manager/abnormalFlightt/updateAbnormalFlightTime',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryDeleteAbnormalTimeList (data) { // 删除
  return request({
    url: '/mid_manager/abnormalFlightt/deleteAbnormalFlightTime',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryUpdateStatus (data) { // 启用/禁止
  return request({
    url: '/mid_manager/abnormalFlightt/updateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
