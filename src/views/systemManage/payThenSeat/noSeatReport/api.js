import request from '../../../../utils/request'
import qs from 'qs'

export function queryNoSeatReport (data) {
	return request({
		url: '/mid_manager/noSeat/queryNoSeatReport',
		method: 'post',
		data: qs.stringify(data)
	})
}
