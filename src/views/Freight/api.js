import request from '../../utils/request'
import qs from 'qs'

export function queryFlightList (data) {
  return request({
    url: 'mid_manager/ticketFree/queryFlightList',
    method: 'post',
    data: stringify(data)
  })
}

export function addTicketFreeFlight (data) {
  return request({
    url: 'mid_manager/ticketFree/addTicketFreeFlight',
    method: 'post',
    data: stringify(data)
  })
}

export function updateTicketFreeFlight (data) {
  return request({
    url: 'mid_manager/ticketFree/updateTicketFreeFlight',
    method: 'post',
    data: stringify(data)
  })
}

export function deleteTicketFreeFlight (data) {
  return request({
    url: 'mid_manager/ticketFree/deleteTicketFreeFlight',
    method: 'post',
    data: stringify(data)
  })
}
function stringify (param) {
  return qs.stringify(param)
}
