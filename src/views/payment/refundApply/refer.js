const fieldMap = [
  { key: 'channel', label: '渠道编号', flag: true },
  { key: 'ordercode', label: '订单编号', flag: false },
  { key: 'creadate', label: '订单日期', flag: true },
  { key: 'pnr', label: 'pnr', flag: true },
  { key: 'conts_name', label: '联系人姓名', flag: true },
  { key: 'conts_mobile', label: '联系人电话', flag: false },
  { key: 'order_status', label: '订单状态', flag: true },
  { key: 'paytype', label: '支付方式', flag: false },
  { key: 'paystatus', label: '支付状态', flag: true },
  { key: 'paybillno', label: '银行订单号', flag: true },
  { key: 'pmoney', label: '支付金额', flag: true },
  { key: 'refund_money', label: '可退金额', flag: false },
  { key: 'refund_status', label: '差错退款状态', flag: false },
  { key: 'wallet_money', label: '红包金额', flag: false }
]
export default fieldMap
