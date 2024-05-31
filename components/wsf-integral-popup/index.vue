<template>
    <view class="point-popup" v-if="showUse">
        <slot :integralMoney="integralMoney" :openGoodFortuneValue="openGoodFortuneValue">
            <view class="point-content u-flex u-row-between" :class="{ 'no-right': integral <= 0 }" @tap="openGoodFortuneValue()">
                <view class="u-font-26 label">福气值(共{{ integral }})</view>
                <view class="u-flex u-font-26">
                    <span v-show="integralMoney" class="wsf-red">-¥{{ integralMoney.toFixed(2) }}</span>
                    <span v-show="!integralMoney" class="wsf-grey u-font-22">{{ parseFloat(integral) ? '去使用' : '无可用' }}</span>
                    <image v-if="integral > 0" class="more-icon" src="@/static/img/icon/more-icon.png"></image>
                </view>
            </view>
        </slot>

        <u-popup v-model="goodFortunePopup" mode="center" border-radius="20" width="90%" :closeable="false" safe-area-inset-bottom @close="fqzFocus = false">
            <view class="good-fortune-popup">
                <view class="title">
                    <view class="fqz-title">
                        福气值
                        <span class="fqz">(剩余{{ integral }})</span>
                    </view>
                    <image class="close" src="@/static/img/icon/close-icon.png" @tap="goodFortunePopup = false; fqzFocus = false" />
                </view>
                <view class="container-fqz">
                    <view class="fqz-use-title wsf-grey u-font-26 u-margin-bottom-16">抵扣福气值</view>
                    <view class="input-wrapper u-flex u-row-between u-font-26" hover-class="none" hover-stop-propagation="false">
                        <input
                            :focus="fqzFocus"
                            @focus="fqzFocus = true"
                            v-model="useIntegral"
                            class="good-fortune-input"
                            type="digit"
                            @input="inputGoodFortuneData($event)"
                            @blur="getFqzMoney()" />
                        <span @click="setAllFqz" class="wsf-red">全部</span>
                    </view>

                    <view class="discount-amount">
                        抵扣
                        <text class="yuan">¥</text>
                        <text class="money">{{ tempIntegralMoney.toFixed(2) }}</text>
                    </view>
                </view>
                <view class="confirm-btn-wrapper">
                    <button class="confirm-btn" @tap="goodFortuneConfirm()">确定</button>
                </view>
            </view>
        </u-popup>
    </view>
</template>

<script>
import { BUSINESS_TYPE } from '@/common/constants/order.js'
import { getIntegralAccountAndCfg } from '@/common/smart-api/pay.js'

export default {
    options: {
        styleIsolation: 'shared'
    },
    name: 'integral-popup',
    props: {
        /**
        * 业务类型
        * 100 电商
        * 200 充值
        */
        businessType: {
          type: Number,
          default: 100,
        },

        // 订单价格
        orderLastTotalPrice: {
            type: [String, Number],
            default: 0
        },

        // 优惠券抵扣金额
        sumUserCouponDiscount: {
            type: [String, Number],
            default: 0
        },

        // 是否总是显示
        alwaysShow: {
          type: Boolean,
          default: true,
        },
    },
    data() {
        return {
            useIntegral: '', // 使用福气值数量
            tempIntegralMoney: 0, // 输入福气值时候 计算抵扣金额
            integralMoney: 0, // 福气值抵扣金额
            integral: 0, // 福气值数量
            configRate: 100000, //福气值比率 1元=xxx福气值
            goodFortunePopup: false,
            fqzFocus: false,
            configStatus: 2
        }
    },

    computed: {
        // 显示使用福气值按钮
        showUse() {
            return (this.alwaysShow || this.integral) && this.configStatus === 1
        },

        // 订单价格
        orderPrice() {
          return this.amountUnitYuan ? ~~(this.orderLastTotalPrice * 100).toPrecision(12) : this.orderLastTotalPrice
        },

        // 使用优惠券价格
        useCouponPrice() {
          return this.amountUnitYuan ? ~~(this.sumUserCouponDiscount * 100).toPrecision(12) : this.sumUserCouponDiscount
        },

        // 金额单位是否为元， 不在集合内则为分
        amountUnitYuan({ businessType }) {
          const unitYuanMap = {
            [BUSINESS_TYPE.mall]: 'yuan',
          }
        
          return unitYuanMap[businessType] === 'yuan'
        },
    },

    created() {
        this.getConfig();
    },

    methods: {
        async getConfig() {
            
            try {
              const { code, data } = await getIntegralAccountAndCfg({
                serviceType: this.businessType,
              })
          
              if (code === 200) {
                const configRate = data.integralPoint / data.integralPrice
                const { integralPointAvailable, status, cfgId } = data
                if (integralPointAvailable !== this.integral || this.configRate !== configRate || this.status !== status || this.integralCfgId !== cfgId) {
                    this.$emit('update:integralMoney', 0)
                    this.$emit('update:useIntegral', 0)
                    this.useIntegral = '';
                    this.integralMoney = 0;
                }

                this.integral = integralPointAvailable
                this.configRate = configRate
                this.configStatus = status
            
                this.$emit('update:configStatus', status)
                this.$emit('update:integralCfgId', data.cfgId)
                this.$emit('update:integral', integralPointAvailable)
              }
            } catch (error) {
              console.log('error', error)
            }
        },

        openGoodFortuneValue() {
            if (!this.integral) return

    	    this.goodFortunePopup = true
    	    
    	    this.fqzFocus = true
    	    
    	},

        showToastError(errMsg, duration = 1500) {
    	    uni.showToast({
    	    	title: errMsg,
    	    	icon: 'none',
    	    	mask: true,
    	    	duration: duration
    	    });
    	},

        /** 只保留小数点后两位, 后面的小数全部舍弃 */
        formatePrice(price) {
          return Math.floor((price * 100).toPrecision(12)) / 100
        },

        /** 输入福气值计算抵扣金额*/
        getFqzMoney(type) {
    	    // this.fqzFocus = false
            const configRate = this.configRate

            // if (!useIntegral || !configRate) return
            let money = this.formatePrice(this.useIntegral / configRate)
            const orderPrice = this.formatePrice(this.orderPrice - this.useCouponPrice)

            if (type !== 'input') {
                // 如果输入的福气值不是configRate倍数，则向下取整抵扣  计算出使用福气值数量
                if (this.useIntegral % configRate !== 0) {
                    this.useIntegral = ~~money * configRate
                    money = this.formatePrice(this.useIntegral / configRate)
                }

                // 如果输入的福气值大于订单价格 则将福气值置为订单价格
                if (money > orderPrice) {
                  this.useIntegral = Math.floor(this.formatePrice(orderPrice * configRate))
                  money = this.formatePrice(this.useIntegral / configRate)
                }
            }

            this.tempIntegralMoney = this.useIntegral ? money / 100 : 0
    	},

        // 福气值超界 将福气值置为可用最大
        checkIntegralNum(useIntegral) {
            this.getFqzMoney()

            // 如果超界  则修改使用福气值数量
            if (useIntegral > this.useIntegral) {
              this.goodFortuneConfirm()
            }
        },

        setAllFqz() {
            this.useIntegral = this.integral;
            this.getFqzMoney();
        },

        /** 只保留整数 */
        checkNum(num) {
            num = num.replace(/[^\d]/g, ""); // 清除“数字”和“.”以外的字符
            // num = num.replace(/^0*/, ""); // 验证第一个字符是否为数字

            if (num != "") {
                num = parseInt(num); // 将字符串转换成数字
            }

            return num;
        },

        /** 输入福气值 只允许输入整数 */
        inputGoodFortuneData(e) {
            let value = this.checkNum(e.detail.value);

            if (value > this.integral) {
                value = this.integral;
            }

            this.$nextTick(() => {
                this.useIntegral = value;

                this.getFqzMoney('input')
            })
        },

        // 确认福气值抵扣
        goodFortuneConfirm() {
            if (this.useIntegral || this.useIntegral === 0) {
                this.$nextTick(() => {
                    this.integralMoney = this.tempIntegralMoney
                    this.goodFortunePopup = false
                    this.fqzFocus = false
                    const money = this.amountUnitYuan ? this.integralMoney : ~~(this.integralMoney * 100).toPrecision(12)

                    this.$emit('update:integralMoney', money)
                    this.$emit('update:useIntegral', this.useIntegral)
                })
            } else {
                this.showToastError("请输入福气值");
            }
        },


    },
}
</script>

