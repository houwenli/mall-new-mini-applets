<template>
    <u-popup v-model="popupShow" mode="bottom" :safe-area-inset-bottom="true" width='100%' @close='close' class="u-popup-quan" :border-radius="24">
        <view class="applet-settlement-popup-wrap">
            <view class="applet-settlement-popup-header u-padding-left-36">
                <view></view>
                <view class="applet-settlement-popup-header-title applet-settlement-popup-header-title-center">
                    优惠
                </view>
                <view class="applet-settlement-popup-header-close" @click="popupShow = false">
                    <image src="@/static/img/icon/close-icon.png" class="applet-settlement-popup-header-close-icon" mode=""></image>
                </view>
            </view>
            <scroll-view scroll-y="true" style="height: 880rpx">
                <view class="applet-settlement-popup-body" v-if="disableCouponList.length || usableCouponList.length || couponData.markingVo">
                    <view class="after-price" v-if="(selectCouponCount>0 && couponData.markingVo) || (selectCouponCount>0 && !couponData.markingVo) || (!(selectCouponCount>0) && couponData.markingVo && (tiredPricingList || [1,2,3].includes(Number(couponData.markingVo.ruleType))) )">
                        <view class="u-font-30 font-bold" v-if="haveActivity">¥{{ couponData.finalPrince }}</view>
                        <view class="u-font-30 font-bold" v-else>¥{{ (beforeCouponPrice - sumSelectCouponDiscount).toFixed(2)}}</view>
                        <view class="u-font-22">预估到手</view>
                    </view>

                    <!-- 优惠看板 价格计算展示 -->
                    <!-- class  有活动不满足活动条件且无优惠券 不展示-->
                    <!-- 情形一：有活动有优惠券， 情形二：无活动有优惠券，情形三：有活动无优惠券 （活动满足优惠条件）自定义价格，固定折扣，固定金额，不参与最优换算 -->
                    <view :class="(couponData.markingVo && !tiredPricingList && [4,5].includes(Number(couponData.markingVo.ruleType)) && !(selectCouponCount>0)) ? 'detail-bubble-none' : 'detail-bubble'"
                        v-if="(selectCouponCount>0 && couponData.markingVo) || (selectCouponCount>0 && !couponData.markingVo) || (!(selectCouponCount>0) && couponData.markingVo && (tiredPricingList || [1,2,3].includes(Number(couponData.markingVo.ruleType))) )">
                    <!-- <view class="detail-bubble" v-if="selectCouponCount>0 || couponData.markingVo"> -->
                        <view class="detail-bubble-title">当前购买可使用以下优惠</view>
                        <!-- <view class="detail-bubble-content" v-if="selectCouponItem.couponsType != 2">¥{{selectCouponItem.beforeCouponPrice.toFixed(2)}} - ¥{{selectCouponItem.faceValue}}</view>
                        <view class="detail-bubble-content" v-else>¥{{selectCouponItem.beforeCouponPrice.toFixed(2)}} * {{selectCouponItem.faceValue}}折</view> -->
                        <view class="reduce-tip" v-if="selectCouponCount>0 || couponData.markingVo">
                            <span :style="{ 'text-decoration': couponData.markingVo && [1,3].includes(Number(couponData.markingVo.ruleType)) ? 'line-through' : 'none' }" class="reduce-text font-din">¥{{beforeCouponPrice}}</span>
                            <span :class="(couponData.markingVo && !tiredPricingList && [4,5].includes(Number(couponData.markingVo.ruleType))) ? 'detail-bubble-none' : 'reduce-text' " v-if='haveActivity && couponData.markingVo'>
                                <span v-if="[4].includes(Number(couponData.markingVo.ruleType))">-</span>
                                <span v-if="[1,3].includes(Number(couponData.markingVo.ruleType))">→</span>
                                <span v-if="[2,5].includes(Number(couponData.markingVo.ruleType))">X</span>
                            </span>
                            <span :class="(couponData.markingVo && !tiredPricingList && [4,5].includes(Number(couponData.markingVo.ruleType))) ? 'detail-bubble-none' : 'reduce-text' " v-if='haveActivity && couponData.markingVo'>
                                <span v-if="couponData.markingVo.ruleType == 1" class="font-din">¥{{ couponData.markingVo.fixedPrice * couponData.num }}</span>
                                <span v-if="couponData.markingVo.ruleType == 2" class="font-din">{{ couponData.markingVo.fixedDiscount }}折</span>
                                <span v-if="couponData.markingVo.ruleType == 3" class="font-din">¥{{ couponData.markingVo.fixedAmount * couponData.num }}</span>
                                <span v-if="[4].includes(Number(couponData.markingVo.ruleType)) && tiredPricingList" class="font-din">¥{{ tiredPricingList.faceValue }}</span>
                                <span v-if="[5].includes(Number(couponData.markingVo.ruleType)) && tiredPricingList" class="font-din">{{ tiredPricingList.faceValue }}折</span>
                            </span>

                            <template v-if="selectCouponCount>0">
                                <span class="reduce-text" v-if='haveActivity'>
                                    <span v-if="[1,3].includes(Number(selectCouponItem.couponsType))">-</span>
                                    <span v-if="[2].includes(Number(selectCouponItem.couponsType))">X</span>
                                </span>
                                <span class="reduce-text" v-else>-</span>
                                <span v-if='haveActivity'>
                                    <span v-if="selectCouponItem.couponsType == 2">{{ selectCouponItem.faceValue }}折</span>
                                    <span v-if="[1,3].includes(Number(selectCouponItem.couponsType))" class="font-din">¥{{ selectCouponItem.faceValue }}</span>
                                </span>
                                <span class="reduce-text font-din" v-else>¥{{ sumSelectCouponDiscount }}</span>
                            </template>

                        </view>

                        <!-- 优惠看板 活动和券类型展示 -->
                        <view v-if="selectCouponCount>0 || couponData.markingVo">
                            <view class="estimate-card u-margin-right-30">
                                <view class="text">当前售价</view>
                                <view class="price">¥{{beforeCouponPrice}}</view>
                            </view>

                            <view :class="(couponData.markingVo && !tiredPricingList && [4,5].includes(Number(couponData.markingVo.ruleType))) ? 'detail-bubble-none' : 'estimate-card u-margin-right-6' " v-if="haveActivity && couponData.markingVo">
                                <view class="text" v-if="[1,3].includes(Number(couponData.markingVo.ruleType))">固定金额</view>
                                <view class="text" v-else>活动</view>
                                <view v-if="couponData.markingVo.ruleType == 1" class="price">{{ couponData.markingVo.fixedPrice * couponData.num }}</view>
                                <view v-if="couponData.markingVo.ruleType == 2" class="price">{{ couponData.markingVo.fixedDiscount }}</view>
                                <view v-if="couponData.markingVo.ruleType == 3" class="price">{{ couponData.markingVo.fixedAmount * couponData.num }}</view>
                                <view v-if="[4].includes(Number(couponData.markingVo.ruleType)) && tiredPricingList" class="price">满{{ tiredPricingList.amountLimitation }}减{{ tiredPricingList.faceValue }}</view>
                                <view v-if="[5].includes(Number(couponData.markingVo.ruleType)) && tiredPricingList" class="price">满{{ tiredPricingList.amountLimitation }}打{{ tiredPricingList.faceValue }}折</view>
                            </view>

                            <template v-if="selectCouponCount > 0">
                                <view class="estimate-card">
                                    <view class="text">商品券</view>
                                    <view class="price" v-if="isCheckBox">累计减{{ sumSelectCouponDiscount }}</view>
                                    <template v-else>
                                        <view class="price" v-if="selectCouponItem.couponsType == 1">满{{selectCouponItem.amountLimitation}}减{{selectCouponItem.faceValue}}</view>
                                        <view class="price" v-if="selectCouponItem.couponsType == 2">{{selectCouponItem.faceValue}}折</view>
                                        <view class="price" v-if="selectCouponItem.couponsType == 3">满{{selectCouponItem.faceValue}}减{{selectCouponItem.faceValue}}</view>
                                    </template>
                                </view>
                            </template>
                        </view>
                    </view>

                    <!-- 有活动不满足活动条件且无优惠券 不展示 -->
                    <view :class="{'detail-bubble': !(couponData.markingVo && !tiredPricingList && [4,5].includes(Number(couponData.markingVo.ruleType)) && !(selectCouponCount>0))}" v-else>
                        <view v-if="couponData.markingVo && !tiredPricingList && [4,5].includes(Number(couponData.markingVo.ruleType)) && !(selectCouponCount>0)"></view>
                        <view v-else>
                            <view class="detail-bubble-title">当前购买可使用以下优惠</view>
                            <view class="nonuse-content">不使用优惠券</view>
                        </view>
                    </view>
                    <view class="activity-card" v-if="haveActivity && couponData.markingVo">
                        <view class="coupon-list-title u-flex">
                            <img class="ic_youhui" src="@/static/img/icon/ic_activity.png" />
                            <span>活动</span>
                            <span class="gery-tip">活动仅限对当前商品生效，不可与其他商品叠加</span>
                        </view>

                        <view v-if="couponData.markingVo.ruleType == 2">
                            <view class="activity-item">
                                <span class="tag">{{ couponData.markingVo.fixedDiscount }}折</span>
                                <!-- <span class="tip-text">无门槛，打{{ couponData.markingVo.fixedDiscount }}折</span> -->
                                <span class="tip-text">满一件，打{{ couponData.markingVo.fixedDiscount }}折</span>
                            </view>
                        </view>

                        <view v-if="couponData.markingVo.ruleType == 1">
                            <view class="activity-item">
                                <span class="tag">活动价</span>
                                <span class="tip-text">满一件，活动价{{ couponData.markingVo.fixedPrice }}元</span>
                            </view>
                        </view>

                        <view v-if="couponData.markingVo.ruleType == 3">
                            <view class="activity-item">
                                <span class="tag">活动价</span>
                                <span class="tip-text">满一件，活动价{{ couponData.markingVo.fixedAmount }}元</span>
                            </view>
                        </view>

                        <view v-if="couponData.markingVo.ruleType == 4">
                            <block v-for="(item,index) in couponData.markingVo.tiredPricingList" :key='index'>
                                <view class="activity-item">
                                    <span class="tag">满{{ item.amountLimitation }}-{{ item.faceValue }}</span>
                                    <span class="tip-text">【满减】满{{ item.amountLimitation }}元，总价减{{ item.faceValue }}元</span>
                                </view>
                            </block>
                        </view>

                        <view v-if="couponData.markingVo.ruleType == 5">
                            <block v-for="(item,index) in couponData.markingVo.tiredPricingList" :key='index'>
                                <view class="activity-item">
                                    <span class="tag">满{{ item.amountLimitation }}打{{ item.faceValue }}折</span>
                                    <span class="tip-text">【满减】满{{ item.amountLimitation }}元，总价打{{ item.faceValue }}折</span>
                                </view>
                            </block>
                        </view>

                    </view>
                    <template>
                        <view class="u-padding-top-8">
                            <view class="coupon-list" v-if='usableCouponList.length'>
                                <!-- <view class="coupon-discount-sum">您已选中优惠券{{selectCouponCount}}张，共可抵<text style="color: #e60113">￥{{sumSelectCouponDiscount | priceFilter}}</text></view> -->
                                <view class="coupon-list-title u-flex">
                                    <image class="ic_youhui" src="@/static/img/icon/ic_youhui.png"></image>
                                    <span>优惠券</span>
                                </view>
                                <block v-for="(item, index) in usableCouponList" :key="index">
                                    <view class="coupon product-coupon">
                                        <view class="usable-mark" v-if="fliterCanUseProductCoupon(item)">可叠加</view>
                                        <view class="main-ticket">
                                            <view class="main-mark product-mark">商品券</view>
                                            <view class="coupon-detail">
                                                <view style="text-align: center">
                                                    <view class="coupon-price product-color">
                                                        <text class="text product-color" v-if="item.couponsType != 2">￥</text>
                                                        <text class="price product-color">{{ item.faceValue }}</text>
                                                        <text class="text product-color" v-if="item.couponsType == 2">折</text>
                                                    </view>
                                                    <view class="full-discount product-color" v-if="item.couponsType == 1">满{{ item.amountLimitation }}可用</view>
                                                    <view class="full-discount product-color" v-if="item.couponsType == 3">满{{ item.faceValue }}可用</view>
                                                </view>
                                                <view class="coupon-info">
                                                    <view class="condition">{{ item.spuName }}</view>
                                                    <view class="indate">
                                                        {{ $u.timeFormat(new Date(item.effectiveStartTime.replace(/-/g,"/")).getTime(), 'yyyy.mm.dd') }}-{{ $u.timeFormat(new Date(item.effectiveEndTime.replace(/-/g,"/")).getTime(), 'yyyy.mm.dd') }}
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                        <view class="stub-ticket">
                                            <image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/cat_Selected%402x.png" alt="" class="choosebox" v-if="item.checked" @tap="selectProductCoupon(item,index,'cancel')"></image>
                                            <image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/cat_ns_platform%402x.png" alt="" class="choosebox" v-if="!disable && !item.checked" @tap="selectProductCoupon(item,index,'select')"></image>
                                        </view>
                                    </view>
                                </block>

                            </view>

                            <view class="coupon-list" v-if="disableCouponList.length">
                                <view class="disabled-title">不可用优惠劵</view>
                                <block v-for="(item, index) in disableCouponList" :key="index">
                                    <view class="coupon disabled-coupon">
                                        <view class="main-ticket">
                                            <view class="main-mark disabled-mark">商品券</view>
                                            <view class="coupon-detail">
                                                <view style="text-align: center">
                                                    <view class="coupon-price disabled-color">
                                                        <text class="text disabled-color" v-if="item.couponsType != 2">￥</text>
                                                        <text class="price disabled-color">{{ item.faceValue }}</text>
                                                        <text class="text disabled-color" v-if="item.couponsType == 2">折</text>
                                                    </view>
                                                    <view class="full-discount disabled-color" v-if="item.couponsType == 1">满{{ item.amountLimitation }}可用</view>
                                                    <view class="full-discount disabled-color" v-if="item.couponsType == 3">满{{ item.faceValue }}可用</view>
                                                </view>
                                                <view class="coupon-info">
                                                    <view class="condition">{{ item.spuName }}</view>
                                                    <view class="indate">
                                                        {{ $u.timeFormat(new Date(item.effectiveStartTime.replace(/-/g,"/")).getTime(), 'yyyy.mm.dd') }}-{{ $u.timeFormat(new Date(item.effectiveEndTime.replace(/-/g,"/")).getTime(), 'yyyy.mm.dd') }}
                                                    </view>
                                                    <view class="explain indate">未到优惠券使用时间或结算金额不符合条件</view>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </block>

                            </view>


                        </view>
                    </template>
                </view>
                <view class="empty-page" v-else>
                    <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/Discount_bg%402x.png" alt="" />
                    <p class="nocoupon-txt">抱歉，您暂无不可使用的优惠券</p>
                </view>
            </scroll-view>
            <view class="u-padding-top-12 u-padding-bottom-12">
                <u-button shape="circle" @click="confirmSelect()" hover-class="none" :custom-style="{
                    width: '680rpx',
                    height: '76rpx',
                    margin: '0 auto',
                    background: 'linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%)',
                    borderRadius: '38rpx',
                    color: '#FFF9E9',
                    fontWeight: 500
                }">
                    确定
                </u-button>
            </view>
        </view>
    </u-popup>

