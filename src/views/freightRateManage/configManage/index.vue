<template>
  <div id="ConfigManage" class="container">
    <div class="btn-container">
      <el-button size="medium" @click="handleEdit">添加</el-button>
    </div>
    <div class="main">
      <el-tree
        :data="configList"
        show-checkbox
        node-key="id"
        ref="tree"
        :default-expanded-keys="defaultExpand"
        :default-checked-keys="defaultChecked"
      >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span class="item-label">{{ node.label }}</span>
        <span>
          <el-button
            v-if="data.children"
            type="text"
            size="mini"
            @click="() => handleEdit(data)">
            添加
          </el-button>
          <el-button
            v-if="!data.children && !isBind"
            type="text"
            size="mini"
            @click="() => handleEdit(data, node)">
            修改
          </el-button>
          <el-button
            v-if="!data.children && !isBind"
            type="text"
            size="mini"
            @click="() => handleDelete(data)">
            删除
          </el-button>
        </span>
      </span>
      </el-tree>
    </div>
    <div v-if="isBind" class="btn-container">
      <el-button size="medium" @click="saveBind">确定</el-button>
      <el-button size="medium" @click="resetChecked">清空</el-button>
    </div>
    <el-dialog v-dialogDrag title="新增配置" :visible.sync="editVisible" width="820px" append-to-body>
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">配置类型</div>
              <div class="ipt-medium">
                <el-select v-model="editForm.configType" placeholder="请选择配置类型" size="medium" collapse-tags>
                  <el-option key="0" label="航线" value="route"/>
                  <el-option key="1" label="排除航线" value="ex_route"/>
                  <el-option key="2" label="航班号" value="fnumber"/>
                  <el-option key="3" label="排除航班号" value="ex_fnumber"/>
                  <el-option key="4" label="排除航班日期" value="ex_flightDate"/>
                  <el-option key="5" label="排除有效期" value="ex_saleTime"/>
                  <el-option key="6" label="航班起飞前分钟" value="flight_before"/>
                </el-select>
                <div class="warning-info" v-if="isEmpty && !editForm.configType">配置类型不可为空</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">配置内容</div>
              <div class="ipt-medium">
                <el-input size="medium" placeholder="配置内容" clearable v-model="editForm.configContent"/>
                <div class="warning-info" v-if="isEmpty && !editForm.configContent">配置内容不可为空</div>
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
  </div>
</template>

<script>
import { addConfigs, queryAllConfigs, updateConfig, deleteConfigs } from './api'

