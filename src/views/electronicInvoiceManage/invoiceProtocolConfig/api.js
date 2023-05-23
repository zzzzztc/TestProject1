import request from '../../../utils/request'

// 列表数据
export function list (data) {
  return request({
    url: '/electro-user/admin/v1/config/protocol/list',
    method: 'get',
    params: data
  })
}
// 添加
export function addConfig (data) {
  return request({
    url: '/electro-user/admin/v1/config/protocol/create',
    method: 'post',
    data: data
  })
}
// 修改
export function updateConfig (data) {
  return request({
    url: '/electro-user/admin/v1/config/protocol/update',
    method: 'put',
    data: data
  })
}
// 删除
export function deleteConfig (data) {
  return request({
    url: '/electro-user/admin/v1/config/protocol/delete/' + data.configId,
    method: 'delete',
    data: data
  })
}
