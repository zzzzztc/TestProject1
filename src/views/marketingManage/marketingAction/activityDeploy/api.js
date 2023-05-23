import request from '../../../../utils/request'
import qs from 'qs'

export function queryHbairCronList (data) { // 列表数据
  return request({
    url: '/mid_manager/hbiarCron/queryHbairCronList',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryAddHbairCron (data) { // 添加
  return request({
    url: '/mid_manager/hbiarCron/addHbairCron',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryUpdateHbairCronBean (data) { // 修改
  return request({
    url: '/mid_manager/hbiarCron/updateHbairCronBean',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryUpdateStatus (data) { // 启用/禁止
  return request({
    url: '/mid_manager/hbiarCron/updateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryDeleteHbairCronBean (data) { // 删除
  return request({
    url: '/mid_manager/hbiarCron/deleteHbairCronBean',
    method: 'post',
    data: qs.stringify(data)
  })
}
