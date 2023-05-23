import request from '../../../utils/request'
import qs from 'qs'

//  初始化表格/cabinLabel/queryCabinLabelList
export function queryCabinLabelList (data) {
  return request({
    url: 'mid_manager/cabinLabel/queryCabinLabelList',
    method: 'post',
    data: qs.stringify(data)
  })
}

//  启用禁用/cabinLabel/updateStatus
export function updateStatus (data) {
  return request({
    url: 'mid_manager/cabinLabel/updateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}

//  删除/cabinLabel/deleteCabinLabel
export function deleteCabinLabel (data) {
  return request({
    url: 'mid_manager/cabinLabel/deleteCabinLabel',
    method: 'post',
    data: qs.stringify(data)
  })
}

//  添加/cabinLabel/addCabinLabel
export function addCabinLabel (data) {
  return request({
    url: 'mid_manager/cabinLabel/addCabinLabel',
    method: 'post',
    data: qs.stringify(data)
  })
}

//  修改/cabinLabel/updateCabinLabel
export function updateCabinLabel (data) {
  return request({
    url: 'mid_manager/cabinLabel/updateCabinLabel',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 舱位标签维护 -- 修改生效时间
export function batchUpdateSeatLabel (data) {
  return request({
    url: '/mid_manager/cabinLabel/batchUpdateSeatLabel',
    method: 'post',
    data: qs.stringify(data)
  })
}

//  data选中的数组 state总状态
export function chanenl (data, state) {
  let arr = []
  for (let item of data) {
    let sp = item.channel.split(',')
    for (let itemi of sp) {
      for (let items of state) {
        if (itemi === items.chalCode) {
          arr.push(items.chalName)
          item.channel = arr.join(',')
        }
      }
    }
    arr = []
  }
  return data
}
