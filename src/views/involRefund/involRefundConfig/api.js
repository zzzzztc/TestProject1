import request from '../../../utils/request'
import qs from 'qs'
// 查询
export function fetchList (data) {
  return request({
    url: '/mid_manager/involRefundConfig/queryInvolRefundConfigList',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 启用禁用
export function updateStatus (data) {
  return request({
    url: '/mid_manager/involRefundConfig/updateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 删除
export function deleteConfig (data) {
  return request({
    url: '/mid_manager/involRefundConfig/deleteInvolRefundConfig',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 新增
export function addConfig (data) {
  return request({
    url: '/mid_manager/involRefundConfig/addInvolRefundConfig',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 编辑
export function modifyConfig (data) {
  return request({
    url: '/mid_manager/involRefundConfig/updateInvolRefundConfig',
    method: 'post',
    data: qs.stringify(data)
  })
}
