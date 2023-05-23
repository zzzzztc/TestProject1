import request from '../../../utils/request'
import qs from 'qs'

// 航延证明数据配置 -- 表格数据
export function queryFlightDelaydataList (data) {
  return request({
    url: '/mid_manager/flightDelayProve/queryFlightDelayChannelList',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 航延证明数据配置 -- 禁用/启用
export function updateFlightDelayChannel (data) {
  return request({
    url: '/mid_manager/flightDelayProve/updateFlightDelayChannel',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 航延证明数据配置 -- 添加
export function addFlightDelayChannel (data) {
  return request({
    url: '/mid_manager/flightDelayProve/addFlightDelayChannel',
    method: 'post',
    data: qs.stringify(data)
  })
}
