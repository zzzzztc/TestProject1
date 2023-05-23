const fieldMap = [
  { key: 'orderdate', label: '订单日期', flag: false },
  { key: 'ordercode', label: '订单号', flag: true },
  { key: 'pnr', label: 'PNR', flag: false },
  { key: 'airways', label: '市场方', flag: false },
  { key: 'airline', label: '承运方', flag: false },
  { key: 'channel', label: '渠道类型', flag: false },
  { key: 'initialTktNo', label: '旧票号', flag: false },
  { key: 'eticketno', label: '票号', flag: true },
  { key: 'name', label: '旅客姓名', flag: false },
  { key: 'fnumber', label: '航班号', flag: false },
  { key: 'unexoInsr', label: '航意险', flag: false },
  { key: 'delayInsr', label: '航延险', flag: false },
  { key: 'paymoney', label: '支付金额', flag: false },
  { key: 'productMoney', label: '附加商品金额', flag: false },
  { key: 'integralFare', label: '支付积分', flag: true },
  { key: 'paybillno', label: '银行订单号', flag: false },
  { key: 'refundNo', label: '退票单号', flag: false },
  { key: 'nature', label: '退票性质', flag: false },
  { key: 'fstatus', label: '退票状态', flag: false },
  { key: 'failReason', label: '退款失败原因', flag: false },
  { key: 'isinter', label: '国内国际', flag: false },
  { key: 'happendate', label: '申请退票时间', flag: false },
  { key: 'cresdatetime', label: '退票审核时间', flag: false },
  { key: 'creqdatetime', label: '退款时间', flag: false },
  { key: 'returnStatus', label: '退积分状态', flag: true },
  //  默认展示
  { key: 'ticStatusRelation', label: '票面处理状态', flag: true },
  { key: 'printFlag', label: '行程单是否需回收', flag: false }
]
// 订单号、票号、积分、退票性质、退票状态、退积分状态
export default fieldMap
