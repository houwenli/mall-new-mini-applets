<template>
    <view>
        <view class="column-goods">
            <view class="column-goods-image">
                <u-image
                    height="260rpx"
                    width="260rpx"
                    loading-icon="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/f4aef8f9d91387ce0d074d378b4cc384.png?imageView2/1/w/513"
                    border-radius="16rpx"
                    :src="item.url + '?imageView2/1/w/520'"></u-image>
            </view>
            <view class="column-goods-info">
                <view class="column-goods-info-top">
                    <view class="name u-line-2">
                        {{ item.name || item.skuName }}
                    </view>
                    <view class="desc" v-if="item.subTitle">
                        {{ item.subTitle }}
                    </view>
                    <!-- 商品标签-->
                    <view class="column-info-goodstags" v-if="item.skuLable && item.skuLable.goodsTagList && item.skuLable.goodsTagList.length">
                        <view v-for="(ele, index) in item.skuLable.goodsTagList.slice(0,2)" :key="index">	
                        <text>
                            {{ ele.tagName }}
                        </text>		
                        </view>			
                    </view>
                    <view class="comment" v-if="item.skuLable">
                        <block v-if="item.skuLable.baseLabel.comment">
                            {{ item.skuLable.baseLabel.comment | saleNumCount }}评论
                            <text class="line"></text>
                        </block>
                        <block v-if="item.skuLable.baseLabel.applauseRate != '0'">
                            {{ item.skuLable.baseLabel.applauseRate }}%好评
                            <text class="line"></text>
                        </block>
                        <block v-if="item.skuLable.baseLabel.salesVolume">{{ item.skuLable.baseLabel.salesVolume | saleNumCount }}人已买</block>
                    </view>
                    <!-- 优惠券和活动 -->
                    <view class="column-coupon-activty">
                        <view v-for="(item, index) in couponShowlist" :key="index" class="column-coupon-activty-item">
                            {{ item.faceValue }}
                        </view>
                    </view>
                    <view>
                        <view class="activitity-mark" v-if="item.skuLable && item.skuLable.markIngLabel && item.skuLable.markIngLabel.length">
                            <image class="hot-icon" :src="hotIcon" />
                            <text>
                                {{ item.skuLable.markIngLabel[0].label }}
                            </text>
                            <image class="arrow-right-icon" :src="arrowRightIcon" />
                        </view>
                    </view>
                </view>
                <view class="column-goods-info-bottom">
                    <view class="column-goods-price">
                        <text class="column-after-coupon-text" v-if="item.skuLable.couponLable && item.skuLable.couponLable.afterCouponPrice">券后</text>
                        <text>¥</text>
                        <text class="column-goods-price-num" v-if="item.skuLable.couponLable && item.skuLable.couponLable.afterCouponPrice">
                            {{ item.skuLable.couponLable.afterCouponPrice | priceInt }}
                        </text>
                        <text class="column-goods-price-num" v-else>{{ item.finalPrice | priceInt }}</text>
                        <text v-if="item.skuLable.couponLable && item.skuLable.couponLable.afterCouponPrice">
                            {{ item.skuLable.couponLable.afterCouponPrice | priceFloat }}
                        </text>
                        <text v-else>{{ item.finalPrice | priceFloat }}</text>
                        <view class="column-coupon" v-if="item.skuLable && item.skuLable.couponLable">
                            <image class="triangle" :src="triangleIcon" />
                            <view class="bubble">
                                <block v-if="item.skuLable.couponLable.couponsType == 1">
                                    满{{ item.skuLable.couponLable.amountLimitation }}减{{ item.skuLable.couponLable.faceValue | tenThousandCount }}
                                </block>
                                <block v-else-if="item.skuLable.couponLable.couponsType == 2">
                                    {{ item.skuLable.couponLable.faceValue | tenThousandCount }}折
                                </block>
                                <block v-else>立减{{ item.skuLable.couponLable.faceValue | tenThousandCount }}</block>
                            </view>
                        </view>
                        <view class="column-old-price" v-else-if="item.finalPrice != item.price">
                            <text class="old-price-small">¥</text>
                            <text class="old-price">{{ item.price | priceInt }}</text>
                            <text class="old-price-small">{{ item.price | priceFloat }}</text>
                        </view>
                    </view>
                    <view class="column-goods-buy">
                        <block v-if="item.skuLable.couponLable && item.skuLable.couponLable.afterCouponPrice">
                            <text class="old-price-small">¥</text>
                            <text class="old-price">{{ item.finalPrice | priceInt }}</text>
                            <text class="old-price-small" style="margin-right: 4rpx">{{ item.finalPrice | priceFloat }}</text>
                        </block>
                        <view
                            class="performance-mark"
                            v-if="item.skuLable && item.skuLable.performanceScoreLabel && item.skuLable.performanceScoreLabel.performanceScore > 0">
                            <image class="icon" :src="performanceIcon" />
                            绩效分: {{ item.skuLable.performanceScoreLabel.performanceScore | performanceCount }}
                        </view>
                    </view>
                    <view v-if="!fromUser" class="share-button" @tap.stop="$emit('handleShareProduct', item)">
                        <view>
                            <text class="price-label activitity-mark-text">预估佣金</text>
                        </view>

                        <view>
                            <text class="share-button-price activitity-mark-text">{{ item.preCommission | priceInt }}</text>
                            <text class="share-button-price price-fen activitity-mark-text">{{ item.preCommission | priceFloat }}</text>
                        </view>
                        <!-- <view class="share-buttin-bg">分享赚</view> -->
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import HotRanking from '@/components/wsf-goods-list/hot-ranking.vue';
    import HotSwiper from '@/components/wsf-goods-list/hot-swiper.vue';
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
        components: { HotRanking, HotSwiper },
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
            }
        },
        data() {
            return {
                performanceIcon: this.$oss + 'wsf-mall/home/ic_performance_mark.png',
                triangleIcon: this.$oss + 'wsf-mall/home/bubble-triangle.png',
                hotIcon: this.$oss + 'wsf-mall/skuDetail/icon-actity.png',
                arrowRightIcon: this.$oss + 'wsf-mall/skuDetail/icon-red.png'
            };
        }
    };
