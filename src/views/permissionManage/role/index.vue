<template>
  <div class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item">
          <el-date-picker
            class="date-picker-380"
            size="medium"
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="截止日期"
            align="right">
          </el-date-picker>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="角色名称" v-model="filter.roleName" clearable @keydown.enter.native="getRoleList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="角色注释" v-model="filter.comments" clearable @keydown.enter.native="getRoleList()"></el-input>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getRoleList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="switchDialog()">添加</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="roleList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
<!--          <el-table-column label="序号" type="index" width="50"></el-table-column>-->
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="创建时间" prop="createTime"></el-table-column>
          <el-table-column label="创建人" prop="createPerson"></el-table-column>
          <el-table-column label="角色注释" prop="comments"></el-table-column>
          <el-table-column label="所属机构" prop="sourceName"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="active-text mr-5" @click="switchDialog(scope.row.roleId)">编辑</span>
              <span class="danger-text mr-5" @click="handleConfirm(scope.row.roleId)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="filter.page"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="roleList.total">
       </el-pagination>
    </div>
    <div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="800px">
        <div class="dialog-container">
          <div class="dialog-main">
            <div class="row">
              <div class="column">
                <div class="label required">角色名称</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="角色名称" v-model="roleInfo.roleName" clearable></el-input>
                  <div class="danger-text" v-if="formErr && !roleInfo.roleName">名称不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">所属机构</div>
                <div class="ipt-medium">
                  <el-select size="medium" placeholder="" v-model="roleInfo.sourceId">
                    <el-option label="河北航空" value="sdal"></el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label required">角色备注</div>
                <div style="width: 690px">
                  <el-input size="medium" placeholder="角色备注" v-model="roleInfo.comments" clearable></el-input>
                  <div class="danger-text" v-if="formErr && !roleInfo.comments">备注不可为空</div>
                </div>
              </div>
            </div>
            <div class="row">
              <role-permission ref="per" :permission="permissionList" :role-info="roleDetail.message"></role-permission>
            </div>
          </div>
          <div class="dialog-footer">
            <!--<el-button size="medium" type="primary" @click="judgeParam">{{isCreate ? '提交' : '编辑'}}</el-button>-->
            <el-button size="medium" type="primary" @click="judgeParam">提交</el-button>
            <el-button size="medium" v-if="isCreate" @click="resetRoleInfo">重置</el-button>
            <el-button size="medium" @click="dialogVisible = false">返回</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { computeTableHeight } from '../../../utils/index'
import { fetchList, listAllMenu, queryRoleInfo, saveRole, editRole, deleteRole } from './api'
import RolePermission from './rolePermission'

