import * as types from './mutation-types'
const mutations = {
  // 控制左侧导航显示隐藏
  [types.TOGGLE_COLLAPSE] (state) {
    state.isCollapse = !state.isCollapse
  },
  // 更新渠道数据
  [types.UPDATE_CHANNEL_LIST] (state, list) {
    state.channelList = list
  },
  // 更新支付方式数据
  [types.UPDATE_PAYTYPE] (state, list) {
    state.payPlatformServer = list
  },
  // 更新活动场景数据
  [types.UPDATE_DICTSBY_TYPE] (state, list) {
    state.dictsbyTypeList = list
  },
  // 更新优惠券类别数据
  [types.UPDATE_COUPON_TYPE] (state, list) {
    state.couponTypeList = list
  },
  // 更新短信模板数据
  [types.UPDATE_SMS_DICTSBY_TYPE] (state, list) {
    state.smsDictsbyTypeList = list
  },
  // 更新营销活动列表数据
  [types.UPDATE_ACTIVITY_TYPE] (state, list) {
    state.activityTypeList = list
  },
  // 更新模板列表数据
  [types.UPDATE_COUPON_TEMPLET_TYPE] (state, list) {
    state.couponTempletTypeList = list
  },
  // 更新数据字典
  [types.UPDATE_DATA_DICTIONARY] (state, param) {
    state.dataDictionary[param.key] = param.data
  },
  //  更新城市
  [types.UPDATE_CITY] (state, list) {
    state.city = list
  },
  // 更新当前所在导航ID
  [types.UPDATE_FIRST_ACTIVE] (state, activeState) {
    // state.firstActive = activeState.gId
    state.secondActive = activeState.fId
  },
  [types.CLEAR_FIRST_ACTIVE] (state) {
    state.firstActive = 0
    state.secondActive = 0
  },
  //  更新国家
  [types.COUNTRY] (state, list) {
    state.country = list
  },

  // 主题管理
  [types.UPDATE_THEME_LIST] (state, list) {
    state.themeTypeList = list
  },
  // 奖品管理
  [types.UPDATE_PRIZE_LIST] (state, list) {
    state.prizeTypeList = list
  },
  // 兑换可抽奖次数
  [types.UPDATE_EXCHANGE_LIST] (state, list) {
    state.changeTypeList = list
  },
  // 上传图片类型
  [types.UPLOAD_IMG_TYPE] (state, list) {
    state.uploadImgTypeList = list
  },
  // 机型图图片类型
  [types.MODEL_IMG_TYPE] (state, list) {
    state.modelImgTypeList = list
  },
  // 票类型
  [types.YGP_TICKET_TYPE] (state, list) {
    state.ticketTypeList = list
  },
  // 机型
  [types.YGP_PLANE_TYPE] (state, list) {
    state.planeTypeList = list
  },
  // 折扣编号
  [types.YGP_TICKET_DISCOUNT_SELECT] (state, list) {
    state.ticketDiscountList = list
  }
}

export default mutations
