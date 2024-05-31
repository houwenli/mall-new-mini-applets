<template>
	<view class="quickily-share-btn" @click.stop="handleShare()">
		<slot name="shareBtn"></slot>
		<wsf-confirm v-model="showConfirm" :title="confirmContext" 
			activeText="确认"
			cancelText="取消"
			@confirm="activeConfirm"
			@cancel="activeCancel"></wsf-confirm>
	</view>
</template>
<script>
	import wsfConfirm from '@/components/wsf-confirm/wsf-confirm.vue'
export default {
	components: {
		wsfConfirm,
	},
	props: {
		spuId: {
			type: [String, Number],
			default: ''
		},
		skuId: {
			type: [String, Number],
			default: ''
		},
		type: {
			type: [String, Number],
			default: 2
		},
	},
	data() {
		return {
			returnFun: false,
			showConfirm: false,
			confirmContext: '提示',
			distributionCode: ''
		};
	},
	methods: {
		//关闭弹窗
		activeCancel() {
			this.showConfirm = false
			this.returnFun = true
		},
		activeConfirm() {
			this.activeCancel()
			this.$wsf.go('distributionSpuShare', { id: this.skuId });
		},
		//返回上一页
		backLastPage() {
			let pages = getCurrentPages();
			let prevPage = pages[pages.length - 2]; //上一个页面

			uni.navigateBack({
				//uni.navigateTo跳转的返回，默认1为返回上一级
				delta: 1
			});
		},
		handleShare() {
			if(this.returnFun) {
				this.returnFun = false
				return
			}
			let data = {
				spuId: this.spuId
			};
			this.$u.api.shareForDistribution(data).then(res => {
				if(res.code == 200) {
					if (res.data.code == 200) {
						this.distributionCode = res.data.data;
						this.$wsf.go('distributionSpuShare', { id: this.skuId, distributionCode: this.distributionCode, type: this.type });
					} else if( res.data.code == 4111) {
						this.confirmContext = res.data.description;
						this.showConfirm = true;
					} else {
						this.$u.toast(res.data.description)
					} 
				}
			
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.quickily-share-btn {
	display: inline-block;
}
</style>
