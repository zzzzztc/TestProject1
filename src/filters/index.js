import {
  judgeIdType,
  judgeIsInner,
  judgeOrderType,
  judgeOutTicketStatus,
  judgePasserType,
  judgeRefundStatus,
  ticStatusRelation,
  channelStatus,
  transformPrice,
  payPlatform,
  judgePayLimit,
  dictsByStatus,
  syncProductStatus
} from '../utils/index'

// 处理渠道字段
export function channelMap (channel) {
  return channelStatus(channel)
}

// 处理渠道字段
export function channelM (channel) {
  if (channel) {
    const codeNameMap = {
      1: '手机客户端',
      2: '小程序',
      3: '微信公众号',
      4: '官网',
      5: '管理平台',
      6: '移动端H5'
    }
    let channelNameList = []
    for (let item of channel.split(',')) {
      channelNameList.push(codeNameMap[item])
    }
    return channelNameList.join(',')
  }
  return ''
}

// 处理活动场景字段
export function dictsByTypeMap (type) {
  return dictsByStatus(type)
}

// 截取字符串
export function dateFormat (date) {
  if (date) {
    return date.substring(0, 10)
  }
  return ''
}

// 处理多个PNR
export function pnrFormat (data) {
	if (data.indexOf(',') != -1) {
		const br = document.createElement('div')
		return data.replace(',', '\n')
	}
	return data
}

// 日期格式化
export function dateFormater (date) {
  if (date === '') {
    return '--'
  }
  if (date.length >= 10) {
    let temp = ''
    if (date.split(' ').length > 1) {
      temp = date.split(' ')[0]
    } else if (date.split(',').length > 1) {
      temp = date.split(',')[0]
    } else if (date.split('T').length > 1) {
      temp = date.split('T')[0]
    }
    if (temp.length === 8) {
      let year = temp.substring(0, 4)
      let mou = temp.substring(4, 6)
      let day = temp.substring(6, 8)
      return year + '-' + mou + '-' + day
    }
    if (temp.length === 10) {
      return temp
    }
  }
  if (date.length === 8) {
    let year = date.substring(0, 4)
    let mou = date.substring(4, 6)
    let day = date.substring(6, 8)
    return year + '-' + mou + '-' + day
  }
}

// 处理保险字段
export function insuranceMap (status) {
  let insuranceStatus = ''
  switch (status) {
    case '0':
      insuranceStatus = '购保处理中'
      break
    case '1':
      insuranceStatus = '购买成功'
      break
    case '2':
      insuranceStatus = '退保拒绝'
      break
    case '3':
      insuranceStatus = '退保申请中'
      break
    case '4':
      insuranceStatus = '退保审核'
      break
    case '5':
      insuranceStatus = '退保完成'
      break
    case '6':
      insuranceStatus = '线下退保完成'
      break
    case '7':
      insuranceStatus = '线下理赔'
      break
    case '8':
      insuranceStatus = '退款失败'
      break
    case '10':
      insuranceStatus = '退保处理中'
      break
    case '11':
      insuranceStatus = '已改期'
      break
    case '13':
      insuranceStatus = '退款处理中'
      break
	  case '15':
		  insuranceStatus = '购买失败'
		  break
	  case '16':
		  insuranceStatus = '理赔完成'
		  break
    default:
      insuranceStatus = '--'
  }
  return insuranceStatus
}
// 处理保险审核字段
export function insuranceRefundMap (status) {
  let insuranceRefundStatus = ''
  switch (status) {
    case '0':
      insuranceRefundStatus = '沟通'
      break
    case '1':
      insuranceRefundStatus = '投递'
      break
    case '2':
      insuranceRefundStatus = '退票审核'
      break
    case '3':
      insuranceRefundStatus = '退票完成'
      break
    case '4':
      insuranceRefundStatus = '手工退票'
      break
    case '5':
      insuranceRefundStatus = '手工出票'
      break
    case '6':
      insuranceRefundStatus = '审核拒绝'
      break
    case '7':
      insuranceRefundStatus = '退保'
      break
    case '8':
      insuranceRefundStatus = '退票'
      break
    case '9':
      insuranceRefundStatus = '退积分'
      break
    case '10':
      insuranceRefundStatus = '保险改期'
      break
    default:
      insuranceRefundStatus = '--'
  }
  return insuranceRefundStatus
}

// 支付状态字段
export function payStatusMap (payStatus) {
  let payment = ''
  switch (payStatus) {
    case '0':
      payment = '未支付'
      break
    case '1':
      payment = '支付中'
      break
    case '2':
      payment = '支付成功'
      break
    case '3':
      payment = ' 支付失败'
      break
    default:
      payment = ''
  }
  return payment
}

// 退款状态映射
export function refundStatusMap (status) {
  return judgeRefundStatus(status)
}

//  热门城市
export function fancity (param) {
  let text = ''
  if (param === '1') {
    text = '是'
  } else {
    text = '否'
  }
  return text
}

//  热门城市
export function configStatusMap (param) {
	let text = ''
	if (param === '0') {
		text = '禁用'
	} else {
		text = '启用'
	}
	return text
}

