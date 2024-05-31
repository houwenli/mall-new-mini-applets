<template>
	<view class="store-container">
		<view class=" store-header" :class="{ moveDown: showTitle, moveUp: !showTitle }">
			<view class="store-search">
				<view class="search-input" @click="toSearch">
					<i class="search"></i>
					<input type="text" disabled="true" />
				</view>
				<i class="more" @click="showTab"></i>
				<view class="mui-global-nav" v-if="isShow">
					<view class="mui-global-nav-arr"></view>
					<view class="ul">
						<view @click="toIndex" class="li"><view class="li_a mui-global-nav-tab-home">首页</view></view>
						<view @click="toStoreIndex" class="li"><view class="li_a mui-global-nav-tab-shop">店铺首页</view></view>
						<view @click="toStoreCategory" class="li"><view class="li_a mui-global-nav-tab-class">店铺分类</view></view>
						<view @click="allSpu" class="li"><view class="li_a mui-global-nav-tab-goods">全部商品</view></view>
						<!-- <button open-type="contact" class="li" session-from="weapp"><view class="li_a mui-global-nav-tab-service">联系客服</view></button> -->
						<button @click="serviceTel" class="li"><view class="li_a mui-global-nav-tab-service">联系客服</view></button>
					</view>
				</view>
			</view>
			<view class="store-title">
				<view class="store-info">
					<view class="avatar"><image :src="storeInfo.avatarPicture || shopImg"></image></view>
					<view class="name">
						<view class="store-name u-line-2">{{ storeInfo.storeName }}</view>
						<view class="tag-part">
							<!-- <span class="tag store-type">万顺福自营</span> -->
							<span class="tag">综合体验</span>
							<u-rate size="20" :current="starNum" :disabled="true" style="margin-right: 16rpx;"></u-rate>
							<span class="tag">{{storeInfo.followNum?storeInfo.followNum + 10000: 10000}}人关注</span>
						</view>
					</view>
				</view>
				<view class="store-like" :class="{ 'is-attention': storeInfo.hasAttention, 'no-attention': !storeInfo.hasAttention }" @click="attentionStore">
					<i v-if="!storeInfo.hasAttention" class="mark"></i>
					<span>{{ storeInfo.hasAttention ? '已' : '' }}关注</span>
				</view>
			</view>
		</view>

		<view class="shop-category-container">
				<view class="shop-category-group" v-for="(item, index) in categories" :key="index">
					<view class="cell_item" @click="goFun(item)">
						<text>{{item.name}}</text>
						<u-icon name="arrow-right"></u-icon>
					</view>
					<view class="shop-category-sub-group">
            <view  v-for="(subItem, subIndex) in item.childCateGory" :key='subIndex' class="shop-category-sub-cell" @click="goFun(subItem)">{{subItem.name}}</view>
					</view>
				</view>
		</view>
	</view>
</template>

