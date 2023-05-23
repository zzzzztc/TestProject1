const insuranceStatus = [
  { id: 0, label: '购保处理中', value: '0' },
  { id: 1, label: '购买成功', value: '1' },
  { id: 2, label: '退保拒绝', value: '2' },
  { id: 3, label: '退保申请中', value: '3' },
  { id: 4, label: '退保审核', value: '4' },
  { id: 5, label: '退保完成', value: '5' },
  { id: 6, label: '线下退保完成', value: '6' },
  { id: 7, label: '线下理赔', value: '7' }
]

const insuranceTypes = [
  { id: '0', label: '航意险', value: 'hangyi' },
  { id: '1', label: '航延险', value: 'hangyan' },
  { id: '2', label: '机票退票险', value: 'refundTicket' },
  { id: '3', label: '疫情隔离险30元', value: 'yiqing30' },
  { id: '4', label: '疫情隔离险40元', value: 'yiqing40' },
  { id: '5', label: '疫情隔离险50元', value: 'yiqing50' }
]

export { insuranceStatus, insuranceTypes }
