import request from '../../../../utils/request'
import qs from 'qs'

export function queryHKorKKReprot (data) {
	return request({
		url: '/mid_manager/noSeat/queryHKorKKReprot',
		method: 'post',
		data: qs.stringify(data)
	})
}
