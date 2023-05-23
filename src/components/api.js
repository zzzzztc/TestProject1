import request from '../utils/request'
import qs from 'qs'

export function queryUpgradOrderInfo (data) { // 获取升舱数据
  return request({
    url: '/mid_manager/order/queryUpgradOrderInfo',
    method: 'post',
    data: qs.stringify(data)
  })
} // 参数 orderId

export function queryOrderInfoByOrderId (data) { // 获取订单详情
  return request({
    url: '/mid_manager/order/queryOrderInfoByOrderId',
    method: 'post',
    data: qs.stringify(data)
  })
} // 参数orderId, orderDate

export function queryOrderProcessingList (data) { // 获取审核记录
  return request({
    url: '/mid_manager/refund/queryOrderProcessingList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function queryAchangeInfo (data) { // 获取审核详情
  return request({
    url: '/mid_manager/refund/queryAchangeInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function firstRefundPass (data) { // 退票审核
  return request({
    url: '/mid_manager/refund/firstRefundPass',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function secondRefundPass (data) { // 退票审核
  return request({
    url: '/mid_manager/refund/secondRefundPass',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function refusePass (data) { // 退票拒绝
  return request({
    url: '/mid_manager/refund/refusePass',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function involTOVol (data) { // 非自愿转自愿
  return request({
    url: '/mid_manager/refund/involTOVol',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function redoRefundPass (data) { // 重新审核
  return request({
    url: '/mid_manager/refund/redoRefundPass',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function refundConform (data) { // 退款确认
  return request({
    url: '/mid_manager/refund/refundConform',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function underLineRefund (data) { // 线下处理成功
  return request({
    url: '/mid_manager/refund/underLineRefund',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function querySementList (data) { // 第一/二航段信息表格
  return request({
    url: '/mid_manager/order/queryTicketSementInfoBySidAndorderId',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function queryPassageList (data) { // 第一/二航段乘客表格
  // console.log(data)
  return request({
    url: '/mid_manager/order/queryTicketPassengerInfoBySidAndorderId',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function checkFlightSegment (data) { // 第二航段乘客表格
  // console.log(data)
  return request({
    url: '/mid_manager/order/checkFlightSegment',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function queryInsuranceInfoList (data) { // 保险信息
  return request({
    url: '/mid_manager/insurance/queryInsuranceInfoList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function queryTravelMailList (data) { // 行程单信息
  return request({
    url: '/mid_manager/delivery/queryTravelMailList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function updatePayserial (data) { // 回填流水号
  return request({
    url: '/mid_manager/pay/updatePayserial',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 补退款申请 -- 查看详情
export function refundInfo (data) {
  return request({
    url: '/mid_manager/repairRefund/refundInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 补退款申请 -- 申请补退款编辑
export function apply (data) {
  return request({
    url: '/mid_manager/repairRefund/apply',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 补退款审核 -- 弹出框数据表格
export function repairRefundInfo (data) {
  return request({
    url: '/mid_manager/repairRefund/repairRefundInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 补退款审核 -- 补退款审核
export function auditPass (data) {
  return request({
    url: '/mid_manager/repairRefund/auditPass',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 补退款审核 -- 补退款拒绝
export function auditRefuse (data) {
  return request({
    url: '/mid_manager/repairRefund/auditRefuse',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 补退款退款 -- 退款通过
export function refundPass (data) {
  return request({
    url: '/mid_manager/repairRefund/refundPass',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 补退款退款 -- 退款拒绝
export function refundRefuse (data) {
  return request({
    url: '/mid_manager/repairRefund/refundRefuse',
    method: 'post',
    data: qs.stringify(data)
  })
}

//  K座记录
export function queryHKSeatList (data) {
  return request({
    url: '/mid_manager/order/queryHKSeatList',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 优惠券模板详情
export function queryMetCouponTempletById (data) {
  return request({
    url: '/mid_manager/metCouponTemplet/queryMetCouponTempletById',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 变更日志查询
export function queryUpdateLog (data) {
  return request({
    url: '/mid_manager' + data.url,
    method: 'post',
    data: qs.stringify(data.params)
  })
}

// 安全查询
export function getCredentialsByMemId (data) {
  return request({
    url: '/mid_manager/member/getCredentialsByMemId',
    method: 'post',
    data: qs.stringify(data)
  })
}

//  非自愿审核
export function queryInvoluntaryReview (data) {
  return request({
    url: '/mid_manager/refund/queryMetachangeDelayInfoByChg',
    method: 'post',
    data: qs.stringify(data)
  })
}

//  航班信息
export function queryfocFlightById (data) {
  return request({
    url: '/mid_manager/refund/queryfocFlightById',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 营销活动详情
export function querySaleActivityById (data) {
  return request({
    url: '/mid_manager/saleActivity/querySaleActivityById',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 根据订单查询地铁信息
export function queryAirRailwayTicketByOrderCode (data) {
  return request({
    url: '/mid_manager/airRailwayTicket/queryAirRailwayTicketByOrderCode',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 地铁票退票申请
export function queryAirRailwayTicketRefundApply (data) {
  return request({
    url: '/mid_manager/airRailwayTicket/airRailwayTicketRefundApply',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 地铁票改期申请
export function queryAirRailwayTicketModifyExpireDate (data) {
  return request({
    url: '/mid_manager/airRailwayTicket/airRailwayTicketModifyExpireDate',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 查询退款账户信息
export function getInvolCardInfo (data) {
  return request({
    url: '/mid_manager/refund/getInvolBankCard',
    method: 'post',
    data: qs.stringify(data)
  })
}
