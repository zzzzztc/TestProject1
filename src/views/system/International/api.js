import request from '../../../utils/request'
import qs from 'qs'

// 舱位名称维护 -- 数据表格
export function queryInterRefundRule (data) {
  return request({
    url: '/mid_manager/refund/queryInterRefundRule',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 舱位名称维护 -- 添加
export function addInterRefundRule (data) {
  return request({
    url: '/mid_manager/refund/addInterRefundRule',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 舱位名称维护 -- 修改
export function updateInterRefundRule (data) {
  return request({
    url: '/mid_manager/refund/updateInterRefundRule',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 舱位名称维护 -- 启用/禁用
export function validityInterRefund (data) {
  return request({
    url: '/mid_manager/refund/validityInterRefund',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 舱位名称维护 -- 导入
export function importRule (data) {
  return request({
    url: '/mid_manager/refund/importRule',
    method: 'post',
    data: data
  })
}
