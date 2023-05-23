<template>
<!--  <div>常旅客集团化管理</div>-->
  <div id="RegularPassenger" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select size="medium" v-model="filter.userType" clearable placeholder="用户类型">
            <el-option label="全部" value=""></el-option>
            <el-option label="手机" value="1"></el-option>
            <el-option label="邮箱" value="2"></el-option>
            <el-option label="身份证" value="3"></el-option>
            <el-option label="常旅客" value="4"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input :disabled="filter.userType === ''" size="medium" placeholder="用户编号" v-model="filter.userNo" clearable @keydown.enter.native="getHbairPassengerList()"></el-input>
        </div>
<!--        <div class="search-item search-ipt">-->
<!--          <el-input size="medium" placeholder="中文名" v-model="filter.cnName" clearable @keydown.enter.native="getHbairPassengerList()"></el-input>-->
<!--        </div>-->
<!--        <div class="search-item search-ipt">-->
<!--          <el-select size="medium" v-model="filter.sex" clearable placeholder="性别">-->
<!--            <el-option label="男" value="1"></el-option>-->
<!--            <el-option label="女" value="2"></el-option>-->
<!--            <el-option label="未知" value="8"></el-option>-->
<!--          </el-select>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-select size="medium" v-model="filter.isInter" clearable placeholder="国内/国际">
            <el-option label="国内" value="0"></el-option>
            <el-option label="国际" value="1"></el-option>
          </el-select>
        </div>
<!--        <div class="search-item search-ipt">-->
<!--          <el-select size="medium" v-model="filter.certType" clearable placeholder="证件类型">-->
<!--            <el-option label="身份证" value="0"></el-option>-->
<!--            <el-option label="护照" value="4"></el-option>-->
<!--            <el-option label="其他" value="5"></el-option>-->
<!--          </el-select>-->
<!--        </div>-->
<!--        <div class="search-item search-ipt">-->
<!--          <el-select size="medium" v-model="filter.passengerType" clearable placeholder="乘机人类型">-->
<!--            <el-option label="成人" value="0"></el-option>-->
<!--            <el-option label="儿童" value="1"></el-option>-->
<!--            <el-option label="婴儿" value="2"></el-option>-->
<!--          </el-select>-->
<!--        </div>-->
        <div class="search-item search-ipt">
          <el-select size="medium" clearable placeholder="渠道" v-model="filter.channel">
            <el-option v-for="item in channelList" :key="item.chalId" :label="item.chalName" :value="item.chalCode"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getHbairPassengerList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button type="success" size="medium" @click="exportPassenger">导出</el-button>
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
        <el-table v-loading="loading" :height="dataViewHeight" :data="passengerList.rows" :border="tableAttributes.border"
                  :row-class-name="tableRow"
                  :cell-style="tableAttributes.cellStyle">
<!--          <el-table-column type="selection"></el-table-column>-->
          <el-table-column :key="1" label="会员姓名" prop="realName" min-width="120" v-if="tableList.realName"></el-table-column>
          <el-table-column :key="2" label="乘机人类型" prop="passengerType" v-if="tableList.passengerType" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.passengerType === '0'">成人</span>
              <span v-else-if="scope.row.passengerType === '1'">儿童</span>
              <span v-else-if="scope.row.passengerType === '2'">婴儿</span>
            </template>
          </el-table-column>
          <el-table-column :key="3" label="乘机人姓名" prop="cnName" v-if="tableList.cnName" min-width="160"></el-table-column>
          <el-table-column :key="4" label="国内/国际" prop="isInter" v-if="tableList.isInter" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.isInter === '0' ? '国内' : '国际' }}</span>
            </template>
          </el-table-column>
          <el-table-column :key="5" label="性别" prop="sex" v-if="tableList.sex">
            <template slot-scope="scope">
              <span v-if="scope.row.sex ==='1'">男</span>
              <span v-else-if="scope.row.sex ==='2'">女</span>
              <span v-else>未知</span>
            </template>
          </el-table-column>
          <el-table-column :key="6" label="生日" prop="birthDay" v-if="tableList.birthDay" min-width="120"></el-table-column>
          <el-table-column :key="7" label="手机号" prop="phone" v-if="tableList.phone" min-width="120"></el-table-column>
          <el-table-column :key="8" label="证件类型" prop="certType" v-if="tableList.certType" min-width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.certType === '0'">身份证</span>
              <span v-else-if="scope.row.certType === '4'">护照</span>
              <span v-else-if="scope.row.certType === '5'">其他证件</span>
            </template>
          </el-table-column>
          <el-table-column :key="9" label="证件号" prop="idNo" min-width="180" v-if="tableList.idNo"></el-table-column>
          <el-table-column :key="10" label="关系" prop="relationship" v-if="tableList.relationship" min-width="80"></el-table-column>
          <el-table-column :key="11" label="军警残证件类型" prop="mnpType" v-if="tableList.mnpType" min-width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.mnpType === '01'">军残</span>
              <span v-else-if="scope.row.mnpType === '02'">警残</span>
            </template>
          </el-table-column>
          <el-table-column :key="12" label="军警残证件号" prop="mnpIdNo" v-if="tableList.mnpIdNo" min-width="160"></el-table-column>
          <el-table-column :key="13" label="军官(退役)证" prop="mnpOrNo" v-if="tableList.mnpOrNo" min-width="160"></el-table-column>
          <el-table-column :key="14" label="英文名" prop="enFirstName" v-if="tableList.enFirstName" min-width="140"></el-table-column>
          <el-table-column :key="15" label="英文姓" prop="enLastName" v-if="tableList.enLastName" min-width="120"></el-table-column>
          <el-table-column :key="16" label="国籍" prop="nationality" v-if="tableList.nationality" min-width="120"></el-table-column>
          <el-table-column :key="17" label="证件签发国" prop="cardSignNation" v-if="tableList.cardSignNation" min-width="120"></el-table-column>
          <el-table-column :key="18" label="证件失效日期" prop="cardInvalidDate" v-if="tableList.cardInvalidDate" min-width="120"></el-table-column>
          <el-table-column :key="19" label="证件生效日期" prop="cardValidDate" v-if="tableList.cardValidDate" min-width="120"></el-table-column>
          <el-table-column :key="20" label="渠道" prop="channel" v-if="tableList.channel" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.channel === 'null'"></span>
              <span v-else>{{ scope.row.channel | channelMap }}</span>
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
            :total="passengerList.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { hbairPassengerList } from './api'
