import request from '../../../utils/request'
import qs from 'qs'

export function fetchListData (data) {
	return request({
		url: '/hbhk-auth-service/v1/auth/query',
		method: 'post',
		data: data
	})
}

export function updatAuthConfig (data) {
	return request({
		url: '/hbhk-auth-service/v1/auth/update',
		method: 'post',
		data: data
	})
}

export function saveAuthConfig (data) {
	return request({
		url: '/hbhk-auth-service/v1/auth/insert',
		method: 'post',
		data: data
	})
}

export function deleteAuthData (data) {
	return request({
		url: '/hbhk-auth-service/v1/auth/delete',
		method: 'post',
		data: data
	})
}
