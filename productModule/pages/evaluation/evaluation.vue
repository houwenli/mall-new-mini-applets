<template>
	<view style="height: 100%" :class="commentSummarize.allCommentCount ? 'gray-bg' : 'white-bg'">
		<!-- 好评率 -->
		<view
			style="
        height: 80rpx;
        line-height: 80rpx;
        font-size: 26rpx;
        padding-left: 30rpx;
        background: #fbfbfb;
      "
		>
			好评率{{ goodComments }}
		</view>
		<!-- 评价tab -->
		<view class="comments-tab">
			<view class="comments-btn" :class="{ active: tabValue == -1 }" @click="changeTab(-1)">全部{{ commentSummarize.allCommentCount }}</view>
			<view class="comments-btn" :class="{ active: tabValue == 1 }" @click="changeTab(1)" v-if="commentSummarize.allCommentCount">
				好评{{ commentSummarize.goodCommentCount }}
			</view>
			<view class="comments-btn" :class="{ active: tabValue == 2 }" @click="changeTab(2)" v-if="commentSummarize.allCommentCount">
				中评{{ commentSummarize.middleCommentCount }}
			</view>
			<view class="comments-btn" :class="{ active: tabValue == 3 }" @click="changeTab(3)" v-if="commentSummarize.allCommentCount">
				差评{{ commentSummarize.badCommentCount }}
			</view>
		</view>
		<!-- 缺省 -->
		<view class="applet-order-list-isEmpty u-flex flex-column u-padding-top-60" v-if="pageList.length == 0">
			<image style="height: 180rpx;width: 180rpx;" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/bge.png" mode=""></image>
			<view class="u-padding-top-10rpx" style="font-size:32rpx;color: #333;padding-bottom: 20rpx;margin-top:50rpx">还没人发表评价</view>
			<view style="font-size:28rpx;color:#999">看看其他的~</view>
		</view>
		<!-- 评论 -->
		<view>
		<view class="friends-item" v-for="(item, index) in pageList" :key="index">
			<view class="comments-head_">
			<img class="head-img" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-hard.png" alt />
			<view class="head-conent">
				<view class="phone-evaluate">
				<view class="phone" v-if="item.isAnonymous == 0">
					<text v-if="item.relename">
					{{
						item.relename.length > 1
						? item.relename.charAt(0) + '****' + item.relename.charAt(item.relename.length - 1)
						: item.relename.charAt(0) + '****'
					}}
					</text>
					<text v-else>
					{{
						item.customerName.length > 1
						? item.customerName.charAt(0) + '****' + item.customerName.charAt(item.customerName.length - 1)
						: item.customerName
						? item.customerName.charAt(0) + '****'
						: '******'
					}}
					</text>
				</view>
				<view class="phone" v-else>
					<text v-if="item.relename">
					{{ '*****' + item.relename.charAt(item.relename.length - 1) }}
					</text>
					<text v-else>
					{{ item.customerName ? '*****' + item.customerName.charAt(item.customerName.length - 1) : '******' }}
					</text>
				</view>
				<view class="star">
					<view class="icon-star">
					<img :src="`https://wsjc-web.wsecar.com/wsf-mall/skuDetail/star-${item.score>=1?'one':'white'}.png`" alt="">
					</view>
					<view class="icon-star">
					<img :src="`https://wsjc-web.wsecar.com/wsf-mall/skuDetail/star-${item.score>=2?'two':'white'}.png`" alt="">
					</view>
					<view class="icon-star">
					<img :src="`https://wsjc-web.wsecar.com/wsf-mall/skuDetail/star-${item.score>=3?'three':'white'}.png`" alt="">
					</view>
					<view class="icon-star">
					<img :src="`https://wsjc-web.wsecar.com/wsf-mall/skuDetail/star-${item.score>=4?'four':'white'}.png`" alt="">
					</view>
					<view class="icon-star">
					<img :src="`https://wsjc-web.wsecar.com/wsf-mall/skuDetail/star-${item.score>=5?'five':'white'}.png`" alt="">
					</view>
				</view>
				</view>
				<view class="time">{{ item.createTime.split(" ")[0] }}</view>
			</view>
			</view>
			<view class="comments-content_" v-if="item.comment">{{item.comment}}</view>
			<view class="sku_sx">{{ item.skuSpecName }}</view>
			<view class="comments-img_" v-if="item.commentPics.length > 0">
			<scroll-view class="scroll-view_H" scroll-x="true" scroll-left="0">
				<view class="view-flex">
				<view class="scroll-view-img" v-for="(element, imgIndex) in item.commentPics" :key="imgIndex">
					<img :src="element.url" @click.stop="showImg(item.commentPics, imgIndex)" alt="">
				</view>
				</view>
			</scroll-view>
			</view>
			<view v-for="(apply, applyIndex ) in item.commentReplies" :key='applyIndex'>
				<view class="reply" >
				<text>商家回复：</text>
				<view class="reply-conent">{{apply.reply}}</view>
				</view>
			</view>
		</view>
		</view>
		<!-- 图片预览 -->
		<u-mask :show="showImgDialog" @click="showImgDialog = false">
			<p style="text-align: center;color: #FFFFFF;padding: 20rpx 0;">{{current}}/{{imgList.length}}</p>
			<view class="warp" style="height: 100vh;display: flex;z-index: 111111;align-items: center;justify-content: center;">
				<view class="rect" style="width: 100%;">
					<swiper @change="changeFun" :indicator-dots="imgList.length > 0 ? true : false" indicator-color="#fff" style="height:100vh">
						<swiper-item v-for="(item, i) in imgList" :key="i">
								<view style="width: 100%;height: 100%; display: flex; align-items: center;">
									<image style="width: 100vw;height: 100vh;" :src="item" mode="aspectFit"></image>
								</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</u-mask>

		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" top="5000" :icon-style="iconStyle" :bottom="140">
			<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/top%402x.png" style="width: 80rpx; height: 80rpx"></image>
		</u-back-top>
	</view>
