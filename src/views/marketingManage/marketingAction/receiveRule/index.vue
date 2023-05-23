<template>
<!--  <div>领用规则</div>-->
  <div id="ReceiveRule" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="适用出发地" v-model="filter.afrom" @keydown.enter.native="getSaleReceiveRuleList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="适用目的地" v-model="filter.ato" @keydown.enter.native="getSaleReceiveRuleList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="适用航班号" v-model="filter.flightNo" @keydown.enter.native="getSaleReceiveRuleList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="领用规则名称" v-model="filter.receiveName" @keydown.enter.native="getSaleReceiveRuleList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="领用规则编号" v-model="filter.receiveCode" @keydown.enter.native="getSaleReceiveRuleList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="领用渠道" v-model="filter.channel" @keydown.enter.native="getSaleReceiveRuleList()">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="活动编号" v-model="filter.activityCode" @keydown.enter.native="getSaleReceiveRuleList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="优惠类型" v-model="filter.saleType" @keydown.enter.native="getSaleReceiveRuleList()">
            <el-option label="礼包" value="0"></el-option>
            <el-option label="单券" value="1"></el-option>
            <el-option label="积分" value="2"></el-option>
            <el-option label="返现" value="3"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.startFdate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班日期开始">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.endFdtae"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班日期结束">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.createDateStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="创建日期开始">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.createDateEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="创建日期结束">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="启用状态" v-model="filter.receiveStatus"  @keydown.enter.native="getSaleReceiveRuleList()">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getSaleReceiveRuleList()">查询</el-button>
          <el-button size="medium" @click="resetEdit()">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit()">添加</el-button>
        <el-button type="success" size="medium" :disabled="useRuleList.total === 0" @click="handleExport()">导出</el-button>
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
          :data="useRuleList.rows"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
          <el-table-column key="1" label="领用规则编号" v-if="tableList.receiveCode" prop="receiveCode" min-width="140">
            <template slot-scope="scope">
              <div class="active-text" @click="switchDialog('rule', scope.row.receiveId)">{{scope.row.receiveCode}}</div>
            </template>
          </el-table-column>
          <el-table-column key="2" label="领用规则名称" v-if="tableList.receiveName" prop="receiveName" min-width="140"></el-table-column>
          <el-table-column key="3" label="活动编号" v-if="tableList.activityCode" prop="activityCode" min-width="120">
            <template slot-scope="scope">
              <div class="active-text" @click="switchDialog('activity', scope.row.activityId)">{{scope.row.activityCode}}</div>
            </template>
          </el-table-column>
          <el-table-column key="4" label="活动名称" v-if="tableList.activityName" prop="activityName" min-width="140"></el-table-column>
          <el-table-column key="5" label="领用渠道" v-if="tableList.channel" prop="channel" min-width="140">
            <template slot-scope="scope">
                <span v-if="scope.row.channel && scope.row.channel !== 'null'">
                  {{scope.row.channel | channelMap}}
                </span>
              <span v-else>全渠道</span>
            </template>
          </el-table-column>
          <el-table-column key="6" label="参与数目" v-if="tableList.totalNum" prop="totalNum" min-width="100"></el-table-column>
          <el-table-column key="7" label="优惠类型" v-if="tableList.saleType" prop="saleType" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.saleType && scope.row.saleType !== 'null'">
                  {{scope.row.saleType | saleTypeMap}}
                </span>
            </template>
          </el-table-column>
          <el-table-column key="8" label="模板名称" v-if="tableList.templetName" prop="templetName" min-width="140"></el-table-column>
          <el-table-column key="9" label="领取类型" v-if="tableList.receiveType" prop="receiveType" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.receiveType === '0'">自然日</span>
              <span v-if="scope.row.receiveType === '1'">活动期内</span>
            </template>
          </el-table-column>
          <el-table-column key="10" label="间隔时间" v-if="tableList.intervalTime" prop="intervalTime" min-width="100"></el-table-column>
          <el-table-column key="11" label="渠道数量限制" v-if="tableList.channelNum" prop="channelNum" min-width="120"></el-table-column>
          <el-table-column key="12" label="渠道金额限制" v-if="tableList.channelMoney" prop="channelMoney" min-width="120"></el-table-column>
          <el-table-column key="13" label="航班日期开始" v-if="tableList.startFdate" prop="startFdate" min-width="120"></el-table-column>
          <el-table-column key="14" label="航班日期结束" v-if="tableList.endFdtae" prop="endFdtae" min-width="120"></el-table-column>
          <el-table-column key="15" label="排除航班日期" v-if="tableList.fdateDisable" prop="fdateDisable" min-width="200"></el-table-column>
          <el-table-column key="16" label="适用出发地" v-if="tableList.afrom" prop="afrom" min-width="100"></el-table-column>
          <el-table-column key="17" label="适用目的地" v-if="tableList.ato" prop="ato" min-width="100"></el-table-column>
          <el-table-column key="18" label="适用航班号" v-if="tableList.flightNo" prop="flightNo" min-width="100"></el-table-column>
          <el-table-column key="19" label="适用舱位" v-if="tableList.cabin" prop="cabin" min-width="120"></el-table-column>
          <el-table-column key="20" label="排除适用舱位" v-if="tableList.cabinDisable" prop="cabinDisable" min-width="120"></el-table-column>
          <el-table-column key="21" label="票价上限" v-if="tableList.pmPriceLimitUp" prop="pmPriceLimitUp" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.pmPriceLimitUp && scope.row.pmPriceLimitUp !== 0">{{scope.row.pmPriceLimitUp}}</span>
                <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column key="22" label="票价下限" v-if="tableList.pmPriceLimitDown" prop="pmPriceLimitDown" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.pmPriceLimitDown && scope.row.pmPriceLimitDown !== 0">{{scope.row.pmPriceLimitDown}}</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column key="23" label="是否实名认证" v-if="tableList.authCheck" prop="authCheck" min-width="120">
            <template slot-scope="scope">
                <span v-if="scope.row.authCheck && scope.row.authCheck !== 'null'">
                  {{scope.row.authCheck | authCheckMap}}
                </span>
            </template>
          </el-table-column>
          <el-table-column key="24" label="是否常旅客" v-if="tableList.ffpCheck" prop="ffpCheck" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.ffpCheck === '2'">不限</span>
              <span v-if="scope.row.ffpCheck === '0'">否</span>
              <span v-if="scope.row.ffpCheck === '1'">是</span>
            </template>
          </el-table-column>
          <el-table-column key="25" label="常旅客级别" v-if="tableList.ffpLevel" prop="ffpLevel" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.ffpLevel | levelName }}</span>
            </template>
          </el-table-column>
          <el-table-column key="26" label="支付方式限制" v-if="tableList.payMethod" prop="payMethod" min-width="160">
            <template slot-scope="scope">
                <span v-if="scope.row.payMethod && scope.row.payMethod !== 'null'">
                  {{scope.row.payMethod | payLimitMap}}
                </span>
            </template>
          </el-table-column>
          <el-table-column key="27" label="领用备注" v-if="tableList.receiveRemark" prop="receiveRemark" min-width="160"></el-table-column>
          <el-table-column key="28" label="领取通知" v-if="tableList.receiveNotice" prop="receiveNotice" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.receiveNotice === '0'">无</span>
              <span v-if="scope.row.receiveNotice === '1'">短信</span>
              <span v-if="scope.row.receiveNotice === '2'">推送</span>
              <span v-if="scope.row.receiveNotice === '12'">短信+推送</span>
            </template>
          </el-table-column>
          <el-table-column key="29" label="启用状态" v-if="tableList.receiveStatus" prop="receiveStatus" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.receiveStatus === '0'">禁用</span>
              <span v-if="scope.row.receiveStatus === '1'">启用</span>
            </template>
          </el-table-column>
          <el-table-column key="30" label="创建时间" v-if="tableList.createTime" prop="createTime" min-width="160"></el-table-column>
          <el-table-column key="31" label="领取产品标识" v-if="tableList.productid" prop="productid" min-width="120"></el-table-column>
          <el-table-column key="32" label="领取数量" v-if="tableList.applyCount" prop="applyCount" min-width="100"></el-table-column>
          <el-table-column key="33" label="创建人姓名" v-if="tableList.createOpName" prop="createOpName" min-width="120"></el-table-column>
          <el-table-column label="操作" min-width="160" v-if="checked.length">
            <template slot-scope="scope">
              <span class="active-text mr-5" @click='handleStatus(scope.row.receiveId, scope.row.receiveStatus)' v-if="scope.row.receiveStatus === '1'" title="启用">禁用</span>
              <span class="active-text mr-5" @click='handleStatus(scope.row.receiveId, scope.row.receiveStatus)' v-if="scope.row.receiveStatus === '0'" title="禁用">启用</span>
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
              <span class="active-text mr-5" title="变更日志" @click="handleLogChange(scope.row.receiveId)">变更日志</span>
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
            :total="useRuleList.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--新增、修改弹出框-->
    <el-dialog v-dialogDrag :title="popupTitle" :visible.sync="editVisible" width="1060px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">活动名称</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.activityId" placeholder="请选择活动名称类型" size="medium">
                  <el-option v-for="item in activityTypeList" :key="item.activityId" :value="item.activityId" :label="item.activityName"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.activityId">活动名称不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">优惠类型</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.saleType" placeholder="请选择优惠类型" size="medium" @change="isChange($event)">
                  <el-option key="0" label="礼包" value="0"></el-option>
                  <el-option key="1" label="单券" value="1"></el-option>
                  <el-option key="2" label="积分" value="2"></el-option>
                  <el-option key="3" label="返现" value="3"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.saleType">优惠类型不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">优惠券模板</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.templetId" size='medium' placeholder="优惠券模板" :disabled="editForm.saleType !== '1'">
                  <el-option v-for="item in couponTempletTypeList" :key="item.templetId" :value="item.templetId" :label="item.templetName"></el-option>
                </el-select>
                <div class="warning-info" v-if="isShow && !editForm.templetId && editForm.saleType === '1'">优惠券模版不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">领取类型</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.receiveType" placeholder="请选择领取类型" size="medium">
                  <el-option key="0" label="自然日" value="0"></el-option>
                  <el-option key="1" label="活动期内" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.receiveType">领取类型不可为空</div>
              </div>
            </div>

          </div>
          <div class="row">
            <div class="column">
              <div class="label required">领用渠道</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.channel" placeholder="请选择渠道类型" size="medium" clearable multiple collapse-tags>
                  <el-option v-for="item in channelList" :key="item.chalId" :value="item.chalCode" :label="item.chalName"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && editForm.channel.length === 0">渠道类型不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">启用状态</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.receiveStatus" placeholder="请选择启用状态" size="medium">
                  <el-option label="禁用" value="0"></el-option>
                  <el-option label="启用" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.receiveStatus">启用状态不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">领用规则名称</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="领用规则名称" clearable v-model="editForm.receiveName"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.receiveName">领用规则名称不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">领用规则编号</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="领用规则编号" clearable v-model="editForm.receiveCode"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.receiveCode">领用规则编号不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">参与数目</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="参与数目" clearable v-model="editForm.totalNum"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.totalNum">参与数目不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">领取数量</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="领取数量" clearable v-model="editForm.applyCount"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.applyCount">领取数量不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">航班日期开始</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  value-format="yyyy-MM-dd"
                  placeholder="航班日期开始"
                  v-model="editForm.startFdate">
                </el-date-picker>
              </div>
            </div>
            <div class="column">
              <div class="label">航班日期结束</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  value-format="yyyy-MM-dd"
                  placeholder="航班日期结束"
                  v-model="editForm.endFdtae">
                </el-date-picker>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">渠道数量限制</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="渠道数量限制" clearable v-model="editForm.channelNum"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">渠道金额限制</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="渠道金额限制" clearable v-model="editForm.channelMoney"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">票价上限</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="票价上限" clearable v-model="editForm.pmPriceLimitUp"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">票价下限</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="票价下限" clearable v-model="editForm.pmPriceLimitDown"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">支付方式限制</div>
              <div class="ipt-medium">
                <el-select size="medium" placeholder="支付方式限制" v-model="editForm.payMethod" clearable multiple collapse-tags>
                  <el-option key="0" label="微信" value="weixin"></el-option>
                  <el-option key="1" label="支付宝" value="alipay"></el-option>
                  <el-option key="2" label="银联云闪付" value="unionpay"></el-option>
                  <el-option key="3" label="Apple Pay" value="applepay"></el-option>
                  <el-option key="4" label="安卓PAY" value="unionpayse"></el-option>
                  <el-option key="5" label="微信支付网页版" value="weixin_h5"></el-option>
                  <el-option key="6" label="支付宝网页版" value="alipay_h5"></el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label">领取通知</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.receiveNotice" placeholder="请选择领取通知类型" size="medium">
                  <el-option key="0" label="无" value="0"></el-option>
                  <el-option key="1" label="短信" value="1"></el-option>
                  <el-option key="2" label="推送" value="2"></el-option>
                  <el-option key="3" label="短信+推送" value="12"></el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label">是否实名认证</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.authCheck" placeholder="请选择是否实名认证" size="medium">
                  <el-option key="0" label="不限" value="0"></el-option>
                  <el-option key="1" label="实名" value="1"></el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label">是否常旅客</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.ffpCheck" placeholder="请选择是否是常旅客" size="medium">
                  <el-option key="2" label="不限" value="2"></el-option>
                  <el-option key="0" label="否" value="0"></el-option>
                  <el-option key="1" label="是" value="1"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">常旅客级别</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.ffpLevel" placeholder="请选择常旅客级别" size="medium" clearable>
                  <el-option v-for="item in levelList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label">间隔时间（天）</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="间隔时间, 例：2" clearable v-model="editForm.intervalTime"></el-input>
                <div class="warning-info" v-if="isShow && !editForm.intervalTime && editForm.receiveType === '0'">间隔时间不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">适用舱位</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="适用舱位，例：A/B/C" clearable v-model="editForm.cabin"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">排除适用舱位</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="排除适用舱位，例：A/B/C" clearable v-model="editForm.cabinDisable"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">适用出发地</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="适用出发地" clearable v-model="editForm.afrom"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">适用目的地</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="适用目的地" clearable v-model="editForm.ato"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">适用航班号</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="适用航班号，例：3327,3247,3327" clearable v-model="editForm.flightNo"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">领取产品标识</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="领取产品标识" clearable v-model="editForm.productid"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">排除航班日期</div>
              <div class="ipt-medium">
                <el-input
                  type="textarea"
                  :rows="3"
                  size="medium"
                  placeholder="排除航班日期,例：2019-08-01#2019-08-10,2019-09-01#2019-09-10"
                  v-model="editForm.fdateDisable">
                </el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">领用备注</div>
              <div class="ipt-medium">
                <el-input
                  type="textarea"
                  :rows="3"
                  size="medium"
                  placeholder="领用备注"
                  v-model="editForm.receiveRemark">
                </el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="handleSubmit()">提交</el-button>
          <el-button size="medium" @click="handleReset()">重置</el-button>
        </div>
      </div>
    </el-dialog>
    <!--变更日志查询弹出框-->
    <ChangeLogDiaLog ref="changeLogAby"></ChangeLogDiaLog>
    <!--领用规则详情弹出框-->
    <el-dialog v-dialogDrag title="领用规则详情" :visible.sync="dialogVisibleRule" width="1060px">
      <div class="dialog-container">
        <div class="dialog-main">
          <el-table
            :data="ruleDetailList"
            :cell-style="tableAttributes.cellStyle">
            <el-table-column label="领用规则编号" prop="receiveCode" min-width="100"></el-table-column>
            <el-table-column label="领用规则名称" prop="receiveName" min-width="100"></el-table-column>
            <el-table-column label="活动编号" prop="activityCode" min-width="100"></el-table-column>
            <el-table-column label="活动名称" prop="activityName" min-width="100"></el-table-column>
            <el-table-column label="优惠类型" prop="saleType" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.saleType && scope.row.saleType !== 'null'">
                  {{scope.row.saleType | saleTypeMap}}
                </span>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            :data="ruleDetailList"
            :cell-style="tableAttributes.cellStyle">
            <el-table-column label="是否实名认证" prop="authCheck" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.authCheck === '0'">不限</span>
                <span v-if="scope.row.authCheck === '1'">实名</span>
              </template>
            </el-table-column>
            <el-table-column label="是否常旅客" prop="ffpCheck" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.ffpCheck === '2'">不限</span>
                <span v-if="scope.row.ffpCheck === '0'">否</span>
                <span v-if="scope.row.ffpCheck === '1'">是</span>
              </template>
            </el-table-column>
            <el-table-column label="常旅客级别" prop="ffpLevel" min-width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.ffpLevel | levelName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="支付方式限制" prop="payMethod" min-width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.payMethod && scope.row.payMethod !== 'null'">
                  {{scope.row.payMethod | payLimitMap}}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="领用渠道" prop="channel" min-width="120">
              <template slot-scope="scope">
                <span>{{scope.row.channel | channelMap}}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            :data="ruleDetailList"
            :cell-style="tableAttributes.cellStyle">
            <el-table-column label="领取类型" prop="receiveType" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.receiveType === '0'">自然日</span>
                <span v-if="scope.row.receiveType === '1'">活动期内</span>
              </template>
            </el-table-column>
            <el-table-column label="领取通知" prop="receiveNotice" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.receiveNotice === '0'">无</span>
                <span v-if="scope.row.receiveNotice === '1'">短信</span>
                <span v-if="scope.row.receiveNotice === '2'">推送</span>
                <span v-if="scope.row.receiveNotice === '12'">短信+推送</span>
              </template>
            </el-table-column>
            <el-table-column label="启用状态" prop="receiveStatus" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.receiveStatus === '0'">禁用</span>
                <span v-if="scope.row.receiveStatus === '1'">启用</span>
              </template>
            </el-table-column>
            <el-table-column label="领取产品标识" prop="productid" min-width="100"></el-table-column>
            <el-table-column label="间隔时间" prop="intervalTime" min-width="100"></el-table-column>
            <el-table-column label="参与数目" prop="totalNum" min-width="100"></el-table-column>
            <el-table-column label="领取数量" prop="applyCount" min-width="100"></el-table-column>
          </el-table>
          <el-table
            :data="ruleDetailList"
            :cell-style="tableAttributes.cellStyle">
            <el-table-column label="渠道数量限制" prop="channelNum" min-width="100"></el-table-column>
            <el-table-column label="渠道金额限制" prop="channelMoney" min-width="100"></el-table-column>
            <el-table-column label="票价上限" prop="pmPriceLimitUp" min-width="100"></el-table-column>
            <el-table-column label="票价下限" prop="pmPriceLimitDown" min-width="100"></el-table-column>
            <el-table-column label="航班日期开始" prop="startFdate" min-width="100"></el-table-column>
            <el-table-column label="航班日期结束" prop="endFdtae" min-width="100"></el-table-column>
          </el-table>
          <el-table
            :data="ruleDetailList"
            :cell-style="tableAttributes.cellStyle">
            <el-table-column label="排除航班日期" prop="fdateDisable" min-width="120"></el-table-column>
            <el-table-column label="适用舱位" prop="cabin" min-width="100"></el-table-column>
            <el-table-column label="排除适用舱位" prop="cabinDisable" min-width="100"></el-table-column>
            <el-table-column label="创建人姓名" prop="createOpName" min-width="100"></el-table-column>
            <el-table-column label="创建时间" prop="createTime" min-width="120"></el-table-column>
            <el-table-column label="领用备注" prop="receiveRemark" min-width="120"></el-table-column>
          </el-table>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" @click="dialogVisibleRule = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
    <!--营销活动详情弹出框-->
    <ActivityDiaLog ref="ActivityAby"></ActivityDiaLog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ChangeLogDiaLog from '../../../../components/ChangeLogDiaLog'