<script>
import wsfGoodsList from '@/components/wsf-goods-list/wsf-goods-list.vue';
export default {
	components: {
		wsfGoodsList
	},
	data() {
		return {
			starNum:5,
			shopImg: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/shop_icon%402x.png',
			flowList: [], // 瀑布流商品列表
			loadStatus: 'loadmore', // 加载更多样式效果
			isLoading: false, // 是否正在加载
			hasMore: true, // 是否拥有更多
			queryForm: {
				storeId: '',
				pageNum: 0, // 当前页码
				pageSize: 10, // 每页显示记录数
				onlyQueryNewSpu: 0 //是否只查新品
			},
			requestData: false,
			query: null,
			documentScrollTop: 0,
			storeId: '',
			storeName: '',
			isShow: false,
			storeInfo: {},
			showTitle: false,
			categories: []
		};
	},
	onLoad(option) {
		this.storeName = option.storeName;
		this.storeId = option.storeId;
		this.queryForm.storeId = option.storeId;
		uni.setNavigationBarTitle({
			title: option.storeName
		});
	},
	onShow() {
		this.queryStoreCategories();
		this.queryStoreInfo();
	},
	onPageScroll(e) {
		let that = this;
		let scrollTop = e.scrollTop;
		let showTitle = false;
		if (scrollTop > 120) {
			if (scrollTop > that.documentScrollTop) {
				showTitle = true;
			} else {
				showTitle = false;
			}
		} else {
			showTitle = false;
		}
		if (showTitle != that.showTitle) {
			this.showTitle = showTitle;
		}

		this.documentScrollTop = scrollTop;
	},
	//滚动到底部触发事件
	onReachBottom() {
		this.shopListData();
	},
	methods: {
		navigateTo(sceneName, params) {
			// this.$wsf.go('Login')
			this.$wsf.go(sceneName, params);
		},
		showToastError(errMsg, duration = 1500) {
			uni.showToast({
				title: errMsg,
				icon: 'none',
				mask: true,
				duration: duration
			});
		},
		toSearch() {
			this.navigateTo('Search', {
				storeId: this.storeInfo.id,
				from: 'storeIndex',
				storeInfo: {
					storeName: this.storeInfo.storeName,
					followNum: this.storeInfo.followNum,
					aveScore: this.storeInfo.aveScore,
					id: this.storeInfo.id
				}
			});
		},
		queryStoreInfo() {
			let that = this;
			let data = {
				storeId: this.storeId
			};
			this.$u.api.StoreInfo(data).then(res => {
				this.storeInfo = res.data;
			});
		},
		showTab() {
			this.isShow = !this.isShow;
			console.log(this.isShow, 'this.isHide');
		},
		//关注/取关店铺
		attentionStore() {
			// if (!app.globalData.isLink) {
			// 	this.navigateTo('QuickLogin');
			// 	return;
			// }
			if (this.storeInfo.hasAttention) {
				let data = {
					storeId: this.storeId
				};
				this.$u.api.CancelStoreAttention(data).then(res => {
					if (res.code == 200) {
						this.storeInfo.hasAttention = 0;
						this.showToastError('取关成功');
					}
				});
			} else {
				let data = {
					storeId: this.storeId
				};
				this.$u.api.AddStoreAttention(data).then(res => {
					if (res.code == 200) {
						this.storeInfo.hasAttention = 1;
						this.showToastError('关注成功');
					}
				});
			}
		},
		toIndex: () => {
			uni.switchTab({
				url: '/pages/index/index'
			});
		},
		//进入店铺
		toStoreIndex() {
			this.navigateTo('StoreIndex', {
				storeName: this.storeInfo.storeName,
				storeId: this.storeInfo.id
			});
		},
		//进入店铺分类
		toStoreCategory() {
			this.navigateTo('StoreCategory', {
				storeName: this.storeInfo.storeName,
				followNum: this.storeInfo.followNum,
				aveScore: this.storeInfo.aveScore,
				storeId: this.storeInfo.id
			});
		},
		// 进入店铺全部商品
		allSpu() {
			this.navigateTo('SpuList', {
				storeId: this.storeInfo.id,
				from: 'storeIndex',
				storeInfo: {
					storeName: this.storeInfo.storeName,
					followNum: this.storeInfo.followNum,
					aveScore: this.storeInfo.aveScore,
					id: this.storeInfo.id
				}
			});
		},
		// 切换分类
		changeTab(id) {
			this.tabIndex = id;
			this.queryForm.pageNum = 0;
			this.queryForm.onlyQueryNewSpu = id;
			this.hasMore = true;
			this.flowList = [];
			this.$refs.goodslist.clearList();
			this.shopListData();
		},
		goFun(item){
			console.log(item,"******");
			this.$wsf.go('SpuList',{storeId:item.storeId,storeCateId:item.id})
		},

		goodsClick(e) {
			let param = e.id
			if (!param) {
				this.showToastError('缺少参数');
			}
			this.navigateTo('SkuDetail', { skuId: param });
		},

		queryStoreCategories() {
			let that = this;
			this.$u.api.StoreCategory({ storeId: this.storeId }).then(res => {
				this.categories = res.data;
			});
		},
	}
};
</script>

<style scoped lang="scss">
@keyframes moveDown {
	from {
		transform: translate3d(0, 0, 0);
	}

	to {
		transform: translate3d(0, -125px, 0);
	}
}

@keyframes moveUp {
	from {
		transform: translate3d(0, -125px, 0);
	}

	to {
		transform: translate3d(0, 0, 0);
	}
}

.clearfix:after {
	content: '';
	display: block;
	clear: both;
}

