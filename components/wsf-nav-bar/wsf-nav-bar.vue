<template>
	<view class="">
		<view id="wsf-nav" :class="{ 'wsf-wrap': true, 'wsf-navbar-fixed': fixed }" :style="[style]">
			<!-- 状态栏 -->
			<view :style="{ height: `${statusBarHeight}px` }" class="wsf-status-bar" ></view>
			<!-- 导航栏 -->
			<!--  background: `linear-gradient(180deg, #6F0FD6 0%, #9905ED 100%)`-->
			<view>
				<view class="wsf-nav-bar" :style="{ width: `calc(100% - ${navigationRightWidth}px)` }" >
					<template v-if="!$slots.default"  >
						<view v-if="hasBack" class="wsf-nav-title-icon" @click="clickBack">
							<image style="height: 20px;width: 20px;" :src="white" mode="" v-if="backIconType == 'white'"></image>
							<image style="height: 20px;width: 20px;" :src="grey" mode="" v-else-if="backIconType == 'grey'"></image>
							<image style="height: 24px;width: 24px;" :src="smart" mode="" v-else-if="backIconType == 'smart'"></image>
							<image style="height: 20px;width: 20px;" :src="grey" mode="" v-else></image>
						</view>
						<view class="wsf-nav-title" :style="{ left: `calc(50% + ${navigationRightWidth / 2}px)` }">
							<text v-if="title">{{ title }}</text>
							<image v-else-if="image" :src="image.url" :style="{width:image.width,height:image.height}"></image>
							<slot name="custom-title"></slot>
						</view>
					</template>

					<view class="wsf-nav-title" v-else :style="{ left: `calc(50% + ${navigationRightWidth / 2}px)` }"><slot name="title"></slot></view>
					<!-- 首页头部搜索框插槽 -->
					<slot name="searchBar" />
				</view>
			</view>

			<!-- 附加内容栏 -->
			<slot name="additional"></slot>
		</view>
		<!-- 占位区 -->
		<view v-if="placeholder" class="wsf-nav-placeholder" :style="{ height: `${statusBarHeight + 44 + additionalHeight}px` }"></view>
	</view>
</template>

<script>

export default {
	props: {
		bgColor: {
			type: String,
			default: '#fff'
		},
		bgimg:{
			type: String,
		},
		bgSize:{
			type: String,
			default: '100% 100%'
		},
		bgOpacity:{
			type: [String,Number],
			default: 1
		},
		color: {
			type: String,
			default: '#000'
		},
		title: {
			type: String
		},
		backIconType: {
			type: String,
			default: 'grey'
		},
		image: {
			type: Object
		},
		fixed: {
			type: [Boolean, String],
			default: false
		},
		placeholder: {
			type: [Boolean, String],
			default: false
		},
		hasBack: {
			type: [Boolean, String],
			default: false
		},
		additionalHeight: {
			type: Number,
			default: 0
		},
		bgPosition: {
			type: String,
			default: 'inherit'
		}
	},
	data() {
		return {
			grey: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/back%402x.png',
			white: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/back_white%402x.png',
			smart: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_arrow_back.png',
			statusBarHeight: getApp().globalData.statusBarHeight, // 当前手机顶部状态栏高度,单位px
			capsule: getApp().globalData.capsule, // 右上角胶囊的位置信息，宽高以及相对圆点的四个坐标，单位px
			navigationRightWidth: getApp().globalData.navigationRightWidth, // 胶囊宽度加上两倍胶囊距离右边的距离
			capsuleToRight: getApp().globalData.capsuleToRight // 胶囊距离右边的距离
		};
	},
	computed: {
		style() {
			let background = this.bgimg ? `url(${this.bgimg}) no-repeat` : this.bgColor ? this.bgColor : '#fff'
			return {
				background,
				backgroundSize: this.bgSize,
				backgroundPosition: this.bgPosition,
				opacity: this.bgOpacity,
			}
		}
	},
	onReady() {
    const query = uni.createSelectorQuery().in(this);
    query.select('#wsf-nav').boundingClientRect(data => {
			this.$emit("getNavHeight", data.height)
    }).exec();
  },
	methods: {
		clickBack(e) {
			this.$emit('onBackBtnClick',e)
		}
	}
};
</script>

<style lang="scss">
.wsf-wrap {
	width: 750rpx;
	/* height: 20px; */
	/* height: var(--status-bar-height); */
	transition: all 1s;
	background-position: top center;
	z-index: 3;
	position: relative;
}
/* 是否为固定布局 */
.wsf-navbar-fixed {
	position: fixed;
	z-index: 998;
	top: 0;
	right: 0;
	left: 0;
}
.wsf-nav-bar {
	// width: 750rpx;
	height: 44px;
	line-height: 44px;
	font-size: 16px;
	text-align: center;
	position: relative;
}
.wsf-nav-placeholder {
	background-color: transparent;
	width: 750rpx;
	position: relative;
}
.wsf-nav-title {
	position: absolute;
	top: 50%;
	transform: translate(-50%, -50%);
	white-space: nowrap;
	display: flex;
	justify-content: center;
	align-items: center;

}
.wsf-nav-title-icon {
		position:absolute;
		left: 0;
		top: 0;
		height: 44px;
		padding: 10px 12px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
