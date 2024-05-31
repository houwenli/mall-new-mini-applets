<template>
	<view class="wsf-components-radio-group">
		<template v-for="(item, index) in radioList">
			<view class="wsf-components-radio-item" :class="{'wsf-components-radio-active': selected == item.value}" :key="index" @click="selectRadio(index)">{{ item.label }}</view>
		</template>
	</view>
</template>

<script>
export default {
	props: {
		value: {
			type: [String, Number]
		},
		options: {
			type: Array
		},
		height: {
			type: [String, Number],
			default: 60
		},
		width: {
			type: [String, Number]
		}
	},
	data() {
		return {
			selected: this.value,
			radioList: this.options
		};
	},
	methods: {
		selectRadio(idx) {
			this.selected = this.radioList[idx].value
			this.$emit('input',this.selected)
			this.$emit('change',this.selected)
		}
	}
};
</script>

<style lang="scss" scoped>
	.wsf-components-radio-group {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.wsf-components-radio-item {
		margin-right: 20rpx;
		padding: 0 30rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 30rpx;
		color: #000000;
		background-color: #F2F2F2;
		box-sizing: border-box;
		border: 2rpx solid #F2F2F2;
		font-size: 24rpx;
	}
	.wsf-components-radio-active {
		border: 2rpx solid #E60113;
		color: #E60113;
		background-color: #fff;
	}
</style>
