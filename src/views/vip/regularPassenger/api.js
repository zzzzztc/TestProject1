import request from '../../../utils/request'
import qs from 'qs'

// 乘机人 -- 查询
export function hbairPassengerList (data) {
  return request({
    url: '/mid_manager/hbairPassenger/getHbairPassengerList',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 乘机人 -- 查询
export function hbairPassengerExport (data) {
  return request({
    url: '/mid_manager/hbairPassenger/getHbairPassengerList',
    method: 'post',
    data: qs.stringify(data)
  })
}
