<template>
  <div id="UpgradFlightFree" class="container">
    <!--<h1>升舱产品免费升舱设置</h1>-->
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="规则批号" v-model="searchForm.policyCode" @keydown.enter.native="queryPolicyList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="产品编码" v-model="searchForm.upgradCode" @keydown.enter.native="queryPolicyList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="产品名称" v-model="searchForm.upgradName" @keydown.enter.native="queryPolicyList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="请选择渠道" v-model="searchForm.channel">
            <el-option
              v-for="item in channelList"
              :key="item.chalId"
              :value="item.chalCode"
              :label="item.chalName">
            </el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="国内/国际" v-model="searchForm.isinter">
            <el-option key="1" label="国内" value="0"></el-option>
            <el-option key="2" label="国际" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item w-250 fl">
          <el-input class="'fl" size="medium" clearable placeholder="出发地" style="width: 180px" v-model="searchForm.sailFrom" @keydown.enter.native="queryPolicyList()"></el-input>
          <span class="'fl" style="padding: 8px 6px;">-</span>
          <el-input class="'fl" size="medium" clearable placeholder="到达地" style="width: 180px" v-model="searchForm.sailTo" @keydown.enter.native="queryPolicyList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="适合可升舱舱位" v-model="searchForm.policyCabin">
            <el-option
              v-for="item in policyCabinList"
              :key="item.id" :value="item.value"
              :label="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="航班号" v-model="searchForm.flightNo" @keydown.enter.native="queryPolicyList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.sellStartTime"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="销售开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.sellEndTime"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="销售截止日期">
          </el-date-picker>
        </div>
<!--        <div class="search-item fl">-->
<!--          <el-date-picker-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="sellTime"-->
<!--            type="datetimerange"-->
<!--            range-separator="至"-->
<!--            value-format="yyyy-MM-dd HH:mm:ss"-->
<!--            start-placeholder="销售起始时间"-->
<!--            end-placeholder="销售截止时间"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.flightDateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.flightDateEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班截止日期">
          </el-date-picker>
        </div>
<!--        <div class="search-item fl">-->
<!--          <el-date-picker-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="flightDate"-->
<!--            type="daterange"-->
<!--            value-format="yyyy-MM-dd HH:mm:ss"-->
<!--            range-separator="至"-->
<!--            start-placeholder="航班起始日期"-->
<!--            end-placeholder="航班截止日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.createDates"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="创建开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.createDatee"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="创建截止日期">
          </el-date-picker>
        </div>
