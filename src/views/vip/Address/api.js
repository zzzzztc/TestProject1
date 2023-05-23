import request from '../../../utils/request'
import qs from 'qs'

export function getMetChinaareaList (data) { // 列表数据
  return request({
    url: '/mid_manager/metChinaarea/getMetChinaareaList',
    method: 'post',
    data: qs.stringify(data)
  })
}
// /metChinaarea/getAreaSelectByClevel
export function getAreaSelectByClevel (data) { // 列表数据
  return request({
    url: '/mid_manager/metChinaarea/getAreaSelectByClevel',
    method: 'post',
    data: qs.stringify(data)
  })
}
// /metChinaarea/updateMetChinaareaBefore
export function updateMetChinaareaBefore (data) { // 列表数据
  return request({
    url: '/mid_manager/metChinaarea/updateMetChinaareaBefore',
    method: 'post',
    data: qs.stringify(data)
  })
}
//  修改状态/metChinaarea/updateStatus
export function updateStatus (data) { // 列表数据
  return request({
    url: '/mid_manager/metChinaarea/updateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
//  添加/metChinaarea/addMetChinaarea
export function addMetChinaarea (data) { // 列表数据
  return request({
    url: '/mid_manager/metChinaarea/addMetChinaarea',
    method: 'post',
    data: qs.stringify(data)
  })
}
//  修改/metChinaarea/updateMetChinaarea
export function updateMetChinaarea (data) { // 列表数据
  return request({
    url: '/mid_manager/metChinaarea/updateMetChinaarea',
    method: 'post',
    data: qs.stringify(data)
  })
}
