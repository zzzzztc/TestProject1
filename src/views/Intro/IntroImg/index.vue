<template>
  <div id="UpgradPropaganda" class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select v-model='params.propagandaChannel' clearable placeholder='渠道类型' title="渠道" size='medium'>
            <el-option
              v-for='item in channelList'
              :key='item.chalId'
              :label='item.chalName'
              :value='item.chalCode'>
            </el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="航班号" v-model="params.flightNo" title="航班号" @keydown.enter.native="initList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable v-model="params.isinter"  placeholder="国内/国际" title="国内/国际">
            <el-option label="国内" value="0"></el-option>
            <el-option label="国际" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='params.propagandaCabin' clearable placeholder='适用舱位' title="适用舱位" size='medium'>
            <el-option
              v-for='item in cabin'
              :key='item'
              :label='item'
              :value='item'>
            </el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" clearable v-model="params.propagandaStatus"  placeholder="启用/禁用" title="启用/禁用">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" clearable placeholder="航段1" v-model="params.depAirport" title="航段1" style="width: 82px" @keydown.enter.native="initList()"></el-input>
          <span class="line">-</span>
          <el-input size="medium" clearable placeholder="航段2" v-model="params.arrAirport" title="航段2" style="width: 82px" @keydown.enter.native="initList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="params.startFdate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班开始日期">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-date-picker
            v-model="params.endFdate"
            class="w-180"
            size="medium"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="航班截止日期">
          </el-date-picker>
        </div>
        <div class="search-item  search-ipt">
          <el-button size="medium" type="primary" @click="search">查询</el-button>
          <el-button size="medium" @click="initrefer">重置</el-button>
        </div>
      </div>
      <div class="search-container clearfix">
        <div class="search-item">
          <el-button size="medium" @click="rescive(null)">添加</el-button>
          <el-button size="medium" type= 'danger' :disabled='dataArr.length === 0' @click="del(null)">批量删除</el-button>
        </div>
      </div>
    </div>
  <div class="main">
    <div class="table-container">
    <el-table
      :cell-style="tableAttributes.cellStyle"
      :border="tableAttributes.border"
      :stripe="tableAttributes.stripe"
      ref="refTable"
      @row-click="clickRow"
      v-loading="loading"
      row-key="lowestpriceid"
      @selection-change='handleSelectionChange'
      :height="dataViewHeight"
      :data="priceList">
