<template>
    <view class="carousel-panel">
        <!-- <view class="carousel" id="carousel">
            <view class="carousel-every" v-for="(item, index) in carouselData" @tap="goSkuDetail(item)" :key="index">
                <view class="carousel-every__bg">
                    <view class="carousel-every__img-bg">
                        <image class="carousel-every__img" :src="item.url"></image>
                        <view class="carousel-every__desc">{{ item.desc }}</view>
                    </view>
                </view>
                <view class="carousel-price">
                    ￥<text class="carousel-price__int">{{ item.priceInt }}</text>.{{ item.priceDecimal }}
                </view>
            </view>
        </view> -->

        <swiper style="height: 174rpx;" :autoplay="carouselData.length > 4" :circular="true" mode="none">
            <swiper-item class="carousel-every" v-for="(item, index) in carouselData" @tap="goSkuDetail(item)" :key="item.id">
                <view class="carousel-every-box">
                    <view class="carousel-every__bg">
                    <view class="carousel-every__img-bg">
                        <image class="carousel-every__img" :src="item.url"></image>
                        <view class="carousel-every__desc">{{ item.desc }}</view>
                    </view>
                    </view>
                    <view class="carousel-price">
                        ￥
                        <text class="carousel-price__int">{{ item.priceInt }}</text>
                        .{{ item.priceDecimal }}
                    </view>
                </view>
            </swiper-item>
        </swiper>
    </view>
</template>

<script>
import { throttle, getSplitPrice } from '@/common/utils.js';
import { priceFilter } from '@/common/wsfFilter.js';
export default {
    components: { 
        
    },
    data() {
        return {
            queryForm: {
                spuIds: []
            },
            carouselData: [],
            
        }
    },
    computed:{
    
    },
    props: {
        config: {
			type: Object,
			default: {},
		}
    },
    created() {
        this.getRecommendList()
        // catch 不做处理
        // this.carouselScrollInit()
        //     .then(() => {
        //         // this.carouselScrollListen()
        //         this.carouselAutoScroll()
        //     })
    },
    
    watch: {
        
    },
    methods: {
        // 跳商详
        goSkuDetail(item) {
            this.$wsf.go('SkuDetail',{skuId: item.id})
        },
        priceFilter,
        // 获取主推商品列表
        getRecommendList() {
            this.queryForm.spuIds = this.config.mainSpuIds || [];
            this.$u.api.selectSpuDeleteBySpuIds(this.queryForm).then(res => {
                if (res.code === 200) {
                    this.carouselData = res.data.map(item => {
                        let salesVolume = item.skuLable && item.skuLable.baseLabel && item.skuLable.baseLabel.salesVolume
                        let desc = ''
                        if (salesVolume && Number(salesVolume) > 9999) {
                            desc = `热销${Math.floor(Number(salesVolume) / 10000) + '万'}件`;
                        } else {
                            desc = `热销${salesVolume}件`;
                        }

                        const priceObj = getSplitPrice(item.price);
                        const {
                            int: priceInt,
                            decimal: priceDecimal
                        } = priceObj;

                        return {
                            ...item,
                            desc,
                            price: this.priceFilter(item.price),
                            priceInt,
                            priceDecimal,
                        }
                    })
                }
            })
        },
        carouselScrollInit() {
            return new Promise((resolve, reject) => {
                try {
                    this.$nextTick(() => {
                        // 获取当前容器
                        let carousel = document.getElementById('carousel');
                        // 获取容器宽度
                        let carouselWidth = parseFloat(window.getComputedStyle(carousel).width.split('px')[0]);

                        // 获取容器内元素
                        let carouselList = document.getElementsByClassName('carousel-every') || [];
                        // 获取单个元素属性
                        let carouselItem = window.getComputedStyle(carouselList[0]);
                        // 动态获取元素的margin距离
                        let carouselItemRight = parseFloat(carouselItem.marginRight.split('px')[0]);
                        let carouselItemLeft = parseFloat(carouselItem.marginLeft.split('px')[0]);
                        let carouselItemWidth = parseFloat(carouselItem.width.split('px')[0]);
                        let carouselItemFullWidth = carouselItemWidth + carouselItemRight + carouselItemLeft

                        // 获取元素长度集合
                        let carouselItemWidths = []
                        // 遍历获取每个一级菜单的宽度
                        for(let item of carouselList) {
                            carouselItemWidths.push(carouselItemFullWidth).toFixed(4)
                        }

                        // 逻辑属性，挂载到this上
                        this.carouselObj = {
                            carousel, // 容器
                            carouselWidth, // 容器宽度
                            carouselList, // 容器内部元素
                            carouselItem, // 单个元素
                            carouselItemRight, // 单个元素右侧margin
                            carouselItemWidth, // 单个元素宽度
                            carouselItemWidths, // 元素长度集合
                            carouselItemFullWidth, // 单个元素总长
                        }
                        resolve()
                    })
                } catch (e) {
                    reject()
                }
            })
            
            
        },
        scrollEffect(index) {
            let {
                carousel, // 容器
                carouselItemWidths, // 元素长度集合
            } = this.carouselObj

            // 获取第一个元素到当前点击元素的宽度list
            let elWidths = carouselItemWidths.slice(0, index);
            // 计算所有元素的宽度
            let deviation = index > 0 && elWidths.reduce((preValue, curValue) => preValue + curValue)
            // 计算父盒子滚动距离
            let scrollLeft = index === 0 ? 0 : deviation - elWidths[elWidths.length - 1]

            carousel.scroll({
                top: 0,
                left: scrollLeft,
                behavior: "smooth", //滚动条平滑滚动
            });

            // 当前元素两边元素样式变动
            this.carouselData = this.carouselData.map((item, carouselIndex) => {
                if (carouselIndex == index - 1 || carouselIndex == index + 1) {
                    return {
                        ...item,
                        newClass: true
                    }
                } else {
                    return {
                        ...item,
                        newClass: false
                    }
                }
            })
            console.log(2222, index, this.carouselData)
        },
        carouselAutoScroll () {
            let {
                carousel,
            } = this.carouselObj
            this.carouselId = setInterval(() => {
                carousel
            }, 1000)
        },

        carouselInit(showNum, data) {
            if (data.length <= showNum) {
                return
            }
            // 拼接数据，前后拼上showNum条数据，前面拼后四个，后面拼前4个，这个是无限轮播的关键
            data = {
                ...data.slice(data.length - showNum),
                ...data,
                ...data.slice(0, showNum)
            }

            let {
                carousel,
                carouselItemFullWidth
            } = this.carouselObj

            // 初始化位置
            // carousel.style({
            //     transitionDuration: '0ms',
            //     transform: `translateX(${(index + 1) * -100}%)`
            // })
        },

        carouselScrollListen () {
            let carousel = document.getElementById('carousel');
            let handleScroll = throttle(this.handleScroll);
            carousel.addEventListener('touchend', handleScroll);
        },
        handleScroll (event) {
            let {
                carousel,
                carouselWidth, // 容器宽度
                carouselItemRight, // 单个元素右侧margin
                carouselItemWidth, // 单个元素宽度
            } = this.carouselObj

            // 获取当前滚动距离
            let scrollLeft = carousel.scrollLeft;

            // 获取当前的index
            let curIndex = Math.floor((scrollLeft + carouselWidth / 2) / (carouselItemRight + carouselItemWidth));

            this.scrollEffect(curIndex)
            
        }
    }		
}
</script>

