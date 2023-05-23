const fieldMap = [
  { key: 'username', label: '联系姓名', flag: true },
  { key: 'mobile', label: '联系电话', flag: false },
  { key: 'ordercode', label: '订单号', flag: true },
  { key: 'channel', label: '渠道类型', flag: true },
  { key: 'isInter', label: '国内/国际', flag: true },
  // { key: 'paytype', label: '支付通道', flag: false },
  { key: 'paystate', label: '支付方式', flag: false },
  { key: 'paybillno', label: '银行订单号', flag: true },
  { key: 'payserial', label: '交易流水号', flag: false },
  { key: 'bankName', label: '支付银行', flag: false },
  { key: 'accno', label: '支付卡号', flag: false },
  { key: 'paymoney', label: '支付金额', flag: true },
  { key: 'walletAmount', label: '钱包支付金额', flag: false },
  { key: 'remark', label: '备注', flag: true },
  { key: 'paydate', label: '支付时间', flag: false },
  { key: 'paystatus', label: '支付结果', flag: false }
]
export default fieldMap
