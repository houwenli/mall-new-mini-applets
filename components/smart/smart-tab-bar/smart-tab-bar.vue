<template>
  <view
    id="tab-bar"
    class="wsf-tab-bar"
    :class="{ 'grayscale-gray': isGrayscale }"
    :style="{
      '--bgi': tabBarSetting.bgImage ? `url(${tabBarSetting.bgImage})` : 'none',
      '--opacity': tabBarSetting.opacity,
      '--bgc': tabBarSetting.bgColor,
    }"
  >
    <view
      class="wsf-tab-bar-item"
      v-for="(item, index) in tabBarSetting.tabList"
      :key="index"
      @click="switchTab(item, index)"
    >
      <!-- 第一个位置需要特殊处理 -->
      <template v-if="index == 0">
        <!-- 如果第一个tab没选中 -->
        <template v-if="selected != index">
          <image
            class="wsf-tab-bar-image"
            :src="item.defaultIcon"
          ></image>
          <view
            :style="[titleStyle(index)]"
            >{{ item.title }}</view
          >
        </template>
        <!-- 其他情况，需要根据切换向上向下箭头 -->
        <view class="first-select" @click="indexOpe" v-else>
          <image
            class="wsf-tab-bar-image"
            :src="indexTabUp ? item.upIcon : item.downIcon"
          ></image>
        </view>
      </template>
      <template v-else>
        <image
          class="wsf-tab-bar-image"
          v-if="getGifTime && selected == index && item.gifIcon"
          :src="item.gifIcon ? item.gifIcon : item.defaultIcon"
        ></image>
        <image
          class="wsf-tab-bar-image"
          v-else
          :src="selected == index ? item.activeIcon : item.defaultIcon"
        ></image>
        <view
          :style="[titleStyle(index)]"
          >{{ item.title }}</view
        >
      </template>
      
    </view>

    <!-- 预渲染所有的tab图片 -->
    <view v-show="false">
      <image :src="item" v-for="(item, index) in picList" :key="index"></image>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';
import { getUrlParam, getRoute } from '@/common/utils.js';

import { getPageNavigation } from '@/common/smart-api/homeApi';
import { defCfg } from './tabCfg'
export default {
  props: {
    isGrayscale: {
      type: Boolean,
      default: false,
    },
    // 滚动高度
    scrollTop: {
      type: Number,
      default: 0,
    },
    // 预设滚动高度，用与判断滚动多高时触发图片改变
    presetTop: {
      type: Number,
      default: 0,
    }
  },
  data() {
    return {
      // 底部菜单配置
      tabBarSetting: {},
      // 选中菜单
			selected: 0
		};
  },
  computed: {
    ...mapGetters(["getGifTime"]),

    // 预加载所有tab图片，优化tab切换
    picList() {
      let arr = [];
      let tabConfig = this.tabBarSetting || {};
      let tabList = tabConfig.tabList || [];
      tabList.forEach((item) => {
        if (item.activeIcon) arr.push(item.activeIcon);
        if (item.defaultIcon) arr.push(item.defaultIcon);
        if (item.gifIcon) arr.push(item.gifIcon);
        return item;
      });

      return arr;
    },

    // 每个tab文案样式
    titleStyle() {
      return (index) => {
        return {
          color: this.selected === index
            ? this.tabBarSetting.activeColor
            : this.tabBarSetting.color,
        }
      }
    },

    // 判断首页tab按钮是否是向上向下滚动
    indexTabUp() {
      return this.scrollTop >= this.presetTop
    }
  },
	created() {
		this.init()
	},
  methods: {
		// 初始化tabbar
		async init() {
      // 获取tabbar配置
      await this.getTabBar()
      // 获取选中的tabbar
			this.getSelectedBar()
      // 获取tabbar几何属性
      this.getTabBarInfo()
		},
    // 通过接口获取tabbar
    async getTabBar() {
      await getPageNavigation().then(res => {
        this.tabBarSetting = res.data
      }).catch(err => {
        // 出错的时候需要有兜底配置
        this.tabBarSetting = defCfg
      })
    },
		// 获取当前页的链接，判断当前是哪个tabbar选中
		getSelectedBar() {
			let pages = getCurrentPages() || [];
			let curPage = pages[pages.length - 1]; // 当前页面路径
			let curRoute = curPage.route || ''

			let tabConfig = this.tabBarSetting || {};
      let tabList = tabConfig.tabList || [];
			tabList.some((item, index) => {
				// 对原始链接做处理
				let url = item.miniAppLink || item.h5Link;
      	let { path: urlPath } = this.dealUrl(url);
				if (curRoute == urlPath || '/' + curRoute == urlPath) {
					this.selected = index
					return true
				}
			})
		},
    dealUrl(url = "") {
      let urlArr = url.split("?");
      let path = urlArr[0] || "";
      let params = getUrlParam(url);
      return {
        path,
        params,
      };
    },
    switchTab(e, idx) {
      if (idx === this.selected) {
        return;
      }
      // 对原始链接做处理
      let url = e.miniAppLink || e.h5Link;
      let { path: urlPath } = this.dealUrl(url);
      let router = getRoute(urlPath);

      // uni.setStorageSync("wsf_smart_life_tab", "life");

      this.$smart.go(url);
    },
    getTabBarInfo() {
      const query = uni.createSelectorQuery().in(this);
      query.select('#tab-bar').boundingClientRect(data => {
        this.$emit('tabBarInfo', {
          tabbarHeight: data.height
        })
      }).exec();
    },
    indexOpe() {
      // 返回顶部事件
      if (this.indexTabUp) {
        this.$emit('scrollToTop')
      }
      // 锚点事件
      else {
        this.$emit('anchorEl')
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.wsf-tab-bar {
  box-sizing: content-box;
  position: fixed;
  background-color: #fff;
  z-index: 999;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  display: flex;
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 0 -8rpx 40rpx 0 rgba(17, 17, 17, 0.05);
  &::after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-image: var(--bgi);
    background-color: var(--bgc);
    opacity: var(--opacity);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    z-index: -99;
  }
}

.wsf-tab-bar-item {
  flex: 1;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.first-select {
  width: 84rpx;
  height: 84rpx;
  background-color: #ffbe0c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wsf-tab-bar-item .wsf-tab-bar-image {
  display: block;
  width: 42rpx;
  height: 42rpx;
}
.first-select .wsf-tab-bar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.wsf-tab-bar-item view {
  font-size: 22rpx;
  line-height: 30rpx;
  color: #191919;
}
.grayscale-gray {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
}
</style>
