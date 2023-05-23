 <template>
  <!--<div class="container">-->
    <!--<div class="item" v-for="(item, index) in permissionList" :key="item.id">-->
      <!--<div class="item-par">-->
        <!--<el-checkbox :indeterminate="isIndeterminate" v-model="item.checked" @change="handleCheckAllChange(index, item.checked)">{{item.text}}</el-checkbox>-->
      <!--</div>-->
      <!--<div class="item-chil">-->
        <!--<el-checkbox-group v-model="item.checkList"  @change="handleCheckedItemChange(index, item.checkList)">-->
          <!--<el-checkbox class="item-check" v-for="val in item.children" :label="val.id" :key="val.id">{{val.text}}</el-checkbox>-->
        <!--</el-checkbox-group>-->
      <!--</div>-->
    <!--</div>-->
  <!--</div>-->
  <div class="container">
    <div class="form" v-for="(item, index) in permissionList" :key="item.id">
      <div class="tabel">
        <el-checkbox v-model="item.checked" :label="item.id" @change="handleCheckAllChange(index, item.checked)">
          <span style="font-size: 16px; font-weight: bold;">
            {{item.text}}
          </span>
        </el-checkbox>
      </div>
      <div :class="{time: !val.children}" v-for="(val, valIndex) in item.children" :label="val.id" :key="val.id">
        <div v-if="val.children && val.children.length">
          <div class="item-child-label">
            <el-checkbox-group v-model="item.checkList">
              <el-checkbox class="par-check" :label="val.id" @change="handleCheckedItemChange(index,valIndex, val.checked, item.checkList)">{{val.text}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="item-chil">
            <el-checkbox-group v-model="val.checkList">
              <el-checkbox class="item-check" @change="handleCheckedItemChangeChild(index, valIndex)" v-for="str in val.children" :label="str.id" :key="str.id">{{str.text}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <!--<div v-else style="width: 100%;border-bottom: 1px solid #ccc;">-->
          <div v-else style="padding-left: 10px" >
            <el-checkbox-group v-model="item.checkList">
              <el-checkbox class="par-check" :label="val.id" @change="handleCheckedItemChangeNo(index, item.checkList)">{{val.text}}</el-checkbox>
            </el-checkbox-group>
          </div>
        <!--</div>-->
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'rolePermission',
  props: {
    permission: {
      type: Array,
      required: true
    },
    roleInfo: {
      type: String
    }
  },
  data () {
    return {
      permissionOld: [],
      permissionList: this.permission,
      isIndeterminate: false,
      permissionListCheck: false
    }
  },
  created () {
  },
  methods: {
    // 全选(一级菜单变换)
    handleCheckAllChange (index, value) {
      if (value) {
        this.permissionList[index].checkList = []
        for (let i = 0; i < this.permissionList[index].children.length; i++) {
          this.permissionList[index].checkList.push(this.permissionList[index].children[i].id)
          if (this.permissionList[index].children[i].children) {
            for (let j = 0; j < this.permissionList[index].children[i].children.length; j++) {
              this.permissionList[index].children[i].checkList.push(this.permissionList[index].children[i].children[j].id)
              this.permissionList[index].children[i].checked = true
            }
          }
        }
        this.permissionList[index].checked = true
      } else {
        this.permissionList[index].checkList = []
        this.permissionList[index].checked = false
        for (let i = 0; i < this.permissionList[index].children.length; i++) {
          this.permissionList[index].children[i].checkList = []
          this.permissionList[index].children[i].checked = false
        }
      }
    },
    // 单选（有子元素的二级菜单变化）
    handleCheckedItemChange (index, valIndex, value, list) {
      // 如果是全选
      if (!value) {
        this.permissionList[index].children[valIndex].checked = true
        for (let i = 0; i < this.permissionList[index].children[valIndex].children.length; i++) {
          this.permissionList[index].children[valIndex].checkList.push(this.permissionList[index].children[valIndex].children[i].id)
          this.permissionList[index].children[valIndex].checkList = [...new Set(this.permissionList[index].children[valIndex].checkList)]
        }
      } else { //  全不选
        this.permissionList[index].children[valIndex].checked = false
        this.permissionList[index].checked = false
        this.permissionList[index].children[valIndex].checkList = []
      }
      if (this.permissionList[index].children.length === this.permissionList[index].checkList.length) {
        this.permissionList[index].checked = true
      } else {
        this.permissionList[index].checked = false
      }
    },
    // 单选（无子元素的二级菜单变化）(控制一级菜单checked属性)
    handleCheckedItemChangeNo (index) {
      if (this.permissionList[index].checkList.length === this.permissionList[index].children.length) {
        this.permissionList[index].checked = true
      } else {
        this.permissionList[index].checked = false
      }
    },
    // 单选（三级菜单变化）
    handleCheckedItemChangeChild (index, valIndex) {
      if (this.permissionList[index].children[valIndex].children.length === this.permissionList[index].children[valIndex].checkList.length) {
        this.permissionList[index].children[valIndex].checked = true
        this.permissionList[index].checkList.push(this.permissionList[index].children[valIndex].id)
        if (this.permissionList[index].children.length === this.permissionList[index].checkList.length) {
          this.permissionList[index].checked = true
        } else {
          this.permissionList[index].checked = false
        }
      } else {
        this.permissionList[index].children[valIndex].checked = false
        this.permissionList[index].checked = false
        let id = this.permissionList[index].children[valIndex].id
        let idIndexOf = this.permissionList[index].checkList.indexOf(id)
        if (idIndexOf >= 0) {
          this.permissionList[index].checkList.splice(idIndexOf, 1)
        }
      }
    },
    resetPer () {
      for (let i = 0; i < this.permissionList.length; i++) {
        this.permissionList[i].checkList = []
        this.permissionList[i].checked = false
        for (let j = 0; j < this.permissionList[i].children.length; j++) {
          this.permissionList[i].children[j].checkList = []
          this.permissionList[i].children[j].checked = false
        }
      }
    }
  },
  watch: {
    permission (n) {
      this.permissionList = n
    }
  }
}
</script>

<style scoped lang="scss">
  .container {
    box-sizing: border-box;
    margin: 0 15px;
  }
  .form {
    border: 1px solid #dcdfe6;
    margin-bottom: 25px;
    border-bottom: none;
  }
  .time {
    padding: 10px 0;
    border-bottom: 1px solid #dcdfe6;
  }
  .tabel {
    box-sizing: border-box;
    padding: 10px;
    border-bottom: 1px solid #dcdfe6;
    background: #fafafa;
  }
  .item-par {
    padding: 5px 5px 0 15px;
    display: inline-block;
    /*border-bottom: 1px solid #dcdfe6;*/
  }
  .item-chil {
    padding: 10px 15px 0 26px;
    border-bottom: 1px solid #dcdfe6;
  }
  .item-child-label {
    padding: 10px 0 10px 10px;
  }
  /*.par-check {*/
  /*margin-bottom: 5px;*/
  /*}*/
  .item-check {
    margin-bottom: 15px;
  }
</style>
