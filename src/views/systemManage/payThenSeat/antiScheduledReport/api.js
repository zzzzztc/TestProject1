import request from '../../../../utils/request'
import qs from 'qs'

export function queryReserveFilterReport (data) {
	return request({
		url: '/mid_manager/noSeat/queryReserveFilterReport',
		method: 'post',
		data: qs.stringify(data)
	})
}
