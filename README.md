

#	万顺福uniapp小程序

> （只兼容了小程序，不可编译为H5及App）,项目重依赖于小程序的底层API，编译H5会导致报错及功能异常。H5项目单独抽离为独立项目

[TOC]

### 项目介绍

- 使用uniapp开发多端小程序,一次开发,同时打包小程序多个平台,界面统一,功能一致
- 仓库地址为 https://gitlab.wsecar.cn/chenfeng/mall-new-mini-applets.git
- AppId
  - uat环境 / 线上环境 wx46d563038cdd2a08
  - dev环境 / test 环境 wxea6c55b44a247053
- 目前已测试 微信小程序

-----

### 项目依赖

- [uniapp](https://uniapp.dcloud.io/)
- [scss](https://www.sass.hk/)
- [uViewUI@1.8.6 版本](https://v1.uviewui.com/components/changelog.html)

----

### 代码目录结构

- common ----- 公共目录

  - api.js ----- 接口地址列表
  - http.api.js ----- 封装接口列表
  - http.interceptor.js ----- 封装的请求拦截器
  - routerMapping.js ----- 路由地址别名设置列表
  - uploadFile.js ----- 文件上传封装
  - wsf.scss ----- 公用样式文件(例如颜色的变量$wsf-color-red)
  - wsfFilter ----- 注册公用过滤器
  - wsfRouter ----- 公用路由跳转,使用方法在下方介绍

- components ----- 组件目录

  ​	...

- pages ----- 视图目录

  ​	...

- static ----- 静态文件目录

  - img ----- 静态图片目录

- unpackage ----- uniapp编辑结果目录

- uview-ui ----- uview引入目录

- .gitignore ----- 忽略文件

- app.css ----- 公用样式文件

- App.vue ----- vue应用承载文件

- main.js ----- vue应用入口文件

- manifest.json ------应用配置文件

- pages.json ------页面配置文件

- uni.scss ----- uniapp 内置样式变量

-------

### clone 项目地址

```bash
git clone https://gitlab.wsecar.cn/chenfeng/mall-new-mini-applets.git
```

### Hbuild项目插件

- ![image-20200927093545001](/Users/nuc/Library/Application Support/typora-user-images/image-20200927093545001.png)

-------

### 路由属性

index



-----

### 自定义方法

#### 路由跳转

```javascript

<!-- 注意事项: 尽量把页面的数据拉取放置在onShow阶段获取 --!>
<!-- 如果是有跳转的可能,请尽量通过getAppCurrent获取之前页面的data改变后再跳转,否则容易在自定义判断跳转方式时数据不刷新或刷新错误 --!>

this.$wsf.go(sceneName, params,method)
/**
* @param sceneName 要跳转路由的别名,在routerMapping中定义的页面地址别名
* @param params 携带的参数,可以为空,对象的方式传递{id: 1}
* @param method 跳转的方式,可以为空,优先级高于自定义判定,不建议指定,如需要特殊的指定路由操作,建议使用uniapp的内置跳转
*/

```



------

###

### 自定义组件

#### 导航栏

```vue
<template>
	<view class="demo">
    <wsf-nav-bar :placeholder="true" :fixed="true" :status-bar="true" :shadow="false" bgColor="#fff" color="#red">
			<view slot="title" v-if="!showSearchBar" class="nav-search-bar-img"><image style="height: 44rpx;width: 124rpx" src="@/static/img/wsf_icon.png"></image></view>
			<view v-else slot="searchBar">
				<view class="nav-search-bar-wrap">
					<view class="nav-search-bar" @click="navigationTo('Search')">
						<view class="nav-search-form-icon"></view>
						<view class="nav-search-form-value">请输入搜索关键字</view>
					</view>
				</view>
			</view>
		</wsf-nav-bar>
  </view>

</template>


<script>
import wsfNavBar from '@/components/wsf-nav-bar/wsf-nav-bar.vue';
export default {
	components: {
    wsfNavBar
  }
}
</script>
```

##### Attributes

| 参数             | 说明                                        | 类型              | 可选值     | 默认  |
| ---------------- | ------------------------------------------- | ----------------- | ---------- | ----- |
| bgColor          | 背景颜色(包含状态栏颜色)                    | String            | -          | -     |
| color            | 字体颜色(标题栏字体颜色)                    | String            |            |       |
| title            | 头部标题(不适用于slot插槽)                  | String            |            |       |
| image            | 头部图片(与标题二选一)                      | String            |            |       |
| fixed            | 是否固定顶部                                | [Boolean, String] | true/false | false |
| placeholder      | 是否需要占位(常配合固定顶部使用,避免塌陷)   | [Boolean, String] | true/false | false |
| hasBack          | 是否需要返回按钮                            | [Boolean, String] | true/false | false |
| additionalHeight | 附加占位槽高度,用于附加组件时填入占位槽高度 | [String,Number]   | -          | -     |

##### Methods

| 方法名称       | 说明                   |
| -------------- | ---------------------- |
| onBackBtnClick | 当返回按钮被点击时触发 |

##### Slots

| name       | 说明                                                         |
| ---------- | ------------------------------------------------------------ |
| title      | 导航栏自定义框,做标题适配,已隔绝右边胶囊位置                 |
| searchBar  | 导航栏自定义框,做搜索框适配,已隔绝右边胶囊位置               |
| additional | 导航栏底部附加内容,可以实现在导航栏头部加入拓展槽.默认会在导航栏下方 |

-----



####  商品展示组件

```vue
<template>
		<!-- 热销商品模块 -->
		<view class="applet-template-recommend">
			<wsf-goods-list title="热销商品" :list="flowList" :loadStatus="loadStatus" @goodsClick="goodsClick($event)"></wsf-goods-list>
		</view>

</template>


<script>
import wsfGoodsList from '@/components/wsf-goods-list/wsf-goods-list.vue';
export default {
	components: {
		wsfGoodsList
  }
}
</script>
```

##### Attributes

| 参数              | 说明                                     | 类型   | 可选值 | 默认    |
| ----------------- | ---------------------------------------- | ------ | ------ | ------- |
| title             | 标题,不填写则无标题栏                    | String | -      | -       |
| list              | 商品列表                                 | Array  | -      | []      |
| loadStatus        | 底部加载栏状态显示,参照uview查看更多状态 | String | -      | #F3F3F3 |
| loadMoreTextColor | 底部加载栏文字显示颜色                   | String | -      | #999    |

##### Methods

| 方法名称   | 说明                                                         |
| ---------- | ------------------------------------------------------------ |
| goodsClick | 当商品被点击时触发的事件,参数(e)会拿到该item的所有字段       |
| shopsClick | 当店铺被点击时触发的事件,参数(e)会拿到该Item的所有字段,只有在有店铺点击时方可使用 |

-----



#### Confirm确认框组件

```vue
<template>

		<wsf-confirm v-model="showConfirm" context="是否" @confirm="deleteAddress"></wsf-confirm>

</template>


<script>
import wsfGoodsList from '@/components/wsf-goods-list/wsf-goods-list.vue';
import wsfConfirm from '@/components/wsf-confirm/wsf-confirm.vue';
export default {
	components: {
		wsfConfirm
	},
  data() {
		return {
			showConfirm: false
    }
  }
}
</script>
```

##### Attributes

| 参数         | 说明             | 类型    | 可选值            | 默认   |
| ------------ | ---------------- | ------- | ----------------- | ------ |
| v-model      | 控制弹窗出现与否 | Boolean | True/False        | False  |
| title        | 窗体标题         | String  | -                 | -      |
| context      | 窗体内容         | String  | -                 | -      |
| activeText   | 确认按钮文本     | String  | -                 | '确定' |
| cancelText   | 取消按钮文本     | String  | -                 | '取消' |
| contextAlign | 窗体内容文字排序 | String  | Left/Right/Center | Left   |

##### Methods

| 方法名称 | 说明                         |
| -------- | ---------------------------- |
| confirm  | 当点击确定按钮之后执行的函数 |
| cancel   | 当点击取消按钮之后执行的函数 |

##### Slots

| slot名称 | 说明                    |
| -------- | ----------------------- |
| context  | 会替换原有的context内容 |



-----



#### 城市级联选择器

```vue
<template>

	<wsf-city-select v-model="show" @city-change="chooseArea" :defaultRegion="defaultRegion"></wsf-city-select>

</template>


<script>
import wsfGoodsList from '@/components/wsf-goods-list/wsf-goods-list.vue';
import wsfConfirm from '@/components/wsf-confirm/wsf-confirm.vue';
export default {
	components: {
		wsfConfirm
	},
  data() {
		return {
			show: false, // 控制picker显示隐藏
      defaultRegion: ['广东','深圳市','宝安区'], // 默认城市选择
    }
  },
  methods: {
    // 当选择值确定的时候,用户点击取消或者未选择完时不会触发
    chooseArea(e) {
      // e 里面包含城市信息 provice, city, area
    }
}
</script>

```

##### Attributes

| 参数             | 说明                           | 类型           | 可选值     | 默认    | 例子                       |
| ---------------- | ------------------------------ | -------------- | ---------- | ------- | -------------------------- |
| v-model          | 控制弹窗出现与否               | Boolean        | True/False | False   | -                          |
| defaultRegion    | 默认城市名称选择               | Array          | -          | -       | ['广东','深圳市','宝安区'] |
| areaCode(未完成) | 默认城市代码选择               | Array          | -          | -       | [12,1221,1309]             |
| maskCloseAble    | 是否允许通过点击遮罩关闭Picker | Boolean        | True/False | True    | -                          |
| zIndex           | 页面层级                       | String/ Number | -          | 0       | -                          |
| activeColor      | 点击选中的tabs栏颜色           | String         | -          | #E60113 | -                          |

##### Methods

| 方法名称    | 说明                                                    |
| ----------- | ------------------------------------------------------- |
| city-change | 当确认值时触发,用户点击取消或者未选择完时不会触发,形参e |
| cancel      | 当点击取消按钮之后执行的函数                            |

-----

