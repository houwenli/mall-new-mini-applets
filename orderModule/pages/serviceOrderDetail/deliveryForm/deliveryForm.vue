<template>
	<view class="page-content">
		<view class="delivery-form-card">
			<view class="card-title">
				包裹信息<span class="required-mark">*</span>
			</view>
			<view class="card-column" @click="goLogisticsForm">
				<view class="card-label">快递公司</view>
				<view class="express-company">
					<span class="u-font-22" :class="{'card-value-placeholder': !logisticsCompanyName}">{{logisticsCompanyName ? logisticsCompanyName : '请选择快递公司'}}</span>
					<image class="more-icon" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-right.png"></image>
				</view>
			</view>
			<view class="card-column">
				<view class="card-label column-padding">快递单号</view>
				<u-input class="u-padding-right-44" input-align="right" v-model="waybillCode" height="36" maxlength="50" placeholder-style="color:#999999;font-size:22rpx" placeholder="请输入快递单号"></u-input>
			</view>
            <view class="tip-box">
                <image class="tip-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/shouhou_liebiao_shangpin_tishi.png"></image>
                <view class="card-hint">
				    温馨提示：您购买的三方卖家商品发生退货时，经三方卖家判断为个人原因导致，将无法为您报销商品寄回三方卖家的运费，运费您可与卖家确定，感谢您的理解与支持。
			    </view>
            </view>
			
		</view>
		<view class="delivery-form-card">
			<view class="card-title">
				包裹内商品信息
			</view>
			<view class="card-column u-padding-right-44">
				<view class="card-label">服务单号</view>
				<view class="u-font-26">{{pageData.backCode}}</view>
			</view>
			<view class="card-column u-padding-right-44">
				<view class="card-label">申请时间</view>
				<view class="u-font-26">{{pageData.createTime}}</view>
			</view>
			<view class="shop-info" :key="index" @click="goToSku(pageData.returnSku.skuId)">
				<image class="img" :src="pageData.returnSku.skuImage"></image>
				<view class="txt-info">
					<view class="sku-name">{{ pageData.returnSku.skuName }}</view>
					<view class="sku-num">
						{{ '申请数量: ' + pageData.returnSku.applyNum }}
					</view>
				</view>
			</view>
		</view>
        <view class="bottom-column">
            <view class="submit-btn" @click="submitDeliveryForm(item)">
                提交
            </view>
        </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				waybillCode: "",
				pageData: null,
				orderId: null,
				logisticsCompanyName: "",
				intoType: -1,
			}
		},
		onLoad(option) {
			if(option) {
				this.orderId = option.id
				this.intoType = option.type
				this.getInfo()
			}
		},
		methods: {
			// 前往商品详情
			goToSku(id) {
				this.$wsf.go('SkuDetail', { skuId: id });
			},
			getInfo() {
				this.$u.api.backorderdetail({id: this.orderId}).then(res => {
					this.pageData = res.data
					this.logisticsCompanyName = this.pageData.logisCompanyName
					this.waybillCode = this.pageData.waybillCode
				})
			},
			submitDeliveryForm() {
				if(!this.logisticsCompanyName) {
					this.$u.toast('请选择快递公司')
					return
				}
				if (!this.waybillCode) {
					this.$u.toast('请填写快递单号')
					return
				} else {
					let reg = /^[A-Za-z0-9]+$/
					if (!reg.test(this.waybillCode)) {
						this.$u.toast('请输入正确的快递发货单号')
						return
					}
				}
				let data = {
					id: this.pageData.id,
					logisCompanyName: this.logisticsCompanyName,
					waybillCode: this.waybillCode
				}
				if(this.intoType == 1) {
                    // 2退货 3换货
                   let tmplIds = Number(this.pageData.type) === 2
                    ? ["mOiiZVniN7mZgyXhNARzVuMV41WQ3oD_eCFcRlcrW_s"]//退款成功通知
                    : ["rfQ3XaHakX4IkpgafumXFeTWgEDqdMKesyCtJaZKGxE",//订单签收提醒
                       "8KL_v78QDVSy8DVKTrstVadGiOo-_J2HUQFq_S2BBbw",//订单发货通知
                       "mOiiZVniN7mZgyXhNARzVuMV41WQ3oD_eCFcRlcrW_s",//退款成功通知
                      ];
                    uni.requestSubscribeMessage({
                      tmplIds,
                      success(res) {
                        console.log("成功回调：", res);
                      },
                      fail(res) {
                        console.log("失败回调：", res);
                      },
                      complete: (res) => {
                        console.log("关闭了消息订阅授权：", res);
                        this.$u.api.fillthelogistics(data).then(res => {
						if(res.code == 200) {
							this.$u.toast('提交成功')
							// 返回上一页,并更新上一页的参数
							let pages = getCurrentPages();
							let prevPage = pages[pages.length - 2]; //上一个页面
							let num = prevPage.$vm.lastPageUpdate
							prevPage.$vm.lastPageUpdate = num += 1
							console.log(pages,'pages');
							uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
								delta: 1
							});
						}
					})
                      },
                    });
					
				} else if(this.intoType == 2) {
					this.$u.api.updateLogistics(data).then(res => {
						if(res.code == 200) {
							this.$u.toast('修改成功')
							// 返回上一页,并更新上一页的参数
							let pages = getCurrentPages();
							let prevPage = pages[pages.length - 2]; //上一个页面
							let num = prevPage.$vm.lastPageUpdate
							prevPage.$vm.lastPageUpdate = num += 1
							console.log(pages,'pages');
							uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
								delta: 1
							});
						}
					})
				}
		
			},
			goLogisticsForm(){
				this.$wsf.go('logisticsForm',null,'navigateTo')
			}
		}
	}
