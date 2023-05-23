import request from '../../../../utils/request'
import qs from 'qs'

export function querySaleApproveRecord (data) { // 活动审批查询
  return request({
    url: '/mid_manager/saleApproveRecord/querySaleApproveRecord',
    method: 'post',
    data: qs.stringify(data)
  })
}
// export function querySaleApproveApply (data) { // 活动审批申请
//   return request({
//     url: '/mid_manager/saleApproveRecord/saleActivityApply',
//     method: 'post',
//     data: qs.stringify(data)
//   })
// }
export function querySaleApproveStatus (data) { // 活动审批废弃、通过、打回
  return request({
    url: '/mid_manager/saleApproveRecord/updateSaleApproveRecordStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
