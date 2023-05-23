<template>
  <div class="base-info" v-loading="loading">
    <div class="row">
      <div class="col">
        <div class="label">活动类型</div>
        <div class="">
          <el-radio v-model="activity.actyType" label="02">航线推广</el-radio>
          <el-radio v-model="activity.actyType" label="01">会员拉新</el-radio>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="label required">活动代码</div>
        <div>
<!--          生效状态下的活动，不允许修改活动代码-->
          <el-input size="mini" :readonly="status === 'enable'" :maxlength="50" v-model="activity.actyCode"></el-input>
          <div class="warning-info" v-show="formErr && !activity.actyCode">请填写活动代码</div>
          <div class="warning-info" v-if="status === 'enable'">活动已生效，不允许修改活动代码</div>
        </div>
      </div>
      <div class="col">
        <div class="label required">活动名称</div>
        <div>
          <el-input size="mini" :maxlength="50" v-model="activity.actyName"></el-input>
          <div class="warning-info" v-show="formErr && !activity.actyName">请填写活动名称</div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="label required">活动开始日期</div>
        <div>
          <el-date-picker
            style="width: 180px"
            size="mini"
            value-format="yyyy-MM-dd"
            v-model="activity.actyBeginTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
          <div class="warning-info" v-show="formErr && !activity.actyBeginTime">请选择活动开始日期</div>
        </div>
      </div>
      <div class="col">
        <div class="label required">活动结束日期</div>
        <div>
          <el-date-picker
            style="width: 180px"
            size="mini"
            value-format="yyyy-MM-dd"
            v-model="activity.actyFinishTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
          <div class="warning-info" v-show="formErr && !activity.actyFinishTime">请选择活动结束日期</div>
        </div>
      </div>
    </div>
    <div class="">
      <div class="col">
        <div class="label required">活动内容</div>
        <div style="width: 800px;margin-top: 10px">
          <tinymce id="fi" v-model="activity.actyDsp"></tinymce>
<!--          <quill-editor id="fi" @updateContent="updateFi" :content="activity.actyDsp"></quill-editor>-->
<!--          <div class="warning-info" v-show="formErr && !activity.actyDsp">请填写活动内容</div>-->
        </div>
      </div>
    </div>
    <div class="">
      <div class="col">
        <div class="label required">奖励内容</div>
        <div style="width: 800px;margin-top: 10px">
          <tinymce id="se" v-model="activity.actyAwdDsp"></tinymce>
<!--          <div class="warning-info" v-show="formErr && !activity.actyAwdDsp">请填写奖励内容</div>-->
        </div>
      </div>
    </div>
    <div class="row" style="margin-top: 10px">
      <div class="col">
        <div class="label">到期提前提醒</div>
        <el-input-number
          v-model="activity.actyExpiredRemindDays"
          @change="numChange" :min="7"></el-input-number>天
        <div v-show="formErr && !activity.actyExpiredRemindDays">请填写到期提前提醒天数</div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="label required">活动大图</div>
        <div>
          <div style="width: 60px;height: 60px;border: 1px solid #ccc;text-align: center">
            <label>
              <input type="file" accept="image/*" ref="bg" style="display: none" @change="choiceImg($event, 1)">
              <img v-if="imgUrl" style="width: 50px;height: 50px;" :src="imgUrl" alt="">
              <i v-if="!imgUrl" style="font-size: 40px;color: #ccc" class="el-icon-upload"></i>
            </label>
          </div>
          <div class="warning-info" v-show="formErr && !imgUrl">请选择图片</div>
        </div>
      </div>
      <div class="col">
        <div class="label required">活动缩略图</div>
        <div>
          <div style="width: 60px;height: 60px;border: 1px solid #ccc;text-align: center">
            <label>
              <input type="file" accept="image/*" ref="sg" style="display: none" @change="choiceImg($event, 0)">
              <img v-if="imgUrl1" style="width: 50px;height: 50px;" :src="imgUrl1" alt="">
              <i v-if="!imgUrl1" style="font-size: 40px;color: #ccc" class="el-icon-upload"></i>
            </label>
          </div>
          <div class="warning-info" v-show="formErr && !imgUrl1">请选择图片</div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="label required">活动链接</div>
        <div>
          <el-input style="width: 600px" size="mini" v-model="activity.actyUrl"></el-input>
          <div class="warning-info" v-show="formErr && !activity.actyUrl">请填写活动链接</div>
        </div>
      </div>
    </div>
    <div class="btns">
      <el-button size="mini" @click="checkRequestParam" type="primary">确定</el-button>
      <el-button size="mini" @click="updateVisible">取消</el-button>
    </div>
  </div>
