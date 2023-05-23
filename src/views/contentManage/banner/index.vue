<template>
  <!--<div>广告图片维护</div>-->
  <div class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="图片使用" clearable v-model="filter.type">
            <el-option label="启动页" value="1"></el-option>
            <el-option label="购票后" value="2"></el-option>
            <el-option label="轮播图" value="3"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select size="medium" placeholder="使用状态" clearable  v-model="filter.status">
            <el-option label="有效" value="1"></el-option>
            <el-option label="无效" value="0"></el-option>
          </el-select>
        </div>
        <div class="search-item search-ipt">
          <el-select v-model='filter.channel' clearable placeholder='渠道类型' size='medium'>
            <el-option
              v-for='item in channelList'
              :key='item.chalId'
              :label='item.chalName'
              :value='item.chalCode'>
            </el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getBannerList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="switchDialog()">添加</el-button>
        <el-button size="medium" type="danger" :disabled="!multipleSelection.length" @click="handleConfirm(2)">批量删除</el-button>
        <el-button size="medium" :disabled="!multipleSelection.length" @click="handleKeep">保存</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="banner.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          @selection-change="handleSelectionChange"
          :cell-style="tableAttributes.cellStyle">
<!--            <el-table-column label="序号" type="index" width="50"></el-table-column>-->
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="优惠信息" prop="disName" min-width="140"></el-table-column>
            <el-table-column label="广告图片" prop="picName" min-width="160"></el-table-column>
            <el-table-column label="图片预览" width="160">
              <template slot-scope="scope">
                <div class="imgUrl">
                  <img style="width: 100px;height: 50px;cursor: pointer;" :src="scope.row.picUrl" @click="switchPic(scope.row.picUrl)" alt="">
                  <i title="复制图片地址" type="primary" class="el-icon-document copy-btn" :data-clipboard-text="scope.row.picUrl" :class="scope.row.picNameCopy" @click="copy(scope.row.picNameCopy)"></i>
              </div>
              </template>
            </el-table-column>
            <el-table-column label="图片使用">
              <template slot-scope="scope">
                <span v-if="scope.row.picType === '1'">启动页</span>
                <span v-if="scope.row.picType === '2'">购票后</span>
                <span v-if="scope.row.picType === '3'">轮播图</span>
              </template>
            </el-table-column>
            <el-table-column label="排序" prop="picSort"></el-table-column>
            <el-table-column label="最近操作人" prop="operName" min-width="120"></el-table-column>
            <el-table-column label="最近操作人" prop="modifyDate" min-width="160"></el-table-column>
            <el-table-column label="渠道类型" min-width="140">
              <template slot-scope="scope">
                <span>{{scope.row.channel | channelMap}}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="picStatus">
              <template slot-scope="scope">
                <span class="active-text" v-if="scope.row.picStatus === '1'" @click="handleConfirm(1, scope.row)">有效</span>
                <span class="active-text" v-if="scope.row.picStatus === '0'" @click="handleConfirm(0, scope.row)">无效</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" min-width="120">
              <template slot-scope="scope">
                <span class="active-text mr-5" @click="switchDialog(scope.row)">编辑</span>
                <span class="danger-text mr-5" @click="handleConfirm(2, scope.row.picId)">删除</span>
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
          :total="banner.total">
         </el-pagination>
      </div>
    </div>
    <div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="800px">
        <div class="dialog-container">
          <div class="dialog-main">
            <div class="row">
              <div class="column">
                <div class="label" :class="{required: bannerInfo.picType!=='3'}">优惠信息</div>
                <div class="ipt-medium">
                  <el-select size="medium" placeholder="优惠信息" v-model="bannerInfo.tblId">
                    <el-option v-for="item in discountInformation" :key="item.id" :label="item.text" :value="item.id"></el-option>
                  </el-select>
                  <div class="danger-text" v-if="formErr && (!bannerInfo.tblId && bannerInfo.picType!=='3')">必填</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">图片使用</div>
                <div class="ipt-medium">
                  <el-select size="medium" placeholder="图片使用" v-model="bannerInfo.picType">
                    <el-option label="启动页" value="1"></el-option>
                    <el-option label="购票后" value="2"></el-option>
                    <el-option label="轮播图" value="3"></el-option>
                  </el-select>
                  <div class="danger-text" v-if="formErr && !bannerInfo.picType">必填</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">渠道编号</div>
                <div class="ipt-medium">
                  <el-select v-model='channel' clearable placeholder='渠道类型' multiple size='medium' title="必填项" collapse-tags>
                    <el-option
                      v-for='item in channelList'
                      :key='item.chalId'
                      :label='item.chalName'
                      :value='item.chalCode'>
                    </el-option>
                  </el-select>
                  <div class="warning-info" v-if="formErr && !channel.length">渠道编号不可为空</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column" v-if="!isCreate">
                <div class="label required">序号</div>
                <div class="ipt-medium">
                  <el-input v-model="bannerInfo.picSort" clearable placeholder="序号" size="medium"></el-input>
                  <div class="warning-info" v-if="formErr && !bannerInfo.picSort">序号不可为空</div>
                </div>
              </div>
              <div class="column">
                <label>
                  <div style="width: 100px;height: 60px;border: 1px solid #ccc;text-align: center;overflow: hidden">
                    <input style="display: none" type="file" accept="image/*" @change="changeImg($event)">
                    <img v-if="imgUrl" style="width: 100px;height: auto;" :src="imgUrl" alt="">
                    <i v-if="!imgUrl" style="font-size: 40px;color: #ccc" class="el-icon-upload"></i>
                  </div>
                </label>
                <div class="danger-text" v-if="formErr && !bannerInfo.adPicOne">图片必选</div>
              </div>
              <div class="column" v-if="bannerInfo.picType==='3'">
                <label>
                  <div style="width: 100px;height: 60px;border: 1px solid #ccc;text-align: center;overflow: hidden">
                    <input style="display: none" type="file" accept="image/*" @change="changeImgTwo($event)">
                    <img v-if="imgUrlTwo" style="width: 100px;height: auto;" :src="imgUrlTwo" alt="">
                    <i v-if="!imgUrlTwo" style="font-size: 40px;color: #ccc" class="el-icon-upload"></i>
                  </div>
                </label>
                <div class="danger-text" v-if="formErr && !bannerInfo.adPicTwo">图片必选</div>
              </div>
            </div>
          </div>
          <div class="dialog-footer">
            <el-button size="medium" type="primary" @click="judgeParam">提交</el-button>
            <el-button size="medium" v-if="isCreate" @click="handleReset">重置</el-button>
            <el-button size="medium" @click="dialogVisible = false;imgUrl='';imgUrlTwo='';handleReset()">返回</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="图片预览" :visible.sync="picVisible" width="780px">
        <div class="dialog-container">
          <img style="padding: 10px" width="750" :src="currentPic" alt="">
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { computeTableHeight, filterIds, getChannelList } from '../../../utils/index'
import { mapState } from 'vuex'
import { fetchList, changeAdPicStatus, querySystemInfoTree, addAdPic, updateAdPic, deleteAdPic, saveAdPicSort } from './api'
import Clipboard from 'clipboard'

