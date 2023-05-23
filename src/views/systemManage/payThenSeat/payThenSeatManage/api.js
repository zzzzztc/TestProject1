import request from '../../../../utils/request'
import qs from 'qs'

export function getNoseatConfig (data) {
	return request({
		url: '/mid_manager/noSeat/getNoseatConfig',
		method: 'post',
		data: qs.stringify(data)
	})
}

export function updateNoSeatConfig (data) {
	return request({
		url: '/mid_manager/noSeat/updateNoSeatConfig',
		method: 'post',
		data: data
	})
}

export function saveNoSeatConfig (data) {
	return request({
		url: '/mid_manager/noSeat/saveNoSeatConfig',
		method: 'post',
		data: data
	})
}

export function delNoSeatConfig (data) {
	return request({
		url: '/mid_manager/noSeat/delNoSeatConfig',
		method: 'post',
		data: data
	})
}
