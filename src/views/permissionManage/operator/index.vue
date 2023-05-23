<template>
  <div class="container">
    <div class="header" ref="header">
      <div class="search-container clearfix">
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="登录员账号" v-model="filter.opAccount" clearable @keydown.enter.native="getOperatorList()"></el-input>
        </div>
        <div class="search-item search-ipt">
          <el-input size="medium" placeholder="登录员姓名" v-model="filter.opName" clearable @keydown.enter.native="getOperatorList()"></el-input>
        </div>
        <div class="search-item">
          <el-button size="medium" type="primary" @click="getOperatorList()">查询</el-button>
          <el-button size="medium" @click="resetFilter">重置</el-button>
        </div>
      </div>
      <div class="btn-container">
        <el-button size="medium" @click="switchDialog(1)">添加操作员</el-button>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="operatorList.rows"
          :height="dataViewHeight"
          :border="tableAttributes.border"
          :stripe="tableAttributes.stripe"
          :cell-style="tableAttributes.cellStyle">
<!--          <el-table-column label="序号" type="index" width="50"></el-table-column>-->
          <el-table-column label="操作员账户" prop="opAccount" min-width="160"></el-table-column>
          <el-table-column label="操作员名称" prop="opName" min-width="180"></el-table-column>
          <el-table-column label="最后登录IP" prop="lastLoginIp" min-width="140"></el-table-column>
          <el-table-column label="最后登录时间" prop="lastLoginTime" min-width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.lastLoginTime === 'null'">--</span>
              <span v-else>{{scope.row.lastLoginTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="登录次数" prop="loginCount" min-width="140"></el-table-column>
          <el-table-column label="备注" prop="remark" min-width="200"></el-table-column>
          <el-table-column label="所属角色" prop="roleName" min-width="180"></el-table-column>
          <el-table-column label="操作" min-width="280" fixed="right">
            <template slot-scope="scope">
              <span class="active-text mr-5" v-if="scope.row.opAccount !== 'admin'" @click="switchDialog(2, scope.row.opId, scope.row)">修改</span>
              <span class="active-text mr-5" @click="switchDialog(0, scope.row.opId)">详情</span>
              <span class="danger-text mr-5" v-if="scope.row.opAccount !== 'admin'" @click="handleConfirm(0, scope.row.opId)">删除</span>
              <span class="active-text mr-5" v-if="scope.row.state === '0' && scope.row.opAccount !== 'admin'" @click="handleConfirm(1, scope.row.opId)">锁定</span>
              <span class="active-text mr-5" v-if="scope.row.state === '1' && scope.row.opAccount !== 'admin'" @click="handleConfirm(2, scope.row.opId)">解除</span>
              <span class="active-text mr-5" v-if="scope.row.isFrozen === '1'" @click="handleConfirm(3, scope.row.opId)">解冻</span>
<!--              <span class="active-text mr-5" @click="handleConfirm(3, scope.row.opId)">解冻</span>-->
              <span class="danger-text mr-5" v-if="scope.row.opAccount !== 'admin'" @click="handlePrompt(scope.row.opId)">修改密码</span>
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
        :total="operatorList.total">
       </el-pagination>
    </div>
    <!--详情-->
    <div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisibleInfo" width="600px">
        <div class="dialog-container">
          <div class="dialog-main" style="padding: 0">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="操作员详情" name="operatorInfo">
                <div class="row">
                  <span class="form-label">操作员账号</span>
                  <span class="form-value">{{operatorInfo.opAccount}}</span>
                </div>
                <div class="row">
                  <span class="form-label">操作员姓名</span>
                  <span class="form-value">{{operatorInfo.opName}}</span>
                </div>
                <div class="row">
                  <span class="form-label">联系电话</span>
                  <span class="form-value">{{operatorInfo.phone}}</span>
                </div>
                <div class="row">
                  <span class="form-label">手机号码</span>
                  <span class="form-value">{{operatorInfo.mobile}}</span>
                </div>
                <div class="row">
                  <span class="form-label">电子邮箱</span>
                  <span class="form-value">{{operatorInfo.email}}</span>
                </div>
                <div class="row">
                  <span class="form-label">备注</span>
                  <span class="form-value">{{operatorInfo.remark}}</span>
                </div>
              </el-collapse-item>
              <el-collapse-item title="权限" name="menuList">
                <div class="menu-list">
                  <div class="item" v-for="item in menuList" :key="item.id">
                    <div class="item-par">{{item.text}}</div>
                    <div class="clearfix p-10">
                    <div class="pb-10 pr-20 clear" v-for="val in item.children" :key="val.id">
                      <div :class="{'second' : val.children && val.children.length > 0}" style="font-weight: bold">{{val.text}}</div>
                      <div :class="{'second_child' : val.children && val.children.length > 0}">
                        <div v-for="vals in val.children" class="item-chil" :key="vals.id">{{vals.text}}</div>
                      </div>
                    </div>
                    </div>
                    <!--<div class="item" v-for="child in menuList" :key="child.id">-->
                      <!--<div v-if="!child.children" class="item-par">{{child.text}}</div>-->
                      <!--<div class="clearfix p-10">-->
                        <!--<div class="item-chil pb-10 pr-20" v-for="val in child.children" :key="val.id">{{val.text}}</div>-->
                      <!--</div>-->
                    <!--</div>-->
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div class="dialog-footer">
            <el-button size="medium" @click="dialogVisibleInfo = false">返回</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <!--新增编辑-->
    <div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="560px">
        <div class="dialog-container">
          <div class="dialog-main">
            <div class="row">
              <div class="column">
                <div class="label required">操作员账号</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="账号" v-model="operatorMsg.opAccount" clearable></el-input>
                  <div class="danger-text" v-if="formErr && !operatorMsg.opAccount">账号不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label required">操作员姓名</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="姓名" v-model="operatorMsg.opName" clearable></el-input>
                  <div class="danger-text" v-if="formErr && !operatorMsg.opName">姓名不可为空</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label required">角色</div>
                <div class="ipt-medium">
                  <el-select size="medium" placeholder="角色" v-model="operatorMsg.roleId">
                    <el-option v-for="item in roleList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                  </el-select>
                  <div class="danger-text" v-if="formErr && !operatorMsg.roleId">角色不可为空</div>
                </div>
              </div>
              <div class="column">
                <div class="label">联系电话</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="电话" v-model="operatorMsg.phone" clearable></el-input>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <div class="label">手机号码</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="号码" v-model="operatorMsg.mobile" clearable></el-input>
                </div>
              </div>
              <div class="column">
                <div class="label">电子邮箱</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="电子邮箱" v-model="operatorMsg.email" clearable></el-input>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column" v-if="isCreate">
                <div class="label required">操作员密码</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="密码" type="password" v-model="operatorMsg.opPwd" clearable></el-input>
                  <div class="danger-text" v-if="formErr && !operatorMsg.opPwd">密码不可为空</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="column" style="width: 480px">
                <div class="label required">备注</div>
                <div class="ipt-medium">
                  <el-input size="medium" placeholder="备注" type="textarea" :rows="4" v-model="operatorMsg.remark" clearable></el-input>
                  <div class="danger-text" v-if="formErr && !operatorMsg.remark">备注不可为空</div>
                </div>
              </div>
            </div>
          </div>
          <div class="dialog-footer">
            <el-button size="medium" type="primary" @click="paramJudge">提交</el-button>
            <!--<el-button size="medium" type="primary" @click="paramJudge">{{isCreate ? '提交' : '编辑'}}</el-button>-->
            <el-button size="medium"  v-if="isCreate" @click="resetDialog">重置</el-button>
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
import { fetchList, queryOperatorById, fetchListMenu, queryRole, saveOperator, updateOperator, deleteOperator, lockOperator, unlockOperator, editPassword, queryUnFrozen } from './api'

export default {
  name: 'OperatorList',
  data () {
    return {
      loading: false,
      dataViewHeight: null,
      roleList: [],
      filter: {
        sourceid: 'sdal'
      },
      activeNames: ['operatorInfo'],
      operatorList: {}, // 列表
      operatorInfo: {}, // 详情
      menuList: [], // 权限
      dialogVisibleInfo: false,
      dialogVisible: false,
      dialogTitle: '',
      isCreate: false,
      formErr: false,
      currentItem: {},
      operatorMsg: {
        opAccount: '',
        opPwd: '',
        opName: '',
        phone: '',
        mobile: '',
        email: '',
        remark: '',
        roleId: ''
      }
    }
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
    this.getOperatorList(1, this.pagination.pageSize)
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    getRoleList () {
      queryRole().then(res => {
        this.roleList = res.treeList
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 获取数据
    getOperatorList (page, pageSize) {
      this.loading = true
      this.filter.page = page || 1
      if (pageSize) this.filter.rows = pageSize
      fetchList(this.filter).then(res => {
        this.operatorList = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 重置
    resetFilter () {
      this.filter = {
        sourceid: 'sdal'
      }
      this.getOperatorList(1, this.pagination.pageSize)
    },
    // 分页
    handleSizeChange (pages) {
      this.getOperatorList(null, pages)
    },
    handleCurrentChange (page) {
      this.getOperatorList(page, null)
    },
    // 切换弹框
    switchDialog (type, id, param) {
      this.formErr = false
      if (type === 0) {
        // 详情
        this.dialogVisibleInfo = true
        this.dialogTitle = '操作员详情'
        this.getOperatorInfo(id)
        this.getOperatorPermission(id)
      } else if (type === 1) {
        // 新增
        this.operatorMsg = {
          opAccount: '',
          opPwd: '',
          opName: '',
          phone: '',
          mobile: '',
          email: '',
          remark: '',
          roleId: ''
        }
        this.isCreate = true
        this.dialogTitle = '添加操作员'
        this.dialogVisible = true
      } else if (type === 2) {
        // 编辑
        this.currentItem = param
        this.operatorMsg.roleId = param.roleId
        this.operatorMsg.opAccount = param.opAccount
        this.operatorMsg.opName = param.opName
        this.operatorMsg.phone = param.phone
        this.operatorMsg.mobile = param.mobile
        this.operatorMsg.email = param.email
        this.operatorMsg.remark = param.remark
        this.operatorMsg.opPwd = param.opPwd
        // this.getOperatorInfo(id)
        this.isCreate = false
        this.dialogVisible = true
        this.dialogTitle = '修改操作员'
      }
    },
    // 获取详情
    getOperatorInfo (id) {
      queryOperatorById({ opId: id }).then(res => {
        this.operatorInfo = res.obj
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 获取权限列表
    getOperatorPermission (id) {
      fetchListMenu({ operId: id }).then(res => {
        this.menuList = res.treeList
	      console.log(this.menuList)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 参数判断
    paramJudge () {
      if (this.operatorMsg.opAccount && this.operatorMsg.opName && this.operatorMsg.opPwd && this.operatorMsg.remark && this.operatorMsg.roleId) {
        this.formErr = false
        if (this.isCreate) {
          this.handleAddOperator()
        } else {
          this.handleUpdateOperator()
        }
      } else {
        this.formErr = true
      }
    },
    // 新增
    handleAddOperator () {
      saveOperator(this.operatorMsg).then(() => {
        this.dialogVisible = false
        this.$message.success('添加成功')
        this.getOperatorList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 修改
    handleUpdateOperator () {
      let data = JSON.parse(JSON.stringify(this.operatorMsg))
      // delete data.opPwd
      data.opId = this.currentItem.opId
      updateOperator(data).then(() => {
        this.$message.success('修改成功')
        this.dialogVisible = false
        this.getOperatorList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 新增编辑重置
    resetDialog () {
      this.operatorMsg.opAccount = ''
      this.operatorMsg.opPwd = ''
      this.operatorMsg.opName = ''
      this.operatorMsg.roleId = ''
      this.operatorMsg.mobile = ''
      this.operatorMsg.phone = ''
      this.operatorMsg.remark = ''
      this.operatorMsg.email = ''
      this.formErr = false
    },
    // 操作确认
    handleConfirm (type, param) {
      let title = ''
      if (type === 0) {
        // 删除
        title = '是否确定删除？'
      } else if (type === 1) {
        // 锁定
        title = '是否确认锁定？'
      } else if (type === 2) {
        // 取消锁定
        title = '是否确定取消锁定'
      } else if (type === 3) {
        // 解冻
        title = '是否确定解冻'
      }
      this.$confirm(title, '提示', {
        confirmButtonClass: '确定',
        cancelButtonClass: '取消',
        type: 'error'
      }).then(() => {
        if (type === 0) {
          this.handleDeleteOperator(param)
        } else if (type === 1) {
          this.handleLockOperator(param)
        } else if (type === 2) {
          this.handleUnlockOperator(param)
        } else if (type === 3) {
          this.handleThaw(param)
        }
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    // 删除
    handleDeleteOperator (id) {
      deleteOperator({ opId: id }).then(() => {
        this.$message.success('删除成功')
        this.getOperatorList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 锁定
    handleLockOperator (id) {
      lockOperator({ opId: id }).then(() => {
        this.$message.success('锁定成功')
        this.getOperatorList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 解除锁定
    handleUnlockOperator (id) {
      unlockOperator({ opId: id }).then(() => {
        this.$message.success('解锁成功')
        this.getOperatorList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 解冻
    handleThaw (id) {
      queryUnFrozen({ opId: id }).then(() => {
        this.$message.success('解锁成功')
        this.getOperatorList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 修改密码
    handlePrompt (id) {
      this.$prompt('请输入新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonClass: '取消'
      }).then(({ value }) => {
        this.handleEditPassword(id, value)
      }).catch(() => {
        this.$message.info('操作取消')
      })
    },
    handleEditPassword (id, nPwd) {
      // console.log(id, nPwd)
      editPassword({ opId: id, password: nPwd }).then(() => {
        this.$message.success('修改成功')
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .menu-list {
    max-height: 450px;
    overflow: scroll;
    border-left: 1px solid #dcdfe6;
    border-right: 1px solid #dcdfe6;
  }

  .item-par {
    padding: 5px;
    background: #fafafa;
    border-top: 1px solid #dcdfe6;
    border-bottom: 1px solid #dcdfe6;
  }
.actives {
  background: red;
}
  .item-chil {
    float: left;
    width: 140px;
    /*padding: 15px;*/
  }
.pr-20 {
  padding-right: 0;
}
.second {
  /*border-bottom: 1px solid #e4e7ed;*/
  padding-bottom: 2px;
}
.second_child {
  padding-top: 10px;
  margin-left: 20px;
}
.clear:after {
  display: block;
  visibility: hidden;
  height: 0;
  clear: both;
  content: '.';
}
.item-check {
  margin-bottom: 15px;
}
</style>
