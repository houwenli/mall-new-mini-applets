<template>
	<view class="refund">
		<view class="product-card">
			<image class="product-img" :src="orderSku.skuImage" />
			<view class="product-info">
				<view class="name">{{orderSku.skuName}}</view>
				<view class="spec-column">
					<text class="spec">{{orderSku.skuSpecs&&orderSku.skuSpecs.split(':').join('：')}}</text>
                    <text class="sku-num">x{{orderSku.num}}</text>
				</view>
				<!-- <view class="price">￥{{orderSku.skuPrice ? Number(orderSku.skuPrice).toFixed(2) : '0.00'}}</view> -->
			</view>
		</view>
		<!-- <view class="u-padding-left-36 u-padding-right-36" v-if="receiptType> 0">
			<view class="applet-refund-receipt-type">
				<view class="applet-refund-receipt-type-title">您是否已收到货</view>
				<view class="applet-refund-receipt-type-radio">
					<wsf-radio
						v-model="receiptType"
						:options="[{ value: 1, label: '未收货' }, { value: 2, label: '已收货' }]"
					></wsf-radio>
				</view>
			</view>
		</view> -->
		<!-- <view class="u-padding-left-36 u-padding-right-36">
			<view class="hint">
				<view class="title">温馨提示:</view>
				<view v-if="receiptType <= 1" class="txt">订单一旦取消，无法恢复</view>
				<view v-else class="txt">若您对已收到货的商品质量不满意，您可以联系商家售后，订单状态将自动设置为“已完成”</view>
			</view>
		</view> -->

		<view v-if="receiptType <= 1">
			<view class="block-item reason">
				<view class="block-label">退款原因</view>
				<view class="block-value">
					<u-input input-align="right" style="flex: 1;" v-model="refund.value" disabled type="text" height="100" :border="false" :clearable="false" placeholder="请选择退款原因"  @click="popupShowFun" :placeholder-style="placeholderStyle" />
					<image class="icon-right" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-right.png"></image>
				</view>
			</view>
			<view class="block-item">
				<view class="block-label">申请退款金额</view>
				<view class="u-margin-right-44">
					<view class="total">¥{{orderSku.price ? Number(orderSku.price).toFixed(2) : '0.00'}}</view>
					<view>
						<text class="unit-price-value">单价：¥{{orderSku.skuPrice ? Number(orderSku.skuPrice).toFixed(2) : '0.00'}}</text>
						<text class="unit-price-value">申请数量：{{orderSku.num}}</text>
					</view>
				</view>
			</view>
			<!-- <template v-if="!popupShow">
				<view class="input-item">
					<view class="txt-2">退款联系人:</view>
					<view class="u_input">
						<u-input v-model="refund.contact" height="100" :border="false" :clearable="false" placeholder="请输入联系人" :placeholder-style="placeholderStyle" />
					</view>
				</view>
				<view class="input-item input-3">
					<view class="txt-3">联系方式:</view>
					<view class="u_input">
						<u-input v-model="refund.phone" maxlength="11" type="number" height="100" :border="false" :clearable="false" placeholder="请输入手机号" :placeholder-style="placeholderStyle" />
					</view>
				</view>
			</template>
			<template v-else>
				<view class="input-item input-2">
					<view class="txt-2">退款联系人:</view>
					<view class="u_input">
						<u-input v-model="refund.contact" disabled height="100" :border="false" :clearable="false" placeholder="请输入联系人" :placeholder-style="placeholderStyle" />
					</view>
				</view>
				<view class="input-item input-3">
					<view class="txt-3">联系方式:</view>
					<view class="u_input">
						<u-input v-model="refund.phone" disabled maxlength="11" type="number" height="100" :border="false" :clearable="false" placeholder="请输入手机号" :placeholder-style="placeholderStyle" />
					</view>
				</view>
			</template> -->

		</view>
		<view v-else class="applet-refund-placeholder u-padding-left-36 u-padding-right-36">您的商品已出库，订单拦截可能不成功，您可到订单详情页关注最新进展。</view>
		<view v-if="receiptType <= 1"  class="bottom-column">
            <view class="refund-btn"  :class="{'red-btn':refund.value,'grey-btn':!refund.value}" @click="refund.value && refundFun()">申请退款</view>
		</view>
		<view v-else  class="placeholder-btn">
			<u-button type="error" shape="circle" @click="serviceTel">联系商家</u-button>
		</view>

		<!-- 取消订单模块 -->
		<wsf-popup v-model="popupShow" mode="bottom" title="取消订单" :safe-area-inset-bottom="true">
			<!-- 弹框组件 -->
			<view class="applet-cancel-order-wrap">
				<view class="applet-cancel-order-radio">
                    <view><text class="text-icon">*</text><text class="text-title">请选择申请退款的原因</text></view>
					<template v-for="(item, index) in informationList">
						<view class="applet-cancel-order-radio-item" :key="index" @click="selectInformation(item,index)">
							<text class="radio-item-text">{{ item.label }}</text>
                            <view
                                :class="item.value === cancelInformation
                                ? 'reason-item-checked'
                                : 'reason-item-check'"
                            ></view>
						</view>
					</template>
				</view>
                <view class="applet-cancel-order-footer" slot="footer">
				    <view class="applet-cancel-order-footer-switch u-flex u-row-between" v-if="orderType!=12">
				    	<text class="applet-cancel-order-footer-switch-text">提交后，将本单商品放回购物车中</text>
				    	<wsf-switch inactive-color="#DDD" activeColor="#FF0A35" :height="60" :activeSize="52" :width="100" v-model="isAddCart"></wsf-switch>
				    </view>
			    </view>
			</view>

            <view class="popiup-bottom-column">
                <view class="refund-btn"  
                :class="cancelInformation < 0
                ? 'grey-btn'
                : 'red-btn'"  @click.stop="cancelOrder">提交</view>
		    </view>
		</wsf-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				placeholderStyle: "font-size: 22rpx; color:#999999",
				popupShow: false ,// 弹出组件状态
				isAddCart: false, // 是否加入购物车
				cancelInformation: -1, // 取消原因ID
				refund: {
					contact:"", //联系人
					phone: null, // 手机号
					value: "",
                    reasonType: '', // 原因id
				},
				receiptType: 0,
				orderSku: {},
				informationList: [
					{
						label: '地址信息填写错误',
						value: 1
					},

					{
						label: '不想要了',
						value: 2
					},

					{
						label: '商品错选/多选',
						value: 3
					},

					{
						label: '商品无货',
						value: 4
					},

					{
						label: '商品降价',
						value: 5
					},
					{
						label: '没用/少用/错用优惠',
						value: 6
					},

				],
				orderType: ''// 12为销售电动车类型
			};
		},
		onLoad(options) {
			console.log(options,"options");
			this.receiptType = options.receiptType
			this.orderId = options.orderId
			this.orderType = options.orderType
			// 12为销售电动车类型
			if(this.orderType == 12){
				this.informationList.shift()
			}

			let {skuImage, skuName, price, num, id, skuPrice, skuSpecs} = options
			this.orderSku = {skuImage, skuName, price, num, id, skuPrice, skuSpecs}
			console.log(this.orderSku,"this.orderSku");

            // 获取详情
            this.getList()
		},
		computed:{
			refundDisabled(){
				// this.refund.contact&& this.refund.phone&&
				if(this.refund.value){
					return false
				}else{
					return true
				}
			}
		},
		methods:{
            //获取详情
            getList(){
                let data = {
                    orderId: this.orderId,
                    orderSkuId: this.orderSku.id
                };
                this.$u.api.queryorderforreturn(data).then(res => {
                    let isThird = (res.data || {}).placeOrderType == 3
                    // 订单类型是否是第三方，为3时需要请求第三方售后原因
                    if (isThird) {
                        this.getReasonList()
                    }
                });
            },

            getReasonList() {
                let param = {after_sale_type: 0, is_received: 0}
                this.$u.api.getReasonList(param).then((res) => {
                    if (res.code == 200) {
                        let reasonKeys = Object.keys(res.data || {})
                        this.informationList = reasonKeys.map(item => {
                            return { 
                                label: res.data[item],
						        value: item,
                                reasonType: item,
                            }
                        })
                    }
                })
            },
            
			// 弹出层显示/隐藏
			popupShowFun(){
				setTimeout(() => {
					this.popupShow = !this.popupShow
				}, 200)


			},
			// 申请退款
			refundFun(){
				const refundData = {
					addCart: this.isAddCart? 1: 0,
					// contactMobile: this.refund.phone,
					// contactName: this.refund.contact,
					orderId: this.orderId,
					reason: this.refund.value,
					orderSkuId: this.orderSku.id,
                    reasonType: this.refund.reasonType,
				}
				// if(!this.$u.test.mobile(refundData.contactMobile)){
				// 	this.$u.toast("请输入正确的手机号")
				// 	return
				// }
				let that = this;
                uni.requestSubscribeMessage({
                      tmplIds: [
                        "54hz-bKE1_1wbrjviLeUk76deR_aTvKyPF_1lsoja2c",//退款申请通知
                        "mOiiZVniN7mZgyXhNARzVuMV41WQ3oD_eCFcRlcrW_s",//退款成功通知
                        "osy53Pg9HAMtJMA5bBlpV6QN9jvQS6Nmm7qtQfOhI9g",//退款失败通知
                      ],
                      success(res) {
                        console.log("成功回调：", res);
                      },
                      fail(res) {
                        console.log("失败回调：", res);
                      },
                      complete: (res) => {
                        console.log("关闭了消息订阅授权：", res);
                    that.$u.api.ApplySkuRefundNew(refundData).then(res => {
					if (Number(res.data) > 0) {
					that.$u.toast('申请退款成功')
					 this.$wsf.go("RefundServiceDetail",{ orderId: res.data },"redirectTo");
					return;
					} else if (Number(res.data) == -1) {
					that.$u.toast('订单状态错误')
					} else {
					that.$u.toast('申请退款失败')
					}
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					}, 1000);
				})
                },
            });
			},
			// 选择取消原因
			selectInformation(item,idx) {
				this.$nextTick(function(){
					this.cancelInformation = this.informationList[idx].value
					this.refund.value = this.informationList[idx].label
                    this.refund.reasonType = this.informationList[idx].reasonType
				})
			},
			// 取消订单
			cancelOrder() {
				if (this.cancelInformation < 0) {
					this.$u.showToast('请选择取消原因')
					return
				}
				// 发送请求
				// 关闭弹窗
				this.popupShow = false
			}
		}
	}
