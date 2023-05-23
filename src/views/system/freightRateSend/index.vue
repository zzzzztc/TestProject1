<template>
  <div class="container">
    <!--<h1>后台功能管控(业务参数配置维护)</h1>-->
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input v-model="searchForm.sendId" clearable placeholder="编号" size="medium" @keydown.enter.native="queryList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model="searchForm.sendOption" placeholder="处理类型" clearable size="medium">
            <el-option
              v-for="item in sendOptionList"
              :key="item.id"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model="searchForm.sendType" placeholder="推送类型" clearable size="medium">
            <el-option
              v-for="item in sendTypeList"
              :key="item.id"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model="searchForm.sendStatus" placeholder="推送状态" clearable size="medium">
            <el-option
              v-for="item in sendStatusList"
              :key="item.id"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.createTimeS"
            class="w-160"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            clearable
            placeholder="申请开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.createTimeE"
            class="w-160"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="申请截止日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-input v-model="searchForm.sendData" clearable placeholder="小星星编号" size="medium" @keydown.enter.native="queryList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-button size="medium" type="primary" @click="queryList(null, null)">查询</el-button>
          <el-button size="medium" @click="handleReset">重置</el-button>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="tableList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :cell-style="tableAttributes.cellStyle"
          @selection-change="handleSelectionChange">
          <el-table-column label="编号" prop="sendId"></el-table-column>
          <el-table-column label="处理类型" prop="sendOption">
            <template slot-scope="scope">{{ scope.row.sendOption | sendListFilter(sendOptionList) }}</template>
          </el-table-column>
          <el-table-column label="推送类型" prop="sendType">
            <template slot-scope="scope">{{ scope.row.sendType | sendListFilter(sendTypeList) }}</template>
          </el-table-column>
          <el-table-column label="推送状态" prop="sendStatus">
            <template slot-scope="scope">{{ scope.row.sendStatus | sendListFilter(sendStatusList) }}</template>
          </el-table-column>
          <el-table-column label="推送数据" prop="sendData" show-overflow-tooltip></el-table-column>
          <el-table-column label="推送次数" prop="sendNum"></el-table-column>
          <el-table-column label="创建时间" prop="createTime"></el-table-column>
          <el-table-column label="下次推送时间" prop="nextSendTime"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.page"
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
	import { queryFreightRateSendBeanList } from './api'
	import { computeTableHeight } from '../../../utils/index'
	import { SEND_OPTION, SEND_STATUS, SEND_TYPE } from './data'

	export default {
		name: 'freightRateSend',
		data () {
			return {
				searchForm: {
					sendStatus: '0'
				}, // 搜索框数据
				sendOptionList: SEND_OPTION,
				sendTypeList: SEND_TYPE,
				sendStatusList: SEND_STATUS,
				popupTitle: '', // 弹出框标题
				tableList: [], // 展示表格数据
				multipleSelection: [], // 选中的表单数据
				dataViewHeight: null, // 表格高度
				editVisible: false, // 弹出框显示隐藏
				isReset: false, // 切换添加/修改
				isEmpty: false, // 输入框判空
				loading: false // 加载
			}
		},
		mounted () {
			this.dataViewHeight = computeTableHeight(this, 'header')
		},
		created () {
			this.queryList(1, this.pagination.pageSize)
		},
		computed: {
			...mapState({
				tableAttributes: state => state.app.tableAttributes,
				pagination: state => state.app.pagination
			})
		},
		filters: {
			sendListFilter (val, list) {
				if (list && list.length) {
					const value = list.filter(item => {
						return item.value === val
					})
          console.log(value)
          if (value && value.length && value[0].label) {
          	return value[0].label
          } else {
          	return val
          }
        } else {
					return val
        }
			}
		},
		methods: {
			// 分页导航
			handleSizeChange (pages) {
				this.bussParamConfigList(null, pages)
			},
			handleCurrentChange (page) {
				this.bussParamConfigList(page, null)
			},
			// 表单选择项
			handleSelectionChange (val) {
				this.multipleSelection = val
			},
			// 获取表格数据
			queryList (page, pageSize) {
				this.loading = true
				this.searchForm.page = page || 1
				if (pageSize) this.searchForm.rows = pageSize
				queryFreightRateSendBeanList(this.searchForm).then(res => {
					this.tableList = res
					this.loading = false
				}).catch(err => {
					this.loading = false
					this.$message.error(err.message)
				})
			},
			// 重置
			handleReset () {
				this.searchForm = {
					sendStatus: '0'
				}
				this.queryList(1, this.pagination.pageSize)
			}
		}
	}
</script>

<style scoped>

</style>
