<template>
  <div id="InterRefundRulePre" class="container">
    <!--<h1>国际退改签规则维护</h1>-->
    <div class="header" ref="header">
      <!--搜索框-->
      <div class="search-container clearfix">
        <!--批次号-->
        <div class="search-item search-ipt">
          <el-input v-model="searchForm.ruleCode" clearable placeholder="批次号" size="medium" @keydown.enter.native="interRefundRuleList()"></el-input>
        </div>
        <!--航线-->
        <div class="search-item search-ipt">
          <el-input v-model="searchForm.route" clearable placeholder="航线" size="medium" @keydown.enter.native="interRefundRuleList()"></el-input>
        </div>
        <!--舱位-->
        <div class="search-item search-ipt">
          <el-input v-model="searchForm.cabin" clearable placeholder="舱位" size="medium" @keydown.enter.native="interRefundRuleList()"></el-input>
        </div>
        <!--票价级别-->
        <div class="search-item search-ipt">
          <el-input v-model="searchForm.fbc" clearable placeholder="票价级别" size="medium" @keydown.enter.native="interRefundRuleList()"></el-input>
        </div>
        <!--启用/禁用-->
        <div class="search-item search-ipt">
          <el-select v-model="searchForm.status" placeholder="请选择启用/禁用" clearable size="medium">
            <el-option key="0" label="禁用" value="0"></el-option>
            <el-option key="1" label="启用" value="1"></el-option>
            <el-option key="2" label="全部" value="2"></el-option>
          </el-select>
        </div>
        <!--销售起始日期-->
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.saleStartTimeStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="销售起始时间起">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.saleStartTimeEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="销售起始时间止">
          </el-date-picker>
        </div>
<!--        <div class="search-item fl">-->
<!--          <el-date-picker-->
<!--            unlink-panels-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="saleStartDate"-->
<!--            type="daterange"-->
<!--            range-separator="至"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            start-placeholder="销售起始日期"-->
<!--            end-placeholder="销售起始日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <!--销售截止日期-->
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.saleEndTimeStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="销售截止时间起">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.saleEndTimeEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="销售截止时间止">
          </el-date-picker>
        </div>
<!--        <div class="search-item fl">-->
<!--          <el-date-picker-->
<!--            unlink-panels-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="saleEndDate"-->
<!--            type="daterange"-->
<!--            range-separator="至"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            start-placeholder="销售截止日期"-->
<!--            end-placeholder="销售截止日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <!--航班起始日期-->
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.flightStartTimeStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班起始时间起">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.flightStartTimeEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班起始时间止">
          </el-date-picker>
        </div>
<!--        <div class="search-item fl">-->
<!--          <el-date-picker-->
<!--            unlink-panels-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="flightStartDate"-->
<!--            type="daterange"-->
<!--            range-separator="至"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            start-placeholder="航班起始日期"-->
<!--            end-placeholder="航班起始日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <!--航班截止日期-->
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.flightEndTimeStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班截止时间起">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="searchForm.flightEndTimeEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班截止时间止">
          </el-date-picker>
        </div>