</script>

<style lang="scss">
.refund {
    position:relative;
    padding-top: 20rpx;
	.hint {
		width: 100%;
		background: #F5F5F5;
		border-radius: 8rpx;
		padding: 36rpx 20rpx;
		.title,.txt {
			font-size: 26rpx;
			font-weight: 400;
			color: #000000;
		}
		.txt {
			padding-top: 24rpx;
			color: #666666;
		}
	}
        .block-item{
            background: #FFFFFF;
            border-radius: 24rpx;
			display: flex;
			align-items: center;
            justify-content: space-between;
			margin: 0rpx 20rpx 20rpx 20rpx;
            padding: 28rpx 24rpx;
        }
        .block-label{
            font-size: 26rpx;
            color: #191919;
        }
        .block-value{
            display: flex;
			align-items: center;
        }
        .icon-right{
            width: 32rpx;
            height: 32rpx;
            margin-left: 12rpx;
        }
        .reason{
            height: 88rpx;
        }
        .u-input__input{
            font-size: 22rpx !important;
            color: #191919;
        }
        .total{
            text-align: right;
            font-size: 26rpx;
            color: #191919;
            margin-bottom: 4rpx;
        }
        .unit-price-value{
            font-size: 22rpx;
            color: #999999;
            margin-left: 20rpx;
        }
	.btn {
		padding: 82rpx 36rpx 0 36rpx;
	}
	.placeholder-btn {
		padding: 0 36rpx;
	}
	// 取消订单模块
	.applet-cancel-order-wrap {
		padding: 0rpx 24rpx 24rpx 24rpx;
        background: #F6F6F6;
		.applet-cancel-order-tips {
			width: 100%;
			height: 160rpx;
			background: #f5f5f5;
			border-radius: 4px;
			padding-left: 20rpx;
			padding-top: 36rpx;
			margin-bottom: 60rpx;
			&-title {
				font-size: 26rpx;
				font-weight: 400;
				color: #000000;
				line-height: 30rpx;
				margin-bottom: 24rpx;
			}
			&-text {
				font-size: 26rpx;
				font-weight: 400;
				color: #666666;
				line-height: 36rpx;
			}
		}
		.applet-cancel-order-radio {
            background: #FFFFFF;
            border-radius: 24rpx;
            padding: 32rpx 24rpx 0rpx 24rpx;
            .text-title{
                font-size: 26rpx;
                font-weight: 500;
                color: #191919;
                line-height: 34rpx;
            }
            .text-icon{
                font-size: 26rpx;
                font-weight: 500;
                color: #FF0A35;
                line-height: 34rpx;
            }
			&-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
				height: 84rpx;
				line-height: 84rpx;
			}
            .radio-item-text{
                font-size: 26rpx;
				font-weight: 400;
				color: #000000;
            }
		}
        /deep/.wsf-switch{
            padding: 0 6rpx !important;
        }
	}
	.applet-cancel-order-footer {
        background: #FFFFFF;
        border-radius: 24rpx;
        margin-top: 20rpx;
		&-switch {
			height: 100rpx;
            padding: 0rpx 24rpx;
			&-text {
				font-size: 26rpx;
				color: #000000;
				font-weight: 500;
			}
		}
		&-btn {
			width: 678rpx;
			height: 76rpx;
			line-height: 76rpx;
			border-radius: 38rpx;
			background-color: #e60113;
			color: #fff;
			font-size: 28rpx;
			font-weight: 500;
			text-align: center;
		}
		.disable {
			background-color: #FBD2D5;
		}
	}
	.wsf-mode-footer{
		height: auto !important;
	}
	// 是否收到货
	.applet-refund-receipt-type{
		&-title {
			font-size: 26rpx;
			font-weight: 500;
			color: #000000;
			margin-bottom: 36rpx;
		}
		&-radio {
			margin-bottom: 40rpx;
		}
	}
	// 已收货占位符
	.applet-refund-placeholder{
		padding-top: 230rpx;
		font-size: 26rpx;
		color: #F83746;
		line-height: 40rpx;
		margin-bottom: 40rpx;
	}

}

