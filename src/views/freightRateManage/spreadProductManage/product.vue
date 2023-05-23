<template>
  <div class="wrapper" v-loading="loading">
    <el-table
      :data="allProduct"
      ref="multipleTable"
      :border="tableAttributes.border"
      :stripe="tableAttributes.stripe"
      :cell-style= "tableAttributes.cellStyle"
      :header-cell-class-name="handleCellStyle"
      :cell-class-name="handleCellStyle"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column align="center" label="产品名称" prop="productName" min-width="48"></el-table-column>
      <el-table-column align="center" label="产品编号" prop="productCode" min-width="48"></el-table-column>
      <el-table-column align="center" label="产品类型" prop="productType" min-width="48"></el-table-column>
      <el-table-column align="center" label="商品价格" prop="productPrice" min-width="48"></el-table-column>
      <el-table-column align="center" label="销售价格" prop="salePrice" min-width="48"></el-table-column>
      <el-table-column align="center" label="总库存" prop="totalNum" min-width="48"></el-table-column>
      <!--        <el-table-column align="center" label="剩余库存" prop="repertory" min-width="48"></el-table-column>-->
      <el-table-column align="center" label="销售生效日期" prop="startTime" min-width="48"></el-table-column>
      <el-table-column align="center" label="销售失效日期" prop="endTime" min-width="48"></el-table-column>
    </el-table>
    <div class="footer">
      <el-button type="primary" size="medium" @click="collectData">提交</el-button>
    </div>
  </div>
</template>

<script>
import { queryAllProducts } from '../productManage/api'
import { fetchProduct, updateProduct } from './api'
import { mapState } from 'vuex'
export default {
  name: 'product',
  props: {
    ruleId: {
      type: String
    },
    visible: {
      type: Boolean
    }
  },
  data () {
    return {
      loading: false,
      allProduct: [],
      curProduct: [],
      curproductMap: [],
      multipleSelection: []
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes
    })
  },
  created () {
    this.queryAllProductList()
  },
  methods: {
    handleCellStyle () {
      return 'table-th'
    },
    // 查询全部商品
    queryAllProductList () {
      queryAllProducts()
        .then(res => {
          this.allProduct = res.data
          this.queryProduct()
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    // 查询规则已配置商品
    queryProduct () {
      fetchProduct(this.ruleId)
        .then(res => {
          this.curProduct = res.data
          this.filterProduct()
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    // 筛选已选中商品
    filterProduct () {
      let arr = []
      this.allProduct.forEach(item => {
        this.curProduct.forEach(val => {
          if (item.productId === val.productId) {
            arr.push(item)
          }
        })
      })
      this.curproductMap = arr
      this.toggleSelection()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    toggleSelection () {
      this.curproductMap.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row)
      })
    },
    collectData () {
      let arr = []
      this.multipleSelection.forEach(item => {
        arr.push({
          productId: item.productId
        })
      })
      this.updateProduct(arr)
    },
    updateProduct (arr) {
      this.loading = true
      let data = {
        isJson: true,
        arr: {
          ruleId: this.ruleId,
          products: arr
        }
      }
      updateProduct(data)
        .then(() => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.loading = false
          this.$emit('update:visible', false)
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  padding: 20px;
  .footer {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
