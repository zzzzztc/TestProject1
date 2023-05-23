import request from '../../../utils/request'
import qs from 'qs'

export function queryCabinDiscountList (data) { // 列表数据
  return request({
    url: '/mid_manager/abnormalFlightd/queryAbnormalFlightDiscountList',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryAddCabinDiscountList (data) { // 添加
  return request({
    url: '/mid_manager/abnormalFlightd/addAbnormalFlightDiscount',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryUpdateCabinDiscountList (data) { // 修改
  return request({
    url: '/mid_manager/abnormalFlightd/updateAbnormalFlightDiscount',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryDeleteCabinDiscountList (data) { // 删除
  return request({
    url: '/mid_manager/abnormalFlightd/deleteAbnormalFlightDiscount',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryUpdateStatus (data) { // 启用/禁止
  return request({
    url: '/mid_manager/abnormalFlightd/updateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
