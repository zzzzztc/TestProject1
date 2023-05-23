const fieldMap = [
  { key: 'ruleCode', label: '规则编码', flag: true },
  { key: 'channel', label: '渠道', flag: true },
  { key: 'aircode', label: '承运航司', flag: false },
  { key: 'fsdate', label: '航班开始日期', flag: false },
  { key: 'fedate', label: '航班截止日期', flag: false },
  { key: 'isinter', label: '国内/国际', flag: false },
  { key: 'flightno', label: '航班号', flag: true },
  { key: 'depAirport', label: '出发地', flag: false },
  { key: 'arrAirport', label: '到达地', flag: false },
  { key: 'seat', label: '舱位', flag: true },
  { key: 'recommendLabel', label: '推荐标签', flag: true },
  { key: 'seatTag', label: '舱位标签', flag: true },
  { key: 'createDate', label: '创建时间', flag: false },
  { key: 'createOpid', label: '创建人', flag: false },
  { key: 'modifyDate', label: '修改时间', flag: false },
  { key: 'modifyOpid', label: '修改时间', flag: false },
  { key: 'seatRemark', label: '舱位备注', flag: false },
  { key: 'validBeginDate', label: '销售开始时间', flag: true },
  { key: 'validEndDate', label: '销售截止时间', flag: true }
]
export default fieldMap
