<template>
  <div>
    <el-dialog v-dialogDrag title="会员信息详情" :visible.sync="msgRefundList.flag" width="800px" @close='closeDialog'>
      <div class="dialog-container">
        <div class="dialog-main" style="padding: 0" v-loading="loadFalg">
          <el-tabs v-model="activeNameTab" type="card">
            <el-tab-pane label="基本信息" name="first">
              <el-collapse v-model="activeName">
                <el-collapse-item title="基本信息" name="basic">
                  <el-table
                    :data="detailList.hbairMember"
                    :cell-style="tableAttributes.cellStyle">
                    <el-table-column label="姓名" prop="realName" min-width="120"></el-table-column>
                    <el-table-column label="性别" prop="genderFlag" min-width="100">
                      <template slot-scope="scope">
                        <span v-if="scope.row.genderFlag == '1'">男</span>
                        <span v-if="scope.row.genderFlag == '2'">女</span>
                        <span v-if="scope.row.genderFlag == '8'">未知</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="生日" prop="birthday" min-width="100"></el-table-column>
                    <el-table-column label="英文姓" prop="enLastName" min-width="100"></el-table-column>
                    <el-table-column label="英文名" prop="enFirstName" min-width="100"></el-table-column>
                    <el-table-column label="昵称" prop="nickName" min-width="100"></el-table-column>
                    <el-table-column label="手机号" prop="mobile" min-width="150">
                      <template slot-scope="scope">
                        <span v-if="scope.row.mobile == 'null'"></span>
                        <span v-else>{{scope.row.mobile}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="邮箱" prop="email" min-width="180"></el-table-column>
                    <el-table-column label="常旅客卡号" prop="ffpCardNo" min-width="100">
                      <template slot-scope="scope">
                        <span v-if="scope.row.ffpCardNo == 'null'"></span>
                        <span v-else>{{scope.row.ffpCardNo}}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-collapse-item>
                <el-collapse-item title="证件信息" name="certificates">
                  <el-table
                    :data="detailList.idCardInfo"
                    :cell-style="tableAttributes.cellStyle">
                    <el-table-column label="证件类型" prop="cardType" min-width="120">
                      <template slot-scope="scope">
                        {{scope.row.cardType |idTypeMap}}
                      </template>
                    </el-table-column>
                    <el-table-column label="证件号码" prop="cardNo" min-width="160"></el-table-column>
                  </el-table>
                </el-collapse-item>
                <el-collapse-item title="单位信息" name="company">
                  <el-table
                    :data="detailList.memberCompany"
                    :cell-style="tableAttributes.cellStyle">
                    <el-table-column label="公司名称" prop="companyName" min-width="160"></el-table-column>
                    <el-table-column label="职位" prop="position" min-width="120"></el-table-column>
                  </el-table>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="推广明细" name="second">
              <el-table :data="promote.rows" border stripe>
                <el-table-column label="姓名" prop="realName"></el-table-column>
                <el-table-column label="来源">
                  <template slot-scope="scope">
                    <div v-if="scope.row.prmtSource === '01'">会员拉新</div>
                    <div v-if="scope.row.prmtSource === '02'">航线推广</div>
                  </template>
                </el-table-column>
                <el-table-column label="绑定日期" prop="prmtCreatedTime"></el-table-column>
                <el-table-column label="有效期" prop="prmtExpiredDate"></el-table-column>
              </el-table>
              <el-pagination
                @size-change="handleSizeChangeP"
                @current-change="handleCurrentChangeP"
                :current-page="pFilter.page"
                :page-sizes="pagination.pageSizes"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="promote.total">></el-pagination>
            </el-tab-pane>
            <el-tab-pane label="奖励明细" name="third">
              <el-table :data="awards.rows" border stripe>
                <el-table-column label="购票人" prop="realName"></el-table-column>
                <el-table-column label="奖励金额" prop="awdAmount"></el-table-column>
                <el-table-column label="出发地" prop="afrom"></el-table-column>
                <el-table-column label="到达地" prop="ato"></el-table-column>
                <el-table-column label="航班日期" prop="fdate"></el-table-column>
              </el-table>
              <el-pagination
                @size-change="handleSizeChangeA"
                @current-change="handleCurrentChangeA"
                :current-page="aFilter.page"
                :page-sizes="pagination.pageSizes"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="awards.total">></el-pagination>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="dialog-footer">
          <el-button size="medium" @click="back">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getMemberDetailInfoByMemId, awardsList, promoteList } from './api'
export default {
  data () {
    return {
      activeNameTab: 'first',
      detailList: {},
      activeName: ['basic', 'certificates', 'company', 'award'],
      loadFalg: true,
      aFilter: {
        page: 1,
        rows: 10
      },
      awards: {},
      pFilter: {
        page: 1,
        rows: 10
      },
      promote: {}
    }
  },
  props: {
    msgRefundList: {
      type: Object,
      required: true
    }
  },
  created () {
    // this.loadFalg = true
    this.getMsg(this.msgRefundList.memId)
    this.queryAwards()
    this.queryPromote(1, 10)
  },
  methods: {
    handleSizeChangeP (pages) {
      this.queryPromote(null, pages)
    },
    handleCurrentChangeP (page) {
      this.queryPromote(page, null)
    },
    handleSizeChangeA (pages) {
      this.queryAwards(null, pages)
    },
    handleCurrentChangeA (page) {
      this.queryAwards(page, null)
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    back () {
      this.$emit('update:msgRefundList', !this.msgRefundList.flag)
    },
    closeDialog () {
      this.$emit('update:msgRefundList', !this.msgRefundList.flag)
    },
    getMsg (data) {
      getMemberDetailInfoByMemId({ memId: data }).then(res => {
        // res.obj.hbairMember
        this.detailList = res.obj
        this.detailList.hbairMember = [res.obj.hbairMember]
        this.loadFalg = false
      }).catch(err => {
        this.$message.error(err.message)
        this.loadFalg = false
      })
      // console.log(data)
    },
    // 查询奖励明细
    queryAwards (page, pageSize) {
      this.aFilter.memberId = this.msgRefundList.memId
      if (page) this.aFilter.page = page
      if (pageSize) this.aFilter.rows = pageSize
      awardsList(this.aFilter)
        .then(res => {
          this.awards = res
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    // 查询推广明细
    queryPromote (page, pageSize) {
      this.pFilter.memberId = this.msgRefundList.memId
      if (page) this.pFilter.page = page
      if (pageSize) this.pFilter.rows = pageSize
      promoteList(this.pFilter)
        .then(res => {
          this.promote = res
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  }
}
</script>
<style lang="scss">
  .dialog-main {
    padding: 20px !important;
  }
</style>
