import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) { // 获取列表数据
  return request({
    url: '/mid_manager/operator/queryOperatorList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function queryOperatorById (data) { // 获取操作员详情
  return request({
    url: '/mid_manager/operator/queryOperatorById',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function fetchListMenu (data) { // 获取权限列表
  return request({
    url: '/mid_manager/menu/listMenu',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function queryRole () { // 获取角色列表
  return request({
    url: '/mid_manager/role/queryRoleTree',
    method: 'get'
  })
}

export function saveOperator (data) { // 新增操作员
  return request({
    url: '/mid_manager/operator/saveOperator',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function updateOperator (data) { // 修改操作员
  return request({
    url: '/mid_manager/operator/updateOperator',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function deleteOperator (data) { // 删除操作员
  return request({
    url: '/mid_manager/operator/deleteOperator',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function lockOperator (data) { // 锁定
  return request({
    url: '/mid_manager/operator/lockOperator',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function unlockOperator (data) { // 解锁
  return request({
    url: '/mid_manager/operator/unlockOperator',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function queryUnFrozen (data) { // 解冻
  return request({
    url: '/mid_manager/operator/unFrozen',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function editPassword (data) { // 修改密码
  return request({
    url: '/mid_manager/operator/eidtPassword',
    method: 'post',
    data: qs.stringify(data)
  })
}
