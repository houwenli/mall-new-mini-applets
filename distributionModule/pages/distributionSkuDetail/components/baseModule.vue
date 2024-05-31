<template>
	<view>
		<view class="bannerBox">
			<swiper class="swiper" :interval="3000" :circular="true" :autoplay="false" :indicator-dots="false" @change="bannerChange">
				<swiper-item v-for="(item,index) in skuData.images" :key="item.keys">
					<video style="width: 100%;height:100%" id="videoBanner" ref="videoBanner"
					:poster="skuData.spuVideoPic" :src="skuData.spuVideo"
					:show-center-play-btn="true" :show-loading="false" object-fit="fill" :controls="controlsShow" :seeked="true"
					class="bannerVideo" v-if="bannerCurrent==0&&skuData.spuVideo" @play="play()" @ended="endVideo()"></video>
					<image :src="item.src ? item.src : item" mode="aspectFill" class="swiper-img" @tap="previewImg(index)"></image>
				</swiper-item>
			</swiper>
			<view class="currentBox" v-if="skuData.images && skuData.images.length">
				{{ bannerCurrent + 1 }}/{{skuData.images.length}}
			</view>
		</view>
		<view class="property-swiper" v-if="treeLength && treeLength.length >= 2">
		<view class="num-property">
			<p>{{treeLength.length}}种</p>
			<p>可选</p>
		</view>
		<view class="property">
			<scroll-view class="scroll-view_H" scroll-x="true" scroll-left="0" scroll-with-animation :scroll-into-view="scrollFCateId">
						<view class="flex-swiper">
				<img v-for="(item,index) in treeLength" :key="index" :class="[
				item.disabled ? 'disable' : '',
				firstOrderSkuId.indexOf(item.id) >= 0 ? 'activity' : ''
				]" :src="item.imgUrl" alt="" @click="pitchOnFun(item,index)" :id="'fCate' + item.id">
			</view>
					</scroll-view>
		</view>
		</view>
		<view class="conent-nav">
			<view class="base-info u-flex u-row-between">
				<image v-if="skuData.sellOut == 1" class="soldout-img" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/cat_soldout%402x.png"></image>
				<view style="width: 100%">
					<p class="current-price">
						<template v-if="skuData.shelvesStatus == 0 || skuData.shelvesStatus == 2">
							<text>暂无售价</text>
						</template>
						<template v-else>
							<!-- 添加福气值逻辑 -->
              <view class="fqz-price" v-if="skuData.integralPoint > 0">
                <text>
                  <text class="special">
                    {{ skuData.integralPoint }}
                  </text>
                  福气值+
                  <text>
                    {{ skuData.deductionAfterPrice }}
                  </text>
                  元
                </text>
              </view>
							<template v-else>
								<view>
									<i>￥</i>
									<span>{{ skuPriceInt }}</span>
									<text class="u-font-text">{{ "." + skuPriceFloat }}</text>
								</view>
							</template>
							<view v-if="skuData.afterCouponPrice" class="reduced-price">
								<span>券后</span>
								<i>￥</i>
								<text class="txt1">{{reducedPriceFloat[0]}}</text>
								<text class="txt2">{{"."+reducedPriceFloat[1]}}</text>
							</view>
							<view v-if="skuData.oldPrice > skuData.price && !skuData.afterCouponPrice" class="reduced-original">
								<i>￥</i>
								<text class="txt1">{{oldPriceflot[0]}}</text>
								<text class="txt2">{{"."+oldPriceflot[1]}}</text>
							</view>
						</template>
					</p>
					<!-- <view v-if="skuData.preCommission" class="commission-price">
						预估佣金：¥{{(Math.floor(skuData.preCommission * 100) / 100).toFixed(2)}}
					</view> -->
					<view class="coupon-ticket" v-if="skuData.couponLabelList && skuData.couponLabelList.length > 0">
						<view class="coupon-left">
						<scroll-view class="scroll-view_tab" scroll-x="true" scroll-left="0">
							<view class="flex-tab">
								<view v-for="(item, index) in skuData.couponLabelList.slice(0, 3)" :key="index" class="time-box-tab">
									<text class="time-tab" v-if="item.couponsType == 1">满{{item.amountLimitation}}减¥{{item.faceValue}}</text>
									<text class="time-tab" v-else-if="item.couponsType == 2">{{item.faceValue ? item.faceValue : 0}}折</text>
									<text class="time-tab" v-else>立减¥{{item.faceValue}}</text>
								</view>
							</view>
						</scroll-view>
						</view>
						<view class="coupon-right" @tap="openCouponModule()">
						<span>查看</span>
						<img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-redRight.png" alt="">
						</view>
					</view>

				</view>
			</view>

			<!-- 专题活动 -->
			<view v-if="skuData.skuLable && skuData.skuLable.thematicLabel" class="activitity-mark" @tap.stop="toThematic(skuData.skuLable.thematicLabel)">
                <view class="activitity-mark-left">
					<image class="hot-icon" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-actity.png" />
                	<text class="activitity-mark-text">{{ skuData.skuLable.thematicLabel.subjectLabel }}</text>
				</view>
                <image class="arrow-right-icon" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-red.png" />
            </view>

			<!-- 标签和绩效分 -->
			<view class="expression" v-if="skuData.skuLable">
      		 		<view class="left-time" v-if="skuData.skuLable.goodsTagList && skuData.skuLable.goodsTagList.length > 0">
      		   			<view v-for="tags in skuData.skuLable.goodsTagList" :key="tags.id" class="tab-item-box">
							        <view class="tab-item-box--tip">惠</view>
                      <view class="tab-item-box--val">{{ tags.tagName }}</view>
						</view>
      				</view>
      				<view class="performance" v-if="skuData.skuLable.performanceScoreLabel&&skuData.skuLable.performanceScoreLabel.performanceScore > 0">
      			  		<image src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-performance.png" class="performance-img" alt="">
      			  		<text>绩效:{{ skuData.skuLable.performanceScoreLabel.performanceScore | performanceCount}}</text>
      				</view>
      		</view>
			<view class="product-title">{{ skuData.name }}</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			ossUrl: this.$oss,
			bannerCurrent:0,
			controlsShow:true,
			videoContext:{},
			tree: [],
			skuDetail: {},
			initialSku: {}, // 条件属性
			treeLength: [],
			initialSkuArr: [],
			firstOrderSkuId: "", // 保存skuId
			filterList: [], // 依据条件过滤的sku数组
			activeImg: '',
			activeSku: 's0'
		};
	},
	filters: {
		performanceCount(val) {
			if(val && Number(val) >= 10000) {
				return (parseInt((val / 10000) * 10)/10) + '万分'
			} else if(val && Number(val) >= 1000) {
				return parseInt(Number(val) / 1000) + '000+分'
			} else if(val && Number(val) >= 100) {
				return parseInt(Number(val) / 100) + '00+分'
			} else {
				return val + '分'
			}
		},
	},
	watch: {
		initialSku: {
			handler(n, o) {
				this.initialSkuArr = [];
				for (let i in n) {
					if (n[i]) {
						this.initialSkuArr.push(n[i]); //属性
					}
				}

				/**
				 * 顶部选中规格轮播当前选中
				 * 选中位置索引大于1时减1，给左边预留一个规格
				 */
				if(this.treeLength && this.treeLength.length > 2) {
            		let index = 0
            		for (const i in this.treeLength) {
            		  if(this.treeLength[i].id === this.initialSkuArr[0]) {
            		    index = i
            		    break
            		  }
            		}
            		if (index <= 1) {
            		  this.activeSku = 's0';
            		} else {
            		  this.activeSku = 's' + (index - 1);
            		}
          		}
			},
			deep: true,
		},
	},
	props: {
		skuData: {
			type: Object,
			default() {
				return {};
			}
		},
		bestCoupon: {
			type: Object,
			default() {
				return null;
			}
		},
		isMark: {
			type: Boolean,
			default() {
				return false;
			}
		},
		// 秒杀数据
		marketingVos: {
			type: Array,
			default() {
				return [];
			}
		},
		skuId:{
			type:String,
			default:""
		},
	},
	computed: {
		scrollFCateId() {
      		return 'fCate' + this.firstOrderSkuId;			
		},
		skuPriceInt() {
			let price = 0
			if(this.skuData && this.skuData.price) {
				price = this.skuData.price
			}
			price = price.toFixed(2).split('.')[0]
			return price
		},
		skuPriceFloat() {
			let price = 0
			if(this.skuData && this.skuData.price) {
				price = this.skuData.price
			}
			price = price.toFixed(2).split('.')[1]
			return price
		},
		reducedPriceFloat() {
		let afterCouponPrice = 0;
		let list = []
		if (this.skuData && this.skuData.afterCouponPrice) {
			afterCouponPrice = this.skuData.afterCouponPrice;
		}
		list = afterCouponPrice.toFixed(2).split(".");
		return list;
		},
		oldPriceflot() {
		let oldPrice = 0;
		let list = []
		if (this.skuData && this.skuData.oldPrice) {
			oldPrice = this.skuData.oldPrice;
		}
		list = oldPrice.toFixed(2).split(".");
		return list;
		}
	},
	methods: {
		changeAttention() {
			this.$emit('changeAttention');
		},
		previewImg(index) {
      		uni.previewImage({
        	current: index,
        	urls: this.skuData.images,
        	indicator: "default"
      		})
    	},
		// 轮播切换
		bannerChange(data) {
			this.bannerCurrent = data.target.current;
		},
		play() {
			this.controlsShow = true
		},
		// 视频播放
		plays() {
			let that = this;
			if (that.skuData.spuVideo) {
				let videoContext = uni.createVideoContext("videoBanner", that)
				videoContext.play()
			}
			that.controlsShow = true;
		},
		// 视频播放完
		endVideo() {
			// this.controlsShow = false
		},
		openCouponModule() {
      		this.$parent.$refs.couponUnit.openCouponModel()
    	},
		initData() {
			this.init()
		},
		pitchOnFun(v, treeItem, index) {
			if (v.disabled) return;
			// this.initialSku[treeItem.k_s] == v.id ? (this.initialSku[treeItem.k_s] = null) : (this.initialSku[treeItem.k_s] = v.id);			

			this.firstOrderSkuId = v.id
      		this.$emit("restDetails", this.firstOrderSkuId, this.activeImg, true);
		},
		// 计算Sku选择属性是否可选
		calcSkuDisabled() {
			// this.tree.forEach(treeItem => {
			// 	treeItem.v.forEach(vItem => {
			// 		vItem.disabled = this.filterSku(treeItem.k_s, vItem.id);
			// 	});
			// });
			// let data = this.tree[0].v
			// data = data.map((item) => {
			// 	item.noSdk = item.disabled ? 0 : 1
			// 	return item
			// })
			// this.treeLength = data.filter((item) => {
			// 	return item.noSdk == 1
			// })
			// this.treeLength = this.treeLength || []
			let data = this.skuDetail.list        
			this.treeLength = data.filter((item) => {
				return item.stock_num > 0
			}) 
		},
				// 过滤当前规格选项
			filterSku(s, sId) {
				this.filterList = this.skuDetail.list.filter(el => {
					let filterResult = true;
					let filterInitialSku = this.$u.deepClone(this.initialSku);
					filterInitialSku[s] = sId;
					for (let i in filterInitialSku) {
						if (filterInitialSku[i] && filterInitialSku[i] !== el[i]) {
							filterResult = false;
						}
					}
					return filterResult === true;
				});
				let hasStock = false;
				this.filterList.forEach(filEl => {
					if (filEl.stock_num > 0) {
						hasStock = true;
					}
				});
				if (this.filterList.length === 1 && this.initialSku[s] == sId) {
					// try {
					if (this.marketingVos.length && this.marketingVos[0].type == '13') {
						if (this.filterList[0].stock_num > this.marketingVos[0].panicBuy.limitNum && this.marketingVos.length && this.marketingVos[0].iSeckill) {
							if (this.marketingVos[0].panicBuy.limitNum != -1) {
								this.limitAddNum = this.marketingVos[0].panicBuy.limitNum;
							} else {
								this.limitAddNum = 10000000;
							}
						}
					} else if (this.marketingVos.length && this.marketingVos[0].type == '16' && this.marketingVos[0].specialArea.limitNum < this.filterList[0].stock_num) {
						if (this.marketingVos[0].specialArea.limitNum != -1) {
							this.limitAddNum = this.marketingVos[0].specialArea.limitNum;
						} else {
							this.limitAddNum = 10000000;
						}
					} else {
						this.limitAddNum = this.filterList[0].stock_num;
					}
					let skuId = this.filterList[0].id;
					this.firstOrderSkuId = skuId;
					let ele = this.skuDetail.list.filter(item=>{
						return item.id == this.firstOrderSkuId
					})
					this.activeImg = ele[0].imgUrl
				}
				return !hasStock;
			},
			//商品规格相关-起
		init() {
        	this.skuDetail = this.skuData;
			this.tree = this.skuDetail.sku.tree.map(el => {
				el.v = el.v.map(eel => {
					eel.disabled = false;
					return eel;
				});
				return el;
			});
			this.skuData.sku.tree.forEach((item, index) => {
				if (index != 0) {
					item.v.forEach((temp, i) => {
						temp.imgUrl = '';
					});
				} else {
					item.v.forEach((temp, i) => {
						temp.previewImgUrl = temp.imgUrl;
					});
				}
			});
			this.initialSku = this.skuDetail.sku.initialSku;
			this.firstOrderSkuId = this.skuId
        	this.calcSkuDisabled();
    	},
		goActity(e) {
			this.$wsf.go("firstOrder", {id:e.id});
		},
		// 去到专题活动页面
        toThematic(item) {
            this.$wsf.go('specialModule', {
                id: item.id,
				spuId: this.skuData.spuId
            })
        }
	}
};
</script>

