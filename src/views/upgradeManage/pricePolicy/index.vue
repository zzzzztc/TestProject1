<template>
  <div id="UpgradFlightPolicy" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item w-200 fl">
          <el-input size="medium" clearable placeholder="产品编码" v-model="filter.upgradCode" @keydown.enter.native="queryPolicyList()"></el-input>
        </div>
        <div class="search-item w-200 fl">
          <el-input size="medium" clearable placeholder="产品名称" v-model="filter.upgradName" @keydown.enter.native="queryPolicyList()"></el-input>
        </div>
        <div class="search-item w-200 fl">
          <el-select size="medium" v-model="filter.channel" placeholder="请选择渠道" clearable>
            <el-option v-for="item in channelList" :key="item.chalId" :value="item.chalCode" :label="item.chalName"></el-option>
          </el-select>
        </div>
        <div class="search-item w-200 fl">
          <el-input size="medium" clearable placeholder="规则批号" v-model="filter.policyCode" @keydown.enter.native="queryPolicyList()"></el-input>
        </div>
        <div class="search-item w-200 fl">
          <el-select size="medium" placeholder="国内/国际" clearable v-model="filter.isinter">
            <el-option label="国内" value="0"></el-option>
            <el-option label="国际" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt clearfix">
          <el-input size="medium" placeholder="航段" v-model="filter.sailFrom" class="hd fl mr-10" @keydown.enter.native="queryPolicyList()"></el-input>
          <div class="fl ">-</div>
          <el-input size="medium" placeholder="航段" v-model="filter.sailTo" class="hd fl ml-10" @keydown.enter.native="queryPolicyList()"></el-input>
        </div>
        <div class="search-item w-200 fl">
          <el-input size="medium" clearable placeholder="航班号" v-model="filter.flightNo" @keydown.enter.native="queryPolicyList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.sellStartTime"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="销售开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.sellEndTime"
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
<!--            start-placeholder="销售开始日期"-->
<!--            end-placeholder="销售结束日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.flightDateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.flightDateEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班结束日期">
          </el-date-picker>
        </div>
