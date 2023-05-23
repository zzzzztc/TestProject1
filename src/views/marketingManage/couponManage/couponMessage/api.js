import request from '../../../../utils/request'
import qs from 'qs'

// 短信记录 -- 查询
export function queryMidSmsListByTempletCode (data) {
  return request({
    url: '/mid_manager/midSms/midSmsListByTempletCode',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 短信记录 -- 重发
export function queryAgainSend (data) {
  return request({
    url: '/mid_manager/midSms/againSend',
    method: 'post',
    data: qs.stringify(data)
  })
}