import ActivityDiaLog from '../../../../components/activityDiaLog'
import { getCurrentDate, getChannelList, excelList, getRouteName, getActivityType, getCouponTempletType } from '../../../../utils/index'
import { querySaleReceiveRuleList, queryAddSaleReceiveRule, queryUpdateSaleReceiveRule, querySaleReceiveRuleStatus, querySaleReceiveRuleById } from './api'
import fieldMap from './refer'
import { checkAttrs } from '../../../../mixins'
import { computWidth } from '../../../../mixins/computWidt'

const levelList = [
  { label: '普卡', value: '01' },
  { label: '银卡', value: '02' },
  { label: '金卡', value: '03' },
  { label: '体验银卡', value: '04' },
  { label: '体验金卡', value: '05' },
  { label: '对口资源卡', value: '06' },
  { label: '白金卡', value: '07' },
  { label: '黑钻卡', value: '08' }
]
export default {
  name: 'ReceiveRule',
  data () {
    return {
      levelList: levelList,
      componentName: 'receiveRule',
      loading: false,
      checkedAll: false,
      isIndeterminate: false,
      isReset: false, // 添加/修改弹出框 -- 切换
      isEmpty: false, // 添加/修改弹出框 -- 判空
      isShow: false,
      isTime: false,
      editVisible: false, // 添加/修改弹出框 -- 显示隐藏
      dialogVisibleRule: false, // 领用规则详情弹出框 -- 显示隐藏
      popupTitle: '', // 添加/修改弹出框 -- 标题
      checkList: fieldMap,
      dataViewHeight: null,
      filter: {
        afrom: '', // 适用出发地
        ato: '', // 适用目的地
        flightNo: '', // 适用航班号
        receiveName: '', // 领用规则名称
        receiveCode: '', // 领用规则编号
        channel: '', // 领用渠道
        activityCode: '', // 活动编号
        saleType: '', // 优惠类型 0礼包、1单券、2积分、3返现
        startFdate: '', // 航班日期开始
        endFdtae: '', // 航班日期结束
        createDateStart: '', // 创建日期开始
        createDateEnd: '', // 创建日期结束
        receiveStatus: '', // 启用状态
        page: '', // 当前页
        rows: '' // 每页查询数量
      }, // 查询条件
      editForm: {
        receiveName: '',
        receiveCode: '',
        channel: '',
        activityId: '',
        totalNum: '',
        applyCount: '',
        saleType: '',
        receiveType: '',
        startFdate: '',
        endFdtae: '',
        intervalTime: '',
        channelNum: '',
        channelMoney: '',
        fdateDisable: '',
        cabin: '',
        afrom: '',
        ato: '',
        flightNo: '',
        cabinDisable: '',
        pmPriceLimitUp: '',
        pmPriceLimitDown: '',
        authCheck: '0',
        ffpCheck: '2',
        ffpLevel: '',
        payMethod: '',
        receiveRemark: '',
        receiveNotice: '0',
        receiveStatus: '1',
        productid: '',
        templetId: ''
      }, // 添加/修改数据表单
      useRuleList: {}, // 表格数据
      tableList: {
        channel: true,
        totalNum: true,
        saleType: true,
        templetName: false,
        receiveType: true,
        intervalTime: false,
        channelNum: false,
        channelMoney: false,
        startFdate: false,
        endFdtae: false,
        fdateDisable: false,
        afrom: false,
        ato: false,
        flightNo: false,
        cabin: false,
        cabinDisable: false,
        pmPriceLimitUp: false,
        pmPriceLimitDown: false,
        authCheck: false,
        ffpCheck: false,
        ffpLevel: false,
        payMethod: false,
        receiveRemark: false,
        receiveNotice: true,
        receiveStatus: true,
        createTime: false,
        productid: false,
        receiveName: true,
        receiveCode: true,
        applyCount: false,
        activityCode: true,
        activityName: true,
        createOpName: false
      }, // 表格展示数据
      multipleSelection: [], // 表格多选
      ruleDetailList: [] // 领用规则详情数据表单
    }
  },
  created () {
    this.initDate()
    this.judgeChannelList()
    this.getSaleReceiveRuleList(1, this.pagination.pageSize)
  },
  mixins: [checkAttrs, computWidth],
  filters: {
    upper: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.toUpperCase()
    },
    levelName: level => {
      if (levelList && levelList.length) {
        for (let i = 0; i < levelList.length; i++) {
          if (level === levelList[i].value) {
            return levelList[i].label
          }
        }
      }
      return ''
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList,
      activityTypeList: state => state.app.activityTypeList,
      couponTempletTypeList: state => state.app.couponTempletTypeList
    })
  },
  components: {
    ChangeLogDiaLog,
    ActivityDiaLog
  },
  methods: {
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
      if (!this.activityTypeList.length) {
        getActivityType()
      }
      if (!this.couponTempletTypeList.length) {
        getCouponTempletType()
      }
    },

    // 默认日期处理
    initDate () {
      this.date = [getCurrentDate(0, '01'), getCurrentDate(0)]
      this.filter.beginDate = this.date[0]
      this.filter.endDate = this.date[1]
    },

    // 分页导航
    handleSizeChange (pages) {
      this.getSaleReceiveRuleList(null, pages)
    },
    handleCurrentChange (page) {
      this.getSaleReceiveRuleList(page, null)
    },

    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 获取表格数据
    getSaleReceiveRuleList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      querySaleReceiveRuleList(this.filter).then(res => {
        this.useRuleList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },

    // 查询条件查询
    resetEdit () {
      this.filter.afrom = ''
      this.filter.ato = ''
      this.filter.flightNo = ''
      this.filter.receiveName = ''
      this.filter.receiveCode = ''
      this.filter.channel = ''
      this.filter.activityCode = ''
      this.filter.saleType = ''
      this.filter.startFdate = ''
      this.filter.endFdtae = ''
      this.filter.createDateStart = ''
      this.filter.createDateEnd = ''
      this.filter.receiveStatus = ''
      this.initDate()
      this.getSaleReceiveRuleList(1, this.pagination.pageSize)
    },

    // 添加/修改弹出框
    handleEdit (params) {
      this.editVisible = true
      this.handleReset()
      if (params) {
        this.isReset = false
        this.popupTitle = '修改'
        this.hangdleParams(params)
      } else {
        this.isReset = true
        this.popupTitle = '添加'
      }
    },

    // 添加/修改弹出框 -- 数据处理
    hangdleParams (params) {
      this.editForm.receiveId = params.receiveId
      this.editForm.receiveName = params.receiveName
      this.editForm.receiveCode = params.receiveCode
      this.editForm.channel = params.channel.split(',')
      this.editForm.activityId = params.activityId
      this.editForm.totalNum = params.totalNum + ''
      this.editForm.applyCount = params.applyCount + ''
      this.editForm.saleType = params.saleType
      this.editForm.receiveType = params.receiveType
      this.editForm.startFdate = params.startFdate
      this.editForm.endFdtae = params.endFdtae
      this.editForm.intervalTime = params.intervalTime
      this.editForm.channelNum = params.channelNum
      this.editForm.channelMoney = params.channelMoney
      this.editForm.fdateDisable = params.fdateDisable
      this.editForm.cabin = params.cabin
      this.editForm.afrom = params.afrom
      this.editForm.ato = params.ato
      this.editForm.flightNo = params.flightNo
      this.editForm.cabinDisable = params.cabinDisable
      this.editForm.pmPriceLimitUp = params.pmPriceLimitUp === 0 ? '' : params.pmPriceLimitUp + ''
      this.editForm.pmPriceLimitDown = params.pmPriceLimitDown === 0 ? '' : params.pmPriceLimitDown + ''
      this.editForm.authCheck = params.authCheck ? params.authCheck : '0'
      this.editForm.ffpCheck = params.ffpCheck ? params.ffpCheck : '2'
      this.editForm.ffpLevel = params.ffpLevel
      this.editForm.payMethod = params.payMethod ? params.payMethod.split(',') : ''
      this.editForm.receiveRemark = params.receiveRemark
      this.editForm.receiveNotice = params.receiveNotice ? params.receiveNotice : '0'
      this.editForm.receiveStatus = params.receiveStatus
      this.editForm.productid = params.productid
      this.editForm.templetId = params.templetId
    },

    isChange (e) {
      this.isShow = false
      if (e && e !== '1') {
        this.editForm.templetId = ''
      }
    },

    // 添加/修改弹出框 -- 提交
    handleSubmit () {
      if (this.editForm.receiveName && this.editForm.receiveCode &&
        this.editForm.channel.length > 0 && this.editForm.activityId &&
        this.editForm.totalNum && this.editForm.applyCount &&
        this.editForm.saleType && this.editForm.receiveType &&
        this.editForm.receiveStatus) {
        let data = JSON.parse(JSON.stringify(this.editForm))
        data.cabin = this.$options.filters.upper(data.cabin)
        data.cabinDisable = this.$options.filters.upper(data.cabinDisable)
        data.afrom = this.$options.filters.upper(data.afrom)
        data.ato = this.$options.filters.upper(data.ato)
        if (data.saleType === '1' && data.templetId && data.receiveType === '0' && data.intervalTime) {
          this.submitData(data)
        } else if (data.saleType === '1' && data.templetId && data.receiveType !== '0') {
          data.intervalTime = ''
          this.submitData(data)
        } else if (data.saleType !== '1' && data.receiveType === '0' && data.intervalTime) {
          data.templetId = ''
          this.submitData(data)
        } else if (data.saleType !== '1' && data.receiveType !== '0') {
          data.intervalTime = ''
          data.templetId = ''
          this.submitData(data)
        } else {
          this.isShow = true
        }
      } else {
        this.isEmpty = true
      }
    },

    // 添加/修改弹出框 -- 提交: 数据处理
    submitData (data) {
      data.channel = data.channel ? data.channel.join(',') : ''
      data.payMethod = data.payMethod ? data.payMethod.join(',') : ''
      if (data.channelNum === '') {
        data.channelNum = 0
      }
      if (data.channelMoney === '') {
        data.channelMoney = 0
      }
      if (data.pmPriceLimitUp === '') {
        data.pmPriceLimitUp = 0
      }
      if (data.pmPriceLimitDown === '') {
        data.pmPriceLimitDown = 0
      }
      if (this.isReset === false) {
        this.updateParamsData(data)
      } else {
        this.addParamsData(data)
      }
    },

    // 添加/修改弹出框 -- 重置
    handleReset () {
      this.editForm = {
        receiveName: '',
        receiveCode: '',
        channel: '',
        activityId: '',
        totalNum: '',
        applyCount: '',
        saleType: '',
        templetId: '',
        receiveType: '',
        startFdate: '',
        endFdtae: '',
        intervalTime: '',
        channelNum: '',
        channelMoney: '',
        fdateDisable: '',
        cabin: '',
        afrom: '',
        ato: '',
        flightNo: '',
        cabinDisable: '',
        pmPriceLimitUp: '',
        pmPriceLimitDown: '',
        authCheck: '0',
        ffpCheck: '2',
        ffpLevel: '',
        payMethod: '',
        receiveRemark: '',
        receiveNotice: '0',
        receiveStatus: '1',
        productid: ''
      }
      this.isEmpty = false
      this.isShow = false
    },

    // 添加弹出框 -- 提交接口
    addParamsData (data) {
      queryAddSaleReceiveRule(data).then(res => {
        this.editVisible = false
        this.getSaleReceiveRuleList()
        this.$message.success(res.message)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },

    // 修改弹出框 -- 提交接口
    updateParamsData (data) {
      queryUpdateSaleReceiveRule(data).then(res => {
        this.editVisible = false
        this.getSaleReceiveRuleList()
        this.$message.success(res.message)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },

    // 变更日志查询
    handleLogChange (id) {
      let url = '/saleReceiveRule/getUpdateLog'
      this.$refs.changeLogAby.initComponent(url, id)
    },

    // 禁用/启用状态
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
        querySaleReceiveRuleStatus(data).then(res => {
          this.$message.success(res.message)
          this.getSaleReceiveRuleList()
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消修改')
      })
    },

    // 导出
    handleExport () {
      let data = JSON.parse(JSON.stringify(this.filter))
      data.start = 1
      data.end = this.useRuleList.total
      delete data.page
      delete data.rows
      let params = {
        data: data,
        url: 'saleReceiveRule/exportSaleReceiveRule',
        name: getRouteName('/receiveRule'),
        type: 'xls'
      }
      excelList(params)
    },

    // 查看领用规则、营销活动详情
    switchDialog (status, id) {
      if (status === 'rule') {
        this.dialogVisibleRule = true
        this.ruleParamsData(id)
      } else {
        this.$refs.ActivityAby.initComponent(id)
      }
    },

    // 调用领用规则详情
    ruleParamsData (id) {
      let list = []
      querySaleReceiveRuleById({ receiveId: id }).then(res => {
        list.push(res.obj)
        this.ruleDetailList = list
      }).catch(err => {
        this.$message.error(err)
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
