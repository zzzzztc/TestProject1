const fieldMap = [
  // { key: 'orderdate', label: '订单日期', flag: false }
  { key: 'refundNo', label: '退单号', flag: true },
  { key: 'happendate', label: '退票申请日期', flag: true },
  { key: 'channel', label: '退票申请渠道', flag: true },
  { key: 'initialTktNo', label: '原票号', flag: false },
  { key: 'isinter', label: '国内/国际', flag: true },
  { key: 'name', label: '姓名', flag: true },
  { key: 'fnumber', label: '航班号', flag: true },
  { key: 'afrom', label: '航段', flag: true },
  { key: 'seat', label: '舱位', flag: true },
  { key: 'ordercode', label: '关联订单号', flag: true },
  { key: 'isIntegral', label: '关联订单类型', flag: true },
  { key: 'eticketno', label: '关联票号', flag: true },
  { key: 'ticStatusRelation', label: '票面处理状态', flag: true },
  { key: 'opAccount', label: '操作人', flag: false },
  { key: 'opDate', label: '操作时间', flag: false }
]
export default fieldMap