</script>

<style lang="scss" scoped>
.page-content{
    padding: 20rpx 20rpx 0rpx 20rpx;
    position: relative;
}
.more-icon{
    width: 32rpx;
    height: 32rpx;
    margin-left: 12rpx;
}
	.delivery-form-card {
		margin-bottom: 24rpx;
		background: #fff;
		border-radius: 20rpx;
		padding: 20rpx 24rpx;
		.card-title {
			font-size: 26rpx;
            font-weight: 500;
            color: #191919;
            margin-bottom: 20rpx;
			.required-mark {
				transform: translate(0 ,10rpx);
				color: $wsf-color-red;
			}
		}
        .express-company{
            display: flex;
            align-items: center;
        }
		.card-column {
			display: flex;
			justify-content: space-between;
            align-items: center;
            padding: 20rpx 0rpx 18rpx 0rpx;
		}
        .card-label {
			color: #191919;
			font-size: 26rpx;
			width: 116rpx;
		}
        .card-value-placeholder {
			color: #999999;
            font-size: 22rpx;
		}
        /deep/.u-input__input{
            font-size: 26rpx;
        }
        .tip-box{
            margin-top: 20rpx;
            display: flex;
            align-items: flex-start;
        }
        .tip-icon{
            height: 28rpx;
			width: 28rpx;
            margin-right: 12rpx;
        }
		.card-hint {
            flex: 1;
			color: #6E6E6E;
			font-size: 22rpx;
			line-height: 30rpx;
		}
		.shop-info {
			width: 100%;
			display: flex;
            margin-top: 20rpx;
			.img {
				width: 148rpx;
				height: 148rpx;
				border-radius: 16rpx;
				margin-right: 16rpx;
			}
			.txt-info {
				width: 520rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
                .sku-name{
                    font-size: 26rpx;
                    font-weight: 500;       
                    color: #191919;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
                .sku-num{
                    font-size: 26rpx;
                    color: #999999;
                }
				.money-shoppingTrolley {
					width: 100%;
					display: flex;
					justify-content: space-between;
					.money {
						font-size: 28rpx;
						font-weight: 600;
						color: #000000;
					}
				}
			}
		}
	}
.bottom-column {
	width: 100%;
	background-color: #fff;
	padding: 8rpx 24rpx;
	position: fixed;
	bottom: 0;
	left: 0;
    padding-bottom: calc(8rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(8rpx + env(safe-area-inset-bottom));
    .submit-btn{
        width: 702rpx;
        height: 80rpx;
        background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
        border-radius: 40rpx;
        line-height: 80rpx;
        font-size: 32rpx;
        font-weight: 500;
        color: #FFFFFF;
        text-align: center;
    }
}
</style>
