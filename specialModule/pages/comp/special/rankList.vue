<template>
    <view class="carousel-panel" :style="{ backgroundImage: 'url(' + bgImg + ')' }">
        <swiper class="carousel" style="height: 340rpx;" 
            :autoplay="recoSkuList.length > 3" 
            :circular="recoSkuList.length > 3"
            :current="currentInit" 
            mode="none"	previous-margin="44rpx" next-margin="44rpx" @change="getSwiperCurrent">
            <swiper-item
                v-for="(item, index) in recoSkuList"
                @tap="goSkuDetail(item)"
                :key="item.id"
                class="carousel-every"
                :class="{ 'new-class': currentSwiper + 1 == recoSkuList.length ? index == 0 : index == currentSwiper + 1 }">
                    <view class="carousel-every__crown" :class="index <= 2 ? carouselClass[index] : carouselClass.other">{{ index + 1 }}</view>
                    <view class="carousel-every__bg">
                        <img class="carousel-every__img" :src="item.url">
                        <p class="carousel-every__desc">热销{{ (item.skuLable && item.skuLable.baseLabel && item.skuLable.baseLabel.salesVolume) | saleNumCount }}件</p>
                    </view>
                </swiper-item>
        </swiper>


        <!-- <view id="carousel" class="carousel" bindtouchend="carouselScrollListen">
            <view v-for="(item, index) in recoSkuList" @tap="goSkuDetail(item)" :key="index" 
                class="carousel-every"
                :class="item.newClass ? 'new-class': ''"
                
            >
                <view class="carousel-every__crown" 
                    :class="index <= 2 ? carouselClass[index] : carouselClass.other"
                >
                    {{ index + 1 }}</view>
                <view class="carousel-every__bg">
                    <img class="carousel-every__img" :src="item.url">
                    <p class="carousel-every__desc">热销{{ (item.skuLable && item.skuLable.baseLabel && item.skuLable.baseLabel.salesVolume) | saleNumCount }}件</p>
                </view>
            </view>
            
        </view> -->
    </view>
</template>