.store-container {
	background: #f5f5f5;
	height: 100%;
	padding-top: 272rpx;
	.moveDown {
		transform: translate3d(0, -125px, 0);
		animation: moveDown 0.5s;
	}
	.moveUp {
		transform: translate3d(0, 0, 0);
		animation: moveUp 0.5s;
	}
	.store-header {
		box-sizing: border-box;
		padding: 0 12px;
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: #fff;
		z-index: 999;
	}
	.store-search {
		height: 44px;
		display: inline-flex;
		align-items: center;
		width: 100%;
		i {
			width: 24px;
			height: 24px;
			display: inline-block;
			background-size: 100%;
			&.more {
				background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABD0lEQVRoQ+2VsQ3CMBREL03IElDBErSsQZEqK1ASSlb4lQvWoGUJqGAJcIWQqBLjCJ1wSHRpo/vxvefYGQb+ZANfP1Sgb4MyIAMkAW0hEiAdlwEaITlABkiAdFwGaITkABkgAdJxGaARkgPGaaAsyyLP8w2ANYApgBuAg/d+75y7d0FLmW8ZeH/8CGAZWOjJe7+KlUidbxWoqmoLoI5Qrs1s9+l96nyowBnAPFLgYmaLSIGk+VCB1x6fRAo8zKyIFEiaH6WBYf8DqU+R5lb89vvBi6xxjs8AXIl74Kf5cd7EXTftP72Xgb5tyIAMkAS0hUiAdFwGaITkABkgAdJxGaARkgNkgARIx2WARkgOeAI4rr0xIlMv6AAAAABJRU5ErkJggg==');
			}
			&.search {
				margin-top: 2px;
				margin-right: 6px;
				background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADmUlEQVRoQ+2YT0gUURjAv2+WShejQfsDWWDQoQ7VQS/ZKZyZTcpEiI2gS1CnLOraH5roz7VQOxV0CaIlELWwnR3x1NLBLnXIg5BgBpZuE8nqrs588WRGJlD3vdmxGNo5zeH79/u+977vvYcQ8Q8jHj9UAP51BSsVqFSgzAxUlhBL4MjIyAbLshJEpBFRIwDsBYAtbnJ/AsAYIr5HREOW5XRTU9NCmYlfVi+rAsPDw3KxWLyCiBcBYCtnUNNE9Cifzz/s6OiwOHVWFQsMYJrmKSLqIaIdQYJAxClE7FQU5WUQfU9HGICI0DCMO4h4DeCPQTiBiH2I+BoRP87MzHxnTurq6rYR0QEiOk5E7QCw2xcwEdF9TdNuIiIFARECYMGbpvmciE4vZwBxkoh0y7KeJpNJe60gUqlUTJblc4ioE1G9z8YLRVHOBIEQAkin03cR8bovyP65ubmz7e3tv0Sy19fXt7m6uvoZAJz09IjoXiKRuCFih8lyA7A17zhOyqfTlc1mr+q67og6ZfK6rkvNzc0PAOCyq0+SJCVF9wQXQG9vr1xTUzPq27D92Wy2I2jwHrAL0etVgm3s2dnZfSLdiQsgnU7riHhrqWSIk/l8fr/oslmtSmw5xePxT96eIKLbiURC561qSQA2pHK53Fdfn7+gadoTXgc8coZhnAeAx67sdG1t7U7eYVcSwDTNE47jDLjGJyzL2lOq2/AE7Zdxu9Nnr8VKktSmKMorHjslATKZTBcRXXKXT4+qqkv/YX+ZTKabiDpdP92qqnqbe01XJQEMw3gLAM3MiiRJrYqivAk7eGbPNM1jjuMMurazmqYd4fHDAzAFANuZsVgstqulpWWSx7CozNDQUL1t219cvW+apnEdUXgA5gFgEzNsWdamZDJZFA2ORz6VSm2UZbngyhY0Tavi0fsvACK/hKK9iSPfRiM/yCJ/lGCtLNKHOQbALu+Li4vRPU67oz66FxpvIq7nlRIAcrZtN7a2to7zTGBPpuQk9htbr0u9z8e4bdtHRSCEAJijsJ9VAOAHANQGhRAG8ByF9bC1sLAwEovFhgGgIQhEYADmjF324/F42U+Lg4ODDStAjBUKhUNtbW35tfZEWQCe4TAed1eCQMTDqqq+W3cAka6xlqwLkXFft0cLhULjX6lAWADMzsDAQLyqqurg/Pz8h1LBM/lQllCYAKK2KgCiGQtbvlKBsDMqaq9SAdGMhS0f+Qr8BnY1QU+lc2uAAAAAAElFTkSuQmCC');
			}
		}
	}
	.search-input {
		padding-left: 10px;
		display: inline-flex;
		align-items: center;
		width: 295px;
		height: 32px;
		background: #ededed;
		border-radius: 16px;
		margin-right: auto;
		overflow: hidden;
		input {
			background: #ededed;
			width: 100%;
		}
	}
	.store-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		/* height: 80px; */
		height: 80px;
		.store-info {
			display: flex;
			align-items: center;
			.avatar {
				vertical-align: middle;
				display: inline-block;
				width: 84rpx;
				height: 84rpx;
				border-radius: 10px;
				border: 1px solid #ddd;
				overflow: hidden;
				image {
					width: 100%;
					height: 100%;
				}
				p {
					font-size: 18px;
					font-weight: bold;
					color: #000;
					line-height: 20px;
				}
			}
			.name {
				margin-left: 10px;
				height: 40px;
				display: inline-block;
				/* vertical-align: top; */
				.store-name {
					font-weight: 500;
					color: #000000;
					line-height: 40rpx;
					max-width: 440rpx;
				}
				.tag-part {
					line-height: 26px;
					display: flex;
					align-items: center;
					.tag {
						display: inline-block;
						margin-right: 4rpx;
						color: #666;
						font-size: 20rpx;
					}
					.store-type {
						vertical-align: middle;
						background: linear-gradient(277deg, #ffedf1 0%, #ed6f42 0%, #e60113 100%);
						border-radius: 2px;
						color: #fff;
						line-height: 12px;
						padding: 1px 2px;
					}
				}
			}
		}
		.store-like {
			width: 62px;
			height: 26px;
			background: #e60113;
			border-radius: 13px;
			font-size: 13px;
			color: #fff;
			text-align: center;
			line-height: 26px;
			.mark {
				vertical-align: middle;
				background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC8klEQVRYR+2WSeiNYRjFf4fMLEwrkYQypAwl05ISYSGKhSFhwYqSeR53WFCIkJBkVpSSxAIJKTJk2BlWkvnR4aX7/3zfvf/Lrf/GU7e+2zud9zznPc8jGjjUwOfzH0BZBiLC40OAUUAX4CvwCDgh6UFp+iKiJzAB6AE0Bp4DF4BrkqIo1YUAImI4sA3on7PYGx4C5gP+3g5MARrlzL0NzJN0NQ9ELoCImAnsBJoAL4AjwP30fzAwGWgFmIVvQC/gPXAUuA58BPqkeZ2Bz8AcSXuzIP4AEBEjgfPpNpuBVZK84e+IiG7AsRJ2fMuJkh5n5jXzemBRAjpa0sXSOXUARIQXPEz5Xi5pXVHuIqIDYFpN+1BJr8rMXQ6sSbroWXqhLIBZwC7gFjConHh8WESY5saS7pTzkyTmG8AAYJakPb/mZwGcAcYA0yTtr6VJRcQ0YB9wVtLYIgAvgU5OgSSLr2YREX7Gz4CXkizMH5FlwGJr6p8kK7dmERHe1/t/kmSt5QJ4A7QDOkp6XbPTf+qlPeA930rydy6AK4ANaJyk0zUGYG1ZY3bGoUUAFgMbgFOSxtcYwElfDKjzvLMa6Ag8BVoCI4rss1pgETECuJzcsmtpevOccAWwOlnvQEkfqj2wdH5EtABuJrteIWlt6XgegOZpQW+/W0kz/hGA3749wLWkv6RPZQF4MCL6JZttDayUZButOiLCTJrRd8CwPMcsV46t2hOpti+VtLEaBBGxDDDdX4Dxks7lra/UkEwHdicQm4Al9agP3nMLsDAdPlPSgSLwFXvCiHDt9wbuDY6nOmFK/4iIaAMcTM/NuZ4qyWW7MCoCSJpwS3YYaAvcS5Q+yai9O+C3bvHaUSdJulQpbfUCkEBkD5guyc5m0dpgrHYDvOveUFIdgH+dgswtTbHTYZd0L+i2zQ3J7FTYyqaoahEW5NmsLQDWp8rpaa5yiyRtrUR5drzeKcgujIi+wNzExA5JNpqq468BVH1SwYL/ABqcge/lyQ8w97nKsAAAAABJRU5ErkJggg==');
				background-size: 100%;
				width: 16px;
				height: 16px;
				display: inline-block;
				margin-top: -2px;
			}
		}
		.is-attention {
			background: #fff;
			border: 1px solid #999;
			color: #999;
		}
		.no-attention {
			background: #e60113;
			color: #fff;
		}
	}
	.store-categories {
		height: 45px;
		padding-left: 22px;
		display: flex;
		align-items: center;
		.categories {
			height: 100%;
			margin-right: 100rpx;
			position: relative;
			font-size: 32rpx;
			color: #000;
			display: inline-block;
			line-height: 90rpx;
			i {
				position: absolute;
				bottom: 6px;
				left: 0;
				width: 32px;
				height: 3px;
				background: #e60113;
				border-radius: 2px;
				overflow: hidden;
				&.active {
					font-weight: bold;
				}
			}
		}
	}

	.shop-category-container {
		padding: 0 20rpx;
		background-color: #f5f5f5;
		.shop-category-group {
			padding:0 24rpx 20rpx;
			background-color: #fff;
			border-radius: 20rpx;
			margin-bottom: 24rpx;
			.cell_item {
				height: 100rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			.shop-category-sub-group {
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex-wrap: wrap;
				.shop-category-sub-cell {
					width: 324rpx;
					height: 90rpx;
					line-height: 90rpx;
					background: #F5F5F5;
					border-radius: 8rpx;
					margin-bottom: 10rpx;
					padding-left: 20rpx;
					font-size: 28rpx;
					font-weight: 400;
					color: #333333;
				}
			}
		}
	}
}

.mui-global-nav {
	display: block;
	width: 130px;
	position: absolute;
	background: rgba(255, 255, 255, 0.95);
	right: 0;
	top: 30px;
	font-size: 14px;
	text-align: left;
	padding-left: 14px;
	z-index: 99999;
	border-radius: 2px;
	border: solid 1px #eee;
}

.mui-global-nav-arr {
	font-size: 10px;
	position: absolute;
	top: -4px;
	right: 12px;
	border-left: 5px solid transparent;
	border-right: 5px solid transparent;
	border-bottom: 4px solid rgba(255, 255, 255, 0.95);
}

.mui-global-nav .li {
	padding: 0;
	line-height: auto;
	color: #333;
	background: none;
	font-size: 14px;
	border: none;
	text-align: left;
}

.mui-global-nav .li::after {
	border: none;
}

.mui-global-nav .li .li_a {
	color: #333;
	line-height: 44px;
	margin-left: 34px;
	padding-right: 14px;
	display: block;
	border-bottom: solid 1px #eee;
	position: relative;
}

.mui-global-nav .li:last-child .li_a {
	border: 0;
}

.mui-global-nav .li .li_a:before {
	position: absolute;
	top: 0;
	left: -34px;
	content: '';
	height: 44px;
	width: 34px;
	display: block;
}

.mui-global-nav-tab-home:before {
	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAACdElEQVRYR+3Y4XXaMBAA4DtpgLBB6QRVpAFCN2gnSNggG5Ru0EyQZIKQCUIHkKJOULoBHeB8fcezeSZBtmwHSl/RP56x/XEn3UkgHPnAI/fB/wE0xoy01pcA8AkARgCwBIC59/5+aIYGR9AYY5RSD4g43oGZE9E0xrjqCx0ELHFPiDhi5h+IOCOipVLKIOI3ADgrI/n54MA6DgDuiei6Him5rrVeCJKZ70II0z7IXhE0xoyVUs8SOQB49N7L3Hs13gLZGVguiCcAMJLWoigmTXNsKLITsCuuCqlzTiL8IJ+ZeRpCuMtNdzawL66CWGuvEPG2KzILOBQ3BJkFdM5JeiRNv4nIxBilEPca9UgS0ccYo6z05GgFWmtvEfGqxMmCiL1ktZucczIHL5l5VRSFIJPPbATuA1dbOFnIJHCfuC7InUBr7QwRv8iDiOj8LdKamhbW2gUiXjDzsigKeddW334F7FsO+s5LqRBKKUF+AIBYLpwNcgt4aFz1o5qQG+DfwqWQ3vtzubYGlv3yuWuV75vW1H0v+vZNCOG6Ak601rIBuPfeS80TtGxAx22FdChS0gsAFzHGx1qwFswcQwiTpjKzRMR33vvWYj4EWRXtVFdJvtw5x/LiHGC5P5QzyWYg4sp7f9OGr8rM3oCC01r/3AVh5vU8akLuHVgVdWb+DgCbxl8V+rYMHBL4NYQwq7WxrClyAtZSfIrg1mLLLTOnCKZq1L8QQdmTnRHR+6ZD0tAU184nO8/LTa1ufWZoa1XVdWbeuYpz708FIgksN5Fz2Y7nvORlL60KcNu9zPwLAGapfxv2ulNpw+VcPwFzotT0naOP4B+KgW5H2IUKiwAAAABJRU5ErkJggg==)
		no-repeat left center;
	background-size: 20px;
}

