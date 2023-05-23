module.exports = {
  locales: {
    '/': {
      lang: 'zh-CN',
      title: '河北航管理系统',
      description: '河北航管理系统前端文档'
    }
  },
  head: [
    ['link', {}]
  ],
  themeConfig: {
    editLinks: false,
    locales: {
      '/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在Github上编辑此页',
        lastUpdated: '上次更新',
        nav: [
          {
            text: '基础',
            link: '/md/guide/'
          },
          {
            text: 'API',
            link: '/md/API/'
          },
          {
            text: '状态管理',
            link: '/md/store/'
          },
          {
            text: '样式',
            link: '/md/style/'
          },
          {
            text: '路由',
            link: '/md/router/'
          },
          {
            text: '过滤器',
            link: '/md/filter/'
          },
          {
            text: '备注',
            link: '/md/remarks/'
          },
          {
            text: '组件',
            link: '/md/component/'
          }
        ],
        sidebar: {
          '/md/API/': [
            {
              title: '基础API',
              collapsable: false,
              children: [
                '',
                'export',
                'request'
              ]
            }
          ],
          '/md/store/': [
            {
              title: '状态管理',
              collapsable: false,
              children: [
                '',
                'app',
                'tags-view'
              ]
            }
          ],
          '/md/style/': [
            {
              title: '样式模块',
              collapsable: false,
              children: [
                '',
                'mixin',
                'variable'
              ]
            }
          ]
        }
      }
    }
  }
}