export default {
  name: 'ConfigManage',
  props: {
    isBind: {
      type: Boolean,
      default: false
    },
    bindType: {
      type: String,
      default: ''
    },
    checkedList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      configList: [], // 配置list
      editVisible: false, // 新增弹窗 -- 显示/隐藏
      editForm: {}, // 新增弹窗 -- form数据
      isEmpty: false, // 新增弹窗 -- 输入框判定
      defaultExpand: [], // 默认展开节点的key数组
      defaultChecked: [1], // 默认选中节点的key数组
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    bindType (val) {
      if (this.isBind) {
        this.queryList()
      }
    }
  },
  created () {
    this.queryList()
  },
  methods: {
    // 获取所有配置
    queryList () {
      this.configList = []
      // this.defaultChecked = [1]
      queryAllConfigs().then(res => {
        if (res && res.data && res.data.length) {
          let configs = [
            {
              id: 'route',
              label: '航线',
              value: 'route',
              children: [],
              open: false,
              sel: false
            },
            {
              id: 'ex_route',
              label: '排除航线',
              value: 'ex_route',
              children: [],
              open: false,
              sel: false
            },
            {
              id: 'fnumber',
              label: '航班号',
              value: 'fnumber',
              children: [],
              open: false,
              sel: false
            },
            {
              id: 'ex_fnumber',
              label: '排除航班号',
              value: 'ex_fnumber',
              children: [],
              open: false,
              sel: false
            },
            {
              id: 'ex_flightDate',
              label: '排除航班日期',
              value: 'ex_flightDate',
              children: [],
              open: false,
              sel: false
            },
            {
              id: 'ex_saleTime',
              label: '排除有效期',
              value: 'ex_saleTime',
              children: [],
              open: false,
              sel: false
            },
            {
              id: 'flight_before',
              label: '航班起飞前分钟',
              value: 'flight_before',
              children: [],
              open: false,
              sel: false
            }
          ]
          if (this.bindType && this.bindType !== '') {
            for (let j = 0; j < configs.length; j++) {
              if (configs[j].value === this.bindType) {
                this.configList.push(configs[j])
              }
            }
          } else {
            // console.log(configs)
            this.configList = configs
          }
          for (let i = 0; i < res.data.length; i++) {
            let item = {}
            if (this.bindType && this.bindType !== '') {
              if (res.data[i].configType === this.bindType) {
                item = {
                  id: res.data[i].id,
                  label: res.data[i].configContent,
                  value: res.data[i].configContent,
                  configId: res.data[i].id,
                  parent: this.bindType,
                  isSel: false
                }
                this.configList[0].children.push(item)
                this.defaultExpand = [this.bindType]
                // this.defaultChecked = [0]
              }
            } else {
              switch (res.data[i].configType) {
                case 'route':
                  item = {
                    id: res.data[i].configId,
                    label: res.data[i].configContent,
                    value: res.data[i].configContent,
                    configId: res.data[i].configId,
                    parent: 'route',
                    isSel: false
                  }
                  this.configList[0].children.push(item)
                  break
                case 'ex_route':
                  item = {
                    id: res.data[i].configId,
                    label: res.data[i].configContent,
                    value: res.data[i].configContent,
                    configId: res.data[i].configId,
                    parent: 'ex_route',
                    isSel: false
                  }
                  this.configList[1].children.push(item)
                  break
                case 'fnumber':
                  item = {
                    id: res.data[i].configId,
                    label: res.data[i].configContent,
                    value: res.data[i].configContent,
                    configId: res.data[i].configId,
                    parent: 'fnumber',
                    isSel: false
                  }
                  this.configList[2].children.push(item)
                  break
                case 'ex_fnumber':
                  item = {
                    id: res.data[i].configId,
                    label: res.data[i].configContent,
                    value: res.data[i].configContent,
                    configId: res.data[i].configId,
                    parent: 'ex_fnumber',
                    isSel: false
                  }
                  this.configList[3].children.push(item)
                  break
                case 'ex_flightDate':
                  item = {
                    id: res.data[i].configId,
                    label: res.data[i].configContent,
                    value: res.data[i].configContent,
                    configId: res.data[i].configId,
                    parent: 'ex_flightDate',
                    isSel: false
                  }
                  this.configList[4].children.push(item)
                  break
                case 'ex_saleTime':
                  item = {
                    id: res.data[i].configId,
                    label: res.data[i].configContent,
                    value: res.data[i].configContent,
                    configId: res.data[i].configId,
                    parent: 'ex_saleTime',
                    isSel: false
                  }
                  this.configList[5].children.push(item)
                  break
                case 'flight_before':
                  item = {
                    id: res.data[i].configId,
                    label: res.data[i].configContent,
                    value: res.data[i].configContent,
                    configId: res.data[i].configId,
                    parent: 'flight_before',
                    isSel: false
                  }
                  this.configList[6].children.push(item)
                  break
              }
            }
          }
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 新增弹出框 -- 显示
    handleEdit (data, node) {
      // console.log(data, node)
      this.editVisible = true
      this.resetEdit()
      if (node) {
        this.editForm = {
          configId: data.configId,
          configType: node.parent.data.value,
          configContent: data.value
        }
      } else {
        this.editForm.configType = data.value
      }
    },
    // 新增弹出框 -- 表单提交
    saveEdit () {
      if (this.editForm.configType && this.editForm.configContent) {
        this.isEmpty = false
        let param = JSON.parse(JSON.stringify(this.editForm))
        if (param.configId) {
          param.id = param.configId
          param.airline = 'NS'
          this.updateConfig(param)
        } else {
          this.addConfigs(param)
        }
      } else {
        this.isEmpty = true
      }
    },
    // 新增配置 -- 接口
    addConfigs (param) {
      let data = {
        arr: param,
        isJson: true
      }
      addConfigs(data).then(res => {
        this.editVisible = false
        this.queryList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 修改配置 -- 接口
    updateConfig (param) {
      let data = {
        arr: param,
        isJson: true
      }
      updateConfig(data).then(res => {
        this.editVisible = false
        this.queryList()
        this.$message.success('操作成功')
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 删除
    handleDelete (data) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        // 删除
        this.getDeleteData(data)
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    // 删除
    getDeleteData (data) {
      // console.log(data)
      let param = {
        arr: [{
          configId: data.configId
        }],
        isJson: true
      }
      deleteConfigs(param).then(() => {
        this.$message.success('操作成功')
        this.queryList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 重置数据
    resetEdit () {
      this.editForm = {}
    },
    saveBind () {
      // console.log(111, this)
      // console.log(111, this.$refs.tree.getCheckedNodes())
      let checkedNodes = this.$refs.tree.getCheckedNodes()
      let checkConfigs = []
      if (checkedNodes && checkedNodes.length) {
        // 判断是否为某类型全选
        for (let i = 0; i < checkedNodes.length; i++) {
          if (!checkedNodes[i].children) {
            checkConfigs.push(checkedNodes[i])
          }
        }
        // if (checkedNodes[0].children) {
        //   checkConfigs = checkedNodes[0].children
        // } else {
        //   checkConfigs = checkedNodes
        // }
      }
      // let config = {}
      // for (let i = 0; i < checkedNodes.length; i++) {
      //   if (!checkedNodes[i].children) {
      //     config = {
      //       id: checkedNodes[i].configId,
      //       airline: 'NS',
      //       configType: checkedNodes[i].parent,
      //       cinfigContent: checkedNodes[i].value
      //     }
      //     checkConfigs.push(config)
      //   }
      // }
      this.$emit('getBindData', checkConfigs)
    },
    resetChecked () {
      this.$refs.tree.setCheckedKeys([])
    }
  }
}
</script>

<style scoped lang="scss">
.main {
  padding: 10px;
}
/*.item-label {*/
/*  height: 80px;*/
/*  line-height: 80px;*/
/*}*/
</style>
