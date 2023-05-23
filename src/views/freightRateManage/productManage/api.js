import request from '../../../utils/request'
import qs from 'qs'

export function queryAllProducts (data) { // 获取所有产品
  return request({
    url: '/config_manager/productManager/queryAllProducts',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function addProducts (data) { // 添加产品
  return request({
    url: '/config_manager/productManager/addProducts',
    method: 'post',
    data: data
  })
}
export function updateProduct (data) { // 修改产品
  return request({
    url: '/config_manager/productManager/updateProduct',
    method: 'post',
    data: data
  })
}
export function deleteProducts (data) { // 删除产品
  return request({
    url: '/config_manager/productManager/deleteProducts',
    method: 'post',
    data: data
  })
}
export function uploadPic (data) { // 上传图片
  return request({
    url: '/config_manager/productPic/uploadPic',
    method: 'post',
    data: data
  })
}
// 查询删除图片
export function fetchAndDeletePic (data) {
  return request({
    url: '/config_manager/productPic/deletePic',
    method: 'post',
    data: data
  })
}
