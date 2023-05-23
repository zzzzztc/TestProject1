<template>
  <div id="Authentication" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="域名" clearable v-model="filter.domain"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="状态" v-model="filter.urlStatus">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="是否允许越权"  disabled v-model="filter.selectType">
            <el-option label="允许越权" value="2"></el-option>
            <el-option label="禁止越权" value="1"></el-option>
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
          :data="tableList.data"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
          <el-table-column label="域名" prop="domain"></el-table-column>
          <el-table-column label="地址" prop="urlAddress"></el-table-column>
          <el-table-column label="状态" prop="urlStatus">
            <template slot-scope="scope">
                <span v-if="scope.row.urlStatus && scope.row.urlStatus !== 'null'">
                  {{scope.row.urlStatus | urlStatusMap}}
                </span>
            </template>
          </el-table-column>
          <el-table-column label="类型" prop="selectType">
            <template slot-scope="scope">
                <span v-if="scope.row.selectType && scope.row.selectType !== 'null'">
                  {{scope.row.selectType | selectTypeMap}}
                </span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime"></el-table-column>
          <el-table-column label="修改时间" prop="modifyTime"></el-table-column>
          <el-table-column label="创建人" prop="createOpid"></el-table-column>
          <el-table-column label="修改人" prop="modifyOpid"></el-table-column>
          <el-table-column label='操作'  align='left' width="160">
            <template slot-scope='scope'>
              <span class="active-text mr-5" title="启用" v-if="scope.row.urlStatus === '1'"  @click='handledit(scope.row)'>禁用</span>
              <span class="active-text mr-5" title="禁用" v-if="scope.row.urlStatus === '0'" @click='handledit(scope.row)'>启用</span>
