import request from '../../../utils/request'
import qs from 'qs'

export function queryRefundManageList (data) { // 列表数据
  return request({
    url: '/mid_manager/refund/queryRefundManageList',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function comfirmTicStatusRelation (data) { // 修改票面处理状态
  return request({
    url: '/mid_manager/refund/comfirmTicStatusRelation',
    method: 'post',
    data: qs.stringify(data)
  })
}
