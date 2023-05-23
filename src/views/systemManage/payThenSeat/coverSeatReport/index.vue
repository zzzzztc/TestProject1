<template>
  <div id="CoverSeatReport" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="用户类型" clearable v-model="filter.usertype">
            <el-option label="普通会员" value="0"></el-option>
            <el-option label="常旅客" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="用户号码" v-model="filter.userid" clearable ></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="渠道" clearable v-model="filter.channel">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="处理方式" clearable v-model="filter.actionCodeCover">
            <el-option label="补位" value="HK"></el-option>
            <el-option label="K座" value="KK"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="PNR" v-model="filter.pnr" clearable ></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="订单号" v-model="filter.ordercode" clearable ></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.startdate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.enddate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="截止日期">
          </el-date-picker>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="fetchList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
<!--        <el-button type="success" size="medium" :disabled="!tableList.total" @click="exportExcel">导出</el-button>-->
        <el-button type="success" size="medium" :disabled="!tableList.total" @click="exportExcel">导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="tableList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
          <!--          <el-table-column label="序号" type="index" width="50"></el-table-column>-->
          <el-table-column label="用户类型" prop="usertype">
            <template slot-scope="scope">
                <span v-if="scope.row.usertype && scope.row.usertype === '0'">
                  普通会员
                </span>
              <span v-else>常旅客</span>
            </template>
          </el-table-column>
          <el-table-column label="用户号码" prop="userid" min-width="110"></el-table-column>
          <el-table-column label="订单号" prop="ordercode" min-width="160"></el-table-column>
          <el-table-column label="处理方式" prop="actionCodeCover">
            <template slot-scope="scope">
                <span v-if="scope.row.actionCodeCover && scope.row.actionCodeCover === 'HK'">
                  补位
                </span>
                <span v-if="scope.row.actionCodeCover && scope.row.actionCodeCover === 'KK'">
                  K座
                </span>
<!--              <span v-else>{{scope.row.actionCodeCover}}</span>-->
            </template>
          </el-table-column>
          <el-table-column label="PNR" align="center" min-width="90">
            <template slot-scope="scope">
                <span v-if="scope.row.pnr && scope.row.pnr !== 'null'" style="white-space: pre-line;">
                  <p>{{scope.row.pnr | pnrFormat}}</p>
                </span>
            </template>
          </el-table-column>
          <el-table-column label="渠道" min-width="120">
            <template slot-scope="scope">
                <span v-if="scope.row.channel && scope.row.channel !== 'null'">
                  {{scope.row.channel | channelMap}}
                </span>
              <span v-else>全渠道</span>
            </template>
          </el-table-column>
          <el-table-column label="订单日期" prop="creadate" min-width="170"></el-table-column>
          <el-table-column label="航班号" prop="fnumber"></el-table-column>
          <el-table-column label="航段" prop="sail" min-width="100"></el-table-column>
          <el-table-column label="舱位" prop="seat"></el-table-column>
          <el-table-column label="座位数" prop="seatnum"></el-table-column>
          <el-table-column label="航班日期" prop="fdate" min-width="100"></el-table-column>
          <el-table-column label="票号" prop="eticketno" min-width="140"></el-table-column>
          <el-table-column label="票面金额" prop="money"></el-table-column>
          <el-table-column label="机场建设费" prop="airportTax" min-width="80"></el-table-column>
          <el-table-column label="燃油费" prop="fuelTax"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="filter.page"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableList.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
	import { mapState } from 'vuex'
	import { getChannelList, getCurrentDate, excelList, getRouteName } from '../../../../utils/index'
	import { queryHKorKKReprot } from './api.js'
	import { computWidth } from '../../../../mixins/computWidt'

	export default {
		name: 'CoverSeatReport',
		data () {
			return {
				loading: false,
				filter: {
					channel: '',
					startdate: '',
					enddate: ''
				},
				dataViewHeight: null,
				date: [],
				tableList: {}
			}
		},
		computed: {
			...mapState({
				tableAttributes: state => state.app.tableAttributes,
				pagination: state => state.app.pagination,
				channelList: state => state.app.channelList
			})
		},
		created () {
			this.judgeChannelList()
			this.initDate()
			this.fetchList(1, this.pagination.pageSize)
		},
		mixins: [computWidth],
		methods: {
			// state没有则请求服务器
			judgeChannelList () {
				if (!this.channelList.length) {
					getChannelList()
				}
			},
			initDate () {
				this.date = [getCurrentDate(0, '01'), getCurrentDate(0)]
				this.filter.startdate = this.date[0]
				this.filter.enddate = this.date[1]
			},
			// 获取列表数据
			fetchList (page, pageSize) {
				this.loading = true
				this.filter.page = page || 1
				if (pageSize) this.filter.rows = pageSize
				queryHKorKKReprot(this.filter).then(res => {
					this.tableList = res
					this.loading = false
				}).catch(err => {
					this.loading = false
					this.$message.error(err.message || '查询失败')
				})
			},
			// 重置
			resetFilter () {
				this.filter = {
					startdate: '',
					enddate: ''
				}
				this.initDate()
				this.fetchList(1, this.pagination.pageSize)
			},
			// 分页
			handleSizeChange (pages) {
				this.fetchList(null, pages)
			},
			handleCurrentChange (page) {
				this.fetchList(page, null)
			},
			exportExcel () {
				let data = JSON.parse(JSON.stringify(this.filter))
				data.start = 1
				data.end = this.tableList.total
				delete data.page
				delete data.rows
				let params = {
					data: data,
					url: 'noSeat/exportHKorKKReprot',
					name: getRouteName('/coverSeatReport'),
					type: 'xls'
				}
				excelList(params, this)
			}
		}
	}
</script>

<style scoped>

</style>
