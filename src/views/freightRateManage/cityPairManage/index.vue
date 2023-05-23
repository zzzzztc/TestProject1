<template>
  <!--<div>城市对管理</div>-->
  <div id="CityPairManage" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="航司" v-model="filter.cityPair.air_CODE" @keydown.enter.native="getCityPairList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="航班号" v-model="filter.cityPair.flt_NUM" @keydown.enter.native="getCityPairList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="起飞城市" v-model="filter.cityPair.dept_CODE" @keydown.enter.native="getCityPairList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="到达城市" v-model="filter.cityPair.arri_CODE" @keydown.enter.native="getCityPairList()"></el-input>
        </div>
<!--        <div class="search-item search-ipt">-->
<!--          <el-select v-model='filter.cityPair.dept_CODE' @focus="clearTreeListCopy" :filter-method="dataFilter" clearable filterable placeholder='起飞城市' title="起飞城市" size='medium'>-->
<!--            <el-option-->
<!--              v-for='item in treeListCopy'-->
<!--              :key='item.id'-->
<!--              :label='item.text'-->
<!--              :value='item.id'>-->
<!--              <span style="float: left">{{ item.text }}</span>-->
<!--              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </div>-->
<!--        <div class="search-item search-arrow" @click="changeCity">-->
<!--          <img src="../../../assets/arrow.svg" alt="" height="32px">-->
<!--        </div>-->
<!--        <div class="search-item search-ipt">-->
<!--          <el-select v-model='filter.cityPair.arri_CODE' @focus="clearTreeListCopy" :filter-method="dataFilter1" filterable clearable placeholder='到达城市' title="到达城市" size='medium'>-->
<!--            <el-option-->
<!--              v-for='item in treeListCopy1'-->
<!--              :key='item.id'-->
<!--              :label='item.text'-->
<!--              :value='item.id'>-->
<!--              <span style="float: left">{{ item.text }}</span>-->
<!--              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-select size="medium" v-model="filter.cityPair.flt_TYPE" placeholder="航线类别" clearable @keydown.enter.native="getCityPairList()">
            <el-option label="中国大陆" value="0"></el-option>
            <el-option label="港澳台" value="1"></el-option>
            <el-option label="东南亚" value="2"></el-option>
            <el-option label="日韩" value="3"></el-option>
            <el-option label="欧洲" value="4"></el-option>
            <el-option label="美洲" value="5"></el-option>
            <el-option label="大洋洲" value="6"></el-option>
            <el-option label="非洲" value="7"></el-option>
            <el-option label="亚洲其他" value="8"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.cityPair.start_DATE"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="起始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.cityPair.end_DATE"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="截止日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" v-model="filter.cityPair.share_CODE" placeholder="代码共享" clearable @keydown.enter.native="getCityPairList()">
            <el-option label="是" value="true"></el-option>
            <el-option label="否" value="false"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="启用/禁用" v-model="filter.cityPair.city_STATUS"  @keydown.enter.native="getCityPairList()">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getCityPairList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit(), resetEdit()">添加</el-button>
        <el-button size="medium" type="danger" :disabled="!multipleSelection.length" @click="handleDelete()">删除</el-button>
        <!--<el-button size="medium" @click="handleChecks">自动校验</el-button>-->
        <el-button type="success" size="medium" :disabled="cityPairList.total === 0" @click="handleExport('excel')">导出</el-button>
        <el-button size="medium" @click="handleExport(null)">模板下载</el-button>
        <el-button size="medium" @click="handleUpload">上传运价文件</el-button>
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
          :data="cityPairList.rows"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
