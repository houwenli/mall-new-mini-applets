<template>
    <view class="product-container safe-area-inset-bottom">
        <template v-if="goodsList && goodsList.length">
            <u-waterfall v-model="goodsList" ref="uWaterfall" add-time="0">
                <template v-slot:left="{ leftList }">
                    <view v-for="(item, index) in leftList" :key="index" @tap="$emit('goDetail', item)">
                        <!-- <view class="product">
                            <view class="product-box" @tap="goDetail(item)">
                                <view class="product-image">
                                    <u-image height="340rpx" width="340rpx"
                                        loading-icon="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/f4aef8f9d91387ce0d074d378b4cc384.png?imageView2/1/w/504"
                                        :src="item.productUrl + '?imageView2/1/w/504'"></u-image>
                                </view>
                                <view class="product-info">
                                    <view class="product-name u-line-2">{{ item.skuName }}</view>
                                    <view class="product-price">
                                        ￥
                                        <text class="light">{{ item.showFinalPrice }}</text>
                                        <text class="del" v-if="item.finalPrice < item.price">￥{{ item.showPrice
                                        }}</text>
                                    </view>
                                    <text class="product-mark">赚 {{ '￥' + item.preCommission }}</text>
                                </view>
                            </view>
                            <view class="share-button" @tap.stop="handleShareProduct(item)">分享</view>
                        </view> -->
                        <list-goods-item :item="item" :fromUser="item.fromUser" @handleShareProduct="handleShareProduct"></list-goods-item>
                    </view>
                </template>
                <template v-slot:right="{ rightList }">
                    <view v-for="(item, index) in rightList" :key="index" @tap="$emit('goDetail', item)">
                        <list-goods-item :item="item" :fromUser="item.fromUser" @handleShareProduct="handleShareProduct"></list-goods-item>
                    </view>
                </template>
            </u-waterfall>
            <u-loadmore ref="backTop" margin-top="40" margin-bottom="40" :loadText="loadText" bg-color="transparent" :status="loadStatus"></u-loadmore>
            <!-- <view v-else class="no-more-box">
					<view class="text">见底啦～不如去</view>
					<button class="button" @tap="goIndex()">首页逛逛</button>
			</view> -->
            <view style="height: 140rpx"></view>
            <button class="share-page-icon" v-if="goodsList && goodsList.length" @click="$emit('handleSharePage')">
                <image class="share-page-img" src="@/static/img/icon/WeChat@2x.png" />
            </button>
        </template>

        <view class="empty-page" v-else>
            <image class="empty-image" :src="emptyImg"></image>
            <text class="empty-text">暂无商品</text>
        </view>
    </view>
</template>
<script>
    import { priceFilter } from '@/common/wsfFilter.js';

    import listGoodsItem from './list-goods-item.vue';

    export default {
        props: {
            fromUser: {
                type: Boolean,
                default: false
            }
            // 热销列表
            // isRecommend: {
            //     type: Boolean,
            //     default: false
            // },
            // recommendList: {
            //     type: Array,
            //     default: () => {
            //         return [];
            //     }
            // }
        },
        components: {
            listGoodsItem
        },
        data() {
            return {
                goodsList: [], // 分销商品列表
                loadStatus: 'loadmore', // 加载更多样式效果
                isLoading: false, // 是否正在加载
                hasMore: true, // 是否拥有更多
                priceFilter,
                loadText: {
                    loadmore: '',
                    loading: '努力加载中',
                    nomore: '我也是有底线的~'
                },
                // 搜索的参数
                searchParam: {
                    pageNum: 0, // 当前页码
                    pageSize: 10 // 每页显示记录数
                },
                emptyImg: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/bf7051fe79eb0e831298a985302ccff1.png',
                ossUrl: this.$oss
            };
        },

        // watch: {
        //     recommendList(val) {
        //         if (!this.isRecommend) {
        //             this.goodsList = val;
        //         }
        //     }
        // },

        created() {
            this.getProductList();
        },
        methods: {
            reset() {
                this.loadStatus = 'loadmore';
                this.hasMore = true;
                this.searchParam = {
                    pageNum: 0,
                    pageSize: 10
                };
                this.goodsList = [];
                this.getProductList();
            },

            // 获取分销商品列表数据
            getProductList() {
                if (this.isLoading || !this.hasMore) return;
                this.isLoading = true;
                this.loadStatus = 'loading';
                this.$u.api.QueryDistributionSpuList(this.searchParam).then(res => {
                    this.isLoading = false;
                    uni.stopPullDownRefresh();
                    if (res.code === 200) {
                        // console.log(res)
                        let data = (res.data && res.data.list) || [];
                        this.goodsList = this.goodsList.concat(
                            data.map(item => {
                                // item.preCommission = this.priceFilter(item.preCommission);
                                // item.showFinalPrice = this.priceFilter(item.finalPrice);
                                // item.showPrice = this.priceFilter(item.price);
                                item.fromUser = this.fromUser;
                                return item;
                            })
                        );
                        console.log(this.goodsList);
                        this.searchParam.pageNum++;
                        this.hasMore = data.length === 10;
                        this.loadStatus = data.length === 10 ? 'loadmore' : 'nomore';
                    }
                });
            },

            // 卡片分享按钮点击
            handleShareProduct(item) {
                this.$emit('handleShareProduct', item);
            }
        }
    };
</script>
<style lang="scss" scoped>
    .product-container {
        padding: 0 24rpx 24rpx;
        margin-bottom: 200rpx;
        margin-top: 20rpx;
    }

    .empty-page {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 40%;

        .empty-image {
            width: 360rpx;
            height: 360rpx;
        }

        .empty-text {
            font-weight: 500;
            font-size: 30rpx;
            color: #999;
            margin-top: 20rpx;
            line-height: 42rpx;
        }
    }
    .share-page-icon {
        z-index: 999;
        position: fixed;
        right: 24rpx;
        bottom: 290rpx;
        width: 80rpx;
        height: 80rpx;
        background: transparent;
        padding: 0;
        outline: 0;
        border: 0;

        &::after {
            border: 0;
        }

        .share-page-img {
            width: 100%;
            height: 100%;
        }
    }
    .no-more-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-bottom: 40rpx;
        .text {
            font-size: 26rpx;
            color: #999;
            line-height: 34rpx;
        }
        .button {
            margin: 4rpx 0 0;
            padding: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 196rpx;
            height: 50rpx;
            background: #ffe7eb;
            border-radius: 30rpx;
            border: 1rpx solid #ff0a35;
            font-size: 26rpx;
            color: #ff0a35;
        }
    }
</style>