<!--        <div class="search-item fl">-->
<!--          <el-date-picker-->
<!--            unlink-panels-->
<!--            class="date-picker-380"-->
<!--            size="medium"-->
<!--            v-model="flightEndDate"-->
<!--            type="daterange"-->
<!--            range-separator="至"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            start-placeholder="航班截止日期"-->
<!--            end-placeholder="航班截止日期"-->
<!--            align="right">-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <!--查询 / 重置-->
        <div class="search-item search-ipt">
          <el-button size="medium" type="primary" @click="interRefundRuleList(null, null)">查询</el-button>
          <el-button size="medium" @click="handleReset">重置</el-button>
        </div>
      </div>
      <!--功能按钮-->
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit(null)">添加</el-button>
        <el-button type="success" size="medium" :disabled="!tableList.total" @click="handleExport('excel')">导出</el-button>
        <el-button size="medium" @click="handleExport(null)">模板下载</el-button>
        <el-button size="medium" @click="handleUpload">上传规则文件</el-button>
      </div>
      <div v-if="isColumn" class="search-container clearfix flex">
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
    <div class="main">
      <div class="column-btn" @click="switchColumn">
        <i class="el-icon-arrow-up"></i>
      </div>
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="tableList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :cell-style="tableAttributes.cellStyle"
          @selection-change="handleSelectionChange">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="票价级别">
                  <span>{{ props.row.fbc }}</span>
                </el-form-item>
                <el-form-item label="计划离站时间前">
                  <span>{{ props.row.timeLimit }}</span>
                </el-form-item>
                <el-form-item label="币种">
                  <span>{{ props.row.currency }}</span>
                </el-form-item>
                <el-form-item label="计划离站时间前退票手续费">
                  <span>{{ props.row.befreFee }}</span>
                </el-form-item>
                <el-form-item label="计划离站时间后退票手续费">
                  <span>{{ props.row.afterFee }}</span>
                </el-form-item>
                <el-form-item label="燃油是否可退">
                  <span v-if="props.row.isrefundtax === '0'">否</span>
                  <span v-else>是</span>
                </el-form-item>
                <el-form-item label="托运行李额">
                  <span>{{ props.row.consignmentWeight }}</span>
                </el-form-item>
                <el-form-item label="自提行李额">
                  <span>{{ props.row.selfWeight }}</span>
                </el-form-item>
                <el-form-item label="是否可变更">
                  <span v-if="props.row.iscanchange === '0'">否</span>
                  <span v-else>是</span>
                </el-form-item>
                <el-form-item label="创建时间">
                <span>{{ props.row.createDate }}</span>
              </el-form-item>
                <el-form-item label="创建人">
                  <span>{{ props.row.createOpid }}</span>
                </el-form-item>
                <el-form-item label="修改时间">
                  <span>{{ props.row.modifyDate }}</span>
                </el-form-item>
                <el-form-item label="修改人">
                  <span>{{ props.row.modifyOpid }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
          <el-table-column v-if="tableListColumn.ruleCode" label="批次号" prop="ruleCode" min-width="100"></el-table-column>
          <el-table-column v-if="tableListColumn.channel" label="生效渠道" prop="channel" min-width="180">
            <template slot-scope="scope">
              <div>{{scope.row.channel | channelMap}}</div>
            </template>
          </el-table-column>
          <el-table-column v-if="tableListColumn.route" label="航线" prop="route" min-width="80"></el-table-column>
          <el-table-column v-if="tableListColumn.aircode" label="航空公司" prop="aircode" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.aircode === 'NS'">河北航空</div>
            </template>
          </el-table-column>
          <el-table-column v-if="tableListColumn.airtype" label="航程类型" prop="airtype" min-width="80">
            <template slot-scope="scope">
              <div v-if="scope.row.airtype === 'OW'">单程</div>
              <div v-if="scope.row.airtype === 'RT'">往返</div>
            </template>
          </el-table-column>
          <el-table-column v-if="tableListColumn.cabin" label="舱位" prop="cabin" min-width="60"></el-table-column>
          <el-table-column v-if="tableListColumn.saleStartTime" label="销售起始日期" prop="saleStartTime" min-width="120"></el-table-column>
          <el-table-column v-if="tableListColumn.saleEndTime" label="销售截止日期" prop="saleEndTime" min-width="120"></el-table-column>
          <el-table-column v-if="tableListColumn.flightStartTime" label="航班起始日期" prop="flightStartTime" min-width="120"></el-table-column>
          <el-table-column v-if="tableListColumn.flightEndTime" label="航班截止日期" prop="flightEndTime" min-width="120"></el-table-column>
          <el-table-column v-if="tableListColumn.noshowfee" label="误机费" prop="noshowfee">
            <template slot-scope="scope">
              {{scope.row.noshowfee | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column v-if="tableListColumn.partsusefee" label="部分使用退票费" prop="partsusefee" min-width="120">
            <template slot-scope="scope">
              {{scope.row.partsusefee | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column v-if="tableListColumn.standard" label="舱位标准价" prop="standard" min-width="100">
            <template slot-scope="scope">
              {{scope.row.standard | formatPriceMap}}
            </template>
          </el-table-column>
          <el-table-column v-if="tableListColumn.fbc" label="票价级别" prop="fbc"></el-table-column>
          <el-table-column v-if="tableListColumn.timeLimit" prop="timeLimit" label="计划离站时间前" min-width="120"></el-table-column>
          <el-table-column v-if="tableListColumn.currency" prop="currency" label="币种"></el-table-column>
          <el-table-column v-if="tableListColumn.befreFee" prop="befreFee" label="计划离站时间前退票手续费" min-width="180"></el-table-column>
          <el-table-column v-if="tableListColumn.afterFee" prop="afterFee" label="计划离站时间后退票手续费" min-width="180"></el-table-column>
          <el-table-column v-if="tableListColumn.isrefundtax" prop="isrefundtax" label="燃油是否可退" min-width="120">
            <template slot-scope="scope">
              <span v-show="scope.row.isrefundtax === '0'">否</span>
              <span v-show="scope.row.isrefundtax === '1'">是</span>
            </template>
          </el-table-column>
          <el-table-column v-if="tableListColumn.consignmentWeight" prop="consignmentWeight" label="托运行李额" min-width="120"></el-table-column>
          <el-table-column v-if="tableListColumn.selfWeight" prop="selfWeight" label="自提行李额" min-width="120"></el-table-column>
          <el-table-column v-if="tableListColumn.iscanchange" prop="iscanchange" label="是否可变更" min-width="120">
            <template slot-scope="scope">
              <span v-show="scope.row.iscanchange === '0'">否</span>
              <span v-show="scope.row.iscanchange === '1'">是</span>
            </template>
          </el-table-column>
          <el-table-column v-if="tableListColumn.createDate" prop="createDate" label="创建时间" min-width="160"></el-table-column>
          <el-table-column v-if="tableListColumn.createOpid" prop="createOpid" label="创建人" min-width="160"></el-table-column>
          <el-table-column v-if="tableListColumn.modifyDate" prop="modifyDate" label="修改时间" min-width="160"></el-table-column>
          <el-table-column v-if="tableListColumn.modifyOpid" prop="modifyOpid" label="修改人" min-width="140"></el-table-column>
          <el-table-column label="操作" min-width="140" v-if="checked.length">
            <template slot-scope="scope">
              <span class="active-text mr-5" title="禁用" v-if="scope.row.status === '0'" @click="handleState(scope.row.status, scope.row.feeId)">启用</span>
              <span class="active-text mr-5" title="启用" v-if="scope.row.status === '1'" @click="handleState(scope.row.status, scope.row.feeId)">禁用</span>
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
              <span class="active-text mr-5" title="详情" @click="handleDetail(scope.row)">详情</span>
              <!--<i class="table-icon disable-icon" @click="handleState(scope.row.status, scope.row.feeId)" v-if="scope.row.status === '0'" title="禁用"></i>-->
              <!--<i class="table-icon enable-icon" @click="handleState(scope.row.status, scope.row.feeId)" v-if="scope.row.status === '1'" title="启用"></i>-->
              <!--<i class="table-icon delete-icon" title="删除" @click="handleDelete(scope.row.feeId)"></i>-->
              <!--<i class="table-icon edit-icon" title="编辑" @click="handleEdit(scope.row)"></i>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pagination">
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
    <!--编辑弹出框-->
    <el-dialog :title="popupTitle" :visible.sync="editVisible" width="1060px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">批次号</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="请输入批次号" v-model="editForm.ruleCode" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.ruleCode">批次号不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">生效渠道</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.channel" placeholder="请选择渠道编号" multiple size="medium" collapse-tags>
                  <el-option v-for="item in channelList" :key="item.chalId" :value="item.chalCode" :label="item.chalName"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.channel.length">渠道编号不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">航线</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="请输入航线" v-model="editForm.route" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.route">航线不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">航程类型</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.airtype" placeholder="请选择航程类型" size="medium">
                  <el-option key="0" label="单程" value="OW"></el-option>
                  <el-option key="1" label="往返" value="RT"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.airtype">航程类型选择不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">票价级别</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="请输入票价级别" v-model="editForm.fbc" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.fbc">票价级别内容不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">舱位</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="请输入舱位" v-model="editForm.cabin" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.cabin">舱位内容不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">误机费</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="请输入误机费" v-model="editForm.noshowfee" size="medium"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.noshowfee">误机费不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">燃油是否可退</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.isrefundtax" placeholder="请选择燃油是否可退" size="medium">
                  <el-option key="0" label="否" value="0"></el-option>
                  <el-option key="1" label="是" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.isrefundtax">燃油是否可退不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">销售起始日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  placeholder="销售起始日"
                  value-format="yyyy-MM-dd"
                  v-model="editForm.saleStartTime">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.saleStartTime">销售截止日期不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">销售截止日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  placeholder="销售截止日"
                  value-format="yyyy-MM-dd"
                  v-model="editForm.saleEndTime">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.saleEndTime">销售截止日期不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">航班起始日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  placeholder="航班起始日期"
                  value-format="yyyy-MM-dd"
                  v-model="editForm.flightStartTime">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.flightStartTime">航班起始日期不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">航班截止日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  placeholder="航班截止日期"
                  value-format="yyyy-MM-dd"
                  v-model="editForm.flightEndTime">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.flightEndTime">航班截止日期不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">部分使用退票费用</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="默认为不可退，0为不收取" v-model="editForm.partsusefee" size="medium"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">托运行李额</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="请输入托运行李额" v-model="editForm.consignmentWeight" size="medium" style="width: 180px;"></el-input>
                <div class="fr" style="padding-top: 8px">KG</div>
              </div>
            </div>
            <div class="column">
              <div class="label">自提行李额</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="请输入自提行李额" v-model="editForm.selfWeight" size="medium" style="width: 180px;"></el-input>
                <div class="fr" style="padding-top: 8px">KG</div>
              </div>
            </div>
            <div class="column">
              <div class="label">币种</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="请输入币种" v-model="editForm.currency" size="medium" width="130"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">是否可变更</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.iscanchange" placeholder="请选择是否可变更" size="medium">
                  <el-option key="0" label="否" value="0"></el-option>
                  <el-option key="1" label="是" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.iscanchange">是否可变更不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">计划离站时间前</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="请输入计划离站时间前" v-model="editForm.timeLimit" size="medium" width="130"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.timeLimit">计划离站时间前不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">舱位标准价</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="请输入舱位标准价" v-model="editForm.standard" size="medium" width="130"></el-input>
<!--                <div class="warning-info" v-if="isEmpty && !editForm.standard">舱位标准价不可为空</div>-->
              </div>
            </div>
            <div class="column">
              <div class="label">计划离站时间后退票手续</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="默认为不可退，0为不收取" v-model="editForm.afterFee" size="medium" width="130"></el-input>
<!--                <div class="warning-info" v-if="isEmpty && !editForm.afterFee">计划离站时间后退票手续不可为空</div>-->
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">计划离站时间前退票手续</div>
              <div class="ipt-medium">
                <el-input type="text" clearable placeholder="默认为不可退，0为不收取" v-model="editForm.befreFee" size="medium" width="130"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.befreFee">计划离站时间前不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">退票文本</div>
              <div class="ipt-medium">
                <el-input type="textarea" :rows="3" clearable placeholder="请输入退票文本" v-model="editForm.remark" size="medium" width="130"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">改期文本</div>
              <div class="ipt-medium">
                <el-input type="textarea" :rows="3" clearable placeholder="请输入改期文本" v-model="editForm.changeRemark" size="medium" width="130"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">行李额文本</div>
              <div class="ipt-medium">
                <el-input type="textarea" :rows="3" clearable placeholder="请输入行李额文本" v-model="editForm.baggageAmountRemark" size="medium" width="130"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">规则启用禁用</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.status" placeholder="请选择规则启用禁用" size="medium">
                  <el-option key="0" label="否" value="0"></el-option>
                  <el-option key="1" label="是" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.status">规则启用禁用不可为空</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <!--<el-button size="medium" type="primary" @click="saveEdit">{{isReset ? '提交' : '编辑'}}</el-button>-->
          <el-button size="medium" type="primary" @click="saveEdit">提交</el-button>
          <el-button size="medium" v-if="isReset" @click="resetEdit">重置</el-button>
          <el-button size="medium" @click="editVisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <!--上传规则文件弹出框-->
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
    <!--详情弹出框-->
    <el-dialog title="详情" :visible.sync="detailVisible" width="500px">
      <div class="dialog-container">
        <div class="rule-main">
          <div class="row rule">
            <div class="title">退票规则:</div>
            <div class="content">
              {{editForm.remark}}
            </div>
          </div>
          <div class="row rule">
            <div class="title">改期规则:</div>
            <div class="content">
              {{editForm.changeRemark}}
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import templateList from './data'
import { queryInterRefundRule, addInterRefundRule, updateInterRefundRule, validityInterRefund, importRule } from './api'
import { computeTableHeight, getChannelList, excelList, getRouteName, getDynamicTableCulmae } from '../../../utils/index'
import fieldMap from './refer'
import { checkAttrs } from '../../../mixins'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'InterRefundRulePre',
  data () {
    return {
      componentName: 'interRefundRulePre',
      checkList: fieldMap,
      isColumn: true,
      checked: [],
      checkedAll: false,
      isIndeterminate: false,
      tableListColumn: {
        ruleCode: true,
        channel: true,
        route: true,
        aircode: true,
        fbc: true,
        airtype: true,
        cabin: true,
        timeLimit: true,
        saleStartTime: false,
        saleEndTime: false,
        flightStartTime: false,
        flightEndTime: false,
        currency: false,
        befreFee: false,
        afterFee: false,
        noshowfee: false,
        partsusefee: false,
        standard: false,
        isrefundtax: false,
        consignmentWeight: false,
        selfWeight: false,
        iscanchange: false,
        createDate: false,
        createOpid: false,
        modifyDate: false,
        modifyOpid: false
      },
      searchForm: {
        ruleCode: '', // 批次号
        route: '', // 航线
        cabin: '', // 舱位
        fbc: '', // 票价级别
        status: '2', // 禁用/启用
        saleStartTimeStart: '', // 销售起始日期 -- 开始时间段
        saleStartTimeEnd: '', // 销售起始日期 -- 结束时间段
        saleEndTimeStart: '', // 销售截止日期 -- 开始时间段
        saleEndTimeEnd: '', // 销售截止日期 -- 结束时间段
        flightStartTimeStart: '', // 航班起始日期 -- 开始时间段
        flightStartTimeEnd: '', // 航班起始日期 -- 结束时间段
        flightEndTimeStart: '', // 航班截止日期 -- 开始时间段
        flightEndTimeEnd: '' // 航班截止日期 -- 结束时间段
      }, // 搜索框 -- 数据
      saleStartDate: [], // 搜索框 -- 销售起始日期
      saleEndDate: [], // 搜索框 -- 销售截止日期
      flightStartDate: [], // 搜索框 -- 航班起始日期
      flightEndDate: [], // 搜索框 -- 航班截止日期
      tableList: {}, // 表格 -- 数据
      multipleSelection: [], // 表格 -- 选择项
      dataViewHeight: null, // 表格 -- 高度
      loading: false, // 表格 -- 数据加载时显示的动效
      importVisible: false, // 导入弹出框 -- 显示隐藏
      detailVisible: false, // 详情弹出框 -- 显示隐藏
      editVisible: false, // 添加/修改弹出框 -- 显示隐藏
      isReset: false, // 添加/修改弹出框 -- 切换添加/修改
      isEmpty: false, // 添加/修改弹出框 -- 判空
      editForm: {
        feeId: '',
        aircode: '',
        ruleCode: '', // 批次号
        route: '', // 航线
        fbc: '', // 票价级别
        saleStartTime: '', // 销售起始日期
        flightStartTime: '', // 销售截止日期
        noshowfee: '', // 误机费
        partsusefee: '', // 部分使用退票费
        selfWeight: '', // 自提行李额
        iscanchange: '', // 是否可变更
        standard: '', // 舱位标准价
        befreFee: '', // 计划离站时间前退票手续费
        remark: '', // 退票文本
        baggageAmountRemark: '', // 行李额文本
        channel: [], // 生效渠道
        airtype: '', // 航程类型
        cabin: '', // 舱位
        saleEndTime: '', // 销售截止日期
        flightEndTime: '', // 航班截止日期
        isrefundtax: '', // 燃油是否可退
        consignmentWeight: '', // 托运行李额
        currency: 'CNY', // 币种
        timeLimit: '', // 计划离站时间前
        afterFee: '', // 计划离站时间后退票手续费
        status: '', // 启用/禁用
        changeRemark: '' // 改期文本
      }, // 添加/修改弹出框 -- 数据
      popupTitle: '', // 添加/修改弹出框 -- 标题
      templateList: templateList, // 导出 -- 模板数据
      fileList: [],
      filepath: ''
    }
  },
  created () {
    this.getChannelList()
    this.interRefundRuleList(1, this.pagination.pageSize)
  },
  mixins: [checkAttrs, computWidth],
  computed: {
    ...mapState({
      channelList: state => state.app.channelList, // 渠道
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      baseUrl: state => state.app.baseUrl
    })
  },
  methods: {
    switchColumn () {
      this.isColumn = !this.isColumn
      this.$nextTick(function () {
        this.dataViewHeight = computeTableHeight(this, 'header')
      })
    },
    locCheck () {
      //  如果本地有就取本地的
      if (getDynamicTableCulmae('interRefundRulePre').length) {
        this.checked = getDynamicTableCulmae('interRefundRulePre')
        if (this.checked.length === this.tableListColumn.length) {
          this.checkedAll = true
        }
        for (let item in this.tableListColumn) {
          if (this.checked.indexOf(item) !== -1) {
            this.tableListColumn[item] = true
          } else {
            this.tableListColumn[item] = false
          }
        }
      } else {
        for (let i = 0; i < this.checkList.length; i++) {
          if (this.checkList[i].flag) {
            this.checked.push(this.checkList[i].key)
            this.tableListColumn[this.checkList[i].key] = true
          }
        }
      }
    },
    //   动态加载表格
    checkHanler (val) {
      if (val) {
        this.checked = this.checkList.map((item) => {
          return item.key
        })
        for (let item in this.tableListColumn) {
          this.tableListColumn[item] = true
        }
      } else {
        this.checked = []
        for (let item in this.tableListColumn) {
          this.tableListColumn[item] = false
        }
      }
    },
    //  全选框
    handleCheck (value) {
      let checkLength = value.length
      this.checkedAll = checkLength === this.checkList.length
    },
    //  表格checkbox单选框
    handleoneCheck (key) {
      let flag = this.tableListColumn[key]
      if (flag) {
        for (let i = 0; i < this.checked.length; i++) {
          if (this.checked[i] === key) {
            this.checked.splice(i, 1)
          }
        }
      }
      this.tableListColumn[key] = flag ? this.tableListColumn[key] = false : this.tableListColumn[key] = true
    },
    // 渠道 -- 没有则请求服务器
    getChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 搜索框 -- 重置
    handleReset () {
      this.searchForm = {
        status: '2'
      }
      this.saleStartDate = []
      this.saleEndDate = []
      this.flightStartDate = []
      this.flightEndDate = []
      this.interRefundRuleList(1, this.pagination.pageSize)
    },
    // 表格 -- 分页导航
    handleSizeChange (pages) {
      this.interRefundRuleList(null, pages)
    },
    handleCurrentChange (page) {
      this.interRefundRuleList(page, null)
    },
    // 表格 -- 选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 表格 -- 获取数据
    interRefundRuleList (page, pageSize) {
      this.loading = true
      this.searchForm.page = page || 1
      if (pageSize) this.searchForm.rows = pageSize
      // this.handleDate()
      queryInterRefundRule(this.searchForm).then(res => {
        this.tableList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 表格 -- 入参日期处理
    handleDate () {
      // 销售起始日期
      if (this.saleStartDate && this.saleStartDate.length) {
        this.searchForm.saleStartTimeStart = this.saleStartDate[0]
        this.searchForm.saleStartTimeEnd = this.saleStartDate[1]
      } else {
        delete this.searchForm.saleStartTimeStart
        delete this.searchForm.saleStartTimeEnd
      }
      // 销售截止日期
      if (this.saleEndDate && this.saleEndDate.length) {
        this.searchForm.saleEndTimeStart = this.saleEndDate[0]
        this.searchForm.saleEndTimeEnd = this.saleEndDate[1]
      } else {
        delete this.searchForm.saleEndTimeStart
        delete this.searchForm.saleEndTimeEnd
      }
      // 航班起始日期
      if (this.flightStartDate && this.flightStartDate.length) {
        this.searchForm.flightStartTimeStart = this.flightStartDate[0]
        this.searchForm.flightStartTimeEnd = this.flightStartDate[1]
      } else {
        delete this.searchForm.flightStartTimeStart
        delete this.searchForm.flightStartTimeEnd
      }
      // 航班截止日期
      if (this.flightEndDate && this.flightEndDate.length) {
        this.searchForm.flightEndTimeStart = this.flightEndDate[0]
        this.searchForm.flightEndTimeEnd = this.flightEndDate[1]
      } else {
        delete this.searchForm.flightEndTimeStart
        delete this.searchForm.flightEndTimeEnd
      }
    },
    // 表格 -- 禁用/启用状态更改
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
        validityInterRefund({
          id: id,
          status: status === '0' ? '1' : '0'
        }).then(res => {
          this.$message.success(res.message)
          this.interRefundRuleList(1, this.pagination.pageSize)
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消修改')
      })
    },
    // 表格 -- 导出Excel文件 / 模板下载
    handleExport (str) {
      if (str === 'excel') {
        let params = {
          data: JSON.parse(JSON.stringify(this.searchForm)),
          url: 'refund/exportRule',
          name: getRouteName('/interRefundRulePre'),
          type: 'xls',
          total: this.tableList.total
        }
        params.data.start = 1
        params.data.end = this.tableList.total
        delete params.data.page
        delete params.data.rows
        excelList(params)
      } else {
        window.location.href = this.baseUrl + 'js/xlstemplate/interRefundRulePreTemplate.xls'
      }
    },
    // 上传规则文件
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
      importRule(data).then(res => {
        this.$message.success(res.message)
        this.importVisible = false
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 添加/修改弹出框 -- 显示
    handleEdit (params) {
      this.editVisible = true
      if (params) {
        this.popupTitle = '修改'
        this.isReset = false
        this.dataBind(params)
      } else {
        this.popupTitle = '添加'
        this.resetEdit()
        this.isReset = true
      }
    },
    // 添加/修改弹出框 -- 提交
    saveEdit () {
      if (this.editForm.ruleCode && this.editForm.route &&
        this.editForm.fbc && this.editForm.saleStartTime &&
        this.editForm.flightStartTime && this.editForm.noshowfee &&
        this.editForm.channel.length && this.editForm.airtype &&
        this.editForm.cabin && this.editForm.saleEndTime &&
        this.editForm.flightEndTime && this.editForm.flightStartTime &&
        this.editForm.timeLimit && this.editForm.iscanchange &&
        this.editForm.status) {
        let data = JSON.parse(JSON.stringify(this.editForm))
        if (data.channel.length) {
          data.channel = data.channel.join(',')
        }
        if (this.isReset === false) {
          updateInterRefundRule(data).then(res => {
            this.editVisible = false
            this.interRefundRuleList(1, this.pagination.pageSize)
            this.$message.success(res.message)
          }).catch(err => {
            this.$message.error(err.message)
          })
        } else {
          addInterRefundRule(data).then(res => {
            this.editVisible = false
            this.interRefundRuleList(1, this.pagination.pageSize)
            this.$message.success(res.message)
          }).catch(err => {
            this.$message.error(err.message)
          })
        }
      } else {
        this.isEmpty = true
      }
    },
    // 添加/修改弹出框 -- 重置
    resetEdit () {
      this.editForm = {
        feeId: '',
        aircode: '',
        ruleCode: '',
        route: '',
        fbc: '',
        saleStartTime: '',
        flightStartTime: '',
        noshowfee: '',
        partsusefee: '',
        selfWeight: '',
        iscanchange: '',
        standard: '',
        befreFee: '',
        remark: '',
        baggageAmountRemark: '',
        channel: [],
        airtype: '',
        cabin: '',
        saleEndTime: '',
        flightEndTime: '',
        isrefundtax: '',
        consignmentWeight: '',
        currency: 'CNY',
        timeLimit: '',
        afterFee: '',
        status: '',
        changeRemark: ''
      }
      this.isEmpty = false
    },
    // 详情弹出框 -- 显示
    handleDetail (params) {
      // console.log(params)
      this.detailVisible = true
      // console.log(params)
      // this.dataBind(params)
    },
    // 添加/修改弹出框 -- 数据处理
    dataBind (params) {
      this.editForm.feeId = params.feeId
      this.editForm.aircode = params.aircode
      this.editForm.ruleCode = params.ruleCode
      this.editForm.route = params.route
      this.editForm.fbc = params.fbc
      this.editForm.saleStartTime = params.saleStartTime
      this.editForm.flightStartTime = params.flightStartTime
      this.editForm.noshowfee = params.noshowfee
      this.editForm.partsusefee = params.partsusefee
      this.editForm.selfWeight = params.selfWeight
      this.editForm.iscanchange = params.iscanchange
      this.editForm.standard = params.standard
      this.editForm.befreFee = params.befreFee
      this.editForm.remark = params.remark
      this.editForm.baggageAmountRemark = params.baggageAmountRemark
      this.editForm.channel = params.channel.split(',')
      this.editForm.airtype = params.airtype
      this.editForm.cabin = params.cabin
      this.editForm.saleEndTime = params.saleEndTime
      this.editForm.flightEndTime = params.flightEndTime
      this.editForm.isrefundtax = params.isrefundtax
      this.editForm.consignmentWeight = params.consignmentWeight
      this.editForm.currency = params.currency
      this.editForm.timeLimit = params.timeLimit
      this.editForm.afterFee = params.afterFee
      this.editForm.status = params.status
      this.editForm.changeRemark = params.changeRemark
    }
  }
}
</script>

<style scoped lang="scss">
  .rule-main{
    padding: 10px 0 30px;
  }
  .rule{
    padding: 0 50px 20px 50px;
    text-align: center;
  }
</style>