<!--          <el-table-column label="序号" type="index" width="50"></el-table-column>-->
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="航司代码" v-if="tableList.air_CODE" prop="air_CODE" min-width="100"></el-table-column>
          <el-table-column label="航班号" v-if="tableList.flt_NUM" prop="flt_NUM" min-width="100"></el-table-column>
          <el-table-column label="航线类别" v-if="tableList.flt_TYPE" prop="flt_TYPE" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.flt_TYPE === '0'">中国大陆</span>
              <span v-if="scope.row.flt_TYPE === '1'">港澳台</span>
              <span v-if="scope.row.flt_TYPE === '2'">东南亚</span>
              <span v-if="scope.row.flt_TYPE === '3'">日韩</span>
              <span v-if="scope.row.flt_TYPE === '4'">欧洲</span>
              <span v-if="scope.row.flt_TYPE === '5'">美洲</span>
              <span v-if="scope.row.flt_TYPE === '6'">大洋洲</span>
              <span v-if="scope.row.flt_TYPE === '7'">非洲</span>
              <span v-if="scope.row.flt_TYPE === '8'">亚洲其他</span>
            </template>
          </el-table-column>
          <el-table-column label="起飞城市" v-if="tableList.dept_AIR" prop="dept_AIR" min-width="120"></el-table-column>
          <el-table-column label="起飞机场三字码" v-if="tableList.dept_CODE" prop="dept_CODE" min-width="120"></el-table-column>
          <el-table-column label="起飞机场名称" v-if="tableList.dept_NAME" prop="dept_NAME" min-width="160"></el-table-column>
          <el-table-column label="起飞机场航站楼" v-if="tableList.dept_AIR_TERMINAL" prop="dept_AIR_TERMINAL" min-width="160"></el-table-column>
          <el-table-column label="起飞时间" v-if="tableList.dept_TIME" prop="dept_TIME" min-width="100"></el-table-column>
          <el-table-column label="到达城市" v-if="tableList.arri_AIR" prop="arri_AIR" min-width="120"></el-table-column>
          <el-table-column label="到达机场三字码" v-if="tableList.arri_CODE" prop="arri_CODE" min-width="120"></el-table-column>
          <el-table-column label="到达机场名称" v-if="tableList.arri_NAME" prop="arri_NAME" min-width="160"></el-table-column>
          <el-table-column label="到达机场航站楼" v-if="tableList.arri_AIR_TERMINAL" prop="arri_AIR_TERMINAL" min-width="160"></el-table-column>
          <el-table-column label="到达时间" v-if="tableList.arri_TIME" prop="arri_TIME" min-width="100"></el-table-column>
          <el-table-column label="经停城市" v-if="tableList.stop_OVER_CITY" prop="stop_OVER_CITY" min-width="100"></el-table-column>
          <el-table-column label="经停机场三字码" v-if="tableList.stop_OVER_AIR" prop="stop_OVER_AIR" min-width="120"></el-table-column>
          <el-table-column label="经停机场名称" v-if="tableList.stop_OVER_AIR_NAME" prop="stop_OVER_AIR_NAME" min-width="160"></el-table-column>
          <el-table-column label="经停起飞时间" v-if="tableList.stop_OVER_DEPT_TIME" prop="stop_OVER_DEPT_TIME" min-width="160"></el-table-column>
          <el-table-column label="经停到达时间" v-if="tableList.stop_OVER_ARRI_TIME" prop="stop_OVER_ARRI_TIME" min-width="160"></el-table-column>
          <el-table-column label="经停时间" v-if="tableList.stop_OVER_MIN" prop="stop_OVER_MIN" min-width="100"></el-table-column>
          <el-table-column label="共享代码" v-if="tableList.share_CODE" prop="share_CODE" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.share_CODE === 'true'">是</span>
              <span v-if="scope.row.share_CODE === 'false'">否</span>
            </template>
          </el-table-column>
          <el-table-column label="航班班期" v-if="tableList.flt_SCHEDULE" prop="flt_SCHEDULE" min-width="160"></el-table-column>
          <el-table-column label="开始日期" v-if="tableList.start_DATE" prop="start_DATE" min-width="160"></el-table-column>
          <el-table-column label="截止日期" v-if="tableList.end_DATE" prop="end_DATE" min-width="160"></el-table-column>
          <el-table-column label="销售生效日期" v-if="tableList.sale_DATE" prop="sale_DATE" min-width="160"></el-table-column>
          <el-table-column label="创建日期" v-if="tableList.create_DATE" prop="create_DATE" min-width="160"></el-table-column>
          <el-table-column label="状态" v-if="tableList.city_STATUS" prop="city_STATUS" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.city_STATUS === '0'">禁用</span>
              <span v-if="scope.row.city_STATUS === '1'">启用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="120" v-if="checked.length">
            <template slot-scope="scope">
              <span class="active-text mr-5" @click='handleStatus(scope.row.city_PAIR_ID, scope.row.city_STATUS)' v-if="scope.row.city_STATUS === '1'" title="启用">禁用</span>
              <span class="active-text mr-5" @click='handleStatus(scope.row.city_PAIR_ID, scope.row.city_STATUS)' v-if="scope.row.city_STATUS === '0'" title="禁用">启用</span>
              <span class="danger-text inl-block mr-5" @click="handleDelete(scope.row.city_PAIR_ID)">删除</span>
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
            :total="cityPairList.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--新增弹出框-->
    <el-dialog title="添加" :visible.sync="editVisible" width="320px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">出发三字码</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="出发三字码，例：SJW" clearable v-model="editForm.dept_CODE"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">到达三字码</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="到达三字码，例：SJW" clearable v-model="editForm.arri_CODE"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">销售生效日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="datetime"
                  class="date-picker"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="销售生效日期"
                  v-model="editForm.sale_DATE">
                </el-date-picker>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="saveEdit">提交</el-button>
          <el-button size="medium" @click="resetEdit">重置</el-button>
          <el-button size="medium" @click="editVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
    <!--上传运价文件弹出框-->
    <el-dialog title="导入" :visible.sync="importVisible" width="500px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <input type="file" @change="choiceFile($event)">
              <div v-if="filepath">{{filepath}}</div>
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCurrentDate, excelList, filterIds, getRouteName } from '../../../utils/index'
import { queryCityPairByPage, queryUpdateStatus, queryAddList, queryUploadCityPair, queryDeleteList } from './api'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'CityPairManage',
  data () {
    return {
      isColumn: true,
      loading: false,
      filter: {
        cityPair: {
          air_CODE: '', // 航司代码
          flt_NUM: '', // 航班号
          dept_CODE: '', // 出发三字码
          arri_CODE: '', // 到达三字码
          flt_TYPE: '', // 航线类型
          start_DATE: '', // 开始时间
          end_DATE: '', // 截止时间
          share_CODE: '', // 代码共享
          city_STATUS: '' // 启用/禁用
        },
        isJson: true,
        pageNo: '',
        pageSize: ''
      },
      editForm: {
        dept_CODE: '', // 出发三字码
        arri_CODE: '', // 到达三字码
        sale_DATE: '' // 销售生效日期
      },
      cityPairList: {},
      dataViewHeight: null,
      multipleSelection: [], // 表格多选
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      editVisible: false, // 弹出框显示隐藏
      importVisible: false,
      fileList: [],
      filepath: '',
      tableList: {
        city_PAIR_ID: true,
        air_CODE: false,
        flt_NUM: true,
        flt_TYPE: false,
        dept_AIR: false,
        dept_CODE: true,
        dept_NAME: false,
        dept_AIR_TERMINAL: false,
        dept_TIME: true,
        arri_AIR: false,
        arri_CODE: true,
        arri_NAME: false,
        arri_AIR_TERMINAL: false,
        arri_TIME: true,
        stop_OVER_CITY: false,
        stop_OVER_AIR: true,
        stop_OVER_AIR_NAME: false,
        stop_OVER_ARRI_TIME: true,
        stop_OVER_DEPT_TIME: true,
        stop_OVER_MIN: true,
        share_CODE: false,
        flt_SCHEDULE: false,
        start_DATE: false,
        end_DATE: false,
        sale_DATE: true,
        create_DATE: false,
        city_STATUS: true
      }, //  表格展示的数据
      treeList: [],
      treeListCopy: [],
      treeListCopy1: [],
      componentName: 'cityPairManage'
    }
  },
  created () {
    // this.getTreelist()
    this.initDate()
    this.getCityPairList(1, this.pagination.pageSize)
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      baseUrl: state => state.app.baseUrl
    })
  },
  mixins: [checkAttrs, computWidth],
  methods: {
    initDate () {
      this.date = [getCurrentDate(0, '01'), getCurrentDate(0)]
      // this.filter.cityPair.start_DATE = this.date[0]
      // this.filter.cityPair.end_DATE = this.date[1]
    },
    // 分页导航
    handleSizeChange (pages) {
      this.getCityPairList(null, pages)
    },
    handleCurrentChange (page) {
      this.getCityPairList(page, null)
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // dataFilter (val) {
    //   if (val) {
    //     this.treeListCopy = this.treeList.filter(item => {
    //       if (!!~item.text.indexOf(val) || !!~item.id.indexOf(val.toUpperCase())) {
    //         return true
    //       }
    //     })
    //   } else {
    //     this.treeListCopy = this.treeList
    //   }
    // },
    // dataFilter1 (val) {
    //   if (val) {
    //     this.treeListCopy1 = this.treeList.filter(item => {
    //       if (!!~item.text.indexOf(val) || !!~item.id.indexOf(val.toUpperCase())) {
    //         return true
    //       }
    //     })
    //   } else {
    //     this.treeListCopy1 = this.treeList
    //   }
    // },
    // clearTreeListCopy () {
    //   this.treeListCopy = JSON.parse(JSON.stringify(this.treeList))
    //   this.treeListCopy1 = JSON.parse(JSON.stringify(this.treeList))
    // },
    // //  城市
    // getTreelist () {
    //   queryAirCitiesTree().then(res => {
    //     this.treeList = res.treeList
    //     this.treeListCopy = res.treeList
    //     this.treeListCopy1 = res.treeList
    //   }).catch(err => {
    //     this.$message({
    //       type: 'error',
    //       message: err.message
    //     })
    //   })
    // },
    // // 互换城市
    // changeCity () {
    //   let deptCODE = this.filter.cityPair.dept_CODE
    //   let arriCODE = this.filter.cityPair.arri_CODE
    //   if (this.filter.cityPair.dept_CODE || this.filter.cityPair.arri_CODE) {
    //     this.filter.cityPair.dept_CODE = arriCODE
    //     this.filter.cityPair.arri_CODE = deptCODE
    //   }
    // },
    // 获取表格数据
    getCityPairList (page, pageSize) {
      this.loading = true
      this.filter.pageNo = page || 1
      if (pageSize) this.filter.pageSize = pageSize
      this.filter.isJson = true
      queryCityPairByPage(this.filter).then(res => {
        this.cityPairList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 重置搜索条件
    resetFilter () {
      this.filter = {
        cityPair: {
          air_CODE: '', // 航司代码
          flt_NUM: '', // 航班号
          dept_CODE: '', // 出发三字码
          arri_CODE: '', // 到达三字码
          flt_TYPE: '', // 航线类型
          start_DATE: '', // 开始时间
          end_DATE: '', // 截止时间
          share_CODE: '', // 代码共享
          city_STATUS: '' // 启用/禁用
        },
        isJson: true
      }
      this.getCityPairList(1, this.pagination.pageSize)
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
          isJson: true,
          city_PAIR_ID: id,
          city_STATUS: status === '0' ? '1' : '0'
        }
        queryUpdateStatus(data).then(res => {
          this.$message.success(res.message)
          this.getCityPairList()
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消修改')
      })
    },
    // 添加
    handleEdit () {
      this.editVisible = true
    },
    // 添加弹出框提交
    saveEdit () {
      if (this.editForm.dept_CODE && this.editForm.arri_CODE && this.editForm.sale_DATE) {
        let data = JSON.parse(JSON.stringify(this.editForm))
        data.isJson = true
        queryAddList(data).then(res => {
          this.editVisible = false
          this.getCityPairList()
          this.$message.success(res.message)
        }).catch(err => {
          this.$message.error(err.message)
        })
        this.editVisible = false
      } else {
        this.isEmpty = true
      }
    },
    // 添加弹出框重置
    resetEdit () {
      this.editForm = {
        dept_CODE: '',
        arri_CODE: '',
        sale_DATE: ''
      }
    },
    // 删除
    handleDelete (id) {
      let ids = id || filterIds(this.multipleSelection, 'city_PAIR_ID').join(',')
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        // 删除
        this.handleDeleteSurvey(ids)
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    // 删除
    handleDeleteSurvey (id) {
      queryDeleteList({ ids: id, isJson: true }).then(() => {
        this.$message.success('操作成功')
        this.getCityPairList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // // 自动校验
    // handleChecks () {
    //
    // },
    // 导出/模板下载
    handleExport (str) {
      let data = JSON.parse(JSON.stringify(this.filter))
      data.isJson = true
      if (str === 'excel') {
        let params = {
          data: data,
          url: 'cityPair/exportCityPair',
          name: getRouteName('/cityPairManage'),
          type: 'xls'
        }
        excelList(params, this)
      } else {
        window.location.href = this.baseUrl + 'js/xlstemplate/city_pair_template.xls'
      }
    },
    // 上传运价文件
    handleUpload () {
      this.importVisible = true
    },
    choiceFile (e) {
      this.fileList = e.target.files
    },
    // 上传文件提交
    paramJudge () {
      let data = new FormData()
      for (let i = 0; i < this.fileList.length; i++) {
        data.append('importExcel', this.fileList[i])
      }
      queryUploadCityPair(data).then(res => {
        this.$message.success(res.message)
        this.importVisible = false
        this.getCityPairList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
