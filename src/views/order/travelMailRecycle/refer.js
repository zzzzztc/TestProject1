const fieldMap = [
  { key: 'orderdate', label: '订单日期', flag: true },
  { key: 'ordercode', label: '订单号', flag: false },
  { key: 'pnr', label: 'pnr', flag: true },
  { key: 'airways', label: '市场方', flag: false },
  { key: 'airline', label: '承运方', flag: false },
  { key: 'channel', label: '渠道类型', flag: true },
  { key: 'sail', label: '航段', flag: false },
  { key: 'initialTktNo', label: '旧票号', flag: false },
  { key: 'eticketno', label: '票号', flag: true },
  { key: 'name', label: '旅客姓名', flag: true },
  { key: 'fnumber', label: '航班号', flag: false },
  { key: 'unexoInsr', label: '航意险', flag: false },
  { key: 'delayInsr', label: '航延险', flag: false },
  { key: 'paymoney', label: '支付金额', flag: false },
  { key: 'integralFare', label: '支付积分', flag: false },
  { key: 'paybillno', label: '银行订单号', flag: false },
  { key: 'refundNo', label: '退票单号', flag: false },
  { key: 'nature', label: '退票性质', flag: true },
  { key: 'status', label: '退票状态', flag: true },
  { key: 'isinter', label: '国内/国际', flag: false },
  { key: 'opAccount', label: '审核人', flag: false },
  { key: 'happendate', label: '申请退票时间', flag: false },
  { key: 'isprint', label: '行程单是否需回收', flag: false },
  { key: 'invalidFlag', label: '行程单状态', flag: true },
	{ key: 'epidemicInsr', label: '疫情隔离险', flag: false },
	{ key: 'refundTicketInsr', label: '航空退票险', flag: false }
]
export default fieldMap
