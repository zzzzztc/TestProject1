import request from '../../../utils/request'
import qs from 'qs'

export function getMetChinaareaList (data) { // 列表数据
  return request({
    url: '/mid_manager/memberAuthRecord/getMemberAuthRecord',
    method: 'post',
    data: qs.stringify(data)
  })
}
