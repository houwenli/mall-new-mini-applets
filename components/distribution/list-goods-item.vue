<template>
    <view class="waterfall-goods waterfall-goods-left">
        <view style="height: 340rpx; width: 340rpx; overflow: hidden; border-radius: 24rpx 24rpx 0 0; background: #fff">
            <u-image
                height="340rpx"
                width="340rpx"
                loading-icon="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/f4aef8f9d91387ce0d074d378b4cc384.png"
                border-radius="24rpx 24rpx 0 0"
                :src="item.productUrl + '?imageView2/1/w/504'"></u-image>
        </view>
        <view class="waterfall-goods-info">
            <!-- 商品名称 -->
            <view class="waterfall-goods-name u-line-2">{{ item.skuName }}</view>

            <!-- 商品副标题-->
            <!-- <view v-if="item.subTitle" class="waterfall-goods-describe">
                {{ item.subTitle }}
            </view> -->

            <!-- 商品标签-->
            <view class="shop-info-goodstags" v-if="data && data.goodsTagList && data.goodsTagList.length">
                <view v-for="(val, index) in data.goodsTagList.slice(0, 2)" :key="index" class="shop-info-goodstags-item">
                   {{ val.tagName }}
                </view>
            </view>

            <!-- 商品评论 好评率 -->
            <view v-if="data && (data.baseLabel.comment || data.baseLabel.applauseRate * 1)" class="waterfall-goods-comment">
                <block>{{ 1 | saleNumCount }}评论</block>
                <text class="line"></text>
                <block>{{ 10 }}%好评</block>
            </view>

            <view
                class="performance-mark"
                v-if="item.skuLable && item.skuLable.performanceScoreLabel && item.skuLable.performanceScoreLabel.performanceScore > 0">
                <image class="icon" :src="performanceIcon" />
                绩效分: {{ item.skuLable.performanceScoreLabel.performanceScore | performanceCount }}
            </view>

            <!-- 优惠券 -->
            <view v-if="data && data.couponLable && data.couponLable.length > 0" class="waterfall-coupon">
                <!-- <view class="bubble" v-for="(item, index) in couponShowlist" :key="index">
                    {{ item | couponLableFilter }}
                </view> -->
                <view class="bubble" v-for="item in data.couponLable.slice(0, 2)" :key="item.id">
                    {{ item | couponLableFilter }}
                </view>
            </view>

            <!-- 商品价格 -->
            <view class="waterfall-goods-price">
                <!-- 有优惠券的价格展示         -->
                <view class="waterfall-goods-buy" v-if="isLinePice">
                    <text class="waterfall-after-coupon-text waterfall-goods-text">券后</text>
                    <text class="waterfall-goods-text">¥</text>
                    <text class="waterfall-goods-price-num waterfall-goods-text">{{ checkedCouponShowlist[0].afterCouponPrice | priceInt }}</text>
                    <text v-if="checkedCouponShowlist[0].afterCouponPrice < 10000" class="waterfall-goods-text">
                        {{ checkedCouponShowlist[0].afterCouponPrice | priceFloat }}
                    </text>
                    <block>
                        <text class="old-price-small waterfall-goods-text">¥</text>
                        <text class="old-price waterfall-goods-text">{{ item.finalPrice | priceInt }}</text>
                        <text class="old-price-small waterfall-goods-text" style="margin-right: 8rpx">{{ item.finalPrice | priceFloat }}</text>
                    </block>
                </view>

                <view v-else>
                    <!-- 添加福气值逻辑 -->
                    <view class="fqz-price" v-if="item.integralPoint > 0">
                        <text class="special">
                            {{ item.integralPoint }}
                        </text>
                        福气值+
                        <text>
                            {{ item.deductionAfterPrice }}
                        </text>
                        元
                    </view>
                    <template v-else>
                        <text class="waterfall-goods-text">¥</text>
                        <text class="waterfall-goods-price-num waterfall-goods-text">{{ item.finalPrice | priceInt }}</text>
                        <text class="waterfall-goods-text">
                            {{ item.finalPrice | priceFloat }}
                        </text>
                    </template>
                    
                </view>
            </view>
            <view v-if="data && data.baseLabel.salesVolume" class="waterfall-goods-buy">
                <text class="saleNum">{{ data.baseLabel.salesVolume | saleNumCount }}人已买</text>
            </view>

            <view v-if="data && data.thematicLabel" class="activitity-mark" @tap.stop="toThematic(data.thematicLabel)">
                <image class="hot-icon" :src="hotIcon" />
                <text class="activitity-mark-text">{{ data.thematicLabel.subjectLabel }}</text>
                <image class="arrow-right-icon" :src="arrowRightIcon" />
            </view>

            <view v-if="!fromUser" class="share-button" @tap.stop="$emit('handleShareProduct', item)">
                <!-- <view>
                    <text class="price-label activitity-mark-text">预估佣金</text>
                </view>

                <view>
                    <text class="share-button-price activitity-mark-text">{{ item.preCommission | priceInt }}</text>
                    <text class="share-button-price price-fen activitity-mark-text">{{ item.preCommission | priceFloat }}</text>
                </view> -->
                <view class="share-button-box">
                    <text class="price-label activitity-mark-text">预估佣金</text>
                    <text class="share-button-price activitity-mark-text">{{ item.preCommission | priceInt }}</text>
                    <text class="share-button-price price-fen activitity-mark-text">{{ item.preCommission | priceFloat }}</text>
                </view>

                <!-- <view class="share-buttin-bg">分享赚</view> -->
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            item: {
                type: Object,
                default: {}
            },
            fromUser: {
                type: Boolean,
                default: false
            }
        },
        filters: {
            tenThousandCount(val) {
                if (val && Number(val) >= 10000) {
                    return parseInt((Number(val) / 10000) * 10) / 10 + '万';
                } else {
                    return parseInt(Number(val) * 10) / 10;
                }
            },
            performanceCount(val) {
                if (val && Number(val) >= 10000) {
                    return parseInt((val / 10000) * 10) / 10 + '万分';
                } else if (val && Number(val) >= 1000) {
                    return parseInt(Number(val) / 1000) + '000+分';
                } else if (val && Number(val) >= 100) {
                    return parseInt(Number(val) / 100) + '00+分';
                } else {
                    return val + '分';
                }
            },
            saleNumCount(val) {
                if (val && Number(val) > 999) {
                    return '999+';
                } else if (val && Number(val) > 99) {
                    return parseInt(Number(val) / 100) + '00+';
                } else {
                    return val;
                }
            },
            priceInt(price) {
                let int;
                if (price && Number(price) < 10000) {
                    int = Number(price).toFixed(2).split('.')[0];
                } else if (price && Number(price) >= 10000) {
                    int = parseInt(price);
                } else {
                    int = '0';
                }
                return int;
            },
            priceFloat(price) {
                let float;
                if (price && Number(price) < 10000) {
                    float = '.' + Number(price).toFixed(2).split('.')[1];
                } else if (price && Number(price) >= 10000) {
                    float = '';
                } else {
                    float = '.00';
                }
                return float;
            },
            couponLableFilter(item) {
                let showLabel = '';
                if (item.couponsType == 2) {
                    showLabel = item.faceValue + '折';
                } else if (item.couponsType == 3) {
                    showLabel = '立减' + item.faceValue + '元';
                } else if (item.couponsType == 1) {
                    showLabel = `满${item.amountLimitation}减${item.faceValue}`;
                }
                return showLabel;
            }
        },
        data() {
            return {
                performanceIcon: this.$oss + 'wsf-mall/home/ic_performance_mark.png',
                triangleIcon: this.$oss + 'wsf-mall/home/bubble-triangle.png',
                hotIcon: this.$oss + 'wsf-mall/skuDetail/icon-actity.png',
                arrowRightIcon: this.$oss + 'wsf-mall/skuDetail/icon-red.png',
                data: this.item.skuLable
            };
        },
        computed: {
            checkedCouponShowlist() {
                let couponlist = (this.data && this.data.couponLable) || [];
                let checkedCouponlist = couponlist.filter(item => {
                    return item.checked;
                });
                return checkedCouponlist;
            },

            // 有优惠价
            isLinePice() {
                return this.checkedCouponShowlist[0] && this.checkedCouponShowlist[0].afterCouponPrice != this.item.finalPrice;
            }
        },

        methods: {
            // 去到专题活动页面
            toThematic(item) {
                this.$wsf.go('specialModule', {
                    id: item.id,
                    spuId: item.spuId
                });
            }
        }
    };
