<template>
  <div id="FreightRateRule" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt w-180">
          <el-input size="mini" clearable placeholder="批次号" title="批次号" v-model="seParams.ruleCode" @keydown.enter.native="initList()"></el-input>
        </div>
        <div class="search-item search-ipt w-180">
          <el-input size="mini" clearable placeholder="出发城市三字码" title="出发城市三字码" v-model="seParams.departureAirport" @keydown.enter.native="initList()"></el-input>
        </div>
        <div class="search-item search-ipt w-180">
          <el-input size="mini" clearable placeholder="到达城市三字码" title="到达城市三字码" v-model="seParams.arrivalAirport" @keydown.enter.native="initList()"></el-input>
        </div>
        <div class="search-item search-ipt w-180">
          <el-input size="mini" clearable placeholder="舱位名称" title="舱位名称" v-model="seParams.cabin" @keydown.enter.native="initList()"></el-input>
        </div>
        <div class="search-item search-ipt w-180">
          <el-select size="mini" clearable placeholder="是否过期" title="是否过期" v-model="seParams.isTimeOut">
            <!--<el-option value="2" label="全部"></el-option>-->
            <el-option value="1" label="是"></el-option>
            <el-option value="0" label="否"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt w-180">
          <el-select size="mini" clearable placeholder="是否禁用" title="是否禁用" v-model="seParams.ruleStatus">
            <!--<el-option value="2" label="全部"></el-option>-->
            <el-option value="1" label="禁用"></el-option>
            <el-option value="0" label="启用"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt w-180">
          <el-input size="mini" clearable placeholder="航班号" title="航班号" v-model="seParams.flightno" @keydown.enter.native="initList()"></el-input>
        </div>
        <div class="search-item search-ipt w-180">
          <el-select size="mini" clearable v-model='seParams.discountType' title="折扣类型" placeholder='折扣类型'>
            <!--<el-option value="" label="全部"></el-option>-->
            <el-option
              v-for='item in rule'
              :key='item.id'
              :label='item.dincName'
              :value='item.dincCode'>
            </el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt w-180">
          <el-input size="mini" clearable placeholder="建立人" title="建立人" v-model="seParams.createOpid" @keydown.enter.native="initList()"></el-input>
        </div>
        <div class="search-item search-ipt w-180">
          <el-date-picker
            v-model="seParams.createDateStart"
            class="w-160"
            size="mini"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="申请开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt w-180">
          <el-date-picker
            v-model="seParams.createDateEnd"
            class="w-160"
            size="mini"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="申请截止日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt w-180">
          <el-select v-model='seParams.channel' clearable placeholder='渠道类型' value-key="chalId" size='mini' style='width: 160px' title="渠道类型">
            <el-option
              v-for='item in channelList'
              :key='item.chalId'
              :label='item.chalName'
              :value='item.chalCode'>
            </el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt w-180">
          <el-input size="mini" clearable placeholder="小星星编号" title="小星星编号" v-model="seParams.policyId" @keydown.enter.native="initList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-button  type="primary" :loading='false' size='mini' @click="search()">查询</el-button>
          <el-button size='mini' @click='reseting()'>重置</el-button>
        </div>
      </div>
      <!--第三排-->
      <div class="btn-container">
        <el-button size="mini" @click='rescive(null)'>添加</el-button>
        <el-button type='danger' size='mini' :disabled='dataArr.length === 0' @click="del(null)">批量删除</el-button>
        <el-button size='mini' @click="start('start')" :disabled='dataArr.length === 0'>启用</el-button>
        <el-button size='mini' @click="start('stop')" :disabled='dataArr.length === 0'>禁用</el-button>
        <el-button type="success" size='mini' @click="excel()" :disabled='!priceList.length'>导出Excel文件</el-button>
        <el-button type="success" size='mini' @click="excel(null)">导出Excel模版</el-button>
        <el-button size='mini' @click="dis()">上传规则文件</el-button>
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
    <!--表格-->
    <div class="main">
      <div class="column-btn" @click="switchColumn">
        <i class="el-icon-arrow-up"></i>
      </div>
      <div class="table-container">
        <el-table
          class="table-item"
          :border="tableAttributes.border"
          :data="priceList"
          @row-click="clickRow"
          :height='dataViewHeight'
          ref="moviesTable"
          @selection-change='handleSelectionChange'
          v-loading='loading'
          :header-cell-class-name="handleCellStyle"
          :cell-class-name="handleCellStyle"
          row-key="lowestpriceid"
          style="font-size: 10px;">
          <el-table-column type='selection' width="40"></el-table-column>
          <!--          show-overflow-tooltip-->
          <el-table-column key="1" v-if="tableList.ruleCode" label='批次号' min-width="42">
            <template slot-scope="scope">
              <div class="blue-text">{{scope.row.ruleCode}}</div>
            </template>
          </el-table-column>
          <el-table-column key="27" v-if="tableList.policyId" label='小星星编号' min-width="42">
            <template slot-scope="scope">
              <div>{{scope.row.policyId}}</div>
            </template>
          </el-table-column>
          <el-table-column key="2" v-if="tableList.flightno" label='航班号' prop='flightno' min-width="42"></el-table-column>
          <el-table-column key="3" v-if="tableList.departureAirport" label='始发地' prop='departureAirport' min-width="42"></el-table-column>
          <el-table-column key="4" v-if="tableList.arrivalAirport" label='目的地'  prop='arrivalAirport' min-width="42"></el-table-column>
          <el-table-column key="5" v-if="tableList.operatingcarrier" label='承运方' prop='operatingcarrier' min-width="42"></el-table-column>
          <el-table-column key="6" v-if="tableList.marketcarrier" label='市场方' prop='marketcarrier' min-width="42"></el-table-column>
          <el-table-column key="7" v-if="tableList.saleBeginTime" label='销售开始日期' prop='saleBeginTime' min-width="78">
            <template slot-scope='scope'>
              <div v-if="scope.row.saleBeginTime">
                <div v-for="(item, index) in scope.row.saleBeginTime.split(' ')" :key="index">
                  <span v-if="item !== ''">{{item}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column key="8" v-if="tableList.saleEndTime" label='销售截止日期' prop='saleEndTime' min-width="78">
            <template slot-scope='scope'>
              <div v-if="scope.row.saleEndTime">
                <div v-for="(item, index) in scope.row.saleEndTime.split(' ')" :key="index">
                  <span v-if="item !== ''">{{item}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column key="9" v-if="tableList.flightBeginDate" sortable label='航班开始' prop='flightBeginDate' min-width="78"></el-table-column>
          <el-table-column key="10" v-if="tableList.flightEndDate" sortable label='航班截止' prop='flightEndDate' min-width="78"></el-table-column>
          <el-table-column key="11" v-if="tableList.fdateDisable" label='排除航班日期段' prop='fdateDisable' min-width="90">
            <template slot-scope='scope'>
              <div v-if="scope.row.fdateDisable">
                <div v-for="(item, index) in scope.row.fdateDisable.split(',')" :key="index">
                  <span v-if="item !== ''">{{ item }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column key="12" v-if="tableList.cabin" sortable label='舱位' prop='cabin' min-width="58"></el-table-column>
          <el-table-column key="13" v-if="tableList.channel" label='渠道编号' prop='channel' min-width="78">
            <template slot-scope="scope">
              {{scope.row.channel | channelMap}}
            </template>
          </el-table-column>
          <el-table-column key="14" v-if="tableList.discountType" label='折扣类型' prop='discountType' min-width="60"></el-table-column>
          <el-table-column key="25" v-if="tableList.actyTag" label="活动标签" prop="actyTagName" min-width="80"></el-table-column>
          <el-table-column key="26" v-if="tableList.actyId" label="关联活动" prop="actyName" min-width="120"></el-table-column>
          <el-table-column key="15" v-if="tableList.discountDirection" label='折扣' prop='discountDirection' min-width="30" :formatter='discountDirection'></el-table-column>
          <el-table-column key="16" v-if="tableList.discountValue" label='具体值' min-width="44">
            <template slot-scope='scope'>
              <span>{{scope.row.discountValue}}</span>
            </template>
          </el-table-column>
          <el-table-column key="17" v-if="tableList.applyFreightType" label='运价类型' prop='applyFreightType' min-width="70"></el-table-column>
          <el-table-column key="24" v-if="tableList.effectivePeople" label="生效人群" prop="effectivePeopleMap" min-width="80">
          </el-table-column>
          <el-table-column key="18" v-if="tableList.createDate" sortable label='创建时间' prop='createDate' min-width="78">
            <template slot-scope='scope'>
              <div v-if="scope.row.createDate">
                <div v-for="(item, index) in scope.row.createDate.split(' ')" :key="index">
                  <span v-if="item !== ''">{{item}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column key="19" v-if="tableList.createOpid" label='创建人' prop='createOpid' min-width="58"></el-table-column>
          <el-table-column key="20" v-if="tableList.modifyDate" label='修改时间' prop='modifyDate' min-width="78">
            <template slot-scope='scope'>
              <div v-if="scope.row.modifyDate">
                <div v-for="(item, index) in scope.row.modifyDate.split(' ')" :key="index">
                  <span v-if="item !== ''">{{item}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column key="21" v-if="tableList.modifyOpid" label='修改人' prop='modifyOpid' min-width="58"></el-table-column>
          <el-table-column key="22" v-if="tableList.weekLimit" label='航班周期' prop='weekLimit' min-width="58"></el-table-column>
          <el-table-column key="23" v-if="tableList.flightnoDisable" label='排除航班号' prop='flightnoDisable' min-width="74"></el-table-column>
          <el-table-column label='操作' width="92" v-if="checked.length">
            <template slot-scope='scope'>
              <span class="active-text mr-5" title="启用" @click='handledit({ ruleId: scope.row.ruleId, ruleStatus: scope.row.ruleStatus })' v-if="scope.row.ruleStatus === '0'">禁用</span>
              <span class="active-text mr-5" @click='handledit({ ruleId: scope.row.ruleId, ruleStatus: scope.row.ruleStatus })' v-if="scope.row.ruleStatus === '1'" title="禁用">启用</span>
              <span class="active-text mr-5" title="编辑" @click="rescive(scope.row, 'revise')">编辑</span>
              <span class="danger-text mr-5" title="删除" @click="del(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--分页-->
    <div class="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="seParams.page"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!--上传文件弹框-->
    <el-dialog title="上传规则文件" :visible.sync="dialogFormVisible" width="400px">
      <div class="upload">
        <el-upload
          class="upload-demo"
          drag
          action=""
          :on-change="handleLoad"
          :on-error="handerror"
          :http-request="uploadSectionFile"
          name="importExcel"
          :file-list="fileList"
          :auto-upload="false">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <div class="line"></div>
        <div class="mine">
          <el-button style="margin-left: 10px;" size="mini" type="primary" @click="submitUpload">提交</el-button>
          <el-button style="margin-left: 10px;" size="mini" @click="nosubmitUpload">返回</el-button>
        </div>
      </div>
    </el-dialog>
    <!--新增、修改弹框-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogAdd" width="720px" top="2vh" style="overflow: hidden;">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column" style="width: 440px">
              <div class="label">出发/到达城市三字码</div>
              <div class="ipt-mini">
                <el-input class="fl" size="mini" clearable placeholder="例：SJW 或 SJW/CDE" v-model="msg.departureAirport" style="width: 190px"></el-input>
                <div class="fl cityChange" :span="2" @click="cityChange">换</div>
                <el-input class="fl" size="mini" clearable placeholder="例：SJW 或 SJW/CDE" v-model="msg.arrivalAirport" style="width: 190px"></el-input>
                <!--                <div class="warning-info" v-if="flag && !msg.departureAirport && !msg.arrivalAirport">出发/到达城市三字码不可为空</div>-->
              </div>
            </div>
            <div class="column">
              <div class="label required">渠道编号</div>
              <div class="ipt-mini">
                <el-select v-model='msg.channel' clearable placeholder='渠道类型' multiple size='mini' title="必填项" collapse-tags>
                  <el-option
                    v-for='item in channelList'
                    :key='item.chalId'
                    :label='item.chalName'
                    :value='item.chalCode'>
                  </el-option>
                </el-select>
                <div class="warning-info" v-if="flag && !msg.channel.length">渠道编号不可为空</div>
              </div>
            </div>
          </div>
          <!--第二排-->
          <div class="row">
            <div class="column">
              <div class="label required">航班号</div>
              <div class="fl ipt-mini">
                <el-input size="mini" clearable v-model="msg.flightno" placeholder="例：3327 或 3327/3328"></el-input>
                <div class="warning-info" v-if="flag && !msg.flightno">航班号不可为空，通配符为*</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">舱位</div>
              <div class="fl ipt-mini">
                <el-input size="mini" clearable v-model="msg.cabin" placeholder="舱位,例：A 或 A/B"></el-input>
                <div class="warning-info" v-if="flag && !msg.cabin">舱位不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">具体值</div>
              <div class="ipt-mini">
                <el-input size="mini" clearable v-model="msg.discountValue" placeholder="加减值或固定销售价"></el-input>
                <div class="warning-info" v-if="flag && !msg.discountValue">加减值不可为空</div>
              </div>
            </div>
          </div>
          <!--第三排-->
          <div class="row">
            <div class="column">
              <div class="label required">折扣类型</div>
              <div class="ipt-mini">
                <el-select v-model='msg.discountType' @change="discountType" clearable placeholder='折扣类型' value-key="chalId" size='mini' title="必填项">
                  <el-option
                    v-for='item in rule'
                    :key='item.id'
                    :label='item.dincName'
                    :value='item.dincCode'>
                  </el-option>
                </el-select>
                <div class="warning-info" v-if="flag && !msg.discountType">折扣类型不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">折扣方向</div>
              <div class="ipt-mini">
                <el-select :disabled='typeFlag' v-model='msg.discountDirection' clearable placeholder='折扣方向' value-key="chalId" size='mini' title="必填项">
                  <el-option
                    v-for='item in discount'
                    :key='item.dincId'
                    :label='item.dincName'
                    :value='item.dincCode'>
                  </el-option>
                </el-select>
                <div class="warning-info" v-if="flag && !msg.discountDirection && !typeFlag">折扣方向不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">生效人群</div>
              <div class="ipt-mini">
                <el-select v-model="effectivePeople" multiple size="mini">
                  <el-option
                    v-for="item in passengerList"
                    :key="item.dincId"
                    :label="item.dincName"
                    :value="item.dincCode"></el-option>
                </el-select>
                <div class="warning-info" v-show="flag && !effectivePeople.length">请选择生效人群</div>
              </div>
            </div>
          </div>
          <!--第四排-->
          <div class="row">
            <div class="column">
              <div class="label">销售开始日期</div>
              <div class="fl ipt-mini ">
                <el-date-picker
                  size="mini"
                  v-model="msg.saleBeginTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="选择日期时间" style="width: 190px">
                </el-date-picker>
              </div>
            </div>
            <div class="column">
              <div class="label">销售结束日期</div>
              <div class="fl ipt-mini">
                <el-date-picker
                  v-model="msg.saleEndTime"
                  size="mini"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="选择日期时间" style="width: 190px">
                </el-date-picker>
              </div>
            </div>
            <div class="column">
              <div class="label">活动标签</div>
              <div class="fl ipt-mini">
                <el-select v-model="msg.actyTag" size="mini">
                  <el-option  label="全部" value=""></el-option>
                  <el-option v-for="item in typeTags" :key="item.dincCode" :label="item.dincName" :value="item.dincCode"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <!--第五排-->
          <div class="row">
            <div class="column">
              <div class="label">航班开始日期</div>
              <div class="fl ipt-mini">
                <el-date-picker
                  v-model="msg.flightBeginDate"
                  size="mini"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期时间" style="width: 190px">
                </el-date-picker>
              </div>
            </div>
            <div class="column">
              <div class="label">航班结束日期</div>
              <div class="fl ipt-mini">
                <el-date-picker
                  v-model="msg.flightEndDate"
                  size="mini"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期时间" style="width: 190px">
                </el-date-picker>
              </div>
            </div>
            <div class="column">
              <div class="label">航班周期</div>
              <div class="ipt-mini">
                <el-input size="mini" clearable v-model="msg.weekLimit" placeholder="航班周期,例:1或1/2"></el-input>
              </div>
            </div>
          </div>
          <!--第六排-->
          <div class="row">
            <div class="column">
              <div class="label">启用/禁用</div>
              <div class="fl ipt-mini">
                <el-select size="mini" placeholder="是否禁用" v-model="msg.ruleStatus">
                  <el-option value="0" label="启用"></el-option>
                  <el-option value="1" label="禁用"></el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label">备注</div>
              <div class="ipt-mini">
                <el-input
                  type="textarea"
                  :rows="2"
                  size="mini"
                  placeholder="备注"
                  v-model="msg.remark">
                </el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">关联活动</div>
              <div class="ipt-mini">
                <el-select size="mini" v-model="msg.actyId" clearable>
                  <el-option v-for="item in actyList" :key="item.actyId" :label="item.actyName" :value="item.actyId"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="ipt-mini">
                <el-button size="mini" @click="addTemp" >新增</el-button>
              </div>
            </div>
          </div>
          <div class="row" v-for="(item, index) in dateList" :key="item.id">
            <div class="column">
              <div class="label">排除航班开始日期</div>
              <div class="ipt-mini">
                <el-date-picker
                  v-model="item.startFdateDisable"
                  size="mini"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  type="datetime"
                  placeholder="排除航班开始日期"
                  @change="isChange($event)"
                  style="width: 190px">
                </el-date-picker>
                <div class="warning-info" v-if="isShow && !item.startFdateDisable&& dateList.length > 1">排除航班开始日期不可为空</div>
                <div class="warning-info" v-if="isShow1 && !item.startFdateDisable && index === dateList.length - 1">排除航班开始日期不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">排除航班截止日期</div>
              <div class="ipt-mini">
                <el-date-picker
                  v-model="item.endFdateDisable"
                  size="mini"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  type="datetime"
                  placeholder="排除航班截止日期"
                  style="width: 190px">
                </el-date-picker>
                <div class="warning-info" v-if="isShow && !item.endFdateDisable && dateList.length > 1">排除航班截止日期不可为空</div>
                <div class="warning-info" v-if="isShow1 && !item.endFdateDisable && index === dateList.length - 1">排除航班截止日期不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label"></div>
              <div class="ipt-mini flex" style="padding-top: 20px">
                <el-button v-if="index !== 0" size="mini" type="primary" icon="el-icon-delete" @click="delTemp(index)" >删除</el-button>
              </div>
            </div>
          </diV>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="mini" type="primary" @click="refer">提交</el-button>
          <el-button size="mini" v-if="ref === 'add'" @click="reset">重置</el-button>
          <el-button size="mini" @click="back">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import * as types from './api'
import { getChannelList, isEmpty, excelList, getRouteName, getCurrentDate } from '../../utils/index'
import fieldMap from './refer'
import { checkAttrs } from '../../mixins'
import { computWidth } from '../../mixins/computWidt'
import { fetchProductList } from '@/api'

export default {
  name: 'FreightRateRule',
  data () {
    return {
      actyList: [],
      typeTags: [],
      componentName: 'freightRateRule',
      checkedAll: false,
      isIndeterminate: false,
      tableList: {
        effectivePeople: false,
        ruleCode: true,
        // ruleName: true,
        flightno: true,
        departureAirport: true,
        arrivalAirport: true,
        operatingcarrier: true,
        marketcarrier: true,
        saleBeginTime: true,
        saleEndTime: true,
        flightBeginDate: true,
        flightEndDate: true,
        fdateDisable: true,
        cabin: true,
        channel: false,
        discountType: true,
        actyTag: false,
        actyId: false,
        discountDirection: true,
        discountValue: true,
        applyFreightType: true,
        createDate: false,
        createOpid: false,
        modifyDate: false,
        modifyOpid: false,
        weekLimit: false,
        flightnoDisable: false,
        policyId: true
      },
      checkList: fieldMap,
      seParams: {
        ruleCode: '',
        // ruleName: '',
        departureAirport: '',
        arrivalAirport: '',
        cabin: '',
        isTimeOut: '',
        ruleStatus: '',
        flightno: '',
        discountType: '',
        createDateStart: '',
        createDateEnd: '',
        createOpid: '',
        channel: '',
        policyId:'',
        page: 1,
        rows: 20
      },
      rule: [], //  规则
      sellTime: '',
      priceList: [],
      dataViewHeight: null,
      loading: false,
      dataArr: [],
      dialogFormVisible: false,
      fileList: [],
      date: [],
      total: null,
      msg: {
        actyId: '',
        actyTag: '',
        // ruleName: '',
        flightno: '',
        cabin: '',
        departureAirport: '',
        arrivalAirport: '',
        saleBeginTime: '',
        saleEndTime: '',
        flightBeginDate: '',
        flightEndDate: '',
        channel: [],
        discountType: '',
        discountDirection: '',
        discountValue: '',
        remark: '',
        ruleStatus: '',
        weekLimit: ''
      }, //  添加修改
      dateList: [], // 排除时间段
      isShow: false,
      isShow1: false,
      dialogAdd: false,
      discount: [], //  折扣方向
      dialogTitle: '',
      applyFreightType: [],
      ref: '',
      flag: false,
      tFalg: true,
      typeFlag: false,
      file: {},
      effectivePeople: [], // 生效人群,默认成人、儿童
      passengerList: [] // 乘客类型
    }
  },
  created () {
    this.judgeChannelList()
    // 运价
    this.discountDirectio()
    this.seParams.rows = this.pagination.pageSize
    // this.initData()
    this.fetchActy()
  },
  mixins: [checkAttrs, computWidth],
  filters: {
    upper: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.toUpperCase()
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList
    })
  },
  methods: {
    // 获取活动标签列表
    fetchActyTag () {
      fetchProductList({ type: 'ACTY_TAG' })
        .then(res => {
          this.typeTags = res.rows
          this.queryPassengerType()
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    // 获取活动列表
    fetchActy () {
      types.getActyList()
        .then(res => {
          console.log(res)
          this.actyList = res.rows
          this.fetchActyTag()
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    // 获取生效人群数据
    queryPassengerType () {
      this.effectivePeople = []
      fetchProductList({ type: 'EFFECTIVE_PEOPLE' })
        .then(res => {
          this.initData()
          this.passengerList = res.rows
          this.passengerList.forEach(item => {
            if (item.dincName === '成人' || item.dincName === '儿童') {
              this.effectivePeople.push(item.dincCode)
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleCellStyle () {
      return 'table-th'
    },
    discountType (val) {
      if (val === '0') {
        this.msg.discountDirection = ''
        this.msg.discountValue = ''
        this.typeFlag = true
      } else if (val === '2') {
        this.msg.discountDirection = '-'
        this.typeFlag = true
      } else {
        this.typeFlag = false
      }
    },
    initList () {
      this.seParams.page = 1
      this.seParams.createDateEnd = this.date.length > 0 ? this.date[1] : ''
      this.seParams.createDateStart = this.date.length > 0 ? this.date[0] : ''
      this.initData()
    },
    clickRow (row) {
      if (this.tFalg) this.$refs.moviesTable.toggleRowSelection(row)
      this.tFalg = true
    },
    discountDirectio () {
      // 折扣方向
      types.discountDirection({ type: 'discountDirection' }).then(res => {
        if (res.isSuccessOrfail === 'SUCCESS') {
          this.discount = res.rows
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
      //  运价
      types.discountDirection({ type: 'applyFreightType' }).then(res => {
        if (res.isSuccessOrfail === 'SUCCESS') {
          this.applyFreightType = res.rows
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
      //  折扣类型
      types.querydictsByType({ type: 'discountType' }).then(res => {
        if (res.isSuccessOrfail === 'SUCCESS') {
          this.rule = res.rows
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    //  弹框提交
    refer () {
      this.flag = true
      let tMsg = this.msg
      if (!this.effectivePeople.length) {
        return false
      }
      if (this.typeFlag) {
        if (isEmpty(tMsg.channel) || isEmpty(tMsg.flightno) || isEmpty(tMsg.cabin)) {
          return false
        }
      }
      if (!this.typeFlag) {
        if (isEmpty(tMsg.channel) || isEmpty(tMsg.flightno) || isEmpty(tMsg.cabin) || isEmpty(tMsg.discountValue) || isEmpty(tMsg.discountDirection) || isEmpty(tMsg.discountValue)) {
          return false
        }
      }
      // 1月11号 让加限制 直减投放或特价投放只能是0-1之间的数 -- 2月4号 限制又让去掉了
      // if (this.msg.discountType === '3' || this.msg.discountType === '2') {
      //   if (this.msg.discountValue < 0 || this.msg.discountValue > 1) {
      //     this.$message({
      //       type: 'error',
      //       message: '直减投放和特价投放只能是0-1之间的数'
      //     })
      //     return false
      //   }
      // }
      let obj = JSON.parse(JSON.stringify(this.msg))
      let i = this.dateList.length - 1
      if (this.dateList.length > 1) {
        if (this.dateList[i].startFdateDisable && this.dateList[i].startFdateDisable) {
          this.paramsData(1, obj)
        } else {
          this.isShow = true
        }
      } else {
        this.paramsData(2, obj)
      }
    },
    paramsData (type, obj) {
      let dateData = []
      for (let item of this.dateList) {
        if (item.startFdateDisable && item.endFdateDisable) {
          let date = item.startFdateDisable + '#' + item.endFdateDisable
          dateData.push(date)
        } else {
          if (type === 1) {
            dateData = []
            this.isShow = true
            return
          } else {
            dateData = []
          }
        }
      }
      obj.fdateDisable = dateData.join(',')
      obj.channel = obj.channel.join(',')
      obj.cabin = this.$options.filters.upper(this.msg.cabin)
      if (this.msg.departureAirport === '') {
        obj.departureAirport = '*'
      } else {
        obj.departureAirport = this.$options.filters.upper(this.msg.departureAirport)
      }
      if (this.msg.arrivalAirport === '') {
        obj.arrivalAirport = '*'
      } else {
        obj.arrivalAirport = this.$options.filters.upper(this.msg.arrivalAirport)
      }
      obj.effectivePeople = this.effectivePeople.join(',')
      console.log(obj)
      // return false
      this.updateBefore(obj)
    },
    updateBefore (obj) {
      delete obj.createOpid
      delete obj.createDate
      delete obj.modifyOpid
      delete obj.modifyDate
      types.addOrUpdateBefore(obj).then(res => {
        if (res.obj) {
          let ruleCode = res.obj.ruleCode
          let discountType = res.obj.discountType
          let discountPath = res.obj.discountDirection
          let discountValue = res.obj.discountValue
          let content = '已维护批次号：' + ruleCode + '，' + discountType + '：' + discountPath + discountValue
          let title = ''
          if (this.ref === 'add') {
            title = content + '，是否继续添加？'
          } else {
            title = content + '，是否继续修改？'
          }
          this.$confirm(title, '提示', {
            confirmButtonClass: '确定',
            cancelButtonClass: '取消',
            type: 'error'
          }).then(() => {
            if (this.ref === 'add') {
              // 添加
              this.getAddFreightRate(obj)
            } else {
              //  修改
              this.getUpdateFreightRate(obj)
            }
          }).catch(() => {
            this.$message.info('操作取消')
          })
        } else {
          if (this.ref === 'add') {
            // 添加
            this.getAddFreightRate(obj)
          } else {
            //  修改
            this.getUpdateFreightRate(obj)
          }
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },

    // 添加弹出框 -- 提交
    getAddFreightRate (obj) {
      delete obj.ruleId
      types.addFreightRate(obj).then(res => {
        this.dialogAdd = false
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.initData()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },

    //  修改弹出框 -- 提交
    getUpdateFreightRate (obj) {
      obj['ruleId'] = this.msg.ruleId
      types.updateFreightRate(obj).then(res => {
        this.dialogAdd = false
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.initData()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },

    //  弹框返回
    back () {
      this.dialogAdd = false
    },
    //  弹框重置
    reset () {
      for (let item in this.msg) {
        this.msg[item] = ''
      }
      this.msg.ruleStatus = '0'
      this.msg.discountType = '1'
      this.msg.discountDirection = '-'
      this.msg.flightno = '*'
      this.msg.departureAirport = ''
      this.msg.arrivalAirport = ''
      this.msg.weekLimit = '1/2/3/4/5/6/7'
      this.msg.saleBeginTime = getCurrentDate(1)
      this.msg.channel = ['app', 'mini', 'wx', 'web', 'manager', 'h5']
      this.dateList = [{ startFdateDisable: '', endFdateDisable: '' }]
      this.flag = false
    },
    //  添加/修改
    rescive (param) {
      this.dialogAdd = true
      this.flag = false
      this.tFalg = false
      if (param && param !== null) {
        this.dialogTitle = '修改'
        this.ref = ''
        let msg = JSON.parse(JSON.stringify(param))
        this.msg = Object.assign(this.msg, msg)
        // this.msg.actyName = param.actyId
        let dateList = []
        //  修改折扣内容回显
        for (let item of this.rule) {
          if (item.dincName === this.msg.discountType) {
            this.msg.discountType = item.dincCode
            break
          }
        }
        if (this.msg.discountType === '0') {
          this.typeFlag = true
        } else {
          this.typeFlag = false
        }
        //  修改运价回显
        for (let item of this.applyFreightType) {
          if (item.dincName === this.msg.applyFreightType) {
            this.msg.applyFreightType = item.dincCode
            break
          }
        }
        this.msg.ruleId = msg.ruleId
        this.msg.channel = msg.channel.split(',')
        let fdateDisable = msg.fdateDisable.split(',')
        this.effectivePeople = msg.effectivePeople.split(',')
        for (let i = 0; i < fdateDisable.length; i++) {
          let start = fdateDisable[i].split('#')[0]
          let end = fdateDisable[i].split('#')[1]
          dateList.push({ startFdateDisable: start, endFdateDisable: end })
        }
        this.dateList = dateList
      } else {
        //  添加
        this.typeFlag = false
        this.tFlag = true
        this.dialogTitle = '添加'
        this.ref = 'add'
        for (let item in this.msg) {
          this.msg[item] = ''
        }
        this.msg.ruleStatus = '0'
        this.msg.discountType = '1'
        this.msg.discountDirection = '-'
        this.msg.flightno = '*'
        this.msg.departureAirport = ''
        this.msg.arrivalAirport = ''
        this.msg.weekLimit = '1/2/3/4/5/6/7'
        this.msg.saleBeginTime = getCurrentDate(1)
        this.dateList = [{ startFdateDisable: '', endFdateDisable: '' }]
        this.msg.channel = ['app', 'mini', 'wx', 'web', 'manager', 'h5']
      }
    },

    // 添加/修改弹出框 -- 排除时间段新增
    addTemp () {
      let i = this.dateList.length - 1
      if (this.dateList[i].startFdateDisable && this.dateList[i].startFdateDisable) {
        this.isShow1 = false
        this.dateList.push({ startFdateDisable: '', endFdateDisable: '' })
      } else {
        this.isShow1 = true
      }
    },

    // 添加/修改弹出框 -- 优惠券模板/数量删除
    delTemp (idx) {
      this.dateList.splice(idx, 1)
    },
    isChange (e) {
      if (e) {
        this.disabled = false
      }
    },
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    search () {
      this.seParams.page = 1
      // console.log(this.date)
      // this.seParams.createDateEnd = this.date.length > 0 ? this.date[1] : ''
      // this.seParams.createDateStart = this.date.length > 0 ? this.date[0] : ''
      this.initData()
    },
    //  分页
    handleCurrentChange (val) {
      this.seParams.page = val
      this.initData()
    },
    handleSizeChange (val) {
      this.seParams.rows = val
      this.initData()
    },
    //  重置
    reseting () {
      this.date = []
      this.seParams = {
        ruleCode: '',
        departureAirport: '',
        arrivalAirport: '',
        cabin: '',
        isTimeOut: '',
        ruleStatus: '',
        flightno: '',
        discountType: '',
        createDateStart: '',
        createDateEnd: '',
        createOpid: '',
        channel: '',
        page: this.seParams.page,
        rows: this.seParams.rows
      }
      this.seParams.page = 1
      this.initData()
    },
    // 启用禁用
    handledit (data = {}) {
      this.tFalg = false
      this.$confirm('是否确认修改启用/停用状态 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        if (data.ruleStatus === '0') {
          data.ruleStatus = '1'
        } else {
          data.ruleStatus = '0'
        }
        types.updateRuleStatus(data).then(res => {
          if (res.isSuccessOrfail === 'SUCCESS') {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.initData()
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        })
      })
    },
    //  批量删除
    del (val) {
      //  获取选中数组里面的序号
      this.tFalg = false
      let ids = ''
      this.$confirm('是否确认删除 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        if (val && val !== null) {
          //  单个删除
          ids = val.ruleId
        } else {
          //  批量删除
          ids = this.rules().join(',')
        }
        let obj = {
          ids
        }
        types.deleteFreightRate(obj).then((res) => {
          if (res.isSuccessOrfail === 'SUCCESS') {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            //  判断最后一页删除后数量不足重新计算当前的页数
            if (val !== null) {
              //  单个
              if (this.total % this.seParams.pagesize === 1 && this.total > 1 && this.seParams.currentPage === Math.ceil(this.total / this.seParams.pagesize)) {
                this.seParams.currentPage = this.params.page - 1
              }
            } else {
              //  批量
              if (this.dataArr.length >= (this.total % this.seParams.pagesize) && this.seParams.currentPage === Math.ceil(this.total / this.seParams.pagesize)) {
                this.seParams.currentPage = this.params.page - 1
              }
            }
            this.initData()
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    rules () {
      return this.dataArr.map((item) => {
        return item.ruleId
      })
    },
    //  批量启用
    start (param) {
      let ids = ''
      let status = ''
      // for (let item of this.dataArr) {
      //   ids += ',' + item.ruleId
      // }
      ids = this.rules().join(',')
      let obj = {
        ids,
        status,
        txt: ''
      }
      // return false
      // 判断状态
      if (param === 'start') {
        // 批量启用
        obj.status = '0'
        obj.txt = '是否确认批量启用 ?'
      } else {
        // 批量禁用
        obj.status = '1'
        obj.txt = '是否确认批量禁用 ?'
      }
      this.$confirm(obj.txt, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(res => {
        delete obj.txt
        types.batchOnOrOff(obj).then(res => {
          if (res.isSuccessOrfail === 'SUCCESS') {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.initData()
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        })
      })
    },
    //  excel
    excel (param) {
      let data = JSON.parse(JSON.stringify(this.seParams))
      let url = 'freightRateRule/exportRate'
      let name = '运价折扣管理'
      let type = 'xls'
      let temp = null
      data.start = 1
      data.end = this.total
      delete data.page
      delete data.rows
      let obj = {
        data,
        url,
        name,
        type,
        temp
      }
      if (param !== null) {
        obj.name = getRouteName('/freightRateRule')
        delete obj.temp
        excelList(obj, this)
      } else {
        obj.name = '运价折扣管理模版'
        obj.url = 'freightRateRule/exportRateTemplate'
        obj.temp = 2
        excelList(obj)
      }
    },
    // 上传规则文件
    dis () {
      this.dialogFormVisible = true
    },
    //  确认上传
    submitUpload (content) {
      // 创建表单对象
      let data = new FormData()
      data.append('importExcel', this.file)
      types.importRates(data).then(res => {
        this.$message.success('上传成功')
        this.dialogFormVisible = false
        this.initData()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    uploadSectionFile (context) {
      // console.log(context)
    },
    handleLoad (file) {
      this.file = file.raw
    },
    handerror () {
      this.$message.error('提交失败，请稍后再试')
    },
    nosubmitUpload () {
      this.dialogFormVisible = false
    },
    //  表格
    handleSelectionChange (row) {
      this.dataArr = row
    },
    //  初始化数据
    initData () {
      this.loading = true
      types.queryFreightRates(this.seParams).then(res => {
        console.log(res)
        for (let item of res.rows) {
          item.effectivePeopleMap = this.resolveEffectivePeople(item.effectivePeople)
          if (item.applyFreightType !== '') {
            item.applyFreightType = item.applyFreightType + '运价'
          }
          if (item.fdateDisable) {
            // item.fdateDisable = item.fdateDisable.replace(/#/g, '#;')
            // item.fdateDisable = item.fdateDisable.replace(/,/g, ',')
          }
          for (let items of this.rule) {
            if (item.discountType === items.dincCode) {
              item.discountType = items.dincName
            }
          }

          const actyTag = this.typeTags.find(val => {
            return val.dincCode === item.actyTag
          })
          const acty = this.actyList.find(val => {
            return val.actyId === item.actyId
          })
          console.log(acty)
          if (acty) {
            item.actyName = acty.actyName
          }
          if (actyTag) {
            item.actyTagName = actyTag.dincName
          }
        }
        this.total = res.total
        this.priceList = res.rows
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 解析生效人群
    resolveEffectivePeople (type) {
      if (!type) {
        return type
      }
      let arr = type.split(',')
      let str = ''
      arr.forEach(item => {
        this.passengerList.forEach(val => {
          if (item === val.dincCode) {
            str += val.dincName + ','
          }
        })
      })
      return str.substring(0, str.length - 1)
    },
    discountDirection: (row, column, cellValue, index) => {
      let discountDirection = ''
      if (row.discountDirection === '-') {
        discountDirection = '减'
      } else {
        discountDirection = '加'
      }
      return discountDirection
    },

    // 出发/到达城市三字码转换
    cityChange () {
      let departureAirport = this.msg.departureAirport
      let arrivalAirport = this.msg.arrivalAirport
      if (this.msg.departureAirport && this.msg.arrivalAirport) {
        this.msg.departureAirport = arrivalAirport
        this.msg.arrivalAirport = departureAirport
      }
    }
  }
}
</script>
<style scoped lang="scss">
  .container{
    /*padding: 0;*/
    /*.date-picker{*/
    /*height: 36px;*/
    /*}*/
    .upload{
      padding: 20px;
      padding-bottom: 0;
    }
    .mine{
      display: flex;
      justify-content: center;
      padding-bottom: 20px;
      margin-top: 20px;
    }
    .line{
      width: 100%;
      height: 1px;
      padding: 2px 0;
      text-align: center;
      /*background: #ececec;*/
      box-shadow: 0px -3px 7px 0px rgba(76, 112, 232, 0.15);
      margin-top: 15px;
      /*border: ;*/
    }
    .cityChange {
      width: 24px;
      height: 20px;
      margin: 4px 2px;
      line-height: 20px;
      text-align: center;
      border: 1px solid #409EFF;
      background-color: #409EFF;
      color: white;
      border-radius: 5px;
      cursor: pointer;
    }
  }
  .dialog-container {
    .dialog-main {
      max-height: 620px;
      padding: 5px 20px;
      .row {
        padding-bottom: 10px;
        .column {
          width: 220px;
          .label {
            margin-bottom: 3px;
            font-size: 12px;
          }
        }
      }
    }
    .dialog-footer{
      background: white;
      padding: 10px 0;
    }
  }
</style>
