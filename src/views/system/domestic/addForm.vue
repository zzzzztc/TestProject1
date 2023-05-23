<template>
  <div>
    <div class="setupRow" v-for="(item,index) in list" :key="index" @change="onEditorChange($event)">
      <div class="row">
        <div class="column">
          <div class="label required">
            时限从
            <el-checkbox class="fr pr-5" v-model="item.lowerContain"></el-checkbox>
          </div>
          <div class="ipt-medium">
            <el-input type="text" clearable placeholder="时限从" v-model="item.lowerLimit" size="medium"></el-input>
            <div class="warning-info" v-if="isEmpty && !item.lowerLimit && !item.upperLimit">退票费计算基数不可为空</div>
          </div>
        </div>
        <div class="column">
          <div class="label required">
            至
            <el-checkbox class="fr pr-5" v-model="item.upperContain"></el-checkbox>
          </div>
          <div class="ipt-medium">
            <el-input type="text" clearable placeholder="至" v-model="item.upperLimit" size="medium"></el-input>
            <div class="warning-info" v-if="isEmpty && !item.upperLimit && !item.lowerLimit">退票费计算基数不可为空</div>
          </div>
        </div>
        <div class="column">
          <div class="label required">改期费率</div>
          <div class="ipt-medium">
            <el-input type="text" clearable placeholder="改期费率" v-model="item.changerate" size="medium"></el-input>
            <div class="warning-info" v-if="isShow && !item.changerate">改期费率不可为空</div>
          </div>
        </div>
        <div class="column">
          <div class="label ">免费改期次数</div>
          <div class="ipt-medium">
            <el-input type="text" clearable placeholder="免费改期次数" v-model="item.freeChangeTime" size="medium"></el-input>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="column">
          <div class="label required">退票费率</div>
          <div class="ipt-medium">
            <el-input type="text" clearable placeholder="退票费率" v-model="item.refundrate" size="medium"></el-input>
            <div class="warning-info" v-if="isShow && !item.refundrate">退票费率不可为空</div>
          </div>
        </div>
        <div class="column">
          <div class="label">基准舱位</div>
          <div class="ipt-medium">
            <el-select size="medium" placeholder="基准舱位" v-model="item.basecabin" style="width: 130px;">
              <el-option key="0" label="Y" value="Y"></el-option>
              <el-option key="1" label="J" value="J"></el-option>
            </el-select>
            <div class="fr" style="padding-top: 8px">全价百分比</div>
            <div class="warning-info" v-if="isShow && basic === '0' && !item.basecabin">基准舱位不可为空</div>
          </div>
        </div>
        <div class="column-btn">
          <el-button size="medium" type="primary" @click="setupAdd" v-if="index === list.length-1">新增</el-button>
          <el-button size="medium" type="danger" @click="setupDel(index)" v-if="index > 0">删除</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      isShow: false,
      list: [
        {
          lowerLimit: '',
          lowerContain: false,
          upperLimit: '',
          upperContain: false,
          changerate: '',
          freeChangeTime: '',
          refundrate: '',
          basecabin: ''
        }
      ],
      basic: ''
    }
  },
  props: {
    addList: {
      type: Array,
      required: true
    },
    isEmpty: {
      type: Boolean,
      required: true
    },
    feeBasic: {
      type: String,
      required: true
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    // 退改签设置增加
    setupAdd () {
      let i = this.list.length - 1
      if (this.list[i].changerate && this.list[i].refundrate) {
        this.list.push(
          {
            lowerLimit: '',
            upperLimit: '',
            changerate: '',
            freeChangeTime: '',
            refundrate: '',
            basecabin: ''
          }
        )
      } else {
        this.isShow = true
      }
    },
    // 退改签设置删除
    setupDel (index) {
      if (this.list.length > 1) {
        this.list.splice(index, 1)
      }
    },
    // 内容改变事件
    onEditorChange () {
      this.$emit('updateAddList', this.list)
    }
  },
  // 监听事件
  watch: {
    addList: function (e) {
      this.list = e
    },
    isEmpty: function (e) {
      this.isShow = e
    },
    feeBasic: function (e) {
      this.basic = e
    }
  }
}
</script>

<style scoped lang="scss">
  .setupRow{
    margin-top: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #909399;
  }
  .column-btn{
    float: right;
    padding: 27px 15px 0 0;
  }
</style>