.mui-global-nav-tab-shop:before {
	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAADjUlEQVRYR+1YMWsUQRR+b7axUWNjo2BSCHbuzlSCYPILEnvBaC2Y4A/IpbESciDWuQN7zS/IpbDcca4SBUkELaySqwTNzJO3zi5ze3u3CV42EbNV7nbuzTffe+973wThjD94xvHBvw8wjuMYES+fBNNENDDGmEmxKxmM43hGCLGBiMsnAawck4g6zrlVY8xB+V0lQKXUNgDMNwEu2MNYaxfKIEcAxnE8H0URAwQiWnXOdapONg3wPlNLiLjp91vXWrfC2CMAlVIdAHgIAFtpmi5NA0hdDCllGxGfEtGe1npuLMA4jmejKNrlBZ7uXl3wabwP9wWA+2mavs3jDjEopWwh4hoRfdFaz05j86PGUEoxqMVy5soA9xFxhogeaa051Y09Sikupzc+e3PGmD3+uwAopVz2xTqw1s6eVGNMOrGUcg8RbxBR0SwFQKXUewCIAaCbpmkj+lcGG5RY0SwZwFBarLUFvY3l12/EshNF0b7/mDVLBjCXFiLa0Vo3LdBDPJRlLgMopTy15ihnKW8WIjrQWl/JGaSmtW9c+YRpTtMUMfyiSXGeALAYFhlAX4MZg2UVb7pJPJZCD0OAuYr30jRdqAPGHjGKotvW2p1cUGtStmitPTDGbNXFDpxUJncjMsMORmvdHhdISrmZ+0QuZOccW6RK08kHEUJs83TieJN8n29W9qArYT+EQp27GA7Uds6th9PEs7ZR9okMEhFb1tpuvt7X9SLHycHlB2bH4pxbCdn0sdcAIHdPxbAoz+IeIt4L2MvcDBHNImJoHrrW2nYURfw+vA7k7ifUUh6d7DGZGbZx4cPM8/QKnyGbN+IH/bjhYCP3EHY5zrllY0wGxBtOdkA8GqvuLXwQZiuz8jyxhBAdnrcVJTQgola5vMbe6nywnAmutd6EWuMa43rL1iMi23deP3LH8EDztVlt+tiV3nMIIDNCRA8Q8XWTbob3RcTnzrkP/X7/ZchuuQa/IuI1Ivqmtb5eJwnTeq+U+gQANzne4eHh436/n91RsmyEm0gpfyDihbDNpwViUpwkSXaFEFkTWmtfGWOenAM8DvPnDB6Hraq15wz+Dwx+F0JcrZUZpdQAAC7xQiL6iYjub9k54u8z7fUA7xpj3lXqYJIkLxDxGf4x2o0/RPRRa30r3HgESZIkXSHEfSK62BRCRPxFRJ+dc3dq/z+Yg2I30xRAAGCjVOl8TieXxzj5b1AuV0cuaeGZAAAAAElFTkSuQmCC)
		no-repeat left center;
	background-size: 20px;
}