//  url状态Map
export function urlStatusMap (param) {
	let text = ''
	if (param === '0') {
		text = '禁用'
	} else {
		text = '启用'
	}
	return text
}

//  允许越权
export function selectTypeMap (param) {
	let text = ''
	if (param === '2') {
		text = '允许越权'
	} else {
		text = '禁止越权'
	}
	return text
}


// epidType
export function epidTypeMap (val) {
	let returnVal = ''
	if (Number(val) === 0) {
		returnVal = '出港'
	} else if (Number(val) === 1) {
		returnVal = '经停'
	} else if (Number(val) === 2) {
		returnVal = '进港'
	}
	return returnVal
}

// epidType
export function epidStatusMap (val) {
	let returnVal = ''
	if (Number(val) === 0) {
		returnVal = '禁用'
	} else if (Number(val) === 1) {
		returnVal = '启用'
	}
	return returnVal
}

// 场景/精准/空轨
export function senceMap (val) {
	let returnVal = ''
	if (Number(val) === 1) {
		returnVal = '空轨联运弹窗'
	} else if (Number(val) === 0) {
		returnVal = '精准弹窗'
	}
	return returnVal
}

//  国内国际
export function isInter (param) {
  let text = ''
  if (param === '1') {
    text = '国际'
  }
  if (param === '0') {
    text = '国内'
  }
  if (param === '2') {
    text = '国内(际)'
  }
  return text
}

//  支付方式
export function payTypeMap (payType) {
  return payPlatform(payType)
}

//  支付方式(多选)
export function payLimitMap (payType) {
  return judgePayLimit(payType)
}

// 证件类型
export function idTypeMap (type) {
  return judgeIdType(type)
}

// 旅客类型
export function passerTypeMap (type) {
  return judgePasserType(type)
}

// 订单类型
export function orderTypeMap (type) {
  return judgeOrderType(type)
}

// 出票状态
export function outTicketStatusMap (status) {
  return judgeOutTicketStatus(status)
}

// 国内/国际
export function isInnerMap (type) {
  return judgeIsInner(type)
}

// 票面处理状态
export function ticStatusRelationMap (type) {
  return ticStatusRelation(type)
}

// 处理航段信息
export function sailMap (str) {
  if (str) {
    let arr = str.split(',')
    if (arr.length > 1) {
      arr[0] = '(往)' + arr[0]
      arr[1] = '(返)' + arr[1]
    }
    let strNew = arr.join('')
    return strNew
  }
}

// 数值类型格式化为货币类型
export function formatPriceMap (value) {
  return transformPrice(value)
}

export function clevels (txt) {
  let cleName = ''
  switch (txt) {
    case '0':
      cleName = '国家'
      break
    case '1':
      cleName = '省份'
      break
    case '2':
      cleName = '市'
      break
    default:
      cleName = '区/县'
      break
  }
  return cleName
}

export function insuranceType (type) {
  let insTypes = ''
  switch (type) {
    case '0':
      insTypes = '沟通'
      break
    case '1':
      insTypes = '投递'
      break
    case '2':
      insTypes = '退票审核'
      break
    case '3':
      insTypes = '退票完成'
      break
    case '4':
      insTypes = '手工退票'
      break
    case '5':
      insTypes = '手工出票'
      break
    case '6':
      insTypes = '审核拒绝'
      break
    case '7':
      insTypes = '退保'
      break
    case '8':
      insTypes = '退票'
      break
    case '9':
      insTypes = '退积分'
      break
    case '10':
      insTypes = '保险改期'
      break
    default:
      insTypes = '--'
      break
  }
  return insTypes
}

// 优惠券类别
export function couponTypeMap (type) {
  let couponType = ''
  switch (type) {
    case '0':
      couponType = '机票'
      break
    case '1':
      couponType = '贵宾厅'
      break
    case '2':
      couponType = '接送机'
      break
    // case '3':
    //   couponType = '抽奖'
    //   break
    default:
      couponType = ''
  }
  return couponType
}

// 限制条件
export function conditionMap (type) {
  let condition = ''
  switch (type) {
    case '0':
      condition = '不限'
      break
    case '1':
      condition = '本人'
      break
    default:
      condition = ''
  }
  return condition
}

// 是否实名认证
export function authCheckMap (type) {
  let authCheck = ''
  switch (type) {
    case '0':
      authCheck = '不限'
      break
    case '1':
      authCheck = '实名'
      break
    default:
      authCheck = ''
  }
  return authCheck
}

// 取消返券
export function isReturnMap (type) {
  let isReturn = ''
  switch (type) {
    case '0':
      isReturn = '不'
      break
    case '1':
      isReturn = '返券'
      break
    default:
      isReturn = ''
  }
  return isReturn
}

// 有效期类型
export function validityTypeMap (type) {
  let validityType = ''
  switch (type) {
    case '0':
      validityType = '按领取时间'
      break
    case '1':
      validityType = '指定有效期'
      break
    default:
      validityType = ''
  }
  return validityType
}

