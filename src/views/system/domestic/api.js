import request from '../../../utils/request'
import qs from 'qs'

// 国内退改签规则维护 -- 数据表格
export function queryRefundfeeRuleList (data) {
  return request({
    url: '/mid_manager/refundfeeRule/queryRefundfeeRuleList',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 国内退改签规则维护 -- 添加
export function addRefundfeeRule (data) {
  return request({
    url: '/mid_manager/refundfeeRule/addRefundfeeRule',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 国内退改签规则维护 -- 修改数据
export function queryRefundfeeRuleInfo (data) {
  return request({
    url: '/mid_manager/refundfeeRule/queryRefundfeeRuleInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 国内退改签规则维护 -- 修改保存
export function updateRefundfeeRule (data) {
  return request({
    url: '/mid_manager/refundfeeRule/updateRefundfeeRule',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 国内退改签规则维护 -- 删除
export function deleteRefundfeeRule (data) {
  return request({
    url: '/mid_manager/refundfeeRule/deleteRefundfeeRule',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 国内退改签规则维护 -- 详情
export function queryRuleText (data) {
  return request({
    url: '/mid_manager/refundfeeRule/queryRuleText',
    method: 'post',
    data: qs.stringify(data)
  })
}
