<template>
		<view class="btn" :style="{background:disabled?'#FBD2D5':'#E60113'}" @click="btnFun">
			<slot></slot>
		</view>
</template>

<script>
	export default {
		props:{
			disabled:{
				type:Boolean,
				default: false,
				required: false,
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			btnFun() {
				if(this.disabled) return
				this.$emit('click')
			}
		},
	}
</script>

<style lang="scss">
.btn {
	width: 100%;
	height: 90rpx;
	line-height: 90rpx;
	background: #E60113;
	border-radius: 90rpx;
	font-size: 32rpx;
	font-weight: 400;
	color: #FFFFFF;
	text-align: center;
}
</style>
