<template>
  <!--<div>机票记录</div>-->
  <div class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" v-model="filter.ticketNo" placeholder="票号" clearable @keydown.enter.native="getTicketList()"></el-input>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getTicketList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit()">添加</el-button>
      </div>
      <div v-if="isColumn">
        <div class="search-container clearfix flex">
          <div class="check-ipt">
            <el-checkbox @change="checkHanler" v-model="checkedAll" :indeterminate="isIndeterminate">全选</el-checkbox>
          </div>
          <div>
            <div class="check-item check-ipt" v-for="item in checkList" :key="item.key">
              <el-checkbox-group v-model="checked" @change="handleCheck">
                <el-checkbox  :label="item.key" :key="item.key" @change="handleoneCheck(item.key)">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="column-btn" @click="switchColumn">
        <i class="el-icon-arrow-up"></i>
      </div>
      <div class="table-container">
        <el-table
          key="Math.random()"
          :cell-style= "tableAttributes.cellStyle"
          :stripe="tableAttributes.stripe"
          :border="tableAttributes.border"
          :data="ticketList.contents"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
<!--          <el-table-column type="selection"></el-table-column>-->
          <el-table-column label="票号" v-if="tableList.ticketNo" prop="ticketNo" min-width="100"></el-table-column>
          <el-table-column label="手机号" v-if="tableList.mobile" prop="mobile" min-width="120"></el-table-column>
          <el-table-column label="出发城市" v-if="tableList.fromCity" prop="fromCity" min-width="120"></el-table-column>
          <el-table-column label="达到城市" v-if="tableList.arriveCity" prop="arriveCity" min-width="120"></el-table-column>
          <el-table-column label="航司二字码" v-if="tableList.airways" prop="airways" min-width="100"></el-table-column>
          <el-table-column label="航班号" v-if="tableList.flyNumber" prop="flyNumber" min-width="100"></el-table-column>
          <el-table-column label="航班日期" v-if="tableList.flyDate" prop="flyDate" min-width="120"></el-table-column>
          <el-table-column label="起飞时间" v-if="tableList.flyTime" prop="flyTime" min-width="100"></el-table-column>
          <!--<el-table-column label="到达时间" v-if="tableList.arriveTime" prop="arriveTime" min-width="100"></el-table-column>-->
<!--          <el-table-column label="金额" v-if="tableList.money" prop="money" min-width="100"></el-table-column>-->
<!--          <el-table-column label="票面价" v-if="tableList.fare" prop="fare" min-width="160"></el-table-column>-->
<!--          <el-table-column label="发票流水号" v-if="tableList.serialNumber" prop="serialNumber" min-width="120"></el-table-column>-->
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
            :total="ticketList.totalRows">
          </el-pagination>
        </div>
      </div>
    </div>
    <DetailDiaLog ref="addDetailAby"></DetailDiaLog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { computeTableHeight } from '../../../utils/index'
import { queryticketList } from './api'
import DetailDiaLog from './components/detailDiaLog'
export default {
  name: 'TicketRecord',
  data () {
    return {
      loading: false, // 加载
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      dataViewHeight: null,
      componentName: 'TicketRecord',
      multipleSelection: [], // 表格多选
      filter: {
        ticketNo: '', // 票号
        page: '', // 页码
        rows: '' // 页码大小
      }, // 查询条件数据表单
      ticketList: {}, // 查询结果数据表单
      tableList: {
        userId: true,
        username: true,
        ticketNo: true,
        mobile: true,
        fromCity: true,
        arriveCity: true,
        airways: true,
        flyNumber: true,
        flyDate: true,
        flyTime: true,
        arriveTime: true
        // money: true,
        // fare: true,
        // isInvoiced: true,
        // serialNumber: true
      } // 查询结果展示数据表单
    }
  },
  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  },
  created () {
    this.getTicketList(1, this.pagination.pageSize)
  },
  mixins: [checkAttrs],
  components: {
    DetailDiaLog
  },

  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  methods: {
    // 分页导航
    handleSizeChange (pages) {
      this.getTicketList(null, pages)
    },
    handleCurrentChange (page) {
      this.getTicketList(page, null)
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    getTicketList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      this.filter.isJson = true
      queryticketList(this.filter).then(res => {
        this.ticketList = res.data
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.data || err.message)
      })
    },
    // 查询条件 -- 重置
    resetFilter () {
      this.filter.ticketNo = ''
      this.getTicketList()
    },
    // 添加
    handleEdit () {
      this.$refs.addDetailAby.initComponent()
    }
  }
}
</script>

<style scoped>

</style>
