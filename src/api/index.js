import request from '../utils/request'
import exportFile from '../utils/export'
import qs from 'qs'

export function fetchChannelList (data) { // 渠道列表
  return request({
    url: '/mid_manager/common/channels',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function fetchProductList (data) {
  return request({
    url: '/mid_manager/common/querydictsByType',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 获取城市
export function queryAirCitiesTree (data) {
  return request({
    url: '/mid_manager/cityAirport/queryAirCitiesTree',
    method: 'get',
    params: {}
  })
}
//  导出
export function ExportAirCity (param) {
  let url = param.url.split('/')[1]
  let baseUrl = ''
  if (url === 'luckdraw' || url === 'zuul' || url === 'electro-user') {
    baseUrl = param.url
  } else {
    baseUrl = '/mid_manager/' + param.url
  }
  return exportFile({
    url: baseUrl,
    method: 'post',
    data: param.data.isJson ? param.data : qs.stringify(param.data)
  })
}
//  导出
export function ExportGetFile (param) {
  let url = param.url.split('/')[1]
  let baseUrl = ''
  if (url === 'luckdraw' || url === 'zuul' || url === 'electro-user') {
    baseUrl = param.url
  } else {
    baseUrl = '/mid_manager/' + param.url
  }
  return exportFile({
    url: baseUrl,
    method: 'get'
  })
}

export function getAreaSelectByClevel (data) { // 列表数据
  return request({
    url: '/mid_manager/metChinaarea/getAreaSelectByClevel',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 获取支付方式列表
export function fetchPayTypeList () {
  return request({
    url: '/mid_manager/payMethod/getPayMethod',
    method: 'post'
  })
}
// 获取活动场景列表/ 票类型
export function querydictsByType (data) {
  return request({
    url: '/mid_manager/common/querydictsByType',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 获取优惠券类别列表
export function querycouponType (data) {
  return request({
    url: '/mid_manager/common/querydictsByType',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 营销活动列表
export function queryActivityType (data) {
  return request({
    url: '/mid_manager/saleActivity/getSaleActivitySelect',
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

// 主题管理
export function queryThemeList (data) {
  return request({
    url: '/luckdraw/v1/activity/list',
    method: 'post',
    data: data
  })
}

// 奖品管理
export function queryPrizeList (data) {
  return request({
    url: '/luckdraw/v1/prize/list',
    method: 'post',
    data: data
  })
}
// 兑换可抽奖次数
export function queryExchangeList (data) {
  return request({
    url: '/luckdraw/v1/point/exchange/list',
    method: 'post',
    data: data
  })
}
// 上传图片类型
export function queryUploadImgType (data) {
  return request({
    url: '/mid_manager/common/querydictsByType',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 机型图图片类型
export function queryModelImgType (data) {
  return request({
    url: '/mid_manager/midPic/queryMidPicByType',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 折扣编码下拉
export function queryDTicketDiscountSelect (data) {
  return request({
    url: '/mid_manager/dticketdiscount/getDTicketDiscountSelect',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 查询商品详情by机票id
export function queryProductOrderDetailList (data) {
  return request({
    url: '/mid_manager/order/queryProductOrderDetailList',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryProductOrderByOrderid (data) {
  return request({
    url: '/mid_manager/order/queryProductOrderByOrderid',
    method: 'post',
    data: qs.stringify(data)
  })
}
