<template>
  <!--<h1>升舱产品保底价格政策设置</h1>-->
  <div id="UpgradLowestPrice" class='container'>
    <div class="header" ref="header">
      <div class="search-container clearfix">
      <!--文本框编辑-->
            <div class="search-item search-ipt">
              <!--<span>产品编码 : </span>-->
              <el-input v-model='params.upgradCode' placeholder='请输入内容' size='medium' clearable @keydown.enter.native="initList()"></el-input>
            </div>
            <div class="search-item search-ipt">
              <!--<span>产品名称 : </span>-->
              <el-input v-model='params.upgradName' placeholder='请输入产品名称' size='medium' clearable @keydown.enter.native="initList()"></el-input>
            </div>
            <div class="search-item search-ipt">
              <!--<span>创建人 : </span>-->
              <el-input v-model='params.createName' placeholder='请输入创建人' size='medium' clearable @keydown.enter.native="initList()"></el-input>
            </div>
            <div class="search-item">
              <!--<span>启用/禁用 ： </span>-->
              <el-select v-model='params.priceStatus' :multiple='false' clearable placeholder='启用/禁用' size='medium'>
                <!--<el-option label="全部" value="-1"></el-option>-->
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
              </el-select>
            </div>
            <div class='search-item search-ipt'>
              <!--<span>渠道类型 : </span>-->
              <el-select v-model='params.channel' clearable placeholder='渠道类型' value-key="stateid" size='medium'>
                <!--<el-option value="" label="全部"></el-option>-->
                <el-option
                  v-for='item in channelList'
                  :key='item.chalId'
                  :label='item.chalName'
                  :value='item.chalCode'>
                </el-option>
              </el-select>
            </div>
            <div class="search-item search-ipt">
              <el-button  type="primary" :loading='false' size='medium' @click="search()">查询</el-button>
              <el-button size='medium' @click='reseting()'>重置</el-button>
            </div>
      </div>
      <div class='search-item' style="padding: 10px">
        <el-button  size='medium' @click="rescive(null)">添加</el-button>
        <el-button type='danger' :disabled='dataArr.length === 0'  size='medium' @click="del(null)">批量删除</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          :border="tableAttributes.border"
          :height='dataViewHeight'
          :data='priceList'
          @selection-change='handleSelectionChange'
          v-loading='loading'
          @row-click="clickRow"
          :cell-style="tableAttributes.cellStyle"
          row-key="lowestpriceid"
          ref="refTable"
          element-loading-background="rgba(255, 255, 255, 0.8)"
        >
          <!--<el-table-column  fixed="left" align='left'>-->
            <!--<template slot-scope="scope">-->
              <!--{{scope.row.channel | channelMap }}-->
            <!--</template>-->
          <!--</el-table-column>-->
