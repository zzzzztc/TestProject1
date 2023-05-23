<template>
<!--  <div>优惠券模板</div>-->
  <div id="CouponTemplet" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="模板编号" v-model="filter.templetCode" @keydown.enter.native="getCouponTempletList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="模板名称" v-model="filter.templetName" @keydown.enter.native="getCouponTempletList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.createTimeStart"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="创建时间开始">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="filter.createTimeEnd"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="创建时间结束">
          </el-date-picker>
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
          <el-input size="medium" clearable placeholder="航班号" v-model="filter.fnumber" @keydown.enter.native="getCouponTempletList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="出发" v-model="filter.afrom" @keydown.enter.native="getCouponTempletList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="到达" v-model="filter.ato" @keydown.enter.native="getCouponTempletList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="舱位" v-model="filter.cabin" @keydown.enter.native="getCouponTempletList()"></el-input>
        </div>
<!--        <div class="search-item search-ipt">-->
<!--          <el-select size="medium" clearable placeholder="是否支持共享航班" v-model="filter.shareFlag">-->
<!--            <el-option label="支持" value="1"></el-option>-->
<!--            <el-option label="不支持" value="0"></el-option>-->
<!--          </el-select>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="启用状态" v-model="filter.templetStatus"  @keydown.enter.native="getCouponTempletList()">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getCouponTempletList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="handleEdit()">添加</el-button>
        <el-button type="success" size="medium" :disabled="couponTempletList.total === 0" @click="handleExport()">导出</el-button>
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
          :cell-style= "tableAttributes.cellStyle"
          :stripe="tableAttributes.stripe"
          :border="tableAttributes.border"
          :data="couponTempletList.rows"
          v-loading="loading"
          :height="dataViewHeight"
          @selection-change="handleSelectionChange">