<style scoped lang="scss">
.bannerBox{
	position:relative
}
.currentBox{
	position:absolute;
	right: 32rpx;
	bottom: 32rpx;
	color:#fff;
	height: 40rpx;
	display: inline-flex;
	align-items: center;
	padding: 0 16rpx;
	border-radius: 24rpx;
	background: rgba(0, 0, 0, 0.8);
	font-size: 24rpx;
}
.swiper{
	width:100%;
	height:750rpx;
	.swiper-img{
		width:100%;
		height:100%
	}
}
.bannerVideo{
  position: absolute;
  width: 100%;
  height: 375px;
  z-index: 1;
}
.base-info {
	align-items: center;
  position: relative;
	.soldout-img {
		position: absolute;
		right: 146rpx;
		top: -64rpx;
		width: 140rpx;
		height: 140rpx;
	}
	.current-price {
		line-height: 68rpx;
		height: 68rpx;
		color: #FE3040;
		font-weight: 600;
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;
		i {
		display: inline;
		font-size: 32rpx;
		font-family: DINAlternate-Bold, DINAlternate;
		}
		span {
		font-size: 60rpx;
		font-family: DINAlternate-Bold, DINAlternate;
		}
		.u-font-text {
		font-size: 32rpx;
		font-family: DINAlternate-Bold, DINAlternate;
		}
		.reduced-price {
			line-height: normal;
      height: 56rpx;
      background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
      border-radius: 30rpx 30rpx 30rpx 4rpx;
      padding: 0 16rpx;
      color: #fff;
      font-weight: 600;
      margin-left: 4rpx;
      span {
        font-size: 22rpx;
        font-weight: 500;
		font-family: PingFangSC-Medium, PingFang SC;
      }
      i {
        font-size: 26rpx;
        padding-left: 4rpx;
		font-family: DINAlternate-Bold, DINAlternate;
      }
      .txt1 {
        font-size: 40rpx;
		font-family: DINAlternate-Bold, DINAlternate;
      }
      .txt2 {
        font-size: 26rpx;
		font-family: DINAlternate-Bold, DINAlternate;
      }
    }
		.original-price {
			font-weight: normal;
			line-height: 24rpx;
			text-decoration: line-through;
			color: #666;
			font-size: 32rpx;
			margin-left: 20rpx;
		}
		.fqz-price {
      font-size: 32rpx;
      .special {
        font-size: 60rpx;
      }
    }
	}
	.commission-price {
		font-size: 28rpx;
		color: #fd302c;
		line-height: 28rpx;
		font-weight: 500;
		padding-top: 6rpx;
	}
 .tag-part {
    margin-top: 16rpx;
    display: flex;
    align-items: center;
    .sale-price {
      display: inline-block;
      margin-right: 12rpx;
      width: 116rpx;
      height: 28rpx;
      position: relative;
      .price-tag {
        height: 100%;
        width: 60rpx;
        text-align: center;
        line-height: 28rpx;
        color: #fff;
        font-size: 18rpx;
        position: absolute;
        right: 0;
        top: 0;
      }
      image {
        width: 100%;
        height: 100%;
      }
    }
    .activity-type {
      display: inline-block;
      margin-right: 16rpx;
      color: #ffffff;
      font-size: 20rpx;
      text-align: center;
      // width: 92rpx;
      padding: 0rpx 6rpx;
      // height: 28rpx;
      border-radius: 4rpx;
      background: -webkit-linear-gradient(left, #fe5229, #ff8b40);
    }
    .bug-send {
      margin-right: 16rpx;
      display: inline-block;
      padding: 0 6rpx;
      line-height: 28rpx;
      height: 28rpx;
      border-radius: 4rpx;
      border: 2rpx solid $wsf-color-red;
      font-size: 20rpx;
      color: $wsf-color-red;
    }
  }
	.mark {
		min-width: 54rpx;
	}
}
.product-title {
	font-weight: bold;
	font-size: 32rpx;
	line-height: 40rpx;
    margin-bottom: 12rpx;
	color: #191919;
}
.product-describe {
	font-size: 26rpx;
    color: #999999;
    line-height: 34rpx;
}

.coupon-module {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16rpx 0 32rpx;
  .coupon-mark {
    height: 40rpx;
    border-radius: 4rpx;
    border: 2rpx solid #E60113;
    padding: 0 8rpx;
    font-size: 24rpx;
    font-weight: 500;
    display: inline-flex;
    margin-right: 8rpx;
    align-items: center;
    color: #E60113;
  }
  .coupon-module-right {
    color: #E60113;
    font-size: 24rpx;
    display: inline-flex;
    align-items: center;
    .expand-image {
      width: 32rpx;
      height: 32rpx;
      margin-left: 12rpx;
    }
  }
}
.property-swiper {
  background: #FFFFFF;
  border-radius: 0rpx 0rpx 32rpx 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
  padding-top: 8rpx;
  padding-bottom: 16rpx;
  .num-property {
    width: 96rpx;
    height: 88rpx;
    border-radius: 16rpx;
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
	background-color: rgba(229,229,229,0.22);
    p {
      font-size: 22rpx;
	  color: #C3C3C3;
    }
  }
  .property {
    width: 586rpx;
    .scroll-view_H {
      white-space: nowrap;
      width: 100%;
      .flex-swiper {
        display: flex;
        img {
          flex-shrink: 0;
          width: 96rpx;
          height: 88rpx;
          display: block;
          margin-right: 16rpx;
          background: #F6F6F6;
          border-radius: 16rpx;
          border: 2rpx solid #EEEEEE;
          object-fit: cover;
        }
        .activity {
          border: 2rpx solid #FF0A35;
        }
        .disable {
            background-color: #f2f2f2;
            border: 1px solid #f2f2f2;
            color: #bababa;
          }
      }
    }
  }
}
.conent-nav {
  margin: 20rpx 24rpx;
  background: #ffffff;
  padding: 29rpx 24rpx;
  border-radius: 24rpx;
}
.reduced-original {
  display: flex;
  align-items: baseline;
  color: #C3C3C3;
  padding-top: 10rpx;
  margin-left: 8rpx;
  position: relative;
  &::after {
    content: ' ';
    width: 100%;
    height: 2rpx;
    background-color: #c3c3c3;
    position: absolute;
    left: 0;
    top: 57%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  i {
    font-size: 22rpx !important;
	font-family: DINAlternate-Bold, DINAlternate;
  }
  .txt1 {
    font-size: 32rpx !important;
	font-family: DINAlternate-Bold, DINAlternate;
  }
  .txt2 {
    font-size: 22rpx !important;
	font-family: DINAlternate-Bold, DINAlternate;
  }
}
.activity_ {
  width: 100%;
  height: 64rpx;
  margin-bottom: 22rpx;
  display: flex;
  background-image: url('https://wsjc-web.wsecar.com/wsf-mall/skuDetail/bj-activity.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  align-items: center;
  justify-content: space-between;
  .text {
    display: flex;
    align-items: center;
    img {
      width: 48rpx;
      height: 48rpx;
      padding-left: 10rpx;
    }
    .p {
      flex-shrink: 0;
      width: 460rpx;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding-left: 6rpx;
      font-size: 26rpx;
      color: #FF0A35;
    }
    .p_1 {
      display: flex;
      align-items: center;
      .imgage {
        width: 220rpx;
        height: 50rpx;
      }
      text {
        padding-left: 10rpx;
        font-size: 26rpx;
        color: #FF0A35;
      }
    }
  }
  img {
    width: 32rpx;
    height: 32rpx;
    padding-right: 10rpx;
  }
}
.coupon-ticket {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
  .coupon-left {
    width: 538rpx;
    .scroll-view_tab {
      white-space: nowrap;
      width: 100%;
      .flex-tab {
        display: flex;
		.time-box-tab {
          	height: 48rpx;
          	line-height: 48rpx;
        	padding: 0 12rpx;
          	text-align: center;
          	margin-right: 12rpx;
          	background: rgba(254,48,64,0.1);;
          	border-radius: 8rpx;
		}
        .time-tab {
          font-size: 26rpx;
          color: #FE3040;
        }
      }
    }
  }
  .coupon-right {
    display: flex;
    height: 50rpx;
    align-items: center;
    span {
      font-size: 26rpx;
      color: #FF450C;
    }
    img {
      width: 32rpx;
      height: 32rpx;
    }
  }
}
.expression {
	display: flex;
	.left-time {
	  	display: flex;
		padding-bottom: 10rpx;
		.tab-item-box {
            display: flex;
            align-items: center;
			margin-right: 8rpx;
            padding-right: 8rpx;
            border-radius: 8rpx;
			font-size: 20rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #ff0a35;
			border: 0.5rpx solid #ff3700;
		}
		  .tab-item-box--tip{
				width: 30rpx;
				height: 28rpx;
				text-align: center;
				line-height: 28rpx;
				background: rgba(255, 69, 12, 0.13);					
				font-size: 20rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #FF450C;
			}
			.tab-item-box--val{
				margin-left: 4rpx;	
				font-size: 20rpx;
				color: #ff450c;
			}
	}
	.performance {
	  	margin-right: 8rpx;
	  	display: flex;
		align-items: center;
	  	padding-bottom: 10rpx;
	  	color: #008864;
	  	font-size: 22rpx;
	  	.performance-img {
	  	  width: 32rpx;
	  	  height: 32rpx;
	  	}
	}
}
.activitity-mark {
    height: 64rpx;
    border-radius: 32rpx;
    margin-bottom: 20rpx;
    padding: 0 8rpx;
    display: flex;
    align-items: center;
	justify-content: space-between;
    line-height: 34rpx;
    font-size: 26rpx;
    background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/detail/bj-activity.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
	.activitity-mark-left {
		display: flex;
		align-items: center;
	}
    .activitity-mark-text {
        font-size: 26rpx;
        color: #FF450C;
        width: 460rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .hot-icon {
        width: 48rpx;
        height: 48rpx;
        margin-right: 16rpx;
    }
    .arrow-right-icon {
        width: 32rpx;
        height: 32rpx;
    }
}
</style>
