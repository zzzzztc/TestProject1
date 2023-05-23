import request from '../../../utils/request'
import qs from 'qs'

// 业务协议管理 -- 数据表格
export function queryAgreeContent (data) {
  return request({
    url: '/mid_manager/agreeContent/queryAgreeContent',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 业务协议管理 -- 渠道修改
export function modifyAgreeContentChannel (data) {
  return request({
    url: '/mid_manager/agreeContent/modifyAgreeContentChannel',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 业务协议管理 -- 添加
export function addAgreeContent (data) {
  return request({
    url: '/mid_manager/agreeContent/addAgreeContent',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 业务协议管理 -- 修改
export function updateAgreeContent (data) {
  return request({
    url: '/mid_manager/agreeContent/updateAgreeContent',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 业务协议管理 -- 删除
export function deleteAgreeContent (data) {
  return request({
    url: '/mid_manager/agreeContent/deleteAgreeContent',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 业务协议管理 -- 启用/禁用
export function validityAgreeContent (data) {
  return request({
    url: '/mid_manager/agreeContent/validityAgreeContent',
    method: 'post',
    data: qs.stringify(data)
  })
}
