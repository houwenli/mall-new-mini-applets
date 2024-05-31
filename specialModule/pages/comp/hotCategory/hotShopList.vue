<template>
    <view class="special-shopList">
        <view v-if="flowList.length <= 0" class="applet-empty u-flex flex-column">
            <image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/isEmpty-icon/cart.png" style="width:180rpx;height: 180rpx;" mode=""></image>
            <view class="applet-empty-tips">暂无活动商品~</view>
        </view>
        <view class="applet-template-recommend u-padding-left-24 u-padding-right-24" v-else>
            <wsf-goods-list ref="goodslist" title="" :list="flowList" :loadStatus="loadStatus" @goodsClick="goodsClick($event)" :showStyle="showStyle"></wsf-goods-list>			
        </view>
        <view class="bottom-flag" :class="'bottom-flag' + index"></view>
    </view>
</template>

<script>

import wsfGoodsList from './wsf-goods-list.vue'; // 底部精选好物
import { priceFilter } from '@/common/wsfFilter.js';
import { debounce } from '@/common/utils.js'
export default {
    components: { 
        wsfGoodsList,	
    },
    data() {
        return {				
            queryForm: {
                spuIds: [],
                pageSize: 10,
                pageNum: 1
            },
            flowList: [], // 瀑布流商品列表
            finished: false, // 是否加载结束
            loadStatus: 'loadmore', // 加载更多样式效果
            isLoading: false, // 是否正在加载		
            priceFilter,				
        }
    },
    inject: ['scrollTopObj'],
    props: {
        floorSpuIds: {
            type: Array,
            default: [],
        },
        showStyle: {
            type: String,
			default: 'waterfall',
        },
        index: {
            type: Number,
			default: 0,
        }
    },	
    created(){
        this.loadData();
        this.debounceScrollBottom = debounce(this.scrollBottom)
    },
    watch: {
        scrollTopObj: {
            deep: true,
            immediate: true,
            handler(newVal) {
                if(this.debounceScrollBottom) {
                    this.debounceScrollBottom()
                }
            },
        },
    },
    // onReachBottom() {
    //   this.GetRecommendList();
    // },
    methods: {
        // 商品跳转
        goodsClick(e) {
            console.log('e', e);
            this.$wsf.go('SkuDetail', { skuId: e.id });
        },
        loadData() {
            // 正在加载
            if (this.isLoading) {
                return
            }

            // 加载完成
            if (this.finished) {
                return
            }
            // 获取当前查询的spuIds
            let {pageSize, pageNum} = this.queryForm
            let spuIds = this.floorSpuIds.slice((pageNum - 1) * pageSize, pageNum * pageSize);
            this.queryForm.spuIds = spuIds;

            if(spuIds.length < pageSize) {
                this.finished = true
            }
            this.GetRecommendList()
        },
        /* 获取推荐的商品列表 */
        GetRecommendList() {      
            this.isLoading = true;
            this.loadStatus = 'loading';
            this.$u.api.selectSpuDeleteBySpuIds(this.queryForm).then(res => {
                this.isLoading = false;
                this.loadStatus = 'loadmore';
                if (res.code === 200) {
                    // this.flowList = this.flowList.concat(
                    res.data.map((item,index) => {
                        item = JSON.parse(JSON.stringify(item))
                        item.price = this.priceFilter(item.price);
                        this.flowList.push(item)
                        return item;
                    })
                    // );
                    console.log('res222', this.flowList);
                    this.queryForm.pageNum++;
                    this.loadStatus = res.data.length === 10 ? 'loadmore' : 'nomore';
                }
            }).catch(err => {
                this.isLoading = false;
            });
        },	
        scrollBottom() {
            const query = uni.createSelectorQuery().in(this);
            query
                .select('.bottom-flag' + this.index)
                .boundingClientRect(data => {
                    let systemInfo = uni.getSystemInfoSync();
                    let windowHeight = systemInfo.windowHeight;
                    // 加载下一页
                    if (data.top < windowHeight) {
                        this.loadData()
                    }
                })
                .exec();
        }					
    },
    
    
}
</script>

<style scoped lang="less">
.special-shopList{
    .applet-template-recommend {
        // padding-bottom: calc(env(safe-area-inset-bottom) + 200rpx);
        .applet-template-recommend-title {
            margin: 40rpx 0 20rpx;
            text-align: center;
        }
    }
}
.u-load-more-wrap, .u-more-text{
    background: transparent !important;
}
.applet-empty{
    justify-content: center;
    padding-top: 0;
}
.bottom-flag {
    width: 100%;
    height: 1rpx;
}
</style>
    