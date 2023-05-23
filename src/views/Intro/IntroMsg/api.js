import request from '../../../utils/request'
import qs from 'qs'

//  初始化表格/upgradIntroduce/queryUpgradIntroduceList
export function queryUpgradIntroduceList (data) {
  return request({
    url: 'mid_manager/upgradIntroduce/queryUpgradIntroduceList',
    method: 'post',
    data: qs.stringify(data)
  })
}

//  启用/upgradIntroduce/updateStatus
export function updateStatus (data) {
  return request({
    url: 'mid_manager/upgradIntroduce/updateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}

//  删除/upgradIntroduce/deleteUpgradIntroduce
export function deleteUpgradIntroduce (data) {
  return request({
    url: 'mid_manager/upgradIntroduce/deleteUpgradIntroduce',
    method: 'post',
    data: qs.stringify(data)
  })
}

//  添加/upgradIntroduce/addUpgradIntroduce
export function addUpgradIntroduce (data) {
  return request({
    url: 'mid_manager/upgradIntroduce/addUpgradIntroduce',
    method: 'post',
    data: qs.stringify(data)
  })
}

//  修改/upgradIntroduce/updateUpgradIntroduce
export function updateUpgradIntroduce (data) {
  return request({
    url: 'mid_manager/upgradIntroduce/updateUpgradIntroduce',
    method: 'post',
    data: qs.stringify(data)
  })
}
