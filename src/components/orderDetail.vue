<template>
  <div>
    <!--<h1>订单详情弹出框</h1>-->
    <el-dialog :title="orderDetilList.dialogTitle" v-dialogDrag :visible.sync="orderDetilList.orderVisible" width="80%">
      <div class="dialog-container">
        <div class="dialog-main" style="padding: 0">
          <el-collapse v-model="activeNamesOrder">
            <!--订单信息-->
            <el-collapse-item title="订单信息" name="order" v-if="orderList.length > 0">
              <h4 v-if="oldOrderList.length" style="margin: 8px 0">原票信息</h4>
              <el-table v-if="oldOrderList.length"
                      :data="oldOrderList"
                      border
                      :cell-style="selfCellStyle"
                      :header-cell-style="selfHeaderCellStyle">
                <el-table-column label="订单编号" prop="orderCode" min-width="160"></el-table-column>
                <el-table-column label="订单时间" prop="creadate" min-width="160"></el-table-column>
                <el-table-column label="渠道" min-width="100">
                  <template slot-scope="scope">
                    <span>{{ scope.row.channel | channelMap }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="国内国际" prop="isInter" min-width="100">
                  <template slot-scope="scope">
                    <div>{{scope.row.isInter | isInnerMap}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="订单状态" prop="orderStatus" min-width="140">
                  <template slot-scope="scope">
                    <div>{{scope.row.orderStatus | outTicketStatusMap}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="支付状态" prop="orderPayStatus" min-width="100">
                  <template slot-scope="scope">
                    <div>{{scope.row.orderPayStatus | payStatusMap}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="订单金额" prop="paymoney" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.paymoney | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="地铁票金额" min-width="100" prop="railwayMoney"></el-table-column>
                <el-table-column label="保险金额" prop="insmoney" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.insmoney | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="附加商品金额" min-width="120" prop="productMoney"></el-table-column>
                <el-table-column label="优惠券" prop="coupon" min-width="100"></el-table-column>
                <el-table-column label="票面价" prop="allFare" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.allFare | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="机建" prop="allairportTax" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.allairportTax | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="燃油" prop="allfuelTax" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.allfuelTax | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="票款金额" prop="ticketmoney" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.ticketmoney | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="积分值" prop="integralValue" min-width="100"></el-table-column>
                <!--                <el-table-column label="订单来源" prop="channel" min-width="140">-->
                <!--                  <template slot-scope="scope">-->
                <!--                    <div>{{scope.row.channel | channelMap}}</div>-->
                <!--                  </template>-->
                <!--                </el-table-column>-->
                <el-table-column label="支付时限" prop="endpaytime" min-width="140"></el-table-column>
                <!--                <el-table-column label="改期原因" prop="changeReason" min-width="160" v-if="gFlag"></el-table-column>-->
              </el-table>
              <h4 v-if="oldOrderList.length" style="margin: 8px 0">新票信息</h4>
              <el-table
                :data="orderList"
                border
                :cell-style="selfCellStyle"
                :header-cell-style="selfHeaderCellStyle">
                <el-table-column label="订单编号" prop="orderCode" min-width="160"></el-table-column>
                <el-table-column label="订单时间" prop="creadate" min-width="160"></el-table-column>
                <el-table-column label="渠道" min-width="100">
                  <template slot-scope="scope">
                    <span>{{ scope.row.channel | channelMap }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="国内国际" prop="isInter" min-width="100">
                  <template slot-scope="scope">
                    <div>{{scope.row.isInter | isInnerMap}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="订单状态" prop="orderStatus" min-width="140">
                  <template slot-scope="scope">
                    <div>{{scope.row.orderStatus | outTicketStatusMap}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="支付状态" prop="orderPayStatus" min-width="100">
                  <template slot-scope="scope">
                    <div>{{scope.row.orderPayStatus | payStatusMap}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="订单金额" prop="paymoney" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.paymoney | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="地铁票金额" prop="railwayMoney" min-width="100"></el-table-column>
                <el-table-column label="保险金额" prop="insmoney" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.insmoney | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="附加商品金额" min-width="120" prop="productMoney"></el-table-column>
                <el-table-column label="优惠券" prop="coupon" min-width="100"></el-table-column>
                <el-table-column label="票面价" prop="allFare" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.allFare | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="机建" prop="allairportTax" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.allairportTax | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="燃油" prop="allfuelTax" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.allfuelTax | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="票款金额" prop="ticketmoney" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.ticketmoney | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="积分值" prop="integralValue" min-width="100"></el-table-column>
                <el-table-column label="支付时限" prop="endpaytime" min-width="140"></el-table-column>
                <el-table-column label="红包金额" prop="walletMoney" min-width="140"></el-table-column>
              </el-table>
            </el-collapse-item>
            <!--第一航段-->
            <el-collapse-item :title="fPassageTitle" name="firstPassage" v-if="firstSementList.length > 0">
              <div v-if="oldFirstSementList.length">
                <h4 style="margin: 8px 0">原票信息</h4>
                <el-table
                        :data="oldFirstSementList"
                        border
                        :header-cell-style="selfHeaderCellStyle"
                        :cell-style="selfCellStyle">
                  <el-table-column label="航班号" prop="fnumber" min-width="100"></el-table-column>
                  <el-table-column label="航班日期" prop="fdate" min-width="120"></el-table-column>
                  <el-table-column label="起飞时间" prop="ftime" min-width="100"></el-table-column>
                  <el-table-column label="到达时间" prop="ttime" min-width="100"></el-table-column>
                  <el-table-column label="舱位" prop="seat" min-width="80"></el-table-column>
                  <el-table-column label="产品名称" prop="productName" min-width="100"></el-table-column>
                  <el-table-column label="优惠金额" prop="fmoney" min-width="100">
                    <template slot-scope="scope">
                      {{scope.row.fmoney | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="折扣率" prop="integralDiscount" min-width="100">
                    <template slot-scope="scope">
                      <span v-if="scope.row.integralDiscount === ''">0</span>
                    </template>
                  </el-table-column>
                  <!--<div>-->
<!--                  <el-table-column label="原舱位" v-if="firstSementList[0].initialSeat" min-width="100">-->
<!--                    <template slot-scope="scope">-->
<!--                      <div>{{scope.row.initialSeat}}</div>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="原机票号" v-if="firstSementList[0].initialTktno"  prop="initialTktno" min-width="140"></el-table-column>-->
<!--                  <el-table-column label="原PNR" v-if="firstSementList[0].initialPnr" prop="initialPnr" min-width="100"></el-table-column>-->
<!--                  <el-table-column label="原航班号" v-if="firstSementList[0].initialFnumber" prop="initialFnumber" min-width="100"></el-table-column>-->
<!--                  <el-table-column label="原航班日期" v-if="firstSementList[0].initialFdate" prop="initialFdate" min-width="100"></el-table-column>-->
<!--                  <el-table-column label="原航班号" v-if="firstSementList[0].initialFnumber" prop="initialFnumber" min-width="100"></el-table-column>-->
<!--                  <el-table-column label="原起飞时间" v-if="firstSementList[0].initialFtime" prop="initialFtime" min-width="100"></el-table-column>-->
<!--                  <el-table-column label="原到达时间" v-if="firstSementList[0].initialTtime" prop="initialTtime" min-width="100"></el-table-column>-->
                </el-table>
                <el-table
                        :data="oldFirstPassageList"
                        border
                        :header-cell-style="selfHeaderCellStyle"
                        :cell-style="selfCellStyle">
                  <el-table-column label="姓名" prop="name" min-width="120"></el-table-column>
                  <el-table-column label="证件类型" prop="idtype" min-width="100">
                    <template slot-scope="scope">
                      <div>{{scope.row.idtype | idTypeMap}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="证件号码" prop="idnumber" min-width="180"></el-table-column>
                  <el-table-column label="PNR" prop="pnr" min-width="80"></el-table-column>
                  <el-table-column label="机票号" prop="eticketno" min-width="140"></el-table-column>
                  <el-table-column label="客票状态" prop="status" min-width="100">
                    <template slot-scope="scope">
                      <div>{{scope.row.status | outTicketStatusMap}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="退票状态" prop="cstatus" min-width="100">
                    <template slot-scope="scope">
                      <div>{{scope.row.cstatus | refundStatusMap}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="退票编号" prop="refundNo" min-width="160"></el-table-column>
                  <el-table-column label="退款时间" prop="creqdatetime" min-width="140"></el-table-column>
                  <el-table-column label="票款总价" prop="money" min-width="100">
                    <template slot-scope="scope">
                      {{scope.row.money | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="票面价" prop="fare" min-width="100">
                    <template slot-scope="scope">
                      {{scope.row.fare | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="机建" prop="airportTax" min-width="100">
                    <template slot-scope="scope">
                      {{scope.row.airportTax | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="燃油" prop="fuelTax" min-width="100">
                    <template slot-scope="scope">
                      {{scope.row.fuelTax | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="国际票总税" prop="taxPrice" min-width="100">
                    <template slot-scope="scope">
                      {{scope.row.taxPrice | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="性别" prop="sex" min-width="60">
                    <template slot-scope="scope">
                      <span v-if="scope.row.sex === '1'">男</span>
                      <span v-if="scope.row.sex === '2'">女</span>
                      <span v-if="scope.row.sex === '8'">未知</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="生日" prop="birthday" min-width="120"></el-table-column>
                  <el-table-column label="国籍" prop="country" min-width="100"></el-table-column>
                  <el-table-column label="护照签发国" prop="passportCountry" min-width="100"></el-table-column>
                  <el-table-column label="护照有效期" prop="passportValid" min-width="100"></el-table-column>
                  <el-table-column label="红包金额" prop="walletMoney" min-width="140"></el-table-column>
                  <!-- 2020-04-16优化字段 -->
                  <!--                  <div v-if="passageFlag === '0'">-->
                  <!--                    <el-table-column label="升舱金额" prop="upgradMoney" min-width="100">-->
                  <!--                      <template slot-scope="scope">-->
                  <!--                        {{scope.row.upgradMoney | formatPriceMap}}-->
                  <!--                      </template>-->
                  <!--                    </el-table-column>-->
                  <!--                    <el-table-column label="支付金额" prop="paymoney" min-width="100">-->
                  <!--                      <template slot-scope="scope">-->
                  <!--                        {{scope.row.paymoney | formatPriceMap}}-->
                  <!--                      </template>-->
                  <!--                    </el-table-column>-->
                  <!--                  </div>-->
                  <!--                  <div v-if="passageFlag !== '0'">-->
                  <!--                    <el-table-column label="票面价" prop="fare" min-width="100">-->
                  <!--                      <template slot-scope="scope">-->
                  <!--                        {{scope.row.fare | formatPriceMap}}-->
                  <!--                      </template>-->
                  <!--                    </el-table-column>-->
                  <!--                    <el-table-column label="机建" prop="airportTax" min-width="100">-->
                  <!--                      <template slot-scope="scope">-->
                  <!--                        {{scope.row.airportTax | formatPriceMap}}-->
                  <!--                      </template>-->
                  <!--                    </el-table-column>-->
                  <!--                    <el-table-column label="燃油" prop="fuelTax" min-width="100">-->
                  <!--                      <template slot-scope="scope">-->
                  <!--                        {{scope.row.fuelTax | formatPriceMap}}-->
                  <!--                      </template>-->
                  <!--                    </el-table-column>-->
                  <!--                    <el-table-column label="国际票总税" prop="taxPrice" min-width="100">-->
                  <!--                      <template slot-scope="scope">-->
                  <!--                        {{scope.row.taxPrice | formatPriceMap}}-->
                  <!--                      </template>-->
                  <!--                    </el-table-column>-->
                  <!--                    <el-table-column label="票款总价" prop="money" min-width="100">-->
                  <!--                      <template slot-scope="scope">-->
                  <!--                        {{scope.row.money | formatPriceMap}}-->
                  <!--                      </template>-->
                  <!--                    </el-table-column>-->
                  <!--                    <el-table-column label="实际票款" prop="paymoney" min-width="100">-->
                  <!--                      <template slot-scope="scope">-->
                  <!--                        {{scope.row.paymoney | formatPriceMap}}-->
                  <!--                      </template>-->
                  <!--                    </el-table-column>-->
                  <!--                  </div>-->
                </el-table>
              </div>
              <div style="margin-top: 10px;">
                <h4 v-if="oldFirstSementList.length" style="margin: 8px 0">新票信息</h4>
                <el-table
                        :data="firstSementList"
                        border
                        :header-cell-style="selfHeaderCellStyle"
                        :cell-style="selfCellStyle">
                  <el-table-column label="航班号" prop="fnumber" min-width="100"></el-table-column>
                  <el-table-column label="航班日期" prop="fdate" min-width="120"></el-table-column>
                  <el-table-column label="起飞时间" prop="ftime" min-width="100"></el-table-column>
                  <el-table-column label="到达时间" prop="ttime" min-width="100"></el-table-column>
                  <el-table-column label="舱位" prop="seat" min-width="80"></el-table-column>
                  <el-table-column label="产品名称" prop="productName" min-width="100"></el-table-column>
                  <el-table-column label="优惠金额" prop="fmoney" min-width="100">
                    <template slot-scope="scope">
                      {{scope.row.fmoney | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="折扣率" prop="integralDiscount" min-width="100">
                    <template slot-scope="scope">
                      <span v-if="scope.row.integralDiscount === ''">0</span>
                    </template>
                  </el-table-column>
                  <!--<div>-->
<!--                  <el-table-column label="原舱位" v-if="firstSementList[0].initialSeat" min-width="100">-->
<!--                    <template slot-scope="scope">-->
<!--                      <div>{{scope.row.initialSeat}}</div>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="原机票号" v-if="firstSementList[0].initialTktno"  prop="initialTktno" min-width="140"></el-table-column>-->
<!--                  <el-table-column label="原PNR" v-if="firstSementList[0].initialPnr" prop="initialPnr" min-width="100"></el-table-column>-->
<!--                  <el-table-column label="原航班号" v-if="firstSementList[0].initialFnumber" prop="initialFnumber" min-width="100"></el-table-column>-->
<!--                  <el-table-column label="原航班日期" v-if="firstSementList[0].initialFdate" prop="initialFdate" min-width="100"></el-table-column>-->
<!--                  <el-table-column label="原航班号" v-if="firstSementList[0].initialFnumber" prop="initialFnumber" min-width="100"></el-table-column>-->
<!--                  <el-table-column label="原起飞时间" v-if="firstSementList[0].initialFtime" prop="initialFtime" min-width="100"></el-table-column>-->
<!--                  <el-table-column label="原到达时间" v-if="firstSementList[0].initialTtime" prop="initialTtime" min-width="100"></el-table-column>-->
                  <el-table-column label="变更时间" prop="outdatetime" min-width="160"></el-table-column>
                  <el-table-column label="票价差金额" prop="upgradMoney" min-width="120"></el-table-column>
                  <el-table-column label="变更费率" prop="changeFee" min-width="120"></el-table-column>
                  <el-table-column label="改期手续费" prop="changeMoney" min-width="120"></el-table-column>
                  <el-table-column label="原票销售渠道" prop="initialChannel" min-width="120">
                    <template slot-scope="scope">
                      {{ scope.row.initialChannel | channelMap }}
                    </template>
                  </el-table-column>
                  <el-table-column label="原票代理人航协号" prop="initialOffice" min-width="160"></el-table-column>
                  <el-table-column label="原票代理费金额" prop="agencyFee" min-width="120"></el-table-column>
                </el-table>
                <el-table
                  :data="firstPassageList"
                  border
                  :header-cell-style="selfHeaderCellStyle"
                  :cell-style="selfCellStyle">
                  <el-table-column label="姓名" prop="name" min-width="120"></el-table-column>
                  <el-table-column label="证件类型" prop="idtype" min-width="100">
                    <template slot-scope="scope">
                      <div>{{scope.row.idtype | idTypeMap}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="证件号码" prop="idnumber" min-width="180"></el-table-column>
                  <el-table-column label="PNR" prop="pnr" min-width="80"></el-table-column>
                  <el-table-column label="原票号" prop="initialTktno" min-width="140"></el-table-column>
                  <el-table-column label="机票号" prop="eticketno" min-width="140"></el-table-column>
                  <el-table-column label="客票状态" prop="status" min-width="100">
                    <template slot-scope="scope">
                      <div>{{scope.row.status | outTicketStatusMap}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="退改状态" prop="cstatus" min-width="100">
                    <template slot-scope="scope">
                      <div>{{scope.row.cstatus | refundStatusMap}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="退票编号" prop="refundNo" min-width="160"></el-table-column>
                  <el-table-column label="退款时间" prop="creqdatetime" min-width="140"></el-table-column>
                  <el-table-column label="票款总价" prop="money" min-width="100">
                    <template slot-scope="scope">
                      {{scope.row.money | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="票面价" prop="fare" min-width="100">
                    <template slot-scope="scope">
                      {{scope.row.fare | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="机建" prop="airportTax" min-width="100">
                    <template slot-scope="scope">
                      {{scope.row.airportTax | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="燃油" prop="fuelTax" min-width="100">
                    <template slot-scope="scope">
                      {{scope.row.fuelTax | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="国际票总税" prop="taxPrice" min-width="100">
                    <template slot-scope="scope">
                      {{scope.row.taxPrice | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="性别" prop="sex" min-width="60">
                    <template slot-scope="scope">
                      <span v-if="scope.row.sex === '1'">男</span>
                      <span v-if="scope.row.sex === '2'">女</span>
                      <span v-if="scope.row.sex === '8'">未知</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="生日" prop="birthday" min-width="120"></el-table-column>
                  <el-table-column label="国籍" prop="country" min-width="100"></el-table-column>
                  <el-table-column label="护照签发国" prop="passportCountry" min-width="100"></el-table-column>
                  <el-table-column label="护照有效期" prop="passportValid" min-width="100"></el-table-column>
                  <el-table-column label="红包金额" prop="walletMoney" min-width="140"></el-table-column>
                  <!-- 2020-04-16优化字段 -->

                </el-table>
              </div>
            </el-collapse-item>
            <!--第二航段-->
            <el-collapse-item :title="sPassageTitle" name="secondPassage" v-if="segmentFlag && secondSementList.length > 0">
              <div v-if="oldSecondSementList.length">
                <h4>原票信息</h4>
                <el-table
                        border
                        :data="oldSecondSementList"
                        :header-cell-style="selfHeaderCellStyle"
                        :cell-style="selfCellStyle">
                  <el-table-column label="航班号" prop="fnumber" min-width="100"></el-table-column>
                  <el-table-column label="航班日期" prop="fdate" min-width="120"></el-table-column>
                  <el-table-column label="起飞时间" prop="ftime" min-width="100"></el-table-column>
                  <el-table-column label="到达时间" prop="ttime" min-width="100"></el-table-column>
                  <el-table-column label="舱位" prop="seat" min-width="80"></el-table-column>
                  <div v-if="passageFlag !== '2'">
                    <el-table-column label="原舱位" prop="initialSeat" min-width="80"></el-table-column>
                  </div>
                  <el-table-column label="产品名称" prop="productName" min-width="100"></el-table-column>
                  <el-table-column label="优惠金额" prop="fmoney" min-width="100">
                    <template slot-scope="scope">
                      {{scope.row.fmoney | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="折扣率" prop="integralDiscount" min-width="100">
                    <template slot-scope="scope">
                      <span v-if="scope.row.integralDiscount === ''">0</span>
                    </template>
                  </el-table-column>
                </el-table>
                <el-table
                        :data="oldSecondPassageList"
                        border
                        :header-cell-style="selfHeaderCellStyle"
                        :cell-style="selfCellStyle">
                  <el-table-column label="姓名" prop="name" min-width="120"></el-table-column>
                  <el-table-column label="性别" prop="sex" min-width="60">
                    <template slot-scope="scope">
                      <span v-if="scope.row.sex === '1'">男</span>
                      <span v-if="scope.row.sex === '2'">女</span>
                      <span v-if="scope.row.sex === '8'">未知</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="生日" prop="birthday" min-width="120"></el-table-column>
                  <el-table-column label="国籍" prop="country" min-width="100"></el-table-column>
                  <el-table-column label="证件类型" prop="idtype" min-width="100">
                    <template slot-scope="scope">
                      <div>{{scope.row.idtype | idTypeMap}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="证件号码" prop="idnumber" min-width="180"></el-table-column>
                  <el-table-column label="护照签发国" prop="passportCountry" min-width="100"></el-table-column>
                  <el-table-column label="护照有效期" prop="passportValid" min-width="100"></el-table-column>
                  <el-table-column label="红包金额" prop="walletMoney" min-width="140"></el-table-column>
                  <div v-if="passageFlag === '0'">
                    <el-table-column label="升舱金额" prop="upgradMoney" min-width="100">
                      <template slot-scope="scope">
                        {{scope.row.upgradMoney | formatPriceMap}}
                      </template>
                    </el-table-column>
                    <el-table-column label="支付金额" prop="paymoney" min-width="100">
                      <template slot-scope="scope">
                        {{scope.row.paymoney | formatPriceMap}}
                      </template>
                    </el-table-column>
                  </div>
                  <div v-if="passageFlag !== '0'">
                    <el-table-column label="票面价" prop="fare" min-width="100">
                      <template slot-scope="scope">
                        {{scope.row.fare | formatPriceMap}}
                      </template>
                    </el-table-column>
                    <el-table-column label="机建" prop="airportTax" min-width="100">
                      <template slot-scope="scope">
                        {{scope.row.airportTax | formatPriceMap}}
                      </template>
                    </el-table-column>
                    <el-table-column label="燃油" prop="fuelTax" min-width="100">
                      <template slot-scope="scope">
                        {{scope.row.fuelTax | formatPriceMap}}
                      </template>
                    </el-table-column>
                    <el-table-column label="国际票总税" prop="taxPrice" min-width="100">
                      <template slot-scope="scope">
                        {{scope.row.taxPrice | formatPriceMap}}
                      </template>
                    </el-table-column>
                    <el-table-column label="票款总价" prop="money" min-width="100">
                      <template slot-scope="scope">
                        {{scope.row.money | formatPriceMap}}
                      </template>
                    </el-table-column>
                    <el-table-column label="实际票款" prop="paymoney" min-width="100">
                      <template slot-scope="scope">
                        {{scope.row.paymoney | formatPriceMap}}
                      </template>
                    </el-table-column>
                  </div>
                  <el-table-column label="PNR" prop="pnr" min-width="100"></el-table-column>
                  <el-table-column label="机票号" prop="eticketno" min-width="140"></el-table-column>
                  <el-table-column label="客票状态" prop="status" min-width="100">
                    <template slot-scope="scope">
                      <div>{{scope.row.status | outTicketStatusMap}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="退改状态" prop="cstatus" min-width="100">
                    <template slot-scope="scope">
                      <div>{{scope.row.cstatus | refundStatusMap}}</div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div style="margin-top: 10px">
                <h4 v-if="oldSecondSementList.length">新票信息</h4>
                <el-table
                        border
                        :data="secondSementList"
                        :header-cell-style="selfHeaderCellStyle"
                        :cell-style="selfCellStyle">
                  <el-table-column label="航班号" prop="fnumber" min-width="100"></el-table-column>
                  <el-table-column label="航班日期" prop="fdate" min-width="120"></el-table-column>
                  <el-table-column label="起飞时间" prop="ftime" min-width="100"></el-table-column>
                  <el-table-column label="到达时间" prop="ttime" min-width="100"></el-table-column>
                  <el-table-column label="舱位" prop="seat" min-width="80"></el-table-column>
<!--                  <div v-if="passageFlag !== '2'">-->
<!--                    <el-table-column label="原舱位" prop="initialSeat" min-width="80"></el-table-column>-->
<!--                  </div>-->
                  <el-table-column label="产品名称" prop="productName" min-width="100"></el-table-column>
                  <el-table-column label="优惠金额" prop="fmoney" min-width="100">
                    <template slot-scope="scope">
                      {{scope.row.fmoney | formatPriceMap}}
                    </template>
                  </el-table-column>
                  <el-table-column label="折扣率" prop="integralDiscount" min-width="100">
                    <template slot-scope="scope">
                      <span v-if="scope.row.integralDiscount === ''">0</span>
                    </template>
                  </el-table-column>
<!--                  <el-table-column label="原舱位" v-if="secondSementList[0].initialSeat" prop="initialSeat" min-width="100"></el-table-column>-->
<!--                  <el-table-column label="原机票号" v-if="secondSementList[0].initialTktno" prop="initialTktno" min-width="140"></el-table-column>-->
<!--                  <el-table-column label="原PNR" v-if="secondSementList[0].initialPnr" prop="initialPnr" min-width="100"></el-table-column>-->
<!--                  <el-table-column label="原航班号" v-if="secondSementList[0].initialFnumber" prop="initialFnumber" min-width="100"></el-table-column>-->
<!--                  <el-table-column label="原航班日期" v-if="secondSementList[0].initialFdate" prop="initialFdate" min-width="100"></el-table-column>-->
<!--                  <el-table-column label="原航班号" v-if="secondSementList[0].initialFnumber" prop="initialFnumber" min-width="100"></el-table-column>-->
<!--                  <el-table-column label="原起飞时间" v-if="secondSementList[0].initialFtime" prop="initialFtime" min-width="100"></el-table-column>-->
<!--                  <el-table-column label="原到达时间" v-if="secondSementList[0].initialTtime" prop="initialTtime" min-width="100"></el-table-column>-->
                  <el-table-column label="票价差金额" prop="upgradMoney" min-width="120"></el-table-column>
                  <el-table-column label="变更费率" prop="changeFee" min-width="120"></el-table-column>
                  <el-table-column label="改期手续费" prop="changeMoney" min-width="120"></el-table-column>
                  <el-table-column label="原票销售渠道" prop="initialChannel" min-width="120">
                    <template slot-scope="scope">
                      {{ scope.row.initialChannel | channelMap }}
                    </template>
                  </el-table-column>
                  <el-table-column label="原票代理人航协号" prop="initialOffice" min-width="160"></el-table-column>
                  <el-table-column label="原票代理费金额" prop="agencyFee" min-width="120"></el-table-column>
                </el-table>
                <el-table
                        :data="secondPassageList"
                        border
                        :header-cell-style="selfHeaderCellStyle"
                        :cell-style="selfCellStyle">
                  <el-table-column label="姓名" prop="name" min-width="120"></el-table-column>
                  <el-table-column label="证件类型" prop="idtype" min-width="100">
                    <template slot-scope="scope">
                      <div>{{scope.row.idtype | idTypeMap}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="证件号码" prop="idnumber" min-width="180"></el-table-column>
                  <el-table-column label="护照签发国" prop="passportCountry" min-width="100"></el-table-column>
                  <el-table-column label="护照有效期" prop="passportValid" min-width="100"></el-table-column>
                  <el-table-column label="红包金额" prop="walletMoney" min-width="140"></el-table-column>
                  <div v-if="passageFlag === '0'">
                    <el-table-column label="升舱金额" prop="upgradMoney" min-width="100">
                      <template slot-scope="scope">
                        {{scope.row.upgradMoney | formatPriceMap}}
                      </template>
                    </el-table-column>
                    <el-table-column label="支付金额" prop="paymoney" min-width="100">
                      <template slot-scope="scope">
                        {{scope.row.paymoney | formatPriceMap}}
                      </template>
                    </el-table-column>
                  </div>
                  <div v-if="passageFlag !== '0'">
                    <el-table-column label="票面价" prop="fare" min-width="100">
                      <template slot-scope="scope">
                        {{scope.row.fare | formatPriceMap}}
                      </template>
                    </el-table-column>
                    <el-table-column label="机建" prop="airportTax" min-width="100">
                      <template slot-scope="scope">
                        {{scope.row.airportTax | formatPriceMap}}
                      </template>
                    </el-table-column>
                    <el-table-column label="燃油" prop="fuelTax" min-width="100">
                      <template slot-scope="scope">
                        {{scope.row.fuelTax | formatPriceMap}}
                      </template>
                    </el-table-column>
                    <el-table-column label="国际票总税" prop="taxPrice" min-width="100">
                      <template slot-scope="scope">
                        {{scope.row.taxPrice | formatPriceMap}}
                      </template>
                    </el-table-column>
                    <el-table-column label="性别" prop="sex" min-width="60">
                      <template slot-scope="scope">
                        <span v-if="scope.row.sex === '1'">男</span>
                        <span v-if="scope.row.sex === '2'">女</span>
                        <span v-if="scope.row.sex === '8'">未知</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="生日" prop="birthday" min-width="120"></el-table-column>
                    <el-table-column label="国籍" prop="country" min-width="100"></el-table-column>
                    <el-table-column label="票款总价" prop="money" min-width="100">
                      <template slot-scope="scope">
                        {{scope.row.money | formatPriceMap}}
                      </template>
                    </el-table-column>
                    <el-table-column label="实际票款" prop="paymoney" min-width="100">
                      <template slot-scope="scope">
                        {{scope.row.paymoney | formatPriceMap}}
                      </template>
                    </el-table-column>
                  </div>
                  <el-table-column label="PNR" prop="pnr" min-width="100"></el-table-column>
                  <el-table-column label="原票号" prop="initialTktno" min-width="140"></el-table-column>
                  <el-table-column label="机票号" prop="eticketno" min-width="140"></el-table-column>
                  <el-table-column label="客票状态" prop="status" min-width="100">
                    <template slot-scope="scope">
                      <div>{{scope.row.status | outTicketStatusMap}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="退改状态" prop="cstatus" min-width="100">
                    <template slot-scope="scope">
                      <div>{{scope.row.cstatus | refundStatusMap}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="退票编号" prop="refundNo" min-width="160"></el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
            <!--支付信息-->
            <el-collapse-item title="支付信息" name="payment" v-if="orderList.length > 0">
              <el-table
                border
                :data="orderList"
                :header-cell-style="selfHeaderCellStyle"
                :cell-style="selfCellStyle">
                <el-table-column label="支付通道" min-width="140">
                  <template slot-scope="scope">
                    <span>{{scope.row.paytype | payTypeMap}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="支付方式" prop="payMethod" min-width="120"></el-table-column>
                <el-table-column label="支付银行" prop="bankName" min-width="160">
                  <template slot-scope="scope">
                    <span v-if="scope.row.bankName === 'null'"></span>
                    <span v-else>{{scope.row.bankName}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="支付卡号" prop="payBankCardNo" min-width="180"></el-table-column>
                <el-table-column label="支付金额" prop="paymoney" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.paymoney | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="支付订单号" prop="paybillno" min-width="180"></el-table-column>
                <el-table-column label="交易流水号" prop="payserial" min-width="260"></el-table-column>
                <el-table-column label="交易提交/确认时间" prop="payCommitTime" min-width="160"></el-table-column>
                <el-table-column label="支付状态" prop="orderPayStatus" min-width="100">
                  <template  slot-scope="scope">
                    {{scope.row.orderPayStatus | payStatusMap}}
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
            <!--联系人信息-->
            <el-collapse-item title="联系人信息" name="contacts" v-if="orderList.length > 0">
              <el-table
                border
                :data="orderList"
                :header-cell-style="selfHeaderCellStyle"
                :cell-style="selfCellStyle">
                <el-table-column label="是否白鹭会员" prop="userType" min-width="120">
                  <template slot-scope="scope">
                    <span v-if="scope.row.userType === '0'">否</span>
                    <span v-if="scope.row.userType === '1'">是</span>
                  </template>
                </el-table-column>
                <el-table-column label="联系姓名" prop="userName" min-width="120"></el-table-column>
                <el-table-column label="联系手机" prop="mobile" min-width="120"></el-table-column>
                <el-table-column label="会员姓名" prop="realName" min-width="120"></el-table-column>
                <el-table-column label="会员手机" prop="phone" min-width="120"></el-table-column>
                <el-table-column label="常旅客卡号" prop="bigCustomerCode" min-width="120"></el-table-column>
              </el-table>
            </el-collapse-item>
            <!--退票信息-->
            <el-collapse-item title="退票信息" name="refundInfo" v-if="refundList.length">
              <el-table
                border
                :data="refundList"
                :header-cell-style="selfHeaderCellStyle"
                :cell-style="selfCellStyle">
<!--                <el-table-column label="订单日期" prop="orderdate" min-width="160"></el-table-column>-->
<!--                <el-table-column label="订单号" prop="ordercode" min-width="160"></el-table-column>-->
<!--                <el-table-column label="PNR" prop="pnr" min-width="100"></el-table-column>-->
<!--                <el-table-column label="市场方" prop="airways" min-width="90"></el-table-column>-->
<!--                <el-table-column label="承运方" prop="airline" min-width="90"></el-table-column>-->
<!--                <el-table-column label="渠道类型" min-width="120" prop="channel"></el-table-column>-->
<!--                <el-table-column label="航段" prop="sail" min-width="100"></el-table-column>-->
<!--                <el-table-column label="旧票号" prop="initialTktNo" min-width="160"></el-table-column>-->
                <el-table-column label="票号" prop="eticketno" min-width="160"></el-table-column>
                <el-table-column label="旅客姓名" prop="name" min-width="90"></el-table-column>
                <el-table-column label="航班号" prop="fnumber" min-width="90"></el-table-column>
<!--                <el-table-column label="航意险" prop="unexoInsr" min-width="90"></el-table-column>-->
<!--                <el-table-column label="航延险" prop="delayInsr" min-width="90"></el-table-column>-->
                <el-table-column label="支付金额" prop="paymoney" min-width="90"></el-table-column>
                <el-table-column label="应退金额" prop="actualRefundMoney" min-width="90"></el-table-column>
                <el-table-column label="支付积分" prop="integralFare" min-width="90"></el-table-column>
                <el-table-column label="银行订单号" prop="paybillno" min-width="180"></el-table-column>
                <el-table-column label="退票单号" prop="refundNo" min-width="160"></el-table-column>
                <el-table-column label="退票性质" min-width="100" prop="nature">
                  <template slot-scope="scope">
                    <div v-if="scope.row.nature === '0'">非自愿</div>
                    <div v-else>自愿</div>
                  </template>
                </el-table-column>
                <el-table-column label="微信退款单号" min-width="120" prop="tstatus"></el-table-column>
                <el-table-column label="退款失败原因" min-width="120" prop="tstatus"></el-table-column>
                <el-table-column label="退票状态" min-width="120" prop="tstatus">
                  <template slot-scope="scope">
                    <div>{{ scope.row.status | refundStatusMap }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="国内/国际" min-width="100" prop="isinter">
                  <template slot-scope="scope">
                    <div v-if="scope.row.isinter === '0'">国内</div>
                    <div v-else>国际</div>
                  </template>
                </el-table-column>
                <el-table-column label="审核人" prop="opAccount" min-width="120"></el-table-column>
                <el-table-column label="申请退票时间" prop="happendate" min-width="160"></el-table-column>
                <el-table-column label="行程单是否需回收" min-width="140">
                  <template slot-scope="scope">
                    <div v-if="scope.row.isprint === '1'">是</div>
                    <div v-else>否</div>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
            <!--保险信息-->
            <el-collapse-item title="保险信息" name="insurance" v-if="insuranceFlag && insuranceList.length > 0">
              <el-table
                border
                :data="insuranceList"
                :header-cell-style="selfHeaderCellStyle"
                :cell-style="selfCellStyle">
                <el-table-column label="保费" prop="buyTotalPrice" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.buyTotalPrice | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="保额" prop="repay" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.repay | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="保单号" prop="insNo" min-width="120"></el-table-column>
                <el-table-column label="购保状态" prop="status" min-width="180">
                  <template slot-scope="scope">
                    <div>{{scope.row.status | insuranceMap}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="保险产品" prop="insuranceProductName" min-width="100"></el-table-column>
                <el-table-column label="保险公司" prop="insuranceCompanyName" min-width="180"></el-table-column>
                <el-table-column label="受益人姓名" prop="insuredName" min-width="120"></el-table-column>
                <el-table-column label="受益人手机" prop="insuredMobile" min-width="120"></el-table-column>
                <el-table-column label="购保日期" prop="createDate" min-width="120"></el-table-column>
              </el-table>
            </el-collapse-item>
            <!--行程单信息-->
            <el-collapse-item title="行程单信息" name="travelMail" v-if="travelMailFlag && travelMailList.length > 0">
              <el-table
                border
                :data="travelMailList"
                :header-cell-style="selfHeaderCellStyle"
                :cell-style="selfCellStyle">
                <el-table-column label="收件人" prop="addressee" min-width="100"></el-table-column>
                <el-table-column label="电话" prop="phone" min-width="120"></el-table-column>
                <el-table-column label="地址" prop="address" min-width="180"></el-table-column>
                <el-table-column label="申请日期" prop="applyDate" min-width="120"></el-table-column>
                <el-table-column label="邮寄方式" prop="applyType" min-width="100">
                  <template slot-scope="scope">
                    <span v-if="scope.row.applyType === '1'">自取</span>
                    <span v-if="scope.row.applyType === '2'">邮寄</span>
                  </template>
                </el-table-column>
                <el-table-column label="邮寄状态" prop="emailStatus" min-width="100">
                  <template slot-scope="scope">
                    <span v-if="scope.row.applyType === '1'">未邮寄</span>
                    <span v-if="scope.row.applyType === '2'">已邮寄</span>
                  </template>
                </el-table-column>
                <el-table-column label="邮寄日期" prop="dcDate" min-width="140"></el-table-column>
              </el-table>
            </el-collapse-item>
            <!--升舱订单列表-->
            <el-collapse-item title="改升订单列表" name="upgrade" v-if="upgradeFlag && upgradeList.length > 0">
              <el-table
                border
                :data="upgradeList"
                :header-cell-style="selfHeaderCellStyle"
                :cell-style="selfCellStyle">
                <el-table-column label="订单编号" prop="ordercode" min-width="160">
                  <template slot-scope="scope">
                    <div class="active-text" @click="switchDialoga(scope.row)">{{scope.row.ordercode}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="产品名称" prop="productname" min-width="100"></el-table-column>
                <el-table-column label="订单状态" prop="order_status" min-width="140">
                  <template slot-scope="scope">
                    <div>{{scope.row.order_status | outTicketStatusMap}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="支付状态" prop="paystatus" min-width="100">
                  <template slot-scope="scope">
                    <div>{{scope.row.paystatus | payStatusMap}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="订单金额" prop="paymoney" min-width="100">
                  <template slot-scope="scope">
                    {{scope.row.paymoney | formatPriceMap}}
                  </template>
                </el-table-column>
                <el-table-column label="订单时间" prop="creadate" min-width="160"></el-table-column>
              </el-table>
            </el-collapse-item>
            <!--K座列表-->
            <el-collapse-item title="K座记录" name="upgrade" v-if="kSeatListFlag && kSeatList.length > 0">
              <el-table
                border
                :data="kSeatList"
                :header-cell-style="selfHeaderCellStyle"
                :cell-style="selfCellStyle">
                <el-table-column label="pnr编号" prop="pnr" min-width="80"></el-table-column>
                <el-table-column label="出发城市" prop="afrom" min-width="100"></el-table-column>
                <el-table-column label="到达城市" prop="ato" min-width="100"></el-table-column>
                <el-table-column label="K座状态" prop="recordStatus" min-width="100">
                  <template slot-scope="scope">
                    <div>{{scope.row.recordStatus === '0' ? '失败' : '成功'}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="K座时间" prop="createDate" min-width="160"></el-table-column>
              </el-table>
            </el-collapse-item>
            <!--订单操作日志-->
            <el-collapse-item title="订单操作日志" name="logInsert" v-if="logInsertFlag && journalList.length > 0">
              <el-table
                border
                :data="journalList"
                :header-cell-style="selfHeaderCellStyle"
                :cell-style="selfCellStyle">
                <el-table-column label="处理时间" prop="creatime" min-width="100"></el-table-column>
                <el-table-column label="处理类型" prop="prcsType" min-width="100">
                  <template slot-scope="scope">
                    <div>{{scope.row.prcsType | prcsTypeMap}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="记录内容" prop="prcsContent" min-width="180"></el-table-column>
              </el-table>
            </el-collapse-item>
            <!--附加商品详情-->
            <el-collapse-item title="附加商品详情" name="productInfo">
              <el-table
                :data="productInfo.rows"
                border
                :header-cell-style="selfHeaderCellStyle"
                :cell-style="selfCellStyle">
                <el-table-column label="商品名称" prop="productName" min-width="140"></el-table-column>
                <el-table-column label="数量" prop="saleNum" min-width="60"></el-table-column>
                <el-table-column label="单价" prop="salePrice" min-width="60"></el-table-column>
                <el-table-column label="支付金额" prop="paymoney" min-width="80"></el-table-column>
                <el-table-column label="领取人" prop="receiveName" min-width="80"></el-table-column>
                <el-table-column label="领取人电话" prop="receiveMobile" min-width="120"></el-table-column>
                <el-table-column label="领取人座位号" prop="receiveSeatno" min-width="120"></el-table-column>
                <el-table-column label="机票号" min-width="140" prop="ticketNo"></el-table-column>
                <el-table-column label="订单状态" min-width="80">
                  <template slot-scope="scope">
                    <div>{{ scope.row.detailStatus | syncProductStatusMap }}</div>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="dialog-footer">
          <el-button size="medium" v-if="orderDetilList.type === 'payDetail'" @click="handleBackfill">回填流水号</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { queryOrderInfoByOrderId, queryPassageList, querySementList, checkFlightSegment, queryInsuranceInfoList, queryTravelMailList, queryUpgradOrderInfo, queryOrderProcessingList, updatePayserial, queryHKSeatList } from './api'
import { fetchList } from '../views/ticket/refundFir/api'
import { queryProductOrderByOrderid } from '../api'
export default {
  name: 'index',
  data () {
    return {
      fPassageTitle: '', // 第一航段标题
      sPassageTitle: '', // 第二航段标题
      activeNamesOrder: [
        'order',
        'firstPassage',
        'secondPassage',
        'payment',
        'contacts',
        'refundInfo',
        'insurance',
        'travelMail',
        'logInsert',
        'upgrade',
        'productInfo'
      ],
      oldOrderList: [], // 订单信息（原票）
      orderList: [], // 订单信息表格/支付信息/联系人信息（新票）
      productInfo: {}, // 附加商品列表
      firstSementList: [], // 第一航段信息表格（新票）
      oldFirstSementList: [], // 第一航段信息表格（原票）
      firstPassageList: [], // 第一航段乘客表格（新票）
      oldFirstPassageList: [], // 第一航段乘客表格(原票)
      secondSementList: [], // 第二航段信息表格（新票）
      oldSecondSementList: [], // 第二航段信息表格（原票）
      secondPassageList: [], // 第二航段乘客表格（新票）
      oldSecondPassageList: [], // 第二航段乘客表格（原票）
      insuranceList: [], // 保险信息表格
      travelMailList: [], // 行程单信息表格
      upgradeList: [], // 升舱订单列表表格
      journalList: [], // 订单操作日志表格
      segmentFlag: false, // 第二航段显示隐藏
      passageFlag: '', // 航段内容判断显示隐藏
      insuranceFlag: false, // 保险信息判空
      travelMailFlag: false, // 行程单信息判空
      logInsertFlag: false, // 订单操作日志判空
      upgradeFlag: false, // 升舱订单列表判空
      refundList: [], // 退票信息
      upstatus: '',
      kSeatList: [], //  K座位记录
      kSeatListFlag: false,
      gFlag: false,
      selfHeaderCellStyle: {
        height: '40px',
        padding: '0',
        lineHeight: '40px',
        background: '#f2f6fc',
        fontSize: '14px',
        color: '#606266',
        fontWeight: '600'
      },
      selfCellStyle: {
        fontSize: '14px',
        paddingTop: '13px',
        paddingBottom: '13px',
        lineHeight: '1',
        color: '#333'
      }
    }
  },
  props: {
    orderDetilList: {
      type: Object,
      required: true
    }
  },
  filters: {
    // 操作类型 -- 过滤器
    prcsTypeMap (prcsType) {
      let prcsTypeName = ''
      switch (prcsType) {
        case '0':
          prcsTypeName = '沟通'
          break
        case '1':
          prcsTypeName = '投递'
          break
        case '2':
          prcsTypeName = '退票审核'
          break
        case '3':
          prcsTypeName = '退票完成'
          break
        case '4':
          prcsTypeName = '手工退票'
          break
        case '5':
          prcsTypeName = '手工出票'
          break
        case '7':
          prcsTypeName = '退保'
          break
        case '9':
          prcsTypeName = '退积分'
          break
        default:
          prcsTypeName = '退票'
      }
      return prcsTypeName
    }
  },
  mounted () {
  },
  created () {
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      order: state => state.tagsView.order
    })
  },
  methods: {
    backs () {
      if (this.upstatus) {
        this.orderList = this.order.orderDate
        this.firstPassageList = this.order.firstPassageData
        this.secondPassageList = this.order.secondPassageList
        this.insuranceList = this.order.insuranceList
        this.travelMailList = this.order.travelMailList
        this.upgradeList = this.order.upgradeList
        this.journalList = this.order.journalList
        this.fPassageTitle = this.order.fPassageTitle
        this.sPassageTitle = this.order.sPassageTitle
        this.kSeatList = this.order.kSeatList
        //  如果等于 1 升舱等于true 如果改期的变量等于2 改期等于true
        this.upgradeFlag = true
        this.upstatus = ''
        return false
      }
      if (!this.upstatus) {
        this.orderDetilList.orderVisible = false
        this.kSeatListFlag = false
      }
    },
    switchDialoga (rows) {
      let order = {
        orderDate: this.orderList,
        firstPassageData: this.firstPassageList,
        secondPassageList: this.secondPassageList,
        insuranceList: this.insuranceList,
        travelMailList: this.travelMailList,
        upgradeList: this.upgradeList,
        journalList: this.journalList,
        fPassageTitle: this.fPassageTitle,
        sPassageTitle: this.sPassageTitle,
        kSeatList: this.kSeatList
      }
      this.upstatus = '1'
      this.orderDetails(order)
      this.$emit('upgrad', rows)
    },
    // 订单信息
    getOrderData (data) {
      queryOrderInfoByOrderId(data).then(res => {
        this.orderList = res.rows
        if (res.obj) {
          this.oldOrderList = [res.obj]
        } else {
          this.oldOrderList = []
        }
        if (this.orderList[0].changeReason) {
          this.gFlag = true
        } else {
          this.gFlag = false
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 第一/二航段乘客表格
    getFirstPassageData (data) {
      queryPassageList(data).then(res => {
        if (data.segid === '1') {
          this.firstPassageList = res.rows
          if (res.obj && res.obj.length) {
            this.oldFirstPassageList = res.obj
          } else {
            this.oldFirstPassageList = []
          }
        } else {
          this.secondPassageList = res.rows
          if (res.obj) {
            this.oldSecondPassageList = res.obj
          }
        }
        this.handleData(res.rows)
        this.getFirstSementList(data)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 第一/二航段信息表格
    getFirstSementList (data) {
      querySementList(data).then(res => {
        if (data.segid === '1') {
          // 第一航段
          this.firstSementList = res.rows
          if (res.obj) {
            this.oldFirstSementList = [res.obj]
          } else {
            this.oldFirstSementList = []
          }
          this.fPassageTitle = '第一航段：' + this.firstSementList[0].flightSegment
          if (this.firstSementList[0].isairrailway === '1') {
            this.fPassageTitle = this.fPassageTitle + '（空轨客票）'
          }
        } else {
          // 第二航段
          this.secondSementList = res.rows
          if (res.obj) {
            this.oldSecondSementList = [res.obj]
          } else {
            this.oldSecondSementList = []
          }
          this.sPassageTitle = '第二航段：' + this.secondSementList[0].flightSegment
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 第二航段判断
    getCheckFlightSegment (data, state) {
      checkFlightSegment(data).then(res => {
        this.segmentFlag = res.obj.segmentFlag
        if (this.segmentFlag === true) {
          this.getFirstPassageData(data)
        }
        if (this.upstatus) {
          this.upgradeFlag = false
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 保险信息
    getInsuranceInfoData (data) {
      queryInsuranceInfoList(data).then(res => {
        this.insuranceList = res.rows
        if (this.insuranceList.length > 0) {
          this.insuranceFlag = true
        } else {
          this.insuranceFlag = false
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 行程单信息
    getTravelMailData (data) {
      queryTravelMailList(data).then(res => {
        this.travelMailList = res.rows
        if (this.travelMailList.length > 0) {
          this.travelMailFlag = true
        } else {
          this.travelMailFlag = false
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 升舱订单列表
    getUpgradeData (data) {
      queryUpgradOrderInfo(data).then(res => {
        this.upgradeList = res.rows
        if (this.upgradeList.length > 0) {
          this.upgradeFlag = true
        } else {
          this.upgradeFlag = false
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 订单操作日志
    getOrderProcessingList (data) {
      queryOrderProcessingList(data).then(res => {
        this.journalList = res.rows
        if (this.journalList.length > 0) {
          this.logInsertFlag = true
        } else {
          this.logInsertFlag = false
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    handleData (params) {
      if (params[0].ticketType === 'upgrad' && (params[0].initialTicketid === null || params[0].initialTicketid === '' || params[0].initialTicketid === 'null')) {
        this.passageFlag = '0'
      } else if (params[0].ticketType === 'upgrad' && params[0].initialTicketid !== null && params[0].initialTicketid !== '' && params[0].initialTicketid !== 'null') {
        this.passageFlag = '1'
      } else {
        this.passageFlag = '2'
      }
    },
    //  K座记录
    getKSeatList (params) {
      // kSeatList: [], //  K座位记录
      //   kSeatListFlag: false
      queryHKSeatList(params).then(res => {
        this.kSeatList = res.rows
        if (this.kSeatList.length > 0) {
          this.kSeatListFlag = true
        } else {
          this.kSeatListFlag = false
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 回填流水号
    handleBackfill () {
      let data = {
        payserial: this.orderDetilList.payserial,
        payId: this.orderDetilList.payId
      }
      this.$confirm('是否确认回填流水号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        updatePayserial(data).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.orderDetilList.orderVisible = false
          this.$emit('tableList', 1, this.pagination.pageSize)
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消回填流水号'
        })
      })
    },
    // 查询退票信息
    queryRefund (data) {
      fetchList(data).then(res => {
        // console.log(res)
        this.refundList = res.rows
      }).catch(err => {
        console.log(err)
      })
    },
    // 查询附加商品列表根据orderId
    queryProductInfoByOrderId (id) {
	    // console.log('调取了详情')
      queryProductOrderByOrderid({ orderid: id })
        .then(res => {
	        // console.log('订单信息',res,'orderid',id)
          let arr = []
          res.rows.forEach(item => {
            item.productOrderDetailBeanList.forEach(val => {
              arr.push(val)
            })
          })
          this.productInfo = {
            rows: arr
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
	  // 重置查询附加商品列表根据orderId
	  queryProductInfoReset () {
		  this.productInfo = {}
	  },
    ...mapMutations({
      orderDetails: 'ORDER_LIST'
    })
  }
}
</script>

<style lang="scss">
  .el-collapse-item__header {
    background-color: #f7f7f7;
  }
</style>
