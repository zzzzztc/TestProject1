const delayFlight = [
  {
    path: '/flightDelayProveList',
    name: 'FlightDelayProveList',
    component: () => import('@/views/delayFlightManage/delayFlightRecord/index.vue'),
    meta: {
      title: '航班延误证明记录查询',
      parentId: '402'
    }
  },
  {
    path: '/flightDelayChannel',
    name: 'FlightDelayChannel',
    component: () => import('@/views/delayFlightManage/delayFlightData/index.vue'),
    meta: {
      title: '航班延误证明参数管控',
      parentId: '402'
    }
  }
]

export default delayFlight
