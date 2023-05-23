<template>
<!--  <div>优惠券信息</div>-->
  <div id="CouponInfo" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <!--clearable @keydown.enter.native=""-->
          <el-select size="medium" v-model="filter.userType" placeholder="用户类型">
            <el-option label="全部" value=""></el-option>
            <el-option label="手机" value="1"></el-option>
            <el-option label="邮箱" value="2"></el-option>
            <el-option label="身份证" value="3"></el-option>
            <el-option label="常旅客" value="4"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="用户编号" v-model="filter.userNo" :disabled="filter.userType === ''"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="优惠券名称" v-model="filter.templetName" @keydown.enter.native="getMetCouponList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="优惠券编号" v-model="filter.couponCode" @keydown.enter.native="getMetCouponList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="订单编号" v-model="filter.ordercode" @keydown.enter.native="getMetCouponList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="发放批次号" v-model="filter.issueCode" @keydown.enter.native="getMetCouponList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="申领批次号" v-model="filter.batchCode" @keydown.enter.native="getMetCouponList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="优惠券状态" v-model="filter.couponStatus"  @keydown.enter.native="getMetCouponList()">
            <el-option label="未领取" value="0"></el-option>
            <el-option label="已领取" value="1"></el-option>
            <el-option label="冻结" value="2"></el-option>
            <el-option label="使用" value="3"></el-option>
            <el-option label="过期" value="4"></el-option>
            <el-option label="作废" value="5"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="客户类型" v-model="filter.memberType"  @keydown.enter.native="getMetCouponList()">
            <el-option label="会员" value="0"></el-option>
            <el-option label="常旅客" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="申请类型" v-model="filter.applyType"  @keydown.enter.native="getMetCouponList()">
            <el-option label="普通发放" value="0"></el-option>
            <el-option label="及时发放" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="领取方式" v-model="filter.allotType"  @keydown.enter.native="getMetCouponList()">
            <el-option label="用户领取" value="1"></el-option>
            <el-option label="后台申领" value="2"></el-option>
            <el-option label="系统发放" value="3"></el-option>
            <el-option label="券码领取" value="4"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="审批流程编号" v-model="filter.approveOaCode" @keydown.enter.native="getMetCouponList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="使用渠道" v-model="filter.useChannel" @keydown.enter.native="getSaleIssueDataList()">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="领取渠道" v-model="filter.allotChannel" @keydown.enter.native="getSaleIssueDataList()">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.allotTimeStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="领取时间开始">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.allotTimeEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="领取时间结束">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.useTimeStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="使用时间开始">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.useTimeEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="使用时间结束">
          </el-date-picker>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getMetCouponList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" :disabled="couponInfoList.total === 0" @click="handleExport()">导出</el-button>
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
        :data="couponInfoList.rows"
        v-loading="loading"
        :height="dataViewHeight"
        @selection-change="handleSelectionChange">
        <el-table-column key="1" label="订单编号" v-if="tableList.ordercode" prop="ordercode" min-width="160">
          <template slot-scope="scope">
            <div class="active-text" @click="ordercodeDialog(scope.row)">{{scope.row.ordercode}}</div>
          </template>
        </el-table-column>
        <el-table-column key="2" label="发放批次号" v-if="tableList.issueCode" prop="issueCode" min-width="100">
          <template slot-scope="scope">
            <div class="active-text" @click="issueCodeDialog(scope.row.issueCode)">{{scope.row.issueCode}}</div>
          </template>
        </el-table-column>
        <el-table-column key="3" label="申领批次号" v-if="tableList.batchCode" prop="batchCode" min-width="100">
          <template slot-scope="scope" v-if="scope.row.applyId">
            <div class="active-text" @click="batchCodeDialog(scope.row.applyId)">{{scope.row.batchCode}}</div>
          </template>
        </el-table-column>
        <el-table-column key="4" label="模板编号" v-if="tableList.templetCode" prop="templetCode" min-width="100">
          <template slot-scope="scope">
            <div class="active-text" @click="templetDialog(scope.row.templetId)">{{scope.row.templetCode}}</div>
          </template>
        </el-table-column>
        <el-table-column key="5" label="模板名称" v-if="tableList.templetName" prop="templetName" min-width="140"></el-table-column>
        <el-table-column key="6" label="申请类型" v-if="tableList.applyType" prop="applyType" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.applyType | applyTypeMap}}</span>
          </template>
        </el-table-column>
          <el-table-column key="45" label="是否支持共享航班" v-if="tableList.shareFlag" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.shareFlag === '1'">支持</div>
              <div v-else-if="scope.row.shareFlag === '0'">不支持</div>
            </template>
          </el-table-column>
        <el-table-column key="7" label="优惠券状态" v-if="tableList.couponStatus" prop="applyType" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.couponStatus | couponStatusMap}}</span>
          </template>
        </el-table-column>
        <el-table-column key="8" label="使用渠道" v-if="tableList.useChannel" prop="useChannel" min-width="160">
          <template slot-scope="scope">
                <span v-if="scope.row.useChannel && scope.row.useChannel !== 'null'">
                  {{scope.row.useChannel | channelMap}}
                </span>
            <span v-else>全渠道</span>
          </template>
        </el-table-column>
        <el-table-column key="9" label="领取渠道" v-if="tableList.allotChannel" prop="allotChannel" min-width="160">
          <template slot-scope="scope">
                <span v-if="scope.row.allotChannel && scope.row.allotChannel !== 'null'">
                  {{scope.row.allotChannel | channelMap}}
                </span>
            <span v-else>全渠道</span>
          </template>
        </el-table-column>
        <el-table-column key="10" label="创建时间" v-if="tableList.createTime" prop="createTime" min-width="160"></el-table-column>
        <el-table-column key="11" label="领取时间" v-if="tableList.allotTime" prop="allotTime" min-width="160"></el-table-column>
        <el-table-column key="12" label="使用时间" v-if="tableList.useTime" prop="useTime" min-width="160"></el-table-column>
        <el-table-column key="13" label="航段起" v-if="tableList.flightFrom" prop="flightFrom" min-width="100"></el-table-column>
        <el-table-column key="14" label="航段止" v-if="tableList.flightTo" prop="flightTo" min-width="100"></el-table-column>
        <el-table-column key="15" label="优惠券编号" v-if="tableList.couponCode" prop="couponCode" min-width="120"></el-table-column>
        <el-table-column key="16" label="优惠券金额" v-if="tableList.price" prop="price" min-width="100"></el-table-column>
        <el-table-column key="17" label="优惠券类别" v-if="tableList.couponType" prop="couponType" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.couponType | couponTypeMap}}</span>
          </template>
        </el-table-column>
        <el-table-column key="18" label="国际/国内" v-if="tableList.isInter" prop="isInter" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.isInter | isInterMap}}</span>
          </template>
        </el-table-column>
        <el-table-column key="19" label="航班日期开始" v-if="tableList.startFdate" prop="startFdate" min-width="120"></el-table-column>
        <el-table-column key="20" label="航班日期结束" v-if="tableList.endFdate" prop="endFdate" min-width="120"></el-table-column>
        <el-table-column key="21" label="排除航班日期段" v-if="tableList.fdateDisable" prop="fdateDisable" min-width="180"></el-table-column>
        <el-table-column key="22" label="航班号" v-if="tableList.fnumber" prop="fnumber" min-width="100"></el-table-column>
        <el-table-column key="23" label="排除航班号" v-if="tableList.fnumberDisable" prop="fnumberDisable" min-width="100"></el-table-column>
        <el-table-column key="24" label="舱位" v-if="tableList.cabin" prop="cabin" min-width="120"></el-table-column>
        <el-table-column key="25" label="排除舱位" v-if="tableList.cabinDisable" prop="cabinDisable" min-width="120"></el-table-column>
        <el-table-column key="26" label="票价上限" v-if="tableList.highestPrice" prop="highestPrice" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.highestPrice && scope.row.highestPrice !== 0">{{scope.row.highestPrice}}</span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column key="27" label="票价下限" v-if="tableList.lowestPrice" prop="lowestPrice" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.lowestPrice && scope.row.lowestPrice !== 0">{{scope.row.lowestPrice}}</span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column key="28" label="有效日期起" v-if="tableList.validityStart" prop="validityStart" min-width="120"></el-table-column>
        <el-table-column key="29" label="排除有效日期段" v-if="tableList.validityDisable" prop="validityDisable" min-width="160"></el-table-column>
        <el-table-column key="30" label="限制条件" v-if="tableList.condition" prop="condition" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.condition && scope.row.condition !== 'null'">
              {{scope.row.condition | conditionMap}}
            </span>
          </template>
        </el-table-column>
        <el-table-column key="31" label="是否实名认证" v-if="tableList.authCheck" prop="authCheck" min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.authCheck && scope.row.authCheck !== 'null'">
              {{scope.row.authCheck | authCheckMap}}
            </span>
          </template>
        </el-table-column>
        <el-table-column key="32" label="支付方式限制" v-if="tableList.payMethod" prop="payMethod" min-width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.payMethod && scope.row.payMethod !== 'null'">
              {{scope.row.payMethod | payLimitMap}}
            </span>
          </template>
        </el-table-column>
        <el-table-column key="33" label="支付时限" v-if="tableList.payLimit" prop="payLimit" min-width="120"></el-table-column>
        <el-table-column key="34" label="取消返券" v-if="tableList.isReturn" prop="isReturn" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.isReturn && scope.row.isReturn !== 'null'">
              {{scope.row.isReturn | isReturnMap}}
            </span>
          </template>
        </el-table-column>
        <el-table-column key="35" label="启用状态" v-if="tableList.templetStatus" prop="templetStatus" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.templetStatus === '0'">禁用</span>
            <span v-if="scope.row.templetStatus === '1'">启用</span>
          </template>
        </el-table-column>
        <el-table-column key="36" label="有效日期止" v-if="tableList.validityEnd" prop="validityEnd" min-width="120"></el-table-column>
        <el-table-column key="37" label="优惠类型" v-if="tableList.sailType" prop="sailType" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.sailType && scope.row.sailType !== 'null'">
              {{scope.row.sailType | sailTypeMap}}
            </span>
          </template>
        </el-table-column>
        <el-table-column key="38" label="领取方式" v-if="tableList.allotType" prop="allotType" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.allotType && scope.row.allotType !== 'null'">
              {{scope.row.allotType | allotTypeMap}}
            </span>
          </template>
        </el-table-column>
        <el-table-column key="39" label="审批流程编号" v-if="tableList.approveOaCode" prop="approveOaCode" min-width="120"></el-table-column>
        <el-table-column key="40" label="客户类型" v-if="tableList.memberType" prop="memberType" min-width="100">
          <template slot-scope="scope">
             <span v-if="scope.row.memberType && scope.row.memberType !== 'null'">
                {{scope.row.memberType | memberTypeMap}}
              </span>
          </template>
        </el-table-column>
        <el-table-column key="41" label="订单创建时间" v-if="tableList.oCreateDate" prop="oCreateDate" min-width="160"></el-table-column>
        <el-table-column key="42" label="PNR" v-if="tableList.pnr" prop="pnr" min-width="100"></el-table-column>
        <el-table-column key="43" label="核销人" v-if="tableList.writeoffOpid" prop="writeoffOpid" min-width="120"></el-table-column>
        <el-table-column key="44" label="核销时间" v-if="tableList.writeoffTime" prop="writeoffTime" min-width="160"></el-table-column>
        <el-table-column label="操作" min-width="180" v-if="checked.length">
          <template slot-scope="scope">
            <span class="active-text mr-5" title="核销" v-if="scope.row.couponStatus === '1'" @click="handleWriteOff(scope.row)">核销</span>
            <span class="active-text mr-5" title="安全查询" v-if="scope.row.memId" @click="handleSafety(scope.row)">安全查询</span>
            <span class="active-text mr-5" title="变更日志" @click="handleLogChange(scope.row.couponId)">变更日志</span>
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
            :total="couponInfoList.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--安全查询弹出框-->
    <SafetyInquireDiaLog ref="safetyInquireAby"></SafetyInquireDiaLog>
    <!--变更日志查询弹出框-->
    <ChangeLogDiaLog ref="changeLogAby"></ChangeLogDiaLog>
    <!--模板详情弹出框-->
    <TempletDiaLog ref="templetAby"></TempletDiaLog>
    <!--订单信息弹出框-->
    <OrderDetail ref="orderAby" :orderDetilList="orderDetilList" @tableList="getMetCouponList"></OrderDetail>
    <!--生成详情弹出框-->
    <el-dialog title="生成详情" :visible.sync="dialogVisibleGenerate" width="800px">
      <div class="dialog-container">
        <div class="dialog-main">
          <el-table
            :data="generateDetailList.rows"
            :cell-style="tableAttributes.cellStyle">
            <el-table-column label="发放批次号" prop="issueCode" min-width="100"></el-table-column>
            <el-table-column label="发放批次名称" prop="issueName" min-width="120"></el-table-column>
            <el-table-column label="此次发放数量" prop="issueNum" min-width="120"></el-table-column>
            <el-table-column label="发放成功数量" prop="successNum" min-width="120"></el-table-column>
          </el-table>
          <el-table
            :data="generateDetailList.rows"
            :cell-style="tableAttributes.cellStyle">
            <el-table-column label="可发放数量" prop="notUseSum" min-width="100"></el-table-column>
            <el-table-column label="总数量" prop="total" min-width="100"></el-table-column>
            <el-table-column label="使用渠道" prop="issueChannel" min-width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.issueChannel && scope.row.issueChannel !== 'null'">
                  {{scope.row.issueChannel | channelMap}}
                </span>
                <span v-else>全渠道</span>
              </template>
            </el-table-column>
            <el-table-column label="发放状态" prop="issueStatus" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.issueStatus === '0'">失败</span>
                <span v-if="scope.row.issueStatus === '1'">成功</span>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            :data="generateDetailList.rows"
            :cell-style="tableAttributes.cellStyle">
            <el-table-column label="模板编号" prop="templetCode" min-width="100"></el-table-column>
            <el-table-column label="发放时间" prop="issueTime" min-width="160"></el-table-column>
            <el-table-column label="优惠券名称" prop="templetName" min-width="120"></el-table-column>
            <el-table-column label="优惠券金额" prop="price" min-width="100"></el-table-column>
            <el-table-column label="发放人姓名" prop="createOpName" min-width="120"></el-table-column>
          </el-table>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" @click="dialogVisibleGenerate = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
    <!--申领详情弹出框-->
    <el-dialog title="申领详情" :visible.sync="dialogVisibleClaim" width="800px">
      <div class="dialog-container">
        <div class="dialog-main">
          <el-table
            :data="claimDetailList.rows"
            :cell-style="tableAttributes.cellStyle">
            <el-table-column label="申领批次号" prop="batchCode" min-width="100"></el-table-column>
            <el-table-column label="申领批次名称" prop="batchName" min-width="140"></el-table-column>
            <el-table-column label="申领时间" prop="createTime" min-width="160"></el-table-column>
            <el-table-column label="申领状态" prop="applyStatus" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.applyStatus === '0'">未申领</span>
                <span v-if="scope.row.applyStatus === '1'">已申领</span>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            :data="claimDetailList.rows"
            :cell-style="tableAttributes.cellStyle">
            <el-table-column label="申领人姓名" prop="createOpName" min-width="120"></el-table-column>
            <el-table-column label="领用规则编号" prop="receiveName" min-width="140"></el-table-column>
            <el-table-column label="领用规则名称" prop="receiveCode" min-width="140"></el-table-column>
          </el-table>
          <el-table
            :data="claimDetailList.rows"
            :cell-style="tableAttributes.cellStyle">
            <el-table-column label="客户类型" prop="memberType" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.memberType && scope.row.memberType !== 'null'">
                  {{scope.row.memberType | memberTypeMap}}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="号码类型" prop="pidType" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.pidType === '1'">手机号</span>
                <span v-if="scope.row.pidType === '2'">证件号</span>
                <span v-if="scope.row.pidType === '3'">常客号</span>
                <span v-if="scope.row.pidType === '4'">邮箱</span>
              </template>
            </el-table-column>
            <el-table-column label="客户号码" prop="pidNo" min-width="140"></el-table-column>
            <el-table-column label="是否实名认证" prop="authCheck" min-width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.authCheck && scope.row.authCheck !== 'null'">
                  {{scope.row.authCheck | authCheckMap}}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" @click="dialogVisibleClaim = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
    <!--核销-->
    <el-dialog title="提示" :visible.sync="dialogVisibleWriteOff" width="350px">
      <div v-loading="loading" class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label">订单编号</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="订单编号" clearable v-model="editForm.ordercode"></el-input>