</script>

<style scoped lang="scss">
    .column-goods {
        margin-bottom: 20rpx;
        display: flex;
        justify-content: flex-start;
        // align-items: center;
        background-color: #fff;
        border-radius: 16rpx;
        overflow: hidden;
        padding: 16rpx;
        min-height: 292rpx;
        .column-goods-image {
            margin-right: 16rpx;
            background: #fff;
        }
        .column-goods-info {
            height: 100%;
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;

            .column-goods-info-top {
                .name {
                    color: #191919;
                    font-size: 26rpx;
                    font-weight: 500;
                    line-height: 34rpx;
                }
                .desc {
                    width: 410rpx;
                    color: #e3903f;
                    line-height: 30rpx;
                    height: 30rpx;
                    font-size: 22rpx;
                    margin-top: 8rpx;
                    overflow: hidden;
                }
                // 商品标签
                .column-info-goodstags {
                    display: flex;
                    align-items: center;
                    margin-bottom: 8rpx;
                    text {
                        margin-right: 8rpx;
                        border-radius: 8rpx;
                        border: 0.5rpx solid;
                        // border-image: linear-gradient(90deg, rgba(255, 95, 46, 1), rgba(255, 10, 53, 1)) 1 1;
                        font-size: 20rpx;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #ff0a35;
                        line-height: 28rpx;
                        // -webkit-background-clip: text;
                        // -webkit-text-fill-color: transparent;
                        padding: 0 8px;
                    }
                    > view:last-of-type {
                        text {
                            margin-right: 0;
                        }
                    }
                }
                .comment {
                    font-size: 22rpx;
                    color: #999999;
                    line-height: 30rpx;
                    display: inline-flex;
                    align-items: center;
                    padding-top: 8rpx;
                    .line {
                        display: inline-block;
                        width: 2rpx;
                        height: 24rpx;
                        background: #c3c3c3;
                        margin: 0 8rpx;
                    }
                }
                .activitity-mark {
                    height: 28rpx;
                    background: #ffedf0;
                    border-radius: 14rpx;
                    background: #ffedf0;
                    border-radius: 14px;
                    margin-top: 12rpx;
                    padding: 0 4rpx;
                    display: inline-flex;
                    align-items: center;
                    line-height: 28rpx;
                    font-size: 20rpx;
                    text {
                        font-size: 20rpx;
                        background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        max-width: 358rpx;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .hot-icon {
                        width: 20rpx;
                        height: 20rpx;
                        margin-right: 4rpx;
                    }
                    .arrow-right-icon {
                        width: 16rpx;
                        height: 16rpx;
                        margin-left: 4rpx;
                    }
                }
            }
            // 活动和优惠券显示
            .column-coupon-activty {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                margin-top: 12rpx;
                // margin-bottom: 12rpx;
                &-item {
                    background: #ffeee9;
                    border-radius: 8rpx;
                    font-size: 20rpx;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #ff450c;
                    line-height: 28rpx;
                    padding: 4rpx 12rpx;
                    margin-right: 8rpx;
                    margin-bottom: 12rpx;
                }
                &-item:last-of-type {
                    margin-right: 0;
                }
            }
            .column-goods-info-bottom {
                .column-goods-price {
                    font-size: 22rpx;
                    color: #ff0a35;
                    line-height: 46rpx;
                    text {
                        font-size: 22rpx;
                        font-weight: bold;
                        font-family: DINAlternate-Bold, DINAlternate;
                    }
                    .column-goods-price-num {
                        font-size: 40rpx;
                    }
                    .column-original-price {
                        font-size: 20rpx;
                        color: #666;
                        margin-left: 16rpx;
                    }
                    .column-after-coupon-text {
                        font-size: 20rpx;
                        line-height: 28rpx;
                    }
                }
                .column-coupon {
                    height: 36rpx;
                    display: inline-flex;
                    align-items: flex-end;
                    vertical-align: sub;
                    .triangle {
                        width: 10rpx;
                        height: 10rpx;
                        margin-right: -2rpx;
                    }
                    .bubble {
                        border-radius: 8rpx 16rpx 16rpx 0;
                        height: 36rpx;
                        line-height: 36rpx;
                        font-size: 20rpx;
                        color: #fff;
                        padding: 0 12rpx 0 8rpx;
                        background: #ff0a35;
                    }
                }
                .column-old-price {
                    display: inline-block;
                    position: relative;
                    color: #c3c3c3;
                    font-size: 26rpx;
                    margin-left: 8rpx;
                    &::after {
                        content: ' ';
                        width: 100%;
                        height: 2rpx;
                        background-color: #c3c3c3;
                        position: absolute;
                        left: 0;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                }
                .column-goods-buy,
                .column-old-price {
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
                    .performance-mark {
                        height: 32rpx;
                        background: linear-gradient(90deg, #ecfffc 0%, #f4faff 100%);
                        border-radius: 8rpx;
                        font-size: 22rpx;
                        color: #008864;
                        line-height: 32rpx;
                        display: inline-block;
                        .icon {
                            width: 32rpx;
                            height: 32rpx;
                            vertical-align: middle;
                            transform: translateY(-1rpx);
                        }
                    }
                }
            }

            .column-goods-info-name {
                padding-top: 8rpx;
                font-size: 26rpx;
                line-height: 34rpx;
                color: #191919;
                font-weight: 500;
            }
            .column-goods-info-price {
                width: 100%;
                color: $wsf-color-red;
                .column-goods-info-price-num {
                    font-size: 36rpx;
                    color: $wsf-color-red;
                    padding-left: 8rpx;
                }
                .column-goods-info-price-old {
                    font-size: 22rpx;
                    color: #999;
                    margin-left: 16rpx;
                    text-decoration: line-through;
                }
                .column-goods-info-price-original {
                    font-size: 20rpx;
                    color: #666;
                    margin-left: 16rpx;
                }
                .list-goods-item-info-coupon-text {
                    font-size: 24rpx;
                    margin-left: 4rpx;
                }
            }
        }
    }
    .share-button {
        position: relative;
        white-space: nowrap;
        // overflow: hidden;
        margin-top: 16rpx;
        display: flex;
        // justify-content: space-between;
        align-items: center;
        height: 64rpx;
        border-radius: 32rpx;
        width: 100%;
        padding-left: 16rpx;
        // border: 2rpx solid #ff0a35
        background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/share_earn_bg.png') 102% 0 no-repeat;
        background-size: 100% 100%;
    }
    .price-label {
        line-height: 26rpx;
        padding-right: 4rpx;
        font-size: 20rpx;
        color: #6e6e6e;
        vertical-align: middle;
    }
    .share-button-price {
        font-size: 26rpx;
        line-height: 34rpx;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #ff450c;
    }
    .price-fen {
        font-size: 22rpx;
        line-height: 30rpx;
    }
    .share-buttin-bg {
        position: absolute;
        right: 14rpx;
        line-height: 34rpx;
        text-align: center;
        font-weight: 600;
        font-size: 26rpx;
        color: #fff;
    }
</style>
