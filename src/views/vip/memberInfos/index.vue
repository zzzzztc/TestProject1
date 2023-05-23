<template>
  <div id="MemberInfos" class="container">
    <!--<h1>会员信息管理</h1>-->
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <!--clearable @keydown.enter.native=""-->
          <el-select size="medium" v-model="searchForm.userType" placeholder="用户类型">
             <el-option label="全部" value=""></el-option>
            <el-option label="手机" value="1"></el-option>
            <el-option label="邮箱" value="2"></el-option>
            <el-option label="身份证" value="3"></el-option>
            <el-option label="常旅客" value="4"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="用户编号" v-model="searchForm.userNo" :disabled="searchForm.userType === ''"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="工号" v-model="searchForm.bndStaffNo"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="渠道" v-model="searchForm.channel">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="标签" v-model="searchForm.lblName"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.createDateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="起始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.createDateEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="截止日期">
          </el-date-picker>
        </div>

        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="实名认证" v-model="searchForm.identityStatus">
            <el-option label="未认证" value="0"></el-option>
            <el-option label="已认证" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="可用状态" v-model="searchForm.userFlag">
            <el-option label="不可用" value="0"></el-option>
            <el-option label="可用" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="注册方式" v-model="searchForm.registerType">
            <el-option label="授权登录注册" value="授权登录注册"></el-option>
            <el-option label="常规注册" value="常规注册"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="search">查询</el-button>
          <el-button size="medium" @click="resetQuery">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" @click="handleExport" :disabled="!tableList.total">导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="tableList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :row-class-name="tableRow"
          :cell-style="tableAttributes.cellStyle"
          @selection-change="handleSelectionChange">
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
          <!--<el-table-column type="selection" width="50" fixed="left"></el-table-column>-->
          <el-table-column label="姓名" prop="realName" min-width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.realName === 'null'"></span>
              <span v-else>{{scope.row.realName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="工号" prop="bndStaffNo"></el-table-column>
          <el-table-column label="常客号" prop="ffpCardNo" min-width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.ffpCardNo === 'null'"></span>
              <span v-else>{{scope.row.ffpCardNo}}</span>
            </template>
          </el-table-column>
          <el-table-column label="身份证" prop="idCard" min-width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.idCard === 'null'"></span>
              <span v-else>{{scope.row.idCard}}</span>
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile" min-width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.mobile === 'null'"></span>
              <span v-else>{{scope.row.mobile}}</span>
            </template>
          </el-table-column>
          <el-table-column label="邮箱" prop="email" min-width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.email === 'null'"></span>
              <span v-else>{{scope.row.email}}</span>
            </template>
          </el-table-column>
          <el-table-column label="渠道" prop="" min-width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.channel === 'null'"></span>
              <span v-else>{{scope.row.channel | channelMap}}</span>
            </template>
          </el-table-column>
          <el-table-column label="标签" prop="lblName" min-width="120"></el-table-column>
          <el-table-column label="实名认证" prop="identityStatus" align="center" min-width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.identityStatus === 1">已认证</span>
              <span v-if="scope.row.identityStatus === 0">未认证</span>
              <span v-if="scope.row.identityStatus === 'null'"></span>
            </template>
          </el-table-column>
          <el-table-column label="注册时间" prop="createDate" min-width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.createDate === 'null'"></span>
              <span v-else>{{scope.row.createDate}}</span>
            </template>
          </el-table-column>
          <el-table-column label="认证时间" prop="authTime" min-width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.identityStatus == 0"></span>
              <span v-if="scope.row.identityStatus == 1">{{scope.row.authTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="最后登录时间" prop="loginTime" min-width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.loginTime === 'null'"></span>
              <span v-else>{{scope.row.loginTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="有效/无效" prop="" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.userFlag === 1">可用</span>
              <span v-if="scope.row.userFlag === 0">不可用</span>
              <span v-if="scope.row.userFlag === null"></span>
            </template>
          </el-table-column>
          <el-table-column label="注册方式" prop="registerType" min-width="120"></el-table-column>
          <el-table-column label="操作" fixed="right" min-width="270">
            <template slot-scope="scope">
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">信息修改</span>
              <span class="active-text mr-5" title="安全查询" @click="handleQuery(scope.row)">安全查询</span>
              <span class="active-text mr-5" title="查看详情" @click="handleDetail(scope.row)">查看详情</span>
              <span class="active-text mr-5" title="实名认证" @click="handleReal(scope.row)">实名认证</span>
              <span class="active-text mr-5" title="解绑" @click="handleUnBind(scope.row)" v-if="scope.row.bndStaffNo">员工解绑</span>
            </template>
          </el-table-column>
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
    <!--查看详情-->
    <Details v-if="msgRund.flag" :msgRefundList.sync="msgRund"></Details>
    <!--实名认证-->
    <el-dialog :title="dialogCennel" :visible.sync="dialogBlean" width="350px" @close="reback">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">身份证</div>
              <div class="fl ipt-medium">
                <el-input size="medium" v-model="real.idCard" placeholder="身份证" title="身份证" :disabled="real.identityStatus===1"></el-input>
                <div class="warning-info" v-if="flag && !real.idCard">身份证不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">手机号</div>
              <div class="fl ipt-medium">
                <el-input size="medium" v-model="real.mobile" placeholder="手机号" title="手机号"></el-input>
                <div class="warning-info" v-if="flag && !real.mobile">手机号不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">姓名</div>
              <div class="fl ipt-medium">
                <el-input size="medium" v-model="real.cnName" placeholder="姓名" title="姓名"></el-input>
                <div class="warning-info" v-if="flag && !real.cnName">姓名不可为空</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="refer">提交</el-button>
          <el-button size="medium" @click="reset">重置</el-button>
          <el-button size="medium" @click="reback">返回</el-button>
        </div>
      </div>
    </el-dialog>
    <!--信息修改-->
    <el-dialog :title="dialogtitle" :visible.sync="dialogReset" width="560px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">姓名</div>
              <div class="fl ipt-medium">
                <el-input size="medium" :disabled="inputFlag" v-model="vipObj.realName" placeholder="姓名" title="姓名"></el-input>
                <div class="warning-info" v-if="vipFlag && !vipObj.realName">姓名不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">生日</div>
              <div class="fl ipt-medium">
                <el-date-picker
                  v-model="vipObj.birthday"
                  type="date"
                  :disabled="inputFlag"
                  clearable
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="生日">
                </el-date-picker>
                <div class="warning-info" v-if="vipFlag && !vipObj.birthday">生日不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">性别</div>
              <div class="fl ipt-medium">
                <el-select :disabled="inputFlag" size="medium" placeholder="性别" v-model="vipObj.genderFlag">
                  <el-option label="男" value="1"></el-option>
                  <el-option label="女" value="2"></el-option>
                  <el-option label="未知" value="8"></el-option>
                </el-select>
                <div class="warning-info" v-if="vipFlag && !vipObj.genderFlag">性别不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">身份证</div>
              <div class="fl ipt-medium">
                <el-input size="medium" :disabled="inputFlag" v-model="cardNo" placeholder="身份证" title="身份证"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">护照</div>
              <div class="fl ipt-medium">
                <el-input size="medium" v-model="passport" placeholder="护照" title="护照"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">其他证件</div>
              <div class="fl ipt-medium">
                <el-input size="medium" v-model="other" placeholder="其他" title="其他"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">英文姓</div>
              <div class="fl ipt-medium">
                <el-input size="enLastName" v-model="vipObj.enLastName" placeholder="英文姓" title="英文姓"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">英文名</div>
              <div class="fl ipt-medium">
                <el-input size="medium" v-model="vipObj.enFirstName" placeholder="英文名" title="英文名"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">单位名称</div>
              <div class="fl ipt-medium">
                <el-input size="enLastName" v-model="vipObj.companyName" placeholder="单位名称" title="单位名称"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">职位</div>
              <div class="fl ipt-medium">
                <el-input size="medium" v-model="vipObj.position" placeholder="职位" title="职位"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="viprefer">提交</el-button>
          <el-button size="medium" @click="dialogReset = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as types from './api'
import { getChannelList, excelList, isEmpty, getRouteName } from '../../../utils/index'
import Details from './commons/details'
import { computWidth } from '../../../mixins/computWidt'
import { unbind } from './api'
export default {
  name: 'MemberInfos',
  data () {
    return {
      searchForm: {
        userType: '', // 用户类型
        userNo: '', // 用户编号
        createDateStart: '', // 时间类型开始
        createDateEnd: '', //  时间截止
        identityStatus: '', // 实名认证
        channel: '', // 渠道123
        userFlag: ''
      }, // 查询 -- 条件
      dateTime: '', // 查询 -- 时间
      tableList: {}, // 表格 -- 展示数据
      dataViewHeight: null, // 表格 -- 高度
      editForm: {

      }, // 修改弹出框 -- 数据表单
      isEmpty: false, // 修改弹出框 -- 输入框判空
      detailList: [], // 详情弹出框 -- 数据
      loading: false,
      msgRund: {},
      dialogCennel: '实名认证',
      dialogBlean: false,
      real: {
        idCard: '',
        mobile: '',
        cnName: ''
      },
      flag: false,
      dialogtitle: '信息修改',
      dialogReset: false,
      vipObj: {
        realName: '',
        birthday: '',
        genderFlag: '1',
        enLastName: '',
        enFirstName: '',
        companyName: '',
        position: ''
      },
      vipFlag: false,
      cardNo: '',
      passport: '',
      other: '',
      inputFlag: false
    }
  },
  components: {
    Details
  },
  created () {
    this.getchannelList()
    // this.initData(1, this.pagination.pageSize)
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes, // 表格
      pagination: state => state.app.pagination, // 分页
      channelList: state => state.app.channelList
    })
  },
  filters: {
    upper (value) {
      if (!value) return ''
      value = value.toString()
      return value.toUpperCase()
    }
  },
  methods: {
    tableRow ({ row, rowIndex }) {
      row.index = rowIndex
    },
    //  修改
    viprefer () {
      let idCardInfoList = []
      if (this.cardNo) idCardInfoList.push({ cardType: '0', cardNo: this.cardNo })
      if (this.passport) idCardInfoList.push({ cardType: '4', cardNo: this.passport })
      if (this.other) idCardInfoList.push({ cardType: '5', cardNo: this.other })
      this.vipObj.enLastName = this.$options.filters.upper(this.vipObj.enLastName)
      this.vipObj.enFirstName = this.$options.filters.upper(this.vipObj.enFirstName)
      this.vipObj['idCardInfoList'] = idCardInfoList
      this.updateVip()
    },
    updateVip () {
      this.vipObj.isJson = true
      types.updateMemberInfo(this.vipObj).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.dialogReset = false
        this.initData(1, this.pagination.pageSize)
      }).catch(err => {
        this.dialogReset = false
        this.$message.error(err.message)
      })
    },
    //  实名认证提交
    refer () {
      this.flag = true
      if (!this.real.idCard || !this.real.mobile || !this.real.cnName) {
        return false
      }
      this.authenTication()
    },
    authenTication () {
      types.trueNameAuth(this.real).then(res => {
        this.dialogBlean = false
        this.initData(1, this.pagination.pageSize)
      }).catch(err => {
        // this.dialogBlean = false
        this.$message.error(err.message)
      })
    },
    //  实名认证重置
    reset () {
      this.real.cnName = ''
      this.real.mobile = ''
      if (this.real.identityStatus === 0) {
        this.real.idCard = ''
      }
    },
    //  实名认证返回
    reback () {
      this.dialogBlean = false
      this.real.memId = ''
      this.real.idCard = ''
      this.real.cnName = ''
      this.real.mobile = ''
    },
    //  信息修改
    handleEdit (row) {
      this.dialogReset = true
      if (row.identityStatus === 1) {
        this.inputFlag = true
      }
      types.getUpdateMemberInfo({ memId: row.memId }).then(res => {
        this.updateMsg(res.obj)
        this.vipObj.memId = res.obj.memId
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    updateMsg (res) {
      this.vipObj.realName = isEmpty(res.realName) ? '' : res.realName
      this.vipObj.birthday = isEmpty(res.birthday) ? '' : res.birthday
      this.vipObj.genderFlag = res.genderFlag
      this.vipObj.enLastName = isEmpty(res.enLastName) ? '' : res.enLastName
      this.vipObj.enFirstName = isEmpty(res.enFirstName) ? '' : res.enFirstName
      this.vipObj.companyName = isEmpty(res.companyName) ? '' : res.companyName
      this.vipObj.position = isEmpty(res.position) ? '' : res.position
      if (res.idCardInfoList.length) {
        for (let i = 0; i < res.idCardInfoList.length; i++) {
          let docmentType = res.idCardInfoList[i]
          switch (docmentType.cardType) {
            case '0':
              this.cardNo = docmentType.cardNo
              break
            case '4':
              this.passport = docmentType.cardNo
              break
            case '5':
              this.other = docmentType.cardNo
              break
          }
        }
      }
    },
    //  实名认证
    handleReal (row) {
      this.dialogBlean = true
      this.real.identityStatus = row.identityStatus
      this.real.memId = row.memId
      if (row.identityStatus === 1) {
        this.getStatus(row.memId)
      }
    },
    //  实名认证接口
    getStatus (memId) {
      types.getCredentialsByMemId({ memId: memId }).then(res => {
        this.real.idCard = res.obj.idCard
        this.real.mobile = res.obj.mobile
        this.real.cnName = res.obj.realName
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getchannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    initData (page, pageSize) {
      this.loading = true
      if (page) this.searchForm.page = page
      if (pageSize) this.searchForm.rows = pageSize
      types.getHbairMemberList(this.searchForm).then(res => {
        this.tableList = res
        this.loading = false
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 表格 -- 分页
    handleSizeChange (pages) {
      this.initData(null, pages)
    },
    handleCurrentChange (page) {
      this.initData(page, null)
    },
    search () {
      this.initData(1, this.pagination.pageSize)
    },
    // 查询 -- 条件重置
    resetQuery () {
      for (const key in this.searchForm) {
        this.searchForm[key] = ''
      }
      this.searchForm.userType = '1'
      this.initData(1, this.pagination.pageSize)
    },
    // 表格 -- 选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 表格 -- 导出
    handleExport () {
      let data = JSON.parse(JSON.stringify(this.searchForm))
      let url = 'member/exportHbairMember'
      let name = getRouteName('/memberInfos')
      let type = 'xls'
      data.start = 1
      data.end = this.tableList.total
      delete data.page
      delete data.rows
      // let total = this.tableList.total
      let temp = null
      let obj = {
        data,
        url,
        name,
        type,
        temp
      }
      excelList(obj, this)
    },
    // 表格操作 -- 安全查询
    handleQuery (row) {
      types.getCredentialsByMemId({ memId: row.memId }).then(res => {
        let list = JSON.parse(JSON.stringify(this.tableList.rows))
        if (res.obj) {
          list[row.index] = res.obj
          this.tableList.rows = list
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 表格操作 -- 查看详情
    handleDetail (row) {
      this.msgRund = {
        memId: row.memId,
        flag: true
      }
    },
    // 解绑
    handleUnBind (row) {
      this.$confirm('是否确认解除绑定？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          unbind({ bndId: row.bndId })
            .then(() => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.initData(this.searchForm.page)
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        })
        .catch(() => {
          this.$message.info('操作取消')
        })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