<!--                <div class="warning-info" v-if="isEmpty && !editForm.ordercode">订单编号不可为空</div>-->
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SafetyInquireDiaLog from '../../../../components/safetyInquireDiaLog'
import ChangeLogDiaLog from '../../../../components/ChangeLogDiaLog'
import TempletDiaLog from '../../../../components/couponTempletDetail'
import OrderDetail from '../../../../components/orderDetail'
import { getChannelList, excelList, getRouteName } from '../../../../utils'
import { queryMetCouponList, queryGenerateCode, querySaleApplyRecordById, queryWriteOff } from './api'
import fieldMap from './refer'
import { checkAttrs } from '../../../../mixins'
import { computWidth } from '../../../../mixins/computWidt'

export default {
  name: 'CouponInfo',
  data () {
    return {
      componentName: 'couponInfo',
      loading: false,
      dataViewHeight: null,
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false,
      filter: {
        userType: '', // 用户类型
        userNo: '', // 用户编号
        templetName: '', // 优惠券名称
        couponCode: '', // 优惠券编号
        templetCode: '', // 模板编号
        ordercode: '', // 订单编号
        issueCode: '', // 发放批次号
        batchCode: '', // 申领批次号
        couponStatus: '', // 优惠券状态
        memberType: '', // 客户类型
        applyType: '', // 申请类型  0普通发放、1及时发放
        allotType: '', // 领取方式 1.用户领取 2.后台申领 3.系统发放 4.券码领取
        approveOaCode: '', // 审批流程编号
        useChannel: '', // 使用渠道
        allotChannel: '', // 领取渠道
        allotTimeStart: '', // 领取时间开始
        allotTimeEnd: '', // 领取时间结束
        useTimeStart: '', // 使用时间开始
        useTimeEnd: '', // 使用时间结束
        page: '', // 当前页
        rows: '' // 每页查询数量
      }, // 查询条件表单
      couponInfoList: {}, // 表格数据列表
      tableList: {
        ordercode: true, // 订单编号
        issueCode: true, // 发放批次号
        batchCode: true, // 申领批次号
        applyType: false, // 申请类型
        shareFlag: false, // 是否共享航班
        couponStatus: true, // 优惠券状态
        useChannel: true, // 使用渠道
        allotChannel: true, // 领取渠道
        createTime: false, // 创建时间
        allotTime: false, // 领取时间
        useTime: false, // 使用时间
        flightFrom: false, // 航段起
        flightTo: false, // 航段止
        couponCode: true, // 优惠券编号
        templetCode: true, // 模板编号
        templetName: true, // 模板名称
        price: true, // 优惠券金额
        couponType: true, // 优惠券类别
        isInter: false, // 国际/国内
        startFdate: false, // 航班日期开始
        endFdate: false, // 航班日期结束
        fdateDisable: false, // 排除航班日期范围
        fnumber: false, // 航班号
        fnumberDisable: false, // 排除航班号
        cabin: false, // 舱位
        cabinDisable: false, // 排除舱位
        highestPrice: false, // 票价上限
        lowestPrice: false, // 票价下限
        validityStart: false, // 有效日期起
        validityDisable: false, // 排除有效日期段
        condition: false, // 限制条件（本人） 0不限，1本人
        authCheck: false, // 是否实名认证 0不限，1实名
        payMethod: false, // 支付方式限制
        payLimit: false, // 支付时限
        isReturn: false, // 取消返券 0不，1返券
        templetStatus: false, // 启用状态
        validityEnd: false, // 有效日期止
        sailType: true, // 优惠类型，1直减，2折扣，3免费
        allotType: true, // 领取方式 1.用户领取 2.后台申领 3.系统发放 4.券码领取
        approveOaCode: false, // 审批流程编号
        memberType: true, // 客户类型 0会员、1常旅客
        oCreateDate: false, // 订单创建时间
        pnr: true, // pnr
        writeoffOpid: false, // 核销人
        writeoffTime: false // 核销时间
      }, // 表格数据展示列表
      orderDetilList: {},
      dialogVisibleGenerate: false, // 生成详情弹出框 -- 显示隐藏
      generateDetailList: {}, // 生成详情弹出框 -- 数据表单
      dialogVisibleClaim: false, // 申领详情弹出框 -- 显示隐藏
      claimDetailList: {}, // 申领详情弹出框 -- 数据表单
      dialogVisibleWriteOff: false, // 核销弹出框 -- 显示隐藏
      isEmpty: false, // 核销弹出框 -- 是否为空
      editForm: {} // 核销弹出框 -- 数据表单
    }
  },
  created () {
    // this.initDate()
    this.judgeTypeList()
    this.getMetCouponList(1, this.pagination.pageSize)
  },
  mixins: [checkAttrs, computWidth],
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList
    })
  },
  components: {
    SafetyInquireDiaLog,
    TempletDiaLog,
    OrderDetail,
    ChangeLogDiaLog
  },
  methods: {
    // state没有则请求服务器
    judgeTypeList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },

    // 默认日期处理
    // initDate () {
    //   this.date = [getCurrentDate(0, '01'), getCurrentDate(0)]
    //   this.filter.allotTimeStart = this.date[0]
    //   this.filter.allotTimeEnd = this.date[1]
    //   this.filter.useTimeStart = this.date[0]
    //   this.filter.useTimeEnd = this.date[1]
    // },

    // 分页导航
    handleSizeChange (pages) {
      this.getMetCouponList(null, pages)
    },
    handleCurrentChange (page) {
      this.getMetCouponList(page, null)
    },

    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 获取表格数据
    getMetCouponList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      queryMetCouponList(this.filter).then(res => {
        this.couponInfoList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },

    // 重置搜索条件
    resetFilter () {
      this.filter = {
        userType: '',
        userNo: '',
        templetName: '',
        couponCode: '',
        templetCode: '',
        ordercode: '',
        issueCode: '',
        batchCode: '',
        couponStatus: '',
        memberType: '',
        applyType: '',
        allotType: '',
        approveOaCode: '',
        useChannel: '',
        allotChannel: '',
        allotTimeStart: '',
        allotTimeEnd: '',
        useTimeStart: '',
        useTimeEnd: ''
      }
      // this.initDate()
      this.getMetCouponList(1, this.pagination.pageSize)
    },

    // 导出
    handleExport () {
      let data = JSON.parse(JSON.stringify(this.filter))
      data.start = 1
      data.end = this.couponInfoList.total
      delete data.page
      delete data.rows
      let params = {
        data: data,
        url: 'metCoupon/exportMetCoupon',
        name: getRouteName('/couponInfo'),
        type: 'xls'
      }
      excelList(params, this)
    },
    // 核销
    handleWriteOff (params) {
      this.dialogVisibleWriteOff = true
      this.resetEdit()
      this.editForm.couponId = params.couponId
    },
    // 核销弹出框 -- 提交
    saveEdit () {
      // if (this.editForm.ordercode) {
      let data = JSON.parse(JSON.stringify(this.editForm))
      queryWriteOff(data).then(res => {
        this.dialogVisibleWriteOff = false
        this.getMetCouponList()
        this.$message.success(res.message)
      }).catch(err => {
        this.$message.error(err.message)
      })
      // } else {
      //   this.isEmpty = true
      // }
    },
    // 核销弹出框 -- 重置
    resetEdit () {
      this.editForm = {
        ordercode: ''
      }
      this.isEmpty = false
    },
    // 安全查询
    handleSafety (params) {
      this.$refs.safetyInquireAby.initComponent({ memId: params.memId, memberType: params.memberType })
    },

    // 变更日志
    handleLogChange (id) {
      let url = '/metCoupon/getUpdateLog'
      this.$refs.changeLogAby.initComponent(url, id)
    },

    // 优惠券模板详情
    templetDialog (id) {
      this.detailParamsData(id)
    },

    // 调用优惠券模板详情
    detailParamsData (id) {
      this.$refs.templetAby.initComponent(id)
    },

    // 生成详情
    issueCodeDialog (code) {
      this.dialogVisibleGenerate = true
      queryGenerateCode({ issueCode: code }).then(res => {
        this.generateDetailList = res
      }).catch(err => {
        this.$message.error(err)
      })
    },

    // 申领详情
    batchCodeDialog (id) {
      this.dialogVisibleClaim = true
      querySaleApplyRecordById({ applyId: id }).then(res => {
        this.claimDetailList = res
      }).catch(err => {
        this.$message.error(err)
      })
    },

    // 订单详情
    ordercodeDialog (params) {
      let startdate = this.filter.orderQsrq
      let enddate = params.oCreateDate.split(' ')[0]
      let orderDate = enddate.replace(/-/g, '')
      this.orderDetilList = {
        orderVisible: true,
        dialogTitle: '订单详细信息'
      }
      this.$refs.orderAby.getOrderData({ orderId: params.orderId, orderDate: orderDate }) // 订单信息
      this.$refs.orderAby.getFirstPassageData({ orderId: params.orderId, orderDate: orderDate, segid: '1' }) // 第一航段
      this.$refs.orderAby.getCheckFlightSegment({ orderId: params.orderId, orderDate: orderDate, segid: '2' }) // 第二航段
      this.$refs.orderAby.getInsuranceInfoData({ ordercode: params.ordercode, startdate: startdate, enddate: enddate }) // 保险信息
      this.$refs.orderAby.getTravelMailData({ orderCode: params.ordercode, page: 1, rows: this.pagination.pageSize }) // 行程单信息
      this.$refs.orderAby.getUpgradeData({ orderId: params.orderId }) // 升舱订单列表
      this.$refs.orderAby.getOrderProcessingList({ orderid: params.orderId }) // 订单操作日志
      this.$refs.orderAby.getKSeatList({ pnr: params.pnr }) // K座位记录
    }
  }
}
</script>

<style scoped lang="scss"></style>
