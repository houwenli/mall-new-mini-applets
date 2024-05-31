<template>
	<view  v-if="pageData" class="sales-return-page">
		<view class="service-store">
			本次售后服务将由
			<span>{{ pageData.storeName }}</span>
			为你提供
		</view>
		<view class="salse-return-card">
			<view class="shop-info" :key="index" @click="goToSku(pageData.returnSku.skuId)">
				<image class="img" :src="pageData.returnSku.skuImage"></image>
				<view class="txt-info">
					<view>
						<view class="sku-name">{{ pageData.returnSku.skuName }}</view>
						<view class="txt-2">
							<view class="num">{{ '购买数量: ' + pageData.returnSku.num }}</view>
							<view class="num">{{ '申请数量: ' + alreadyNum(pageData.returnSku.num, pageData.returnSku.returnNum) }}</view>
						</view>
					</view>
					<view class="money-shoppingTrolley">
						<view class="money-icon money-font">￥</view>
                        <view class="money-integer money-font">{{ pageData.returnSku.accurateUnitPrice&&String(pageData.returnSku.accurateUnitPrice).split('.')[0] }}</view>
                        <view class="money-decimal money-font">{{ getDecimal }}</view>
					</view>
				</view>
			</view>
			<view class="apply-number-box flex-space-between">
				<view class="apply-label">申请数量</view>
				<view class="number-add-sub" v-if="limitAddNum > 1">
					<u-icon @click="minusFun()" class="add-sub-icon" :class="{'grey-icon':addNum === 1}" name="minus"></u-icon>
					<view class="input-num"><input type="number" class="apply-num" v-model="addNum" @input="minusInput($event)" @focus="minusFocus($event)" @blur="minusBlur($event)" /></view>
					<u-icon @click="plusFun()" class="add-sub-icon" :class="{'grey-icon':limitAddNum <= addNum}" name="plus"></u-icon>
				</view>
				<span class="u-margin-right-20" v-else>{{ addNum }}</span>
			</view>
		</view>
		<view class="salse-return-card">
			<view class="reason-title flex-space-between" @click="openPopup">
				<view class="reason-label">申请原因</view>
				<view class="reason-content">
					<span class="u-font-22">{{ returnReasonName }}</span>
					<image class="more-arrow-icon" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-right.png"></image>
				</view>
			</view>
			<view class="textarea-box">
				<u-input
					v-model="returnReason"
					placeholder="请描述申请售后服务的具体原因"
					type="textarea"
					maxlength="200"
					height="100"
					:auto-height="true"
					placeholder-style="color:#C3C3C3;font-size:26rpx"
				/>
				<span class="showTextNum">{{ reasonLength }}/200</span>
			</view>
			<view class="upload-box">
				<wsf-upload
					:marginType="4"
					width="148"
					height="148"
					:max-size="5 * 1024 * 1024"
					max-count="9"
					:custom-btn="true"
					:file-list="fileList"
					ref="wsfUpload"
					:action="wsfUploadConfig.action"
					:header="wsfUploadConfig.header"
					@on-change="uploadSuccess"
					:show-progress="false"
				>
					<view slot="addBtn" class="slot-btn" >
						<u-icon name="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/upload-icon.png" size="48" class="upload-icon"></u-icon>
						<p class="u-font-20">上传凭证</p>
						<p class="u-font-20">(最多9张)</p>
					</view>
				</wsf-upload>
				<p class="upload-hint">为了帮您更好的解决问题，请务必上传照片凭证</p>
			</view>
		</view>
		<view class="salse-return-card">
				<view class="return-way flex-space-between">
					<view class="u-font-26">退回方式</view>
					<view class="u-font-22">自行寄回</view>
				</view>
                <view class="return-price flex-space-between">
					<view class="u-font-26">退回金额</view>
					<span class="u-font-26">¥{{ returnTotalPrice }}</span>
				</view>
		</view>
		<view class="salse-return-card">
			<view class="return-way flex-space-between">
				<view class="u-font-26">退货联系人</view>
				<view class="u-font-22">{{ pageData.orderAttr.receiptName }}</view>
			</view>
			<view class="return-price flex-space-between">
				<view class="u-font-26">联系方式</view>
				<view class="u-font-26">{{ pageData.orderAttr.receiptMobile | phoneNumberHide }}</view>
			</view>
		</view>
        <view class="footer-submit">
            <view class="submit-tip">提交服务单后，售后专员可能与您电话沟通，请保持手机畅通</view>
		    <view class="submit-btn" @click="submitServiceOrder()">提交</view>
        </view>

		<!-- 选择申请原因 -->
        <after-sales-reason-popup :show.sync="popupShow" :choseReturnWayId="choseReturnWayId" @changeReturnWayId="changeReturnWayId" :returnWayInfo="returnWayInfo"></after-sales-reason-popup>
	</view>