<!--          <el-table-column label="序号" type="index" width="50" fixed="left"></el-table-column>-->
<!--          <el-table-column type="selection" fixed="left"></el-table-column>-->
          <el-table-column label="模板编号" v-if="tableList.templetCode" prop="templetCode" min-width="120">
            <template slot-scope="scope">
              <div class="active-text" @click="switchDialog(scope.row.templetId)">{{scope.row.templetCode}}</div>
            </template>
          </el-table-column>
          <el-table-column label="模板名称" v-if="tableList.templetName" prop="templetName" min-width="140"></el-table-column>
          <el-table-column label="优惠券金额" v-if="tableList.price" prop="price" min-width="100"></el-table-column>
          <el-table-column label="总数量" v-if="tableList.total" prop="total" min-width="100"></el-table-column>
          <el-table-column label="优惠券类别" v-if="tableList.couponType" prop="couponType" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.couponType && scope.row.couponType !== 'null'">
                  {{scope.row.couponType | couponTypeMap}}
                </span>
            </template>
          </el-table-column>
          <el-table-column label="国际/国内" v-if="tableList.isInter" prop="isInter" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.isInter && scope.row.isInter !== 'null'">
                  {{scope.row.isInter | isInterMap}}
                </span>
            </template>
          </el-table-column>
          <el-table-column label="航班日期开始" v-if="tableList.startFdate" prop="startFdate" min-width="120"></el-table-column>
          <el-table-column label="航班日期结束" v-if="tableList.endFdate" prop="endFdate" min-width="120"></el-table-column>
          <el-table-column label="限制条件" v-if="tableList.condition" prop="condition" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.condition && scope.row.condition !== 'null'">
                  {{scope.row.condition | conditionMap}}
                </span>
            </template>
          </el-table-column>
          <el-table-column label="是否实名认证" v-if="tableList.authCheck" prop="authCheck" min-width="120">
            <template slot-scope="scope">
                <span v-if="scope.row.authCheck && scope.row.authCheck !== 'null'">
                  {{scope.row.authCheck | authCheckMap}}
                </span>
            </template>
          </el-table-column>
          <el-table-column label="取消返券" v-if="tableList.isReturn" prop="isReturn" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.isReturn && scope.row.isReturn !== 'null'">
                  {{scope.row.isReturn | isReturnMap}}
                </span>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" v-if="tableList.templetStatus" prop="templetStatus" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.templetStatus === '0'">禁用</span>
              <span v-if="scope.row.templetStatus === '1'">启用</span>
            </template>
          </el-table-column>
          <el-table-column label="排除航班日期范围" v-if="tableList.fdateDisable" prop="fdateDisable" min-width="160"></el-table-column>
          <el-table-column label="起飞地" v-if="tableList.afrom" prop="afrom" min-width="120"></el-table-column>
          <el-table-column label="到达地" v-if="tableList.ato" prop="ato" min-width="120"></el-table-column>
          <el-table-column label="航班号" v-if="tableList.fnumber" prop="fnumber" min-width="120"></el-table-column>
          <el-table-column label="排除航班号" v-if="tableList.fnumberDisable" prop="fnumberDisable" min-width="160"></el-table-column>
          <el-table-column label="舱位" v-if="tableList.cabin" prop="cabin" min-width="120"></el-table-column>
          <el-table-column label="排除舱位" v-if="tableList.cabinDisable" prop="cabinDisable" min-width="160"></el-table-column>
          <el-table-column label="票价上限" v-if="tableList.highestPrice" prop="highestPrice" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.highestPrice && scope.row.highestPrice !== 0">{{scope.row.highestPrice}}</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column label="票价下限" v-if="tableList.lowestPrice" prop="lowestPrice" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.lowestPrice && scope.row.lowestPrice !== 0">{{scope.row.lowestPrice}}</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column label="有效期类型" v-if="tableList.validityType" prop="validityType" min-width="120">
            <template slot-scope="scope">
                <span v-if="scope.row.validityType && scope.row.validityType !== 'null'">
                  {{scope.row.validityType | validityTypeMap}}
                </span>
            </template>
          </el-table-column>
          <el-table-column label="有效日期起" v-if="tableList.validityStart" prop="validityStart" min-width="120"></el-table-column>
          <el-table-column label="排除有效日期段" v-if="tableList.validityDisable" prop="validityDisable" min-width="160"></el-table-column>
          <el-table-column label="支付方式限制" v-if="tableList.payMethod" prop="payMethod" min-width="140">
            <template slot-scope="scope">
                <span v-if="scope.row.payMethod && scope.row.payMethod !== 'null'">
                  {{scope.row.payMethod | payLimitMap}}
                </span>
            </template>
          </el-table-column>
          <el-table-column label="支付时限" v-if="tableList.payLimit" prop="payLimit" min-width="120"></el-table-column>
          <el-table-column label="是否支持共享航班" v-if="tableList.shareFlag" prop="shareFlag" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.shareFlag === '1'">支持</div>
              <div v-else-if="scope.row.shareFlag === '0'">不支持</div>
            </template>
          </el-table-column>
          <el-table-column label="有效日期止" v-if="tableList.validityEnd" prop="validityEnd" min-width="120"></el-table-column>
          <el-table-column label="优惠类型" v-if="tableList.sailType" prop="sailType" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.sailType && scope.row.sailType !== 'null'">
                  {{scope.row.sailType | sailTypeMap}}
                </span>
            </template>
          </el-table-column>
          <el-table-column label="天数" v-if="tableList.validityDay" prop="validityDay" min-width="100"></el-table-column>
          <el-table-column label="创建时间" v-if="tableList.createTime" prop="createTime" min-width="160"></el-table-column>
          <el-table-column label="创建人姓名" v-if="tableList.createOpName" prop="createOpName" min-width="160"></el-table-column>
          <el-table-column label="已发放数量" v-if="tableList.successNum" prop="successNum" min-width="100"></el-table-column>
          <el-table-column label="操作" min-width="160" v-if="checked.length">
            <template slot-scope="scope">
              <span class="active-text mr-5" @click='handleStatus(scope.row.templetId, scope.row.templetStatus)' v-if="scope.row.templetStatus === '1'" title="启用">禁用</span>
              <span class="active-text mr-5" @click='handleStatus(scope.row.templetId, scope.row.templetStatus)' v-if="scope.row.templetStatus === '0'" title="禁用">启用</span>
              <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
              <span class="active-text mr-5" title="变更日志" @click="handleLogChange(scope.row.templetId)">变更日志</span>
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
            :total="couponTempletList.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--新增/修改弹出框-->
    <el-dialog v-dialogDrag :title="popupTitle" :visible.sync="editVisible" width="1060px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">模板编号</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="模板编号" clearable v-model="editForm.templetCode"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.templetCode">模板编号不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">模板名称</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="模板名称" clearable v-model="editForm.templetName"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.templetName">模板名称不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">优惠券金额</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="优惠券金额" clearable v-model="editForm.price"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.price">优惠券金额不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">总数量</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="总数量" clearable v-model="editForm.total"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.total">总数量不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">优惠券类别</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.couponType" placeholder="请选择优惠券类别" size="medium">
                  <el-option v-for="item in couponTypeList" :key="item.dincCode" :value="item.dincCode" :label="item.dincName"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.couponType">优惠券类别不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">国际/国内</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.isInter" placeholder="请选择国际/国内" size="medium">
                  <el-option key="0" label="不限" value="0"></el-option>
                  <el-option key="1" label="国内" value="1"></el-option>
                  <el-option key="2" label="国际" value="2"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.isInter">国际/国内不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">限制条件</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.condition" placeholder="请选择限制条件" size="medium">
                  <el-option key="0" label="不限" value="0"></el-option>
                  <el-option key="1" label="本人" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.condition">限制条件不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">是否实名认证</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.authCheck" placeholder="请选择是否实名认证" size="medium">
                  <el-option key="0" label="不限" value="0"></el-option>
                  <el-option key="1" label="实名" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.authCheck">是否实名认证不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">取消返券</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.isReturn" placeholder="请选择取消返券" size="medium">
                  <el-option key="0" label="不" value="0"></el-option>
                  <el-option key="1" label="返券" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.isReturn">取消返券不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">启用状态</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.templetStatus" placeholder="请选择启用状态" size="medium">
                  <el-option key="0" label="禁用" value="0"></el-option>
                  <el-option key="1" label="启用" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.templetStatus">启用状态不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">有效期类型</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.validityType" placeholder="请选择有效期类型" size="medium" @change="isChange($event)">
                  <el-option key="0" label="按领取时间" value="0"></el-option>
                  <el-option key="1" label="指定有效期" value="1"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.validityType">有效期类型不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">优惠类型</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.sailType" placeholder="请选择优惠类型" size="medium">
                  <el-option key="0" label="直减" value="1"></el-option>
                  <el-option key="1" label="折扣" value="2"></el-option>
                  <el-option key="2" label="免费" value="3"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.sailType">优惠类型不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">天数</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="天数" clearable v-model="editForm.validityDay"></el-input>
                <div class="warning-info" v-if="isDate && !editForm.validityDay">天数不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">有效日期起</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  value-format="yyyy-MM-dd"
                  placeholder="有效日期起"
                  v-model="editForm.validityStart">
                </el-date-picker>
                <div class="warning-info" v-if="isType && !editForm.validityStart">有效日期起不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">有效日期止</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  value-format="yyyy-MM-dd"
                  placeholder="有效日期止"
                  v-model="editForm.validityEnd">
                </el-date-picker>
                <div class="warning-info" v-if="isType && !editForm.validityEnd">有效日期止不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">票价上限</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="票价上限" clearable v-model="editForm.highestPrice"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">票价下限</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="票价下限" clearable v-model="editForm.lowestPrice"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">起飞地</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="起飞地,例：SJW" clearable v-model="editForm.afrom"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">到达地</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="到达地,例：SJW" clearable v-model="editForm.ato"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">航班号</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="航班号,例：3227" clearable v-model="editForm.fnumber"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">舱位</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="舱位,例：A 或 A/B" clearable v-model="editForm.cabin"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">排除舱位</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="排除舱位,例：A 或 A/B" clearable v-model="editForm.cabinDisable"></el-input>
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
                  v-model="editForm.endFdate">
                </el-date-picker>
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
              <div class="label">支付时限（分钟）</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="支付时限,例：30" clearable v-model="editForm.payLimit"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">是否支持共享航班</div>
              <div class="ipt-medium">
                <el-select size="medium" placeholder="请选择" v-model="editForm.shareFlag">
                  <el-option label="支持" value="1"></el-option>
                  <el-option label="不支持" value="0"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">排除航班日期范围</div>
              <div class="ipt-medium">
                <el-input
                  type="textarea"
                  :rows="3"
                  size="medium"
                  placeholder="排除航班日期范围,例：2019-08-01#2019-08-10,2019-09-01#2019-09-10"
                  v-model="editForm.fdateDisable">
                </el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">排除航班号</div>
              <div class="ipt-medium">
                <el-input
                  type="textarea"
                  :rows="3"
                  size="medium"
                  placeholder="排除航班号,例：3227,3228"
                  v-model="editForm.fnumberDisable">
                </el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">排除有效日期段</div>
              <div class="ipt-medium">
                <el-input
                  type="textarea"
                  :rows="3"
                  size="medium"
                  placeholder="排除有效日期段,例：2019-08-01#2019-08-10,2019-09-01#2019-09-10"
                  v-model="editForm.validityDisable">
                </el-input>
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
    <!--变更日志查询弹出框-->
    <ChangeLogDiaLog ref="changeLogAby"></ChangeLogDiaLog>
    <!--模板详情弹出框-->
    <TempletDiaLog ref="templetAby"></TempletDiaLog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ChangeLogDiaLog from '../../../../components/ChangeLogDiaLog'
