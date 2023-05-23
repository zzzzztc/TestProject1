import request from '../../../utils/request'
import qs from 'qs'

// 航延证明记录列表查询 -- 表格数据
export function queryFlightDelayProveList (data) {
  return request({
    url: '/mid_manager/flightDelayProve/queryFlightDelayProveList',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 航延证明记录列表查询 -- 邮件发送
export function delaySendEmail (data) {
  return request({
    url: '/mid_manager/flightDelayProve/delaySendEmail',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 航延证明记录列表查询 -- 邮件发送
export function queryFlightDelayProveInfo (data) {
  return request({
    url: '/mid_manager/flightDelayProve/queryFlightDelayProveInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}