.mui-global-nav-tab-class:before {
	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAADMUlEQVRYR9WYT5JMQRDGv2eErZkT4AAiWFnMwjgBToATcAOcYDgBdhYTMSyscQKcACdgzE6gxa8ns6O6uupV1bxq0TLiRUdHvMr68v/3ctCGy7Dh+NQCcE/SF3um2LUtiQddRRkDiJL7ku5KuhhpeiXpqaR3xRtOXsC4O6aL/19N5xVJ1yW9kPQ9pSsHEIWHZimHAeIW35LEc0HSc0n3KkAe6cxwrD+zA9P10fSh51CDfmg2NwDDlyQF8OSQ9MmA5ELxQNK+XXijAJJoJD009+S5rZf6+fuaGYvRC4kBEsoPBg4vloTwP7NwAziUR5n0SOs8O7zRr9muRS0LEPR4EKA5i+MLAPJQ0qUgDTj/2XILI2oEL1+WdCyJFJhL6EFe+CbpsSQurZXUOc7jUYqgqlrtMo/IjjsoBEhI30aeqAXp1expEf+v1eOev+0FEwL0ULX0Rr+Ys1QhYUbwGhUZ52UN0FkYxZ4AyUPXt3RJDargnSzAKSGOvX9agB5i2tY8TXoUCXp6AXQ9ySLhItrMTcul2jbTCyDdgNb0OhiJK2QBF9ODqGYqqVZ6eJCiIs2WWlOqYr0XkQPM2Zo+NgUgTmEaAY77Rkede4xpwovn7TckCymvYhRPWMWcX7osOggwQHHuyCbYCjsq0S36GApgLiVxCuV9sPYMRjxppVsxGBKY3BiTkMzinZhDxmfJ9WIhtkwNwkF/ywke9HwFXMmD0LlJAMcYdQok4MJRVwLoqUCIYedNjJoiobIAGTPqXJEwi8Mi4dxYkaCbezgHOCq4ilF7m3lvBfIv2gyG8G1SbDPOqAGHdbUypQ/6HXgPkFfD3hsXyWkYdc9R5zRtwcL/K7Kw8XRrKqNeO2GdCjDcQJBL5HPLx5cXy1oYde+Ppq6MOvfZScgXzLiyX62FUY99uLd8YzcxatYfpX0LThlbfUCh2I6tTIeMN0kTGFORUfvyCDoE7S8tj5g6uT0OlzId4JUQgpQwvVhWAWzxwe4vjq3fGD0wan554vUbiiEEpd0L1Qwh8CnhhGBtjBp6jmcIYcsCEy/iaYx2gUN2YdQo7LUCdrZdZVwLo67sFH1f23iAfwGENgY4Hp3VTAAAAABJRU5ErkJggg==)
		no-repeat left center;
	background-size: 20px;
}

