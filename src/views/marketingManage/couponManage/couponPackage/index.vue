<template>
<!--  <div>优惠券礼包</div>-->
  <div class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="礼包名称" v-model="filter.packName" @keydown.enter.native="getCouponPacksList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="营销活动" v-model="filter.activityName" @keydown.enter.native="getCouponPacksList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="启用状态" v-model="filter.packStatus"  @keydown.enter.native="getCouponPacksList()">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getCouponPacksList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit()">添加</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          key="Math.random()"
          :cell-style= "tableAttributes.cellStyle"
          :stripe="tableAttributes.stripe"
          :border="tableAttributes.border"
          :data="couponPacksList.rows"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
<!--          <el-table-column type="selection" fixed="left"></el-table-column>-->
          <el-table-column label="礼包名称" v-if="tableList.packName" prop="packName" min-width="160"></el-table-column>
          <el-table-column label="礼包发放总数" v-if="tableList.packNum" prop="packNum" min-width="100"></el-table-column>
          <el-table-column label="创建时间" v-if="tableList.createTime" prop="createTime" min-width="160"></el-table-column>
          <el-table-column label="营销活动" v-if="tableList.activityName" prop="activityName" min-width="160"></el-table-column>
          <el-table-column label="模板内容" v-if="tableList.allTemplet" prop="allTemplet" min-width="160">
            <template slot-scope="scope">
              <div>
                <div v-for="(item, index) in scope.row.allTemplet" :key="index">
                  <span v-if="item !== ''">{{item}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" v-if="tableList.packStatus" prop="packStatus" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.packStatus === '0'">禁用</span>
              <span v-if="scope.row.packStatus === '1'">启用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="140">
            <template slot-scope="scope">
              <span class="active-text mr-5" @click='handleStatus(scope.row.packId, scope.row.packStatus)' v-if="scope.row.packStatus === '1'" title="启用">禁用</span>
              <span class="active-text mr-5" @click='handleStatus(scope.row.packId, scope.row.packStatus)' v-if="scope.row.packStatus === '0'" title="禁用">启用</span>
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
              <span class="active-text mr-5" title="变更日志" @click="handleLogChange(scope.row.packId)">变更日志</span>
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
            :total="couponPacksList.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--新增/修改弹出框-->
    <el-dialog :title="popupTitle" :visible.sync="editVisible" width="560px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">礼包名称</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="礼包名称" clearable v-model="editForm.packName"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.packName">礼包名称不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">礼包发放数量</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="礼包发放数量" clearable v-model="editForm.packNum"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.packNum">礼包发放数量不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">礼包状态</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.packStatus" placeholder="请选择礼包状态" size="medium">
                  <el-option key="0" label="禁用" value="0"></el-option>
                  <el-option key="1" label="启用" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.packStatus">礼包状态不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">营销活动</div>
                <div class="ipt-medium">
                  <el-select v-model="editForm.activityId" placeholder="请选择营销活动" size="medium">
                    <el-option v-for="item in activityTypeList" :key="item.activityId" :value="item.activityId" :label="item.activityName"></el-option>
                  </el-select>
                  <div class="warning-info" v-if="isEmpty && !editForm.activityId">营销活动不可为空</div>
                </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="ipt-medium">
                <el-button size="medium" @click="addTemp" >新增</el-button>
              </div>
            </div>
          </diV>
          <div class="row" v-for="(items, index) in listNum" :key="items.id">
            <div class="column">
              <div class="label required">优惠券模版</div>
              <div class="ipt-medium">
                <el-select v-model="items.templetIds" size='medium' placeholder="优惠券模版">
                  <el-option v-for="item in couponTempletTypeList" :key="item.templetId" :value="item.templetId" :label="item.templetName"></el-option>
                </el-select>
                <div class="warning-info" v-if="isShow && !items.templetIds">优惠券模版不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">数量</div>
              <div class="ipt-medium flex">
                <el-input-number controls-position="right" size="medium" style="width: 100px" v-model="items.getNums" :min="1" :max="999999999" label="描述文字"></el-input-number>
                <el-button v-if="index !== 0" size="medium" type="primary" icon="el-icon-delete" @click="delTemp(index)" >删除</el-button>
              </div>
              <div class="warning-info" v-if="isShow && !items.getNums">数量不可为空</div>
            </div>
          </diV>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="saveEdit">提交</el-button>
          <el-button size="medium" @click="resetEdit">重置</el-button>
        </div>
      </div>
    </el-dialog>
    <!--变更日志查询-->
    <ChangeLogDiaLog ref="changeLogAby"></ChangeLogDiaLog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ChangeLogDiaLog from '../../../../components/ChangeLogDiaLog'
import { computeTableHeight, getActivityType, getCouponTempletType } from '../../../../utils/index'
import { queryMetCouponPacksList, queryAddMetCouponPacks, queryUpdateMetCouponPacks, queryUpdateMetCouponPacksStatus, queryCouponTempletType } from './api'

export default {
  name: 'CouponPackage',
  data () {
    return {
      loading: false,
      dataViewHeight: null,
      filter: {
        packName: '', // 礼包名称
        packStatus: '', // 启用状态
        activityName: '', // 营销活动
        page: '', // 当前页
        rows: '' // 每页查询数量
      }, // 查询条件表单
      couponPacksList: {}, // 表格数据表单
      tableList: {
        packName: true, // 礼包名称
        packNum: true, // 礼包发放总数
        packStatus: true, // 启用状态
        createTime: true, // 创建时间
        allTemplet: true, // 模板内容
        activityName: true // 营销活动
      }, // 表格展示数据表单
      editVisible: false, // 添加/修改弹出框 -- 显示隐藏
      isReset: false, // 添加/修改弹出框 -- 切换添加/修改
      isEmpty: false, // 添加/修改弹出框 -- 输入框判空
      isShow: false, // 添加/修改弹出框 -- 新增模板/数量判空
      popupTitle: '', // 添加/修改弹出框 -- 标题
      editForm: {}, // 添加/修改弹出框 -- 数据表单
      listNum: [], // 添加/修改弹出框 -- 优惠券模板添加删除
      templetId: ''
    }
  },

  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      activityTypeList: state => state.app.activityTypeList,
      couponTempletTypeList: state => state.app.couponTempletTypeList
    })
  },

  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  },
  components: {
    ChangeLogDiaLog
  },
  created () {
    this.judgeTypeList()
    this.getCouponPacksList(1, this.pagination.pageSize)
  },

  methods: {
    // state没有则请求服务器
    judgeTypeList () {
      if (!this.activityTypeList.length) {
        getActivityType()
      }
      if (!this.couponTempletTypeList.length) {
        getCouponTempletType()
      }
    },

    // 分页导航
    handleSizeChange (pages) {
      this.getCouponPacksList(null, pages)
    },
    handleCurrentChange (page) {
      this.getCouponPacksList(page, null)
    },

    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 获取表格数据
    getCouponPacksList (page, pageSize) {
      let allTemplet = []
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      queryMetCouponPacksList(this.filter).then(res => {
        this.couponPacksList = res
        for (let item of this.couponPacksList.rows) {
          allTemplet = item.allTemplet.split(',')
          item.allTemplet = allTemplet
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },

    // 重置搜索条件
    resetFilter () {
      this.filter = {
        packName: '',
        packStatus: '',
        activityName: ''
      }
      this.getCouponPacksList(1, this.pagination.pageSize)
    },

    // 禁用/启用
    handleStatus (id, status) {
      let title = ''
      if (status === '0') {
        title = '是否确认启用?'
      } else {
        title = '是否确认禁用?'
      }
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        let data = {
          id: id,
          status: status === '0' ? '1' : '0'
        }
        queryUpdateMetCouponPacksStatus(data).then(res => {
          this.$message.success(res.message)
          this.getCouponPacksList()
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消修改')
      })
    },

    // 变更日志查询
    handleLogChange (id) {
      let url = '/metCouponPacks/getUpdateLog'
      this.$refs.changeLogAby.initComponent(url, id)
    },

    // 添加/修改弹出框
    handleEdit (params) {
      this.editVisible = true
      this.resetEdit()
      if (params) {
        this.isReset = false
        this.popupTitle = '修改'
        this.hangdleParams(params)
      } else {
        this.isReset = true
        this.popupTitle = '添加'
      }
    },

    // 添加/修改弹出框 -- 优惠券模板/数量新增
    addTemp () {
      let i = this.listNum.length - 1
      if (this.listNum[i].templetIds && this.listNum[i].getNums) {
        this.isShow = false
        this.listNum.push({ templetIds: '', getNums: '' })
      } else {
        this.isShow = true
      }
    },

    // 添加/修改弹出框 -- 优惠券模板/数量删除
    delTemp (idx) {
      this.listNum.splice(idx, 1)
    },

    // 添加/修改弹出框 -- 数据处理
    hangdleParams (params) {
      let listNum = []
      this.editForm.packId = params.packId
      this.editForm.packName = params.packName
      this.editForm.packNum = params.packNum
      this.editForm.packStatus = params.packStatus
      this.editForm.activityId = params.activityId
      let tempSplit = params.allTemplet
      for (let i = 0; i < tempSplit.length; i++) {
        let b = tempSplit[i].split('，')[1]
        let c = tempSplit[i].split('，')[2].substring(0, 1)
        listNum.push({ templetIds: b, getNums: c })
      }
      this.templetData(listNum)
      this.listNum = listNum
    },

    templetData (listNum) {
      queryCouponTempletType(this.filter).then(res => {
        for (let item of res.rows) {
          for (let t of listNum) {
            if (t.templetIds === item.templetName) {
              t.templetIds = item.templetId
            }
          }
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },

    // 添加/修改弹出框 -- 提交
    saveEdit () {
      let templetIdsList = []
      let getNumsList = []
      if (this.editForm.packName && this.editForm.packNum && this.editForm.packStatus && this.editForm.activityId) {
        if (this.listNum[this.listNum.length - 1].templetIds && this.listNum[this.listNum.length - 1].getNums) {
          let data = JSON.parse(JSON.stringify(this.editForm))
          for (let item of this.listNum) {
            templetIdsList.push(item.templetIds)
            getNumsList.push(item.getNums)
          }
          data.templetIds = templetIdsList.join(',')
          data.getNums = getNumsList.join(',')
          if (this.isReset === false) {
            this.updateParamsData(data)
          } else {
            this.addParamsData(data)
          }
        } else {
          this.isShow = true
        }
      } else {
        this.isEmpty = true
        this.isShow = true
      }
    },

    // 添加弹出框 -- 提交接口
    addParamsData (data) {
      queryAddMetCouponPacks(data).then(res => {
        this.editVisible = false
        this.getCouponPacksList()
        this.$message.success(res.message)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },

    // 修改弹出框 -- 提交接口
    updateParamsData (data) {
      queryUpdateMetCouponPacks(data).then(res => {
        this.editVisible = false
        this.getCouponPacksList()
        this.$message.success(res.message)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },

    // 添加/修改弹出框 -- 重置
    resetEdit () {
      this.editForm = {
        packName: '',
        packNum: '',
        packStatus: '',
        templetIds: '',
        getNums: '',
        activityId: ''
      }
      this.listNum = [ { templetIds: '', getNums: '' } ]
      this.isEmpty = false
      this.isShow = false
    }
  }
}
</script>

<style scoped lang="scss"></style>
