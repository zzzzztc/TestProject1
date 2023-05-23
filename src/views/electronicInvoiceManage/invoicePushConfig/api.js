import request from '../../../utils/request'

// 列表数据
export function list (data) {
  return request({
    url: '/electro-user/admin/v1/config/push/list',
    method: 'get',
    params: data
  })
}
// 添加
export function addConfig (data) {
  return request({
    url: '/electro-user/admin/v1/config/push/create',
    method: 'post',
    data: data
  })
}
// 修改
export function updateConfig (data) {
  return request({
    url: '/electro-user/admin/v1/config/push/update',
    method: 'put',
    data: data
  })
}
// 修改
export function deleteConfig (data) {
  return request({
    url: '/electro-user/admin/v1/config/push/delete/' + data.configId,
    method: 'delete',
    data: data
  })
}