<!--              <span class="active-text mr-5" title="编辑" @click="rescive(scope.row, 'revise')">编辑</span>-->
              <span class="danger-text mr-5" title="删除" @click="deleteMethods(scope.row)">删除</span>
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
              <div class="label required">域名</div>
              <div class="ipt-medium">
                <el-input v-model="msg.domain" clearable placeholder="域名" size="medium""></el-input>
                <div class="warning-info" v-if="flags && !msg.domain">域名不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">地址</div>
              <div class="ipt-medium">
                <el-input v-model="msg.urlAddress" clearable placeholder="地址" size="medium""></el-input>
                <div class="warning-info" v-if="flags && !msg.urlAddress">地址不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">状态</div>
              <div class="ipt-medium">
                <el-select size="medium" placeholder="状态" clearable v-model="msg.urlStatus" disabled>
                  <el-option label="启用" value="1"></el-option>
                  <el-option label="禁用" value="0"></el-option>
                </el-select>
                <div class="warning-info" v-if="flags && !msg.urlStatus">地址不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">是否允许越权</div>
              <div class="ipt-medium">
                <el-select size="medium" placeholder="是否允许越权"  disabled v-model="msg.selectType">
                  <el-option label="允许越权" value="2"></el-option>
                  <el-option label="禁止越权" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="flags && !msg.selectType">地址不可为空</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
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
	import { fetchListData, saveAuthConfig, updatAuthConfig, deleteAuthData } from './api.js'
	import { computWidth } from '../../../mixins/computWidt'

	export default {
		name: 'Authentication',
		data () {
			return {
				loading: false,
				filter: {
					selectType: '1',
					urlStatus: '1'
        },
				dataViewHeight: null,
				date: [],
				tableList: {},
				dialogFormVisible: false,
				msgtitle: '添加',
				msg: {},
				ref: '',
				flags: false,
				tFlag: true,
        tempurlId: '',
        tempOpid: ''
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
			this.fetchList(1, this.pagination.pageSize)
		},
    mounted () {
      this.tempOpid = JSON.parse(localStorage.getItem('userInfo')).opName
	    // console.log(this.tempOpid)
    },
		mixins: [computWidth],
		methods: {
			// 新增
			creatNew () {
				// console.log('新增按钮')
			},
			// 获取列表数据
			fetchList (page, pageSize) {
				this.loading = true
				this.filter.page = page || 1
        this.filter.isJson = true
				if (pageSize) this.filter.rows = pageSize
				// console.log('传参',this.filter)
				fetchListData(this.filter).then(res => {
					this.tableList = res
					this.loading = false
				}).catch(err => {
					this.loading = false
					this.$message.error(err.messages)
				})
			},
			// 重置
			resetFilter () {
				this.filter = {
					selectType: '2',
					urlStatus: '1'
				},
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
			handledit (row) {
				const data = {}
				this.$confirm('是否确认修改启用/停用状态 ?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'info'
				}).then(() => {
					if (row.urlStatus === '1') {
						data.urlStatus = '0'
					} else {
						data.urlStatus = '1'
					}
					data.isJson = true
          data.urlId = row.urlId
					data.modifyOpid = this.tempOpid
					updatAuthConfig(data).then(res => {
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
				this.flags = false
				if (param && param !== null) {
					//  修改
					this.ref = 'ref'
					this.msgtitle = '修改'
					this.tempurlId = param.urlId
					// this.tempOpid = param.createOpid
					let msg = JSON.parse(JSON.stringify(param))
					this.msg = msg
					// this.msg.channel = msg.channel
					// this.msg.channel = param.channel ? param.channel.split(',') : []
					// console.log('修改')
				} else if (!param && param == null) {
					// console.log('这里是添加')
					//  添加
					this.msgtitle = '添加'
					this.ref = 'add'
					this.msg = {}
					this.msg = {
						domain: '',
						urlAddress: '',
						urlStatus: '1',
						selectType: '1',
						createOpid: ''
					}
					// console.log('添加')
				}
			},
			// 新增场景下重置按钮
			reset () {
				this.msg = {
					selectType: '1'
        }
			},
      // 删除按钮
			deleteMethods (data) {
				const delData = {
					urlId: data.urlId,
					modifyOpid: this.tempOpid,
          isJson: true
        }

				this.$confirm('该操作将删除该条数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				})
        .then(() => {
	        deleteAuthData(delData).then(res => {
            if (res.code === 'success') {
	            this.$message({
		            type: 'success',
		            message: '删除成功!'
	            })
	            this.fetchList()
            }
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
			// dialog返回按钮
			back () {
				this.dialogFormVisible = false
			},
			// 新增按钮
			submitDialog () {
				this.flags = true
				if (this.msg.domain === '' || this.msg.urlAddress === '' || this.msg.urlStatus === '' || this.msg.urlStatus === '' || this.msg.selectType === '') {
					return false
				}
				if (this.ref === 'add') {
					// console.log(this.msg)
					this.msg.isJson = true
					this.msg.createOpid = this.tempOpid
					saveAuthConfig(this.msg).then(res => {
						// console.log('res',res)
						this.dialogFormVisible = false
						this.fetchList()
					})
					.catch(err => {
						// console.log('err',err)
						this.$message.error(err.message)
					})
				} else if (this.ref === 'ref') {
					// console.log(this.msg)
					const transData = {
						urlId: this.tempurlId,
						urlStatus: this.msg.urlStatus,
						modifyOpid: this.tempOpid,
						isJson: true
					}
					updatAuthConfig(transData).then(res => {
						// console.log('res',res)
						this.dialogFormVisible = false
						// this.tempOpid = ''
						this.tempurlId = ''
						this.fetchList()
					})
					.catch(err => {
						// console.log('err',err)
						this.$message.error(err.message)
					})
				}
			},
			// 处理非数字
			numberContentFlightDateScope (val) {
				val = val.replace(/[^\d]/g, '')
				this.msg.flightDateScope = val
				// console.log('输入框的值',this.msg.flightDateScope)
			},
			numberContentNo (val) {
				val = val.replace(/[^\d]/g, '')
				this.msg.configNum = val
				// console.log('输入框的值',this.msg.configNum)
			}
		}
	}
</script>

<style scoped>

</style>