</template>
<script>
export default {
    props: {
        haveActivity: {
            type: Boolean,
            default: false
        },
        isCheckBox: {
            type: Boolean,
            default: false
        },
        disable: {
            type: Boolean,
            default: false
        },
        // 是否刷新活动数据
        reloadActive: {
          type: Boolean,
          default: false
        }
    },
    data() {
        return {
            popupShow: false,
            usableCouponList: [],
            disableCouponList: [],
            beforeCouponPrice: 0, // 优惠前价格
            selectCouponItem: {},

            couponData: {}, // 购物车优惠券数据
            tiredPricingList: null // 最优活动数据
        };
    },
    computed: {
        selectCouponCount() {
            let list = this.usableCouponList,
                num = 0;
            if (list && list.length > 0) {
                list.forEach(item => {
                    if (item.checked) {
                        num += 1;
                    }
                });
            }
            return num
        },
        sumSelectCouponDiscount() {
            let list = this.usableCouponList,
                price = 0;
            if (list && list.length > 0) {
                list.forEach(item => {
                    if (item.checked) {
                        price += item.couponDiscount;
                    }
                });
            }
            return price
        },
    },
    methods: {
        setShowCopun(info) {
            this.popupShow = true
            this.haveActivity ? this.getQueryDiscounts(info) : this.openPopup(info)
            this.beforeCouponPrice = info.skuList.reduce((prev, cur) => {
                return prev + Number(cur.beforeCouponPrice) * cur.num;
            }, 0).toFixed(2)
        },
        close() { },
        fliterCanUseProductCoupon(item) {
            let flag = true
            const spuIdList = []
            for (let i in this.usableCouponList) {
                if(!spuIdList.includes(this.usableCouponList[i].spuId)) {
                    spuIdList.push(this.usableCouponList[i].spuId)
                }
                if (this.usableCouponList[i].spuId == item.spuId && this.usableCouponList[i].checked == true) {
                    flag = false
                }
            }
            return flag && spuIdList.length>1
        },
        selectProductCoupon(item, index, type) {
            console.log(index, type)
            if(this.disable) {
                return
            }
            if (type == "select") {
                this.usableCouponList[index].checked = true
                for (let i in this.usableCouponList) {
                    if (this.usableCouponList[i].spuId == item.spuId && this.usableCouponList[i].id != item.id) {
                        this.usableCouponList[i].checked = false
                    }
                }

            } else if (type == "cancel") {
                this.usableCouponList[index].checked = false
            }
            if (!this.isCheckBox) {
                this.selectCouponItem = type == 'select' ? this.usableCouponList[index] : {}
            }

            // 商品详情切换优惠券重新赋值 券后价格
            if(this.haveActivity) {
              if( !this.selectCouponItem) {
                this.couponData.finalPrince = this.couponData.price - this.couponData.marketingDiscount
              } else {
                this.couponData.finalPrince = this.selectCouponItem.afterCouponPrice
              }
            }
        },
        // 确定选项
        confirmSelect() {
            let list = this.usableCouponList, userCouponDiscount = 0, couponIds = [], choosedCoupon = []
            list.forEach(item => {
                if (item.checked) {
                    userCouponDiscount = parseInt((userCouponDiscount + item.couponDiscount) * 100) / 100
                    couponIds.push(item.id)
                    choosedCoupon.push(item)
                }
            })


            let item = {
                ids: couponIds,
                userCouponDiscount,
                usableCouponNum: list.length,
                choosedCoupon
            }

            this.$emit('callback', item)
            this.popupShow = false;
        },
        // 查询优惠列表
        async getQueryDiscounts(info) {
            // 刷新活动数据
            if(this.reloadActive) {this.tiredPricingList = null}

            let { skuList:spuDiscountBos, sourceType } = info
            let param = {
                sourceType,
                spuDiscountBos
            }
            await this.$u.api.queryDiscounts(param).then(res => {
                this.couponData = res.data
                // 选出最优活动
                let activeArray = res.data?.markingVo?.tiredPricingList.filter((item)=>{
                    return res.data?.price >= item.amountLimitation
                })
                if( activeArray ){ this.tiredPricingList = activeArray.sort((a, b) => { return b.amountLimitation - a.amountLimitation })[0] }
                this.beforeCouponPrice = this.couponData.price
                // 优惠券处理
                let idList = info.ids || []
                if(!this.disable &&!idList.length) {
                    idList = res.data.couponList.filter(item=>item.checked).map(item=>item.id)
                }
                this.handleResult(res.data.couponList,idList)
            })
        },
        async openPopup(info) {
            const copunIds = info.ids || []
            await this.$u.api.GetUserCoupons(info.skuList).then(res => {
                this.handleResult(res.data,copunIds)
                // let list = res.data, usableCouponList = [], disableCouponList = []
                // list.forEach(item => {
                //     if(!this.disable) {
                //         item.checked = false
                //     }
                //     if (item.usable == true) {
                //         usableCouponList.push(item)
                //     } else {
                //         disableCouponList.push(item)
                //     }
                // })
                // for (let i in info.ids) {
                //     for (let j in usableCouponList) {
                //         if (info.ids[i] == usableCouponList[j].id) {
                //             usableCouponList[j].checked = true
                //         }
                //     }
                // }
                // this.usableCouponList = usableCouponList
                // this.disableCouponList = disableCouponList
                // if(this.disable) {
                //     this.selectCouponItem = this.usableCouponList.filter(item=>item.checked)[0]
                // }
            })
        },
        handleResult(data, copunIds) {
            let list = data, usableCouponList = [], disableCouponList = []
                list.forEach(item => {
                    if(!this.disable) {
                        item.checked = false
                    }
                    if (item.usable == true) {
                        usableCouponList.push(item)
                    } else {
                        disableCouponList.push(item)
                    }
                })
                for (let i in copunIds) {
                    for (let j in usableCouponList) {
                        if (copunIds[i] == usableCouponList[j].id) {
                            this.selectCouponItem = usableCouponList[j]
                            usableCouponList[j].checked = true
                        }
                    }
                }
                this.usableCouponList = usableCouponList
                this.disableCouponList = disableCouponList
                if(this.disable) {
                    console.log(this.usableCouponList, 99999999999)
                    this.selectCouponItem = this.usableCouponList.filter(item=>item.checked)[0]
                }
        }
    },
}
</script>