<style scoped lang="less">
    .carousel-panel {
        overflow: scroll;
    }
    .carousel {
        display: flex;
    }
    .carousel-every {
        width: 176rpx !important;
        padding-left: 10rpx;
    }
    .carousel-every-box {
        // margin-left: 10rpx;
        overflow: hidden;
        height: 176rpx;
        border-radius: 40rpx;
        background: linear-gradient(90deg, #C782EB 0%, #CA59E5 46%, #A158E5 100%);
    }
    .carousel-every__bg{
        width: 176rpx;
        height: 126rpx;
        background: #FFFFFF;
        border-radius: 40rpx 40rpx 20rpx 20rpx;
        position: relative;
    }
    .carousel-every__img-bg {
        display: flex;
    }
    .carousel-every__img {
        width: 140rpx;
        height: 110rpx;
        margin: 8rpx auto 0;
    }
    .carousel-every__desc {
        width: 154rpx;
        height: 30rpx;
        line-height: 30rpx;
        background: #E75C95;
        border-radius: 14rpx;
        text-align: center;
        font-size: 18rpx;
        color: #FAFAFA;
        position: absolute;
        bottom: 4rpx;
        left: 50%;
        transform: translateX(-50%);
    }
    .carousel-price {
        line-height: 48rpx;
        font-size: 22rpx;
        color: #FAFAFA;
        font-weight: bold;
        font-family: PingFang SC;
        text-align: center;
    }
    .carousel-price__int {
        font-family: DIN Alternate;
        font-size: 36rpx;
    }
</style>
    