<style lang="scss" scoped>
    .wsf-red {
    	color: #FF0A35;
    }
    .wsf-grey {
    	color: #999;
    }

    .point-content {
        padding: 20rpx 24rpx 18rpx;
        &.no-right {
        	padding-right: 60rpx;
        }
        &.bill-item {
        	padding: 0 24rpx;
        }
        .label {
        	color: #191919;
        }
        .more-icon {
            width: 32rpx;
            height: 32rpx;
            margin-left: 4rpx;
        }
        .activity-label {
    	    color: #FF0A35;
    	    border: 1rpx solid #FF0A35;
    	    height: 28rpx;
    	    font-size: 20rpx;
    	    line-height: 28rpx;
    	    padding: 0 12rpx;
    	    border-radius: 8rpx;
    	    margin-left: 8rpx;
        }
        /deep/ .u-input__input {
        	height: 28rpx;
        	min-height: 28rpx !important;
        	line-height: 28rpx;
        	font-size: 22rpx;
        }
        /deep/ .u-input__right-icon {
        	height: 28rpx;
        }
    }
    .good-fortune-popup {
        background: #F6F6F6;
        .title {
            display:flex;
            align-items:center;
            justify-content:center;
            padding: 24rpx 0;
            text-align:center;
            font-size: 30rpx;
            line-height: 36rpx;
            position:relative;
            .fqz-title {
                color: #000D1D;
                font-size: 32rpx;
            }
            .fqz {
                color: #444;
                font-size: 22rpx;
            }
        }
        .close {
            position:absolute;
            right: 24rpx;
            top: 26rpx;
            width: 54rpx;
            height: 40rpx;
        }
    }
    .container-fqz {
        background: #fff;
        border-radius: 24rpx 24rpx 0 0;
        padding: 72rpx 40rpx 40rpx 48rpx;
        .input-wrapper {
            height: 72rpx;
            margin-bottom: 16rpx;
            border-bottom: 2rpx solid #eee;
            .good-fortune-input {
                height: 100%;
                background: #fff;
                font-size: 64rpx;
                text-align:left;
                flex: 1;
                display:block;
                color: #191919;
                caret-color: #ff450c;
            }
        }
    }
    .discount-amount {
        color: #444;
        font-size: 26rpx;
        .yuan {
            margin-left: 8rpx;
            font-size: 26rpx;
            color: #FF0A35;
        }
        .money {
            font-size: 26rpx;
            color: #FF0A35;
        }
    }
    .confirm-btn-wrapper {
        background: #fff;
        padding: 0 24rpx 24rpx;
        .confirm-btn {
            margin: 0 32rpx;
            height: 80rpx;
            background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
            border-radius: 38rpx;
            line-height: 80rpx;
            text-align:center;
            font-size: 28rpx;
            color: #fff;
        }
    }
</style>