<style lang="scss" scoped>
.empty-page {
    text-align: center;

    height: 100%;
    image {
        margin-top: 120rpx;
        width: 180rpx;
        height: 180rpx;
    }
    .nocoupon-txt {
        font-size: 28rpx;
        color: #999;
        margin-top: -6rpx;
        height: 40rpx;
        line-height: 40rpx;
    }
}
.font-bold {
    font-weight: bold;
}
.applet-settlement-popup-wrap {
    color: #000000;
    position: relative;
    .applet-settlement-popup-header {
        height: 100rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        &-title {
            font-size: 32rpx;
            font-weight: bold;
            color: #000000;
        }
        &-title-center {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        &-close {
            height: 100rpx;
            width: 104rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            &-icon {
                height: 40rpx;
                width: 54rpx;
            }
        }
    }
    .applet-settlement-popup-body {
        color: #000000;
        .after-price {
            padding: 20rpx 24rpx;
            border-radius: 24rpx;
            background: rgba(255, 10, 53, 0.08);
            width: fit-content;
            margin: auto;
            color: #ff0a35;
            text-align: center;
        }
        .coupon-list {
            .coupon-list-title {
                color: #222;
                font-size: 30rpx;
                font-weight: bold;
                margin-bottom: 24rpx;
                padding-left: 24rpx;
                .ic_youhui {
                    width: 36rpx;
                    height: 36rpx;
                    margin-right: 8rpx;
                }
            }
            .disabled-title {
                color: #6e6e6e;
                font-size: 26rpx;
                padding-left: 24rpx;
                margin-bottom: 24rpx;
            }
            .coupon-discount-sum {
                padding: 0 24rpx 40rpx;
                font-size: 28rpx;
                color: #000;
                line-height: 36rpx;
            }
            .disabled-coupon {
                background: #f2f2f2;
                .main-ticket {
                    width: auto !important;
                }
            }
            .product-coupon {
                background: #fff7ee;
            }
            .coupon {
                margin: 0 24rpx 20rpx;
                height: 196rpx;
                border-radius: 16rpx;
                overflow: hidden;
                display: flex;
                position: relative;
                .usable-mark {
                    position: absolute;
                    right: 16rpx;
                    top: 16rpx;
                    color: #fe8993;
                    line-height: 28rpx;
                    font-size: 20rpx;
                }
                .main-ticket {
                    width: 502rpx;
                    position: relative;
                    padding: 52rpx 0 20rpx 56rpx;
                    .coupon-detail {
                        display: inline-flex;
                        align-items: center;
                        height: 76rpx;
                        .disabled-color {
                            color: #999 !important;
                        }
                        .store-color {
                            color: #fe8c02 !important;
                        }
                        .product-color {
                            color: #fe8c02 !important;
                        }
                        .coupon-price {
                            font-weight: 600;
                            display: inline-flex;
                            align-items: baseline;
                            .text {
                                font-size: 28rpx;
                                line-height: 40rpx;
                            }
                            .price {
                                margin: 0 8rpx;
                                font-size: 64rpx;
                                line-height: 76rpx;
                            }
                        }
                        .full-discount {
                            font-size: 28rpx;
                        }
                        .coupon-info {
                            padding-top: 16rpx;
                            margin-left: 56rpx;
                            display: inline-flex;
                            flex-direction: column;
                            justify-content: space-between;
                            align-items: flex-start;
                            .condition {
                                width: 340rpx;
                                color: #000;
                                font-size: 28rpx;
                                line-height: 40rpx;
                                font-weight: 500;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                margin-bottom: 16rpx;
                            }
                            .indate {
                                color: #666;
                                font-size: 22rpx;
                                line-height: 32rpx;
                            }
                            .explain {
                                margin-top: 16rpx;
                            }
                        }
                    }

                    .disabled-mark {
                        background: #999;
                    }

                    .product-mark {
                        background: #ffb760;
                    }

                    .main-mark {
                        width: 100rpx;
                        height: 36rpx;
                        border-radius: 0 0 16rpx 0px;
                        position: absolute;
                        left: 0;
                        top: 0;
                        text-align: center;
                        line-height: 36rpx;
                        font-size: 20rpx;
                        color: #fff;
                    }
                }
                .stub-ticket {
                    width: 200rpx;
                    display: inline-flex;
                    align-items: center;
                    justify-content: flex-end;
                    .choosebox {
                        width: 36rpx;
                        height: 36rpx;
                        margin-right: 36rpx;
                    }
                }
            }
        }
        .estimate-card {
            border-radius: 16rpx;
            border: 1rpx solid #FF0A35;
            padding: 0;
            font-size: 18rpx;
            display: inline-block;
            text-align: center;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FF0A35;
            .text {
                background: rgba(255, 10, 53, 0.08);
                padding: 4rpx 12rpx;
                line-height: 28rpx;
                border-radius: 16rpx 16rpx 0 0;
                font-size: 18rpx;
            }
            .price {
                padding: 4rpx 12rpx;
                line-height: 28rpx;
                font-size: 18rpx;
            }
        }
        .detail-bubble {
            width: 702rpx;
            height: fit-content;
            // border: 1rpx solid #ff0a35;
            border-radius: 20rpx;
            display: flex;
            flex-direction: column;
            padding: 26rpx;
            position: relative;
            margin: 18rpx auto 0;
            text-align: center;
            margin-bottom: 32rpx;
            background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/coupon/coupon_border.png') no-repeat;
            background-size: 100% 100%;
            .detail-bubble-title {
                font-size: 22rpx;
                color: #444;
                line-height: 30rpx;
                margin-bottom: 20rpx;
            }
            .reduce-tip {
                color: #ff0a35;
                font-weight: bold;
                margin-bottom: 4rpx;
                .reduce-text {
                    margin-right: 26rpx;
                    &:last-child {
                        margin-right: 0;
                    }
                }
            }
            .detail-bubble-content {
                margin: 32rpx 0;
                font-size: 36rpx;
                font-weight: 600;
                color: #e60113;
                line-height: 50rpx;
            }
            .nonuse-content {
                margin-top: 122rpx;
                text-align: center;
                font-size: 28rpx;
                font-weight: 500;
                color: #999;
                line-height: 36rpx;
            }
            // &::before {
            //     content: "";
            //     width: 0;
            //     height: 0;
            //     position: absolute;
            //     top: -11rpx;
            //     left: 50%;
            //     transform: translateX(-50%);
            //     border-left: 14rpx solid transparent;
            //     border-right: 14rpx solid transparent;
            //     border-bottom: 10rpx solid #e60113;
            // }
            // &::after {
            //     content: "";
            //     width: 0;
            //     height: 0;
            //     position: absolute;
            //     top: -9rpx;
            //     left: 50%;
            //     transform: translateX(-50%);
            //     border-left: 14rpx solid transparent;
            //     border-right: 14rpx solid transparent;
            //     border-bottom: 10rpx solid #fff;
            // }
        }
        .activity-card {
            margin-bottom: 32rpx;
            .coupon-list-title {
                color: #222;
                font-size: 30rpx;
                font-weight: bold;
                margin-bottom: 24rpx;
                padding-left: 24rpx;
                .ic_youhui {
                    width: 36rpx;
                    height: 36rpx;
                    margin-right: 8rpx;
                }
                .gery-tip {
                    font-size: 20rpx;
                    color: #999;
                    margin-left: 8rpx;
                    font-weight: normal;
                }
            }
            .activity-item {
                padding-left: 28rpx;
                margin-bottom: 20rpx;
                &:last-child {
                    margin-bottom: 0;
                }
                .tag {
                    color: #ff0a35;
                    font-size: 20rpx;
                    line-height: 28rpx;
                    background: rgba(255, 10, 53, 0.08);
                    padding: 4rpx 16rpx;
                    border-radius: 4rpx;
                }
                .tip-text {
                    color: #191919;
                    font-size: 26rpx;
                    padding-left: 4rpx;
                }
            }
        }
    }
}

.detail-bubble-none {
    display: none;
}
.applet-settlement-popup-header-title {
    font-size: 32rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #000D1D;
    line-height: 44rpx;
}
.font-din {
    font-family: DINAlternate-Bold, DINAlternate;
}
</style>


