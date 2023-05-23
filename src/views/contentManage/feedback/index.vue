<template>
  <div id="FeedbackList" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="主题" v-model="filter.caption" clearable @keydown.enter.native="getFeedbackList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="会员姓名" v-model="filter.userName" clearable @keydown.enter.native="getFeedbackList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="电子邮箱" v-model="filter.email" clearable @keydown.enter.native="getFeedbackList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="手机号码" v-model="filter.mobile" clearable @keydown.enter.native="getFeedbackList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.startdate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="提交开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.enddate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="提交截止日期">
          </el-date-picker>
        </div>
<!--        <div class="search-item">-->
<!--          <el-date-picker-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="date"-->
<!--            type="daterange"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            range-separator="至"-->
<!--            start-placeholder="提交起始日期"-->
<!--            end-placeholder="提交截止日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getFeedbackList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container"></div>
      <div class="btn-container">
          <el-select placeholder="是否开启功能" size="medium" class="w-180" min-width="160" v-model="openCloseStatus.agreeStatus" @change="logStatus()">
            <el-option label="此功能已开启" value="1"></el-option>
            <el-option label="此功能已关闭" value="0"></el-option>
          </el-select>
        <el-button size="medium" style="margin-left: 20px" type="primary" @click="changeOpenCloseBtn(openCloseStatus.agreeStatus)">提交</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="feedbackList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
<!--          <el-table-column label="序号" type="index" width="50"></el-table-column>-->
          <el-table-column label="意见主题" min-width="160">
            <template slot-scope="scope">
              <div class="active-text" @click="switchDialog(scope.row.sugId, scope.row)">{{scope.row.caption}}</div>
            </template>
          </el-table-column>
          <el-table-column label="会员姓名" prop="username" min-width="140"></el-table-column>
          <el-table-column label="手机号码" prop="mobile" min-width="160"></el-table-column>
          <el-table-column label="电子邮箱" prop="email" min-width="160"></el-table-column>
          <el-table-column label="提交日期" prop="creadate" min-width="160">
            <template slot-scope="scope">
              {{scope.row.creadate + ' ' + scope.row.creatime}}
            </template>
          </el-table-column>
          <el-table-column label="是否处理">
            <template slot-scope="scope">
              <span v-if="scope.row.isProcess === '0'">未处理</span>
              <span v-if="scope.row.isProcess === '1'">已处理</span>
            </template>
          </el-table-column>
          <el-table-column label="处理人" prop="processOpname" min-width="140"></el-table-column>
          <el-table-column label="处理日期" prop="processDate" min-width="160"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <div class="">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="filter.page"
          :page-sizes="pagination.pageSizes"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="feedbackList.total">
         </el-pagination>
      </div>
    </div>
    <div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="800px">
        <div class="dialog-container">
          <div class="dialog-main" style="padding: 0">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="意见反馈信息" name="detail">
                <div class="row">
                  <div class="form-label">主题</div>
                  <div class="form-value">{{currentItem.caption}}</div>
                </div>
                <div class="row">
                  <div class="form-label">内容</div>
                  <div class="form-value">{{currentItem.sugContent}}</div>
                </div>
                <div class="row">
                  <div class="form-label">日期</div>
                  <div class="form-value">{{currentItem.creadate}}</div>
                </div>
                <div class="row">
                  <div class="form-label">姓名</div>
                  <div class="form-value">{{currentItem.username}}</div>
                </div>
                <div class="row">
                  <div class="form-label">手机号码</div>
                  <div class="form-value">{{currentItem.mobile}}</div>
                </div>
                <div class="row">
                  <div class="form-label">电子邮箱</div>
                  <div class="form-value">{{currentItem.email}}</div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="意见处理" name="info">
                <div class="row">
                  <div class="form-label">知识库</div>
                  <div class="form-value">
                    <el-button size="mini" @click="innerVisible = true">点击选择</el-button>
                  </div>
                  <div class="fr mr-20">
                    <el-checkbox v-model="radio">保存至知识库</el-checkbox>
                    <!--<el-radio v-model="radio" label="1">保存至知识库</el-radio>-->
                  </div>
                </div>
                <div class="row">
                  <div class="form-label">处理内容</div>
                  <div class="form-value">
                    <el-input type="textarea" v-model="feedbackInfo.msmessage" size="medium" placeholder="处理内容" :rows="4" style="width: 600px"></el-input>
                    <div class="warning-info" v-if="formErr && !feedbackInfo.msmessage">处理内容不可为空</div>
                  </div>
                </div>
                <div class="row text-center">
                  <el-button size="medium" @click="handleAddSuggestResult">提交</el-button>
                  <el-button size="medium" @click="resetDialog">重置</el-button>
                </div>
              </el-collapse-item>
              <el-collapse-item title="意见处理记录" name="report">
                <div class="table">
                  <div v-if="feedbackDetail.length">
                    <div class="table-header">
                      <div class="table-cell">处理时间</div>
                      <div class="table-cell">内容</div>
                      <div class="table-cell">操作员</div>
                    </div>
                    <div class="table-body" v-for="item in feedbackDetail" :key="item.id">
                      <div class="table-cell">{{item.msdate}}</div>
                      <div class="table-cell">{{item.msmessage}}</div>
                      <div class="table-cell">{{item.opName}}</div>
                    </div>
                  </div>
                  <div v-else>暂无意见处理记录</div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <el-dialog
          width="600px"
          title="知识库"
          :visible.sync="innerVisible"
          append-to-body>
          <div class="dialog-container">
            <div class="dialog-main">
              <know-list v-on:bindMessage="getMessage"></know-list>
            </div>
          </div>
        </el-dialog>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { fetchList, querySuggestResultList, addSuggestResult, queryAgreeContent, validityAgreeContent } from './api'