export default {
  name: 'AdPicPre',
  data () {
    return {
      loading: false,
      filter: {
        status: '1',
        channel: ''
      },
      dataViewHeight: null,
      banner: {},
      currentItem: {}, // 当前选中的数据
      discountInformation: [],
      dialogVisible: false,
      dialogTitle: '',
      picVisible: false,
      currentPic: '',
      isCreate: false,
      formErr: false,
      multipleSelection: [], // 表格多选
      bannerInfo: {
        tblId: '',
        picType: '',
	      adPicOne: '',
	      adPicTwo: '',
	      adPicFileName: '',
	      picSort: ''
      },
      channel: [],
      imgUrl: '',
	    imgUrlTwo: ''
    }
  },
  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  },
  computed: {
    ...mapState({
      channelList: state => state.app.channelList,
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  created () {
    this.judgeChannelList()
    this.getBannerList(1, this.pagination.pageSize)
    this.getSystemInfoTree()
  },
  methods: {
    // state没有则请求服务器
    judgeChannelList () {
      if (!this.channelList.length) {
        getChannelList()
      }
    },
    // 复制列数据
    copy (param) {
      // console.log(param)
      let clipboard = new Clipboard(`.${param}`)
      clipboard.on('success', e => {
        this.$message.success('复制成功：' + e.text)
        clipboard.destroy()
      })
    },
    switchPic (url) {
      this.picVisible = true
      this.currentPic = url
    },
    // 获取列表数据
    getBannerList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter).then(res => {
        this.banner = res
        this.loading = false
        for (let i = 0; i < this.banner.rows.length; i++) {
          this.banner.rows[i].picNameCopy = 'pic' + this.banner.rows[i].picId
          for (let j = 0; j < this.discountInformation.length; j++) {
            if (this.banner.rows[i].tblId === this.discountInformation[j].id) {
              this.banner.rows[i].disName = this.discountInformation[j].text
              break
            }
          }
        }
      }).catch(err => {
        this.loading = false
        this.$message.error(err)
      })
    },
    // 重置
    resetFilter () {
      this.filter = {
        status: '1'
      }
      this.getBannerList(1, this.pagination.pageSize)
    },
    // 分页
    handleSizeChange (pages) {
      this.getBannerList(null, pages)
    },
    handleCurrentChange (page) {
      this.getBannerList(page, null)
    },
    handleConfirm (type, param) {
      let ids = param || filterIds(this.multipleSelection, 'picId').join(',')
      let title = ''
      this.currentItem = param
      if (type === 0) {
        // 无效
        title = '是否确认修改图片状态'
      } else if (type === 1) {
        // 有效
        title = '是否确认修改图片状态'
      } else if (type === 2) {
        // 删除
        title = '是否确认删除？'
      }
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        if (type === 0 || type === 1) {
          this.handleChangePicStatus(type)
        } else if (type === 2) {
          this.handleDeletePic(ids)
        }
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    // 修改有效状态
    handleChangePicStatus (type) {
      let data = {
        status: type === '0' ? 1 : 0,
        id: this.currentItem.picId
      }
      changeAdPicStatus(data).then(() => {
        this.$message.success('修改成功')
        this.getBannerList(1, this.pagination.pageSize)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 获取优惠信息数据
    getSystemInfoTree () {
      querySystemInfoTree({ typecode: '7601,7603', status: 1 }).then(res => {
        this.discountInformation = res.treeList
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 切换弹框
    switchDialog (param) {
      this.formErr = false
      this.dialogVisible = true
      if (param) {
        // 编辑
        this.imgUrl = param.picUrl
        this.imgUrlTwo = param.bigPicUrl
        this.currentItem = param
        this.isCreate = false
        this.dialogTitle = '修改'
        this.bannerInfo.tblId = param.tblId
        this.bannerInfo.picType = param.picType
        this.bannerInfo.picSort = param.picSort
        this.channel = param.channel ? param.channel.split(',') : []
      } else {
        // 新增
        this.dialogTitle = '添加'
        this.isCreate = true
        this.imgUrl = ''
        this.imgUrlTwo = ''
        this.handleReset()
      }
    },
    // 处理图片
    getObjectURL (file) {
      let url = null
      if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    },
    changeImg (e) {
      if (e.target.files.length) {
        this.bannerInfo.adPicOne = e.target.files[0]
        this.imgUrl = this.getObjectURL(e.target.files[0])
      }
    },
	  changeImgTwo (e) {
		  if (e.target.files.length) {
			  this.bannerInfo.adPicTwo = e.target.files[0]
			  this.imgUrlTwo = this.getObjectURL(e.target.files[0])
		  }
	  },
    // 参数判断
    judgeParam () {
      if ((this.bannerInfo.tblId || this.bannerInfo.picType === '3') && this.bannerInfo.picType && this.channel.length) {
      	if (!this.isCreate && !this.bannerInfo.picSort) {
      		this.formErr = true
          return false
        }
        this.bannerInfo.channel = this.channel.join(',')
        this.formErr = false
        if (this.isCreate) {
          this.handleAddAdPic()
        } else {
          this.handleEditPic()
        }
      } else {
        this.formErr = true
      }
    },
    // 弹出框重置
    handleReset () {
      this.bannerInfo = {
	      tblId: '',
	      picType: '',
	      adPicOne: '',
	      adPicTwo: '',
	      adPicFileName: '',
        picSort: ''
      }
      this.channel = []
      this.formErr = false
    },
    // 添加图片
    handleAddAdPic () {
      let data = new FormData()
      data.append('tblId', this.bannerInfo.tblId)
      data.append('picType', this.bannerInfo.picType)
      data.append('channel', this.bannerInfo.channel)
	    if (this.bannerInfo.adPicOne) {
		    data.append('adPic', this.bannerInfo.adPicOne)
	    }
	    if (this.bannerInfo.adPicTwo) {
		    data.append('adPic', this.bannerInfo.adPicTwo)
	    }
      data.append('path', '/images/upload/ad')
      addAdPic(data).then(() => {
        this.dialogVisible = false
        this.getBannerList(1, this.pagination.pageSize)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 编辑图片
    handleEditPic () {
      let data = new FormData()
      data.append('tblId', this.bannerInfo.tblId)
      data.append('picType', this.bannerInfo.picType)
      data.append('channel', this.bannerInfo.channel)
      if (this.bannerInfo.adPicOne) {
        data.append('adPic', this.bannerInfo.adPicOne)
      }
	    if (this.bannerInfo.adPicTwo) {
		    data.append('adPic', this.bannerInfo.adPicTwo)
	    }
      data.append('path', '/images/upload/ad')
      data.append('picId', this.currentItem.picId)
      data.append('picSort', this.bannerInfo.picSort)
	    updateAdPic(data).then(() => {
        this.dialogVisible = false
        if (this.bannerInfo.picType === '3') {
	        this.$message.info('官网轮播图上传成功后，由于CDN缓存的问题，请延迟10分钟查看')
        }
        this.getBannerList(1, this.pagination.pageSize)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 表格批量选择
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 保存
    handleKeep () {
      let data = {
        ids: filterIds(this.multipleSelection, 'picId').join(','),
        sorts: filterIds(this.multipleSelection, 'picSort').join(',')
      }
      this.$confirm('是否确认修改图片排序?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        saveAdPicSort(data).then(res => {
          this.$message.success(res.message)
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    // 删除
    handleDeletePic (id) {
      // console.log(id)
      deleteAdPic({ ids: id }).then(() => {
        this.$message.success('操作成功')
        this.getBannerList(1, this.pagination.pageSize)
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .imgUrl{
    position: relative;
  }
  .imgUrl i{
    position: absolute;
    right: 0;
    top: 0;
  }
  .copy-btn{
    color: #409EFF;
    cursor: pointer;
    font-size: 16px;
  }
</style>