</template>

<script>
import { priceFilter } from '@/common/wsfFilter.js'
export default {
	data() {
		return {
			current: 1,
			priceFilter,
			pageList: [],
			loadStatus: 'loadmore', // 加载更多样式效果
			isLoading: false, // 是否正在加载
			hasMore: true, // 是否拥有更多
			commentSummarize: {}, // 评价概括
			skuId: '', //单品id
			tabValue: -1, // 顶部tab 切换值
			queryForm: {
				skuId: null,
				type: -1,
				pageNum: 0, // 当前页码
				pageSize: 10, // 每页显示记录数
				star: 1
			},
			scrollTop: 0,
			showImgDialog: false,
			imgList: [],
            spuId: null,
            isCollection: false // 是否是集采详情进来
		}
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop
	},
	onLoad(option) {
		let that = this
		console.log('option', option)
		if (option.skuId) {
			this.queryForm.skuId = option.skuId
            this.spuId = option.spuId
			this.skuId = option.skuId
            this.isCollection = option.isCollection
		}
		this.queryCommentSummarize()
		this.querySkuComments()
	},
	computed: {
		goodComments() {
			return this.commentSummarize.allCommentCount
				? parseInt((this.commentSummarize.goodCommentCount / this.commentSummarize.allCommentCount) * 100) + '%'
				: '100%'
		},
	},
	methods: {
		changeFun(e){
			console.log(e,"&&&&&&");
			this.current = e.detail.current + 1
		},
		//预览图片
		showImg(list, imgindex) {
			let imgList = list.map((item) => {
				return item.url
			})
			console.log('imgList', imgList)
			this.imgList = imgList
			this.showImgDialog = true
		},
		//预览图片
		// showImg(list, index) {
		//   uni.previewImage({
		//     current: index,
		//     urls: getUrls(list),
		//   });
		// },
		getUrls(commentPics) {
			let urls = []
			commentPics.forEach((pic) => {
				urls.push(pic.url)
			})
			return urls
		},
		// 切换tab
		changeTab(e) {
			this.tabValue = e
			this.pageList = []
			this.noMore = false
			this.queryForm = {
				skuId: this.skuId,
				type: this.tabValue,
				pageNum: 0, // 当前页码
				pageSize: 10, // 每页显示记录数
			}
			this.hasMore = true
			// this.$refs.scroller.finishInfinite(false)
			this.querySkuComments()
		},
		querySkuComments() {
			console.log(this.isLoading, 'isLoading')
			console.log(this.hasMore, 'hasMore')
			let that = this
			if (this.isLoading || !this.hasMore) return
			this.isLoading = true
			this.loadStatus = 'loading'
			console.log('ii')
            // 集采传spuId
            if(this.isCollection){
                this.queryForm.spuId = this.spuId
            }
            let selectFun = this.isCollection ? this.$u.api.enterPriseGoodsComment : this.$u.api.Queryskucomments 
			selectFun(this.queryForm).then((res) => {
				this.isLoading = false
				this.loadStatus = 'loadmore'
				console.log('res', res)
				if (res.code === 200) {
					this.pageList = this.pageList.concat(
						res.data.list.map((item) => {
							item.price = this.priceFilter(item.price)
							return item
						})
					)
					this.queryForm.pageNum++
					this.hasMore = res.data.list.length === 10
					this.loadStatus = res.data.list.length === 10 ? 'loadmore' : 'nomore'
				}
			})
		},
		//滚动到底部触发事件
		onReachBottom() {
			this.querySkuComments()
		},
		// 查询评价概括
		queryCommentSummarize() {
            let params = {}
            if(this.isCollection){
                params.spuId = this.spuId
            }else{
                params.skuId = this.skuId 
            }
            let selectFun = this.isCollection ? this.$u.api.enterPriseGoodsCount : this.$u.api.Querycommentsummarize 
			selectFun(params).then((res) => {
				this.commentSummarize = res.data
			})
		},
	},
}
</script>

