const state = {
  tableAttributes: { // 表格属性
    stripe: true, // 斑马纹
    border: true, // 边框
    rowStyle: { padding: '5px 0' },
    cellStyle: { padding: '8px 0' }, // 列边距
    selfHeaderCellStyle: {
      height: '40px',
      padding: '0',
      lineHeight: '40px',
      background: '#f2f6fc',
      fontSize: '14px',
      color: '#606266',
      fontWeight: '600'
    },
    selfCellStyle: {
      fontSize: '14px',
      paddingTop: '13px',
      paddingBottom: '13px',
      lineHeight: '1',
      color: '#333'
    },
    selectionWidth: 48
  },
  pagination: {
    pageSize: 20, // 每页显示条数
    pageSizes: [10, 20, 30, 40, 50] // 每页显示个数选择器的选项设置
  },
  baseUrl: 'https://weapptest.hbhk.com.cn/mid_manager/', // 测试
  // baseUrl: 'http://11.146.124.50:8080/mid_manager2.2/', // 生产
  isCollapse: false, // 左侧导航是否收起
  channelList: [], // 渠道列表
  dictsbyTypeList: [], // 活动场景
  couponTypeList: [], // 优惠券类别
  smsDictsbyTypeList: [], // 短信模板
  activityTypeList: [], // 营销活动
  couponTempletTypeList: [], // 模板
  themeTypeList: [], // 主题管理
  prizeTypeList: [], // 奖品管理
  changeTypeList: [], // 兑换可抽奖次数
  uploadImgTypeList: [], // 上传图片类型
  modelImgTypeList: [], // 机型图图片类型
  ticketTypeList: [], // 票类型
  planeTypeList: [], // 机型
  ticketDiscountList: [], // 折扣编号
  orderType: [ // 订单类型
    { id: 0, value: '0', label: '普通订单' },
    { id: 1, value: '1', label: '积分订单' },
    { id: 2, value: '2', label: '升舱订单' },
    { id: 3, value: '3', label: '非自愿改期' },
    { id: 4, value: '4', label: '员工票' },
    // { id: 5, value: '5', label: '非自愿退票' },
    { id: 6, value: '6', label: '自愿改期' }
  ],
  passerType: [ // 乘机人类型
    { id: 0, value: '0', label: '成人' },
    { id: 1, value: '1', label: '儿童' },
    { id: 2, value: '2', label: '婴儿' }
  ],
  payPlatform: [ // 支付方式 - 本地数据
    { id: 0, value: 'alipay', label: '支付宝' },
    { id: 1, value: 'alipay_pc', label: '支付宝电脑版' },
    { id: 2, value: 'yee_pc', label: '易宝支付电脑版' },
    { id: 3, value: 'union_pc', label: '银联支付电脑版' },
    { id: 4, value: 'weixin', label: '微信支付' },
    { id: 5, value: 'unionpay', label: '银联云闪付' },
    { id: 6, value: 'applepay', label: 'Apple Pay' },
    { id: 7, value: 'unionpayse', label: '安卓PAY' },
    { id: 8, value: 'weixin_h5', label: '微信支付网页版' },
    { id: 9, value: 'alipay_h5', label: '支付宝网页版' },
    { id: 10, value: 'weixin_pc', label: '微信支付电脑版' },
    { id: 11, value: 'alipay_hb', label: '花呗分期' },
    { id: 12, value: 'wallet_pay', label: '钱包支付' }
  ],
  // 支付方式 - 服务端数据， 服务端请求失败则使用本地数据
  payPlatformServer: [],
  // 性别gender、
  // 卡别CARDTYPE、
  // 保险类型insuranceType、
  // 协议场景PROTOCOLSCENE、
  // 产品名称PRODUCTNAME、
  // 时区TIMEZONE、
  // 支付方式PAYMETHOD、
  // 消息类型MSGTYPE、
  // 权限名称AUTHORITY、
  // 折扣类型discountType、
  // 折扣方向discountDirection、
  // 适用运价类型applyFreightType
  dataDictionary: {
    gender: [],
    CARDTYPE: [],
    insuranceType: [],
    PROTOCOLSCENE: [],
    PRODUCTNAME: [],
    TIMEZONE: [],
    PAYMETHOD: [],
    MSGTYPE: [],
    AUTHORITY: [],
    discountType: [],
    discountDirection: [],
    applyFreightType: [],
    SCENE_TYPE: []
  },
  city: [],
  country: [],
  screenWidth: document.documentElement.clientWidth, //  屏幕宽度
  screenHeight: document.documentElement.clientHeight, //  屏幕高度
  firstActive: 0,
  secondActive: 0
}

export default state
