<template>
  <div>
    <el-dialog :title="title" :visible.sync="visible" width="600px">
      <div class="dialog-container" v-loading="loading">
        <div class="dialog-main">
          <div class="row">
            <div class="column">
              <div class="label required">出发地</div>
              <div class="ipt-medium">
                <el-select size="medium" v-model="airLine.arlnDeptAirportCode">
                  <el-option v-for="item in cityList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                </el-select>
                <div class="warning-info" v-show="formErr && !airLine.arlnDeptAirportCode">请选择出发地</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">目的地</div>
              <div class="ipt-medium">
                <el-select size="medium" v-model="airLine.arlnArrivalAirportCode">
                  <el-option v-for="item in cityList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                </el-select>
                <div class="warning-info" v-show="formErr && !airLine.arlnArrivalAirportCode">请选择出发地</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">航班开始日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  style="width: 210px"
                  size="medium"
                  value-format="yyyy-MM-dd"
                  v-model="airLine.arlnFltStartDate"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
                <div class="warning-info" v-show="formErr && !airLine.arlnFltStartDate">请选择航班开始日期</div>
              </div>
            </div>
            <div class="column">
              <div class="label required">航班结束日期</div>
              <div class="ipt-medium">
                <el-date-picker
                  style="width: 210px"
                  size="medium"
                  value-format="yyyy-MM-dd"
                  v-model="airLine.arlnFltEndDate"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
                <div class="warning-info" v-show="formErr && !airLine.arlnFltEndDate">请选择航班结束日期</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column" style="width: 280px">
              <div class="label required">最低价</div>
              <div class="ipt-medium" style="display: flex; align-items: center">
                <div style="width: 210px">
                  <el-input size="medium" v-model="airLine.arlnFltLowestPrice"></el-input>
                </div>
                元(起)
              </div>
              <div class="warning-info" v-show="formErr && !airLine.arlnFltLowestPrice">请设置最低价</div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">航线大图</div>
              <div class="ipt-medium">
                <div style="width: 60px;height: 60px;border: 1px solid #ccc;text-align: center">
                  <label>
                    <input type="file" ref="bg" style="display: none" @change="choiceImg($event, 1)">
                    <img v-if="imgUrl" style="width: 50px;height: 50px;" :src="imgUrl" alt="">
                    <i v-if="!imgUrl" style="font-size: 40px;color: #ccc" class="el-icon-upload"></i>
                  </label>
                </div>
              </div>
              <div class="warning-info" v-show="formErr && !imgUrl">请选择图片</div>
            </div>
            <div class="column">
              <div class="label required">缩略图</div>
              <div class="ipt-medium">
                <div style="width: 60px;height: 60px;border: 1px solid #ccc;text-align: center">
                  <label>
                    <input type="file" accept="image/*" ref="sg" style="display: none" @change="choiceImg($event, 0)">
                    <img v-if="imgUrl1" style="width: 50px;height: 50px;" :src="imgUrl1" alt="">
                    <i v-if="!imgUrl1" style="font-size: 40px;color: #ccc" class="el-icon-upload"></i>
                  </label>
                </div>
              </div>
              <div class="warning-info" v-show="formErr && !imgUrl1">请选择图片</div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="label required">小程序活动图</div>
              <div class="ipt-medium">
                <div style="width: 60px;height: 60px;border: 1px solid #ccc;text-align: center">
                  <label>
                    <input type="file" accept="image/*" ref="mg" style="display: none" @change="choiceImg($event, 2)">
                    <img v-if="miniImgUrl" style="width: 50px;height: 50px;" :src="miniImgUrl" alt="">
                    <i v-if="!miniImgUrl" style="font-size: 40px;color: #ccc" class="el-icon-upload"></i>
                  </label>
                </div>
              </div>
              <div class="warning-info" v-show="formErr && !miniImgUrl">请选择图片</div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <el-button size="medium" type="primary" @click="checkRequestParam">确定</el-button>
          <el-button size="medium" @click="visible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryAirCitiesTree, addMarketActivityAirline, updateMarketActivityAirline } from './api.js'