</script>

<style scoped lang="scss">
    .waterfall-goods-left {
        margin-right: 22rpx;
    }

    /* 瀑布流样式 */
    .waterfall-goods {
        width: 340rpx;
        margin-bottom: 20rpx;

        .waterfall-goods-info {
            width: 100%;
            background-color: #fff;
            padding: 12rpx 16rpx 16rpx;
            border-radius: 0 0 24rpx 24rpx;

            .waterfall-goods-name {
                font-size: 26rpx;
                line-height: 34rpx;
                color: #191919;
                margin-bottom: 8rpx;
                font-weight: 500;
            }

            .waterfall-goods-describe {
                font-size: 22rpx;
                color: #e3903f;
                line-height: 30rpx;
                height: 30rpx;
                margin-bottom: 12rpx;
                overflow: hidden;
            }

            .shop-info-goodstags {
                margin-bottom: 6px;
                display: flex;
                align-items: center;
                
                .shop-info-goodstags-item {
                    margin-right: 8rpx;
                    font-size: 20rpx;
                    line-height: 20rpx;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: #ff0a35;
                    border: 0.5rpx solid #ff3700;
                    border-radius: 8rpx;
                    padding: 2rpx 12rpx;
                    &:last-of-type {
                        margin-right: 0;
                    }
                }
            }

            .waterfall-goods-comment {
                font-size: 22rpx;
                color: #999999;
                line-height: 30rpx;
                display: inline-flex;
                align-items: center;
                margin-bottom: 16rpx;

                .line {
                    display: inline-block;
                    width: 2rpx;
                    height: 24rpx;
                    background: #c3c3c3;
                    margin: 0 8rpx;
                }
            }

            .performance-mark {
                height: 32rpx;
                background: linear-gradient(90deg, #ecfffc 0%, #f4faff 100%);
                border-radius: 8rpx;
                font-size: 22rpx;
                color: #008864;
                line-height: 32rpx;
                margin-bottom: 8rpx;
                .icon {
                    width: 32rpx;
                    height: 32rpx;
                    vertical-align: middle;
                    transform: translateY(-1rpx);
                }
            }

            .waterfall-goods-price {
                font-size: 22rpx;
                color: #ff0a35;
                line-height: 40rpx;
                .waterfall-goods-text {
                    font-size: 22rpx;
                    font-weight: bold;
                    font-family: DINAlternate-Bold, DINAlternate;
                }

                .waterfall-goods-price-num {
                    font-size: 40rpx;
                }

                .waterfall-original-price {
                    font-size: 20rpx;
                    color: #666;
                    margin-left: 16rpx;
                }

                .waterfall-after-coupon-text {
                    font-size: 20rpx;
                    font-family: PingFangSC-Regular, PingFang SC;
                }
                .waterfall-goods-buy {
                    margin-left: 4rpx;
                    display: inline-block;
                }

                .fqz-price {
                    font-size: 20rpx;
                    .special {
                        font-size: 40rpx;
                    }
                }
            }

            .waterfall-coupon {
                padding-bottom: 4rpx;
                .bubble {
                    display: inline-block;
                    padding: 4rpx 12rpx;
                    background: #ffeee9;
                    border-radius: 8rpx;
                    font-size: 20rpx;
				    line-height: 20rpx;
                    color: #ff450c;
                    margin-right: 8rpx;
                    &:last-of-type {
                        margin-right: 0;
                    }
                }
            }

            .waterfall-goods-buy {
                .old-price {
                    font-size: 26rpx;
                    color: #c3c3c3;
                    font-weight: bold;
                }

                .old-price-small {
                    font-size: 22rpx;
                    color: #c3c3c3;
                    font-weight: bold;
                }

                .saleNum {
                    color: #c3c3c3;
                    font-size: 20rpx;
                }
            }

            .activitity-mark {
                height: 40rpx;
                background: #ffedf0;
                border-radius: 28rpx;
                background: #ffedf0;
                margin-top: 12rpx;
                // padding: 0 8rpx;
                display: flex;
                align-items: center;
                line-height: 48rpx;
                font-size: 20rpx;
                background: linear-gradient(84deg, #f4faff 0%, #ffe8f4 36%, #fff9e9 70%, #ffe9e9 100%);

                .activitity-mark-text {
                    font-size: 20rpx;
                    color: #ff0a35;
                    // width: 226rpx;
                    flex: 1;
                    line-height: 28rpx;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .hot-icon {
                    flex-shrink: 0;
                    width: 32rpx;
                    height: 32rpx;
                    margin-right: 6rpx;
                }

                .arrow-right-icon {
                    flex-shrink: 0;
                    width: 24rpx;
                    height: 24rpx;
                    margin-left: 4rpx;
                }
            }
            .share-button {
                position: relative;
                white-space: nowrap;
                overflow: hidden;
                margin-top: 16rpx;
                display: flex;
                // justify-content: start;
                align-items: center;
                height: 64rpx;
                border-radius: 32rpx;
                width: 100%;
                padding-left: 16rpx;
                // border: 2rpx solid #ff0a35;

                background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/share_earn_bg.png') 102% 0 no-repeat;
                background-size: 100% 100%;
            }
            .price-label {
                // line-height: 30rpx;
                line-height: 22rpx;
                padding-right: 2px;
                font-size: 22rpx;
                color: #6e6e6e;
                vertical-align: baseline;
                font-family: DINAlternate-Bold, DINAlternate;
            }
            .share-button-price {
                font-size: 32rpx;
                // line-height: 40rpx;
                line-height: 26rpx;
                font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
                color: #ff450c;
            }
            .price-fen {
                font-size: 26rpx;
                // line-height: 34rpx;
                line-height: 22rpx;
                font-family: DINAlternate-Bold, DINAlternate;
            }

            .share-button-box {
                display: flex;
                align-items: flex-end;
            }
        }
    }
</style>
