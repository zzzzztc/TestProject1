import request from '../../../utils/request'
import qs from 'qs'

//  初始化表格/upgradPropaganda/queryUpgradPropagandaList
export function queryUpgradPropagandaList (data) {
  return request({
    url: 'mid_manager/upgradPropaganda/queryUpgradPropagandaList',
    method: 'post',
    data: qs.stringify(data)
  })
}

//  添加/upgradPropaganda/addUpgradPropaganda
export function addUpgradPropaganda (data) {
  return request({
    url: 'mid_manager/upgradPropaganda/addUpgradPropaganda',
    method: 'post',
    data: data
  })
}

//  修改/upgradPropaganda/updateUpgradPropagand
export function updateUpgradPropaganda (data) {
  return request({
    url: 'mid_manager/upgradPropaganda/updateUpgradPropaganda',
    method: 'post',
    data: data
  })
}

//  修改状态/upgradPropaganda/updateStatus
export function updateStatus (data) {
  return request({
    url: 'mid_manager/upgradPropaganda/updateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}

//  删除/upgradPropaganda/deleteUpgradPropaganda
export function deleteUpgradPropaganda (data) {
  return request({
    url: 'mid_manager/upgradPropaganda/deleteUpgradPropaganda',
    method: 'post',
    data: qs.stringify(data)
  })
}
