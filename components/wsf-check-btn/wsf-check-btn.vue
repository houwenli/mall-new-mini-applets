<template>
	<view class="wsf-check-btn" :class="{ active: isChecked }" @click="checked">
		<image style="height: 100%;width: 100%;" v-if="isChecked" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/cat_Selected%402x.png" mode=""></image>
	</view>
</template>

<script>
export default {
	props: ['value'],
	data() {
		return {
			isChecked: false
		};
	},
	created() {
		console.log(this.value);
		this.isChecked = this.value;
	},
	methods: {
		checked() {
			this.isChecked = !this.isChecked;
			this.$emit('checked', this.isChecked);
			this.$emit('input',this.isChecked)
		}
	}
};
</script>

<style lang="scss" scoped>
.wsf-check-btn {
	height: 36rpx;
	width: 36rpx;
	box-sizing: border-box;
	border: 4rpx solid #d9d9d9;
	border-radius: 18rpx;
}
.active {
	border: none;
}
</style>
