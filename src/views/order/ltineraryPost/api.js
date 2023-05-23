import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) { // 行程单邮寄列表
  return request({
    url: '/mid_manager/delivery/queryTravelMailList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function fetchChannelList (data) { // 渠道列表
  return request({
    url: '/mid_manager/common/channels',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function deliveryDistribution (data) { // 完成邮寄
  return request({
    url: '/mid_manager/delivery/distribution',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function deliverySendMessage (data) { // 发送回收消息
  return request({
    url: '/mid_manager/delivery/sendMessge',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function confirmCompletion (data) { // 收回确认
  return request({
    url: '/mid_manager/delivery/confirmCompletion',
    method: 'post',
    data: qs.stringify(data)
  })
}
//
// export function exportTravelMail () { // 导出
//   return request({
//     url: '/mid_manager/delivery/exportTravelMail'
//   })
// }
