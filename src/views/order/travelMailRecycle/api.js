import request from '../../../utils/request'
import qs from 'qs'
// /refund/queryAchangeList
export function queryAchangeList (data) {
  return request({
    url: '/mid_manager/refund/queryAchangeList',
    method: 'post',
    data: qs.stringify(data)
  })
}
// /refund/confirmPrint
export function confirmPrint (data) {
  return request({
    url: '/mid_manager/refund/confirmPrint',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 更新行程单状态
export function updateStatus (data) {
  return request({
    url: '/mid_manager/refund/invalidFlagUpdate',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 批量作废行程单
export function batchUpdate (data) {
  return request({
    url: '/mid_manager/refund/batchConfirmPrint',
    method: 'post',
    data: qs.stringify(data)
  })
}
