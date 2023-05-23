<template>
  <div class='tinymce'>
    <editor :id='id' v-model='tinymceHtml' :init='init'></editor>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/modern/theme'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/skins/lightgray/skin.min.css'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/textcolor'
export default {
  name: 'tinymce',
  model: {
    prop: 'content',
    event: 'change'
  },
  props: {
    id: {
      type: String,
      required: true
    },
    content: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      updateTimer: null,
      tinymceHtml: 'Please input the content',
      init: {
        language_url: 'https://fastly.jsdelivr.net/gh/wt-sml/wutong_cdn/js/tinymce-lang-zh@5.2.2.js',
	      // language_url: 'https://cdn.jsdelivr.net/gh/wt-sml/wutong_cdn/js/tinymce-lang-zh@5.2.2.js',

        language: 'zh_CN',
        skin_url: '/static/tinymce/skins/lightgray',
        height: 300,
        plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',
        toolbar:
          'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
        branding: false
      }
    }
  },
  mounted () {
    tinymce.init({})
  },
  watch: {
    content: {
      handler: function (n) {
        if (n !== this.tinymceHtml) {
          this.tinymceHtml = n
        }
      },
      immediate: true
    },
    tinymceHtml (value = '') {
      if (value !== this.content) {
        this.updateTimer && clearTimeout(this.updateTimer)
        this.updateTimer = setTimeout(() => {
          this.$emit('change', value)
        }, 500)
      }
    }
  },
  components: { Editor },
  beforeDestroy () {
    this.updateTimer && clearTimeout(this.updateTimer)
  }
}
</script>
<style scoped lang="scss">
.tinymce {
  width: 700px;
}
</style>
