import request from '../../../utils/request'
import qs from 'qs'

export function queryFdBasicPriceList (data) { // 列表数据
  return request({
    url: '/mid_manager/fcBasicPrice/getFdBasicPriceList',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryAddFdBasicPrice (data) { // 添加
  return request({
    url: '/mid_manager/fcBasicPrice/addFdBasicPrice',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryUpdateFdBasicPrice (data) { // 修改
  return request({
    url: '/mid_manager/fcBasicPrice/updateFdBasicPrice',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryDeleteFdBasicPrice (data) { // 删除
  return request({
    url: '/mid_manager/fcBasicPrice/deleteFdBasicPrice',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryImportFdBasicPrice (data) { // 上传
  return request({
    url: '/mid_manager/fcBasicPrice/importFdBasicPrice',
    method: 'post',
    data: data
  })
}
export function queryFdBBasicPriceLog (data) { // 操作日志
  return request({
    url: '/mid_manager/fcBasicPrice/getFdBBasicPriceLog',
    method: 'post',
    data: qs.stringify(data)
  })
}