import { computWidth } from '../../../mixins/computWidt'
import { checkAttrs } from '../../../mixins'
import {
  computeTableHeight,
  excelList,
  getChannelList,
  getDynamicTableCulmae,
  getModelImgType,
  getRouteName
} from '../../../utils/index'
import fieldMap from './refer'
export default {
  name: 'RegularPassenger',
  data () {
    return {
      loading: false,
      componentName: 'regularPassenger',
      checkList: fieldMap,
      checkedAll: false,
      isColumn: true,
      checked: [],
      isIndeterminate: false,
      dataViewHeight: null,
      filter: {
        userType: '',
        isInter: '',
        page: '',
        rows: ''
      },
      passengerList: {},
      tableList: {
        realName: true,
        cnName: true,
        isInter: false,
        sex: true,
        birthDay: true,
        phone: true,
        certType: true,
        idNo: false,
        passengerType: true,
        relationship: false,
        mnpType: false,
        mnpIdNo: false,
        mnpOrNo: false,
        enFirstName: false,
        enLastName: false,
        nationality: false,
        cardSignNation: false,
        cardInvalidDate: false,
        cardValidDate: false,
        // email: true,
        channel: true
      }
    }
  },
  created () {
    this.getChannelList()
    this.getHbairPassengerList(1, this.pagination.pageSize)
  },
  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList
    })
  },
  mixins: [computWidth, checkAttrs],
  methods: {
    switchColumn () {
      this.isColumn = !this.isColumn
      this.$nextTick(function () {
        this.dataViewHeight = computeTableHeight(this, 'header')
      })
    },
    locCheck () {
      //  如果本地有就取本地的
      if (getDynamicTableCulmae(this.componentName).length) {
        this.checked = getDynamicTableCulmae(this.componentName)
        if (this.checked.length === this.checkList.length) {
          this.checkedAll = true
        }
        for (let item in this.tableList) {
          if (this.checked.indexOf(item) !== -1) {
            this.tableList[item] = true
          } else {
            this.tableList[item] = false
          }
        }
      } else {
        for (let i = 0; i < this.checkList.length; i++) {
          if (this.checkList[i].flag) {
            this.checked.push(this.checkList[i].key)
            this.tableList[this.checkList[i].key] = true
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
        for (let item in this.tableList) {
          this.tableList[item] = true
        }
      } else {
        this.checked = []
        for (let item in this.tableList) {
          this.tableList[item] = false
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
      let flag = this.tableList[key]
      // if (flag) {
      //   console.log(1)
      //   for (let i = 0; i < this.checked.length; i++) {
      //     if (this.checked[i] === key) {
      //       this.checked.splice(i, 1)
      //     }
      //   }
      // }
      this.tableList[key] = flag ? this.tableList[key] = false : this.tableList[key] = true
    },
    tableRow ({ row, rowIndex }) {
      row.index = rowIndex
    },
    getChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    resetFilter () {
      this.filter = {}
      this.getHbairPassengerList(1, this.pagination.pageSize)
    },
    judgeChannelList () {
      if (!this.modelImgTypeList.length) {
        getModelImgType()
      }
    },
    // 分页导航
    handleSizeChange (pages) {
      this.getHbairPassengerList(null, pages)
    },
    handleCurrentChange (page) {
      this.getHbairPassengerList(page, null)
    },

    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    getHbairPassengerList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) {
        this.filter.rows = pageSize
      }
      hbairPassengerList(this.filter).then(res => {
        this.loading = false
        this.passengerList = res
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 导出
    exportPassenger () {
      let data = JSON.parse(JSON.stringify(this.filter))
      let url = 'hbairPassenger/exportHbairPassenger'
      let name = getRouteName('/regularPassenger')
      let type = 'xls'
      data.start = 1
      data.end = this.passengerList.total
      delete data.page
      delete data.rows
      let obj = {
        data,
        url,
        name,
        type
      }
      excelList(obj)
    }
  }
}
</script>

<style scoped>

</style>
