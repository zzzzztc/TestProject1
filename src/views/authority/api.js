import request from '../../utils/request'
import qs from 'qs'

export function queryChannelAuthoritys (data) {
  return request({
    url: 'mid_manager/channelAuthority/queryChannelAuthoritys',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function querydictsByType (data) {
  return request({
    url: 'mid_manager/common/querydictsByType',
    method: 'get',
    params: data
  })
}
export function addChannelAuthority (data) {
  return request({
    url: 'mid_manager/channelAuthority/addChannelAuthority',
    method: 'post',
    data: stringify(data)
  })
}
export function updateChannelAuthority (data) {
  return request({
    url: 'mid_manager/channelAuthority/updateChannelAuthority',
    method: 'post',
    data: stringify(data)
  })
}
export function updateStatus (data) {
  return request({
    url: 'mid_manager/channelAuthority/updateStatus',
    method: 'post',
    data: stringify(data)
  })
}
export function deleteChannelAuthority (data) {
  return request({
    url: 'mid_manager/channelAuthority/deleteChannelAuthority',
    method: 'post',
    data: stringify(data)
  })
}
// /channelAuthority/deleteChannelAuthority

function stringify (param) {
  return qs.stringify(param)
}
