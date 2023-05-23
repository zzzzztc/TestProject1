module.exports = {
  outputDir: 'dist',
  productionSourceMap: false,
  chainWebpack: config => { // 移除预加载
    config.plugins.delete('prefetch')
  },
  // 生产或测试
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  devServer: {
    proxy: {
      '/mid_manager': {
        // target: 'https://weapptest.hbhk.com.cn', // 接口域名a
        target: 'http://11.146.209.15:8080', // 接口域名a
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/mid_manager': '/mid_manager'
        }
      },
	    // 隐私协议条款新街口
	    '/file-manager': {
		    target: 'https://weapptest.hbhk.com.cn', // 接口域名a
		    // target: 'http://11.146.209.15:8080', // 接口域名a
		    changeOrigin: true, // 是否跨域
		    pathRewrite: {
			    '^/file-manager': '/file-manager'
		    }
	    },
      '/config_manager': {
        // target: 'https://weapptest.hbhk.com.cn', // 接口域名a，本地调试
        target: 'http://11.146.209.15:8080', // 接口域名a
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/config_manager': '/product'
        }
      },
      '/luckdraw': {
        // target: 'http://47.103.96.186:8480', // 接口域名a
        target: 'http://222.223.232.228:8081', // 接口域名a
	      changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/luckdraw': '/luckdraw'
        }
      },
      '/productservice': {
        // target: 'http://47.103.96.186:8580', // 接口域名a
        target: 'http://11.146.209.15:8080', // 接口域名a
        changeOrigin: true, // 是否跨域ss
        pathRewrite: {
          '^/productservice': '/productservice'
        }
      },
      '/electro-user': {
        // target: 'http://47.103.96.186:8580', // 接口域名a
        target: 'http://222.223.232.228:8081/', // 接口域名a
        changeOrigin: true, // 是否跨域ss
        pathRewrite: {
          '^/electro-user': '/electro-user'
        }
      },
	    '/zuul': {
		    target: 'http://222.223.232.228:8081/', // 接口域名a
		    changeOrigin: true, // 是否跨域ss
		    pathRewrite: {
			    '^/zuul': '/zuul'
		    }
	    },
	    '/hbhk-auth-service': {
		    // target: 'http://222.223.232.228:8081/', // 测试，开发
		    target: 'http://11.146.124.50:8080/', // 生产
		    changeOrigin: true, // 是否跨域ss
		    pathRewrite: {
			    '^/hbhk-auth-service': '/hbhk-auth-service'
		    }
	    }
    },
    port: 8080
  }
}
