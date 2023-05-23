<template>
  <div class="container">
    <!--<h1>个人密码修改</h1>-->
    <div class="role">{{ permissionInfo.roleName }}</div>
    <div class="btn-container">
      <el-button size="medium" @click="editVisible=true">修改密码</el-button>
    </div>
    <div class="permission">
      <div class="label">我的权限</div>
      <div class="tree">
<!--        一级目录-->
        <div class="fClass" v-for="(item, index) in treeList" :key="item.id">
          <span class="fText pointer" @click="switchBox(index, false)">{{item.text}}</span>
          <span class="icon" @click="switchBox(index)"></span>
<!--          二级目录-->
          <div style="margin-top: 26px" v-if="item.children && item.children.length && item.isOpen">
            <div class="sClass" v-for="(val, sIndex) in item.children" :key="val.id">
              <span class="sText" @click="switchBox(index, sIndex, true)">{{val.text}}</span>
              <span class="icon" v-if="val.children && val.children.length"  @click="switchBox(index, sIndex, true)"></span>
              <!--              三级目录-->
              <div v-if="val.children && val.children.length && val.isOpen">
                <div class="tClass" v-for="t in val.children" :key="t.id">
                  <span class="tText">{{t.text}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tree-container"></div>
    <el-dialog title="操作员个人密码修改" :visible.sync="editVisible" width="320px">
      <div class="dialog-container">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label">原始密码</div>
              <div class="fl ipt-medium">
                <el-input size="medium" placeholder="原始密码" clearable type="password" v-model="editForm.oldPwd"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">新密码</div>
              <div class="fl ipt-medium">
                <el-input size="medium" placeholder="新密码" clearable type="password" v-model="editForm.newPwd"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label">确认密码</div>
              <div class="fl ipt-medium">
                <el-input size="medium" placeholder="确认密码" clearable type="password" v-model="editForm.confirmPwd"></el-input>
                <div class="warning-info" v-if="emptyShow && editForm.confirmPwd !== editForm.newPwd">两次输入新密码不一样</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <div class="box"></div>
          <el-button size="mini" type="primary" @click="saveEdit">确认修改</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updatePwd, queryUserInfo } from './api'
export default {
  name: 'ChangePwd',
  data () {
    return {
      editVisible: false, // 弹出框默认显示
      emptyShow: false, // 输入框判空
      editForm: {},
      permissionInfo: {},
      treeList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    switchBox (index, sIndex, isS) {
      if (isS) {
        this.treeList[index].children[sIndex].isOpen = !this.treeList[index].children[sIndex].isOpen
      } else {
        this.treeList[index].isOpen = !this.treeList[index].isOpen
      }
    },
    // 确认修改密码
    saveEdit () {
      if (this.editForm.oldPwd && this.editForm.newPwd && this.editForm.confirmPwd) {
        if (this.editForm.newPwd === this.editForm.confirmPwd) {
          let data = JSON.parse(JSON.stringify(this.editForm))
          delete data.confirmPwd
          updatePwd(data).then(res => {
            // console.log(res)
            this.emptyShow = false
            this.editVisible = false
            this.editForm = {}
            this.$message({
              message: '密码修改成功',
              type: 'success'
            })
          }).catch(err => {
            // console.log(err)
            this.emptyShow = true
            this.$message({
              message: err.message,
              type: 'info'
            })
          })
        } else {
          this.emptyShow = true
        }
      } else {
        this.$alert('请按照规则填写参数！', '错误提示', {
          confirmButtonText: '确定'
        })
      }
    },
    // 获取当前用户信息
    getUserInfo () {
      queryUserInfo({ operId: JSON.parse(localStorage.getItem('userInfo')).opId }).then(res => {
        // console.log(res)
        this.permissionInfo = res.obj
        this.dataFormat(res.treeList)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 数据转化
    dataFormat (data) {
      for (let i = 0; i < data.length; i++) {
        data[i].label = data[i].text
        this.$set(data[i], 'isOpen', true)
        for (let j = 0; j < data[i].children.length; j++) {
          data[i].children[j].label = data[i].children[j].text
          if (data[i].children[j].children && data[i].children[j].children.length) {
            this.$set(data[i].children[j], 'isOpen', true)
            for (let m = 0; m < data[i].children[j].children.length; m++) {
              data[i].children[j].children[m].label = data[i].children[j].children[m].text
            }
          }
        }
      }
      this.treeList = data
    }
  }
}
</script>

<style scoped lang="scss">
  .fade-enter-active {
    animation: fade-in 0.2s;
  }
  .fade-leave-active {
    animation: fade-out 0.2s;
  }
  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 100%;
    }
  }
  @keyframes fade-out {
    0% {
      opacity: 100%;
    }
    100% {
      opacity: 0;
    }
  }
  .tree {
    width: 100%;
    min-height: 400px;
    padding-left: 66px;
    /*border: 1px solid #ccc;*/
    font-size: 14px;
    .fClass {
      /*border-left: 1px solid #ccc;*/
      margin-bottom: 30px;
      .sClass {
        margin-left: 30px;
        border-left: 2px solid #409EFF;
        padding-left: 10px;
        padding-bottom: 20px;
        &:last-child {
          padding-bottom: 0;
        }
        .tClass {
          display: inline-block;
          margin-left: 30px;
          padding-left: 10px;
          margin-top: 26px;
          &:first-child {
            border-left: 2px solid #409EFF;
          }
          &:last-child {
            padding-bottom: 0;
          }
        }
      }
    }
  }
  .icon {
    display: inline-block;
    width: 10px;
    height: 6px;
    margin: 3px 10px;
    background-image: url("../../../assets/zhedie2.svg");
    cursor: pointer;
  }
.role {
  padding: 30px 48px;
  font-size: 18px;
  color: #303133;
  font-family: 'PingFangSC';
}
  .btn-container {
    margin: 0 48px;
    padding: 0;
  }
  .permission {
    margin-top: 30px;
    border-top: 1px solid #ccc;
    .label {
      font-family: 'PingFang-SC-Medium';
      padding: 30px 48px;
      font-size: 18px;
      color: #303133;
    }
    .permission-tree {
      padding-left: 66px;
    }
  }
</style>