<!--      <el-table-column label='序号' fixed="left" type='index' width="50"></el-table-column>-->
      <el-table-column type='selection' fixed="left"></el-table-column>
      <el-table-column label="渠道" min-width="160">
        <template slot-scope="scope">
          {{scope.row.propagandaChannel | channelMap}}
        </template>
      </el-table-column>
      <el-table-column label="出发地" prop="depAirport" min-width="80"></el-table-column>
      <el-table-column label="到达地" prop="arrAirport" min-width="80"></el-table-column>
      <el-table-column label="航班号" prop="flightNo" min-width="80"></el-table-column>
      <el-table-column label="国内/国际" prop="isinter" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.isinter === '1'">国际</span>
          <span v-if="scope.row.isinter === '0'">国内</span>
        </template>
      </el-table-column>
      <el-table-column label="航班开始日期" prop="startFdate" min-width="160"></el-table-column>
      <el-table-column label="航班截止日期" prop="endFdate" min-width="160"></el-table-column>
      <el-table-column label="适用舱位" prop="propagandaCabin" min-width="160"></el-table-column>
      <el-table-column label="宣传标题" prop="propagandaTitle" min-width="160"></el-table-column>
      <el-table-column label="宣传正文" prop="propagandaContent" min-width="210"></el-table-column>
      <el-table-column label="宣传图片" min-width="160">
        <template slot-scope="scope">
          <div class="imgUrl">
            <img :src="scope.row.propagandaFilepath" alt="" v-if="!scope.row.flag" style="width: 100px;height: 50px;cursor: pointer;" @click.stop="previewImg(scope.row)">
            <i type="primary" title='点击复制' class="el-icon-document copy-btn" :data-clipboard-text="scope.row.propagandaFilepath" :class="scope.row.selName" @click="copy(scope.row.selName)"></i>
          </div>
          <!--<i type="primary" :data-clipboard-text="scope.row.propagandaFilepath" class="el-icon-document" @click="copy(scope.row.propagandaFilepath)"></i>-->
          <!--<input type="text" v-if="scope.row.flag" v-model="scope.row.propagandaFilepath" @blur="shoImg(scope.$index)" v-focus="focusState">-->
        </template>
      </el-table-column>
      <el-table-column label='操作'  align='left' width="120" fixed="right">
        <template slot-scope='scope'>
          <span class="active-text mr-5" @click='handledit({ id: scope.row.propagandaId, status: scope.row.propagandaStatus })' v-if="scope.row.propagandaStatus === '1'" title="启用">禁用</span>
          <span class="active-text mr-5" title="禁用" @click='handledit({ id: scope.row.propagandaId, status: scope.row.propagandaStatus })' v-if="scope.row.propagandaStatus === '0'">启用</span>
          <span class="active-text mr-5" title="编辑" @click="rescive(scope.row, 'revise')">编辑</span>
          <span class="danger-text mr-5" title="删除" @click="del(scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    </div>
  </div>
    <div class="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogAdd" width="820px" top="15vh" style="overflow: hidden">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">渠道</div>
              <div class="fl ipt-medium">
                <el-select v-model='msg.propagandaChannel' multiple placeholder='全部' size='medium' collapse-tags>
                  <el-option value="" label="全部"></el-option>
                  <el-option
                    v-for='item in channelList'
                    :key='item.chalId'
                    :label='item.chalName'
                    :value='item.chalCode'>
                  </el-option>
                </el-select>
                <div class="warning-info" v-if="flag && msg.propagandaChannel.length === 0">渠道不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">航段</div>
              <div class="fl ipt-medium">
                <div class="search-item search-ipt fl">
                  <el-input size="medium" clearable placeholder="航段1" v-model="msg.depAirport" title="航段1" style="width: 90px"></el-input>
                  <span class="lines">—</span>
                  <el-input size="medium" clearable placeholder="航段2" v-model="msg.arrAirport" title="航段2" style="width: 90px"></el-input>
                  <div class="warning-info" v-if="flag && !msg.depAirport && !msg.arrAirport">航段不可为空</div>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="label">航班号</div>
              <div class="fl ipt-medium">
                <div class="search-item search-ipt fl">
                  <el-input size="medium" clearable placeholder="航班号" v-model="msg.flightNo" title="航班号"></el-input>
                </div>
              </div>
            </div>
          </div>
          <!--第二排-->
          <div class="row">
            <div class="column">
              <div class="label">国际/国内</div>
              <div class="fl ipt-medium">
                <el-select v-model='msg.isinter' clearable placeholder='国际/国内' size='medium' title="国际/国内">
                  <el-option value="0" label="国内"></el-option>
                  <el-option value="1" label="国际"></el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label">适用舱位</div>
              <div class="fl ipt-medium">
                <div class="search-item search-ipt fl">
                  <div :class="msg.propagandaCabin.length > 9 ? 'scroll' : ''">
                    <el-select v-model='msg.propagandaCabin' clearable placeholder='适用舱位' collapse-tags multiple size='medium' title="适用舱位" @change="cabins">
                      <el-option value="all" label="全部"></el-option>
                      <el-option
                        v-for='item in cabin'
                        :key='item'
                        :label='item'
                        :value='item'>
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="label required">宣传标题</div>
              <div class="fl ipt-medium">
                <div class="search-item search-ipt fl">
                  <el-input size="medium" clearable placeholder="宣传标题" v-model="msg.propagandaTitle" title="航班号"></el-input>
                  <div class="warning-info" v-if="flag && !msg.propagandaTitle">宣传标题不可为空</div>
                </div>
              </div>
            </div>
          </div>
          <!--第三排-->
          <div class="row">
            <div class="column">
              <div class="label">启用/禁用</div>
              <div class="fl ipt-medium">
                <el-select v-model='msg.propagandaStatus' clearable placeholder='启用/禁用' size='medium'>
                  <el-option value="0" label="禁用"></el-option>
                  <el-option value="1" label="启用"></el-option>
                </el-select>
              </div>
            </div>
            <div class="column">
              <div class="label required">航班开始日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  value-format="yyyy-MM-dd"
                  placeholder="航班开始日期"
                  v-model="msg.startFdate">
                </el-date-picker>
                <div class="warning-info" v-if="flag && !msg.startFdate">航班开始日期不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">航班截止日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  type="date"
                  class="date-picker"
                  value-format="yyyy-MM-dd"
                  placeholder="航班截止日期"
                  v-model="msg.endFdate">
                </el-date-picker>
                <div class="warning-info" v-if="flag && !msg.endFdate">航班截止日期不可为空</div>
              </div>
            </div>
          </div>
          <!--第四排-->
          <div class="row">
            <div class="column">
              <div class="label required">宣传正文</div>
              <div class="fl ipt-medium">
                <div class="search-item search-ipt fl">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="宣传正文"
                    v-model="msg.propagandaContent">
                  </el-input>
                  <div class="warning-info" v-if="flag && !msg.propagandaContent">宣传正文不可为空</div>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="label">上传文件</div>
              <div class="fl ipt-medium">
                <div class="search-item search-ipt fl">
                  <input type="file" @change="changeImg($event)">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="medium" type="primary" @click="refer">提交</el-button>
          <el-button size="medium" v-if="ref === 'add'" @click="reset">重置</el-button>
          <el-button size="medium"  @click="dialogAdd = false">返回</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="图片预览" :visible.sync="dialogImg" width="780px">
      <div class="dialog-container">
        <img :src="currenPic" alt="" width="750" style="padding: 10px">
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getChannelList } from '../../../utils/index'
import { cabin } from './data'
import * as types from './api'
import Clipboard from 'clipboard'
import { computWidth } from '../../../mixins/computWidt'

