import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) { // 角色列表
  return request({
    url: '/mid_manager/role/queryRoleList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function listAllMenu () { // 权限明细列表
  return request({
    url: '/mid_manager/menu/listAllMenu',
    method: 'get'
  })
}

export function queryRoleInfo (data) { // 获取角色详情
  return request({
    url: '/mid_manager/role/viewRoleInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function saveRole (data) { // 新增角色
  return request({
    url: '/mid_manager/role/saveRole',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function editRole (data) { // 新增角色
  return request({
    url: '/mid_manager/role/updateRole',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function deleteRole (data) {
  return request({
    url: '/mid_manager/role/deleteRole',
    method: 'post',
    data: qs.stringify(data)
  })
}