.mui-global-nav-tab-goods:before {
	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAADC0lEQVRYR+1Y4XXTMBDWRQMQJiBMgCoNQJigZALKBLQTUCZoOwF0grYTUAaQ0AaUCQgDyMc7PzvvLMuKiOPXwKt/2tLdp7v7vjsZxIE/cOD4xBPAsRkajKDW+hQAjsc6KNmPiHfOucvU2iRApZSSUn4vMb6vNSGEI++9j+0lARpj3gohbmgxIl4JIdb7AhLZmQPAh+bdylp7WwRQa30OAB9psbV2UiIZY7AJxCfn3Pl/A/AeAF4j4jfn3HKi9NZmtdZZX8n0DW1SSs1ns9kFANyl6iV3EKprRDyuqurMe7+p6V0B/gKAORHEOXfaOm6k52KX2mS1dsYlRWt9SURBxLVz7nlRDQ4Vrtb6BAA+k5EQwkvv/UNJ+iPZ6rB1GyF7KebGEPG9c+5LC0IptZRSfs3JQgowl60Qwhvv/T3LCj90TwtTADcgYmNk1BhD9fNMCHFtrT0piaAxhg75Tgjx21o753v4oVP+egCjNPZOxJxRmpPqHwHgXal3qFzGyE4KYFaklVILKeWPRlwfqqpapVoUfSfns9nsBgAWubrNiXUKYM2qVDpSbCb2AcCptfaaR44yIYQgSapTiogd9vK1DGBHNYYiWCTSnH0NAAJaN3tEVC2wXBtjBx70mYpgEcCGMCS+FPEXKbIg4s8mur0hIIp2OcBtzTsjIwS2rjUAIH28Le02OS3sRXAXgCVSk1tTDDCn+GNB5PZHQt6Rrk4Et4nmVCBzfjsA+TDwN712LPBIWztyFAPcJtJz6sUNGcgQ79MkytSn17F4txNLQ5zVANGSk3UHYK5nklFezPEwa4whKalvgfGY1hKv6SadYaEFO9Tj4whmNZAXczws8PKIpyCttQeAV9SdQggqNaYNDa5xBOmqqYQQNDHTza73NExfpDSOvtGGuDfTJC6lXIYQ6FNyhmwB0nZr7VHrOAaYvWGNJcMuWvjvAHwsDWyjOuR/E8GDB8hZSIU64e+OoVKkubEmGZ8dNxHko/6UZCixzWUq1kH6BVaf4hEfz+/ik/4Y2schnwCOjeLBR/APvhWGRwCgfSoAAAAASUVORK5CYII=)
		no-repeat left center;
	background-size: 20px;
}