export default {
  name: 'RouteInfo',
  props: {
    isCreate: {
      type: [Boolean, Number],
      default: false
    },
    id: { // 活动id
      type: String
    }
  },
  data () {
    return {
      title: '',
      loading: false,
      formErr: false,
      cityList: [],
      visible: false,
      img: '',
      imgUrl: '',
      img1: '',
      imgUrl1: '',
      miniImg: '',
      miniImgUrl: '',
      airLine: {
        arlnDeptAirportCode: '', // 出发三字码
        arlnArrivalAirportCode: '', // 到达三字码
        arlnFltLowestPrice: '', // 最低价
        arlnFltStartDate: '', // 开始时间
        arlnFltEndDate: '' // 结束时间
        // arlnDeptCityName: '', // 出发地
        // arlnArrivalCityName: '' // 到达地
      }
    }
  },
  created () {
    this.queryAirCity()
  },
  methods: {
    // 查询城市三字码
    queryAirCity () {
      queryAirCitiesTree()
        .then(res => {
          this.cityList = res.treeList
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    // 选择图片
    choiceImg (e, type) {
      if (type === 1) {
        this.img = e.target.files[0]
        this.imgUrl = this.getObjectURL(e.target.files[0])
      } else if (type === 0) {
        this.img1 = e.target.files[0]
        this.imgUrl1 = this.getObjectURL(e.target.files[0])
      } else if (type === 2) {
        this.miniImg = e.target.files[0]
        this.miniImgUrl = this.getObjectURL(e.target.files[0])
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
    // 比较两个日期大小
    compareDate (s, e) {
      if (s && e) {
        s = s.replace(/-/g, '')
        e = e.replace(/-/g, '')
        if (s - e > 0) {
          this.$message.error('结束日期不能小于开始日期')
          return false
        }
        return true
      }
      return true
    },
    // 表单校验
    checkRequestParam () {
      this.formErr = false
      if (!this.compareDate(this.airLine.arlnFltStartDate, this.airLine.arlnFltEndDate)) {
        return false
      }
      this.checkSameCity()
      if (this.airLine.arlnArrivalAirportCode &&
        this.airLine.arlnArrivalAirportCode &&
        this.airLine.arlnFltStartDate &&
        this.airLine.arlnFltEndDate &&
        this.airLine.arlnFltLowestPrice &&
        this.miniImgUrl &&
        this.imgUrl &&
        this.imgUrl1) {
        this.checkOperateType()
      } else {
        // 校验不通过
        this.formErr = true
      }
    },
    // 判断编辑或是新增
    checkOperateType () {
      if (this.isCreate) {
        // 新增
        delete this.airLine.arlnId
        this.createAirLine()
      } else {
        // 编辑
        this.modifyAirLine()
      }
    },
    // 判断出发到达城市不得一致
    checkSameCity () {
      if (this.airLine.arlnDeptAirportCode &&
        this.airLine.arlnArrivalAirportCode &&
        this.airLine.arlnArrivalAirportCode === this.airLine.arlnDeptAirportCode) {
        this.$message.error('出发到达城市不得相同')
        return false
      }
    },
    // 根据三字码获取城市名
    resolveCity (code) {
      return this.cityList.find(item => {
        return item.id === code
      })
    },
    appendData () {
      const sCity = this.resolveCity(this.airLine.arlnDeptAirportCode)
      const eCity = this.resolveCity(this.airLine.arlnArrivalAirportCode)
      let data = new FormData()
      for (let key in this.airLine) {
        data.append(key, this.airLine[key])
      }
      data.append('actyId', this.id)
      data.append('arlnDeptCityName', sCity.text)
      data.append('arlnArrivalCityName', eCity.text)
      if (this.img) {
        data.append('arlnBigPic', this.img)
      }
      if (this.img1) {
        data.append('arlnSmallPic', this.img1)
      }
      if (this.miniImg) {
        data.append('arlnMiniPic', this.miniImg)
      }
      return data
    },
    // 新增
    createAirLine () {
      const data = this.appendData()
      this.loading = true
      addMarketActivityAirline(data)
        .then(() => {
          this.$message({
            type: 'success',
            message: '新增成功'
          })
          this.loading = false
          this.updateAriLineList()
          this.clearImage()
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
    },
    // 编辑
    modifyAirLine () {
      const data = this.appendData()
      this.loading = true
      updateMarketActivityAirline(data)
        .then(() => {
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
          this.loading = false
          this.updateAriLineList()
          this.clearImage()
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
      this.miniImg = null
      this.miniImgUrl = null
      const bg = this.$refs.bg
      const sg = this.$refs.sg
      const mg = this.$refs.mg
      bg.value = null
      sg.value = null
      mg.value = null
    },
    updateAriLineList () {
      this.visible = false
      this.$emit('updateAriLineList')
    },
    clearAirLine () {
      this.formErr = false
      for (let key in this.airLine) {
        this.airLine[key] = ''
      }
      this.title = '新增航线'
      this.clearImage()
    }
  }
}
</script>

<style scoped>

</style>
