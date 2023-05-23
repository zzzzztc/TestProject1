import request from '../../../utils/request'
import qs from 'qs'

// 运价折扣OTA推送
export function queryFreightRateSendBeanList (data) {
	return request({
		url: '/mid_manager/freightRateSend/queryFreightRateSendBeanList',
		method: 'post',
		data: qs.stringify(data)
	})
}
