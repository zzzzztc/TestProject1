const fieldMap = [
  { key: 'channel', label: '渠道类型', flag: true },
  { key: 'ordercode', label: '订单号', flag: true },
  { key: 'refundNo', label: '退票单号', flag: false },
  { key: 'initialTktNo', label: '旧票号', flag: false },
  { key: 'eticketno', label: '票号', flag: true },
  { key: 'pnr', label: 'PNR', flag: true },
  { key: 'fbc', label: '票价级别', flag: false },
  { key: 'airways', label: '市场方', flag: false },
  { key: 'airline', label: '承运方', flag: false },
  { key: 'orderdate', label: '订单日期', flag: true },
  { key: 'paybillno', label: '银行订单号', flag: false },
  { key: 'outRefundNo', label: '退款银行订单号', flag: false },
  { key: 'name', label: '旅客姓名', flag: false },
  { key: 'fnumber', label: '航班号', flag: false },
  { key: 'sail', label: '航段', flag: true },
  { key: 'unexoInsr', label: '航意险', flag: false },
  { key: 'delayInsr', label: '航延险', flag: false },
  { key: 'fmoney', label: '优惠金额', flag: false },
  { key: 'paymoney', label: '支付金额', flag: true },
  { key: 'integralFare', label: '支付积分', flag: false },
  { key: 'isinter', label: '国内/国际', flag: false },
  { key: 'nature', label: '退票性质', flag: false },
  { key: 'status', label: '退票状态', flag: true },
  { key: 'failReason', label: '退款失败原因', flag: false },
  { key: 'happendate', label: '申请退票时间', flag: false },
  { key: 'pnrClearTime', label: 'pnr取消时间', flag: false },
  { key: 'clearTimeDiff', label: 'pnr取消时间差', flag: false },
	{ key: 'firstAuditOpname', label: '一审审核人', flag: false },
	{ key: 'firstAuditAccount', label: '一审审核人工号', flag: false },
	{ key: 'secondAuditOpname', label: '二审审核人', flag: false },
	{ key: 'secondAuditAccount', label: '二审审核人工号', flag: false },
  { key: 'cresdatetime', label: '退票审核时间', flag: false },
  { key: 'creqdatetime', label: '退款时间', flag: false },
  { key: 'returnIntegralStatus', label: '退积分状态', flag: false },
  { key: 'ticStatusRelation', label: '票面处理状态', flag: false },
  { key: 'startStationName', label: '地铁航程', flag: true },
  { key: 'payAmount', label: '地铁票价格', flag: true },
  { key: 'transStatus', label: '地铁票状态', flag: true },
  { key: 'iatatax', label: '杂项税', flag: false },
  { key: 'railwayMoney', label: '地铁票金额', flag: false },
  { key: 'upgradMoney', label: '票价差金额', flag: false },
  { key: 'outdatetime', label: '变更时间', flag: false },
  { key: 'changeFee', label: '变更费率', flag: false },
  { key: 'changeMoney', label: '改期费金额', flag: false },
  { key: 'initialChannel', label: '原票销售渠道', flag: false },
  { key: 'initialOffice', label: '原票代理人航协号', flag: false },
  { key: 'initialFare', label: '原票票面金额', flag: false },
  { key: 'initialAirportTax', label: '原票机建', flag: false },
  { key: 'initialFuelTax', label: '原票燃油', flag: false },
  { key: 'agencyFee', label: '原票代理费金额', flag: false },
  { key: 'walletMoney', label: '红包金额', flag: false },
	{ key: 'epidemicInsr', label: '疫情隔离险', flag: false },
	{ key: 'refundTicketInsr', label: '航空退票险', flag: false }
]
export default fieldMap
