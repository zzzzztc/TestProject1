import request from '../../../utils/request'
import qs from 'qs'

//  初始化表格/cityAirport/queryCheckInCityList
export function queryCheckInCityList (data) {
  return request({
    url: 'mid_manager/cityAirport/queryCheckInCityList',
    method: 'post',
    data: qs.stringify(data)
  })
}
//  添加/cityAirport/addCheckInCity
export function addCheckInCity (data) {
  return request({
    url: 'mid_manager/cityAirport/addCheckInCity',
    method: 'post',
    data: qs.stringify(data)
  })
}
//  修改/cityAirport/updateCheckInCity
export function updateCheckInCity (data) {
  return request({
    url: 'mid_manager/cityAirport/updateCheckInCity',
    method: 'post',
    data: qs.stringify(data)
  })
}

//  删除/cityAirport/delCheckInCity
export function delCheckInCity (data) {
  return request({
    url: 'mid_manager/cityAirport/delCheckInCity',
    method: 'post',
    data: qs.stringify(data)
  })
}
