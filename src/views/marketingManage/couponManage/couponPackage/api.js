import request from '../../../../utils/request'
import qs from 'qs'

// 优惠券礼包 -- 查询
export function queryMetCouponPacksList (data) {
  return request({
    url: '/mid_manager/metCouponPacks/queryMetCouponPacksList',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 优惠券礼包 -- 添加
export function queryAddMetCouponPacks (data) {
  return request({
    url: '/mid_manager/metCouponPacks/addMetCouponPacks',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 优惠券礼包 -- 修改
export function queryUpdateMetCouponPacks (data) {
  return request({
    url: '/mid_manager/metCouponPacks/updateMetCouponPacks',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 优惠券礼包 -- 启用/禁止
export function queryUpdateMetCouponPacksStatus (data) {
  return request({
    url: '/mid_manager/metCouponPacks/updateMetCouponPacksStatus',
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