export default {
  name: 'RoleManage',
  data () {
    return {
      loading: false,
      dataViewHeight: null,
      filter: {},
      date: [],
      roleList: {},
      roleInfo: {
        roleName: '',
        comments: '',
        sourceId: 'sdal',
        optypeIds: ''
      },
      dialogVisible: false,
      dialogTitle: '',
      permissionList: [],
      permissionListCopy: [],
      isCreate: false,
      formErr: false,
      roleDetail: {}
    }
  },
  components: {
    RolePermission
  },
  computed: {
    ...mapState({
      tableAttributes: state => state.app.tableAttributes,
      pagination: state => state.app.pagination
    })
  },
  mounted () {
    this.dataViewHeight = computeTableHeight(this, 'header')
  },
  created () {
    this.getRoleList(1, this.pagination.pageSize)
    this.getPermissionList()
  },
  methods: {
    // 获取角色列表
    getRoleList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      if (this.date.length) {
        this.filter.startdate = this.date[0]
        this.filter.enddate = this.date[1]
      } else {
        delete this.filter.startdate
        delete this.filter.enddate
      }
      fetchList(this.filter).then(res => {
        this.roleList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 重置
    resetFilter () {
      this.filter = {}
      this.date = []
      this.getRoleList(1, this.pagination.pageSize)
    },
    // 分页
    handleSizeChange (pages) {
      this.getRoleList(null, pages)
    },
    handleCurrentChange (page) {
      this.getRoleList(page, null)
    },
    getPermissionList () {
      listAllMenu().then(res => {
        this.permissionList = res.treeList
        this.permissionListCopy = JSON.parse(JSON.stringify(res.treeList))
        for (let i = 0; i < this.permissionList.length; i++) {
          this.$set(this.permissionList[i], 'checkList', [])
          this.$set(this.permissionListCopy[i], 'checkList', [])
          for (let j = 0; j < this.permissionList[i].children.length; j++) {
            this.$set(this.permissionList[i].children[j], 'checkList', [])
            this.$set(this.permissionListCopy[i].children[j], 'checkList', [])
          }
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 切换弹框
    switchDialog (id) {
      this.formErr = false
      if (id) {
        // 编辑
        this.getRoleInfo(id)
        this.isCreate = false
      } else {
        // 添加
        this.isCreate = true
        this.dialogVisible = true
        this.dialogTitle = '增加角色信息'
        this.permissionList = JSON.parse(JSON.stringify(this.permissionListCopy))
        this.roleInfo.roleName = ''
        this.roleInfo.sourceId = ''
        this.roleInfo.comments = ''
        this.formErr = false
      }
    },
    // 获取详情
    getRoleInfo (id) {
      queryRoleInfo({ roleId: id }).then(res => {
        this.roleDetail = res
        this.roleInfo.roleName = res.obj.roleName
        this.roleInfo.comments = res.obj.comments
        this.permissionMatch(res.message.split(','))
        this.dialogVisible = true
        this.dialogTitle = '修改角色信息'
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 权限匹配
    permissionMatch (param) {
      this.permissionList = JSON.parse(JSON.stringify(this.permissionListCopy))
      for (let m = 0; m < param.length; m++) {
        end: // eslint-disable-line
        for (let i = 0; i < this.permissionList.length; i++) {
          for (let j = 0; j < this.permissionList[i].children.length; j++) {
            if (this.permissionList[i].children[j].children && this.permissionList[i].children[j].children.length) {
              if (param[m] === this.permissionList[i].children[j].id) {
                this.permissionList[i].checkList.push(this.permissionList[i].children[j].id)
                break end // eslint-disable-line
              }
              // 子菜单有二级菜单
              for (let t = 0; t < this.permissionList[i].children[j].children.length; t++) {
                if (param[m] === this.permissionList[i].children[j].children[t].id) {
                  this.permissionList[i].children[j].checkList.push(this.permissionList[i].children[j].children[t].id)
                  break end // eslint-disable-line
                }
              }
            } else {
              // 子菜单没有二级菜单
              // 没有子菜单的二级菜单
              if (param[m] === this.permissionList[i].children[j].id) {
                this.permissionList[i].checkList.push(this.permissionList[i].children[j].id)
                break end // eslint-disable-line
              }
            }
          }
          // for (let j = 0; j < this.permissionList[i].children.length; j++) {
          //   if (param[m] === this.permissionList[i].children[j].id) {
          //     this.permissionList[i].checkList.push(param[m])
          //     break end // eslint-disable-line
          //   }
          // }
        }
      }
      for (let i = 0; i < this.permissionList.length; i++) {
        if (this.permissionList[i].children.length === this.permissionList[i].checkList.length) {
          this.permissionList[i].checked = true
          for (let j = 0; j < this.permissionList[i].children.length; j++) {
            if (this.permissionList[i].children[j].children && this.permissionList[i].children[j].children.length) {
              if (this.permissionList[i].children[j].children.length === this.permissionList[i].children[j].checkList.length) {
                this.permissionList[i].children[j].checked = true
              } else {
                this.permissionList[i].children[j].checked = false
              }
            }
          }
        } else {
          this.permissionList[i].checked = false
        }
      }
    },
    // 获取权限数组
    getPermissionArr () {
      let arr = []
      // 传入一级菜单
      for (let i = 0; i < this.permissionList.length; i++) {
        if (this.permissionList[i].checkList.length || (this.permissionList[i].children.length === 0 && this.permissionList[i].checked)) {
          arr.push(this.permissionList[i].id)
        }
      }
      for (let i = 0; i < this.permissionList.length; i++) {
        for (let j = 0; j < this.permissionList[i].checkList.length; j++) {
          arr.push(this.permissionList[i].checkList[j])
        }
      }
      for (let i = 0; i < this.permissionList.length; i++) {
        for (let j = 0; j < this.permissionList[i].children.length; j++) {
          for (let m = 0; m < this.permissionList[i].children[j].checkList.length; m++) {
            arr.push(this.permissionList[i].children[j].checkList[m])
            if (this.permissionList[i].children[j].checkList.length) {
              arr.push(this.permissionList[i].children[j].id)
            }
          }
        }
      }
      return [...new Set(arr)]
    },
    // 新增编辑参数判断
    judgeParam () {
      let arr = this.getPermissionArr()
      if (this.roleInfo.roleName && this.roleInfo.comments && arr.length) {
        this.formErr = false
        this.roleInfo.optypeIds = arr.join(',')
        if (this.isCreate) {
          this.handleAddRole()
        } else {
          this.handleEditRole()
        }
      } else {
        this.formErr = true
        if (!arr.length) {
          this.$message.error('请选权限')
        }
      }
    },
    // 新增角色
    handleAddRole () {
    	// console.log(this.roleInfo)
      saveRole(this.roleInfo).then(() => {
        this.dialogVisible = false
        this.getRoleList()
        this.$message.success('添加成功')
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 编辑
    handleEditRole () {
      let data = JSON.parse(JSON.stringify(this.roleInfo))
      data.roleId = this.roleDetail.obj.roleId
      editRole(data).then(() => {
        this.$message.success('修改成功')
        this.dialogVisible = false
        this.getRoleList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    resetRoleInfo () {
      this.roleInfo.roleName = ''
      this.roleInfo.comments = ''
      this.roleInfo.optypeIds = ''
      this.formErr = false
      this.$refs['per'].resetPer()
    },
    handleConfirm (id) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonClass: '确定',
        cancelButtonClass: '取消',
        type: 'error'
      }).then(() => {
        this.handleDelete(id)
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    // 删除
    handleDelete (id) {
      deleteRole({ roleIds: id }).then(() => {
        this.$message.success('删除成功')
        this.getRoleList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
