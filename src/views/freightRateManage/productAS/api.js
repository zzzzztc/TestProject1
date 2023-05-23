import request from '../../../utils/request'
import qs from 'qs'
export function fetchList (data) {
  return request({
    url: '/mid_manager/productAS/queryProductActivitySceneList',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 新增
export function addAs (data) {
  return request({
    url: '/mid_manager/productAS/addProductActivityScene',
    method: 'post',
    data: data
  })
}
// 编辑
export function editAs (data) {
  return request({
    url: '/mid_manager/productAS/updateProductActivityScene',
    method: 'post',
    data: data
  })
}
// 删除
export function deleteScene (data) {
  return request({
    url: '/mid_manager/productAS/deleteProductActivityScene',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 启用禁用
export function updateStatus (data) {
  return request({
    url: '/mid_manager/productAS/updateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
