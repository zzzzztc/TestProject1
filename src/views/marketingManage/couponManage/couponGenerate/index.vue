<template>
<!--  <div>优惠券生成</div>-->
  <div id="CouponGenerate" class="container" >
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="模板名称" v-model="filter.templetName" @keydown.enter.native="getMetCouponMakeList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="发放批次号" v-model="filter.issueCode" @keydown.enter.native="getMetCouponMakeList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="发放批次名称" v-model="filter.issueName" @keydown.enter.native="getMetCouponMakeList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="发放渠道" v-model="filter.issueChannel" @keydown.enter.native="getMetCouponMakeList()">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="发放状态" v-model="filter.issueStatus"  @keydown.enter.native="getMetCouponMakeList()">
            <el-option label="失败" value="0"></el-option>
            <el-option label="成功" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getMetCouponMakeList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleGenerate()">生成优惠券</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          key="Math.random()"
          :cell-style= "tableAttributes.cellStyle"
          :stripe="tableAttributes.stripe"
          :border="tableAttributes.border"
          :data="couponMakeList.rows"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
<!--          <el-table-column type="selection" fixed="left"></el-table-column>-->
          <el-table-column label="发放批次号" v-if="tableList.issueCode" prop="issueCode" min-width="100"></el-table-column>
          <el-table-column label="发放批次名称" v-if="tableList.issueName" prop="issueName" min-width="160"></el-table-column>
          <el-table-column label="发放渠道" v-if="tableList.issueChannel" prop="channel" min-width="160">
            <template slot-scope="scope">
                <span v-if="scope.row.issueChannel && scope.row.issueChannel !== 'null'">
                  {{scope.row.issueChannel | channelMap}}
                </span>
              <span v-else>全渠道</span>
            </template>
          </el-table-column>
          <el-table-column label="此次发放数量" v-if="tableList.issueNum" prop="issueNum" min-width="120"></el-table-column>
          <el-table-column label="发放成功数量" v-if="tableList.successNum" prop="successNum" min-width="120"></el-table-column>
          <el-table-column label="发放状态" v-if="tableList.issueStatus" prop="issueStatus" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.issueStatus === '0'">失败</span>
              <span v-if="scope.row.issueStatus === '1'">成功</span>
            </template>
          </el-table-column>
          <el-table-column label="发放时间" v-if="tableList.issueTime" prop="issueTime" min-width="160"></el-table-column>
          <el-table-column label="模板编号" v-if="tableList.templetCode" prop="templetCode" min-width="100"></el-table-column>
          <el-table-column label="优惠券名称" v-if="tableList.templetName" prop="templetName" min-width="140"></el-table-column>
          <el-table-column label="优惠券金额" v-if="tableList.price" prop="price" min-width="100"></el-table-column>
          <el-table-column label="总数量" v-if="tableList.total" prop="total" min-width="100"></el-table-column>
          <el-table-column label="发放人姓名" v-if="tableList.createOpName" prop="createOpName" min-width="140"></el-table-column>
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
            :total="couponMakeList.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--生成优惠券弹出框-->
    <el-dialog title="生成优惠券" :visible.sync="editVisible" width="560px" v-loading="Homeloading">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">优惠券模板</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.templeId" size='medium' placeholder="优惠券模板" @change="isChange($event)">
                  <el-option v-for="item in couponTempletTypeList" :key="item.templetId" :value="item.templetId" :label="item.templetName"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.templeId">优惠券模版不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">发放渠道</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.issueChannel" placeholder="请选择发放渠道" size="medium" clearable multiple collapse-tags>
                  <el-option v-for="item in channelList" :key="item.chalId" :value="item.chalCode" :label="item.chalName"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.issueChannel">发放渠道不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">发放批次号</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="发放批次号" clearable v-model="editForm.issueCode"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.issueCode">发放批次号不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">发放批次名称</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="发放批次名称" clearable v-model="editForm.issueName"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.issueName">发放批次名称不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">此次发放数量</div>
              <div class="ipt-medium">
                <el-input size="medium" :placeholder="placeholder" clearable v-model="editForm.issueNum" @input="handleChange"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.issueNum">此次发放数量不可为空</div>
                <div class="warning-info" v-if="isShow && editForm.issueNum > 10000">此次发放数量上限10000</div>
                <div class="warning-info" v-if="isShow && editForm.issueNum <= 0">此次发放数量下限为1</div>
              </div>
            </div>
          </diV>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" :disabled="disabled" @click="saveEdit">提交</el-button>
          <el-button size="medium" @click="resetEdit">重置</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getChannelList, getCouponTempletType } from '../../../../utils/index'
import { queryMetCouponMakeList, queryMakeCoupon, queryCouponTempletType } from './api'
import { computWidth } from '../../../../mixins/computWidt'

