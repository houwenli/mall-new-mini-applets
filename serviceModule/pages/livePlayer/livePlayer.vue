<template>
  <view class="live-player">
	<template v-if="notEndRooms.length">
		<view class="img" @click="navigate">
			<image style="width: 100%;height: 500rpx;" src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/28f6291cf010c024dea47c9148c0a3a5.png"></image>
		</view>
		<view class="content">
			<view class="list">
				<template v-for="(item,index) in notEndRooms">
					<view class="list-item" :key="index" @click="changeFun(item.roomid)">
						<view class="left">
							<image :src="item.feeds_img" style="width:100%;height: 340rpx;border-radius: 10rpx;"></image>
							<view class="tag">
								<image style="width: 26rpx;height: 26rpx;margin-right: 10rpx;" src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/d690838df3b32d881e6548d17ef96100.png"></image>
								<text v-if="item.live_status==101" class="txt">直播中</text>
								<text v-if="item.live_status==102" class="txt">即将开播</text>
							</view>
						</view>
						<view class="right">
							<template v-if="!item.goods.length">
								<view class="info">
									<view class="u-line-2 txt">
										{{item.name}}
									</view>
									<view class="time">
										直播时间：{{$u.timeFormat(item.start_time, 'yyyy-mm-dd hh:MM')}}
									</view>
									<view class="btn">
										点击查看 <u-icon class="icon-arrow-right" name="arrow-right"></u-icon>
									</view>
								</view>
							</template>
							<template v-else>
								<view class="info">
									<view class="u-line-2 txt">
										{{item.goods[0].name}}
									</view>
									<image class="img" style="width: 140rpx;height: 140rpx;" :src="item.goods[0].cover_img"></image>
									<view class="money">
										<text v-if="item.goods[0].price_type==1">￥{{fen2yuan(item.goods[0].price)}}</text>
										<text v-if="item.goods[0].price_type==2">￥{{fen2yuan(item.goods[0].price)}} ~ ￥{{fen2yuan(item.goods[0].price2)}}</text>
										<template v-if="item.goods[0].price_type==3">
											<text>￥{{fen2yuan(item.goods[0].price2)}}</text><text style="margin-left:20rpx;color: #999999;text-decoration:line-through;">￥{{fen2yuan(item.goods[0].price)}}</text>
										</template>
									</view>
								</view>
							</template>
						</view>
					</view>
				</template>
			</view>
		</view>
	</template>
	<template v-else>
		<view class="default-page">
			<image style="width: 180rpx;height: 180rpx;" src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/39ebcebf1ce9bd96a86be2893e4d84f6.png"></image>
			<view class="txt">喔喔，暂未开播〜</view>
		</view>
	</template>
    <view class="applet-template-recommend u-padding-left-24 u-padding-right-24">
      <view class="title u-padding-bottom-20">
        <image src="@/static/img/a@2x.png"></image>
        <text>热销商品</text>
        <image src="@/static/img/b@2x.png"></image>
      </view>
      <wsf-goods-list
        ref="goodslist"
        :list="flowList"
        showStyle="common"
        :loadStatus="loadStatus"
        @goodsClick="goodsClick($event)"
      ></wsf-goods-list>
    </view>
  </view>
</template>

