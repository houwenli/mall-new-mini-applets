<template>
	<view class="wsf-tab-bar" :class="{'grayscale-gray': isGrayscale}" :style="{ '--bgi': getTabBarSetting.bgImage ? `url(${getTabBarSetting.bgImage})` : 'none','--opacity': getTabBarSetting.opacity,'--bgc': getTabBarSetting.bgColor }">
		<view class="wsf-tab-bar-item" @click="switchTab(item,index)" v-for="(item, index) in tabList" :key="index">
			<image class="wsf-tab-bar-image" v-if="getGifTime && selected == index && item.gifIcon" :src="item.gifIcon?item.gifIcon:item.defaultIcon"></image>
			<image class="wsf-tab-bar-image" v-else :src="selected == index ? item.activeIcon : item.defaultIcon"></image>
			<view :style="{ color: selected === index ? getTabBarSetting.activeColor : getTabBarSetting.color }">{{ item.title }}</view>
		</view>
    <!-- 预渲染所有的tab图片 -->
    <view v-show='false'>
      <image :src='item' v-for='(item, index) in picList' :key='index'></image>
    </view>
	</view>
</template>

<script>
import { mapGetters } from "vuex";
export default {
	props: {
		selected: {
			type: Number,
			default: 0
		},
		isGrayscale: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {};
	},
	computed: {
		...mapGetters(["getGifTime"]),
		getTabBarSetting() {
			return this.$store.getters['SETTINGS/wsfLayout'];
		},

		// tabData处理一下，去除掉分享购tab，20240104，产品需求：商品下架 非福气值商品 
		tabList() {
			let { tabList = [] } = this.getTabBarSetting || {};
			// tabList = tabList.filter(item => item.title !== '分享购')
			return tabList
		},

    picList() {
      let arr = []
      let tabConfig = this.getTabBarSetting || {}

      let tabList = tabConfig.tabList || []

      tabList.forEach(item => {
        if (item.activeIcon) arr.push(item.activeIcon)

        if (item.defaultIcon) arr.push(item.defaultIcon)

        if (item.gifIcon) arr.push(item.gifIcon)

        return item
      })

      return arr
    }
	},
	methods: {
		switchTab(e, idx) {
			this.$store.dispatch("gifTimeFn", false);

			if (idx === this.selected && e.title != '首页') return;
			let name = e.title;

			switch (name) {
				case '首页':
          // 当前已经在首页 - 再点击一次首页 - 需要重置首页
          this.$emit('change', e)
					this.$wsf.go('Index');
					break;
				case '购物车':
					this.$wsf.go('Cart');
					break;
				case '分享购':
					getApp().globalData.swichDistribution = true
					this.$wsf.go('Distribution');
					break;
				case '我的':
					this.$wsf.go('UserCenter');
					break;
				case '个人中心':
					this.$wsf.go('UserCenter');
					break;
				case '分类':
					this.$wsf.go('Classify');
					break;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.wsf-tab-bar {
	box-sizing: content-box;
	position: fixed;
	background-color: #fff;
	z-index: 9998;
	bottom: 0;
	left: 0;
	right: 0;
	height: 100rpx;
	display: flex;
	padding-bottom: env(safe-area-inset-bottom);
	box-shadow: 0 -8rpx 40rpx 0 rgba(17,17,17,0.05);
	&::after {
		content: '';
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

.wsf-tab-bar-item .wsf-tab-bar-image {
	display: block;
	width: 48rpx;
	height: 48rpx;
}

.wsf-tab-bar-item view {
	font-size: 22rpx;
	line-height: 32rpx;
}
.grayscale-gray {
  -webkit-filter: grayscale(100%);
   filter: grayscale(100%);
}
</style>
