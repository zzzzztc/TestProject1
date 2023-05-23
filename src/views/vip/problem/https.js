import request from '../../../utils/request'
import qs from 'qs'
//  接口汇总
const http = {
  'del': (questionIds, callback) => {
    request({
      url: 'mid_manager/safeQuestion/updateStatus',
      method: 'post',
      data: qs.stringify(questionIds)
    }).then(res => {
      callback(res)
    }).catch(err => {
      callback(err.message)
    })
  }
}
export default http
