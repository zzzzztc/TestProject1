import request from '../../../../utils/request'
import qs from 'qs'

// 优惠券模板 -- 查询
export function queryMetCouponTempletList (data) {
  return request({
    url: '/mid_manager/metCouponTemplet/queryMetCouponTempletList',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 优惠券模板 -- 添加
export function queryAddMetCouponTemplet (data) {
  return request({
    url: '/mid_manager/metCouponTemplet/addMetCouponTemplet',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 优惠券模板 -- 修改
export function queryUpdateMetCouponTemplet (data) {
  return request({
    url: '/mid_manager/metCouponTemplet/updateMetCouponTemplet',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 优惠券模板 -- 启用/禁止
export function queryUpdateMetCouponTempletStatus (data) {
  return request({
    url: '/mid_manager/metCouponTemplet/updateMetCouponTempletStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