<script>
    import { throttle } from '@/common/utils.js';
    export default {
        data() {
            return {
                carouselData: [],
                // 类名策略
                carouselClass: {
                    0: 'carousel-every__first',
                    1: 'carousel-every__second',
                    2: 'carousel-every__third',
                    other: 'carousel-every__other'
                },
                currentInit: 0, // 初始化
                currentSwiper: 0
            };
        },

        props: {
            recoSkuList: {
                type: Array,
                default: []
            },
            config: {
                type: Object,
                default: {}
            }
        },

        filters: {
            saleNumCount(val) {
                if (val && Number(val) > 9999) {
                    return Math.floor(Number(val) / 10000) + '万';
                } else {
                    return val;
                }
            }
        },

        computed: {
            // 取背景图片
            bgImg() {
                return (
                    (this.config && this.config.advAndrankImgUrl) ||
                    'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/special-subject/bg-img.png'
                );
            },
        },

        watch: {
            recoSkuList() {
                this.currentInit = 0;
            }
        },

        created() {},
        mounted() {
            // catch 不做处理
            // this.carouselScrollInit().then(() => {
            //     this.carouselScrollListen();
            // });
        },
        methods: {
            // 跳商详
            goSkuDetail(item) {
                this.$wsf.go('SkuDetail', { skuId: item.id });
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
                            // 动态获取元素的margin-right距离
                            let carouselItemRight = parseFloat(carouselItem.marginRight.split('px')[0]);
                            let carouselItemWidth = parseFloat(carouselItem.width.split('px')[0]);

                            // 获取元素长度集合
                            let carouselItemWidths = [];
                            // 遍历获取每个一级菜单的宽度
                            for (let item of carouselList) {
                                carouselItemWidths.push(carouselItemWidth + carouselItemRight).toFixed(4);
                            }

                            // 逻辑属性，挂载到this上
                            this.carouselObj = {
                                carousel, // 容器
                                carouselWidth, // 容器宽度
                                carouselList, // 容器内部元素
                                carouselItem, // 单个元素
                                carouselItemRight, // 单个元素右侧margin
                                carouselItemWidth, // 单个元素宽度
                                carouselItemWidths // 元素长度集合
                            };
                            resolve();
                        });
                    } catch (e) {
                        reject();
                    }
                });
            },
            scrollEffect(index) {
                let {
                    carousel, // 容器
                    carouselItemWidths // 元素长度集合
                } = this.carouselObj;

                // 获取第一个元素到当前点击元素的宽度list
                let elWidths = carouselItemWidths.slice(0, index);
                // 计算所有元素的宽度
                let deviation = index > 0 && elWidths.reduce((preValue, curValue) => preValue + curValue);
                // 计算父盒子滚动距离
                let scrollLeft = index === 0 ? 0 : deviation - elWidths[elWidths.length - 1];

                carousel.scroll({
                    top: 0,
                    left: scrollLeft,
                    behavior: 'smooth' //滚动条平滑滚动
                });

                // 当前元素两边元素样式变动
                this.carouselData = this.carouselData.map((item, carouselIndex) => {
                    if (carouselIndex == index - 1 || carouselIndex == index + 1) {
                        return {
                            ...item,
                            newClass: true
                        };
                    } else {
                        return {
                            ...item,
                            newClass: false
                        };
                    }
                });
                console.log(2222, index, this.carouselData);
            },
            carouselScrollListen() {
                let handleScroll = throttle(this.handleScroll);
                return handleScroll;
            },
            handleScroll(event) {
                let {
                    carousel,
                    carouselWidth, // 容器宽度
                    carouselItemRight, // 单个元素右侧margin
                    carouselItemWidth // 单个元素宽度
                } = this.carouselObj;

                // 获取当前滚动距离
                let scrollLeft = carousel.scrollLeft;

                // 获取当前的index
                let curIndex = Math.floor((scrollLeft + carouselWidth / 2) / (carouselItemRight + carouselItemWidth));

                this.scrollEffect(curIndex);
            },

            /* 获取当前swiper选中 */
            getSwiperCurrent(e, index) {
            	let {current, source} = e.detail
                if(source === 'autoplay' || source === 'touch') { 
                    this.currentSwiper = current
                }
            }
        }
    };
</script>

<style scoped lang="less">
    .carousel-panel {
        width: 750rpx;
        height: 700rpx;
        padding-top: 300rpx;
        background-size: 100% 100%;
    }
    .new-class {
        margin-top: -30rpx;
    }
    .carousel {
        display: flex;
        width: 100%;
        overflow-x: scroll;
        overflow-y: hidden;
        transition: all 300ms ease-in-out;
        .carousel-every {
            width: auto !important;
            padding-right: 30rpx;
            display: flex;
            justify-content: flex-end;
            flex-direction: column;
            align-items: center;
        }
        .carousel-every__crown {
            width: 71rpx;
            height: 52rpx;
            background-size: 100% 100%;
            line-height: 64rpx;
            text-align: center;
            font-size: 30rpx;
            font-weight: bold;
            font-family: Arial;
        }
        .carousel-every__first {
            background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/special-subject/rank1.png');
            color: #c6781a;
        }
        .carousel-every__second {
            background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/special-subject/rank2.png');
            color: #667090;
        }
        .carousel-every__third {
            background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/special-subject/rank3.png');
            color: #c6781a;
        }
        .carousel-every__other {
            background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/special-subject/rank-other.png');
            color: #80766f;
        }
        .carousel-every__bg {
            width: 200rpx;
            height: 258rpx;
            background: linear-gradient(-90deg, #a17b55 0%, #d7b78d 100%);
            border-radius: 30rpx;
        }
        .carousel-every__img {
            width: 194rpx;
            height: 194rpx;
            background: #ffffff;
            border-radius: 30rpx;
            display: block;
            margin: 4px auto 0;
        }
        .carousel-every__desc {
            text-align: center;
            font-size: 28rpx;
            font-weight: bold;
            color: #ffffff;
            line-height: 60rpx;
        }
    }
</style>
