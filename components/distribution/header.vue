<template>
    <view :style="[style]" class="header-content">
        <block v-if="headerType == 1">
            <header-top-style1 :headerIconHeight="headerIconHeight" :bgType="bgType"></header-top-style1>
        </block>
        <block v-else-if="headerType == 2"><header-top-style2 :headerIconHeight="headerIconHeight" :bgType="bgType"></header-top-style2></block>

        <block v-else-if="headerType == 3"><header-top-style3 :headerIconHeight="headerIconHeight" :bgType="bgType"></header-top-style3></block>

        <view>
            <view class="search-container">
                <view class="search-input-box">
                    <view class="search-input-icon" @tap="goSearchPage()"></view>
                    <input class="search-input" type="text" disabled="true" @tap="goSearchPage()" />
                    <view class="search-button" @tap="handleSearch()">搜索</view>
                    <view class="swiper-word-box" v-if="hotWordList && hotWordList.length">
                        <swiper
                            class="swiper-word"
                            :vertical="true"
                            :autoplay="isAutoPlay"
                            :circular="true"
                            :duration="1000"
                            interval="3000"
                            :disable-touch="true"
                            :current="hotWordCurrent"
                            @change="changeHotWord">
                            <block v-for="(item, index) in hotWordList" :key="index">
                                <swiper-item
                                    class="item"
                                    :class="{ 'fade-out-item': lastHotWordCurrent == index, 'fade-in-item': hotWordCurrent == index }"
                                    @tap="goSearchPage()">
                                    {{ item.name }}
                                </swiper-item>
                            </block>
                        </swiper>
                    </view>
                    <view v-else class="default-placeholder" @tap="goSearchPage()">请输入搜索关键字</view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    import headerTopStyle1 from './header-top-style1.vue';
    import headerTopStyle2 from './header-top-style2.vue';
    import headerTopStyle3 from './header-top-style3.vue';
    const { capsule } = getApp().globalData;
    export default {
        props: {
            headerType: {
                type: [String, Number],
                default: 3
            },

            headerBg: {
                type: Object,
                default: () => {
                    return {};
                }
            },

            // 1浅色 2深色
            bgType: {
                type: [String, Number],
                default: 2
            },

            fromPage: {
                type: String,
                default: 'distributionIndex'
            },

            promoteId: {
                type: [String, Number],
                default: ''
            }
        },
        components: {
            headerTopStyle1,
            headerTopStyle2,
            headerTopStyle3
        },
        data() {
            return {
                searchBarPaddingTop: capsule.top,
                headerIconHeight: capsule.height,
                hotWordList: [],
                lastHotWordCurrent: -1,
                hotWordCurrent: 0,
                isAutoPlay: true //是否自动轮播
            };
        },
        computed: {
            style() {
                // 1: 深色 2浅色
                // let bgimg =
                //     this.bgType == 1
                //         ? 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/full-bg-2x.png'
                //         : 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/full-bg-2x.png';
                // let background = `url(${bgimg}) no-repeat`;

                // let background = this.bgimg ? `url(${this.bgimg}) no-repeat` : this.bgColor ? this.bgColor : '#fff'
                console.log(this.headerBg, '-------------------------');
                let { backgroundType, bgImage, bgColor } = this.headerBg;
                let background = backgroundType == 1 ? `url(${bgImage})` : bgColor ? `linear-gradient(${bgColor}, ${bgColor})` : '#fff'
                return {
                    'background-image': background,
                    // backgroundSize: this.bgSize,
                    // backgroundSize: '100%',
                    // opacity: this.bgOpacity,
                    paddingTop: this.searchBarPaddingTop + 'px'
                };
            }
        },

        created() {
            // this.getHotWordList()
        },

        methods: {
            changeHotWord(e) {
                this.lastHotWordCurrent = this.hotWordCurrent;
                this.hotWordCurrent = e.detail.current;
            },

            //首页热词搜索
            handleSearch() {
                if (this.hotWordList && this.hotWordList.length) {
                    let name = this.hotWordList[this.hotWordCurrent].name;
                    this.$wsf.go('SpuList', {
                        queryString: name,
                        fromPage: this.fromPage == 'distributionIndex' ? this.fromPage : this.fromPage + 'Page',
                        promoteId: this.promoteId
                    });
                } else {
                    this.navigationTo('SpuList', { fromPage: this.fromPage == 'distributionIndex' ? this.fromPage : this.fromPage + 'Page', promoteId: this.promoteId });
                }
            },

            goSearchPage() {
                if (this.hotWordList && this.hotWordList.length) {
                    this.navigationTo('Search', {
                        searchValue: this.hotWordList[this.hotWordCurrent].name,
                        fromPage: this.fromPage == 'distributionIndex' ? this.fromPage : this.fromPage + 'Page',
                        promoteId: this.promoteId
                    });
                } else {
                    this.navigationTo('Search', { fromPage: this.fromPage == 'distributionIndex' ? this.fromPage : this.fromPage + 'Page', promoteId: this.promoteId });
                }
            },

            navigationTo(sceneName, params) {
                this.$wsf.go(sceneName, params);
            },

            //获取热词
            async getHotWordList() {
                let list = [];
                let records = uni.getStorageSync(`${this.fromPage}SearchRecords`);
                if (records) {
                    list = JSON.parse(records)
                        .split(',')
                        .map(item => ({ name: item }));
                }
                await this.$u.api.QueryKeyword().then(res => {
                    if (res.data && res.data.length) {
                        list = list.concat(res.data);
                    }
                });
                this.hotWordList = list;
                this.isAutoPlay = true;
            },

            swiperStop() {
                this.isAutoPlay = false;
            }
        }
    };