export default {
  name: 'CouponGenerate',
  data () {
    return {
      disabled: false,
      loading: false,
	    Homeloading:false,
      dataViewHeight: null,
      filter: {
        templetName: '', // 模板名称
        issueCode: '', // 发放批次号
        issueName: '', // 发放批次名称
        issueChannel: '', // 发放渠道
        issueStatus: '', // 发放状态
        page: '', // 当前页
        rows: '' // 每页查询数量
      }, // 查询条件表单
      couponMakeList: {}, // 表格数据表单
      tableList: {
        issueCode: true, // 发放批次号
        issueName: true, // 发放批次名称
        issueChannel: true, // 发放渠道
        issueNum: true, // 此次发放数量
        successNum: true, // 发放成功数量
        issueStatus: true, // 发放状态
        issueTime: true, // 发放时间
        templetCode: true, // 模板编号
        templetName: true, // 优惠券名称
        price: true, // 优惠券金额
        notUseSum: true, // 可发放数量
        total: true, // 总数量
        createOpName: true // 发放人姓名

      }, // 表格展示数据表单
      editVisible: false, // 生成优惠券弹出框 -- 显示隐藏
      isEmpty: false, // 生成优惠券弹出框 -- 输入框判空
      isShow: false, // 生成优惠券弹出框 -- 数量限制
      editForm: {
        templeId: '',
        issueCode: '',
        issueName: '',
        issueChannel: '',
        issueNum: ''
      }, // 生成优惠券弹出框 -- 数据表单
      placeholder: '剩余数量: 0'
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList,
      couponTempletTypeList: state => state.app.couponTempletTypeList
    })
  },
  created () {
    this.judgeChannelList()
    this.getMetCouponMakeList(1, this.pagination.pageSize)
  },
  mixins: [computWidth],
  methods: {
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
      if (!this.couponTempletTypeList.length) {
        getCouponTempletType()
      }
    },

    isChange (e) {
      let total = 0
      queryCouponTempletType(this.filter).then(res => {
        for (let item of res.rows) {
          if (e === item.templetId) {
            total = item.total
          }
        }
        this.placeholder = '模板剩余数量：' + total
      }).catch(err => {
        this.$message.error(err.message)
      })
    },

    // 分页导航
    handleSizeChange (pages) {
      this.getMetCouponMakeList(null, pages)
    },
    handleCurrentChange (page) {
      this.getMetCouponMakeList(page, null)
    },

    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 获取表格数据
    getMetCouponMakeList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      queryMetCouponMakeList(this.filter).then(res => {
        this.couponMakeList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },

    // 查询条件重置
    resetFilter () {
      this.filter = {
        templetName: '',
        issueCode: '',
        issueName: '',
        issueChannel: '',
        issueStatus: ''
      }
      this.getMetCouponMakeList(1, this.pagination.pageSize)
    },

    // 生成优惠券弹出框 -- 显示隐藏
    handleGenerate (params) {
      this.editVisible = true
      this.disabled = false
      this.resetEdit()
      if (params) {
        this.hangdleParams(params)
      }
    },

    // 生成优惠券弹出框 -- 数据处理
    hangdleParams (params) {
      this.editForm.templeId = params.templeId
      this.editForm.issueCode = params.issueCode
      this.editForm.issueName = params.issueName
      this.editForm.issueChannel = params.issueChannel.split(',')
      this.editForm.issueNum = params.issueNum
    },

    // 生成优惠券弹出框 -- 监听数量变化
    handleChange (e) {
      if (e && (e > 10000 || e <= 0)) {
        this.isShow = true
      } else {
        this.isShow = false
      }
    },
    // 生成优惠券弹出框 -- 提交
    saveEdit () {
      if (this.editForm.templeId && this.editForm.issueCode && this.editForm.issueName && this.editForm.issueChannel && this.editForm.issueNum) {
        if (this.isShow === false) {
          let data = JSON.parse(JSON.stringify(this.editForm))
          data.issueChannel = data.issueChannel.join(',')
          this.disabled = true
          this.makeParamsData(data)
        }
      } else {
        this.isEmpty = true
      }
    },

    // 生成优惠券弹出框 -- 提交接口
    makeParamsData (data) {
    	this.Homeloading = true
      queryMakeCoupon(data).then(res => {
        this.Homeloading = false
        this.editVisible = false
        this.getMetCouponMakeList()
        this.$message.success(res.message)
      }).catch(err => {
	      this.Homeloading = false
        this.disabled = false
        this.$message.error(err.message)
      })
    },

    // 生成优惠券弹出框 -- 重置
    resetEdit () {
      this.editForm = {
        templeId: '',
        issueCode: '',
        issueName: '',
        issueChannel: '',
        issueNum: ''
      }
      this.placeholder = '模板剩余数量: 0'
      this.isEmpty = false
      this.isShow = false
    }
  }
}
</script>

<style scoped lang="scss">
</style>
