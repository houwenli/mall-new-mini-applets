<template>
	<view class="applet-search-wrap">
		<view class="applet-search-bar">
			<u-search
				:placeholder="giftType==='gift'?'在结果中搜索商品':'请输入搜索关键字'"
				v-model="queryString"
				:clearabled="true"
				bg-color="#EDEDED"
				placeholder-color="#9D9D9D"
				color="#000000"
				search-icon-color="#9D9D9D"
				focus="true"
				@search="search"
				@custom="search"
				
			></u-search>
		</view>
		<view class="applet-search-history" >
			<view class="applet-search-history-header">
				<view class="applet-search-history-header-title">搜索历史</view>
				<view class="applet-search-history-header-delete-btn" @click="resetHistory">
					<image style="height: 100%;width: 100%;" src="@/static/img/delete.png"></image>
				</view>
			</view>
			<view class="applet-search-history-list">
				<view class="noData" v-if="searchHistoryList.length == 0">
					<text style="font-size: 25rpx;">无搜索历史</text>
				</view>
				<template v-for="(item, index) in searchHistoryList">
					<view :key="index" class="applet-search-history-list-item overLine" @click="toSpuList(item)">{{ item }}</view>
				</template>
				<view v-if="allsearchRecords.length > 8" class="applet-search-history-list-showmore-btn" @click="toggle">
					<image v-if="showmore" style="height: 100%;width: 100%;" src="@/static/img/up.png"></image>
					<image v-else style="height: 100%;width: 100%;" src="@/static/img/down.png"></image>
				</view>
			</view>
		</view>
		
		<!-- 确认删除模块 -->
		<wsf-confirm
			v-model="showConfirm"
			:title="confirmInfo.title"
			:activeText="confirmInfo.activeText"
			:cancelText="confirmInfo.cancelText"
			@confirm="activeConfirm"
		></wsf-confirm>
	</view>
</template>

<script>
export default {
	data() {
		return {
			giftType:'',
			queryString: '', // 搜索关键词
			searchHistoryList: [],
			showmore: false, // 是否展示更多数据
			allsearchRecords: [],
			searchType: 0,
			storeId: -1 ,// 是否搜索店铺
			
			showConfirm: false,
			confirmInfo: {
				type: '',
				title: '',
				activeText: '',
				cancelText: ''
			},
		};
	},
	onLoad(options) {
		// 判断跳转方式 0 为关闭当前页跳转  1 为修改上一页参数后返回
		this.searchType = options.type || 0
		this.storeId = options.storeId || -1
		this.queryString = options.searchValue || ''

		this.giftType = options.giftType
	},
	onShow() {
		this.loadSearchRecords();
		console.log("搜索历史1",this.searchHistoryList)
	},
	methods: {
		// 清空搜索历史
		resetHistory() {
			if (this.searchHistoryList.length > 0) {
				this.confirmInfo.title = '确认删除搜索历史？';
				this.confirmInfo.activeText = '确认';
				this.confirmInfo.cancelText = '取消';
				this.showConfirm = true;
			}
		},
		// 弹窗确认
		activeConfirm(){
			this.searchHistoryList = [];
			this.allsearchRecords = [];
			this.showConfirm = false;
			uni.removeStorageSync('searchRecords');
		},
		// 加载本地存储的搜索记录
		loadSearchRecords() {
			let that = this;
			uni.getStorage({
				key: 'searchRecords',
				success: function(res) {
					that.allsearchRecords = JSON.parse(res.data).split(',');
					if (that.allsearchRecords.length > 8 && !that.showmore) {
						that.searchHistoryList = that.allsearchRecords.slice(0, 8);
					} else {
						that.searchHistoryList = that.allsearchRecords;
					}
					that.searchHistoryList =[...new Set(that.searchHistoryList)]
					console.log("搜索历史",that.searchHistoryList)
				},
				fail: function() {
					that.searchHistoryList = [];
				}
			});
		},
		// 切换展示状态
		toggle() {
			this.loadSearchRecords();
			this.showmore = !this.showmore;
		},
		// 存储数据到本地缓存
		setStorage(key, data) {
			if (!data || !data.length) return;
			data = data.join(',');

			// 确保数组序列化识别正确
			uni.setStorageSync(key, JSON.stringify(data));
		},
		// 搜索
		search(val) {
			val = this.$u.trim(val)
			this.queryString = val
			if (this.allsearchRecords.length > 20) {
				this.allsearchRecords = this.allsearchRecords.slice(0, 20);
			}
			if (val) {
				this.allsearchRecords.unshift(val);
				this.setStorage('searchRecords', this.allsearchRecords);
			}
			
			this.toSpuList(val);
		},
		toSpuList(queryString) {
			// this.searchType 0 关闭当前页传递参数跳转  常用于其他页面跳入搜索页
			if (!this.searchType) {
				// Todo 商铺搜索
				this.$wsf.go('SpuList',{queryString,storeId: this.storeId},'redirectTo');
				return
			}
			
			// this.searchType 1 通过更新上一页参数后返回  常用于搜索结果页跳入搜索页,更新搜索关键字后跳回搜索页更新
			
			
			// 返回上一页,并更新上一页的参数
			let pages = getCurrentPages();
			let prevPage = pages[pages.length - 2]; //上一个页面
			prevPage.$vm.searchParams.queryString = queryString
			
			uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
				delta: 1
			});
		}
	}
};
</script>

<style lang="scss">
.applet-search-wrap {
	min-height: 100%;
	background-color: #fff;
	padding: 12rpx 24rpx;
	.applet-search-bar {
		margin-bottom: 40rpx;
	}
	.applet-search-history {
		&-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 72rpx;
			&-title {
				font-size: 32rpx;
				color: #000;
				font-weight: bold;
			}
			&-delete-btn {
				padding: 20rpx 6rpx;
				width: 44rpx;
				height: 72rpx;
			}
		}
		&-list {
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			flex-wrap: wrap;
			padding-top: 6rpx;
			.noData{
				color: #999999;
			}
			&-item {
				height: 56rpx;
				padding: 16rpx 26rpx;
				line-height: 24rpx;
				background-color: #f5f5f5;
				font-size: 24rpx;
				color: #666666;
				margin-right: 12rpx;
				margin-bottom: 16rpx;
				border-radius: 28rpx;
			}
			&-showmore-btn {
				height: 56rpx;
				width: 56rpx;
				border-radius: 50%;
				background-color: #f5f5f5;
				padding: 12rpx;
			}
			.overLine{
				overflow: hidden;
				text-overflow: ellipsis;
				max-width: 100%;
				white-space: nowrap;
			}
		}
	}
}
</style>
