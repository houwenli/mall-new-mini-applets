<template>
    <view class="orderwrapper">
        <header class="ordertop">
            <view class="orderstatus">
                <view :class="{ ordercancel: [4, 5, 6, 7].includes(orderItem.status) }" class="orderstatus-text">
                    <text>{{ orderStatusText }}</text>
                    <image
                        v-if="[4, 5, 6, 7].includes(orderItem.status)"
                        src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/delete_icon.png"
                        class="orderdeleteimg"
                        @click="orderOperation(orderItem, '删除订单')"></image>
                </view>
            </view>
        </header>
        <view v-for="(logistics, index) in orderList" :key="index">
            <view
                class="logistics"
                @click.stop="toCheckLogistics(logistics)"
                v-if="logistics.kdniaoTrackVO && logistics.kdniaoTrackVO.tracesList && [2, 3].includes(orderItem.status)">
                <view class="logistics-box">
                    <view class="logistics-status">{{ logistics.kdniaoTrackVO.tracesList[0].action }}</view>
                    <view class="logistics-content">{{ logistics.kdniaoTrackVO.tracesList[0].acceptStation }}</view>
                    <view class="logistics-time logistics-content">{{ logistics.kdniaoTrackVO.tracesList[0].acceptTime }}</view>
                </view>
                <image src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-right.png" class="logistics-icon"></image>
            </view>
            <view v-for="sku in logistics.skus" :key="sku.id">
                <view class="orderbox">
                    <view class="goodsbox">
                        <text v-if="orderItem.orderType == 7" class="virtual_tag">虚拟</text>
                        <view>
                            <!-- <img :src="sku.skuImage" alt="" class="goodsimg" @click="toOrderDetail(orderItem)" /> -->
                            <u-lazy-load
                                :image="sku.skuImage"
                                class="goodsimg"
                                img-mode="scaleToFill"
                                height="148"
                                border-radius="16"
                                :is-effect="false"
                                @click="toOrderDetail(orderItem)"
                                loading-img="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/9b496c274eacdd0606e79714d08d8c1d.png"></u-lazy-load>
                            <!-- 赠品图片 -->
                            <img :src="r.url" v-for="(r, i) in sku.giftSkuInfos" :key="i" alt="" class="goodsimg" @click="toOrderDetail(orderItem)" />
                        </view>
                        <view class="goodsname" @click="toOrderDetail(orderItem)">
                            {{ sku.skuName }}
                        </view>
                    </view>
                    <view class="buy-num">x{{ sku.num }}</view>
                </view>
            </view>
        </view>
        <view class="order-collapse" v-if="orderSkuMore">
            <button class="collapse-bt" @click="toOrderDetail(orderItem)">
                查看更多
                <image src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-right.png" class="logistics-icon"></image>
            </button>
        </view>

        <view class="buy-price-box" @click="toOrderDetail(orderItem)">
            <view class="performate-point" v-if="orderItem.performanceScore > 0">
                <img src="https://wsjc-web.wsecar.com/wsf-mall/home/ic_performance_mark.png" />
                <text>绩效分:{{ orderItem.performanceScore | filterFraction }}分</text>
            </view>
            <view class="buy-price">
                <text>{{ [2, 3].includes(orderItem.status) ? '实付' : '应付' }}</text>
                <text class="price-icon font-din">¥</text>
                <text class="price-yuan font-din">{{ parseInt(orderItem.price) }}</text>
                <text class="price-fen font-din">.{{ parseFloat(orderItem.price).toFixed(2).split('.')[1] }}</text>
            </view>
        </view>
        <view class="orderfooter">
            <view v-if="orderItem.status == 1 && remainingTime > 0" class="remaining-time">
                <img class="remaining-time-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/ic_time.png" alt="" />
                支付剩余 {{ remainingTime | formatTime }}
            </view>
            <view style="flex: 1">
                <button v-if="orderItem.status == 4 && orderItem.evaluationStatus != 1" class="evaluate" @click.stop="orderOperation(orderItem, '评价晒单')">
                    评价晒单
                </button>
                <button
                    v-if="[4, 5, 6, 7].includes(orderItem.status) || ([2, 3].includes(orderItem.status) && orderItem.orderType != 12)"
                    class="order_status"
                    @click.stop="orderOperation(orderItem, '再次购买')">
                    {{ orderItem.orderType != 12 ? '再次购买' : '重新下单' }}
                </button>
                <button v-if="orderItem.status == 1" @click.stop="orderOperation(orderItem, '去支付')">去支付</button>
                <button v-if="orderItem.status == 3 && orderItem.orderType != 12" class="order_s3" @click.stop="orderOperation(orderItem, '确认收货')">
                    确认收货
                </button>
            </view>
        </view>
    </view>
