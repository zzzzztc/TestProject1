<template>
  <!--<div>保险种类查询</div>-->
  <div id="InsuranceTypes" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="OFFICE编号" v-model="filter.officeCode" clearable @keydown.enter.native="getCategoryList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="保险种类" clearable v-model="filter.insuranceType">
            <el-option v-for="item in insuranceTypes" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" v-model="filter.buyFlag" clearable placeholder="可购状态">
            <el-option label="不可购" value="0"></el-option>
            <el-option label="可购" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="保险名称" v-model="filter.insuranceProductName" clearable @keydown.enter.native="getCategoryList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable   v-model="filter.channel" placeholder="渠道">
            <el-option v-for="item in channelList" :key="item.chalId" :value="item.chalCode" :label="item.chalName"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getCategoryList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="switchDialog(0)">添加保险种类</el-button>
<!--        <el-button size="medium">删除保险种类</el-button>-->
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :height="dataViewHeight"
          :data="insuraneCategory.rows"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
          <el-table-column fixed="left" type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="条款明细" style="width: 100%">
                  <span>{{ props.row.insuranceTerm }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="产品协议名称" min-width="200">
            <template slot-scope="scope">
              <div class="active-text" @click="switchDialog(2, scope.row)">{{scope.row.protocolProductName}}</div>
            </template>
          </el-table-column>
          <el-table-column label="保险gid" min-width="100" prop="faiGid"></el-table-column>
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
          <el-table-column label="选购份数" prop="buyNum" min-width="110"></el-table-column>
          <el-table-column label="保费" prop="premium" min-width="60">
            <template slot-scope="scope">
              {{scope.row.premium | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column label="保额" prop="repay" min-width="120">
            <template slot-scope="scope">
              {{scope.row.repay | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column label="佣金比例" prop="commissionRate" min-width="80"></el-table-column>
          <el-table-column label="保险金额" prop="commissionRate" min-width="80"></el-table-column>
          <el-table-column label="支付平台代码" prop="payCode" min-width="180"></el-table-column>
          <el-table-column label="保险种类" prop="insuranceProductName" min-width="120">
            <template slot-scope="scope">
              {{ scope.row.insuranceProductName.substring(2, 5) || '' }}
            </template>
          </el-table-column>
          <el-table-column label="可购状态">
            <template slot-scope="scope">
              <div v-if="scope.row.buyFlag === '1'">可购</div>
              <div v-if="scope.row.buyFlag === '0'">不可购</div>
            </template>
          </el-table-column>
          <el-table-column label="渠道" min-width="160">
            <template slot-scope="scope">
              <div>
                {{scope.row.channel | channelMap}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="不支持承保的城市" prop="excludeCity" min-width="160"></el-table-column>
          <el-table-column label="承保年龄起" prop="ageStart" min-width="160">
            <template slot-scope="scope">
              <div>{{ scope.row.ageStart | startType }}</div>
            </template>
          </el-table-column>
          <el-table-column label="承保年龄止" prop="ageEnd" min-width="160">
            <template slot-scope="scope">
              <div>{{ scope.row.ageEnd | startType }}</div>
            </template>
          </el-table-column>
          <el-table-column label="保险条款备注" prop="insuranceRemark" min-width="160"></el-table-column>
          <el-table-column label="创建时间" prop="createDate" min-width="160"></el-table-column>
          <el-table-column label="操作" min-width="120" fixed="right">
            <template slot-scope="scope">
              <div>
                <span class="active-text mr-5" title="编辑" @click="switchDialog(1, scope.row)">编辑</span>
                <span class="danger-text mr-5" title="删除" @click="handleDeleteInsuranceCategory(scope.row.insuranceDeployId)">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="filter.page"
          :page-sizes="pagination.pageSizes"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="insuraneCategory.total">
        </el-pagination>
      </div>
    </div>
    <div>
      <el-dialog :title="dialogTitle" v-dialogDrag :visible.sync="dialogVisible" width="1080px">
        <div class="dialog-container">
          <div class="dialog-main">
            <div class="row">
              <div class="column">
                <div class="label required">iata航协号</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="请输入iata航协号" :readonly="readonly" v-model="insuranceCategoryInfo.iataNo" clearable></el-input>
                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.iataNo">iata航协号不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">保险种类</div>
                <div class="ipt-medium">
                  <el-select size="medium" placeholder="请选择保险种类" :disabled="readonly" v-model="insuranceCategoryInfo.insuranceType">
                    <el-option v-for="item in insuranceTypes" :key="item.id" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.insuranceType">保险种类不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">OFFICE账号名称</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="请输入OFFICE账号名称" :readonly="readonly" v-model="insuranceCategoryInfo.officeName" clearable></el-input>
                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.officeName">OFFICE账号名称不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">可购状态</div>
                <div class="ipt-medium">
                  <el-select size="medium" placeholder="请选择可购状态" :disabled="readonly" v-model="insuranceCategoryInfo.buyFlag">
                    <el-option label="不可购" value="0"></el-option>
                    <el-option label="可购" value="1"></el-option>
                  </el-select>
                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.buyFlag">可购状态不可为空</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label required">OFFICE编号</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="请输入OFFICE编号" :readonly="readonly" v-model="insuranceCategoryInfo.officeCode" clearable></el-input>
                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.officeCode">OFFICE编号不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">保险产品代码</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="请输入保险产品代码" :readonly="readonly" v-model="insuranceCategoryInfo.insuranceProductCode" clearable></el-input>
                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.insuranceProductCode">保险产品代码不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">货币类型</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="请输入货币类型" :readonly="readonly" v-model="insuranceCategoryInfo.currencyType" clearable></el-input>
                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.currencyType">货币类型不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">保险产品Id</div>
                <el-input size="medium" placeholder="" :readonly="readonly" v-model="insuranceCategoryInfo.insuranceProductId" clearable></el-input>
                <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.insuranceProductId">保险产品代码不可为空</div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label required">电子客票类型</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="请输入电子客票类型" :readonly="readonly" v-model="insuranceCategoryInfo.ticketType" clearable></el-input>
                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.ticketType">电子客票类型不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">保险产品名称</div>
                <el-input size="medium" placeholder="请输入保险产品名称" :readonly="readonly" v-model="insuranceCategoryInfo.insuranceProductName" clearable></el-input>
                <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.insuranceProductName">保险产品名称不可为空</div>
              </div>
              <div class="column">
                <div class="label required">选购份数</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="请输入选购份数" :readonly="readonly" v-model="insuranceCategoryInfo.buyNum" clearable></el-input>
                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.buyNum">选购份数不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">协议Id</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="请输入协议Id" :readonly="readonly" v-model="insuranceCategoryInfo.protocolId" clearable></el-input>
                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.protocolId">协议Id不可为空</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label required">保费</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="请输入保费" :readonly="readonly" v-model="insuranceCategoryInfo.premium" clearable></el-input>
                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.premium">保费不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">产品协议名称</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="请输入产品协议名称" :readonly="readonly" v-model="insuranceCategoryInfo.protocolProductName" clearable></el-input>
                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.protocolProductName">产品协议名称不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">保额</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="请输入保额" :readonly="readonly" v-model="insuranceCategoryInfo.repay" clearable></el-input>
                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.repay">保额不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">OFFICE配置名称</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="请输入OFFICE配置名称" :readonly="readonly" v-model="insuranceCategoryInfo.userName" clearable></el-input>
                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.userName">OFFICE配置名称不可为空</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label required">账单结算归属单位</div>
                <div class="ipt-medium">
                  <el-select size="medium" :disabled="readonly" placeholder="请选择账单结算归属单位" v-model="insuranceCategoryInfo.checkto">
                    <el-option label="航联" value="A"></el-option>
                    <el-option label="航联和航协" value="AI"></el-option>
                  </el-select>
                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.checkto">账单结算归属单位不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">OFFICE配置密码</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="请输入OFFICE配置密码" :readonly="readonly" v-model="insuranceCategoryInfo.userPwd" clearable></el-input>
                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.userPwd">OFFICE配置密码不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">保险公司代码</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="请输入保险公司代码" :readonly="readonly" v-model="insuranceCategoryInfo.companyCode" clearable></el-input>
                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.companyCode">保险公司代码不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">产品协议Id</div>
                <div class="ipe-medium">
                  <el-input size="medium" placeholder="请输入产品协议Id" :readonly="readonly" v-model="insuranceCategoryInfo.protocolProductId" clearable></el-input>
                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.protocolProductId">产品协议Id不可为空</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label required">保险公司名称</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="请输入保险公司名称" :readonly="readonly" v-model="insuranceCategoryInfo.companyName" clearable></el-input>
                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.companyName">保险公司名称不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">渠道</div>
                <div class="ipt-medium">
                  <el-select size="medium" placeholder="请选择渠道类型" :disabled="readonly" multiple v-model="insuranceCategoryInfo.channel" collapse-tags>
                    <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
                  </el-select>
                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.channel.length">渠道类型不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">佣金比例</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="请输入佣金比例" :readonly="readonly" v-model="insuranceCategoryInfo.commissionRate" clearable></el-input>
                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.commissionRate">佣金比例不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">备注</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="请输入备注" :readonly="readonly" v-model="insuranceCategoryInfo.remark" clearable></el-input>
                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.remark">备注不可为空</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label">不支持承保的城市</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="请输入不支持承保的城市" :readonly="readonly" v-model="insuranceCategoryInfo.excludeCity" clearable></el-input>
<!--                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.excludeCity">不支持承保的城市不可为空</div>-->
                </div>
              </div>
              <div class="column">
                <div class="label">承保年龄起</div>
                <div class="fl ipt-medium">
                  <div class="search-item search-ipt fl">
                    <el-input size="medium" clearable placeholder="承保年龄起" v-model="insuranceCategoryInfo.ageStart" title="承保年龄起" style="width: 90px"></el-input>
                    <div style="padding: 0 10px; display: inline-block">-</div>
                    <el-select size="medium" clearable placeholder="岁/月/天" v-model="insuranceCategoryInfo.ageStartType" style="width: 90px">
                      <el-option label="岁" value="y"></el-option>
                      <el-option label="月" value="m"></el-option>
                      <el-option label="天" value="d"></el-option>
                    </el-select>
                    <div class="warning-info" v-if="isFlag1 && (!insuranceCategoryInfo.ageStart || !insuranceCategoryInfo.ageStartType)">承保年龄起不可为空</div>
                  </div>
                </div>
              </div>
              <div class="column">
                <div class="label">承保年龄止</div>
                <div class="fl ipt-medium">
                  <div class="search-item search-ipt fl">
                    <el-input size="medium" clearable placeholder="承保年龄止" v-model="insuranceCategoryInfo.ageEnd" title="承保年龄止" style="width: 90px"></el-input>
                    <div style="padding: 0 10px; display: inline-block">-</div>
                    <el-select size="medium" clearable placeholder="岁/月/天" v-model="insuranceCategoryInfo.ageEndType" style="width: 90px">
                      <el-option label="岁" value="y"></el-option>
                      <el-option label="月" value="m"></el-option>
                      <el-option label="天" value="d"></el-option>
                    </el-select>
                    <div class="warning-info" v-if="isFlag2 && (!insuranceCategoryInfo.ageEnd || !insuranceCategoryInfo.ageEndType)">承保年龄止不可为空</div>
                  </div>
                </div>
              </div>
              <div class="column">
                <div class="label">保险条款备注</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="请输入保险条款备注" :readonly="readonly" v-model="insuranceCategoryInfo.insuranceRemark" clearable></el-input>
<!--                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.insuranceRemark">保险条款备注不可为空</div>-->
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label required">支付平台代码</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="请输入支付平台代码" :readonly="readonly" v-model="insuranceCategoryInfo.payCode" clearable></el-input>
                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.payCode">支付平台代码不可为空</div>
                </div>
              </div>
              <div class="column" style="width: 75%">
                <div class="label required">保险条款内容</div>
                <el-input type="textarea" :rows="5" v-model="insuranceCategoryInfo.insuranceTerm" :readonly="readonly" placeholder="请输入保险条款内容" clearable></el-input>
                <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.insuranceTerm">保险条款内容不可为空</div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label required">保险gid</div>
                <div class="ipt-medium">
                  <el-input placeholder="请输入保险gid" :readonly="readonly" v-model="insuranceCategoryInfo.faiGid" clearable></el-input>
                  <div class="warning-info" v-if="isEmpty && !insuranceCategoryInfo.faiGid">请输入保险gid</div>
                </div>
              </div>
            </div>
          </div>
          <div class="dialog-footer">
            <el-button size="medium" type="primary" v-if="isCreateFlag !== 2" @click="handleAddInsuranceCategory()">提交</el-button>
            <el-button size="medium" v-if="isCreateFlag === 0" @click="handleReset()">重置</el-button>
            <el-button size="medium" @click="dialogVisible = false">返回</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getChannelList } from '../../../utils/index'
import { fetchList, deleteInsuranceCategory, addInsurace, updateInsurace } from './api'
import { insuranceTypes } from '../parameter.js'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'InsuranceTypes',
  data () {
    return {
      loading: false,
      filter: {
        officeCode: '', // OFFICE编号
        insuranceType: '', // 保险种类
        buyFlag: '', // 可购状态
        insuranceProductName: '', // 保险名称
        channel: '' // 渠道
      }, // 搜索表单数据
      dataViewHeight: null, // 搜索输入框高度
      insuranceTypes: insuranceTypes, // 保险种类
      insuraneCategory: {}, // 表格数据
      dialogVisible: false, // 弹出框显示隐藏
      dialogTitle: '', // 弹出框标题
      isCreateFlag: '', // 0 添加弹出框, 1 修改弹出框, 2 详情弹出框
      isEmpty: false, // 弹出框表单判空
      readonly: false, // 弹出框只读模式
      isFlag1: false,
      isFlag2: false,
      insuranceCategoryInfo: {
        iataNo: '', // iata航协号
        officeName: '', // OFFICE账号名称
        officeCode: '', // OFFICE编号
        currencyType: 'CNY', // 货币类型
        ticketType: 'ARL', // 电子客票类型
        buyNum: '', // 选购份数
        premium: '', // 保费
        repay: '', // 保额
        checkto: '', // 账单结算归属单位
        carrier: 'NS',
        companyCode: '', // 保险公司代码
        companyName: '', // 保险公司名称
        commissionRate: '', // 佣金比例
        payCode: '', // 支付平台代码
        insuranceType: '', // 保险种类
        buyFlag: '', // 可购状态
        insuranceProductCode: '', // 保险产品代码
        insuranceProductId: '', // 保险产品Id
        insuranceProductName: '', // 保险产品名称
        protocolId: '', // 协议id
        protocolProductName: '', // 产品协议名称
        userName: '', // OFFICE配置名称
        userPwd: '', // OFFICE配置密码
        protocolProductId: '', // 产品协议id
        channel: '', // 渠道
        remark: '', // 备注
        insuranceTerm: '', // 保险条款内容
        excludeCity: '', // 不支持承保的城市
        ageStart: '', // 承保年龄起
        ageEnd: '', // 承保年龄止
        insuranceRemark: '', // 保险条款备注
        ageStartType: '', // 承保年龄起类型
        faiGid: '', // 保险gid
        ageEndType: '' // 承保年龄止类型
      } // 修改/详情弹出框表单数据
    }
  },
  computed: {
    ...mapState({
      channelList: state => state.app.channelList,
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  filters: {
    startType (type) {
      if (type) {
	      if (type.split('_')[1] === 'y') {
		      return type.split('_')[0] + '岁'
	      } else if (type.split('_')[1] === 'm') {
		      return type.split('_')[0] + '月'
	      } else if (type.split('_')[1] === 'd') {
		      return type.split('_')[0] + '天'
	      } else {
		      return ''
	      }
      } else {
      	return type
      }
    }
  },
  created () {
    this.judgeChannelList()
    this.getCategoryList(1, this.pagination.pageSize)
  },
  mixins: [computWidth],
  methods: {
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 获取种类列表
    getCategoryList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter).then(res => {
        this.insuraneCategory = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 重置查询
    resetFilter () {
      this.filter = {}
      this.getCategoryList(1, this.pagination.pageSize)
    },
    // 分页
    handleSizeChange (pages) {
      this.getCategoryList(null, pages)
    },
    handleCurrentChange (page) {
      this.getCategoryList(page, null)
    },
    // 删除保险种类
    handleDeleteInsuranceCategory (id) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        deleteInsuranceCategory({ insuranceDeployId: id, buyFlag: 1 }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getCategoryList(1, this.pagination.pageSize)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 弹框切换
    switchDialog (type, params) {
      this.isCreateFlag = type
      this.dialogVisible = true
      if (type === 0) {
        // 添加
        this.dialogTitle = '添加保险种类'
        this.handleReset()
      } else if (type === 1) {
        // 修改
        this.isEmpty = false
        this.readonly = false
        this.dialogTitle = '修改保险种类'
        this.dataBind(params)
      } else if (type === 2) {
        // 详情
        this.dialogTitle = '保险种类详情'
        this.dataBind(params)
        this.readonly = true
      }
    },
    // 新增保险 -- 确定
    handleAddInsuranceCategory () {
      let data = JSON.parse(JSON.stringify(this.insuranceCategoryInfo))
      if (data.iataNo && data.officeName && data.officeCode && data.currencyType && data.ticketType &&
        data.buyNum && data.premium && data.repay && data.checkto && data.companyCode && data.companyName &&
        data.commissionRate && data.payCode && data.insuranceType && data.buyFlag && data.insuranceProductCode &&
        data.insuranceProductId && data.insuranceProductName && data.protocolId && data.protocolProductName && data.userName &&
        data.userPwd && data.protocolProductId && data.channel.length && data.remark && data.insuranceTerm) {
        if (data.ageStart && data.ageStartType && data.ageEnd && data.ageEndType && data.faiGid) {
          this.isFlag1 = false
          data.ageStart = data.ageStart + '_' + data.ageStartType
        } else if ((data.ageStart && !data.ageStartType) || (!data.ageStart && data.ageStartType)) {
          this.isFlag1 = true
          return
        } else {
          this.isFlag1 = false
          data.ageStart = ''
        }
        if (data.ageEnd && data.ageEndType) {
          this.isFlag2 = false
          data.ageEnd = data.ageEnd + '_' + data.ageEndType
        } else if ((data.ageEnd && !data.ageEndType) || (!data.ageEnd && data.ageEndType)) {
          this.isFlag2 = true
          return
        } else {
          this.isFlag2 = false
          data.ageEnd = ''
        }
        this.handleParams(data)
      } else {
        this.isEmpty = true
      }
    },
    handleParams (data) {
      this.isEmpty = false
      data.channel = data.channel.join(',')
      delete data.ageStartType
      delete data.ageEndType
      if (this.isCreateFlag === 0) {
        this.handleAddData(data)
      } else if (this.isCreateFlag === 1) {
        this.handleEditData(data)
      }
    },
    // 调用修改接口
    handleEditData (data) {
      updateInsurace(data).then(res => {
        this.getCategoryList(1, this.pagination.pageSize)
        this.dialogVisible = false
        this.$message({
          type: 'success',
          message: res.message
        })
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 调用添加接口
    handleAddData (data) {
      addInsurace(data).then(res => {
        this.getCategoryList(1, this.pagination.pageSize)
        this.dialogVisible = false
        this.$message({
          type: 'success',
          message: res.message
        })
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 修改弹出框数据处理
    dataBind (params) {
    	// console.log('打开')
    	// console.log(params)
      this.insuranceCategoryInfo.insuranceDeployId = params.insuranceDeployId
      this.insuranceCategoryInfo.iataNo = params.iataNo
      this.insuranceCategoryInfo.officeName = params.officeName
      this.insuranceCategoryInfo.officeCode = params.officeCode
      this.insuranceCategoryInfo.currencyType = params.currencyType
      this.insuranceCategoryInfo.ticketType = params.ticketType
      this.insuranceCategoryInfo.buyNum = params.buyNum
      this.insuranceCategoryInfo.premium = params.premium
      this.insuranceCategoryInfo.repay = params.repay
      this.insuranceCategoryInfo.checkto = params.checkto
      this.insuranceCategoryInfo.carrier = params.carrier
      this.insuranceCategoryInfo.companyCode = params.companyCode
      this.insuranceCategoryInfo.companyName = params.companyName
      this.insuranceCategoryInfo.commissionRate = params.commissionRate
      this.insuranceCategoryInfo.payCode = params.payCode
      this.insuranceCategoryInfo.insuranceType = params.insuranceType
      this.insuranceCategoryInfo.buyFlag = params.buyFlag
      this.insuranceCategoryInfo.insuranceProductCode = params.insuranceProductCode
      this.insuranceCategoryInfo.insuranceProductId = params.insuranceProductId
      this.insuranceCategoryInfo.insuranceProductName = params.insuranceProductName
      this.insuranceCategoryInfo.protocolId = params.protocolId
      this.insuranceCategoryInfo.protocolProductName = params.protocolProductName
      this.insuranceCategoryInfo.userName = params.userName
      this.insuranceCategoryInfo.userPwd = params.userPwd
      this.insuranceCategoryInfo.protocolProductId = params.protocolProductId
      this.insuranceCategoryInfo.channel = params.channel.split(',')
      this.insuranceCategoryInfo.remark = params.remark
      this.insuranceCategoryInfo.insuranceTerm = params.insuranceTerm
      this.insuranceCategoryInfo.excludeCity = params.excludeCity
	    this.insuranceCategoryInfo.faiGid = params.faiGid
	    this.insuranceCategoryInfo.insuranceRemark = params.insuranceRemark
	    this.insuranceCategoryInfo.ageStart = params.ageStart.split('_')[0]
      this.insuranceCategoryInfo.ageStartType = params.ageStart.split('_')[1]
      this.insuranceCategoryInfo.ageEnd = params.ageEnd.split('_')[0]
      this.insuranceCategoryInfo.ageEndType = params.ageEnd.split('_')[1]
	    this.insuranceCategoryInfo
    },
    // 重置弹出框
    handleReset () {
      this.isEmpty = false
      this.readonly = false
      this.insuranceCategoryInfo = {
        iataNo: '',
        officeName: '',
        officeCode: '',
        currencyType: 'CNY',
        ticketType: 'ARL',
        buyNum: '',
        premium: '',
        repay: '',
        checkto: '',
        carrier: 'NS',
        companyCode: '',
        companyName: '',
        commissionRate: '',
        payCode: '',
        insuranceType: '',
        buyFlag: '',
        insuranceProductCode: '',
        insuranceProductId: '',
        insuranceProductName: '',
        protocolId: '',
        protocolProductName: '',
        userName: '',
        userPwd: '',
        protocolProductId: '',
        channel: [],
        remark: '',
        insuranceTerm: '',
        excludeCity: '',
        ageStart: '',
        ageEnd: '',
        insuranceRemark: '',
        ageStartType: '',
        ageEndType: '',
        faiGid: ''
      }
    }
  }
}
</script>

<style scoped>
</style>
