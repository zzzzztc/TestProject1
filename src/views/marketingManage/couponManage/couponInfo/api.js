import request from '../../../../utils/request'
import qs from 'qs'

// 优惠券信息 -- 查询
export function queryMetCouponList (data) {
  return request({
    url: '/mid_manager/metCoupon/queryMetCouponList',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 优惠券信息 -- 生成详情
export function queryGenerateCode (data) {
  return request({
    url: '/mid_manager/metCouponMake/queryMetCouponMakeByCode',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 优惠券信息 -- 申领详情
export function querySaleApplyRecordById (data) {
  return request({
    url: '/mid_manager/saleApplyRecord/querySaleApplyRecordById',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 优惠券信息 -- 核销
export function queryWriteOff (data) {
  return request({
    url: '/mid_manager/metCoupon/writeOff',
    method: 'post',
    data: qs.stringify(data)
  })
}