<!--        <div class="search-item fl ">-->
<!--          <el-date-picker-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="flightDate"-->
<!--            type="daterange"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            range-separator="至"-->
<!--            start-placeholder="航班开始日期"-->
<!--            end-placeholder="航班结束日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.createDates"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="创建开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.createDatee"
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
<!--            value-format="yyyy-MM-dd"-->
<!--            range-separator="至"-->
<!--            start-placeholder="创建开始日期"-->
<!--            end-placeholder="创建结束日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="search-item w-200 fl">
          <el-input size="medium" clearable placeholder="创建人" v-model="filter.createOpName" @keydown.enter.native="queryPolicyList()"></el-input>
        </div>
        <div class="search-item w-200 fl">
          <el-select size="medium" placeholder="启用/禁用" clearable v-model="filter.policyStatus">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </div>
        <div class="search-item w-200 fl">
          <el-button size="medium" type="primary" @click="queryPolicyList(null, null)">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="switchDialog(null)">添加</el-button>
        <el-button size="medium" type="danger" :disabled="!selectionArr.length" @click="batchDelete">批量删除</el-button>
        <el-button size="medium" type="success" :disabled="!pricePolicy.total" @click="handleExport">导出政策记录</el-button>
        <el-button type="success" size="medium" @click="handleExportUpload()">导出上传文件</el-button>
        <el-button size="medium" @click="handleUpload()">上传运价文件</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container" >
        <el-table
          v-loading="loading"
          :data="pricePolicy.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :cell-style="tableAttributes.cellStyle"
          @selection-change="handleSelectionChange" >
          <el-table-column fixed="left" type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="适可用升舱舱位">
                  <span>{{ props.row.policyCabin }}</span>
                </el-form-item>
                <el-form-item label="运价类型">
                  <span v-if="props.row.fareType === '1'">固定产品价格</span>
                  <span v-if="props.row.fareType === '2'">基于基础运价系数</span>
                </el-form-item>
                <el-form-item label="成人升舱价格">
                  <span>{{ props.row.adtFare | formatPriceMap }}</span>
                </el-form-item>
                <el-form-item label="儿童升舱价格">
                  <span>{{ props.row.chdFare | formatPriceMap }}</span>
                </el-form-item>
                <el-form-item label="婴儿升舱价格">
                  <span>{{ props.row.infFare | formatPriceMap }}</span>
                </el-form-item>
                <el-form-item label="创建时间">
                  <span>{{ props.row.createDate }}</span>
                </el-form-item>
                <el-form-item label="创建人">
                  <span>{{ props.row.createOpName }}</span>
                </el-form-item>
                <el-form-item label="修改时间">
                  <span>{{props.row.modifyDate}}</span>
                </el-form-item>
                <el-form-item label="修改人">
                  <span>{{props.row.modifyOpName}}</span>
                </el-form-item>
                <el-form-item label="销售起始时间">
                  <span>{{props.row.sellStartTime}}</span>
                </el-form-item>
                <el-form-item label="销售截止时间">
                  <span>{{props.row.sellEndTime}}</span>
                </el-form-item>
                <el-form-item label="备注">
                  <span>{{props.row.policyRemark}}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="selection" width="46" fixed="left"></el-table-column>
          <el-table-column label="产品编号" fixed="left">
            <template slot-scope="scope">
              <div class="">{{scope.row.upgradCode}}</div>
            </template>
          </el-table-column>
          <el-table-column label="产品名称" prop="upgradName"></el-table-column>
          <el-table-column label="规则批号" prop="policyCode" min-width="240"></el-table-column>
          <el-table-column label="渠道编号" prop="channel" min-width="140">
            <template slot-scope="scope">
              <div>{{scope.row.channel | channelMap}}</div>
            </template>
          </el-table-column>
          <el-table-column label="航班号" prop="flightNo"></el-table-column>
          <el-table-column label="出发地" prop="sailFrom"></el-table-column>
          <el-table-column label="到达地" prop="sailTo"></el-table-column>
          <el-table-column label="航程类型">
            <template slot-scope="scope">
              <div v-if="scope.row.tripType === '0'">单程</div>
              <div v-if="scope.row.tripType === '1'">往返</div>
            </template>
          </el-table-column>
          <!--<el-table-column label="销售起始时间" prop="sellStartTime" min-width="160"></el-table-column>-->
          <!--<el-table-column label="销售截止时间" prop="sellEndTime" min-width="160"></el-table-column>-->
          <el-table-column label="航班起始时间" prop="flightDateStart" min-width="140"></el-table-column>
          <el-table-column label="航班截止时间" prop="flightDateEnd" min-width="140"></el-table-column>
          <el-table-column label="国内/国际" min-width="100" >
            <template slot-scope="scope">
              <div v-if="scope.row.isinter === '0'">国内</div>
              <div v-else>国际</div>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.policyStatus === '1'">启用</span>
              <span v-else >禁用</span>
            </template>
          </el-table-column>
          <!--<el-table-column label="适用可升舱舱位" prop="policyCabin" min-width="260"></el-table-column>-->
          <!--<el-table-column label="运价类型" min-width="160">-->
            <!--<template slot-scope="scope">-->
              <!--<div v-if="scope.row.fareType === '1'">固定产品价格</div>-->
              <!--<div v-if="scope.row.fareType === '2'">基于基础运价系数</div>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column label="成人升舱价格" prop="adtFare" min-width="120"></el-table-column>-->
          <!--<el-table-column label="儿童升舱价格" prop="chdFare" min-width="120"></el-table-column>-->
          <!--<el-table-column label="婴儿升舱价格" prop="inFare" min-width="120"></el-table-column>-->
          <!--<el-table-column label="创建时间"  prop="createDate" min-width="160"></el-table-column>-->
          <!--<el-table-column label="创建人" prop="createOpName"></el-table-column>-->
          <!--<el-table-column label="修改时间"  prop="modifyDate" min-width="160"></el-table-column>-->
          <!--<el-table-column label="修改人" prop="modifyOpName"></el-table-column>-->
          <!--<el-table-column label="备注"  prop="policyRemark"></el-table-column>-->
          <el-table-column label="操作" fixed="right" min-width="120">
            <template slot-scope="scope">
              <span class="active-text mr-5" @click='togglePolicyStatus(scope.row.policyId, scope.row.policyStatus)' v-if="scope.row.policyStatus === '1'" title="启用">禁用</span>
              <span class="active-text mr-5" title="禁用" @click='togglePolicyStatus(scope.row.policyId, scope.row.policyStatus)' v-if="scope.row.policyStatus === '0'">启用</span>
              <span class="active-text mr-5" title="编辑" @click="switchDialog(scope.row)">编辑</span>
              <span class="danger-text mr-5" title="删除" @click="deleteItem(scope.row.policyId)">删除</span>
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
          :total="pricePolicy.total">
        </el-pagination>
      </div>
    </div>
    <div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="810px">
        <div class="dialog-container">
          <div class="dialog-main">
            <div class="row">
              <div class="column">
                <div class="label required">升舱产品</div>
                <div class="ipt-medium">
                  <el-select size="medium" v-model="pricePolicyInfo.upgradId" filterable clearable>
                    <el-option v-for="item in upgradList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                  </el-select>
                </div>
                <div class="warning-info" v-if="formErr && !pricePolicyInfo.upgradId">升舱产品不可为空</div>
              </div>
              <div class="column">
                <div class="label">国内/国际</div>
                <div class="ipt-medium">
                  <el-select size="medium" placeholder="国内/国际" v-model="pricePolicyInfo.isinter">
                    <el-option value="0" label="国内"></el-option>
                    <el-option value="1" label="国际"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="column">
                <div class="label fl required">渠道</div>
                <div class="fl ipt-medium">
                  <el-select size="medium" placeholder="渠道" multiple clearable v-model="pricePolicyInfo.channel" collapse-tags>
                    <el-option v-for="item in channelList" :key="item.chalId" :value="item.chalCode" :label="item.chalName"></el-option>
                  </el-select>
                  <div class="warning-info" v-if="formErr && !pricePolicyInfo.channel.length">渠道不可为空</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label fl">规则批号</div>
                <div class="fl ipt-medium">
                  <el-input size="medium" placeholder="规则批号" clearable v-model="pricePolicyInfo.policyCode"></el-input>
                  <!--<div class="warning-info">升舱产品不可为空</div>-->
                </div>
              </div>
              <div class="column">
                <div class="label fl">运价类型</div>
                <div class="fl ipt-medium">
                  <el-select size="medium" placeholder="运价类型" v-model="pricePolicyInfo.fareType">
                    <el-option value="1" label="固定产品价格"></el-option>
                    <el-option value="2" label="基于基础运价系数"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="column">
                <div class="label fl">航班号</div>
                <div class="fl ipt-medium">
                  <el-input size="medium" placeholder="*为全部" v-model="pricePolicyInfo.flightNo"></el-input>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label">航段</div>
                <div class="ipt-medium">
                  <div class="clearfix">
                    <el-input class="fl" size="medium" v-model="pricePolicyInfo.sailFrom" style="width: 90px" clearable></el-input>
                    <div class="fl" style="padding: 0 10px;">-</div>
                    <el-input class="fl" size="medium" v-model="pricePolicyInfo.sailTo" style="width: 90px" clearable></el-input>
                  </div>
                </div>
              </div>
              <div class="column">
                <div class="label">航程类型</div>
                <div class="ipt-medium">
                  <el-select size="medium" placeholder="航程类型" v-model="pricePolicyInfo.tripType">
                    <el-option value="0" label="单程"></el-option>
                    <el-option value="1" label="往返"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="column">
                <div class="label required">适用可升舱舱位</div>
                <div class="ipt-medium">
                  <el-select size="medium" placeholder="适应可用升舱舱位" clearable multiple filterable collapse-tags v-model="pricePolicyInfo.policyCabin">
                    <el-option size="medium"
                               v-for="item in ['A', 'B', 'C', 'D',
    'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']"
                               :value="item"
                               :label="item"
                               :key="item">
                    </el-option>
                  </el-select>
                  <div class="warning-info" v-if="formErr && !pricePolicyInfo.policyCabin.length">升舱舱位不可为空</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label fl required">成人升舱价格</div>
                <div class="fl ipt-medium">
                  <el-input size="medium" clearable type="number" v-model="pricePolicyInfo.adtFare"></el-input>
                  <div class="warning-info" v-if="formErr && (pricePolicyInfo.adtFare <= 0 || !pricePolicyInfo.adtFare)">请填写合法价格</div>
                </div>
              </div>
              <div class="column">
                <div class="label fl">儿童升舱价格</div>
                <div class="fl ipt-medium">
                  <el-input size="medium" clearable type="number" v-model="pricePolicyInfo.chdFare"></el-input>
                  <div class="warning-info" v-if="formErr && pricePolicyInfo.chdFare && pricePolicyInfo.chdFare <= 0">价格应为正数</div>
                </div>
              </div>
              <div class="column">
                <div class="label fl">婴儿升舱价格</div>
                <div class="fl ipt-medium">
                  <el-input size="medium" clearable type="number" v-model="pricePolicyInfo.infFare"></el-input>
                  <div class="warning-info" v-if="formErr && pricePolicyInfo.infFare && pricePolicyInfo.infFare <= 0">价格应为正数</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label">航班起始日期</div>
                <div class="ipt-medium">
                  <el-date-picker
                    size="medium"
                    class="date-picker"
                    v-model="pricePolicyInfo.flightDateStart"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="航班起始日期">
                  </el-date-picker>
                  <!--<div class="warning-info">升舱产品不可为空</div>-->
                </div>
              </div>
              <div class="column">
                <div class="label">航班截止日期</div>
                <div class="ipt-medium">
                  <el-date-picker
                    size="medium"
                    class="date-picker"
                    v-model="pricePolicyInfo.flightDateEnd"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="航班截止日期">
                  </el-date-picker>
                </div>
              </div>
              <div class="column"></div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label required">销售起始时间</div>
                <div class="ipt-medium">
                  <el-date-picker
                    size="medium"
                    class="date-picker"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    v-model="pricePolicyInfo.sellStartTime"
                    type="datetime"
                    placeholder="销售起始时间">
                  </el-date-picker>
                  <div class="warning-info" v-if="formErr && !pricePolicyInfo.sellStartTime">销售起始时间不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">销售截止时间</div>
                <div class="ipt-medium">
                  <el-date-picker
                    size="medium"
                    class="date-picker"
                    v-model="pricePolicyInfo.sellEndTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="销售起始时间">
                  </el-date-picker>
                  <div class="warning-info" v-if="formErr && !pricePolicyInfo.sellEndTime">销售截止时间不可为空</div>
                </div>
              </div>
              <div class="column"></div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label">启用/禁用</div>
                <div class="ipt-medium">
                  <el-select size="medium" v-model="pricePolicyInfo.policyStatus" placeholder="启用/禁用">
                    <el-option value="1" label="启用"></el-option>
                    <el-option value="0" label="禁用"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="column">
                <div class="label">备注</div>
                <div class="ipt-medium">
                  <el-input type="textarea" v-model="pricePolicyInfo.policyRemark" :rows="4"></el-input>
                </div>
              </div>
            </div>
          </div>
          <div class="dialog-footer">
            <div class="box"></div>
            <!--<el-button size="medium" type="primary" v-if="!isCreate" @click="paramsJudge">编辑</el-button>-->
            <el-button size="medium" type="primary" @click="paramsJudge">提交</el-button>
            <el-button size="medium" v-if="isCreate" @click="resetPricePolicyInfo">重置</el-button>
            <el-button size="medium" @click="dialogVisible = false">返回</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <!--上传运价文件-->
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
import { fetchList, deletePolicy, fetchUpgradList, addPricePolicy, editPricePolicy, modifyPolicyStatus, importPolicy } from './api.js'
import { excelList, filterIds, getChannelList, getRouteName } from '../../../utils/index'
import { mapState } from 'vuex'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'UpgradFlightPolicy',
  data () {
    return {
      pricePolicy: {},
      upgradList: [], // 升舱产品列表
      dataViewHeight: null, // grid高度
      selectionArr: [], // 选中数据npmn
      sellTime: [], // 销售时间
      flightDate: [], // 航班时间
      createDate: [], // 创建时间
      filter: { // 过滤条件
        fareType: '1',
        upgradCode: '',
        upgradName: '',
        channel: '',
        policyCode: '',
        isinter: '',
        sailFrom: '',
        sailTo: '',
        flightNo: '',
        sellStartTime: '',
        sellEndTime: '',
        flightDateStart: '',
        flightDateEnd: '',
        createDates: '',
        createDatee: '',
        createOpName: '',
        policyStatus: '',
        page: 1,
        rows: 20
      },
      dialogVisible: false,
      dialogTitle: '',
      isCreate: false,
      formErr: false,
      pricePolicyInfo: {
        upgradId: null,
        policyCode: '',
        adtFare: '',
        flightDateStart: '',
        sellStartTime: '',
        isinter: '0',
        sailFrom: '*',
        sailTo: '*',
        tripType: '0',
        fareType: '1',
        policyStatus: '1',
        flightNo: '*',
        chdFare: '',
        flightDateEnd: '',
        sellEndTime: '',
        policyRemark: '',
        infFare: '',
        policyCabin: [],
        channel: []
      },
      loading: false, // 加载
      importVisible: false,
      fileList: [],
      filepath: ''
    }
  },
  mounted () {
    let hHeight = this.$refs.header.offsetHeight
    this.dataViewHeight = document.documentElement.clientHeight - hHeight - 130
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
      if (!this.upgradList.length) {
        fetchUpgradList().then(res => {
          this.upgradList = res.treeList
        }).catch(err => {
          this.$message({
            message: err.message,
            type: 'danger'
          })
        })
      }
    },
    // 分页
    handleSizeChange (pages) {
      this.queryPolicyList(null, pages)
    },
    handleCurrentChange (page) {
      this.queryPolicyList(page, null)
    },
    // 获取列表数据
    queryPolicyList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      // this.handleDate()
      fetchList(this.filter).then(res => {
        this.pricePolicy = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
    },
    // 日期处理
    handleDate () {
      if (this.sellTime && this.sellTime.length) {
        this.filter.sellStartTime = this.sellTime[0]
        this.filter.sellEndTime = this.sellTime[1]
      } else {
        delete this.filter.sellStartTime
        delete this.filter.sellEndTime
      }
      if (this.flightDate && this.flightDate.length) {
        this.filter.flightDateStart = this.flightDate[0]
        this.filter.flightDateEnd = this.flightDate[1]
      } else {
        delete this.filter.flightDateStart
        delete this.filter.flightDateEnd
      }
      if (this.createDate && this.createDate.length) {
        this.filter.createDates = this.createDate[0]
        this.filter.createDatee = this.createDate[1]
      } else {
        delete this.filter.createDates
        delete this.filter.createDatee
      }
    },
    // 重置查询条件
    resetFilter () {
      this.filter = {}
      this.queryPolicyList()
    },
    // 新增价格政策
    handleAddPricePolicy (data) {
      delete data.policyId
      addPricePolicy(data).then(res => {
        this.queryPolicyList()
        this.dialogVisible = false
        this.$message({
          message: '添加成功',
          type: 'success'
        })
      }).catch(err => {
        this.$message({
          message: err.message,
          type: 'danger'
        })
      })
    },
    // 编辑价格政策
    handleEditPricePolicy (data) {
      editPricePolicy(data).then(res => {
        this.queryPolicyList()
        this.dialogVisible = false
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
      }).catch(err => {
        this.$message({
          message: err.message,
          type: 'danger'
        })
      })
    },
    // 参数验证
    paramsJudge () {
      let adtPrice = true
      let chdPrice = true
      let baPrice = true
      if (this.pricePolicyInfo.adtFare) {
        if (this.pricePolicyInfo.adtFare > 0) {
          adtPrice = true
        } else {
          adtPrice = false
        }
      }
      if (this.pricePolicyInfo.chdFare) {
        if (this.pricePolicyInfo.chdFare > 0) {
          chdPrice = true
        } else {
          chdPrice = false
        }
      }
      if (this.pricePolicyInfo.infFare) {
        if (this.pricePolicyInfo.infFare > 0) {
          baPrice = true
        } else {
          baPrice = false
        }
      }
      if (this.pricePolicyInfo.upgradId && this.pricePolicyInfo.channel.length && this.pricePolicyInfo.policyCabin.length && adtPrice && chdPrice && baPrice && this.pricePolicyInfo.sellStartTime && this.pricePolicyInfo.sellEndTime) {
        this.formErr = false
        let data = JSON.parse(JSON.stringify(this.pricePolicyInfo))
        data.channel = data.channel.join(',')
        // data.upgradId = data.upgradId.split(',')
        data.policyCabin = data.policyCabin.join(',')
        if (this.isCreate) {
          this.handleAddPricePolicy(data)
        } else {
          this.handleEditPricePolicy(data)
        }
      } else {
        this.formErr = true
      }
    },
    // 弹框切换
    switchDialog (params) {
      this.dialogVisible = true
      this.getUpgradList()
      this.resetPricePolicyInfo()
      if (params) {
        // 修改
        this.isCreate = false
        this.formErr = false
        this.dialogTitle = '修改'
        this.dataBind(params)
      } else {
        // 新增
        this.formErr = false
        this.isCreate = true
        this.dialogTitle = '添加'
      }
    },
    // 绑定值
    dataBind (params) {
      this.pricePolicyInfo.policyId = params.policyId
      this.pricePolicyInfo.upgradId = params.upgradId
      this.pricePolicyInfo.policyCode = params.policyCode
      this.pricePolicyInfo.sailFrom = params.sailFrom
      this.pricePolicyInfo.sailTo = params.sailTo
      this.pricePolicyInfo.adtFare = params.adtFare
      this.pricePolicyInfo.flightDateStart = params.flightDateStart
      this.pricePolicyInfo.sellStartTime = params.sellStartTime
      this.pricePolicyInfo.policyStatus = params.policyStatus
      this.pricePolicyInfo.isinter = params.isinter
      this.pricePolicyInfo.fareType = params.fareType
      this.pricePolicyInfo.tripType = params.tripType
      this.pricePolicyInfo.chdFare = params.chdFare
      this.pricePolicyInfo.flightDateEnd = params.flightDateEnd
      this.pricePolicyInfo.sellEndTime = params.sellEndTime
      this.pricePolicyInfo.policyRemark = params.policyRemark
      this.pricePolicyInfo.channel = params.channel.split(',')
      this.pricePolicyInfo.flightNo = params.flightNo
      this.pricePolicyInfo.policyCabin = params.policyCabin.split(',')
      this.pricePolicyInfo.infFare = params.infFare
    },
    // 删除操作
    deleteItem (id) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        deletePolicy({ ids: id }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.queryPolicyList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // table选择事件
    handleSelectionChange (val) {
      this.selectionArr = val
    },
    // 修改启用停用状态
    togglePolicyStatus (id, status) {
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
          policyId: id,
          policyStatus: status === '0' ? '1' : '0'
        }
        modifyPolicyStatus(data).then(res => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.queryPolicyList()
        }).catch(err => {
          this.$message({
            message: err.message,
            type: 'danger'
          })
        })
      }).catch(() => {
        this.$message({
          message: '已取消修改',
          type: 'info'
        })
      })
    },
    // 重置弹框数据
    resetPricePolicyInfo () {
      this.pricePolicyInfo = {
        upgradId: null,
        policyCode: '',
        adtFare: '',
        flightDateStart: '',
        sellStartTime: '',
        isinter: '0',
        sailFrom: '*',
        sailTo: '*',
        tripType: '0',
        fareType: '1',
        policyStatus: '1',
        flightNo: '*',
        chdFare: '',
        flightDateEnd: '',
        sellEndTime: '',
        policyRemark: '',
        infFare: '',
        policyCabin: [],
        channel: []
      }
    },
    // 导出政策记录
    handleExport () {
      let data = JSON.parse(JSON.stringify(this.filter))
      data.start = 1
      data.end = this.pricePolicy.total
      delete data.page
      delete data.rows
      let params = {
        data: data,
        url: 'upgradFlightPolicy/exportPolicy',
        name: getRouteName('/upgradFlightPolicy'),
        type: 'xls'
      }
      excelList(params)
    },
    // 导出上传文件
    handleExportUpload () {
      let params = {
        data: JSON.parse(JSON.stringify(this.filter)),
        url: 'upgradFlightPolicy/exportPolicyTemplate',
        name: getRouteName('/upgradFlightPolicy') + '上传文件',
        type: 'xls',
        total: this.pricePolicy.total
      }
      excelList(params)
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
      importPolicy(data).then(res => {
        this.$message.success(res.message)
        this.importVisible = false
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 批量删除
    batchDelete () {
      let ids = filterIds(this.selectionArr, 'policyId').join(',')
      this.deleteItem(ids)
    }
  }
}
</script>

<style scoped lang="scss">
  .hd {
    width: 75px;
  }
</style>
