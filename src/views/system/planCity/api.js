import request from '../../../utils/request'
import qs from 'qs'

//  折扣类型
// /cityAirport/queryAirCitiesTree
export function queryAirCitiesTree () {
  return request({
    url: 'mid_manager/cityAirport/queryAirCitiesTree',
    method: 'get',
    params: {}
  })
}
//  初始化数据/cityAirport/airCityPreList
export function airCityPreList (data) {
  // console.log(qs.stringify(data))
  return request({
    url: 'mid_manager/cityAirport/airCityPreList',
    method: 'post',
    data: qs.stringify(data)
  })
}
//  添加/cityAirport/addAirCityInfo
export function addAirCityInfo (data) {
  return request({
    url: 'mid_manager/cityAirport/addAirCityInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 修改/cityAirport/updateAirCity
export function updateAirCity (data) {
  return request({
    url: 'mid_manager/cityAirport/updateAirCity',
    method: 'post',
    data: qs.stringify(data)
  })
}

//  修改渠道/cityAirport/modifyAirCityChannel
export function modifyAirCityChannel (data) {
  return request({
    url: 'mid_manager/cityAirport/modifyAirCityChannel',
    method: 'post',
    data: qs.stringify(data)
  })
}

//  修改启用禁用状态/cityAirport/validityAirCity
export function validityAirCity (data) {
  return request({
    url: 'mid_manager/cityAirport/validityAirCity',
    method: 'post',
    data: qs.stringify(data)
  })
}
//  删除/cityAirport/deleteAirCityInfo
export function deleteAirCityInfo (data) {
  return request({
    url: 'mid_manager/cityAirport/deleteAirCityInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}
//  /cityAirport/queryProvinceTree
export function queryProvinceTree (data) {
  return request({
    url: '/mid_manager/cityAirport/queryProvinceTree',
    method: 'get',
    params: {}
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
