<template>
  <div id="Address" class="container">
    <!--<h1>基础地址管理</h1>-->
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="地区级别" v-model="searchForm.clevel">
            <el-option label="国家" value="0"></el-option>
            <el-option label="省份" value="1"></el-option>
            <el-option label="市" value="2"></el-option>
            <el-option label="区/县" value="3"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable v-model="searchForm.areacode" placeholder="地区编号" title="地区编号"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable v-model="searchForm.areaname" placeholder="地区名" title="地区名"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable v-model="searchForm.citycode" placeholder="城市编号" title="城市编号"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable v-model="searchForm.parentname" placeholder="城市父节点" title="城市父节点"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="启用/禁用" v-model="searchForm.status">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="search">查询</el-button>
          <el-button size="medium" @click="resetQuery">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit(null)">添加</el-button>
        <el-button type="success" size="medium" @click="handleExport" :disabled="tableList.total == '0'">导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          :data="dataList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          v-loading="loading"
          :cell-style="tableAttributes.cellStyle"
          @selection-change="handleSelectionChange">
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
          <!--<el-table-column type="selection" width="50" fixed="left"></el-table-column>-->
          <el-table-column label="地区ID" prop="areaid" min-width="100"></el-table-column>
          <el-table-column label="地区编码" prop="areacode" min-width="140"></el-table-column>
          <el-table-column label="地区名" prop="areaname" min-width="160"></el-table-column>
          <el-table-column label="地区级别" prop="clevel" min-width="90">
            <template  slot-scope="scope">
                <span>{{scope.row.clevel | clevels}}</span>
            </template>
          </el-table-column>
          <el-table-column label="邮编" prop="zipCode" min-width="100"></el-table-column>
          <el-table-column label="城市编码" prop="citycode" min-width="100"></el-table-column>
          <el-table-column label="城市中心点" prop="center" min-width="180"></el-table-column>
          <el-table-column label="地区父节点id" prop="parentid" min-width="140"></el-table-column>
          <el-table-column label="地区父节点名称" prop="parentName" min-width="160"></el-table-column>
          <el-table-column label="操作" fixed="right" min-width="100">
            <template slot-scope="scope">
              <span class="active-text mr-5" @click='handledit({ id: scope.row.areaid, status: scope.row.areaStatus}, "禁用")' v-if="scope.row.areaStatus === '1'" title="启用">禁用</span>
              <span class="active-text mr-5" @click='handledit({ id: scope.row.areaid, status: scope.row.areaStatus }, "启用")' v-if="scope.row.areaStatus === '0'" title="禁用">启用</span>
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.page"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dataList.total">
      </el-pagination>
    </div>
    <el-dialog :title="dialogCennel" :visible.sync="dialogBlean" width="560px">
      <div class="dialog-container">
        <div class="dialog-main" v-loading="dia_loading">
          <div class="row">
            <div class="column">
              <div class="label required">地区级别</div>
              <div class="fl ipt-medium">
                <el-select size="medium" placeholder="地区级别" :disabled="dialogCennel === '修改'" v-model="editForm.clevel"  @change="clevelSs(editForm.clevel)">
                  <el-option label="国家" value="0"></el-option>
                  <el-option label="省份" value="1"></el-option>
                  <el-option label="市" value="2"></el-option>
                  <el-option label="区/县" value="3"></el-option>
                </el-select>
              </div>
            </div>
            <div class="column" v-if="obj.a">
              <div class="label">国家</div>
              <div class="fl ipt-medium">
                <el-select v-model='clevelObj.country' filterable placeholder='国家' title="国家" size='medium' @change="getcount(clevelObj.country)" v-if="dialogCennel === '添加'">
                  <el-option
                    v-for='item in countryss'
                    :key='item.areaid'
                    :label='item.areaname'
                    :value='item.areaid'>
                  </el-option>
                </el-select>
                <el-input size="medium" v-if="dialogCennel === '修改'" :disabled="obj.a !== ''" v-model="obj.a" placeholder="国家" title="国家"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column" v-if="obj.b">
              <div class="label">省份</div>
              <div class="fl ipt-medium">
                <el-select v-if="dialogCennel === '添加'" filterable v-model='clevelObj.province' placeholder='省份' :disabled="!clevelObj.country || province.length === 0" title="省份" size='medium' @change="getprovince(clevelObj.province)">
                  <el-option
                    v-for='item in province'
                    :key='item.areaid'
                    :label='item.areaname'
                    :value='item.areaid'>
                  </el-option>
                </el-select>
                <el-input size="medium" v-if="dialogCennel === '修改'" :disabled="obj.b !== ''" v-model="obj.b" placeholder="省份" title="省份"></el-input>
              </div>
            </div>
            <div class="column" v-if="obj.c">
              <div class="label">市</div>
              <div class="fl ipt-medium">
                <el-select v-if="dialogCennel === '添加'" filterable v-model='clevelObj.city' placeholder='市' title="市" :disabled="!clevelObj.province || city.length === 0" size='medium'>
                  <el-option
                    v-for='item in city'
                    :key='item.areaid'
                    :label='item.areaname'
                    :value='item.areaid'>
                  </el-option>
                </el-select>
                <el-input size="medium" v-if="dialogCennel === '修改'" :disabled="obj.c !== ''" v-model="obj.c" placeholder="市" title="市"></el-input>
              </div>
            </div>
          </div>
          <div style="width: 100%;height: 1px;background-color: rgb(220, 220, 220);"></div>
          <div class="row" style="margin-top: 15px">
            <div class="column">
              <div class="label required">地区编号</div>
              <div class="fl ipt-medium">
                <el-input size="medium" clearable v-model="editForm.areacode" placeholder="地区编号" title="地区编号"></el-input>
                <div class="warning-info" v-if="flag && !editForm.areacode">地区编号不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">地区名</div>
              <div class="fl ipt-medium">
                <el-input size="medium" clearable v-model="editForm.areaname" placeholder="地区名" title="地区名"></el-input>
                <div class="warning-info" v-if="flag && !editForm.areaname">地区名不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">城市编码</div>
              <div class="fl ipt-medium">
                <el-input size="medium" clearable v-model="editForm.citycode" placeholder="城市编码" title="城市编码"></el-input>
                <div class="warning-info" v-if="flag && !editForm.citycode">城市编码不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">城市中心点</div>
              <div class="fl ipt-medium">
                <el-input size="medium" clearable v-model="editForm.center" placeholder="城市中心点" title="城市中心点"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">邮编</div>
              <div class="fl ipt-medium">
                <el-input size="medium" clearable v-model="editForm.zipCode" placeholder="邮编" title="邮编"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">地址状态</div>
              <div class="fl ipt-medium">
                <el-select size="medium" v-model="editForm.areaStatus"  placeholder="问题状态">
                  <el-option label="启用" value="1"></el-option>
                  <el-option label="禁用" value="0"></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="refer">提交</el-button>
          <el-button size="medium" @click="reset" v-if="ref">重置</el-button>
          <el-button size="medium" @click="dialogBlean = false">返回</el-button>
        </div>
      </div>
      </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import * as types from './api'
