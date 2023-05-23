import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) {
  return request({
    url: '/mid_manager/refund/queryAchangeList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function batchRefundConform (data) {
  return request({
    url: '/mid_manager/refund/batchRefundConform',
    method: 'post',
    data: qs.stringify(data)
  })
}
