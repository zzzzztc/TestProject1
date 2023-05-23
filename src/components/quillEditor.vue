<template>
  <div>
    <div class="edit-container">
      <div class="text-right pb-5" v-if="isCode">
        <el-switch
          v-model="isCode"
          active-text="源码"
          @change="switchIsCode"
          inactive-text="编辑">
        </el-switch>
<!--        <el-button size="mini" @click="switchIsCode" v-if="!isCode">源码</el-button>-->
<!--        <el-button size="mini" @click="switchIsCode" v-if="isCode">编辑</el-button>-->
      </div>
      <div v-if="!isCode" :id="id" style="text-align: left"></div>
      <div v-if="isCode">
        <el-input type="textarea" :rows="15" v-model="sourceCode"></el-input>
      </div>
    </div>
  </div>
</template>
<script>
import E from 'wangeditor'
export default {
  data () {
    return {
      isCode: false,
      editor: {},
      editorContent: '',
      editorOption: {},
      sourceCode: ''
    }
  },
  props: {
    id: {
      type: String,
      default: 'editorElem'
    },
    content: {
      type: String,
      default: `<p>在此输入内容</p>`
    }
  },
  created () {
  },
  mounted () {
    this.editor = new E('#' + this.id)
    // this.editor.customConfig.menus = [
    //   'head',
    //   'bold',
    //   'italic',
    //   'underline',
    //   '源码'
    // ]
    this.editor.customConfig.onchange = (html) => {
      // console.log(html)
      this.editorContent = html
      this.$emit('updateContent', html)
    }
    this.editor.create()
  },
  methods: {
    switchIsCode () {
      if (this.isCode) {
        this.sourceCode = this.editorContent
      } else {
        this.editor.txt.html(this.sourceCode)
        this.editorContent = this.sourceCode
        this.$emit('updateContent', this.sourceCode)
      }
    }
  },
  watch: {
    content: function (n) {
      this.editorContent = n
      this.editor.txt.html(n)
    }
  }
}
</script>
<style lang="scss" scoped>
  .edit-container {
  }
</style>