<script>
import { priceFilter } from '@/common/wsfFilter.js';
export default {
  data() {
    return {
	  priceFilter,
      flowList: [], // 瀑布流商品列表
      loadStatus: "loadmore", // 加载更多样式效果
	  isLoading: false, // 是否正在加载
	  hasMore: true, // 是否拥有更多
      queryForm: {
        // 页码页容量
        pageNum: 0,
        pageSize: 10,
      },
	  notEndRooms: [], //直播列表
    };
  },
  onShow() {
	this.mallLiveGetLiveInfosFun()
    this.resetList();
    this.GetRecommendList();
  },
  onReachBottom() {
    this.GetRecommendList();
  },
  onPullDownRefresh(){
	// uni.startPullDownRefresh();
	this.mallLiveGetLiveInfosFun()
	this.resetList();
	this.GetRecommendList();
	/* setTimeout(function () {
		uni.stopPullDownRefresh();
	}, 3000); */
  },
  methods: {
	  navigate(){
		  this.$wsf.go('Index',{})
	  },
	// 直播列表数据
	mallLiveGetLiveInfosFun(){
		this.$u.api.mallLiveGetLiveInfos().then(res => {
			console.log(res,"直播列表数据")
			this.notEndRooms = []
			if(res.code === 200&& res.data.notEndRooms.length){
				this.notEndRooms = res.data.notEndRooms
			}
			uni.stopPullDownRefresh();
		})
	},
	changeFun(roomid){
		let url = `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomid}`
		this.$wsf.go(url,{})
	},
	// 分--> 元
	fen2yuan(fen) {
	  const fenStr = '00' + Number.parseInt(fen.toString()).toString()
	  return Number.parseFloat(fenStr.replace(/^(\d+?)(\d{2})$/g, '$1.$2'))
	},
    /* 获取推荐的商品列表 */
    GetRecommendList() {
      if (this.isLoading || !this.hasMore) return;
      this.isLoading = true;
      this.loadStatus = "loading";
      this.$u.api.GetRecommendList(this.queryForm).then((res) => {
        this.isLoading = false;
        this.loadStatus = "loadmore";
        if (res.code === 200) {
          this.flowList = this.flowList.concat(
            res.data.map((item) => {
              item.price = this.priceFilter(item.price);
              return item;
            })
          );
          this.queryForm.pageNum++;
          this.hasMore = res.data.length === 10;
          this.loadStatus = res.data.length === 10 ? "loadmore" : "nomore";
        }
      });
    },
    resetList() {
      this.flowList = [];
      this.hasMore = true;
      this.loadStatus = "loadmore";
      this.queryForm = {
        // 页码页容量
        pageNum: 0,
        pageSize: 10,
      };
      this.$refs.goodslist.clearList();
    },
  },
};
</script>

<style lang="scss" scoped>
.live-player {
  width: 100%;
	.img{
		
	}
	.content {
		width: 100%;
		padding: 0 24rpx 80rpx 24rpx;
		.list {
			width: 100%;
			margin-top: -170rpx;
			.list-item {
				background-color: #FFFFFF;
				border-radius: 10rpx;
				display: flex;
				margin-bottom: 24rpx;
				overflow: hidden;
				.left,.right{
					flex: 1;
					height: 340rpx;
				}
				.left{
					background-color: #FFFFFF;
					position: relative;
					.tag {
						position: absolute;
						top: 0;
						left: 0;
						background: linear-gradient(45deg, #F8132B 0%, #FF6B44 100%);
						border-radius: 10rpx 0rpx 10px 0rpx;
						display: flex;
						align-items: center;
						padding: 5rpx 10rpx;
						.txt {
							font-size: 26tpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #FFFFFF;
						}
					}
				}
				.right {
					border-radius: 0 10rpx 10rpx 0rpx;
					background-color: #FFFFFF;
					box-sizing: border-box;
					padding: 24rpx;
					.info{
						.txt{
							font-size: 28rpx;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #000000;
						}
						.time{
							font-size: 24rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #666666;
							margin-top: 20rpx;
							margin-bottom: 84rpx;
						}
						.btn {
							width: 210rpx;
							background: linear-gradient(180deg, #FEEFEC 0%, #FEE5E7 100%);
							border-radius: 15px;
							padding: 12rpx 36rpx;
							font-size: 26rpx;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #F53544;
							display: flex;
							justify-content: center;
							align-items: center;
							.icon-arrow-right{
								margin-left: 5rpx;
							}
						}
						.img {
							margin: 20rpx 0;
							border-radius: 10rpx;
						}
						.money {
							font-size: 28rpx;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #E60113;
						}
					}
				}
			}
			.list-item:last-child{
				margin-bottom: 0;
			}
		}
	}
  .applet-template-recommend {
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      text {
        padding: 0 20rpx;
        color: #000000;
        font-size: 32rpx;
        font-weight: 500;
      }
      image {
        width: 48rpx;
        height: 10rpx;
      }
    }
  }
	.default-page{
		margin: 60rpx auto;
		text-align: center;
		.txt{
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;
		}
	}
}
</style>
