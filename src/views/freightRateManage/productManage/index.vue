<template>
  <div id="productManage" class="container">
    <div class="btn-container">
      <el-button size="medium" @click="handleEdit(null)">添加</el-button>
    </div>
    <div class="main">
      <el-table
        key="Math.random()"
        :cell-style= "tableAttributes.cellStyle"
        :stripe="tableAttributes.stripe"
        :border="tableAttributes.border"
        :data="productList"
        v-loading="loading"
        :height="dataViewHeight"
        row-key="lowestpriceid"
        @selection-change="handleSelectionChange">
        <el-table-column align="center" label="产品名称" prop="productName" min-width="48"></el-table-column>
        <el-table-column align="center" label="产品编号" prop="productCode" min-width="48"></el-table-column>
        <el-table-column align="center" label="产品类型" prop="productType" min-width="48">
          <template slot-scope="scope">
            <div v-if="scope.row.productType === '1'">实物</div>
            <div v-else-if="scope.row.productType === '2'">优惠券</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品价格" prop="productPrice" min-width="48"></el-table-column>
        <el-table-column align="center" label="销售价格" prop="salePrice" min-width="48"></el-table-column>
        <el-table-column align="center" label="总库存" prop="totalNum" min-width="48"></el-table-column>
        <el-table-column align="center" label="总库存剩余量" min-width="48">
          <template slot-scope="scope">
            <div>{{ scope.row.totalNum - scope.row.saleNum }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="销售生效日期" prop="startTime" min-width="48"></el-table-column>
        <el-table-column align="center" label="销售失效日期" prop="endTime" min-width="48"></el-table-column>
        <el-table-column align="center" label="发票" prop="invoice" min-width="48"></el-table-column>
        <el-table-column align="center" label="材质" prop="productMake" min-width="48"></el-table-column>
        <el-table-column align="center" label="规格" prop="productSize" min-width="48"></el-table-column>
        <el-table-column align="center" label="退改规则" prop="changeRule" min-width="90">
          <template slot-scope="scope">
            <div>
              <el-popover
                placement="top-start"
                title="退改规则"
                width="200"
                trigger="hover"
                :content="scope.row.changeRule">
                <el-button size="mini" slot="reference">退改规则</el-button>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" prop="status" min-width="48">
          <template slot-scope="scope">
            <div v-if="scope.row.productFlag === '0'">禁用</div>
            <div v-if="scope.row.productFlag === '1'">启用</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="产品备注" prop="productRemark" min-width="48"></el-table-column>
        <el-table-column v-if="!isBind" align="center" label="操作" min-width="80">
          <template slot-scope="scope">
            <span class="active-text mr-5" title="编辑" @click="handleEdit(scope.row)">编辑</span>
            <span class="danger-text mr-5" title="删除" @click="handleDelete(scope.row)">删除</span>
            <span class="active-text mr-5" @click="switchImg(scope.row)">图片维护</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="isBind" class="btn-container">
      <el-button size="medium" @click="saveBind">确定</el-button>
      <el-button size="medium" @click="resetChecked">清空</el-button>
    </div>
    <el-dialog v-dialogDrag :title="visibleTitle" :visible.sync="editVisible" width="820px" append-to-body>
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label">产品名称</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="产品名称" clearable v-model="editForm.productName"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.productName">产品名称不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">产品类型</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.productType" placeholder="请选择产品类型" size="medium" collapse-tags>
                  <el-option key="1" label="实物" value="1"></el-option>
                  <el-option key="0" label="优惠券" value="2"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.productType">产品类型不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">产品备注</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="产品备注" clearable v-model="editForm.productRemark"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.productRemark">产品备注不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">状态</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.productFlag" placeholder="请选择产品状态" size="medium" collapse-tags>
                  <el-option key="1" label="启用" value="1"></el-option>
                  <el-option key="0" label="禁用" value="0"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.productFlag">商品状态不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">商品价格</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="商品价格" clearable v-model="editForm.productPrice"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.productPrice">商品价格不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">销售价格</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="销售价格" clearable v-model="editForm.salePrice"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.salePrice">销售价格不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">
                总库存
                <i class="el-icon-question" title="不填即不限量"/>
              </div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="总库存" clearable v-model="editForm.totalNum"></el-input>
                <div class="warning-info" v-if="isEmpty && !editForm.totalNum">总库存不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">销售生效日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  v-model="editForm.startTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  size="medium"
                  type="datetime"
                  placeholder="选择生效日期">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.startTime">销售生效日期不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">销售失效日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  v-model="editForm.endTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间">
                </el-date-picker>
                <div class="warning-info" v-if="isEmpty && !editForm.endTime">销售失效日期不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">
                规格
              </div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="总库存" clearable v-model="editForm.productSize"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">材质</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="总库存" clearable v-model="editForm.productMake"></el-input>
              </div>
            </div>
            <div class="column">
              <div class="label">发票</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="总库存" clearable v-model="editForm.invoice"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">
                退改规则
              </div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="总库存" clearable v-model="editForm.changeRule"></el-input>
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
    <!-- 上传图片-->
    <div>
      <el-dialog :visible.sync="imgVisible" title="图片维护" width="860px">
        <div class="dialog-container" v-loading="imgLoading">
          <div class="dialog-main">
            <div class="label">上传图片</div>
            <label>
              <div style="width: 160px;height: 160px;border: 1px solid #ccc;text-align: center">
                <input style="display: none" type="file" @change="changeImg($event)">
                <img v-if="imgUrl" style="width: 160px;height: 160px;" :src="imgUrl" alt="">
                <i v-if="!imgUrl" style="font-size: 40px;color: #ccc" class="el-icon-upload"></i>
              </div>
            </label>
            <el-button style="margin-left: 50px;margin-top: 20px" type="primary" size="mini" @click="updatePic">提交</el-button>
          </div>
          <div class="dialog-main">
            <div class="label">删除图片</div>
            <div class="img-box">
              <div v-for="(item, index) in imgList" :key="index" class="item">
                <div class="del-btn" @click="deletePic(item.picId, index)">×</div>
                <img :src="item.picUrl" alt="">
              </div>
            </div>
          </div>
          <div class="dialog-footer">
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { addProducts, queryAllProducts, deleteProducts, updateProduct, uploadPic, fetchAndDeletePic } from './api'
export default {
  name: 'productManage',
  props: {
    isBind: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currentRow: {},
      imgFile: null,
      imgVisible: false,
      imgUrl: null,
      imgLoading: false,
      multipleSelection: [],
      productList: [],
      loading: false,
      dataViewHeight: null,
      visibleTitle: '',
      isCreate: false, // 是否新增
      editVisible: false, // 新增弹窗 -- 显示/隐藏
      editForm: {}, // 新增弹窗 -- form数据
      isEmpty: false, // 新增弹窗 -- 输入框判定
      imgList: [{}, {}, {}, {}]
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes
    })
  },
  created () {
    this.queryList()
  },
  methods: {
    handleCellStyle () {
      return 'table-th'
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取所有配置
    queryList () {
      queryAllProducts().then(res => {
        this.productList = res.data
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 新增弹出框 -- 显示
    handleEdit (param) {
      this.editVisible = true
      this.isEmpty = false
      this.resetEdit()
      if (param) {
        // 编辑
        this.editForm = JSON.parse(JSON.stringify(param))
        this.isCreate = false
        this.visibleTitle = '编辑'
      } else {
        // 新增
        this.isCreate = true
        this.visibleTitle = '新增'
        this.editForm = {
          status: '1',
          productType: '实体'
        }
      }
    },
    // 新增弹出框 -- 表单提交
    saveEdit () {
      if (
        this.editForm.productName && this.editForm.productPrice &&
        this.editForm.totalNum && this.editForm.endTime &&
        this.editForm.startTime && this.editForm.salePrice &&
        this.editForm.productFlag && this.editForm.productType &&
        this.editForm.productRemark
      ) {
        this.isEmpty = false
        this.editForm.repertory = this.editForm.totalNum
        // console.log(this.editForm)
        let param = JSON.parse(JSON.stringify(this.editForm))
        if (!this.isCreate) {
          this.updateProduct(param)
        } else {
          this.addProduct(param)
        }
      } else {
        this.isEmpty = true
      }
    },
    addProduct (param) {
      let data = {
        arr: [param],
        isJson: true
      }
      addProducts(data).then(res => {
        this.editVisible = false
        this.queryList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    updateProduct (param) {
      let data = {
        arr: param,
        isJson: true
      }
      updateProduct(data).then(res => {
        this.editVisible = false
        this.queryList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 重置数据
    resetEdit () {
      this.editForm = {}
    },
    saveBind () {
      this.$emit('getBindData', this.multipleSelection)
    },
    resetChecked () {
      this.multipleSelection = []
    },
    // 删除
    handleDelete (data) {
      let datas = [data] || this.multipleSelection
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        // 删除
        this.getDeleteData(datas)
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    // 删除
    getDeleteData (data) {
      let param = {
        arr: data,
        isJson: true
      }
      deleteProducts(param).then(() => {
        this.$message.success('操作成功')
        this.queryList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    switchImg (row) {
      this.currentRow = row
      this.imgVisible = true
      this.queryPics()
    },
    // 查询已绑定的图片
    queryPics (ids = []) {
      let data = {
        isJson: true,
        arr: { productId: this.currentRow.productId, picIds: ids }
      }
      fetchAndDeletePic(data)
        .then(res => {
          if (!ids.length) {
            this.imgList = res.data
          }
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    // 选择图片
    changeImg (e) {
      this.imgFile = e.target.files[0]
      this.imgUrl = this.getObjectURL(e.target.files[0])
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
    // 上传图片
    updatePic () {
      if (!this.imgFile) {
        this.$message.warning('请选择图片')
        return false
      }
      let data = new FormData()
      data.append('pic', this.imgFile)
      data.append('productId', this.currentRow.productId)
      this.imgLoading = true
      uploadPic(data)
        .then(res => {
          this.imgLoading = false
          this.imgVisible = false
          this.$message({
            type: 'success',
            message: '提交成功'
          })
        })
        .then(err => {
          this.$message.error(err.message)
          this.imgLoading = false
        })
    },
    // 删除图片
    deletePic (id, index) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.imgLoading = true
          return this.queryPics([id])
        })
        .then(() => {
          this.imgList.splice(index, 1)
          this.imgLoading = false
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
        .catch((err = { message: '操作取消' }) => {
          this.imgLoading = false
          if (err.message) {
            this.$message({
              type: 'error',
              message: err.message
            })
          }
        })
    }
  }
}
</script>

<style scoped lang="scss">
.img-wrapper {
  height: 150px;
  width: 100%;
  .img {
    width: 100px;
    height: 100px;
  }
}
  .dialog-main {
    border-bottom: 1px solid #ccc;
    .label {
      font-size: 16px;
      font-weight: bold;
      padding-bottom: 10px;
    }
    &:last-child {
      border-bottom: none;
    }
    .img-box {
      display: flex;
      flex-wrap: wrap;
      .item {
        position: relative;
        width: 150px;
        height: 150px;
        margin-right: 30px;
        border: 1px solid #ccc;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .del-btn {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 16px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        border-radius: 10px;
        border: 1px solid #ccc;
        font-weight: bold;
        color: #c80023;
        background-color: #fafafa;
        cursor: pointer;
        &:hover {
          background-color: #c80023;
          color: #fff;
          border: 1px solid #c80023;
        }
      }
    }
  }
</style>
