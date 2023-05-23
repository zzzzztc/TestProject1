const PayThenSeat = [
	{
		path: '/antiScheduledReport',
		name: 'AntiScheduledReport',
		component: () => import('@/views/systemManage/payThenSeat/antiScheduledReport/index.vue'),
		meta: {
			title: '预定拦截报表'
		}
	},
	{
		path: '/coverSeatReport',
		name: 'CoverSeatReport',
		component: () => import('@/views/systemManage/payThenSeat/coverSeatReport/index.vue'),
		meta: {
			title: '补位/K座报表'
		}
	},
	{
		path: '/noSeatReport',
		name: 'NoSeatReport',
		component: () => import('@/views/systemManage/payThenSeat/noSeatReport/index.vue'),
		meta: {
			title: 'NO座报表'
		}
	},
	{
		path: '/payThenSeatManage',
		name: 'PayThenSeatManage',
		component: () => import('@/views/systemManage/payThenSeat/payThenSeatManage/index.vue'),
		meta: {
			title: '先支付后占座管理'
		}
	}
]

export default PayThenSeat