.product-card {
	display: flex;
	padding: 20rpx;
    margin: 0rpx 20rpx 20rpx 20rpx;
    background: #FFFFFF;
    border-radius: 24rpx;   
	.product-img {
		width: 148rpx;
		height: 148rpx;
		margin-right: 16rpx;
        border-radius: 16rpx;
	}
	.product-info {
        flex: 1;
			.name {
				overflow:hidden;
				text-overflow:ellipsis;
				display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
				font-size: 28rpx;
				font-weight: 500;
                color: #191919;
				line-height: 34rpx;
                margin-bottom: 8rpx;
			}
			.spec-column {
				line-height: 32rpx;
                display: flex;
                justify-content: space-between;
				.spec {
					color: #999;
					font-size: 24rpx;
					margin-right: 24rpx;
				}
			}
		}
		.price {
			line-height: 36rpx;
			color: #000;
			font-weight: bold;
			font-size: 28rpx;
		}
        .sku-num{
            font-size: 26rpx;
            color: #999999;
        }
}
/deep/{
    .wsf-mode-header{
        background: #F6F6F6;
        padding: 24rpx 0px 24rpx 0px !important;
    }
}
.bottom-column {
	width: 100%;
	background-color: #fff;
    display: flex;
    justify-content: center;
	padding: 8rpx 24rpx;
	position: fixed;
	bottom: 0;
	left: 0;
    padding-bottom: calc(8rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(8rpx + env(safe-area-inset-bottom));
}
.refund-btn{
        height: 80rpx;
        line-height: 80rpx;
        width: 100%;
        border-radius: 40rpx;
        font-size: 32rpx;
        font-weight: 500;
        color: #999999;
        text-align: center;
}
.red-btn{
    background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
    color: #FFFFFF;
}
.grey-btn{
    background: #EEEEEE;
    color: #999999;
}
.popiup-bottom-column{
    background-color: #fff;
    padding: 8rpx 24rpx;
}
.reason-item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 72rpx;
        padding: 0rpx 10rpx 0rpx 24rpx;
        margin-bottom: 12rpx;
    }
    .reason-item-checked{
        width: 32rpx;
		height: 32rpx;
		background-size: 100% 100%;
		background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-selected-2x.png);
    }
    .reason-item-check{
        width: 32rpx;
        height: 32rpx;
        border-radius: 50%;
        border: 2rpx solid #c3c3c3;
    }
</style>
