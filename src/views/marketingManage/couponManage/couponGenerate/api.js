import request from '../../../../utils/request'
import qs from 'qs'

export function queryMetCouponMakeList (data) { // 生成记录查询
  return request({
    url: '/mid_manager/metCouponMake/queryMetCouponMakeList',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryMakeCoupon (data) { // 生成优惠券
  return request({
    url: '/mid_manager/metCouponMake/makeCoupon',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 模板列表
export function queryCouponTempletType (data) {
  return request({
    url: '/mid_manager/metCouponTemplet/queryMetCouponTempletSelect',
    method: 'post',
    data: qs.stringify(data)
  })
}