<!--        <div class="search-item fl">-->
<!--          <el-date-picker-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="createDate"-->
<!--            type="daterange"-->
<!--            value-format="yyyy-MM-dd HH:mm:ss"-->
<!--            range-separator="至"-->
<!--            start-placeholder="创建起始日期"-->
<!--            end-placeholder="创建截止日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="创建人" v-model="searchForm.createOpName" @keydown.enter.native="queryPolicyList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="启用/禁用" v-model="searchForm.policyStatus">
            <el-option key="1" label="启用" value="0"></el-option>
            <el-option key="2" label="禁用" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-button size="medium" type="primary" @click="queryPolicyList(null,null)">查询</el-button>
          <el-button size="medium" @click="handleReset">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit(null)">添加</el-button>
        <el-button size="medium" :disabled="!multipleSelection.length" type="danger" @click="handleDelects">批量删除</el-button>
        <el-button type="success" size="medium" :disabled="!tableList.total" @click="exportPolicyRecordXls">导出Excer记录</el-button>
        <el-button type="success" size="medium" @click="handleExportUpload()">导出上传文件</el-button>
        <el-button size="medium" @click="handleImport">上传运价文件</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data='tableList.rows'
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :cell-style="tableAttributes.cellStyle"
          @selection-change="handleSelectionChange">
          <el-table-column fixed="left" type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="创建时间">
                  <span>{{ props.row.createDate }}</span>
                </el-form-item>
                <el-form-item label="创建人">
                  <span>{{ props.row.createOpName }}</span>
                </el-form-item>
                <el-form-item label="修改时间">
                  <span>{{ props.row.modifyDate }}</span>
                </el-form-item>
                <el-form-item label="修改人">
                  <span>{{ props.row.modifyOpName }}</span>
                </el-form-item>
                <el-form-item label="备注">
                  <span>{{ props.row.policyRemark }}</span>
                </el-form-item>
                <el-form-item label="销售起始日期">
                  <span>{{ props.row.sellStartTime }}</span>
                </el-form-item>
                <el-form-item label="销售截止日期">
                  <span>{{ props.row.sellEndTime }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="selection" width="46" fixed="left"></el-table-column>
          <el-table-column label="产品编码" prop="upgradCode" fixed="left" min-width="100">
            <template slot-scope="scope">
              <div class="blue-text">{{scope.row.upgradCode}}</div>
            </template>
          </el-table-column>
          <el-table-column label="产品名称" prop="upgradName" min-width="100"></el-table-column>
          <el-table-column label="规则批号" prop="policyCode" min-width="200"></el-table-column>
          <el-table-column label="渠道编号" prop="channel" min-width="160">
            <template slot-scope="scope">
              <div>{{scope.row.channel | channelMap}}</div>
            </template>
          </el-table-column>
          <el-table-column label="航班号" prop="flightNo"></el-table-column>
          <el-table-column label="出发地" prop="sailFrom"></el-table-column>
          <el-table-column label="到达地" prop="sailTo" min-width="100"></el-table-column>
          <!--<el-table-column label="销售起始日期" prop="sellStartTime" min-width="160"></el-table-column>-->
          <!--<el-table-column label="销售截止日期" prop="sellEndTime" min-width="160"></el-table-column>-->
          <el-table-column label="航班起始日期" prop="flightDateStart" min-width="120"></el-table-column>
          <el-table-column label="航班截止日期" prop="flightDateEnd" min-width="120"></el-table-column>
          <el-table-column label="国内/国际" prop="isinter" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.isinter === '0'">国内</div>
              <div v-if="scope.row.isinter === '1'">国际</div>
            </template>
          </el-table-column>
          <el-table-column label="免费升舱舱位" prop="policyCabin" min-width="120"></el-table-column>
          <el-table-column label="乘客类型" prop="passengerType" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.passengerType === '0'">成人</div>
              <div v-if="scope.row.passengerType === '1'">儿童</div>
              <div v-if="scope.row.passengerType === '2'">婴儿</div>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.policyStatus === '1'">启用</span>
              <span v-else >禁用</span>
            </template>
          </el-table-column>
          <!--<el-table-column label="创建时间" prop="createDate" min-width="160"></el-table-column>-->
          <!--<el-table-column label="创建人" prop="createOpName"></el-table-column>-->
          <!--<el-table-column label="修改时间" prop="modifyDate"  min-width="160"></el-table-column>-->
          <!--<el-table-column label="修改人" prop="modifyOpName"></el-table-column>-->
          <!--<el-table-column label="备注" prop="policyRemark" min-width="180px"></el-table-column>-->
          <el-table-column label="操作" fixed="right" min-width="120px">
              <template slot-scope="scope">
                <span class="active-text mr-5" title="禁用" @click="handleState(scope.row.policyStatus, scope.row.policyId)" v-if="scope.row.policyStatus === '0'">启用</span>
                <span class="active-text mr-5" title="启用" @click="handleState(scope.row.policyStatus, scope.row.policyId)" v-if="scope.row.policyStatus === '1'">禁用</span>
                <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
                <span class="danger-text mr-5" title="删除" @click="handleDelete(scope.row.policyId)">删除</span>
                <!--<i class="table-icon disable-icon" @click="handleState(scope.row.policyStatus, scope.row.policyId)" v-if="scope.row.policyStatus === '0'" title="禁用"></i>-->
                <!--<i class="table-icon enable-icon" @click="handleState(scope.row.policyStatus, scope.row.policyId)" v-if="scope.row.policyStatus === '1'" title="启用"></i>-->
                <!--<i class="table-icon delete-icon" title="删除" @click="handleDelete(scope.row.policyId)"></i>-->
                <!--<i class="table-icon edit-icon" title="编辑" @click="handleEdit(scope.row)"></i>-->
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
        :total="tableList.total">
      </el-pagination>
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog :title="popupTitle" :visible.sync="editVisible" width="800px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">升舱产品</div>
              <div class="ipt-medium">
                <el-select placeholder="请选择升舱产品" v-model="editForm.upgradId" size="medium" filterable>
                  <el-option v-for="item in upgradList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.upgradId">升舱产品不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">航班号</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="航班号" clearable v-model="editForm.flightNo"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">规则批号</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="规则批号" clearable v-model="editForm.policyCode"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">免费升舱舱位</div>
              <div class="ipt-medium">
                <el-select placeholder="请选择舱位" v-model="editForm.policyCabin" size="medium" clearable multiple filterable collapse-tags>
                  <el-option v-for="item in policyCabinList" :key="item.id" :value="item.value" :label="item.value">
                  </el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.policyCabin.length">免费升舱舱位不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">渠道类型</div>
              <div class="ipt-medium">
                <el-select placeholder="请选择渠道类型" v-model="editForm.channel" clearable multiple size="medium" collapse-tags>
                  <el-option
                    v-for="item in channelList"
                    :key="item.chalId"
                    :value="item.chalCode"
                    :label="item.chalName">
                  </el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.channel.length">渠道类型不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">航段</div>
              <div class="ipt-medium">
                <el-input class="fl" size="medium" clearable placeholder="出发地" v-model="editForm.sailFrom" style="width: 90px"></el-input>
                <div class="fl" :span="2" style="padding: 8px 11px;">-</div>
                <el-input class="fl" size="medium" clearable placeholder="到达地" v-model="editForm.sailTo" style="width: 90px"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.sailFrom && !editForm.sailTo">航段不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">航班起始日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  value-format="yyyy-MM-dd"
                  placeholder="航班起始日期"
                  v-model="editForm.flightDateStart">
                </el-date-picker>
              </div>
            </div>
            <div class="column">
              <div class="label">航班截止日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  placeholder="航班截止日期"
                  value-format="yyyy-MM-dd"
                  v-model="editForm.flightDateEnd">
                </el-date-picker>
              </div>
            </div>
            <div class="column">
              <div class="label required">销售起始日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="datetime"
                  class="date-picker"
                  placeholder="销售起始日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="editForm.sellStartTime">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.sellStartTime">销售起始日期不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">销售截止日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="datetime"
                  class="date-picker"
                  placeholder="销售截止日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="editForm.sellEndTime">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.sellEndTime">销售截止日期不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">国际/国内</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.isinter" placeholder="请选择国际/国内" size="medium">
                  <el-option key="0" label="国内" value="0"></el-option>
                  <el-option key="1" label="国际" value="1"></el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label required">乘客类型</div>
              <div class="ipt-medium">
                <el-select placeholder="请选择乘客类型" v-model="editForm.passengerType" size="medium" clearable multiple collapse-tags>
                  <el-option key="0" label="成人" value="0"></el-option>
                  <el-option key="1" label="儿童" value="1"></el-option>
                  <el-option key="2" label="婴儿" value="2"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.passengerType.length">乘客类型不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">启用/禁用</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.policyStatus" size="medium" placeholder="启用/禁用">
                  <el-option key="0" label="启用" value="1"></el-option>
                  <el-option key="1" label="禁用" value="0"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.policyStatus">启用/禁用不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">备注</div>
              <div class="ipt-medium">
                <el-input size="medium" v-model="editForm.policyRemark" type="textarea" rows="3"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="saveEdit">提交</el-button>
          <el-button size="medium" v-if="isReset" @click="resetEdit">重置</el-button>
          <el-button size="medium" @click="editVisible = false, addShow = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
    <!--上传文件-->
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
          <el-button size="medium" @click="importVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryPolicyList, updatePolicyList, addPolicyList, delPolicyList, updatePolicyStatus, queryUpgradTree, importFree } from './api'
import { getChannelList, excelList, getRouteName } from '../../../utils/index'
import { mapState } from 'vuex'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'UpgradFlightFree',
  data () {
    return {
      searchForm: {
        policyCode: '', // 规则批号
        upgradCode: '', // 产品编号
        upgradName: '', // 产品名称
        sailFrom: '', // 航段-出发地
        sailTo: '', // 航段-到达地
        channel: '', // 渠道类型 下拉框
        isinter: '', // 国内/国际 下拉框
        policyCabin: '', // 适用可升舱舱位
        flightNo: '', // 航班号
        createOpName: '', // 创建人
        policyStatus: '' // 启用/禁用 下拉框
      },
      policyCabinList: [
        { id: 0, value: 'A' }, { id: 1, value: 'B' }, { id: 2, value: 'C' },
        { id: 3, value: 'D' }, { id: 4, value: 'E' }, { id: 5, value: 'F' },
        { id: 6, value: 'G' }, { id: 7, value: 'H' }, { id: 8, value: 'I' },
        { id: 9, value: 'J' }, { id: 10, value: 'K' }, { id: 11, value: 'L' },
        { id: 12, value: 'M' }, { id: 13, value: 'N' }, { id: 14, value: 'O' },
        { id: 16, value: 'P' }, { id: 17, value: 'Q' }, { id: 18, value: 'R' },
        { id: 19, value: 'S' }, { id: 20, value: 'T' }, { id: 21, value: 'U' },
        { id: 22, value: 'V' }, { id: 23, value: 'W' }, { id: 24, value: 'X' },
        { id: 25, value: 'Y' }, { id: 26, value: 'Z' }
      ],
      upgradList: [], // 升舱产品数据列表
      sellTime: [], // 销售时间
      flightDate: [], // 航班时间
      createDate: [], // 创建时间
      tableList: {}, // 展示表格数据
      multipleSelection: [], // 选中的表单数据
      editForm: {
        policyId: '',
        upgradId: '',
        fareType: '1',
        upgradName: '',
        flightNo: '',
        adtFare: '',
        chdFare: '',
        infFare: '',
        policyCode: '',
        sailFrom: '',
        sailTo: '',
        flightDateStart: '',
        flightDateEnd: '',
        sellStartTime: '',
        sellEndTime: '',
        isinter: '',
        policyRemark: '',
        policyStatus: '1',
        channel: [],
        passengerType: [],
        policyCabin: []
      }, // 弹框编辑表格
      dataViewHeight: null, // 表格高度
      editVisible: false, // 弹出框显示隐藏
      importVisible: false, // 上传弹出框显示隐藏
      addShow: false, // true为添加，false为修改
      isEmpty: false, // 判空
      isReset: false,
      fileList: [],
      filepath: '',
      loading: false, // 加载
      popupTitle: ''
    }
  },
  created () {
    this.getChannelList()
    this.queryPolicyList(1, this.pagination.pageSize)
  },
  mixins: [computWidth],
  computed: {
    ...mapState({
      channelList: state => state.app.channelList, // 渠道
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  methods: {
    // 获取渠道列表
    // channel没有则请求服务器
    getChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 获取升舱产品列表
    getUpgradList () {
      queryUpgradTree().then(res => {
        this.upgradList = res.treeList
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 获取表单数据
    queryPolicyList (page, pageSize) {
      this.loading = true
      this.searchForm.page = page || 1
      if (pageSize) this.searchForm.rows = pageSize
      this.searchForm['fareType'] = '0'
      // this.handleDate()
      queryPolicyList(this.searchForm).then(res => {
        this.tableList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 日期处理
    handleDate () {
      if (this.sellTime && this.sellTime.length) {
        this.searchForm.sellStartTime = this.sellTime[0]
        this.searchForm.sellEndTime = this.sellTime[1]
      }
      if (this.flightDate && this.flightDate.length) {
        this.searchForm.flightDateStart = this.flightDate[0]
        this.searchForm.flightDateEnd = this.flightDate[1]
      }
      if (this.createDate && this.createDate.length) {
        this.searchForm.createDates = this.createDate[0]
        this.searchForm.createDatee = this.createDate[1]
      }
    },
    // 分页导航
    handleSizeChange (pages) {
      this.queryPolicyList(null, pages)
    },
    handleCurrentChange (page) {
      this.queryPolicyList(page, null)
    },
    // 更改禁用/启用 状态
    handleState (status, id) {
      let title = ''
      if (status === '0') {
        title = '是否确认启用?'
      } else {
        title = '是否确认禁用?'
      }
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updatePolicyStatus({
          policyId: id,
          policyStatus: status === '0' ? '1' : '0'
        }).then(res => {
          this.$message.success(res.message)
          this.queryPolicyList(1, this.pagination.pageSize)
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消修改')
      })
    },
    // 编辑弹出框
    handleEdit (params) {
      this.editVisible = true
      this.getUpgradList()
      if (params) {
        this.popupTitle = '修改'
        this.addShow = false
        this.isReset = false
        this.dataBind(params)
        // console.log(this.addShow)
      } else {
        this.popupTitle = '添加'
        this.addShow = true
        this.isReset = true
        this.resetEdit()
      }
    },
    dataBind (params) {
      this.editForm.policyId = params.policyId
      this.editForm.upgradId = params.upgradId
      this.editForm.fareType = params.fareType
      this.editForm.upgradName = params.upgradName
      this.editForm.flightNo = params.flightNo
      this.editForm.adtFare = params.adtFare
      this.editForm.chdFare = params.chdFare
      this.editForm.infFare = params.infFare
      this.editForm.policyCode = params.policyCode
      this.editForm.sailFrom = params.sailFrom
      this.editForm.sailTo = params.sailTo
      this.editForm.flightDateStart = params.flightDateStart
      this.editForm.flightDateEnd = params.flightDateEnd
      this.editForm.sellStartTime = params.sellStartTime
      this.editForm.sellEndTime = params.sellEndTime
      this.editForm.isinter = params.isinter
      this.editForm.policyRemark = params.policyRemark
      this.editForm.policyStatus = params.policyStatus
      this.editForm.channel = params.channel.split(',')
      this.editForm.passengerType = params.passengerType.split(',')
      this.editForm.policyCabin = params.policyCabin.split(',')
    },
    // 保存编辑
    saveEdit () {
      if (this.editForm.upgradId &&
        this.editForm.policyCabin &&
        this.editForm.channel &&
        this.editForm.sailFrom &&
        this.editForm.sailTo &&
        this.editForm.sellStartTime &&
        this.editForm.sellEndTime &&
        this.editForm.passengerType &&
        this.editForm.policyStatus) {
        let data = JSON.parse(JSON.stringify(this.editForm))
        if (data.channel.length && data.passengerType.length && data.policyCabin.length) {
          data.channel = data.channel.join(',')
          data.passengerType = data.passengerType.join(',')
          data.policyCabin = data.policyCabin.join(',')
        }
        delete data.upgradName
        if (this.addShow === false) {
          updatePolicyList(data).then(res => {
            this.editVisible = false
            this.addShow = false
            this.queryPolicyList(1, this.pagination.pageSize)
            this.$message.success(res.message)
          }).catch(err => {
            this.$message.error(err.message)
          })
        } else {
          delete data.policyId
          delete data.upgradName
          data.fareType = '0'
          data.upgradId = '1'
          addPolicyList(data).then(res => {
            this.editVisible = false
            this.queryPolicyList(1, this.pagination.pageSize)
            this.$message.success(res.message)
          }).catch(err => {
            // console.log(err)
            this.$message.error(err.message)
          })
          this.editVisible = false
          this.addShow = false
        }
      } else {
        this.isEmpty = true
      }
    },
    // 单行删除
    handleDelete (id) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        delPolicyList({ ids: id }).then(res => {
          this.$message.success(res.message)
          this.queryPolicyList(1, this.pagination.pageSize)
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 搜索框 -- 重置
    handleReset () {
      this.searchForm = {
        policyCode: '',
        upgradCode: '',
        upgradName: '',
        sailFrom: '',
        sailTo: '',
        channel: '',
        isinter: '',
        policyCabin: '',
        flightNo: '',
        sellStartTime: '',
        sellEndTime: '',
        flightDateStart: '',
        flightDateEnd: '',
        createDates: '',
        createDatee: '',
        createOpName: '',
        policyStatus: ''
      }
      this.sellTime = []
      this.flightDate = []
      this.createDate = []
      this.queryPolicyList(1, this.pagination.pageSize)
    },
    // 重置弹出框
    resetEdit () {
      this.editForm = {
        policyId: '',
        upgradId: '',
        fareType: '1',
        upgradName: '',
        flightNo: '*',
        adtFare: '',
        chdFare: '',
        infFare: '',
        policyCode: '',
        sailFrom: '*',
        sailTo: '*',
        flightDateStart: '',
        flightDateEnd: '',
        sellStartTime: '',
        sellEndTime: '',
        isinter: '1',
        policyRemark: '',
        policyStatus: '1',
        channel: [],
        passengerType: [],
        policyCabin: []
      }
      this.isEmpty = false
    },
    // 选择删除
    handleDelects () {
      let policyId = ''
      for (let item of this.multipleSelection) {
        // console.log(item)
        policyId += item.policyId + ','
      }
      policyId = policyId.substring(0, policyId.length - 1)
      this.handleDelete(policyId)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 导出excel记录
    exportPolicyRecordXls () {
      let params = {
        data: JSON.parse(JSON.stringify(this.searchForm)),
        url: 'upgradFlightPolicy/exportUpgradFree',
        name: getRouteName('/upgradFlightFree'),
        type: 'xls',
        total: this.tableList.total
      }
      excelList(params)
    },
    // 导出上传文件
    handleExportUpload () {
      let params = {
        data: JSON.parse(JSON.stringify(this.searchForm)),
        url: 'upgradFlightPolicy/exportUpgradFreeTemplate',
        name: getRouteName('/upgradFlightFree') + '上传文件',
        type: 'xls',
        total: this.tableList.total
      }
      excelList(params)
    },
    // 上传文件
    handleImport () {
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
      importFree(data).then(res => {
        this.$message.success(res.message)
        this.importVisible = false
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  }
}
</script>

<style scoped>
</style>
