import request from '../../../../utils/request'
import qs from 'qs'

export function querySaleActivityList (data) { // 列表数据
  return request({
    url: '/mid_manager/saleActivity/querySaleActivityList',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryAddSaleActivity (data) { // 添加
  return request({
    url: '/mid_manager/saleActivity/addSaleActivity',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryUpdateSaleActivity (data) { // 修改
  return request({
    url: '/mid_manager/saleActivity/updateSaleActivity',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryUpdateStatus (data) { // 启用/禁止
  return request({
    url: '/mid_manager/saleActivity/updateSaleActivityStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function querySaleApproveApply (data) { // 活动审批申请
  return request({
    url: '/mid_manager/saleApproveRecord/saleActivityApply',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function querySaleApproveStatus (data) { // 活动审批废弃
  return request({
    url: '/mid_manager/saleApproveRecord/updateSaleApproveRecordStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