<!--          <el-table-column label='序号' fixed="left" type='index' align='left' width="50"></el-table-column>-->
          <el-table-column type='selection' fixed="left"  align='left'></el-table-column>
          <el-table-column label='产品编码'  fixed="left"  align='left'  min-width="100">
            <template slot-scope="scope">
              <div class="blue-text">{{scope.row.upgradcode}}</div>
            </template>
          </el-table-column>
          <el-table-column label='产品名称'  align='left' prop='upgradname'></el-table-column>
          <el-table-column label='渠道类型'  align='left' prop='channel' min-width="160">
            <template slot-scope="scope">
              {{scope.row.channel | channelMap }}
            </template>
          </el-table-column>
          <el-table-column label='成人保底价格'  align='left' prop='idtlowestprice' min-width="120"></el-table-column>
          <el-table-column label='儿童保底价格'  align='left'  min-width="120" prop='chdlowestprice' :formatter='formatChild'></el-table-column>
          <el-table-column label='婴儿保底价格'  align='left'  min-width="120" prop='inflowestprice ' :formatter='formatIn'></el-table-column>
          <el-table-column label='创建人'  align='left' prop='createname'></el-table-column>
          <el-table-column label='创建时间'  align='left' prop='createdate' min-width="160"></el-table-column>
          <el-table-column label='修改人' align='left' prop='modifyname'  :formatter='resPeople'></el-table-column>
          <el-table-column label='修改时间' align='left' prop='modifydate' min-width="160"  :formatter='resTime'></el-table-column>
          <el-table-column label='备注'  align='left' prop='upgradRemark' :formatter='priceremark'></el-table-column>
          <el-table-column label='操作' align='center' min-width="120" fixed="right">
                <template slot-scope='scope'>
                  <span class="active-text mr-5" @click='handledit({ id: scope.row.lowestpriceid, status: scope.row.pricestatus })' v-if="scope.row.pricestatus === '1'" title="启用">禁用</span>
                  <span class="active-text mr-5" @click='handledit({ id: scope.row.lowestpriceid, status: scope.row.pricestatus })' v-if="scope.row.pricestatus === '0'" title="禁用">启用</span>
                  <span class="active-text mr-5" title="编辑" @click="rescive(scope.row, 'revise')">编辑</span>
                  <span class="danger-text mr-5" title="删除" @click="del(scope.row)">删除</span>
                </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <el-pagination
        @size-change='handleSizeChange'
        @current-change='handleCurrentChange'
        :current-page='currentPage'
        :page-sizes='pagination.pageSizes'
        :page-size='pagination.pageSize'
        layout='total, sizes, prev, pager, next, jumper'
        :total='totle'>
      </el-pagination>
    </div>
    <!--弹框-->
    <el-dialog :title="msgtitle" :visible.sync="dialogFormVisible" width="560px">
      <div class="dialog-container">
        <div class="dialog-main" v-loading="diaLoading">
          <div class="row">
            <div class="column">
              <div class="label">升舱产品</div>
              <div class="ipt-medium">
                <el-select size="medium" v-model="msg.upgradId">
                  <el-option
                    v-for='item in info'
                    :key='item.upgradId'
                    :label='item.upgradName'
                    :value='item.upgradId'>
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label required">渠道类型</div>
              <div class="ipt-medium">
                <el-select v-model='msg.channel'  multiple  clearable collapse-tags  placeholder='全部' @change='submit2(msg.channel)'  size='medium' style='width: 210px'>
                  <el-option
                    v-for='item in channelList'
                    :key='item.chalId'
                    :label='item.chalName'
                    :value='item.chalCode'>
                  </el-option>
                </el-select>
                <div class="warning-info" v-if="flags && msg.channel.length === 0">成人保底价格不可为空</div>
              </div>
            </div>
          </div>
            <div class="row">
              <div class="column">
                <div class="label required">成人保底价格</div>
                <div class="ipt-medium">
                  <el-input size="medium" clearable v-model="msg.idtlowestprice" style="width: 210px;"  title="此选项为必填项"></el-input>
                </div>
                <div class="warning-info" v-if="flags && !msg.idtlowestprice">成人保底价格不可为空</div>
                <!--<span class="warning-info mustmsg" v-if="flag && !msg.authority">{{dangmsg}}</span>-->
              </div>
              <div class="column">
                <div class="label">儿童保底价格</div>
                <div class="ipt-medium">
                  <el-input size="medium" clearable v-model="msg.chdlowestprice" style="width: 210px;"></el-input>
                </div>
              </div>
            </div>
          <div class="row">
            <div class="column">
              <div class="label">婴儿保底价格</div>
              <div class="ipt-medium">
                <el-input size="medium" clearable v-model="msg.inflowestprice" style="width: 210px;"></el-input>
              </div>
              </div>
            <div class="column">
              <div class="label">启用/禁用 ： </div>
              <div class="ipt-medium">
                <el-select size="medium" placeholder="是否禁用" v-model="msg.pricestatus">
                  <el-option value="0" label="启用"></el-option>
                  <el-option value="1" label="禁用"></el-option>
                </el-select>
              </div>
            </div>
          </div>
        <div class="row">
          <div class="column">
            <div class="label">备注 ： </div>
            <div class="ipt-medium">
              <el-input
              type="textarea"
              :rows="2"
              size="medium"
              placeholder="请输入内容"
              v-model="msg.textarea"
              style="width: 210px">
              </el-input>
            </div>
          </div>
        </div>
    </div>
      <div class="dialog-footer">
        <div class="box"></div>
        <el-button size="medium" type="primary" @click="refer">提交</el-button>
        <el-button size="medium" v-if="refs === 'add'" @click="reset">重置</el-button>
        <el-button size="medium" @click="back">返回</el-button>
      </div>
    </div>
    </el-dialog>
  </div>
