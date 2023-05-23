<template>
  <div class="menu-container">
    <el-input
      placeholder="输入关键字进行过滤"
      clearable
      v-model="filterText">
    </el-input>
    <div class="container" v-loading="loading">
      <el-tree
        ref="permission"
        :data="treeList"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :render-content="renderContent">
      </el-tree>
    </div>
    <div>
      <el-dialog :visible.sync="visible" title="编辑" width="600px">
        <el-form>
          <el-form-item label="活动名称" label-width="120px">
            <el-input style="width: 400px" v-model="currentNode.text" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="updateName">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { queryMenu, updateMenu } from './api'
export default {
  name: 'Menu',
  data () {
    return {
      loading: false,
      filterText: '',
      treeList: [],
      visible: false,
      currentNode: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created () {
    this.fetchMenu()
  },
  watch: {
    filterText (val) {
      this.$refs.permission.filter(val)
    }
  },
  methods: {
    renderContent (h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span class="btn">
            <el-button size="mini" type="text" on-click={ () => this.switchDialog(node, data) }>修改</el-button>
          </span>
        </span>)
    },
    // 获取数据
    fetchMenu () {
      this.loading = true
      queryMenu().then(res => {
        // this.treeList = res.treeList
        if (res.treeList && res.treeList.length) {
          this.dataFormat(res.treeList)
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
    },
    // 格式化数据，tree只能绑定label
    dataFormat (data) {
      for (let i = 0; i < data.length; i++) {
        data[i].label = data[i].text
        for (let j = 0; j < data[i].children.length; j++) {
          data[i].children[j].label = data[i].children[j].text
          if (data[i].children[j].children && data[i].children[j].children.length) {
            for (let m = 0; m < data[i].children[j].children.length; m++) {
              data[i].children[j].children[m].label = data[i].children[j].children[m].text
            }
          }
        }
      }
      this.treeList = data
    },
    filterNode (value, data) {
      // console.log(value)
      // console.log(data)
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 切换弹框
    switchDialog (node, data) {
      this.currentNode = data
      this.visible = !this.visible
    },
    // 更新节点名称
    updateName () {
      if (this.currentNode.text) {
        updateMenu({ menuName: this.currentNode.text, menuTypeId: this.currentNode.id }).then(() => {
          this.visible = false
          this.$message.success('修改成功')
          this.fetchMenu()
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        this.$message.error('菜单名不可为空')
      }
    }
  }
}
</script>

<style scoped>
  .el-tree {
    background-color: rgb(245, 247, 250);
  }
.container {
  padding: 15px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  width: 600px;
}
</style>
