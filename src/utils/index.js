import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { fetchChannelList,
  fetchProductList,
  queryAirCitiesTree,
  ExportAirCity,
  ExportGetFile,
  getAreaSelectByClevel,
  fetchPayTypeList,
  querydictsByType,
  querycouponType,
  queryActivityType,
  queryCouponTempletType,
  queryThemeList,
  queryPrizeList,
  queryExchangeList,
  queryUploadImgType,
  queryModelImgType,
  queryDTicketDiscountSelect } from '../api/index'
import { Message } from 'element-ui'
import store from '../store/index'

export function tableCell () {
  return {
    padding: '4px 0'
  }
}
// 生成随机数
export function randomStr (flag, min, max) {
  let str = ''
  let index = ''
  let range = min
  let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b',
    'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
    'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D',
    'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  // min,max范围内随机的一个数
  if (flag) {
    range = Math.floor(Math.random() * (max - min + 1) + min)
  }
  for (let i = 0; i < range; i++) {
    index = Math.round(Math.random() * (arr.length - 1))
    str += arr[index]
  }
  return str
}

// json导出为excel
export function JsonToXls (data, sheetName, excelName) { // data 为二维数组，存放数据, sheetName一维数组，表名， excelName字符串
  const wopts = { bookType: 'xlsx', bookSST: false, type: 'binary', showGridLines: false }
  let wb = { SheetNames: [], Sheets: {}, Props: {} }
  for (let i = 0; i < data.length; i++) {
    wb.SheetNames[i] = sheetName[i] || 'Sheet' + (i + 1)
    let dataItem = data[i]
    wb.Sheets[wb.SheetNames[i]] = XLSX.utils.json_to_sheet(dataItem)
  }
  let tmpDown = new Blob([s2ab(XLSX.write(wb, wopts))], { type: 'application/octet-stream' })
  FileSaver.saveAs(tmpDown, excelName + '.xls')
}
function s2ab (s) {
  if (typeof ArrayBuffer !== 'undefined') {
    let buf = new ArrayBuffer(s.length)
    let view = new Uint8Array(buf)
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
    return buf
  } else {
    let buf = new Array(s.length)
    for (let i = 0; i !== s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF
    return buf
  }
}
// 返回id数组
export function filterIds (data, key) { // data必须为一维数组，key为id对应的字段
	// console.log(data, key)
  let arr = []
  data.forEach(element => {
    arr.push(element[key])
  })
  return arr
}
// 计算table高度
export function computeTableHeight (scope, ref) {
  let hHeight = scope.$refs[ref].offsetHeight
  let dataViewHeight = document.documentElement.clientHeight - hHeight - 130
  return dataViewHeight
}
// 获取当前日期
export function getCurrentDate (category, startDate) {
  // category 0精确到日，1精确到秒
  let date = new Date()
  let formObj = {
    y: date.getFullYear(),
    m: (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
    d: startDate || (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()),
    h: date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
    i: date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
    s: date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  }
  if (category === 0) {
    return formObj.y + '-' + formObj.m + '-' + formObj.d
  } else {
    return formObj.y + '-' + formObj.m + '-' + formObj.d + ' ' + formObj.h + ':' + formObj.i + ':' + formObj.s
  }
}
// 导出数据转换
export function exportTransform (data, refer) {
  let newData = []
  for (let j = 0; j < data.length; j++) {
    let item = {}
    for (let i = 0; i < refer.length; i++) {
      item[refer[i].label] = data[j][refer[i].key]
    }
    newData.push(item)
  }
  return newData
}
//  判空
export function isEmpty (str) {
  if (str === null || typeof (str) === 'undefined' || str === 'null' || str === '(null)' || str === 'undefined' || str === 'NULL' || str === undefined || str.length === 0) {
    return true
  }
  if (typeof (str) === 'string' && str.replace(/(^s*)|(s*$)/g, '').length === 0) {
    return true
  }
  if (typeof (str) === 'number' && str === 0) {
    return true
  }
  return false
}
// 退款审核
export function judgeRefundStatus (status) { // 补退款状态判断
  let statusName = ''
  switch (status) {
    case '0':
      statusName = '未申请'
      break
    case '1':
      statusName = '已申请'
      break
    case '2':
      statusName = '一审通过'
      break
    case '3':
      statusName = '一审拒绝'
      break
    case '4':
      statusName = '二审通过'
      break
    case '5':
      statusName = '二审拒绝'
      break
    case '6':
      statusName = '退款完成'
      break
    case '7':
      statusName = '线下退款完成'
      break
    case '8':
      statusName = '退款失败'
      break
    case '9':
      statusName = '退票申请失败'
      break
    case '13':
      statusName = '退款处理中'
      break
    default:
      statusName = ''
  }
  return statusName
}
// 证件类型
export function judgeIdType (type) {
  let idName = ''
  switch (type) {
    case '0':
      idName = '居民身份证'
      break
    case '1':
      idName = '军官证'
      break
    case '2':
      idName = '警官证'
      break
    case '3':
      idName = '士兵证'
      break
    case '4':
      idName = '有效护照'
      break
    case '5':
      idName = '其他'
      break
    case '03':
      idName = '港澳通行证'
      break
    case '04':
      idName = '台湾通行证'
      break
    case '05':
      idName = '回乡证'
      break
    case '06':
      idName = '台胞证'
      break
    case '7':
      idName = '港澳居民居住证'
      break
    case '8':
      idName = '台湾居民居住证'
      break
  }
  return idName
}
// 旅客类型
export function judgePasserType (type) {
  let passer = ''
  switch (type) {
    case '0':
      passer = '成人'
      break
    case '1':
      passer = '儿童'
      break
    case '2':
      passer = '婴儿'
      break
    default:
      passer = ''
      break
  }
  return passer
}
// 订单类型
export function judgeOrderType (type) {
  let orderType = ''
  switch (type) {
    case '0':
      orderType = '现金订单'
      break
    case '1':
      orderType = '积分订单'
      break
    case '2':
      orderType = '升舱订单'
      break
    case '3':
      orderType = '非自愿改期'
      break
  }
  return orderType
}
// 支付平台
export function payPlatform (type) {
  let payName = ''
  switch (type) {
    case 'weixin':
      payName = '微信'
      break
    case 'alipay':
      payName = '支付宝'
      break
    case 'unionpay':
      payName = '银联云闪付'
      break
    case 'applepay':
      payName = 'Apple Pay'
      break
    case 'unionpayse':
      payName = '安卓PAY'
      break
    case 'weixin_h5':
      payName = '微信支付网页版'
      break
    case 'alipay_h5':
      payName = '支付宝网页版'
      break
    case 'union_pc':
      payName = '银联支付电脑版'
      break
    case 'weixin_pc':
      payName = '微信支付电脑版'
      break
    case 'alipay_pc':
      payName = '支付宝电脑版'
      break
    case 'yee_pc':
      payName = '易宝支付电脑版'
      break
    case 'alipay_hb':
      payName = '花呗分期'
      break
  }
  return payName
}
// 出票状态
export function judgeOutTicketStatus (status) {
  let statusName = ''
  switch (status) {
    case '0':
      statusName = '等待提交'
      break
    case '1':
      statusName = '已订座'
      break
    case '2':
      statusName = '已出票'
      break
    case '3':
      statusName = '出票失败'
      break
    case '4':
      statusName = '已取消'
      break
    case '5':
      statusName = '已改升'
      break
    case '6':
      statusName = '航信防占座'
      break
    default:
      statusName = ''
  }
  return statusName
}
// 国内国际
export function judgeIsInner (type) {
  let isInner = ''
  if (type === '0') {
    isInner = '国内'
  } else {
    isInner = '国际'
  }
  return isInner
}
// 票面处理状态
export function ticStatusRelation (type) {
  let str = ''
  switch (type) {
    case '1':
      str = '待处理'
      break
    case '2':
      str = '人工TSU'
      break
    case '3':
      str = '自动TSU'
      break
    default:
      str = ''
  }
  return str
}
// 渠道
export function channelStatus (channel) {
  if (channel) {
    const codeNameMap = {
      app: '手机客户端',
      mini: '小程序',
      wx: '微信公众号',
      web: '官网',
      manager: '管理平台',
      h5: '移动端H5'
    }
    let channelNameList = []
    for (let item of channel.split(',')) {
      channelNameList.push(codeNameMap[item])
    }
    const channelStr = channelNameList.join(',')
    if (!channelStr) {
      return channel
    }
    return channelNameList.join(',')
  }
  return ''
}
// 支付方式（多选）
export function judgePayLimit (type) {
  if (type) {
    const codeNameMap = {
      weixin: '微信',
      alipay: '支付宝',
      unionpay: '银联云闪付',
      applepay: 'Apple Pay',
      unionpayse: '安卓PAY',
      weixin_h5: '微信支付网页版',
      alipay_h5: '支付宝网页版',
      union_pc: '银联支付电脑版',
      weixin_pc: '微信支付电脑版',
      alipay_pc: '支付宝电脑版',
      yee_pc: '易宝支付电脑版'
    }
    let payNameList = []
    for (let item of type.split(',')) {
      payNameList.push(codeNameMap[item])
    }
    return payNameList.join(',')
  }
  return ''
}
// 活动场景状态
export function dictsByStatus (type) {
  let str = ''
  switch (type) {
    case 'registAuth':
      str = '实名认证'
      break
    case 'buyTicket':
      str = '购票成功'
      break
    case 'luckDraw':
      str = '会员抽奖'
      break
    case 'sjwVip':
      str = '石家庄贵宾室'
      break
    case 'freeTicket':
      str = '免票赠送'
      break
    case 'birthday':
      str = '生日赠送'
      break
    case 'memberDay':
      str = '会员日赠送'
      break
    case 'handCode':
      str = '异业赠送'
      break
    case 'checkIn':
      str = '值机成功'
      break
    default:
      str = ''
  }
  return str
}
//  data选中的数组 state总状态
export function chanenl (data, state) {
  if (!data.length) {
    Message.error('请查询出记录再导出')
    return false
  }
  let arr = []
  for (let item of data) {
    let sp = item.channel.split(',')
    for (let itemi of sp) {
      for (let items of state) {
        if (itemi === items.chalCode) {
          arr.push(items.chalName)
          item.channel = arr.join(',')
        }
      }
    }
    arr = []
  }
  return data
}
export function excelList (param, that) {
  if (param.data) {
    if (parseInt(param.data.end) > 65000) {
      that.$prompt('当前数据量超过65000条，请输入要导出的条数', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[1-9]+[0-9]*]*$/,
        inputErrorMessage: '请输入正确的条数',
        inputValidator: (value) => { // 点击按钮时，对文本框里面的值进行验证
          if (value <= 0 || parseInt(value) >= param.data.end) {
            return '请输入正确的条数'
          }
        },
        callback: function (action, instance) {
          if (action === 'confirm') {
            param.data.end = instance.inputValue
            ExportAirCity(param).then(res => {
              download(res, param)
            }).catch(err => {
              this.$message.error(err.message)
            })
          } else {
            that.$message({
              type: 'info',
              message: '取消修改'
            })
          }
        }
      })
    } else {
      ExportAirCity(param).then(res => {
        download(res, param)
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  } else {
    ExportGetFile(param).then(res => {
      download(res, param)
    }).catch(err => {
      this.$message.error(err.message)
    })
  }
}
//  导出
function download (res, param) {
  let url = window.URL.createObjectURL(new Blob([res]))
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', `${param.name}.${param.type}`)
  document.body.appendChild(link)
  link.click()
}
// 处理组件名称
// 将组件path转为name,标记是否适用于keep-alive
// /userInfo -> UserInfo
export function transformComName (path) {
  let name = path.substring(1)
  let fChart = name.slice(0, 1).toUpperCase()
  let newName = fChart + name.slice(1)
  return newName
}
export function transformPrice (money) { // 数值类型格式化为货币类型
	money = String(money)
	if (money && money !== null && money.indexOf('.') >= 0) {
    let left = money.split('.')[0]
    let right = money.split('.')[1]
    right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : '.00'
    let temp = left.split('').reverse().join('').match(/(\d{1,3})/g)
    return (Number(money) < 0 ? '-' : '') + temp.join(',').split('').reverse().join('') + right
  } else if (money === 0) { //  注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
    return '0.00'
  } else {
    return money
  }
}
export function routerMatch (treeList, path) { // 当前路由与treeList匹配，查出父层id,用以激活当前选中路由及父层状态
  for (let i = 0; i < treeList.length; i++) {
    for (let j = 0; j < treeList[i].children.length; j++) {
      if (treeList[i].children[j].attributes) {
        if (treeList[i].children[j].attributes.url === path) {
          return { gId: treeList[i].id, compName: treeList[i].children[j].attributes.name }
        }
      } else {
        // 继续循环
        for (let m = 0; m < treeList[i].children[j].children.length; m++) {
          if (treeList[i].children[j].children[m].attributes.url === path) {
            return { fId: treeList[i].children[j].id, gId: treeList[i].id, compName: treeList[i].children[j].children[m].attributes.name }
          }
        }
      }
    }
  }
}
//  attrName属性名、data表格checkbox的选中状态，存储表格的checbox选中的状态
export function setDynamicTableCulmae (attrName, data) {
  let tableCulmae = JSON.parse(localStorage.getItem('tableCulmae'))
  if (!tableCulmae) {
    tableCulmae = {}
  }
  tableCulmae[attrName] = data
  localStorage.setItem('tableCulmae', JSON.stringify(tableCulmae))
}
//  parem当前页面表格属性名，获取当前表格checkbox选中的状态
export function getDynamicTableCulmae (parem) {
  let tableCulmae = JSON.parse(localStorage.getItem('tableCulmae'))
  if (tableCulmae && tableCulmae[parem]) {
    return tableCulmae[parem]
  } else {
    return []
  }
}
//  当前表格checkbox渲染
export function checkLists (paema, list) { //  checkedArr checkbox数据源
  let checkObj = {}
  let checkFlag = false
  let checkArr = getDynamicTableCulmae(paema)
  if (checkArr.length === list.length) {
    checkFlag = true
  }
  for (let i = 0; i < checkArr.length; i++) {
    let name = checkArr[i]
    checkObj[name] = true
  }
  return {
    checkFlag,
    checkObj,
    checkArr
  }
}
// 获取当前路由对应的导航名称
export function getRouteName (path) {
  let treeList = JSON.parse(window.localStorage.getItem('menuList')) || []
  for (let i = 0; i < treeList.length; i++) {
    for (let j = 0; j < treeList[i].children.length; j++) {
      if (treeList[i].children[j].attributes) {
        if (treeList[i].children[j].attributes.url === path) {
          return treeList[i].children[j].attributes.name
        }
      } else {
        for (let m = 0; m < treeList[i].children[j].children.length; m++) {
          if (treeList[i].children[j].children[m].attributes.url === path) {
            return treeList[i].children[j].children[m].attributes.name
          }
        }
      }
    }
  }
  return name
}
// 设置COOKIE
export function setCookie (name, value) {
  let exp = new Date()
  exp.setTime(exp.getTime() + 60 * 1000 * 60 * 2)
  document.cookie = name + '=' + value + ';expires=' + exp.toUTCString()
}
// 读取cookie
export function getCookie (name) {
  let cookie = document.cookie
  let state = false
  if (cookie.length) {
    let list = cookie.split(';')
    let arr = []
    for (let i = 0; i < list.length; i++) {
      arr[i] = list[i].split('=')
    }
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        let cook = arr[i][0].trim()
        if (cook === name) {
          state = decodeURIComponent(arr[i][1])
          break
        }
      }
    }
    if (!state) {
      return null
    } else {
      return state
    }
  } else {
    return null
  }
}
export function getObjectURL (file) {
  let url = null
  if (window.createObjectURL !== undefined) { // basic
    url = window.createObjectURL(file)
  } else if (window.URL !== undefined) { // mozilla(firefox)
    url = window.URL.createObjectURL(file)
  } else if (window.webkitURL !== undefined) { // webkit or chrome
    url = window.webkitURL.createObjectURL(file)
  }
  return url
}

// 获取渠道列表并存储
export function getChannelList () {
  fetchChannelList().then(res => {
    store.commit('UPDATE_CHANNEL_LIST', res.rows)
  }).catch(err => {
    Message.error(err.message)
  })
}
export function getPayMethods () {
  fetchPayTypeList().then(res => {
    store.commit('UPDATE_PAYTYPE', res.row)
  }).catch(err => {
    Message.error(err.message)
  })
}
// 活动场景数据请求
export function getDictsByType () {
  querydictsByType({ type: 'CUTPOINT' }).then(res => {
    store.commit('UPDATE_DICTSBY_TYPE', res.rows)
  }).catch(err => {
    Message.error(err.message)
  })
}
// 优惠券类别数据请求
export function getcouponType () {
  querycouponType({ type: 'couponType' }).then(res => {
    store.commit('UPDATE_COUPON_TYPE', res.rows)
  }).catch(err => {
    Message.error(err.message)
  })
}
// 短信模板数据请求
export function getSmsDictsByType () {
  querydictsByType({ type: 'COUPONSMSTMEPLET' }).then(res => {
    store.commit('UPDATE_SMS_DICTSBY_TYPE', res.rows)
  }).catch(err => {
    Message.error(err.message)
  })
}
// 营销活动数据请求
export function getActivityType () {
  queryActivityType().then(res => {
    store.commit('UPDATE_ACTIVITY_TYPE', res.rows)
  }).catch(err => {
    Message.error(err.message)
  })
}
// 模板数据请求
export function getCouponTempletType () {
  queryCouponTempletType().then(res => {
    store.commit('UPDATE_COUPON_TEMPLET_TYPE', res.rows)
  }).catch(err => {
    Message.error(err.message)
  })
}
// 主题管理数据请求
export function getThemeList () {
  let param = {
    description: '',
    enabled: '',
    name: '',
    isJson: true
  }
  queryThemeList(param).then(res => {
    store.commit('UPDATE_THEME_LIST', res.data.contents)
  }).catch(err => {
    Message.error(err.data || err.message)
  })
}
// 奖品管理数据请求
export function getPrizeList () {
  let param = {
    activityId: '',
    description: '',
    enabled: '',
    name: '',
    isJson: true
  }
  queryPrizeList(param).then(res => {
    store.commit('UPDATE_PRIZE_LIST', res.data.contents)
  }).catch(err => {
    Message.error(err.data || err.message)
  })
}
export function getAreaSelectByClevels () {
  getAreaSelectByClevel({
    clevel: '0',
    parentId: ''
  }).then(res => {
    store.commit('COUNTRY', res.rows)
  })
}
//  获取城市
export function getCity (name) {
  queryAirCitiesTree({}).then(res => {
    store.commit('UPDATE_CITY', res.treeList)
  })
}
// 兑换可抽奖次数
export function getExchangeList () {
  let param = {
    activityId: '',
    enabled: '',
    name: '',
    isJson: true
  }
  queryExchangeList(param).then(res => {
    store.commit('UPDATE_EXCHANGE_LIST', res.data.contents)
  }).catch(err => {
    Message.error(err.data || err.message)
  })
}
//  上传图片类型
export function getUploadImgType () {
  queryUploadImgType({ type: 'PICTYPE' }).then(res => {
    store.commit('UPLOAD_IMG_TYPE', res.rows)
  }).catch(err => {
    Message.error(err.message)
  })
}
//  机型图图片类型
export function getModelImgType () {
  queryModelImgType({ picType: 'flightPicType' }).then(res => {
    store.commit('MODEL_IMG_TYPE', res.rows)
  }).catch(err => {
    Message.error(err.message)
  })
}
// 获取数据字典内容
export function getDataDictionary (name) {
  fetchProductList({ type: name }).then(res => {
    let data = {
      key: name,
      data: res.rows
    }
    // console.log(data)
    store.commit('UPDATE_DATA_DICTIONARY', data)
  })
}
//  票类型
export function getTicketType () {
  querydictsByType({ type: 'YGP_TICKET_TYPE' }).then(res => {
    store.commit('YGP_TICKET_TYPE', res.rows)
  }).catch(err => {
    Message.error(err.message)
  })
}
//  机型
export function getPlaneType () {
  querydictsByType({ type: 'YGP_PLANE_TYPE' }).then(res => {
    store.commit('YGP_PLANE_TYPE', res.rows)
  }).catch(err => {
    Message.error(err.message)
  })
}
// 折扣编号
export function getDTicketDiscountSelect () {
  queryDTicketDiscountSelect().then(res => {
    store.commit('YGP_TICKET_DISCOUNT_SELECT', res.rows)
  }).catch(err => {
    Message.error(err.message)
  })
}
// 附加商品领取状态
export function syncProductStatus (status) {
  let statusMap = ''
  switch (status) {
    case '0':
      statusMap = '初始'
      break
    case '1':
      statusMap = '未支付'
      break
    case '2':
      statusMap = '已支付'
      break
    case '3':
      statusMap = ''
      break
    case '4':
      statusMap = '已取消'
      break
    case '5':
      statusMap = '已退货'
      break
  }
  return statusMap
}
// 日期格式化
export function dateFormater (date) {
  // console.log(date)
  if (date === '' || !date) {
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
