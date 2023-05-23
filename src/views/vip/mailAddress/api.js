import request from '../../../utils/request'
import qs from 'qs'

//  列表/postAddress/queryPostAddressInfoList
export function queryPostAddressInfoList (data) { // 列表数据
  return request({
    url: '/mid_manager/postAddress/queryPostAddressInfoList',
    method: 'post',
    data: qs.stringify(data)
  })
}
//  导出/postAddress/exportPostAddress
export function exportPostAddress (data) { // 列表数据
  return request({
    url: '/mid_manager/postAddress/exportPostAddress',
    method: 'post',
    data: qs.stringify(data)
  })
}
