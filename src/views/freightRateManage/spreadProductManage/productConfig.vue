<template>
  <div>
    <div v-show="isConfig">
      <div v-if="isAdd" class="btn-container clearfix">
        <el-button size="medium" @click="addConfig()">关联配置</el-button>
      </div>
      <div v-if="isAdd" class="table-container">
        <div class="product-item" v-for="(item, index) in addConfigList" :key="index">
          <div class="item-title">
            新增配置{{ index + 1 }}
            <i class="table-icon delete-icon" title="删除" @click="delConfig(index)"></i>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">配置类型</div>
              <div class="ipt-medium">
                <el-select v-model="item.configType" placeholder="请选择规则类型" size="medium" collapse-tags @change="emitPassengerType">
                  <el-option key="0" label="航线" value="route"></el-option>
                  <el-option key="1" label="航班号" value="fnumber"></el-option>
                  <el-option key="2" label="舱位" value="cabin"></el-option>
                  <el-option key="3" label="排除航班号" value="ex_fnumber"></el-option>
                  <el-option key="4" label="排除舱位" value="ex_cabin"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !item.configType">配置类型不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">配置内容</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="配置内容" clearable v-model="item.configContent" @input="emitPassengerType"></el-input>
                <div class="warning-info" v-if="isEmpty && !item.configContent">配置内容不可为空</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!isAdd" class="table-container">
        <el-table
          key="Math.random()"
          :cell-style= "tableAttributes.cellStyle"
          :header-cell-class-name="handleCellStyle"
          :cell-class-name="handleCellStyle"
          :stripe="tableAttributes.stripe"
          :border="tableAttributes.border"
          :data="configList"
          v-loading="loading"
          :height="dataViewHeight"
          style="font-size: 10px"
          row-key="lowestpriceid"
          @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" width="40"></el-table-column>
          <el-table-column align="center" label="主键ID" prop="id" min-width="32"></el-table-column>
          <el-table-column align="center" label="配置类型" prop="configType" min-width="48"></el-table-column>
          <el-table-column align="center" label="配置内容" prop="configContent" min-width="48"></el-table-column>
        </el-table>
      </div>
    </div>
    <div v-show="!isConfig">
      <div v-if="isAdd" class="btn-container clearfix">
        <el-button size="medium" @click="addConfig()">关联配置</el-button>
        <el-button size="medium" @click="addConfig()">关联产品</el-button>
      </div>
      <div v-if="isAdd">
        <div v-for="(item, index) in addConfigList" :key="index" class="product-item">
          <div class="item-title">
            新增产品{{ index + 1 }}
            <i class="table-icon delete-icon" title="删除" @click="delConfig(index)"></i>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">产品名称</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="产品名称" clearable v-model="item.productName"></el-input>
                <div class="warning-info" v-if="isEmpty && !item.productName">产品名称不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label">产品编号</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="产品编号" clearable v-model="item.productCode"></el-input>
                <div class="warning-info" v-if="isEmpty && !item.productCode">产品编号不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">商品价格</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="商品价格" clearable v-model="item.productPrice"></el-input>
                <div class="warning-info" v-if="isEmpty && !item.productPrice">商品价格不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">总库存</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="总库存" clearable v-model="item.totalNum"></el-input>
                <div class="warning-info" v-if="isEmpty && !item.totalNum">总库存不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">剩余库存</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="剩余库存" clearable v-model="item.repertory"></el-input>
                <div class="warning-info" v-if="isEmpty && !item.repertory">剩余库存不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">销售价格</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="销售价格" clearable v-model="item.salePrice"></el-input>
                <div class="warning-info" v-if="isEmpty && !item.salePrice">销售价格不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">生效日期</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="yyyyMMdd,例: 20181028" clearable v-model="item.effectiveDate"></el-input>
                <div class="warning-info" v-if="isEmpty && !item.effectiveDate">生效日期不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">失效日期</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="yyyyMMdd,例: 20181028" clearable v-model="item.expireDate"></el-input>
                <div class="warning-info" v-if="isEmpty && !item.expireDate">失效日期不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">状态</div>
              <div class="ipt-medium">
                <el-select v-model="item.status" placeholder="请选择产品状态" size="medium" collapse-tags>
                  <el-option key="1" label="启用" value="1"></el-option>
                  <el-option key="0" label="禁用" value="0"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !item.status">状态不可为空</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">产品类型</div>
              <div class="ipt-medium">
                <el-select v-model="item.productType" placeholder="请选择产品类型" size="medium" collapse-tags>
                  <el-option key="1" label="实体" value="实体"></el-option>
                  <el-option key="0" label="非实体" value="非实体"></el-option>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !item.productType">产品类型不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">产品备注</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="产品备注" clearable v-model="item.productRemark"></el-input>
                <div class="warning-info" v-if="isEmpty && !item.productRemark">产品备注不可为空</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!isAdd" class="table-container">
        <el-table
          key="Math.random()"
          :cell-style= "tableAttributes.cellStyle"
          :header-cell-class-name="handleCellStyle"
          :cell-class-name="handleCellStyle"
          :stripe="tableAttributes.stripe"
          :border="tableAttributes.border"
          :data="configList"
          v-loading="loading"
          :height="dataViewHeight"
          style="font-size: 10px"
          row-key="lowestpriceid"
          @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" width="40"></el-table-column>
          <el-table-column align="center" label="主键ID" prop="id" min-width="32"></el-table-column>
          <el-table-column align="center" label="产品名称" prop="productName" min-width="48"></el-table-column>
          <el-table-column align="center" label="产品编号" prop="productCode" min-width="48"></el-table-column>
          <el-table-column align="center" label="商品价格" prop="productPrice" min-width="48"></el-table-column>
          <el-table-column align="center" label="总库存" prop="totalNum" min-width="48"></el-table-column>
          <el-table-column align="center" label="剩余库存" prop="repertory" min-width="48"></el-table-column>
          <el-table-column align="center" label="生效日期" prop="effectiveDate" min-width="48"></el-table-column>
          <el-table-column align="center" label="失效日期" prop="expireDate" min-width="48"></el-table-column>
          <el-table-column align="center" label="销售价格" prop="salePrice" min-width="48"></el-table-column>
          <el-table-column align="center" label="状态" prop="status" min-width="48"></el-table-column>
          <el-table-column align="center" label="产品类型" prop="productType" min-width="48"></el-table-column>
          <el-table-column align="center" label="产品备注" prop="productRemark" min-width="48"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ProductConfig',
  props: {
    configList: {
      type: Array,
      required: true
    },
    isEmpty: {
      type: Boolean,
      default: false
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    isConfig: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      permissionOld: [],
      permissionList: this.permission,
      isIndeterminate: false,
      permissionListCheck: false,
      dataViewHeight: null,
      multipleSelection: [], // 表格多选
      loading: false,
      addConfigList: []
    }
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes
    })
  },
  inject: [
    'selConfigs'
  ],
  created () {
  },
  methods: {
    handleCellStyle () {
      return 'table-th'
    },
    // 表单选择项
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.emitPassengerType()
    },
    // 新增一条配置-输入框
    addConfig () {
      let config = {
        airline: 'NS',
        configType: '',
        configContent: ''
      }
      this.addConfigList.push(config)
      this.emitPassengerType()
    },
    // 已选配置--传给主页面
    emitPassengerType () {
      this.selConfigs(this.multipleSelection, this.addConfigList, this.isAdd)
    },
    // 删除新增配置/产品
    delConfig (index) {
      this.addConfigList.splice(index, 1)
      this.emitPassengerType()
    }
  }
}
</script>

<style scoped lang="scss">
  .container {
    box-sizing: border-box;
    margin: 0 15px;
  }
  .product-item {
    border: 1px solid #eee;
    margin-bottom: 15px;
  }
  .item-title {
    background: #f3f3f3;
    height: 38px;
    padding: 0 15px;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
