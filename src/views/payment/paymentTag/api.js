import request from '../../../utils/request'
import qs from 'qs'

export function fetchPayments (data) {
  return request({
    url: '/mid_manager/payMethod/queryPayMethodList',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function updatePayMethodRemark (data) {
  return request({
    url: '/mid_manager/payMethod/updatePayMethodRemark',
    method: 'post',
    data: qs.stringify(data)
  })
}