import KnowList from './knowList.vue'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'FeedbackList',
  data () {
    return {
      filter: {
        sourceid: 'hbal'
      },
      loading: false,
      radio: '', // 是否保存知识库
      date: [],
      activeNames: ['detail'],
      dataViewHeight: null,
      feedbackList: {},
      dialogVisible: false,
      dialogTitle: '',
      feedbackDetail: [],
      currentItem: {},
      innerVisible: false,
      feedbackInfo: {
        msmessage: '',
        ischecked: '',
        sourceid: 'hbal',
        email: '',
        mobile: '',
        metid: '',
        caption: ''
      },
      openCloseStatus: '1',
      formErr: false,
      tempTrasnData: {
	      agreeTitel: '',
	      begen: '',
	      channel: '',
	      agreeType: '',
	      agreeStatus: '',
	      agreeCode: '088cdc720c4841acbba198418f7f17da', // 测试
	      // agreeCode:'3c9e89c524e244bca81f777a56ed7e99', // 生产
	      endDate: '',
	      page: 1,
	      rows: 20
      }
    }
  },
  components: {
    KnowList
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  created () {
    this.getFeedbackList(1, this.pagination.pageSize)
  },
  mounted () {
	  queryAgreeContent(this.tempTrasnData).then(res => {
		  console.log('获取状态成功')
      this.openCloseStatus = res.rows[0]
    })
    .catch(err => {
	    console.log('获取状态失败', err)
    })
  },
	methods: {
	  logStatus () {
		  console.log('change打印', this.openCloseStatus)
    },
  	// 开启关闭功能btn
	  changeOpenCloseBtn (status) {
		  console.log('按钮打印', status)
		  this.$confirm('是否继续操作?', '提示', {
			  confirmButtonText: '确定',
			  cancelButtonText: '取消',
			  type: 'warning'
		  }).then(() => {
		  	const data = {
		  		ids: this.openCloseStatus.agreeId,
				  validity: this.openCloseStatus.agreeStatus
        }
			  validityAgreeContent(data).then(res => {
			  	if (res.isSuccessOrfail === 'SUCCESS') {
					  this.$message({
						  type: 'success',
						  message: res.message
					  })
          }
        }).catch(err => {
				  console.log('更新失败', err)
        })
		  }).catch(() => {
			  this.$message({
				  type: 'info',
				  message: '已取消操作'
			  })
		  })
    },
    // 获取数据
    getFeedbackList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter).then(res => {
        this.feedbackList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err)
      })
    },
    // 重置
    resetFilter () {
      this.filter = {
        sourceid: 'hbal'
      }
      this.date = []
      this.getFeedbackList(1, this.pagination.pageSize)
    },
    // 分页
    handleSizeChange (pages) {
      this.getFeedbackList(null, pages)
    },
    handleCurrentChange (page) {
      this.getFeedbackList(page, null)
    },
    async switchDialog (id, param) {
      this.currentItem = param
      this.feedbackInfo.metid = param.sugId
      this.feedbackInfo.email = param.email
      this.feedbackInfo.caption = param.caption
      // 异步转为同步
      await this.getBackDetail(id)
      this.dialogTitle = '意见反馈信息详情'
      this.dialogVisible = true
    },
    // 获取反馈详情
    getBackDetail (id) {
      querySuggestResultList({ metid: id }).then(res => {
        this.feedbackDetail = res.rows
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 获取子组件返回的数据
    getMessage (param) {
      this.feedbackInfo.msmessage = param
    },
    // 重置弹框内容
    resetDialog () {
      this.feedbackInfo.msmessage = ''
      this.radio = false
    },
    // 提交处理意见
    handleAddSuggestResult () {
      if (this.feedbackInfo.msmessage) {
        this.formErr = false
        if (this.radio) {
          this.feedbackInfo.ischecked = 'on'
        } else {
          this.feedbackInfo.ischecked = 'off'
        }
      } else {
        this.formErr = true
      }
      addSuggestResult(this.feedbackInfo).then(() => {
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.getFeedbackList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
