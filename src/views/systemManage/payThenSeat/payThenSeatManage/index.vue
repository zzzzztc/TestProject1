<template>
  <div id="PayThenSeatManage" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="启用状态" clearable v-model="filter.configStatus">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="渠道" clearable v-model="filter.channel">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="fetchList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="search-container clearfix">
        <div class="search-item">
          <el-button  size='medium'  @click="rescive(null)">添加</el-button>
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
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
          <el-table-column label="渠道" prop="channel">
            <template slot-scope="scope">
                <span v-if="scope.row.channel && scope.row.channel !== 'null'">
                  {{scope.row.channel | channelMap}}
                </span>
              <span v-else>全渠道</span>
            </template>
          </el-table-column>
          <el-table-column label="航班日期范围" prop="flightDateScope"></el-table-column>
          <el-table-column label="最大NO位数量" prop="configNum"></el-table-column>
          <el-table-column label="状态" prop="configStatus">
            <template slot-scope="scope">
                <span v-if="scope.row.configStatus && scope.row.configStatus !== 'null'">
                  {{scope.row.configStatus | configStatusMap}}
                </span>
              <span v-else>全渠道</span>
            </template>
          </el-table-column>
          <el-table-column label="创建人" prop="createOpname"></el-table-column>
          <el-table-column label="创建时间" prop="createDate"></el-table-column>
          <el-table-column label="修改人" prop="updateOpname"></el-table-column>
          <el-table-column label="修改时间" prop="updateDate"></el-table-column>
          <el-table-column label='操作'  align='left' width="160">
            <template slot-scope='scope'>
              <span class="active-text mr-5" title="禁用" v-if="scope.row.configStatus === '1'"  @click='handledit(false,{ configId: scope.row.configId, configStatus: scope.row.configStatus })'>禁用</span>
              <span class="active-text mr-5" title="启用" v-if="scope.row.configStatus === '0'" @click='handledit(true,{ configId: scope.row.configId, configStatus: scope.row.configStatus })'>启用</span>
              <span class="active-text mr-5" title="编辑" @click="rescive(scope.row, 'revise')">编辑</span>
              <span class="danger-text mr-5" title="删除" @click="delRowData(scope.row)">删除</span>
            </template>
          </el-table-column>
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
<!--  新增/修改编辑dialog  -->
    <el-dialog :title="msgtitle" :visible.sync="dialogFormVisible" width="400px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <span class="label required">渠道编号 ：</span>
              <div class="fl ipt-medium">
                <el-select v-model='msg.channel' clearable placeholder='渠道' multiple value-key="stateid" size='medium' style='width: 210px' title="必填项" collapse-tags>
                  <el-option
                    v-for='item in channelList'
                    :key='item.chalId'
                    :label='item.chalName'
                    :value='item.chalCode'>
                  </el-option>
                </el-select>
                <div class="warning-info" v-if="flags && !msg.channel">渠道编号不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">航班日期范围（天）</div>
              <div class="ipt-medium">
                <el-input v-model="msg.flightDateScope" clearable placeholder="航班日期范围" size="medium" @input="numberContentFlightDateScope(msg.flightDateScope)"></el-input>
                <div class="warning-info" v-if="flags && !msg.flightDateScope">航班日期范围不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">最大NO位数</div>
              <div class="ipt-medium">
                <el-input v-model="msg.configNum" clearable placeholder="最大NO位数" size="medium"  @input="numberContentNo(msg.configNum)"></el-input>
                <div class="warning-info" v-if="flags && !msg.configNum">最大NO位数不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <span class="label">启用/禁用 ：</span>
              <div class="fl ipt-medium">
                <el-select size="medium" placeholder="是否禁用" v-model="msg.configStatus">
                  <el-option value="1" label="启用"></el-option>
                  <el-option value="0" label="禁用"></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
