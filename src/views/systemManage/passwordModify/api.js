import request from '../../../utils/request'
import qs from 'qs'

// 系统管理 -- 数据表格
export function updatePwd (data) {
  return request({
    url: '/mid_manager/operator/updatePwd',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 回去个人角色权限信息
export function queryUserInfo (data) {
  return request({
    url: '/mid_manager/menu/queryRoleInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}
