<template>
    <view class="similar-page">
        <back-top :showMore="false" :backTopStyle="{background: '#fff'}" title="看相似"></back-top>
        <view class="scroll-container">
            <view class="sku-info">
                <image class="sku-img" :src="skuDetail.url"></image>
                <view class="sku-right">
                    <view class="sku-title">
                        {{ skuDetail.title }}
                    </view>
                    <view class="sku-price">
                        <span class="coin">￥</span><span class="int">{{ skuPriceInt(skuDetail.price) }}</span><span class="float">{{ "." + skuPriceFloat(skuDetail.price) }}</span>
                    </view>
                </view>
            </view>
            
            <!-- 热销商品 -->
            <view class="module-goods-list">
                <view class="goodsTitle">根据您挑选的商品，为您找到以下相似商品</view>
                <wsf-goods-list
                    loadMoreScene="detail"
                    :list="flowList"
                    :loadStatus="loadStatus"
                    @goodsClick="goodsClick($event)"
                ></wsf-goods-list>
                <view style="height: 110rpx"></view>
            </view>
        </view>
        
    </view>
</template>

<script>
import { priceFilter } from "@/common/wsfFilter.js";
import backTop from "@/common/components/nav-bar.vue";
export default {
    components:{
        backTop
    },
    data() {
        return {
            skuDetail: {
                title: '',
                skuId: '',
                price: '',
                url: ''
            },
            loadStatus: "loadmore", // 加载更多样式效果
            queryForm: {
                // 页码页容量
                skuId: '',
                pageType: 2,
                pageNum: 0,
                pageSize: 10,
            },
            flowList: [],
            isLoading: false, // 是否正在加载
            hasMore: true, // 是否拥有更多
        }
    },
    onLoad(options) {
        this.skuDetail = {...options}
        this.queryForm.skuId = options.skuId
    },
    onShow() {
        this.getRecommendList();
    },
    onReachBottom() {
        this.getRecommendList();
    },
    methods: {
        skuPriceInt(price) {
            return Number(price).toFixed(2).split(".")[0];
        },
        skuPriceFloat(price) {
            return Number(price).toFixed(2).split(".")[1];
        },
        goodsClick(e) {
            let param = e.id;
            if (!param) {
                this.showToastError("缺少参数");
            }
            if(e.goodsSource == 4){
                this.$wsf.go('ToMotor',{skuId: e.id});
            } else {
                this.$wsf.go('SkuDetail', { skuId: param });
            }
        },
        showToastError(errMsg, duration = 2000) {
            uni.showToast({
                title: errMsg,
                icon: "none",
                mask: true,
                duration: duration,
            });
        },
        //热销商品商品列表
        getRecommendList() {
            if (this.isLoading || !this.hasMore) return;
            this.isLoading = true;
            this.loadStatus = "loading";
            this.$u.api.QueryRecommendCommodity(this.queryForm).then((res) => {
                this.isLoading = false;
                this.loadStatus = "loadmore";
                console.log("res", res);
                if (res.code === 200) {
                    this.flowList = this.flowList.concat(
                        res.data.map((item) => {
                            item.price = priceFilter(item.price);
                            return item;
                        })
                    );
                    this.queryForm.pageNum++;
                    this.hasMore = res.data.length === 10;
                    this.loadStatus = res.data.length === 10 ? "loadmore" : "nomore";
                }
            });
        },
    },
}
</script>

<style lang="scss" scoped>
.similar-page {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 120rpx;
 
    .scroll-container {
        flex: 1;
        overflow-y: auto;
        .sku-info {
            display: flex;
            margin: 20rpx;
            border-radius: 24rpx;
            padding: 20rpx;
            background: #fff;
            overflow: hidden;
            .sku-img{
                width: 148rpx;
                height: 148rpx;
                margin-right: 16rpx;
                border-radius: 16rpx;
            }
            .sku-right {
                flex: 1;
                .sku-title {
                    height: 68rpx;
                    color: #191919;
                    font-size: 26rpx;
                    line-height: 34rpx;
                    font-weight: bold;
                    margin-bottom: 40rpx;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                }
                .sku-price {
                    display: flex;
                    font-weight: bold;
                    align-items: baseline;
                    color: #191919;
                    font-family: DINAlternate-Bold, DINAlternate;
                    .coin {
                        font-size: 24rpx;
                    }
                    .int {
                        font-size: 32rpx;
                    }
                    .float {
                        font-size: 26rpx;
                    }
                }
            }
            
        }
    }
    
}
.module-goods-list {
  margin: 0 24rpx;
  .goodsTitle {
    margin-bottom: 20rpx;
    color: #999;
    font-size: 22rpx;
        img {
            width: 498rpx;
            height: 32rpx;
        }
    }
}
</style>