</template>

<script>
import httpInterceptor from '@/common/http.interceptor.js';
import { priceFilter } from '@/common/wsfFilter.js';
import afterSalesReasonPopup from '../../../components/afterSalesReasonPopup/afterSalesReasonPopup';
export default {
    components: {
		afterSalesReasonPopup
	},
	data() {
		return {
			fileList: [],
			intoType: -1,
			imageList: [],
			wsfUploadConfig: {
				action: httpInterceptor.uploadFileUrl,
				header: {
					'content-type': 'multipart/form-data',
					Authorization: 'Bearer ' + (uni.getStorageSync('newToken') || '')
				}
			},
			choseReturnWayId: null,
			returnWayInfo: [
				{
					id: 1,
					name: '卖家发错货'
				},
				{
					id: 2,
					name: '发票问题'
				},
				{
					id: 3,
					name: '七天无理由'
				},
				{
					id: 4,
					name: '商品与页面描述不符'
				},
				{
					id: 5,
					name: '质量问题'
				},
				{
					id: 6,
					name: '其他'
				}
			],
			popupShow: false,
			returnReason: '',
			addNum: 1,
			priceFilter,
			pageData: null,
			limitAddNum: 10,
            isThird: false, // 是否是第三方
		};
	},
	onLoad(option) {
		console.log(option, 'option');
		if (option && option.type == 1) {
			this.intoType = option.type;
			this.orderId = option.orderId;
			this.orderSkuId = option.orderSkuId;
			this.loadBackOrderDetail();
			this.popupShow = true;
		} else if (option && option.type == 2) {
			this.intoType = option.type;
			this.orderId = option.orderId;
			this.loadEditBackOrderDetail();
		}
	},
	computed: {
		returnTotalPrice() {
			let price = 0;
			if (this.addNum == this.limitAddNum) {
				price = this.priceFilter(this.pageData.returnSku.canRefundAmount);
			} else {
				if (this.pageData && this.pageData.orderSkus && this.pageData.orderSkus.length > 0) {
					price = this.priceFilter(this.pageData.returnSku.accurateUnitPrice * this.addNum);
				}
			}
			return price;
		},
		reasonLength() {
			let len = this.returnReason.length;
			return len;
		},
		returnReasonName() {
			let name = '';
			if (this.choseReturnWayId) {
				this.returnWayInfo.forEach(item => {
					if (item.id == this.choseReturnWayId) {
						name = item.name;
					}
				});
			} else {
				name = '请选择申请原因';
			}
			return name;
		},
        getDecimal(){
            if(this.pageData&&this.pageData.returnSku&&this.pageData.returnSku.accurateUnitPrice){
                let decimal = String(this.pageData.returnSku.accurateUnitPrice).split('.')[1]
                return `.${decimal?decimal:'00'}`
            }else{
                return ''
            }
        }
	},
	methods: {
		changeReturnWayId(id) {
            this.choseReturnWayId = id
			this.popupShow = false;
		},
		closePopup() {
			this.popupShow = false;
		},
		// 前往商品详情
		goToSku(id) {
			this.$wsf.go('SkuDetail', { skuId: id });
		},
		//上传凭证
		uploadSuccess(data, index, lists, name) {
			this.imageList = lists;
			console.log(this.imageList, 'this.imageList');
		},
		openPopup() {
			this.popupShow = true;
		},
		//计算已申请数量
		alreadyNum(allNum, num) {
			let number = allNum - num;
			return number;
		},
		//申请退货-查询订单详情
		loadBackOrderDetail() {
			let data = {
				orderId: this.orderId,
				orderSkuId: this.orderSkuId
			};
			this.$u.api.queryorderforreturn(data).then(res => {
				this.pageData = res.data;
                console.log(this.pageData,'this.pageData')
				this.limitAddNum = this.pageData.returnSku.returnNum;

                this.isThird = (res.data || {}).placeOrderType == 3
                // 订单类型是否是第三方，为3时需要请求第三方售后原因
                if (this.isThird) {
                    this.getReasonList()
                }
			});
		},
        async getReasonList() {
            let param = {after_sale_type: 1, is_received: 1}
            await this.$u.api.getReasonList(param).then((res) => {
                if (res.code == 200) {
                    let reasonKeys = Object.keys(res.data || {})
                    this.returnWayInfo = reasonKeys.map(item => {
                        return {
                            id: item,
                            name: res.data[item],
                            reasonType: item,
                        }
                    })
                }
            })
        },
		loadEditBackOrderDetail() {
			this.$u.api.backorderdetail({ id: this.orderId }).then(async res => {
				this.pageData = res.data;
				this.limitAddNum = this.pageData.returnSku.returnNum;
				this.returnReason = this.pageData.desc;
				let receiptInfo = {
					receiptName: this.pageData.contactName,
					receiptMobile: this.pageData.contactMobile
				};
				this.pageData['orderAttr'] = receiptInfo;
				this.pageData.picsLists.forEach(item => {
					let data = {
						url: item,
						response: item
					};
					this.fileList.push(data);
				});
				this.imageList = this.fileList;
				console.log(this.imageList, 'imageList');

                 // 额外调用接口判断是否需要调用第三方售后原因
                this.isThird = (res.data || {}).backOrderType == 4
                // 订单类型是否是第三方，为3时需要请求第三方售后原因
                if (this.isThird) {
                    await this.getReasonList()
                }
                this.returnWayInfo.forEach(item => {
					if (item.name == this.pageData.reason) {
						this.choseReturnWayId = item.id;
					}
				});
			});
		},
		submitServiceOrder() {
			// if (!this.imageList || this.imageList.length < 1) {
			// 	this.$u.toast('请上传照片凭证');
			// 	return;
			// }
			if (!this.choseReturnWayId) {
				this.$u.toast('请填写申请原因');
				return;
			}
			if (!this.returnReason) {
				this.$u.toast('请填写问题描述信息');
				return;
			}

			let returnSku = {
				num: this.addNum,
				skuId: this.pageData.returnSku.skuId,
				price: this.returnTotalPrice
			};
			let imgStr = this.imageList.map(item => {
				if (item.response) {
					return item.response;
				} else {
					return item.url;
				}
			});

            let returnReasonArr = this.returnWayInfo.filter(item => item.id == this.choseReturnWayId);
            let returnReasonObj = returnReasonArr[0] || {}

			if (this.intoType == 1) {
				let data = {
					orderId: this.orderId,
					orderSkuId: this.orderSkuId,
					reason: this.returnReasonName,
					desc: this.returnReason,
					pics: imgStr,
					returnSku: returnSku,
					contactName: this.pageData.orderAttr.receiptName,
					contactMobile: this.pageData.orderAttr.receiptMobile,
                    reasonType: returnReasonObj.reasonType || '',
				};
                uni.requestSubscribeMessage({
                    tmplIds: [
                        "UQRi8uv0Y10qWO3wEWPFKNA2xVBKr373Ess5nrCbgF8",//退货申请通知
                        "iVoUvWJidUeRZXq_W4o4v8Y1epV4j-orBhljTwHScZk",//拒绝退货通知
                        "8sJpMftMlF3hY8l_736xrgq_BvpxGGX8ahomfD9SH2w",//退货寄回通知
                    ],
                    success(res) {
                        console.log("成功回调：", res);
                    },
                    fail(res) {
                        console.log("失败回调：", res);
                    },
                    complete: (res) => {
                        console.log("关闭了消息订阅授权：", res);
                        this.$u.api.applyreturn(data).then(res => {
					    if (res.code == 200) {
						//后端接口延时0.1s, 等待主从库数据同步
						    setTimeout(() => {
							this.$wsf.go('submitServiceOrderSuccess', { orderId: res.data }, "redirectTo");
						    }, 100);
					    }
				        });
                    },
                });
				
			} else if (this.intoType == 2) {
				let data = {
					id: this.pageData.id,
					reason: this.returnReasonName,
					desc: this.returnReason,
					pics: imgStr,
					returnSku: returnSku,
                    reasonType: returnReasonObj.reasonType || '',
				};
				this.$u.api.updateApplyreturn(data).then(res => {
					if (res.code == 200) {
						this.$wsf.go('submitServiceOrderSuccess', { orderId: this.pageData.id }, "redirectTo");
					}
				});
			}
		},
		// 步进器 -
		minusFun() {
			if (this.addNum > 1) {
				this.addNum = parseInt(this.addNum) - 1;
			}
		},
		// 步进器 +
		plusFun() {
			if (this.addNum <= this.limitAddNum && this.addNum !== this.limitAddNum) {
				this.addNum = parseInt(this.addNum) + 1;
			}
		},
		// 步进器输入框输入时执行
		minusInput(e) {
			// 输入的值不为空时在赋值
			if (e.detail.value !== null && e.detail.value !== '') {
				this.addNum = e.detail.value;
			}
		},
		// 聚焦时执行
		minusFocus(e) {
			if (e.detail.value !== null && e.detail.value !== '') {
				console.log('聚焦', e);
			}
		},
		// 失焦时执行
		minusBlur(e) {
			if (e.detail.value !== null && e.detail.value !== '' && e.detail.value > 1) {
				console.log('失焦', e);
				if (e.detail.value <= this.limitAddNum) {
					this.addNum = e.detail.value;
				} else {
					this.addNum = this.limitAddNum;
				}
			} else {
				this.addNum = 1;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.sales-return-page{
    padding: 0rpx 20rpx;
    position: relative;
    padding-bottom: calc(142rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(142rpx + env(safe-area-inset-bottom));
}
.service-store {
	font-size: 22rpx;
	padding: 20rpx 0;
	color: #999;
	span {
		color: $wsf-color-red;
	}
}
.flex-space-between{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.salse-return-card {
	margin-bottom:20rpx;
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	.textarea-box {
		background: #F6F6F6;
		border-radius: 16rpx;
		padding: 20rpx;
		margin-bottom: 12rpx;
		position: relative;
        /deep/.u-input__textarea{
            font-size: 26rpx !important;
            color: #191919 !important;
            padding:0rpx !important
        }
		.showTextNum {
			font-size: 22rpx;
			color: #999;
			position: absolute;
			right: 20rpx;
			bottom: 24rpx;
		}
	}
	.slot-btn {
        border-radius: 16rpx;
		margin: 8rpx 0rpx 16rpx 0rpx;
		vertical-align: middle;
		text-align: center;
		width: 148rpx;
		height: 148rpx;
		border: 2rpx dashed #999;
		color: #999;
		padding: 20rpx 0rpx 12rpx 0rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
    .upload-icon{
        margin-bottom: 12rpx;
    }
	.upload-hint {
		color: #999999;
		font-size: 22rpx;
	}
    .more-arrow-icon{
        width: 32rpx;
        height: 32rpx;
        margin-left: 12rpx;
    }   
    .reason-title{
        margin: 8rpx 0rpx 18rpx;
    }
    .reason-content{
        display: flex;
        align-items: center;
    }
    .return-way{
        padding: 8rpx 0rpx 18rpx 0rpx;
    }
    .return-price{
        padding: 20rpx 0rpx 6rpx 0rpx;
    }
    .apply-number-box{
        border-top: 1rpx solid #EEEEEE;
        padding: 30rpx 0rpx 8rpx 0rpx;
    }
    .number-add-sub{
        display: flex;
        align-items: center;
    }
    .add-sub-icon{
        color:#000;
        /deep/.u-iconfont{
            font-size: 22rpx !important;
        }
    }
    .grey-icon{
        color: #d8d8d8;
    }
    .apply-num{
        padding: 6rpx 8rpx;
        max-width: 54rpx;
        background: #F6F6F6;
        border-radius: 8rpx;
        font-size: 26rpx;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold; 
        text-align: center;
        margin: 0rpx 12rpx;
    }
	.shop-info {
		width: 100%;
		display: flex;
		margin-bottom: 24rpx;
		.img {
			width: 204rpx;
			height: 204rpx;
			border-radius: 16rpx;
            flex-shrink:0;
		}
		.txt-info {
			width: 520rpx;
			padding-left: 16rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.sku-name{
                font-size: 26rpx;
                font-weight: 500;
                color: #191919;
                margin-bottom: 16rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
			.txt-2 {
				display: flex;
				align-items: center;
				.num {
					margin-right: 20rpx;
                    font-size: 26rpx;
                    color: #999999;
				}
			}
			.money-shoppingTrolley {
                display: flex;
                align-items: flex-end;
                justify-content: flex-end;
				width: 100%;
                .money-font{
                    font-family: DINAlternate-Bold, DINAlternate;
                    font-weight: bold;
                    color: #191919;
                }
                .money-icon{
                    line-height: 36rpx;
                    font-size: 24rpx;
                }
                .money-integer{
                    line-height: 40rpx;
                    font-size: 32rpx;
                }
                .money-decimal{
                    line-height: 36rpx;
                    font-size: 26rpx;
                }
			}
		}
	}
}
.footer-submit{
    background: #FFFFFF;
    box-shadow: 0rpx -4rpx 20rpx 0rpx rgba(189,194,204,0.2);
    width:100%;
    margin: auto;
    padding-top:12rpx;
    padding-bottom: calc(8rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(8rpx + env(safe-area-inset-bottom));
    position: fixed;
    left: 0;
    bottom: 0;
    .submit-tip{
        font-size: 22rpx;
        color: #999999;
        line-height: 30rpx;
        margin-bottom: 12rpx;
        text-align: center;
    }
    .submit-btn{
        width: 702rpx;
        height: 80rpx;
        background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
        border-radius: 40rpx;
        line-height: 80rpx;
        text-align: center;
        font-size: 32rpx;
        font-weight: 500;
        color: #FFF9E9;
        margin: auto;
    }
}
</style>
