<template>
  <div class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="快递单号" v-model="filter.mailNo" @keydown.enter.native="getLtineraryList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="订单编号" v-model="filter.orderCode" @keydown.enter.native="getLtineraryList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="收件人" v-model="filter.addressee" @keydown.enter.native="getLtineraryList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="电话" v-model="filter.phone" @keydown.enter.native="getLtineraryList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.fdate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.startdate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="申请开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.enddate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="申请截止日期">
          </el-date-picker>
        </div>
<!--        <div class="search-item fl ">-->
<!--          <el-date-picker-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="applyDate"-->
<!--            type="daterange"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            range-separator="至"-->
<!--            start-placeholder="申请起始日期"-->
<!--            end-placeholder="申请截止日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
<!--        <div class="search-item search-ipt fl">-->
<!--          <el-select size="medium" v-model="filter.emailStatus"  placeholder="邮寄状态">-->
<!--            <el-option label="全部" value="0"></el-option>-->
<!--            <el-option label="未邮寄" value="1"></el-option>-->
<!--            <el-option label="已邮寄" value="2"></el-option>-->
<!--          </el-select>-->
<!--        </div>-->
        <div class="search-item search-ipt fl">
          <el-select size="medium" v-model="filter.channel" clearable placeholder="渠道编号">
            <el-option v-for="item in channelList.rows" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getLtineraryList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" type="success" @click="exportMailPostList" :disabled="travelPostList.total === 0">导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          :cell-style="tableAttributes.cellStyle"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :height="dataViewHeight"
          v-loading="loading"
          :data="travelPostList.rows">
          <el-table-column label="票号" prop="ticketNo" min-width="180"></el-table-column>
          <el-table-column label="订单编号" prop="orderCode" min-width="180"></el-table-column>
          <el-table-column label="收件人" prop="addressee" min-width="100"></el-table-column>
          <el-table-column label="电话" prop="phone" min-width="120"></el-table-column>
          <el-table-column label="地址" min-width="220">
            <template slot-scope="scope">
              <div class="inl-block text-over pointer" :title="scope.row.address">{{scope.row.address}}</div>
            </template>
          </el-table-column>
          <el-table-column label="航班日期" prop="flightDate" min-width="120"></el-table-column>
          <el-table-column label="申请日期" prop="applyDate" min-width="120"></el-table-column>
          <el-table-column label="邮寄状态" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.emailStatus === '3'">已回收</div>
              <div v-if="scope.row.emailStatus === '2'">已邮寄</div>
              <div v-if="scope.row.emailStatus === '1'">未邮寄</div>
            </template>
          </el-table-column>
          <el-table-column label="邮寄日期" prop="dcDate" min-width="160"></el-table-column>
          <el-table-column label="渠道编号" prop="channel" min-width="160">
            <template slot-scope="scope">
              {{scope.row.channel | channelMap}}
            </template>
          </el-table-column>
          <el-table-column label="是否通知回收" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.recoveryStatus === '0'">未发送</span>
              <span v-if="scope.row.recoveryStatus === '1'">已发送</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="180" fixed="right">
            <template slot-scope="scope">
              <div>
                <span class="active-text inl-block mr-5" v-if="scope.row.emailStatus === '1'" @click="handleConfirm(scope.row)">配送</span>
                <span class="active-text inl-block mr-5" v-if="scope.row.emailStatus === '2'" @click="handleSendMessage(scope.row)">发送回收消息</span>
                <span class="active-text inl-block mr-5" v-if="scope.row.emailStatus === '2'" @click="handleConfirmComplate(scope.row)">回收确认</span>
                <span class="inl-block mr-5" v-if="scope.row.emailStatus === '3'">已确认</span>
              </div>
            </template>
          </el-table-column>
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
          :total="travelPostList.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchList, fetchChannelList, deliveryDistribution, deliverySendMessage, confirmCompletion } from './api'
import { mapState } from 'vuex'
import { computeTableHeight, getCurrentDate, excelList, getRouteName } from '../../../utils/index'

export default {
  name: 'TravelMailWait',
  data () {
    return {
      filter: {
        mailNo: '',
        orderCode: '',
        addressee: '',
        phone: '',
        startdate: '',
        enddate: '',
        emailStatus: '1', // 行程单状态为待邮寄
        channel: '',
        page: 1
      },
      loading: false,
      dataViewHeight: null,
      applyDate: [],
      channelList: {},
      travelPostList: {}
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  },
  created () {
    this.getDate()
    this.getLtineraryList(1, this.pagination.pageSize)
    this.getChannelList()
  },
  methods: {
    // 获取当前日期
    getDate () {
      this.applyDate = [getCurrentDate(0, '01'), getCurrentDate(0)]
      this.filter.startdate = this.applyDate[0]
      this.filter.enddate = this.applyDate[1]
    },
    // 获取渠道列表
    getChannelList () {
      fetchChannelList().then(res => {
        this.channelList = res
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 获取邮寄列表
    getLtineraryList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      // this.judgeDateFilter()
      fetchList(this.filter).then(res => {
        this.travelPostList = res
        this.loading = false
      }).catch(err => {
        this.$message.error(err.message)
        this.loading = false
      })
    },
    // 重置
    resetFilter () {
      this.getDate()
      this.filter = {
        emailStatus: '1',
        startdate: '',
        enddate: ''
      }
      this.getLtineraryList(1, this.pagination.pageSize)
    },
    // 时间过滤条件
    judgeDateFilter () {
      if (this.applyDate && this.applyDate.length) {
        this.filter.startdate = this.applyDate[0]
        this.filter.enddate = this.applyDate[1]
      } else {
        delete this.filter.startdate
        delete this.filter.enddate
      }
    },
    // 分页
    handleSizeChange (pages) {
      this.getLtineraryList(null, pages)
    },
    handleCurrentChange (page) {
      this.getLtineraryList(page, null)
    },
    // 切换
    handleConfirm (params) {
      this.$prompt('请输入快递单号', '行程单完成邮寄', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        inputPattern: /\S/,
        inputErrorMessage: '请输入快递单号'
      }).then(({ value }) => {
        if (value) {
          let data = {
            ticketid: params.ticketid,
            mailNo: value
          }
          this.completePost(data)
        } else {
          this.$message.error('请输入快递单号')
          return false
        }
      })
    },
    // 完成邮寄
    completePost (data) {
      deliveryDistribution(data).then(res => {
        this.getLtineraryList()
        this.$message({
          message: '提交成功',
          type: 'success'
        })
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 导出行程单邮寄列表
    exportMailPostList () {
      let data = JSON.parse(JSON.stringify(this.filter))
      let url = 'delivery/exportTravelMail'
      let name = getRouteName('/travelMailWait')
      let type = 'xls'
      data.start = 1
      data.end = this.travelPostList.total
      delete data.page
      delete data.rows
      // let total = this.travelPostList.total
      let obj = {
        data,
        url,
        name,
        type
      }
      excelList(obj, this)
    },
    // 发送回收消息
    handleSendMessage (param) {
      this.$confirm('是否确认发送回收消息 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        deliverySendMessage({ orderid: param.orderid, ticketid: param.ticketid }).then(() => {
          this.$message.success('操作完成')
          this.getLtineraryList()
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    // 回收确认
    handleConfirmComplate (param) {
      this.$confirm('确认回收确认？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        confirmCompletion({ ticketid: param.ticketid }).then(() => {
          this.$message.success('操作成功')
          this.getLtineraryList()
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('操作取消')
      })
    }
  }
}
</script>

<style scoped>

</style>
