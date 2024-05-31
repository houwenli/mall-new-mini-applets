<template>
	<view class="wsf-tab-bar" :style="{ '--bgi': `url(${distributionWsfLayoutData.imageUrl})`,'--opacity': ((100-distributionWsfLayoutData.opacity)/100)}">
		<template v-for="(item, index) in distributionWsfLayoutData.tabList">
			<view :key="index" class="wsf-tab-bar-item" @click="switchTab(item,index)">
				<image class="wsf-tab-bar-image" :src="selected == index ? item.selectedIconPath : item.iconPath"></image>
				<view>{{ item.title }}</view>
			</view>
		</template>
	</view>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
	props: {
		selected: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			color: "#000",
			selectedColor: "#FF002B",
		};
	},
	computed: {
		distributionWsfLayoutData() {
			return this.$store.getters['SETTINGS/distributionWsfLayout'];
		}
	},
	methods: {
		switchTab(e, idx) {
			if (idx === this.selected) return;
			switch(e.title) {
				case '选品':
				this.$wsf.go('distributionIndex');
				break;
				case '数据':
				this.$wsf.go('distributionData');
				break;
				case '我的':
				this.$wsf.go('distributionMine');
				break;
				default:
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
	&::after {
		content: '';
		display: block;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		background-image: var(--bgi);
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
	font-size: 20rpx;
}
</style>
