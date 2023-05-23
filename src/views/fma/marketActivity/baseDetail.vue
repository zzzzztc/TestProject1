<template>
  <div class="base-info">
    <div class="row">
      <div class="col">
        <div class="label">活动类型</div>
        <div class="">
          <el-radio :disabled="true" v-model="activity.actyType" label="02">航线推广</el-radio>
          <el-radio :disabled="true" v-model="activity.actyType" label="01">会员拉新</el-radio>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="label required">活动代码</div>
        <div>
          <el-input size="mini" :maxlength="50" :disabled="true" v-model="activity.actyCode"></el-input>
        </div>
      </div>
      <div class="col">
        <div class="label required">活动名称</div>
        <div>
          <el-input size="mini" :maxlength="50" :disabled="true" v-model="activity.actyName"></el-input>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="label required">活动开始日期</div>
        <div>
          <el-date-picker
            :disabled="true"
            style="width: 180px"
            size="mini"
            value-format="yyyy-MM-dd"
            v-model="activity.actyBeginTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
      </div>
      <div class="col">
        <div class="label required">活动结束日期</div>
        <div>
          <el-date-picker
            :disabled="true"
            style="width: 180px"
            size="mini"
            value-format="yyyy-MM-dd"
            v-model="activity.actyFinishTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
      </div>
    </div>
    <div class="">
      <div class="col">
        <div class="label required">活动内容</div>
        <div style="width: 800px;margin-top: 10px">
          <div v-html="activity.actyDsp"></div>
        </div>
      </div>
    </div>
    <div class="">
      <div class="col">
        <div class="label required">奖励内容</div>
        <div style="width: 800px;margin-top: 10px">
          <div v-html="activity.actyAwdDsp"></div>
        </div>
      </div>
    </div>
    <div class="row" style="margin-top: 10px">
      <div class="col">
        <div class="label">到期提前提醒</div>
        <div>{{ activity.actyExpiredRemindDays }}天</div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="label required">活动大图</div>
        <img :src="activity.actBigPicUrl" alt="">
      </div>
      <div class="col">
        <div class="label required">活动缩略图</div>
        <img :src="activity.actSmallPicUrl" alt="">
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="label required">活动链接</div>
        <div>
          <el-input style="width: 600px" size="mini" :disabled="true" v-model="activity.actyUrl"></el-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseDetail',
  props: {
    activity: {
      type: Object,
      default: () => ({})
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
