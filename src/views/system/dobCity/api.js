import request from '../../../utils/request'
import qs from 'qs'

export function queryAirCitiesTree (data) {
  return request({
    url: '/mid_manager/cityAirport/queryAirCitiesTree',
    method: 'get',
    params: {}
  })
}

//  初始化表格/cityAirport/queryAirlineList
export function queryAirlineList (data) {
  return request({
    url: 'mid_manager/cityAirport/queryAirlineList',
    method: 'post',
    data: qs.stringify(data)
  })
}
//  添加/cityAirport/addAirline
export function addAirline (data) {
  return request({
    url: 'mid_manager/cityAirport/addAirline',
    method: 'post',
    data: qs.stringify(data)
  })
}
//  修改/cityAirport/updateAirline
export function updateAirline (data) {
  return request({
    url: 'mid_manager/cityAirport/updateAirline',
    method: 'post',
    data: qs.stringify(data)
  })
}
//  修改所属渠道/cityAirport/modifyAirlineChannel
export function modifyAirlineChannel (data) {
  return request({
    url: 'mid_manager/cityAirport/modifyAirlineChannel',
    method: 'post',
    data: qs.stringify(data)
  })
}
//  启用/禁用/cityAirport/validityAirline
export function validityAirline (data) {
  return request({
    url: 'mid_manager/cityAirport/validityAirline',
    method: 'post',
    data: qs.stringify(data)
  })
}
//  删除/cityAirport/deleteAirline
export function deleteAirline (data) {
  return request({
    url: 'mid_manager/cityAirport/deleteAirline',
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

export function state (param) {
  let text = ''
  if (param === '1') {
    text = '是'
  } else {
    text = '否'
  }
  return text
}
