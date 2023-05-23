<template>
  <!--<div>FD运价维护</div>-->
  <div id="FDFreightMaintain" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="FD编号" v-model="filter.fdCode" @keydown.enter.native="getFdBasicPriceList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="出发地" v-model="filter.afrom" @keydown.enter.native="getFdBasicPriceList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="到达地" v-model="filter.ato" @keydown.enter.native="getFdBasicPriceList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="舱位" v-model="filter.cabin" @keydown.enter.native="getFdBasicPriceList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="基础舱位" v-model="filter.basicCabin" @keydown.enter.native="getFdBasicPriceList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.flightDateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="生效开始">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.flightDateEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="生效截止">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.saleDateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="销售开始">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.saleDateEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="销售截止">
          </el-date-picker>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getFdBasicPriceList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit()">添加</el-button>
        <el-button type="danger" size="medium" :disabled="multipleSelection.length === 0" @click="handleDelete()">删除</el-button>
        <el-button type="success" size="medium" :disabled="FdFreightMaintainList.total === 0" @click="handleExport()">导出Excel文件</el-button>
        <el-button type="success" size="medium" @click="handleExport(null)">导出Excel模版</el-button>
        <el-button size="medium" @click="handleUpload">上传FD文件</el-button>
<!--        <el-button size="medium" @click="handleExport">模板下载</el-button>-->
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          key="Math.random()"
          :cell-style= "tableAttributes.cellStyle"
          :header-cell-class-name="handleCellStyle"
          :cell-class-name="handleCellStyle"
          :stripe="tableAttributes.stripe"
          :border="tableAttributes.border"
          :data="FdFreightMaintainList.rows"
          v-loading="loading"
          :height="dataViewHeight"
          style="font-size: 10px"
          row-key="lowestpriceid"
          @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" width="40"></el-table-column>
          <el-table-column align="center" label="主键ID" prop="fdId" min-width="32"></el-table-column>
          <el-table-column align="center" label="FD编号" prop="fdCode" min-width="48"></el-table-column>
          <el-table-column align="center" label="始发地" prop="afrom" min-width="34"></el-table-column>
          <el-table-column align="center" label="目的地" prop="ato" min-width="34"></el-table-column>
          <el-table-column align="center" label="起始销售日期" prop="saleDateStart" min-width="56"></el-table-column>
          <el-table-column align="center" label="截止销售日期" prop="saleDateEnd" min-width="56"></el-table-column>
          <el-table-column align="center" label="生效日期" prop="flightDateStart" min-width="50"></el-table-column>
          <el-table-column align="center" label="截止日期" prop="flightDateEnd" min-width="50"></el-table-column>
          <el-table-column align="center" label="运价基础" prop="basicCabin" min-width="42"></el-table-column>
          <el-table-column align="center" label="折扣率" prop="discount" min-width="34"></el-table-column>
          <el-table-column align="center" label="特种运价金额" prop="fdPrice" min-width="56"></el-table-column>
          <el-table-column align="center" label="舱位代号" prop="cabin" min-width="42"></el-table-column>
          <el-table-column align="center" label="创建日期" prop="createDate" min-width="52">
            <template slot-scope='scope'>
              <div v-if="scope.row.createDate">
                <div v-for="(item, index) in scope.row.createDate.split(' ')" :key="index">
                  <span v-if="item !== ''">{{item}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="创建人" prop="createOpid" min-width="46"></el-table-column>
<!--          <el-table-column label="修改时间" prop="modifyDate" min-width="90"></el-table-column>-->
<!--          <el-table-column label="修改人" prop="modifyOpid" min-width="65"></el-table-column>-->
          <el-table-column align="center" label="删除状态" prop="deleteFlag" min-width="42">
            <template slot-scope="scope">
              <div v-if="scope.row.deleteFlag === '0'">未删除</div>
              <div v-if="scope.row.deleteFlag === '1'">已删除</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="64">
            <template slot-scope="scope">
<!--              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>-->
              <span class="danger-text mr-5" title="删除" @click="handleDelete(scope.row.fdId)">删除</span>
              <span class="active-text mr-5" title="操作日志" @click="handleLog(scope.row.fdId)">操作日志</span>
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
            :total="FdFreightMaintainList.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--新增弹出框-->
    <el-dialog v-dialogDrag :title="popupTitle" :visible.sync="editVisible" width="820px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label">FD编号</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="FD编号" clearable v-model="editForm.fdCode"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.fdCode">FD编号不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">始发地</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="始发地" clearable v-model="editForm.afrom"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.afrom">始发地不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">目的地</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="目的地" clearable v-model="editForm.ato"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.ato">目的地不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">折扣率</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="折扣率" clearable v-model="editForm.discount"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.discount">折扣率不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">舱位代号</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="舱位代号" clearable v-model="editForm.cabin"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.cabin">舱位代号不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">运价基础</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="运价基础" clearable v-model="editForm.basicCabin"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.basicCabin">运价基础不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">特种运价金额</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="特种运价金额" clearable v-model="editForm.fdPrice"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.fdPrice">特种运价金额不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">生效日期</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="yyyyMMdd,例: 20181028" clearable v-model="editForm.flightDateStart"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.flightDateStart">生效日期不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">截止日期</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="yyyyMMdd,例: 99991229" clearable v-model="editForm.flightDateEnd"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.flightDateEnd">截止日期不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">起始销售日期</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="yyyyMMdd,例: 20181028" clearable v-model="editForm.saleDateStart"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.saleDateStart">起始销售日期不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">截止销售日期</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="yyyyMMdd,例: 99991229" clearable v-model="editForm.saleDateEnd"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.saleDateEnd">截止销售日期不可为空</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="saveEdit">提交</el-button>
          <el-button size="medium" @click="resetEdit">重置</el-button>
        </div>
      </div>
    </el-dialog>
    <!--上传FD文件弹出框-->
    <el-dialog title="上传FD文件" :visible.sync="importVisible" width="500px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <input type="file" @change="choiceFile($event)">
              <div v-if="filepath">{{filepath}}</div>
              <div class="warning-info" v-if="isfile && !fileList.length > 0">上传文件不可为空</div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="paramJudge">提交</el-button>
          <el-button size="medium" @click="importVisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <!--<div>操作日志弹出框</div>-->
    <el-dialog v-dialogDrag title="操作日志" :visible.sync="dialogVisible" width="1060px">
      <div class="dialog-container" v-loading="logLoading">
        <div class="dialog-main">
          <el-table :data="logList" :border="tableAttributes.border" :stripe="tableAttributes.stripe">
            <el-table-column label="操作内容" prop="logContent" min-width="100"></el-table-column>
            <el-table-column label="操作人" prop="opname" min-width="100"></el-table-column>
            <el-table-column label="操作时间" prop="createTime" min-width="100"></el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { queryFdBasicPriceList, queryImportFdBasicPrice, queryAddFdBasicPrice, queryUpdateFdBasicPrice, queryDeleteFdBasicPrice, queryFdBBasicPriceLog } from './api'
import { computWidth } from '../../../mixins/computWidt'
import { filterIds, excelList, getRouteName } from '../../../utils/index'

export default {
  name: 'FDFreightMaintain',
  data () {
    return {
      loading: false,
      logLoading: false,
      dataViewHeight: null,
      importVisible: false, // 上传FD文件弹出框 -- 显示隐藏
      fileList: [],
      filepath: '',
      isfile: false,
      multipleSelection: [], // 表格多选
      filter: {
        fdCode: '', // FD编号
        afrom: '', // 出发地
        ato: '', // 到达地
        cabin: '', // 舱位
        basicCabin: '', // 基础舱位
        flightDateStart: '', // 生效开始
        flightDateEnd: '', // 生效截止
        saleDateStart: '', // 销售开始
        saleDateEnd: '', // 销售截止
        page: '',
        rows: ''
      }, // 查询条件
      FdFreightMaintainList: {}, // 查询结果表单
      editVisible: false, // 添加/修改弹出框 -- 显示隐藏
      isReset: false, // 添加/修改弹出框 -- 切换添加/修改
      isEmpty: false, // 添加/修改弹出框 -- 输入框判空
      popupTitle: '', // 添加/修改弹出框 -- 标题
      editForm: {}, // 添加/修改弹出框 -- 数据表单
      dialogVisible: false, // 操作日志弹出框
      logList: [] // 操作日志表单
    }
  },
  created () {
    this.getFdBasicPriceList(1, this.pagination.pageSize)
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      baseUrl: state => state.app.baseUrl
    })
  },
  filters: {
    upper (value) {
      if (!value) return ''
      value = value.toString()
      return value.toUpperCase()
    },
    dateParam (value) {
      if (value) {
        let date = value.split('-')
        return date[0] + date[1] + date[2]
      } else {
        return ''
      }
    }
  },
  mixins: [computWidth],
  methods: {
    handleCellStyle () {
      return 'table-th'
    },
    // 分页导航
    handleSizeChange (pages) {
      this.getFdBasicPriceList(null, pages)
    },
    handleCurrentChange (page) {
      this.getFdBasicPriceList(page, null)
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    getDateParam () {
      this.filter.flightDateStart = this.filter.flightDateStart.p
    },
    // 获取表格数据
    getFdBasicPriceList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      let data = JSON.parse(JSON.stringify(this.filter))
      data.afrom = this.$options.filters.upper(data.afrom)
      data.ato = this.$options.filters.upper(data.ato)
      data.cabin = this.$options.filters.upper(data.cabin)
      data.basicCabin = this.$options.filters.upper(data.basicCabin)
      data.flightDateStart = this.$options.filters.dateParam(data.flightDateStart)
      data.flightDateEnd = this.$options.filters.dateParam(data.flightDateEnd)
      data.saleDateStart = this.$options.filters.dateParam(data.saleDateStart)
      data.saleDateEnd = this.$options.filters.dateParam(data.saleDateEnd)
      queryFdBasicPriceList(data).then(res => {
        this.FdFreightMaintainList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 查询条件重置
    resetFilter () {
      this.filter.fdCode = ''
      this.filter.afrom = ''
      this.filter.ato = ''
      this.filter.cabin = ''
      this.filter.basicCabin = ''
      this.filter.flightDateStart = ''
      this.filter.flightDateEnd = ''
      this.filter.saleDateStart = ''
      this.filter.saleDateEnd = ''
      this.getFdBasicPriceList(1, this.pagination.pageSize)
    },
    // 添加/修改弹出框 -- 显示隐藏
    handleEdit (param) {
      this.editVisible = true
      this.resetEdit()
      if (param) {
        this.isReset = false
        this.popupTitle = '修改'
        this.hangdleParams(param)
      } else {
        this.isReset = true
        this.popupTitle = '添加'
      }
    },
    // 添加/修改弹出框 -- 数据处理
    hangdleParams (params) {
      this.editForm.fdId = params.fdId
      this.editForm.fdCode = params.fdCode
      this.editForm.afrom = params.afrom
      this.editForm.ato = params.ato
      this.editForm.discount = params.discount
      this.editForm.cabin = params.cabin
      this.editForm.basicCabin = params.basicCabin
      this.editForm.fdPrice = params.fdPrice
      this.editForm.flightDateStart = params.flightDateStart
      this.editForm.flightDateEnd = params.flightDateEnd
      this.editForm.saleDateStart = params.saleDateStart
      this.editForm.saleDateEnd = params.saleDateEnd
    },
    // 添加/修改弹出框 -- 提交
    saveEdit () {
      if (this.editForm.afrom && this.editForm.ato &&
        this.editForm.discount && this.editForm.cabin &&
        this.editForm.basicCabin && this.editForm.fdPrice &&
        this.editForm.flightDateStart && this.editForm.flightDateEnd &&
        this.editForm.saleDateStart && this.editForm.saleDateEnd) {
        let data = JSON.parse(JSON.stringify(this.editForm))
        data.afrom = this.$options.filters.upper(data.afrom)
        data.ato = this.$options.filters.upper(data.ato)
        data.cabin = this.$options.filters.upper(data.cabin)
        data.basicCabin = this.$options.filters.upper(data.basicCabin)
        data.deleteFlag = '0'
        if (this.isReset === false) {
          this.updateParamsData(data)
        } else {
          this.addParamsData(data)
        }
      } else {
        this.isEmpty = true
      }
    },
    // 添加弹出框 -- 提交接口
    addParamsData (data) {
      queryAddFdBasicPrice(data).then(res => {
        this.editVisible = false
        this.getFdBasicPriceList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 修改弹出框 -- 提交接口
    updateParamsData (data) {
      queryUpdateFdBasicPrice(data).then(res => {
        this.editVisible = false
        this.getFdBasicPriceList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 添加/修改弹出框 -- 重置
    resetEdit () {
      this.editForm = {
        fdCode: '',
        afrom: '',
        ato: '',
        discount: '',
        cabin: '',
        basicCabin: '',
        fdPrice: '',
        flightDateStart: '',
        flightDateEnd: '',
        saleDateStart: '',
        saleDateEnd: ''
      }
      this.isEmpty = false
    },
    // 删除
    handleDelete (id) {
      let ids = id || filterIds(this.multipleSelection, 'fdId').join(',')
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        // 删除
        this.getDeleteData(ids)
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    // 删除
    getDeleteData (id) {
      queryDeleteFdBasicPrice({ ids: id }).then(() => {
        this.$message.success('操作成功')
        this.getFdBasicPriceList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 操作日志
    handleLog (id) {
      this.logLoading = true
      this.dialogVisible = true
      queryFdBBasicPriceLog({ id: id }).then(res => {
        this.logLoading = false
        this.logList = res.rows
      }).catch(err => {
        this.logLoading = false
        this.$message.error(err.message)
      })
    },
    // 导出Excel文件/模版
    handleExport (param) {
      let url = ''
      let name = ''
      let data = JSON.parse(JSON.stringify(this.filter))
      data.start = 1
      data.end = this.FdFreightMaintainList.total
      delete data.page
      delete data.rows
      if (param !== null) {
        url = 'fcBasicPrice/exportFdBasicPrice'
        name = getRouteName('/FDFreightMaintain')
      } else {
        url = 'fcBasicPrice/exportFdBasicPriceTemplate'
        name = 'FD运价维护模板'
      }
      let params = {
        data: data,
        url: url,
        name: name,
        type: 'xls'
      }
      excelList(params, this)
    },
    // 上传FD文件
    handleUpload () {
      this.fileList = []
      this.isfile = false
      this.importVisible = true
    },
    choiceFile (e) {
      this.fileList = e.target.files
    },
    // 上传文件提交
    paramJudge () {
      if (this.fileList.length > 0) {
        let data = new FormData()
        for (let i = 0; i < this.fileList.length; i++) {
          data.append('importExcel', this.fileList[i])
        }
        queryImportFdBasicPrice(data).then(res => {
          this.$message.success(res.message)
          this.importVisible = false
          this.getFdBasicPriceList()
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        this.isfile = true
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