// 优惠类型1
export function sailTypeMap (type) {
  let sailType = ''
  switch (type) {
    case '1':
      sailType = '直减'
      break
    case '2':
      sailType = '折扣'
      break
    case '3':
      sailType = '免费'
      break
    default:
      sailType = ''
  }
  return sailType
}
// 优惠类型2
export function saleTypeMap (type) {
  let saleType = ''
  switch (type) {
    case '0':
      saleType = '礼包'
      break
    case '1':
      saleType = '单劵'
      break
    case '2':
      saleType = '积分'
      break
    case '3':
      saleType = '返现'
      break
    default:
      saleType = ''
  }
  return saleType
}
// 无限/国际/国内
export function isInterMap (type) {
  let isInter = ''
  switch (type) {
    case '0':
      isInter = '不限'
      break
    case '1':
      isInter = '国内'
      break
    case '2':
      isInter = '国际'
      break
    default:
      isInter = ''
  }
  return isInter
}
// 优惠券状态
export function couponStatusMap (type) {
  let couponStatus = ''
  switch (type) {
    case '0':
      couponStatus = '未领取'
      break
    case '1':
      couponStatus = '已领取'
      break
    case '2':
      couponStatus = '冻结'
      break
    case '3':
      couponStatus = '使用'
      break
    case '4':
      couponStatus = '过期'
      break
    case '5':
      couponStatus = '作废'
      break
    default:
      couponStatus = ''
  }
  return couponStatus
}
// 申请类型
export function applyTypeMap (type) {
  let applyType = ''
  switch (type) {
    case '0':
      applyType = '普通发放'
      break
    case '1':
      applyType = '及时发放'
      break
    default:
      applyType = ''
  }
  return applyType
}

// 领取方式
export function allotTypeMap (type) {
  let allotType = ''
  switch (type) {
    case '1':
      allotType = '用户领取'
      break
    case '2':
      allotType = '后台申领'
      break
    case '3':
      allotType = '系统发放'
      break
    case '4':
      allotType = '券码领取'
      break
    default:
      allotType = ''
  }
  return allotType
}

// 客户类型
export function memberTypeMap (type) {
  let memberType = ''
  switch (type) {
    case '0':
      memberType = '会员'
      break
    case '1':
      memberType = '常旅客'
      break
    default:
      memberType = ''
  }
  return memberType
}

// 发送状态
export function smsStatusMap (type) {
  let smsStatus = ''
  switch (type) {
    case '0':
      smsStatus = '未发送'
      break
    case '1':
      smsStatus = '已发送'
      break
    case '2':
      smsStatus = '发送失败'
      break
    default:
      smsStatus = ''
  }
  return smsStatus
}
// 审批状态
export function approveStatusMap (type) {
  let approveStatus = ''
  switch (type) {
    case '0':
      approveStatus = '草稿'
      break
    case '1':
      approveStatus = '审核中'
      break
    case '2':
      approveStatus = '审核通过'
      break
    case '4':
      approveStatus = '废弃'
      break
    default:
      approveStatus = ''
  }
  return approveStatus
}
// 空轨订单状态
export function subwayStateMap (state) {
  let map = ''
  switch (state) {
    case '':
      map = '未申请'
      break
    case '1':
      map = '已申请'
      break
    case '2':
      map = '审核通过'
      break
    case '3':
      map = '审核拒绝'
      break
    case '6':
      map = '退款完成'
      break
    case '7':
      map = '线下退款完成'
      break
    case '8':
      map = '退款失败'
      break
    case '13':
      map = '退款处理中'
      break
    default:
      map = ''
      break
  }
  return map
}
export function transStatusMap (state) {
  let map = ''
  switch (state) {
    case '0':
      map = '未出票'
      break
    case '001':
      map = '购票成功'
      break
    case '002':
      map = '已使用'
      break
    case 'M01':
      map = '退票申请'
      break
    case 'M02':
      map = '退票完成'
      break
    case 'M03':
      map = '退票异常'
      break
    default:
      map = ''
      break
  }
  return map
}
// 活动类型
export function activityTypeMap (type) {
  let activityType = ''
  switch (type) {
    case '1':
      activityType = '优惠券'
      break
    case '2':
      activityType = '积分'
      break
    case '3':
      activityType = '钱包'
      break
    case '4':
      activityType = '地面服务'
      break
    default:
      activityType = ''
  }
  return activityType
}
// 规则属性
export function levelTypeMap (type) {
  let levelType = ''
  switch (type) {
    case 1:
      levelType = '商品规则'
      break
    case 2:
      levelType = '成功次数规则'
      break
    case 3:
      levelType = '失败次数'
      break
    default:
      levelType = ''
  }
  return levelType
}

// 奖品类型
export function prizeTypeMap (type) {
  let prizeType = ''
  switch (type) {
    case 0:
      prizeType = '谢谢参与'
      break
    case 1:
      prizeType = '添加积分'
      break
    case 2:
      prizeType = '绑定优惠券'
      break
    default:
      prizeType = ''
  }
  return prizeType
}

// 附加商品领取状态
export function syncProductStatusMap (status) {
  return syncProductStatus(status)
}