import { getAreaSelectByClevels, excelList, getRouteName } from '../../../utils/index'
import * as servers from './server'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'Address',
  data () {
    return {
      searchForm: {

      }, // 查询条件 -- 数据
      tableList: [], // 表格 -- 展示数据
      dataViewHeight: null, // 表格 -- 高度
      editForm: {
        areacode: '', //  地区编号
        areaname: '', //  地区名
        clevel: '0', //  地区级别
        zipCode: '', //  邮编
        citycode: '', //  城市编号
        center: '', // 城市中心点
        parentid: '', //  地区父节点id
        areaStatus: '1'
      }, // 添加/修改弹出框 -- 数据表单
      editVisible: false, // 添加/修改弹出框 -- 显示隐藏
      isEmpty: false, // 添加/修改弹出框 -- 输入框判空
      loading: false, // 加载状态
      dataList: {},
      dialogBlean: false,
      dialogCennel: '',
      flag: false,
      clevelObj: {
        country: '', // 国家
        province: '', //  省份
        city: '' //  市
      },
      country: [],
      province: [],
      city: [],
      httpObj: {
        clevel: '0',
        parentId: ''
      },
      obj: {
        a: '',
        b: '',
        c: ''
      },
      dia_loading: false,
      ref: ''
    }
  },
  created () {
    this.countrys()
    this.initData(1, this.pagination.pageSize)
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes, // 表格
      pagination: state => state.app.pagination, // 分页
      channelList: state => state.app.channelList,
      countryss: state => state.app.country
    })
  },
  methods: {
    handledit (data, mag) {
      if (data.status === '1') {
        data.status = '0'
      } else {
        data.status = '1'
      }
      this.$confirm('是否确认' + mag, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.upStatus(data)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    //  修改状态
    upStatus (data) {
      types.updateStatus(data).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.initData(1, this.pagination.pageSize)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    refer () {
      this.flag = true
      if (!this.editForm.areaname || !this.editForm.citycode) {
        return false
      }
      let clevelObjClone = JSON.parse(JSON.stringify(this.clevelObj))
      let smallId = servers.Adress.smallId(clevelObjClone)
      this.editForm.parentid = smallId
      !this.editForm.areaid ? this.addMetChinaareas(this.editForm) : this.upMetChinaareas(this.editForm)
    },
    upMetChinaareas (dataObj) {
      types.updateMetChinaarea(dataObj).then(res => {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.dialogBlean = false
        this.initData(1, this.pagination.pageSize)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    addMetChinaareas (dataObj) {
      types.addMetChinaarea(dataObj).then(res => {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.dialogBlean = false
        this.initData(1, this.pagination.pageSize)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    reset () {
      this.flag = false
      this.diaResfer()
    },
    countrys () {
      if (!this.countryss.length) {
        getAreaSelectByClevels()
      }
    },
    clevelSs (val) {
      this.country = this.countryss
      this.obj = servers.Adress.show(val, this.obj, this.clevelObj)
    },
    getcount (val) {
      this.httpObj.clevel = '1'
      this.httpObj.parentId = val
      this.clevelObj.province = ''
      this.getcityList(1, this.httpObj)
    },
    getprovince (val) {
      this.httpObj.clevel = '2'
      this.httpObj.parentId = val
      this.clevelObj.city = ''
      this.getcityList(2, this.httpObj)
    },
    getcityList (val, obj) {
      types.getAreaSelectByClevel(obj).then(res => {
        // if (res.rows.length === 0) {
        //   this.$message.error('改地区下暂无地区')
        //   this.clevelObj.province = ''
        // }
        if (val === 1) {
          this.province = res.rows
        }
        if (val === 2) {
          this.city = res.rows
        }
      })
    },
    initData (page, pageSize) {
      this.loading = true
      if (page) this.searchForm.page = page
      if (pageSize) this.searchForm.rows = pageSize
      types.getMetChinaareaList(this.searchForm).then(res => {
        this.loading = false
        this.dataList = res
      }).catch(err => {
        this.loading = false
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
    // 查询条件 -- 重置
    resetQuery () {
      this.searchForm = {}
      this.initData(1, this.pagination.pageSize)
    },
    search () {
      this.initData(1, this.pagination.pageSize)
    },
    // 表格 -- 选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 表格 -- 添加/编辑
    handleEdit (row) {
      this.dialogBlean = true
      if (row && row !== null) {
        this.dialogCennel = '修改'
        // clevel
        this.ref = ''
        this.dia_loading = true
        this.upList(row.areaid)
      } else {
        this.ref = '添加'
        delete this.editForm.areaid
        this.diaResfer()
      }
    },
    diaResfer () {
      this.dialogCennel = '添加'
      this.editForm.clevel = '0'
      this.obj['a'] = ''
      this.obj['b'] = ''
      this.obj['c'] = ''
      this.ref = 'add'
      for (let item in this.editForm) {
        this.editForm[item] = ''
      }
      this.editForm.clevel = '0'
      this.editForm.areaStatus = '1'
    },
    upList (areaid) {
      let ids = {
        areaid
      }
      types.updateMetChinaareaBefore(ids).then(res => {
        let metChinaareaList = res.obj.metChinaareaList
        this.editForm.clevel = res.obj.metChinaareaList.length + ''
        this.editForm.areacode = res.obj.areacode
        this.editForm.areaname = res.obj.areaname
        this.editForm.areaStatus = res.obj.areaStatus
        this.editForm.center = res.obj.center
        this.editForm.citycode = res.obj.citycode
        this.editForm.zipCode = res.obj.zipCode
        this.editForm.areaid = areaid
        if (metChinaareaList.length === 1) {
          this.obj['a'] = metChinaareaList[0].areaname
          this.obj['b'] = ''
          this.obj['c'] = ''
        }
        if (metChinaareaList.length === 2) {
          this.obj['a'] = metChinaareaList[0].areaname
          this.obj['b'] = metChinaareaList[1].areaname
          this.obj['c'] = ''
        }
        if (metChinaareaList.length === 3) {
          this.obj['a'] = metChinaareaList[0].areaname
          this.obj['b'] = metChinaareaList[1].areaname
          this.obj['c'] = metChinaareaList[2].areaname
        }
        this.dia_loading = false
      }).catch(err => {
        this.$message.error(err.message)
        this.dia_loading = false
      })
    },
    // 表格 -- 导出
    handleExport () {
      let data = JSON.parse(JSON.stringify(this.searchForm))
      let url = 'metChinaarea/exportMetChinaarea'
      let name = getRouteName('/address')
      let type = 'xls'
      data.start = 1
      data.end = this.dataList.total
      delete data.page
      delete data.rows
      let temp = null
      let obj = {
        data,
        url,
        name,
        type,
        temp
      }
      excelList(obj)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