import TempletDiaLog from '../../../../components/couponTempletDetail'
import { excelList, getRouteName, getcouponType } from '../../../../utils/index'
import { queryMetCouponTempletList, queryAddMetCouponTemplet, queryUpdateMetCouponTemplet, queryUpdateMetCouponTempletStatus } from './api'
import fieldMap from './refer'
import { checkAttrs } from '../../../../mixins'
import { computWidth } from '../../../../mixins/computWidt'

export default {
  name: 'CouponTemplet',
  data () {
    return {
      componentName: 'couponTemplet',
      loading: false,
      dataViewHeight: null,
      filter: {
        // shareFlag: '',
        templetCode: '', // 模板编号
        templetName: '', // 模板名称
        createTimeStart: '', // 创建时间开始
        createTimeEnd: '', // 创建时间结束
        startFdate: '', // 航班日期开始
        endFdtae: '', // 航班日期结束
        fnumber: '', // 航班号
        afrom: '', // 出发
        ato: '', // 到达
        cabin: '', // 舱位
        templetStatus: '', // 启用状态
        page: '', // 当前页
        rows: '' // 每页查询数量
      }, // 查询条件表单
      couponTempletList: {}, // 表格数据表单
      tableList: {
        templetCode: true, // 模板编号
        templetName: true, // 模板名称
        price: true, // 优惠券金额
        total: true, // 总数量
        couponType: true, // 优惠券类别false
        isInter: true, // 国际/国内
        startFdate: false, // 航班日期开始
        endFdate: false, // 航班日期结束
        condition: true, // 限制条件
        authCheck: true, // 是否实名认证 0不限，1实名
        isReturn: true, // 取消返券 0不，1返券
        templetStatus: true, // 启用状态
        fdateDisable: false, // 排除航班日期范围
        afrom: false, // 起飞地
        ato: false, // 到达地
        fnumber: false, // 航班号
        fnumberDisable: false, // 排除航班号
        cabin: false, // 舱位
        cabinDisable: false, // 排除舱位
        highestPrice: false, // 票价上限
        lowestPrice: false, // 票价下限
        validityType: true, // 有效期类型,0按领取时间、1指定有效期
        validityStart: false, // 有效日期起
        validityDisable: false, // 排除有效日期段
        payMethod: false, // 支付方式限制
        payLimit: false, // 支付时限
        shareFlag: false,
        validityEnd: false, // 有效日期止
        sailType: true, // 优惠类型，1直减，2折扣，3免费
        validityDay: false, // 天数
        createTime: false, // 创建时间
        successNum: false, // 已发放数量
        createOpName: false // 创建人姓名
      },
      editVisible: false, // 添加/修改弹出框 -- 显示隐藏
      isReset: false, // 添加/修改弹出框 -- 切换添加/修改
      isEmpty: false, // 添加/修改弹出框 -- 输入框判空
      popupTitle: '', // 添加/修改弹出框 -- 标题
      editForm: {
        shareFlag: '0',
        templetCode: '',
        templetName: '',
        price: '',
        total: '',
        couponType: '',
        isInter: '',
        startFdate: '',
        endFdate: '',
        condition: '',
        authCheck: '',
        isReturn: '',
        templetStatus: '1',
        fdateDisable: '',
        afrom: '',
        ato: '',
        fnumber: '',
        fnumberDisable: '',
        cabin: '',
        cabinDisable: '',
        highestPrice: '',
        lowestPrice: '',
        validityType: '',
        validityStart: '',
        validityDisable: '',
        payMethod: '',
        payLimit: '',
        validityEnd: '',
        sailType: '',
        validityDay: ''
      }, // 添加/修改弹出框 -- 数据表单
      isDate: false,
      isType: false,
      checkList: fieldMap,
      checkedAll: false,
      isIndeterminate: false
    }
  },
  created () {
    this.judgeChannelList()
    this.getCouponTempletList(1, this.pagination.pageSize)
  },
  mixins: [checkAttrs, computWidth],
  components: {
    ChangeLogDiaLog,
    TempletDiaLog
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      couponTypeList: state => state.app.couponTypeList
    })
  },
  methods: {
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.couponTypeList.length) {
        getcouponType()
      }
    },

    // 分页导航
    handleSizeChange (pages) {
      this.getCouponTempletList(null, pages)
    },
    handleCurrentChange (page) {
      this.getCouponTempletList(page, null)
    },

    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 获取表格数据
    getCouponTempletList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      queryMetCouponTempletList(this.filter).then(res => {
        this.couponTempletList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },

    // 重置搜索条件
    resetFilter () {
      this.filter = {
        // shareFlag: '',
        templetCode: '',
        templetName: '',
        createTimeStart: '',
        createTimeEnd: '',
        startFdate: '',
        endFdtae: '',
        fnumber: '',
        afrom: '',
        ato: '',
        cabin: '',
        templetStatus: ''
      }
      // this.initDate()
      this.getCouponTempletList(1, this.pagination.pageSize)
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
        queryUpdateMetCouponTempletStatus(data).then(res => {
          this.$message.success(res.message)
          this.getCouponTempletList()
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消修改')
      })
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

    // 添加/修改弹出框 -- 数据处理
    hangdleParams (params) {
      this.editForm.shareFlag = params.shareFlag
      this.editForm.templetId = params.templetId
      this.editForm.templetCode = params.templetCode
      this.editForm.templetName = params.templetName
      this.editForm.price = params.price
      this.editForm.total = params.total
      this.editForm.couponType = params.couponType
      this.editForm.isInter = params.isInter
      this.editForm.startFdate = params.startFdate
      this.editForm.endFdate = params.endFdate
      this.editForm.condition = params.condition
      this.editForm.authCheck = params.authCheck
      this.editForm.isReturn = params.isReturn
      this.editForm.templetStatus = params.templetStatus
      this.editForm.fdateDisable = params.fdateDisable
      this.editForm.afrom = params.afrom
      this.editForm.ato = params.ato
      this.editForm.fnumber = params.fnumber
      this.editForm.fnumberDisable = params.fnumberDisable
      this.editForm.cabin = params.cabin
      this.editForm.cabinDisable = params.cabinDisable
      this.editForm.highestPrice = params.highestPrice === 0 ? '' : params.highestPrice + ''
      this.editForm.lowestPrice = params.lowestPrice === 0 ? '' : params.lowestPrice + ''
      this.editForm.validityType = params.validityType
      this.editForm.validityStart = params.validityStart
      this.editForm.validityDisable = params.validityDisable
      this.editForm.payMethod = params.payMethod ? params.payMethod.split(',') : ''
      this.editForm.payLimit = params.payLimit
      this.editForm.validityEnd = params.validityEnd
      this.editForm.sailType = params.sailType
      this.editForm.validityDay = params.validityDay === 0 ? '' : params.validityDay + ''
    },

    isChange (e) {
      if (e) {
        this.isType = false
        this.isDate = false
      }
    },

    // 添加/修改弹出框 -- 提交
    saveEdit () {
      if (this.editForm.templetCode && this.editForm.templetName && this.editForm.price && this.editForm.total && this.editForm.couponType && this.editForm.isInter && this.editForm.condition && this.editForm.authCheck && this.editForm.isReturn && this.editForm.templetStatus && this.editForm.validityType && this.editForm.sailType) {
        let data = JSON.parse(JSON.stringify(this.editForm))
        if (data.validityType === '0') {
          if (data.validityDay) {
            this.submitData(data)
          } else {
            this.isDate = true
            this.isType = false
          }
        } else if (data.validityType === '1') {
          if (data.validityStart && data.validityEnd) {
            this.submitData(data)
          } else {
            this.isType = true
            this.isDate = false
          }
        }
      } else {
        this.isEmpty = true
      }
    },

    // 添加/修改弹出框 -- 提交: 数据处理
    submitData (data) {
      data.payMethod = data.payMethod ? data.payMethod.join(',') : ''
      if (data.highestPrice === '') {
        data.highestPrice = 0
      }
      if (data.lowestPrice === '') {
        data.lowestPrice = 0
      }
      if (data.validityDay === '') {
        data.validityDay = 0
      }
      if (this.isReset === false) {
        this.updateParamsData(data)
      } else {
        this.addParamsData(data)
      }
    },

    // 添加弹出框 -- 提交接口
    addParamsData (data) {
      queryAddMetCouponTemplet(data).then(res => {
        this.editVisible = false
        this.getCouponTempletList()
        this.$message.success(res.message)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },

    // 修改弹出框 -- 提交接口
    updateParamsData (data) {
      queryUpdateMetCouponTemplet(data).then(res => {
        this.editVisible = false
        this.getCouponTempletList()
        this.$message.success(res.message)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },

    // 添加/修改弹出框 -- 重置
    resetEdit () {
      this.editForm = {
        shareFlag: '0',
        templetCode: '',
        templetName: '',
        price: '',
        total: '',
        couponType: '',
        isInter: '',
        startFdate: '',
        endFdate: '',
        condition: '',
        authCheck: '',
        isReturn: '',
        templetStatus: '1',
        fdateDisable: '',
        afrom: '',
        ato: '',
        fnumber: '',
        fnumberDisable: '',
        cabin: '',
        cabinDisable: '',
        highestPrice: '',
        lowestPrice: '',
        validityType: '',
        validityStart: '',
        validityDisable: '',
        payMethod: '',
        payLimit: '',
        validityEnd: '',
        sailType: '',
        validityDay: ''
      }
      this.isEmpty = false
      this.isType = false
      this.isDate = false
    },

    // 导出
    handleExport () {
      let data = JSON.parse(JSON.stringify(this.filter))
      data.start = 1
      data.end = this.couponTempletList.total
      delete data.page
      delete data.rows
      let params = {
        data: data,
        url: 'metCouponTemplet/exportMetCouponTemplet',
        name: getRouteName('/marketAction'),
        type: 'xls'
      }
      excelList(params, this)
    },

    // 变更日志查询
    handleLogChange (id) {
      let url = '/metCouponTemplet/getUpdateLog'
      this.$refs.changeLogAby.initComponent(url, id)
    },

    // 优惠券模板详情
    switchDialog (id) {
      this.detailParamsData(id)
    },

    // 调用优惠券模板详情
    detailParamsData (id) {
      this.$refs.templetAby.initComponent(id)
    }
  }
}
</script>

<style scoped lang="scss"></style>