export default {
  name: 'UpgradPropaganda',
  data () {
    return {
      dataViewHeight: null,
      params: {
        propagandaChannel: '', //  渠道
        depAirport: '', //  航段1
        arrAirport: '', //  航段2
        flightNo: '', //  航班号
        isinter: '', //  国际
        propagandaCabin: '', //  适用舱位
        propagandaStatus: '', //  启用禁用 1启用 0禁用 ‘’全部
        startFdate: '',
        endFdate: '',
        page: 1,
        rows: 20
      },
      cabin: cabin(),
      dataArr: [],
      priceList: [],
      total: null,
      flag: false,
      dialogTitle: '',
      dialogAdd: false,
      msg: {
        adPic: '',
        propagandaChannel: ['app'],
        depAirport: '',
        arrAirport: '',
        flightNo: '',
        isinter: '0',
        propagandaCabin: ['all'],
        propagandaTitle: '',
        propagandaContent: '',
        adPicFileName: '',
        startFdate: '',
        endFdate: '',
        path: '/images/upload/ad',
        propagandaStatus: '0'
      },
      ref: '',
      tFlag: true,
      loading: false,
      currenPic: '',
      dialogImg: false
    }
  },
  created () {
    this.judgeChannelList()
    this.params.rows = this.pagination.pageSize
    this.initData()
  },
  methods: {
    copy (param) {
      let clipboard = new Clipboard(`.${param}`)
      this.tFlag = false
      clipboard.on('success', e => {
        this.$message.success('复制成功：' + e.text)
        clipboard.destroy()
      })
    },
    previewImg (row) {
      this.dialogImg = true
      this.currenPic = row.propagandaFilepath
    },
    initList () {
      this.params.page = 1
      this.initData()
    },
    clickRow (row) {
      if (this.tFlag) this.$refs.refTable.toggleRowSelection(row)
      this.tFlag = true
    },
    cabins (val) {
    },
    refer () {
      let obj = Object.assign({}, this.msg)
      let data = new FormData()
      if (this.msg.propagandaCabin.indexOf('all') !== -1) {
        data.append('propagandaCabin', '')
      } else {
        for (let item of obj.propagandaCabin) {
          data.append('propagandaCabin', item)
        }
      }
      for (let item of obj.propagandaChannel) {
        data.append('propagandaChannel', item)
      }
      let state = obj.propagandaCabin.every((item) => {
        return item === ''
      })
      if (!state) {
        let list = obj.propagandaCabin.filter((item) => item !== '')
        obj.propagandaCabin = list
      }
      data.append('depAirport', obj.depAirport)
      data.append('arrAirport', obj.arrAirport)
      data.append('flightNo', obj.flightNo)
      data.append('isinter', obj.isinter)
      data.append('startFdate', obj.startFdate)
      data.append('endFdate', obj.endFdate)
      data.append('propagandaTitle', obj.propagandaTitle)
      data.append('propagandaContent', obj.propagandaContent)
      data.append('propagandaStatus', obj.propagandaStatus)
      data.append('adPic', obj.adPic || undefined)
      data.append('path', '/images/upload/ad')
      this.flag = true
      if (obj.propagandaContent === '' || obj.propagandaTitle === '' || this.msg.propagandaChannel.length === 0 || !this.msg.depAirport || !this.msg.arrAirport) {
        return false
      }
      if (this.msg.depAirport === '' || this.msg.arrAirport === '') {
        this.$message.error('请按规则填写航段')
        return false
      }
      if (this.ref !== 'add') {
        data.append('propagandaId', obj.propagandaId)
        data.append('adPicFileName', obj.adPicFileName || '')
        types.updateUpgradPropaganda(data).then(res => {
          this.dialogAdd = false
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.initData()
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        if (obj.adPic === '') {
          this.$message.error('请选择图片')
          return false
        }
        types.addUpgradPropaganda(data).then(res => {
          this.dialogAdd = false
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.initData()
        }).catch(err => {
          this.$message.error(err.message)
        })
      }
    },
    reset () {
      this.msg = {
        adPic: '',
        propagandaChannel: ['app'],
        depAirport: '',
        arrAirport: '',
        flightNo: '',
        isinter: '0',
        propagandaCabin: ['all'],
        propagandaTitle: '',
        propagandaContent: '',
        adPicFileName: '',
        startFdate: '',
        endFdate: '',
        path: '/images/upload/ad',
        propagandaStatus: '0'
      }
      this.flag = false
    },
    changeImg (e) {
      this.msg.adPic = e.target.files[0]
      this.msg.adPicFileName = e.target.files[0].name
      this.msg.path = '/images/upload/ad'
    },
    //  分页
    handleSizeChange (row) {
      this.params.rows = row
      this.initData()
    },
    handleCurrentChange (pages) {
      this.params.page = pages
      this.initData()
    },
    initData () {
      this.loading = true
      types.queryUpgradPropagandaList(this.params).then(res => {
        let priceList = res.rows.map((item) => {
          item['flag'] = false
          item['selName'] = 'sel' + item.propagandaId
          return item
        })
        this.priceList = priceList
        this.total = res.total
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    search () {
      this.params.page = 1
      this.initData()
    },
    //  数据初始化
    init () {
      this.params = {
        propagandaChannel: '', //  渠道
        depAirport: '', //  航段1
        arrAirport: '', //  航段2
        flightNo: '', //  航班号
        isinter: '', //  国际
        propagandaCabin: '', //  适用舱位
        propagandaStatus: '', //  启用禁用 1启用 0禁用 ‘’全部
        startFdate: '',
        endFdate: '',
        page: 1,
        rows: this.pagination.pageSize
      }
    },
    initrefer () {
      this.params.page = 1
      this.init()
      this.initData()
    },
    //  添加/修改
    rescive (param) {
      this.dialogAdd = true
      this.flag = false
      this.tFlag = false
      if (param && param !== null) {
        //  修改
        this.ref = ''
        this.dialogTitle = '修改'
        this.msg = Object.assign(this.msg, param)
        this.msg.propagandaId = param.propagandaId
        this.msg.propagandaFilepath = param.propagandaFilepath
        this.msg.propagandaChannel = param.propagandaChannel.split(',')
        if (!param.propagandaCabin) {
          this.msg.propagandaCabin = []
          return false
        }
        if (param.propagandaCabin.split(',').length === this.cabin.length) {
          this.msg.propagandaCabin = ['all']
        } else {
          this.msg.propagandaCabin = param.propagandaCabin.split(',')
        }
      } else {
        //  添加
        this.tFlag = true
        this.ref = 'add'
        this.dialogTitle = '添加'
        for (let item in this.msg) {
          this.msg[item] = ''
        }
        this.msg.propagandaCabin = ['all']
        this.msg.propagandaChannel = ['app']
        this.msg.propagandaStatus = '1'
        this.msg.isinter = '0'
      }
    },
    del (val) {
      //  获取选中数组里面的序号
      let ids = ''
      this.tFlag = false
      this.$confirm('是否确认删除 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        if (val && val !== null) {
          //  单个删除
          ids = val.propagandaId
        } else {
          //  批量删除
          let state = this.dataArr.map((item) => {
            return item.propagandaId
          })
          ids = state.join(',')
        }
        let obj = {
          ids
        }
        types.deleteUpgradPropaganda(obj).then((res) => {
          if (res.isSuccessOrfail === 'SUCCESS') {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            //  判断最后一页删除后数量不足重新计算当前的页数
            if (val !== null) {
              //  单个
              if (this.total % this.params.rows === 1 && this.total > 1 && this.params.page === Math.ceil(this.total / this.params.rows)) {
                this.params.page = this.params.page - 1
              }
            } else {
              //  批量
              if (this.dataArr.length >= this.priceList.length && this.params.page === Math.ceil(this.total / this.params.rows)) {
                this.params.page = this.params.page - 1
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
    handleSelectionChange (list) {
      this.dataArr = list
    },
    handledit (obj) {
      let msg = ''
      this.tFlag = false
      if (obj.status === '1') {
        obj.status = '0'
        msg = '是否确认禁用 ?'
      } else {
        obj.status = '1'
        msg = '是否确认启用 ?'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        types.updateStatus(obj).then(res => {
          this.$message({
            message: '修改成功',
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
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination,
      channelList: state => state.app.channelList
    })
  },
  mixins: [computWidth]
}
</script>
<style scoped lang="scss">
  .lines{
    font-weight: bold;
    display: inline-block;
    width: 30px;
    text-align: center;
  }
  .line{
    font-weight: bold;
    display: inline-block;
    width: 16px;
    text-align: center;
  }
  .upload-demo{
    width: 100px;
  }
  .scroll{
  height:80px;overflow-y: scroll
  }
  .imgUrl{
    position: relative;
  }
  .imgUrl i{
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
    font-size: 16px;
  }
  .copy-btn{
    color: #409EFF;
  }
</style>