.mui-global-nav-tab-service:before {
	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAADNklEQVRYR+1X7VUbMRDcvSsgTgWBCiJLBeBUEKggpANTAaYCSAWxKwBXEFLAKUoFcTqAAqTN23uSn9B9n48Xftj/MNLueKSdGSG88Q++cXxwBHjoCR3EoBDiJM/zzwCwICKBiCcMiIieENEQkXHObY0xj2OBjgLIwLIsu0bEyz6NiWiHiFdFUTz0WR+vGQxQSsmgbhFxNrQZADxaay+MMU999w4CKKVkYMuo+DMAPFhr1+kxCiFElmULAFgi4odoj/Egd31A9gYopeRGt1HRrbV2aYxpbSSEmGVZxnuvE5Cf+jDZC6AQYpHn+Y/QgIhutNarPgyENXw1EPF7tGdTFEXnHe4FUCn1CwCEL96rcB34FKS1lllsnfBOgHFRIvrrnBN9jqaJXaUUTzJLE3+2RVGct51EK8D5fH6WZdldYG/M0abNlVIM6D58b62dG2NME8hagH4C74PwJpsvxugZ16gZtFC6UX4qAP3U/WnSuUNYlFKukmmOfzvLT2WyKwBrimx8lS/exgZPcDTJMcCNdxjW1XdNtSsA44kNUxbLzFQMRrVFnuesEuzhO631aavVKaUoLCiKovwBrwmQ68c906GpY/B/A3yhjUeA8X2KBzB2keSIp2Mw6BoRfdVarxMwpfcS0ZXWmsWedXA/xaMBSik5XJbxyFp7ymmlaUgSV+AEXQZSRGS3YO/mOHYZhL0OIJtCmGLf831spXV3kJkImsdRiv8+Cek5lRnvOg9J5mPJ+O2cu4xtLAZIRFyX63MUK8MvEf3UWnOG3H9qnSTPc95Yimf6adJBz0T5JrHW7ur8tcNJeF/Fl9u8eI2IH2sAVu5bk9Gn3zd5sU9JzHYlerWmGX98fJdKZvilNjYosMf70Cv4+PmpAABPzjkmuzETdubBvux0rVNKcSLn+/VsrV20RazWO9jVaOj/PXOc/8rLXydJbTUnYzB+8RHRnXPuBgDKwBs96Aff30kAtgTRQM4LPRxyCpMATN4Z+/48nTwMzrnV2HfMJADrGCSib1rr+JE/hLhmoR5TxT8T2E3OgiM4587HsvZqU8y6CQCzrrfuEBImOeIhDYeuPQIcyli6/sjgoQz+A7riU0cr3vgdAAAAAElFTkSuQmCC)
		no-repeat left center;
	background-size: 20px;
}
</style>