</template>

<script>
    import { parseTimeData } from '@/mixins/utilFun';
    import uLazyLoad from '../../../uview-ui/components/u-lazy-load/u-lazy-load.vue';
    export default {
        components: { uLazyLoad },
        props: {
            orderItem: {
                type: Object,
                default: () => {
                    return {};
                }
            }
        },
        filters: {
            filterFraction(val, make) {
                let len = (val + '').length;
                switch (len) {
                    case 3:
                    case 4:
                        if (make && val == 1000) {
                            val = '999+';
                        } else {
                            val = parseInt(val / Math.pow(10, len - 1)) * Math.pow(10, len - 1) + '+';
                        }
                        break;
                    case 5:
                    case 6:
                    case 7:
                        if (make) {
                            val = '999+';
                        } else {
                            val = parseInt((val / 10000) * 10) / 10 + '万';
                        }
                        break;
                    default:
                        break;
                }
                return val;
            },
            formatTime(time) {
                let { hours, minutes, seconds } = parseTimeData(time);
                return `${minutes}分${seconds}秒`;
            }
        },
        data() {
            return {
                orderStatusMap: {
                    1: '等待付款',
                    2: '正在出库',
                    3: '等待收货',
                    4: '已完成',
                    5: '已取消',
                    6: '已取消',
                    7: '已取消'
                }, // 订单状态
                motorSatusMap: {
                    1: '等待支付',
                    2: '请前往门店取车',
                    3: '请前往门店取车',
                    4: '已完成',
                    5: '已取消',
                    6: '已取消',
                    7: '已取消'
                }, // 电动车订单状态
                more: true
            };
        },
        computed: {
            orderStatusText({ orderItem }) {
                if (orderItem.backStatus == 1 && (orderItem.status == 2 || orderItem.status == 3)) {
                    return '退款申请中';
                }

                if (orderItem.orderType == 12) {
                    return this.motorSatusMap[orderItem.status];
                } else {
                    return this.orderStatusMap[orderItem.status];
                }
            },

            // 订单列表
            orderList() {
                let { orderAndLogisticsList, status } = this.orderItem;

                let arr = orderAndLogisticsList.map(item => {
                        return {
                            ...item
                        };
                    }),
                    length = arr.length,
                    arrLength = 0;
                if (arr.length > 1) {
                    for (let index = 0; index < length; index++) {
                        const item = arr[index];

                        if (status != 2 && status != 3) {
                            if (!arr[index]) {
                                break;
                            }
                            let length = item.skus.length;
                            // 删除多余的sku
                            if (length + arrLength > 3) {
                                item.skus = item.skus.slice(0, 3 - arrLength);
                                // 有0个的代表已经满足三个了已经不需要显示了，删除后续的
                                if (item.skus.length === 0) {
                                    arr = arr.slice(0, index);
                                }
                            }
                            arrLength += item.skus.length;
                        } else {
                            if (index < 3) {
                                item.skus = [item.skus[0]];
                            } else {
                                // 超过三个删除
                                arr = arr.slice(0, 3);
                                break;
                            }
                        }
                    }
                } else {
                    arr[0].skus = arr[0].skus.slice(0, 3);
                }
                return arr;
            },

            orderSkuMore() {
                // 显示的订单商品数量
                let showOrderNum = this.orderList.reduce((pre, item) => {
                    return pre + item.skus.length;
                }, 0);

                // 显示的订单商品数量 是否和返回的一致，不一致则显示查看更多按钮
                return showOrderNum !== this.orderItem.skus.length;
            },

            // 待支付剩余时间
            remainingTime({ orderItem }) {
                let buyTime = new Date(orderItem.createTime.replace(/-/g, '/'));
                let endTime = 30 * 60 * 1000;
                let nowTime = new Date().getTime();
                return endTime - (nowTime - buyTime);
            }
        },
        methods: {
            // 查看物流
            toCheckLogistics(data, orderCode) {
                let query = {
                    id: this.orderItem.id,
                    type: 0
                };
                if (this.orderList.length > 1) {
                    query = {
                        id: data.skus[0].orderSkuId,
                        type: 2
                    };
                }
                this.$wsf.go('trackingCells', query);
            },

            // 去评价
            goEvaluate(item) {
                let params = { orderIds: item.orderIds };
                this.$wsf.go('EvaluationCenter', params);
            },

            // 再次购买
            buyAgain(item) {
                console.log(item, 'sssssssssssssss');
                if (item.orderType != 12) {
                    let list = item.skus;
                    if (list && list.length) {
                        let buyNowRequestList = [];
                        list.forEach(n => {
                            let skuObj = {
                                skuId: n.skuId,
                                recommendToken: null,
                                num: n.num,
                                // orderType=14集采订单 sourceType传5
                                sourceType: item.orderType * 1 === 14 ? 5 : n.sourceType,
                                storeId: n.storeId
                            };
                            buyNowRequestList.push(skuObj);
                        });
                        if(item.orderType * 1 === 14){
                            // 集采订单支付需要传企业代理商id
                            uni.setStorageSync("enterpriseAgencyId", item.enterpriseId);
                        }
                        buyNowRequestList = JSON.stringify(buyNowRequestList);
                        if (list && list.length > 1) {
                            this.$wsf.go('Settlement', { buyNowRequestList, cart: 1 });
                        } else {
                            this.$wsf.go('Settlement', { buyNowRequestList });
                        }
                    }
                } else {
                    this.$wsf.go('ToMotor', { skuId: item.skus[0].skuId });
                }
            },

            // 跳转评价模块
            goToComment(item) {
                const commentData = {
                    skuId: item.skuId,
                    orderId: item.orderId,
                    storeId: item.storeId,
                    storeName: item.storeName,
                    skuName: item.skuName,
                    skuImage: item.skuImage
                };
                this.$wsf.go('Comment', commentData);
            },

            orderOperation(item, type) {
                switch (type) {
                    case '再次购买':
                        this.buyAgain(item);
                        break;
                    case '评价晒单':
                        this.goEvaluate(item);
                        break;
                    default:
                        this.$emit('orderOperation', item, type);
                }
            },

            // 跳转详情
            toOrderDetail(item) {
                console.log('跳转订单详情', item);
                /* ToDo 跳转订单详情、电动车跳电动车详情 */
                if (item.orderType == 12) {
                    this.$wsf.go('motorOrderDetail', {
                        orderId: item.id,
                        backStatus: item.backStatus
                    });
                } else {
                    this.$wsf.go('PendingPayment', { orderId: item.id, backStatus: item.backStatus });
                }
            }
        }
    };