</template>

<script>
// import QuillEditor from '../../../components/quillEditor.vue'
import Tinymce from '../../../components/tinymce/index.vue'
import { addMarketActivity, updateMarketActivity } from './api.js'
export default {
  name: 'baseInfo',
  props: {
    isCreate: {
      type: [Boolean, Number],
      default: false
    }
  },
  data () {
    return {
      loading: false,
      formErr: false,
      imgUrl: '',
      img: '',
      imgUrl1: '',
      img1: '',
      status: null,
      activity: {
        actyType: '02', // 类型
        actyCode: '', // 活动代码
        actyName: '', // 活动名称
        actyExpiredRemindDays: 4,
        actyBeginTime: '', // 活动开始时间
        actyFinishTime: '', // 活动结束时间
        actyDsp: '', // 活动内容
        actyAwdDsp: '', // 奖励内容
        actyUrl: '' // 活动链接
      }
    }
  },
  components: {
    // QuillEditor,
    Tinymce
  },
  methods: {
    updateVisible () {
      this.$emit('updateVisible')
    },
    numChange () {},
    // 选择图片
    choiceImg (e, type) {
      if (type) {
        this.img = e.target.files[0]
        this.imgUrl = this.getObjectURL(e.target.files[0])
      } else {
        this.img1 = e.target.files[0]
        this.imgUrl1 = this.getObjectURL(e.target.files[0])
      }
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
    updateFi (content) {
      this.activity.actyDsp = content
    },
    updateSe (content) {
      this.activity.actyAwdDsp = content
    },
    // 比较两个日期大小
    compareDate () {
      if (this.activity.actyFinishTime && this.activity.actyBeginTime) {
        let s, e
        s = this.activity.actyBeginTime.replace(/-/g, '')
        e = this.activity.actyFinishTime.replace(/-/g, '')
        if (s - e > 0) {
          this.$message.error('结束日期不能小于开始日期')
          return false
        }
        return true
      }
      return true
    },
    // 请求参数校验
    checkRequestParam () {
      this.formErr = false
      if (!this.compareDate()) {
        return false
      }
      if (this.activity.actyCode &&
        this.activity.actyName &&
        this.activity.actyBeginTime &&
        this.activity.actyFinishTime &&
        // this.activity.actyDsp &&
        // this.activity.actyAwdDsp &&
        this.activity.actyUrl &&
        this.imgUrl &&
        this.imgUrl1) {
        // 校验通过
        this.checkOperateType()
      } else {
        // 检验不通过
        this.formErr = true
      }
    },
    // 判断新增还是编辑
    checkOperateType () {
      if (this.isCreate) {
        // 新增
        delete this.activity.actyId
        this.createActivity()
      } else {
        // 编辑
        this.modifyActivity()
      }
    },
    appendData () {
      let data = new FormData()
      for (let key in this.activity) {
        data.append(key, this.activity[key])
      }
      if (this.img) {
        data.append('actBigPic', this.img)
      }
      if (this.img1) {
        data.append('actSmallPic', this.img1)
      }
      return data
    },
    // 新增活动
    createActivity () {
      const data = this.appendData()
      this.loading = true
      addMarketActivity(data)
        .then(res => {
          this.$message({
            type: 'success',
            message: '新增成功'
          })
          this.loading = false
          this.clearImage()
          const obj = this.callbackDataFormat({ ...res.obj })
          this.$emit('updateList', obj)
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
    },
    // 编辑活动
    modifyActivity () {
      const data = this.appendData()
      this.loading = true
      updateMarketActivity(data)
        .then(res => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.loading = false
          this.clearImage()
          const obj = this.callbackDataFormat({ ...res.obj })
          this.$emit('updateList', obj)
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
    },
    clearImage () {
      this.imgUrl1 = null
      this.imgUrl = null
      this.img = null
      this.img1 = null
      const bg = this.$refs.bg
      const sg = this.$refs.sg
      bg.value = null
      sg.value = null
    },
    // 清除数据
    clearActivity () {
      this.clearImage()
      for (let key in this.activity) {
        this.activity[key] = ''
      }
      this.activity.actyType = '02'
    },
    callbackDataFormat (obj) {
      obj.actyBeginTime = this.activity.actyBeginTime
      obj.actyFinishTime = this.activity.actyFinishTime
      return obj
    }
  }
}
</script>

<style scoped lang="scss">
  .row {
    display: flex;
    justify-content: space-between;
  }
  .col {
    display: flex;
    align-items: center;
    .label {
      box-sizing: border-box;
      width: 120px;
      padding-right: 20px;
      text-align: right;
    }
  }
  .btns {
    text-align: center;
  }
</style>
