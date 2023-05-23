const fieldMap = [
  { key: 'orderdate', label: '订单日期', flag: true },
  { key: 'ordercode', label: '订单号', flag: true },
  { key: 'pnr', label: 'pnr', flag: true },
  { key: 'airways', label: '市场方', flag: false },
  { key: 'airline', label: '承运方', flag: false },
  { key: 'channel', label: '渠道类型', flag: true },
  { key: 'sail', label: '航段', flag: true },
  { key: 'initialTktNo', label: '旧票号', flag: false },
  { key: 'eticketno', label: '票号', flag: true },
  { key: 'name', label: '旅客姓名', flag: false },
  { key: 'fnumber', label: '航班号', flag: false },
  { key: 'unexoInsr', label: '航意险', flag: false },
  { key: 'delayInsr', label: '航延险', flag: false },
  //  默认展示
  { key: 'fmoney', label: '优惠金额', flag: false },
  { key: 'paymoney', label: '支付金额', flag: true },
  { key: 'productMoney', label: '附加商品金额', flag: false },
  { key: 'actualRefundMoney', label: '应退金额', flag: true },
  { key: 'integralFare', label: '支付积分', flag: false },
  { key: 'paytype', label: '支付方式', flag: false },
  { key: 'paybillno', label: '银行订单号', flag: false },
  { key: 'outRefundNo', label: '退款银行订单号', flag: false },
  { key: 'refundNo', label: '退票单号', flag: false },
  { key: 'nature', label: '退票性质', flag: false },
  { key: 'tstatus', label: '退票状态', flag: true },
  { key: 'secondAuditOpid', label: '二审审核人', flag: false },
  { key: 'secondAuditDate', label: '二审审核时间', flag: false },
  { key: 'failReason', label: '退款失败原因', flag: false },
  { key: 'isinter', label: '国内/国际', flag: false },
  { key: 'happendate', label: '退票申请时间', flag: false },
  { key: 'cresdatetime', label: '退票审核时间', flag: false },
  { key: 'creqdatetime', label: '财务退款时间', flag: false },
  { key: 'returnIntegralStatus', label: '退积分状态', flag: false },
  { key: 'ticStatusRelation', label: '票面处理状态', flag: false },
  { key: 'refundBatchNo', label: '退款批次号', flag: false },
  { key: 'printFlag', label: '行程单是否需回收', flag: false },
  { key: 'walletMoney', label: '红包金额', flag: false },
  { key: 'actualRefundWallet', label: '红包退款', flag: false },
  { key: 'refundWalletCharge', label: '红包手续费', flag: false },
	{ key: 'epidemicInsr', label: '疫情隔离险', flag: false },
	{ key: 'refundTicketInsr', label: '航空退票险', flag: false }
]
export default fieldMap
