const fieldMap = [
  { key: 'order_code', label: '订单编号', flag: false },
  { key: 'apply_no', label: '差错退款申请单号', flag: false },
  { key: 'channel', label: '渠道编号', flag: true },
  { key: 'pnr', label: 'pnr', flag: true },
  { key: 'pay_type', label: '支付方式', flag: false },
  { key: 'refund_amounts', label: '应退金额', flag: true },
  { key: 'refund_amounts_actual', label: '退款金额', flag: false },
	{ key: 'wallet_money', label: '红包金额', flag: false },
	{ key: 'refund_amounts_date', label: '退款日期', flag: false },
  { key: 'rstatus', label: '退款状态', flag: true },
  // { key: 'refundAmountsDate', label: '退款确认时间', flag: false },
  { key: 'failReason', label: '退款失败原因', flag: false },
  { key: 'refundBatchNo', label: '退款批次号', flag: false },
  { key: 'passenger', label: '联系人姓名', flag: true },
  { key: 'phone', label: '联系人电话', flag: false },
  { key: 'paybillno', label: '银行订单号', flag: false },
  { key: 'paymoney', label: '支付金额', flag: false },
  { key: 'paystatus', label: '支付状态', flag: false },
  { key: 'apply_date', label: '申请时间', flag: false },
  { key: 'apply_op', label: '申请人', flag: false },
  { key: 'apply_remark', label: '申请备注', flag: false },
  { key: 'audit_date', label: '审核时间', flag: false },
  //  默认展示
  { key: 'audit_op', label: '审核人', flag: false },
  { key: 'audit_remark', label: '审核备注', flag: false }

]
export default fieldMap
