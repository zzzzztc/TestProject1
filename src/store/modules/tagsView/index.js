import { transformComName } from '../../../utils/index'
import * as types from './mutation-types'
let tagsView = {
  state: {
    tagsList: [
    ],
    aliveView: [],
    num: 8,
    order: {
      // orderDate: [], // 订单信息
      // firstPassageData: [], // 第一航段
      // checkFlightSegment: [], // 第二航段
      // insuranceInfoData: [], // 保险信息
      // travelMailData: [], // 行程单信息
      // upgradeData: [], // 升舱
      // getOrderProcessingList: [] //  订单操作日志
    }
  },
  mutations: {
    [types.ORDER_LIST] (state, data) {
      state.order = data
    },
    [types.GET_TAGS_NUM] (state, num) { // 计算tags-view最多存放几个tags
      state.num = num
    },
    [types.ADD_VIEW_LIST] (state, routeInfo) {
      // console.log(transformComName(routeInfo.path))
      if (!state.tagsList.length) {
        state.tagsList.push(routeInfo)
        state.aliveView.push(transformComName(routeInfo.path))
      } else {
        let status = state.tagsList.some(item => {
          return item.path === routeInfo.path
        })
        if (!status) {
          let len = state.tagsList.length
          if (len >= state.num) {
            state.tagsList.splice(0, 1)
            state.aliveView.splice(0, 1)
          }
          state.tagsList.push(routeInfo)
          state.aliveView.push(transformComName(routeInfo.path))
        }
      }
    },
    [types.REMOVE_VIEW_LIST] (state, routeInfo) {
      for (let i = 0; i < state.tagsList.length; i++) {
        if (routeInfo.path === state.tagsList[i].path) {
          state.tagsList.splice(i, 1)
          state.aliveView.splice(i, 1)
          break
        }
      }
    },
    [types.CLEAR_VIEW_LIST] (state) {
      state.tagsList = []
      state.aliveView = []
    },
    [types.CLEAR_PARENT_ID] (state) {

    }
  }
}
export default tagsView