</script>
<style lang="scss" scoped>
    .header-content {
        overflow: hidden;
        position: fixed;
        z-index: 998;
        top: 0;
        right: 0;
        left: 0;
        background-size: 100% auto !important;
        background-color: #fff;
    }
    .search-container {
        width: 100%;
        height: 64rpx;
        margin: 16rpx 0 8rpx;
        padding: 0 24rpx;
        display: flex;
        align-items: center;

        .search-input-box {
            height: 64rpx;
            width: 100%;
            background: #fff;
            border-radius: 37rpx;
            display: inline-flex;
            align-items: center;
            position: relative;
            border: 1rpx solid #ff1538;
            box-shadow: 0 0 0 1rpx #ffbcbb;

            .search-input-icon {
                margin: 0 16rpx;
                width: 32rpx;
                height: 32rpx;
                background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/ic_index_search.png') no-repeat center center;
                background-size: 32rpx 32rpx;
            }

            .search-input {
                width: 428rpx;
                height: 62rpx;
                border: 0;
                background: 0;
                color: #999999;
                font-size: 28rpx;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-indent: 0rpx;
                line-height: 62rpx;
            }

            .search-button {
                position: absolute;
                right: 6rpx;
                top: 50%;
                transform: translateY(-50%);
                width: 140rpx;
                height: 56rpx;
                background: linear-gradient(90deg, #ff6b4e 0%, #ff0a35 100%);
                border-radius: 37rpx;
                line-height: 56rpx;
                text-align: center;
                font-size: 26rpx;
                color: #fff;
            }

            .swiper-word-box {
                position: absolute;
                left: 64rpx;
                top: 0;
                height: 64rpx;
                width: 410rpx;
                display: flex;
                align-items: center;

                .swiper-word {
                    width: 100%;
                    height: 40rpx;

                    .item {
                        width: 100%;
                        height: 40rpx;
                        color: #6e6e6e;
                        line-height: 40rpx;
                        font-size: 28rpx;
                        display: block;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    .fade-in-item {
                        animation: fadeIn 0.5s linear;
                    }

                    .fade-out-item {
                        animation: fadeOut 0.5s linear;
                    }

                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                        }

                        to {
                            opacity: 1;
                        }
                    }

                    @keyframes fadeOut {
                        from {
                            opacity: 1;
                        }

                        to {
                            opacity: 0;
                        }
                    }
                }
            }

            .default-placeholder {
                position: absolute;
                left: 80rpx;
                top: 0;
                height: 72rpx;
                width: 250rpx;
                line-height: 72rpx;
                font-size: 28rpx;
                color: #c6c6c6;
            }
        }

        .message {
            width: 48rpx;
            height: 48rpx;
            z-index: 99;
            margin-left: 24rpx;

            .message-icon {
                width: 100%;
                height: 100%;
            }
        }
    }
</style>