</template>
<script>
import { priceList, addList, updateStatus, revise, deleteUpgradLowestPrice, channels, viewUpgradLowestPriceInfo } from './api.js'
import regs from './http.congif'
import { getChannelList } from '../../../utils/index'
import { mapState } from 'vuex'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'UpgradLowestPrice',
  data () {
    return {
      dangmsg: '请输入成人保底价格',
      dataViewHeight: null,
      input: '',
      input1: '',
      input2: '',
      input3: '',
      list: [ { id: 1, value: '全部' }, { id: 2, value: '启用' }, { id: 3, value: '禁用' } ],
      list1: [ { id: 1, value: '启用' }, { id: 2, value: '禁用' } ],
      state: [
        { stateid: 1, value: '全部', name: '' },
        { stateid: 2, value: '手机客户端', name: 'app' },
        { stateid: 3, value: '小程序', name: 'mini' },
        { stateid: 4, value: '微信公众号', name: 'wx' },
        { stateid: 5, value: '官网', name: 'web' }],
      stateName: '全部',
      value1: '全部',
      priceList: [],
      currentPage: 1, //  初始页
      pagesize: 20, //  每页的数据
      total: 0,
      loading: false,
      dataArr: [],
      revice: true,
      msgtitle: '增加升舱时间维护信息',
      dialogFormVisible: false,
      info: [],
      channel: '手机客户端',
      ibtPrice: '',
      childPrice: '',
      intPrice: '',
      status: '',
      textarea: '',
      msg: {
        idtlowestprice: '',
        chdlowestprice: '',
        inflowestprice: '',
        textarea: '',
        channel: ['app'],
        pricestatus: '',
        upgradId: ''
      },
      params: {
        page: 1, //  页码
        rows: 20, //  每页条数
        upgradCode: '', //  编号
        upgradName: '', //  产品名称
        createName: '', //  创建人
        priceStatus: '', //  启用禁用状态
        channel: ''//  渠道
      },
      totle: null,
      refs: null,
      reg: null,
      lowestPriceId: null,
      expands: [],
      flag: true,
      flags: false,
      tFlag: true,
      diaLoading: false
    }
  },
  methods: {
    initList () {
      this.currentPage = 1
      this.initData()
    },
    clickRow (row) {
      if (this.tFlag) this.$refs.refTable.toggleRowSelection(row)
      this.tFlag = true
    },
    //  添加修改渠道类型
    submit2 (channel) {
    },
    //  添加弹出框重置
    reset () {
      this.msg = {
        idtlowestprice: '',
        chdlowestprice: '',
        inflowestprice: '',
        textarea: '',
        channel: ['app'],
        pricestatus: '1',
        upgradname: '1'
      }
    },
    //  弹出框返回
    back () {
      this.dialogFormVisible = false
    },
    formatChild: (row, column, cellValue, index) => {
      return row.chdlowestprice === '' ? '- -' : row.chdlowestprice
    },
    resPeople: (row, column, cellValue, index) => {
      return row.modifyname === '' ? '- -' : row.modifyname
    },
    formatIn: (row, column, cellValue, index) => {
      return row.inflowestprice === '' ? '- -' : row.inflowestprice
    },
    priceremark: (row, column, cellValue, index) => {
      return row.priceremark === '' ? '- -' : row.priceremark
    },
    handleEdit: () => {
    },
    resTime: (row, column, cellValue, index) => {
      return row.modifydate === '' ? '- -' : row.modifydate
    },
    handleSizeChange (size) {
      this.pagesize = size
      this.initData()
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.initData()
    },
    handleSelectionChange (val) {
      this.dataArr = val
    },
    //  重置
    reseting () {
      this.params = {
        page: 1, //  页码
        rows: 20, //  每页条数
        upgradCode: '', //  编号
        upgradName: '', //  产品名称
        createName: '', //  创建人
        priceStatus: '', //  启用禁用状态
        channel: ''//  渠道
      }
      this.currentPage = 1
      this.initData()
    },
    handledit (data = {}) {
      this.tFlag = false
      if (data.status === '1') {
        data.status = '0'
      } else {
        data.status = '1'
      }
      this.$confirm('是否确认修改启用/停用状态', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        updateStatus(data).then(res => {
          this.initData()
          this.$message({
            message: '修改成功',
            type: 'success'
          })
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
    rescive (param) {
      this.dialogFormVisible = true
      this.flag = true
      this.tFlag = false
      if (param !== null) {
        //  修改
        // console.log(param)
        this.msgtitle = '修改升舱保底价格政策信息'
        this.refs = 'revise'
        let data = {
          lowestPriceId: param.lowestpriceid
        }
        this.diaLoading = true
        viewUpgradLowestPriceInfo(data).then(res => {
          this.diaLoading = false
          for (let item in res.obj) {
            for (let items in this.msg) {
              if (item === items) {
                this.msg[items] = res.obj[item]
              }
            }
          }
          this.msg['channel'] = res.obj.channel.split(',')
          this.msg['upgradId'] = res.obj.upgradId
          if (res.obj.priceStatus === '0') {
            this.msg.pricestatus = '1'
          } else {
            this.msg.pricestatus = '0'
          }
          this.msg['textarea'] = res.obj.priceRemark
          this.msg['idtlowestprice'] = res.obj.idtLowestPrice
          this.msg['chdlowestprice'] = res.obj.chdLowestPrice
          this.msg['inflowestprice'] = res.obj.inflowestPrice
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        //  添加
        this.tFlag = true
        this.msgtitle = '添加升舱保底价格政策信息'
        this.refs = 'add'
        for (let item in this.msg) {
          this.msg[item] = ''
        }
        this.msg.pricestatus = '1'
        this.msg.channel = ['app']
        if (this.info.length) {
          this.msg.upgradId = this.info[0].upgradId
        }
      }
    },
    statu (str) {
      let list = []
      let strList = str.split(',')
      for (let item of this.state) {
        for (let items of strList) {
          if (item.name === items) {
            list.push(item.value)
          }
        }
      }
      return list
    },
    upgradId (str) {
      let st = ''
      for (let item of this.info) {
        if (item.upgradName === str) {
          st = item.upgradId
        }
      }
      return st
    },
    del (param) {
      //  获取选中数组里面的序号
      let lowestPriceIds = ''
      this.tFlag = false
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        if (param !== null) {
          lowestPriceIds = param.lowestpriceid
        } else {
          for (let item of this.dataArr) {
            lowestPriceIds += ',' + item.lowestpriceid
          }
          lowestPriceIds = lowestPriceIds.substring(1)
        }
        deleteUpgradLowestPrice(lowestPriceIds).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.initData()
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
      // this.initData()
    },
    initData () {
      this.loading = true
      this.params.rows = this.pagesize
      this.params.page = this.currentPage
      priceList(this.params).then(res => {
        if (res.isSuccessOrfail === 'SUCCESS') {
          this.priceList = res.rows
          this.totle = res.total
          this.loading = false
        }
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
      channels().then(res => {
        this.info = res.obj
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    //  搜索
    search () {
      this.currentPage = 1
      this.initData()
    },
    //  添加修改
    refer () {
      this.flags = true
      let list = this.msg.channel
      let pricestatus = this.msg.pricestatus
      let chdlowestprice = this.msg.chdlowestprice
      let idtLowestPrice = this.msg.idtlowestprice
      let inflowestprice = this.msg.inflowestprice
      let priceRemark = this.msg.textarea
      let upgradId = this.msg.upgradId
      if (list.length <= 0) {
        this.$message.error('请选择渠道类型')
        return false
      }
      if (!idtLowestPrice || this.msg.channel.length === 0) {
        return false
      }
      if (regs.price(this.msg.idtlowestprice) === '1') {
        this.flag = false
        this.dangmsg = '请输入大于0的正数'
        return false
      }
      if (regs.price(this.msg.chdlowestprice) === '1') {
        this.$message.error('儿童保底价格格式错误')
        return false
      }
      if (regs.price(this.msg.inflowestprice) === '1') {
        this.$message.error('婴儿保底价格格式错误')
        return false
      }
      this.dialogFormVisible = false
      list = list.join(',')
      if (pricestatus === '1') {
        pricestatus = '0'
      } else {
        pricestatus = '1'
      }
      let msgObj = {
        channel: list,
        priceStatus: pricestatus,
        chdLowestPrice: chdlowestprice,
        idtLowestPrice: idtLowestPrice,
        inflowestPrice: inflowestprice,
        upgradId: upgradId,
        priceRemark: priceRemark
      }
      // console.log(msgObj)
      // revise
      if (this.refs === 'add') {
        addList(msgObj).then(res => {
          if (res.isSuccessOrfail === 'SUCCESS') {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.initData()
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        // revise
        msgObj['lowestPriceId'] = this.lowestPriceId
        revise(msgObj).then(res => {
          if (res.isSuccessOrfail === 'SUCCESS') {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.initData()
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
      }
    },
    //  多选选择渠道方法
    channe (ary) {
      let channe = ''
      for (let item of this.state) {
        for (let items of ary) {
          if (item.value === items) {
            channe += ',' + item.name
          }
        }
      }
      channe = channe.substring(1)
      return channe
    },
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList
    })
  },
  created () {
    this.judgeChannelList()
    this.pagesize = this.pagination.pageSize
    this.initData()
  },
  mixins: [computWidth],
  watch: {
    'msg.idtlowestprice': function (val) {
      if (val !== '') {
        this.flag = true
      } else {
        this.dangmsg = '请输入成人保底价格'
        this.flag = false
      }
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
