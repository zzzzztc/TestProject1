import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) { // 列表数据
  return request({
    url: '/mid_manager/report/queryUmeBoardPassList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function fetchCities (data) {
  return request({
    url: '/mid_manager/cityAirport/queryAirCitiesTree',
    method: 'post',
    data: qs.stringify(data)
  })
}
