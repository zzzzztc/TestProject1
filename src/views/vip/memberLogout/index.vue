<template>
  <!--<div>会员注销信息</div>-->
  <div id="MemberLogout" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="姓名" v-model="filter.realName" @keydown.enter.native="getMemberWriteOffList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="手机号" v-model="filter.mobile" @keydown.enter.native="getMemberWriteOffList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="身份证" v-model="filter.idCard" @keydown.enter.native="getMemberWriteOffList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="常客号" v-model="filter.ffpCardNo" @keydown.enter.native="getMemberWriteOffList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="实名认证状态" v-model="filter.identityStatus">
            <el-option label="未认证" value="0"></el-option>
            <el-option label="已认证" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="注销状态" v-model="filter.writeOffStatus">
            <el-option label="已申请" value="1"></el-option>
            <el-option label="已注销" value="2"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.applyTimeStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="注销申请开始时间">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.applyTimeEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="注销申请截止时间">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.writeOffTimeStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="实际注销开始时间">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.writeOffTimeEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="实际注销截止时间">
          </el-date-picker>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getMemberWriteOffList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="!memberWriteOffList.total" @click="handleExport()">导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          key="Math.random()"
          :cell-style= "tableAttributes.cellStyle"
          :stripe="tableAttributes.stripe"
          :border="tableAttributes.border"
          :data="memberWriteOffList.rows"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
          <el-table-column label="手机号" prop="mobile" min-width="80"></el-table-column>
          <el-table-column label="身份证号" prop="idCard" min-width="120"></el-table-column>
          <el-table-column label="姓名" prop="realName" min-width="80"></el-table-column>
          <el-table-column label="常旅客卡号" prop="ffpCardNo" min-width="80"></el-table-column>
          <el-table-column label="实名认证状态" prop="identityStatus" min-width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.identityStatus === '0'">未认证</span>
              <span v-if="scope.row.identityStatus === '1'">已认证</span>
            </template>
          </el-table-column>
          <el-table-column label="注销状态" prop="writeOffStatus" min-width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.writeOffStatus === '1'">已申请</span>
              <span v-if="scope.row.writeOffStatus === '2'">已注销</span>
            </template>
          </el-table-column>
          <el-table-column label="注销申请时间" prop="applyTime" min-width="120"></el-table-column>
          <el-table-column label="实际注销时间" prop="writeOffTime" min-width="120"></el-table-column>
          <el-table-column label="注销人" prop="writeOffOpid" min-width="120"></el-table-column>
          <el-table-column label="注销原因" prop="writeOffReason" min-width="160"></el-table-column>
          <el-table-column label="备注" prop="writeOffRemark" min-width="120"></el-table-column>
          <el-table-column label="操作" fixed="right" min-width="60">
            <template slot-scope="scope">
              <span class="danger-text mr-5" title="注销" v-if="scope.row.writeOffStatus === '1'" @click="handleDelete(scope.row)">注销</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <div class="clearfix">
        <div class="fl">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="filter.page"
            :page-sizes="pagination.pageSizes"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="memberWriteOffList.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--注销-->
    <el-dialog title="注销申请" :visible.sync="logoutVisible" width="350px">
      <div v-loading="loading" class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">注销备注</div>
              <div class="ipt-medium">
                <el-input type="textarea" :rows="4" clearable placeholder="注销备注" v-model="editForm.remake" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.remake">注销备注不可为空</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="saveEdit">提交</el-button>
          <el-button size="medium" @click="logoutVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { queryMemberWriteOffList, queryWriteOffConfirm } from './api'
import { excelList, getRouteName } from '../../../utils'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'MemberLogout',
  data () {
    return {
      componentName: 'memberLogout',
      loading: false,
      dataViewHeight: null,
      filter: {
        realName: '', // 姓名
        mobile: '', // 手机号
        idCard: '', // 身份证
        ffpCardNo: '', // 常客号
        identityStatus: '', // 实名认证状态 0未认证 1已认证
        writeOffStatus: '', // 注销状态 1已申请 2已注销
        applyTimeStart: '', // 注销申请时间开始
        applyTimeEnd: '', // 注销申请时间截止
        writeOffTimeStart: '', // 实际注销时间开始
        writeOffTimeEnd: '', // 实际注销时间截止
        page: '', // 开始页
        rows: '' // 每页数量
      },
      memberWriteOffList: {},
      logoutVisible: false,
      editForm: {
        remake: ''
      },
      isEmpty: false
    }
  },
  created () {
    this.getMemberWriteOffList(1, this.pagination.pageSize)
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList
    })
  },
  methods: {
    // 分页导航
    handleSizeChange (pages) {
      this.getMemberWriteOffList(null, pages)
    },
    handleCurrentChange (page) {
      this.getMemberWriteOffList(page, null)
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取表格数据
    getMemberWriteOffList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      queryMemberWriteOffList(this.filter).then(res => {
        this.memberWriteOffList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 查询条件 -- 重置
    resetFilter () {
      this.filter.realName = ''
      this.filter.mobile = ''
      this.filter.idCard = ''
      this.filter.ffpCardNo = ''
      this.filter.identityStatus = ''
      this.filter.writeOffStatus = ''
      this.filter.applyTimeStart = ''
      this.filter.applyTimeEnd = ''
      this.filter.writeOffTimeStart = ''
      this.filter.writeOffTimeEnd = ''
      this.getMemberWriteOffList()
    },
    // 导出
    handleExport () {
      let data = JSON.parse(JSON.stringify(this.filter))
      data.start = 1
      data.end = this.memberWriteOffList.total
      delete data.page
      delete data.rows
      let params = {
        data: data,
        url: 'memberWriteOff/exportMemberWriteOff',
        name: getRouteName('/memberLogout'),
        type: 'xls'
      }
      excelList(params, this)
    },
    // 注销
    handleDelete (param) {
      this.logoutVisible = true
      this.editForm.writeOffId = param.writeOffId
      this.editForm.memId = param.memId
    },
    // 提交注销
    saveEdit () {
      if (this.editForm.remake) {
        let data = JSON.parse(JSON.stringify(this.editForm))
        this.$confirm('是否确认注销？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          // 注销
          queryWriteOffConfirm(data).then(res => {
            this.getMemberWriteOffList()
            this.logoutVisible = false
            this.$message.success('操作成功')
          }).catch(err => {
            this.$message.error(err.message)
          })
        }).catch(() => {
          this.$message.info('操作取消')
        })
      } else {
        this.isEmpty = true
      }
    }
  }
}
</script>

<style scoped>

</style>
