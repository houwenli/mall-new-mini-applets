<template>
	<view>
		<u-index-list :scrollTop="scrollTop">
			<view  v-for="(item, index) in indexList" :key="index" >
				<u-index-anchor :index="index" />
				<view class="list-cell" v-for="(n,i) in item" :key="i" @click="chooseLogisticsCompany(n)">{{n}}</view>
			</view>
		</u-index-list>
	</view>
</template>

<script>
export default {
	data() {
		return {
			scrollTop: 0,
			indexList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
		};
	},
	onLoad() {
		this.loadPageData()
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	methods: {
		loadPageData() {
			this.$u.api.queryAllLogisCompanyName().then(res => {
				this.indexList = res.data
			})
		},
		chooseLogisticsCompany(name) {
			// 返回上一页,并更新上一页的参数
			let pages = getCurrentPages();
			let prevPage = pages[pages.length - 2]; //上一个页面
			prevPage.$vm.logisticsCompanyName = name
			
			uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
				delta: 1
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.list-cell {
	display: flex;
	box-sizing: border-box;
	width: 100%;
	padding: 10px 24rpx;
	overflow: hidden;
	color: #323233;
	font-size: 14px;
	line-height: 24px;
	background-color: #fff;
}
</style>
