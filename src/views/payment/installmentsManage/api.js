import request from '../../../utils/request'
import qs from 'qs'
export function fetchList (data) {
  return request({
    url: '/mid_manager/payInstallmentRate/queryPayInstallmentRateList',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function create (data) {
  return request({
    url: '/mid_manager/payInstallmentRate/addPayInstallmentRate',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function modify (data) {
  return request({
    url: '/mid_manager/payInstallmentRate/updatePayInstallmentRate',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function deleteRate (data) {
  return request({
    url: '/mid_manager/payInstallmentRate/deletePayInstallmentRate',
    method: 'post',
    data: qs.stringify(data)
  })
}