<!--          <el-button size="medium" type="primary" @click="refer">提交</el-button>-->
<!--          <el-button size="medium" v-if="ref === 'add'" @click="reset">重置</el-button>-->
<!--          <el-button size="medium" @click="back">返回</el-button>-->
          <el-button size="medium" type="primary" @click="submitDialog">提交</el-button>
          <el-button size="medium" v-if="ref === 'add'" @click="reset">重置</el-button>
          <el-button size="medium" @click="back">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
	import { mapState } from 'vuex'
	import { getChannelList, getCurrentDate, excelList, getRouteName } from '../../../../utils/index'
	import { getNoseatConfig,updateNoSeatConfig,saveNoSeatConfig,delNoSeatConfig } from './api.js'
	import { computWidth } from '../../../../mixins/computWidt'
	import * as types from "../../../authority/api";

	export default {
		name: 'PayThenSeatManage',
		data () {
			return {
				loading: false,
				filter: { },
				dataViewHeight: null,
				date: [],
				tableList: {},
				dialogFormVisible: false,
				msgtitle: '添加',
				msg: {},
				ref: '',
				flags: false,
				tFlag: true
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
			// 删除按钮
			delRowData(row){
				this.$confirm('是否确认删除 ?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'info'
				}).then(() => {
					const upData = {
						isSinglePrimaryKey:row.isSinglePrimaryKey,
						channel:row.channel,
						flightDateScope:row.flightDateScope,
						configId:row.configId,
						configStatus:row.configStatus,
						configNum:row.configNum
          }
					upData.isJson = true
					delNoSeatConfig(upData).then(res => {
						this.$message({
							message: '操作成功',
							type: 'success'
						})
						this.resetFilter()
					}).catch(err => {
						this.$message.error(err.message)
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
      },
			// 新增
			creatNew(){
				console.log('新增按钮')
      },
			// state没有则请求服务器
			judgeChannelList () {
				if (!this.channelList.length) {
					getChannelList()
				}
			},
			initDate () {
				this.date = [getCurrentDate(0, '01'), getCurrentDate(0)]
			},
			// 获取列表数据
			fetchList (page, pageSize) {
				this.loading = true
				this.filter.page = page || 1
				if (pageSize) this.filter.rows = pageSize
				getNoseatConfig(this.filter).then(res => {
					this.tableList = res
					this.loading = false
				}).catch(err => {
					this.loading = false
					this.$message.error(err.messages)
				})
			},
			// 重置
			resetFilter () {
				this.filter = { }
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
      // 启用/禁用按钮
			handledit(type,data={}){
				this.$confirm(type?'是否确认启用?':'是否确认禁用?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'info'
				}).then(() => {
					if (data.configStatus === '1') {
						data.configStatus = '0'
					} else {
						data.configStatus = '1'
					}
					data.isJson = true
					updateNoSeatConfig(data).then(res => {
						this.$message({
							message: '修改成功',
							type: 'success'
						})
						this.resetFilter()
					}).catch(err => {
						this.$message.error(err.message)
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消修改'
					})
				})
      },
      // 新增/修改编辑点击事件
			rescive (param) {
				this.dialogFormVisible = true
				if (param && param !== null) {
					//  修改
					this.ref = 'ref'
					this.msgtitle = '修改'
					let msg = JSON.parse(JSON.stringify(param))
					this.msg = msg
					this.msg.channel = msg.channel
					this.msg.channel = param.channel ? param.channel.split(',') : []
					console.log('修改')
				} else {
					//  添加
					this.msgtitle = '添加'
					this.ref = 'add'
					this.msg = {}
					this.msg = {
						configStatus: '0',
						flightDateScope: '',
						configNum: '',
						channel: ''
					}
					console.log('添加')
				}
			},
      // 新增场景下重置按钮
			reset () {
				this.msg = { }
			},
      // dialog返回按钮
			back () {
				this.dialogFormVisible = false
			},
      // 新增按钮
			submitDialog(){
				if (this.ref === 'add') {
					console.log(this.msg)
					this.msg.isJson = true
          this.msg.channel  = this.msg.channel.join(',')
					saveNoSeatConfig(this.msg).then( res => {
						console.log('res',res)
						this.dialogFormVisible = false
						this.fetchList()
					})
					.catch( err => {
						console.log('err',err)
						this.dialogFormVisible = false
					})
				} else {
					console.log(this.msg)
					this.msg.channel = this.msg.channel.join(',')
					const transData = {
						channel: this.msg.channel,
						flightDateScope: this.msg.flightDateScope,
						configId: this.msg.configId,
						configStatus: this.msg.configStatus,
						configNum: this.msg.configNum,
            isJson: true
          }
					updateNoSeatConfig(transData).then(res => {
						console.log('res', res)
						this.dialogFormVisible = false
						this.fetchList()
					})
					.catch(err => {
						console.log('err', err)
						this.dialogFormVisible = false
					})
				}
      },
      // 处理非数字
			numberContentFlightDateScope (val) {
        val = val.replace(/[^\d]/g, '')
        this.msg.flightDateScope = val
				console.log('输入框的值', this.msg.flightDateScope)
      },
			numberContentNo (val) {
				val = val.replace(/[^\d]/g, '')
				this.msg.configNum = val
				console.log('输入框的值', this.msg.configNum)
			}
		}
	}
</script>

<style scoped>

</style>
