<template>
  <div class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable v-model="params.oderNum" placeholder="订单号" title="订单号"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable v-model="params.cardNum" placeholder="乘机人证件号" title="乘机人证件号"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable v-model="params.number" placeholder="票号" title="票号"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable v-model="params.oldPnr" placeholder="原票号" title="原票号"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable v-model="params.name" placeholder="联系人姓名" title="联系人姓名"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable v-model="params.phone" placeholder="联系人手机号" title="联系人手机号"></el-input>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="search">查询</el-button>
          <el-button size="medium" @click="initrefer">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" @click="excel" :disabled='dataList.length === 0'>导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container" >
        <el-table
          v-loading="loading"
          :data='dataList'
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :cell-style="tableAttributes.cellStyle"
          @selection-change="handleSelectionChange">
          <el-table-column fixed="left" type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="原PNR">
                  <span>{{ props.row.oldPnr }}</span>
                </el-form-item>
                <el-form-item label="原起飞到达时间">
                  <span>{{ props.row.oldFlagTime }}</span>
                </el-form-item>
                <el-form-item label="原航班号">
                  <span>{{ props.row.oldNumber }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>
          <el-table-column label="订单号" prop="orderNumber" min-width="180"></el-table-column>
          <el-table-column label="乘机人姓名" prop="planName" min-width="120"></el-table-column>
          <el-table-column label="乘机人证件号" prop="cardNumber" min-width="180"></el-table-column>
          <el-table-column label="票号" prop="tickNo" min-width="150"></el-table-column>
          <el-table-column label="舱位" prop="cardno" min-width="80"></el-table-column>
          <el-table-column label="改期后航班号" prop="uppalnNumber" min-width="140"></el-table-column>
          <el-table-column label="改期后pnr" prop="upPnr" min-width="180"></el-table-column>
          <el-table-column label="改期后起飞到达时间" prop="upFlagTime" min-width="180"></el-table-column>
          <el-table-column label="不正常原因" prop="abnormal" min-width="180"></el-table-column>
          <el-table-column label="K座记录" prop="kSeat" min-width="180"></el-table-column>
          <el-table-column label="联系人姓名" prop="peoName" min-width="150"></el-table-column>
          <el-table-column label="联系人手机号" prop="peoPhone" min-width="180"></el-table-column>
          <el-table-column label="订单时间" prop="orderTime" min-width="180"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dataList.length">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { computeTableHeight } from '../../../utils/index'
import data from './data'
export default {
  name: 'index',
  data () {
    return {
      dataViewHeight: null,
      params: {
        oderNum: '',
        cardNum: '',
        number: '',
        oldPnr: '',
        name: '',
        phone: '',
        page: 1
      },
      dataList: [], //  之后可以改成对象
      dataArr: [],
      loading: false
    }
  },
  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  },
  created () {
    this.initData()
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes, // 表格
      pagination: state => state.app.pagination, // 分页
      channelList: state => state.app.channelList
    })
  },
  methods: {
    search () {},
    initrefer () {},
    excel () {},
    initData () {
      this.dataList = data
    },
    handleSelectionChange (list) {
      this.dataArr = list
    },
    handleSizeChange () {},
    handleCurrentChange () {}
  }
}
</script>

<style scoped lang="scss">
</style>