</script>
<style lang="less" scoped>
    .orderwrapper {
        position: relative;
        padding: 24rpx;
        border-radius: 16rpx;
        background-color: #fff;
        margin: 0 16rpx;
        margin-top: 20rpx;
        .ordertop {
            padding-bottom: 8rpx;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .orderstatus {
                // color: #e60113;
                font-size: 26rpx;
                color: #ff0a35;
                .orderstatus-text {
                    display: flex;
                    align-items: center;
                }
                .ordercancel {
                    color: #6e6e6e;
                }
                .orderdeleteimg {
                    margin-left: 16rpx;
                    width: 30rpx;
                    height: 30rpx;
                }
                .orderfinish {
                    .orderfinish_dImg {
                        position: absolute;
                        top: 16rpx;
                        right: 18rpx;
                    }
                    .orderfinishimg {
                        position: absolute;
                        top: 0;
                        right: 116rpx;
                        width: 120rpx;
                        height: 100rpx;
                    }
                }
            }
        }
        .orderbox {
            padding-top: 16rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #000;
            .buy-num {
                font-size: 26rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                color: #999999;
                line-height: 34rpx;
            }
            .goodsbox {
                display: flex;
                align-items: center;
                // overflow-x: scroll;
                position: relative;
                .virtual_tag {
                    width: 60rpx;
                    height: 32rpx;
                    line-height: 32rpx;
                    background: #e95762;
                    border-radius: 10rpx 20rpx 20rpx 0;
                    opacity: 0.8;
                    color: #ffffff;
                    font-size: 20rpx;
                    text-align: center;
                    position: absolute;
                    top: 0;
                }
                .goodsimg {
                    display: block;
                    width: 148rpx;
                    height: 148rpx;
                    border-radius: 16rpx;
                    margin-right: 16rpx;
                    overflow: hidden;
                }
                .moreImg:last-child {
                    padding-right: 175rpx;
                }
                .goodsname {
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                    width: 436rpx;
                    font-size: 26rpx;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 600;
                    color: #191919;
                    line-height: 34rpx;
                }
            }
            .goodsprice {
                font-size: 34rpx;
                font-weight: bold;
                // width: 5.8rem;
                text-align: right;
                span {
                    font-size: 24rpx;
                    transform: scale(0.92);
                }
                .point {
                    color: #e60113;
                    font-size: 26rpx;
                    width: 100%;
                    text-align: right;
                    font-weight: normal;
                }
            }
            .moregoods_price {
                position: absolute;
                right: 0;
                height: 160rpx;
                background-color: #fff;
                opacity: 0.95;
                width: 216rpx;
                display: flex;
                flex-direction: column;
                // align-items: center;
                justify-content: center;
                text-align: right;
                padding-right: 36rpx;
                .goodsnum {
                    font-size: 24rpx;
                    transform: unset;
                    color: #666;
                    font-weight: 400;
                }
            }
        }
        .buy-price-box {
            text-align: right;
            .buy-price {
                display: inline-block;
                color: #191919;
                line-height: 1;
                font-size: 0;
                text {
                    font-size: 22rpx;
                    font-weight: bold;
                    &:first-of-type {
                        vertical-align: super;
                    }
                }
                .price-yuan {
                    font-size: 40rpx;
                    line-height: 48rpx;
                }
            }
            .performate-point {
                margin-right: 30rpx;
                display: inline-flex;
                align-items: center;
                vertical-align: sub;
                padding: 0 8rpx 0 0;
                overflow: hidden;
                font-size: 22rpx;
                color: #008864;
                background: linear-gradient(90deg, #ecfffc 0%, #f4faff 100%);
                border-radius: 8rpx;
                img {
                    width: 32rpx;
                    height: 32rpx;
                }
            }
            .price-icon {
                margin-left: 8rpx;
            }
        }
        .orderfooter {
            position: relative;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            text-align: right;
            .remaining-time {
                position: absolute;
                left: 0;
                bottom: 12rpx;
                display: flex;
                align-items: center;
                padding: 0 12rpx;
                text-align: left;
                height: 40rpx;
                background-color: #ffe7eb;
                background-size: 24rpx 26rpx;
                color: #ff0a35;
                font-size: 22rpx;
                border-radius: 24rpx;
                .remaining-time-icon {
                    margin-right: 4rpx;
                    width: 24rpx;
                    height: 26rpx;
                }
            }
            button {
                position: static;
                padding: 0;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                height: 64rpx;
                width: 160rpx;
                font-size: 28rpx;
                line-height: normal;
                background: linear-gradient(90deg, #ff6b4e 0%, #ff0a35 100%);
                color: #fff;
                // border: 1px solid #666;
                border-radius: 38rpx;
                margin-left: 24rpx;
                box-sizing: border-box;
                &:first-of-type {
                    margin-top: 16px;
                    &::before {
                        pointer-events: none;
                        content: '';
                        position: absolute;
                        left: -50%;
                        top: 8px;
                        display: block;
                        background-color: #eee;
                        width: 200%;
                        height: 1px;
                        scale: 0.5;
                    }
                }
                &::after {
                    display: none;
                }
            }
            .order_status {
                border: 0.5px solid #ff0a35;
                background: #fff;
                color: #ff0a35;
            }
            .evaluate {
                background: #fff;
                border: 0.5px solid #c3c3c3;
                color: #191919;
            }
            .order_s3 {
                background-color: #e60113;
                border-color: #e60113;
                color: #fff;
            }
        }
        .logistics {
            display: flex;
            align-items: center;
            margin-top: 16rpx;
            padding: 16rpx;
            padding-right: 8rpx;
            border-radius: 16rpx;
            background-color: rgba(246, 246, 246, 0.5);
        }
        .logistics-box {
            flex: 1;
        }
        .logistics-icon {
            flex-shrink: 0;
            width: 32rpx;
            height: 32rpx;
            margin-left: 8rpx;
        }
        .logistics-status {
            padding-left: 40rpx;
            display: flex;
            align-items: center;
            height: 34rpx;
            font-size: 26rpx;
            color: #191919;
            line-height: 34rpx;
            background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/logistics.png') left center no-repeat;
            background-size: 32rpx 34rpx;
        }
        .logistics-content {
            margin-top: 4px;
            line-height: 30rpx;
            font-size: 22rpx;
            color: #6e6e6e;
        }
        .logistics-time {
            color: #999999;
        }

        .order-collapse {
            text-align: center;
            padding: 20rpx 0 32rpx 0;
            .collapse-bt {
                display: inline-flex;
                align-items: center;
                border-radius: 30rpx;
                border: 0.5px solid #c3c3c3;
                padding: 8rpx 12rpx 8rpx 24rpx;
                color: #6e6e6e;
                font-size: 26rpx;
                line-height: 1;
                background-color: #fff;
                &::after {
                    display: none;
                }
            }
        }
    }
    .font-din {
        font-family: DINAlternate-Bold, DINAlternate;
    }
</style>
