import request from '../../../utils/request'
import qs from 'qs'

export function queryDflightstockList (data) { // 列表数据
  return request({
    url: '/mid_manager/dflightstock/getDflightstockList',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryAddDflightstock (data) { // 添加
  return request({
    url: '/mid_manager/dflightstock/addDflightstock',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryUpdateDflightstock (data) { // 修改
  return request({
    url: '/mid_manager/dflightstock/updateDflightstock',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function queryDeleteDflightstock (data) { // 删除
  return request({
    url: '/mid_manager/dflightstock/deleteDflightstock',
    method: 'post',
    data: qs.stringify(data)
  })
}