<style lang="scss">
.gray-bg {
	background: #f5f5f5;
}
.white-bg {
	background: #ffffff;
}
.comments-tab {
	display: flex;
	flex-wrap: wrap;
	background: #fff;
	width: 100%;
	max-height: 176rpx;
	padding: 20rpx 30rpx 24rpx;
	font-size: 26rpx;
	border-radius: 0 0 20rpx 20rpx;
}
.comments-btn {
	display: inline-block;
	width: 164rpx;
	height: 56rpx;
	line-height: 56rpx;
	text-align: center;
	background: #fef4f4;
	border-radius: 28rpx;
	margin-right: 20rpx;
	margin-bottom: 20rpx;
}
.active {
	color: #e60113;
}
.friends-item {
  margin: 0 24rpx;
  margin-top: 24rpx;
  padding: 0 24rpx;
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid #EEEEEE;
  background: #ffffff;
  padding-top: 20rpx;
}
.comments-head_{
  display: flex;
  padding-bottom: 10rpx;
  .head-img {
    width: 72rpx;
    height: 72rpx;
    display: block;
    border-radius: 50%;
  }
  .head-conent {
    display: flex;
    flex-direction: column;
    padding-left: 16rpx;
    padding-top: 2rpx;
    .phone-evaluate {
      display: flex;
      .phone {
        font-size: 26rpx;
        color: #444444;
        font-weight: 600;
        padding-right: 8rpx;
      }
      .star {
        display: flex;
        align-items: center;
        .icon-star {
          width: 24rpx;
          height: 24rpx;
          img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }
      }
    }
    .time {
      color: #999999;
      font-size: 22rpx;
      font-family: ArialMT;
      line-height: 30rpx;
    }
  }
}
.comments-content_ {
  color: #191919;
  font-size: 26rpx;
  line-height: 34rpx;
  padding-top: 10rpx;
  width: 100%;
}
.comments-img_ {
  .scroll-view_H {
    width: 100%;
    white-space: nowrap;
    .view-flex {
      display: flex;
        .scroll-view-img {
          width: 160rpx;
          height: 159rpx;
          border-radius: 16rpx;
          margin-right: 8rpx;
          flex-shrink: 0;
          img {
            width: 100%;
            height: 100%;
            display: block;
            border-radius: 16rpx;
          }
        }
    }
	}
}
.reply {
  padding: 12rpx 16rpx;
  background: #F6F6F6;
  border-radius: 16rpx;
  opacity: 0.5;
  text {
    font-size: 26rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #999999;
    line-height: 34rpx;
  }
  .reply-conent {
    font-size: 26rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #6E6E6E;
    line-height: 34rpx;
    padding-top: 8rpx;
  }
}
.sku_sx {
  font-size: 22rpx;
  color: #999999;
  padding-bottom: 12rpx;
  padding-top: 10rpx;
}
</style>
