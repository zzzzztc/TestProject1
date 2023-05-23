import request from '../../../../utils/request'
import qs from 'qs'

export function querySaleApplyRecordList (data) { // 用户申领记录查询
  return request({
    url: '/mid_manager/saleApplyRecord/querySaleApplyRecordList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function queryImportSaleApplyRecord (data) { // 上传用户身份信息申领
  return request({
    url: '/mid_manager/saleApplyRecord/importSaleApplyRecord',
    method: 'post',
    data: data
  })
}
