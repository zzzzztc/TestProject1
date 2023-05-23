const fieldMap = [
  { key: 'ordercode', label: '订单号', flag: false },
  { key: 'pnr', label: 'PNR', flag: true },
  { key: 'channel', label: '渠道编号', flag: true },
  { key: 'paytype', label: '支付方式', flag: true },
  { key: 'order_status', label: '订单状态', flag: true },
  { key: 'paymoney', label: '支付金额', flag: true },
  { key: 'paydate', label: '支付创建的日期', flag: false },
  { key: 'paytime', label: '支付返回的日期', flag: false },
  { key: 'paybillno', label: '银行订单号', flag: true },
  { key: 'bank', label: '支付银行', flag: false },
  { key: 'integral_value', label: '支付积分值', flag: false }
]
export default fieldMap
