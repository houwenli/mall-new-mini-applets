<template>
	<view class="page-content" v-if="pageData">
		<wsf-nav-bar :status-bar="true" :fixed="true" :placeholder="true" title="提交成功" bgColor="#fff" :hasBack="false"></wsf-nav-bar>
		<view class="submit-order-info">
			<view class="submit-success-title">
				<image class="submit-success-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/shouhou_fuwudan_tijiao_chenggong.png"></image>
				售后服务单申请成功
			</view>
			<view class="submit-order-info-text" v-if="pageData.backOrderType!=4">
				预计
				<u-count-down
					class="time-count"
					separator="zh"
					separator-size="26"
					separator-color="#FF0A35"
					color="#FF0A35"
					font-size="26"
					:timestamp="timestamp"
				></u-count-down>
            内为您审核，请保持手机畅通，耐心等待~
			</view>
			<view class="submit-order-info-text" v-else>正在为您审核，请保持手机畅通，耐心等待</view>
			<view class="submit-order-info-btn u-flex u-row-center">
				<view class="info-btn details-btn" @click.stop="handleButton(1)">查询详情</view>
				<view class="info-btn" @click.stop="handleButton(2)">售后主页</view>
			</view>
		</view>
		<view class="submit-order-card">
			<view class="card-column flex-space-between">
				<view class="card-label">服务类型</view>
				<view class="card-value">{{ pageData.type == '1' ? '退款' : pageData.type == '2' ? '退货' : pageData.type == '3' ? '换货' : '' }}</view>
			</view>
			<view class="card-column flex-space-between">
				<view class="card-label">返件方式</view>
				<view class="card-value">{{ pageData.backType == '1' ? '自行寄回' : '' }}</view>
			</view>
		</view>
        <view class="submit-order-card">
            <view class="card-column flex-space-between">
				<view class="card-label">联系人</view>
				<view class="card-value">{{ pageData.contactName }}</view>
			</view>
			<view class="card-column flex-space-between">
				<view class="card-label">联系电话</view>
				<view class="u-font-26">{{ phoneNumberHide(pageData.contactMobile) | phoneNumberHide }}</view>
			</view>
        </view>
        <view class="address-box" v-if="pageData.type == '3'">
			<view class="address-title">
				<text class="title-text">收货地址</text>
				<text class="title-tip">（该地址是卖家换货邮寄给您的地址）</text>
			</view>
			<view class="name-mobile-box" >
				<view class="name-mobile-value">{{ pageData.addressVo && pageData.addressVo.name }}</view>
                <view class="name-mobile-value">{{ pageData.addressVo && pageData.addressVo.mobile }}</view>
			</view>
			<view class="address-text">
			    {{ `${pageData.addressVo && pageData.addressVo.address.replaceAll(',', '')} ${pageData.addressVo && pageData.addressVo.detailAddress}` }}
			</view>
		</view>
		<view class="hint-text">
			<image class="hint-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/shouhou_liebiao_shangpin_tishi.png"></image>
			<view class="hint-text-content">服务单审核通过后，请在7天内完成发货并在服务单详情页内填写运单号，否则服务单将会自动关闭。您可在服务单详情页查看商品寄回地址。</view>
		</view>
	</view>
</template>

<script>
import { phoneNumberHide } from '@/common/wsfFilter.js';
export default {
	data() {
		return {
			phoneNumberHide,
			pageData: null,
			timestamp: null,
			orderId: null,
		};
	},
	onLoad(option) {
		if (option) {
			this.orderId = option.orderId;
			this.getInfo();
		}
	},
	methods: {
		getInfo() {
			this.$u.api.backorderdetail({ id: this.orderId }).then(res => {
				this.pageData = res.data;
				let endTime = this.pageData.endTime.replace(/\-/g, '/')
				endTime = new Date(endTime).getTime()
				let nowTime = this.pageData.nowTime.replace(/\-/g, '/')
				nowTime = new Date(nowTime).getTime()
				if (endTime - nowTime > 0) {
				  this.timestamp = (endTime - nowTime) / 1000
					//转化成天, 并且向上取整, 再赋值
					// if(this.pageData.status == )
					// let countDownTime = endTime - nowTime
					// let countDownDay = Math.ceil(countDownTime / (1000 * 60 * 60 * 24))
					// this.timestamp = countDownDay
				}
			});
		},
		handleButton(type) {
			if(type == 1) {
				let name 
				if(this.pageData.type == '2') {
					name = 'ServiceOrderDetail'
				} else if(this.pageData.type == '3') {
					name = 'ExchangeServiceDetail'
				} else if(this.pageData.type == '1') {
					name = 'RefundServiceDetail'
				}
				this.$wsf.go(name, { orderId: this.pageData.id }, "redirectTo");
			}else if(type == 2) {
				// this.$wsf.go('BackOrderList', { type: 2 }, "redirectTo");
				this.$smart.go('smartOrder', { status: 80 })
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.page-content{
    padding: 20rpx 20rpx 0rpx 20rpx;
}
.flex-space-between{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.submit-order-info {
    padding: 48rpx 48rpx 32rpx 48rpx;
	background-color: #fff;
    border-radius: 16rpx;
    margin-bottom:20rpx;
	text-align: center;
    .time-count{
        /deep/.u-countdown{
            display: inline !important;
            &-item{
                display: inline !important;
                padding: 0rpx !important;
            } 
            &-colon{
                display: inline !important;
                line-height: 34rpx !important;
                padding: 0rpx !important;
            }
            &-time{
                display: inline !important;
                line-height: 34rpx !important;
            }
        }
    }
    .submit-success-icon{
        width:32rpx;
        height: 32rpx;
        margin-right: 12rpx;
        vertical-align: middle;
    }
    .submit-success-title{
        font-size: 32rpx;
        font-weight: 600;
        color: #191919;
        margin-bottom:24rpx;
        display: flex;
        align-items: center;
        justify-content:center
    }
    .info-btn{
        border-radius: 37rpx;
        border: 1rpx solid #FF0A35;
        color: #FF0A35;
        text-align: center;
        padding: 14rpx 24rpx;
        line-height: 36rpx;
    }
    .details-btn{
        margin-right: 40rpx;
    }
	&-text {
		font-size: 26rpx;
		color: #6E6E6E;
		margin-bottom: 24rpx;
		line-height: 34rpx;
        text-align: left;
	}
}
.submit-order-card {
	margin-bottom: 20rpx;
	background: #fff;
	border-radius: 16rpx;
	padding: 8rpx 24rpx;
	.card-column {
		width: 100%;        
        padding: 20rpx 0rpx 18rpx 0rpx;
		.card-column-header {
			color: #666;
			&-title {
				font-size: 26rpx;
			}
			&-hint {
				font-size: 24rpx;
			}
		}
		.card-label {
			font-size: 26rpx;
            color: #191919;
            line-height: 34rpx;
		}
		.card-value {
			font-size: 22rpx;
			color: #191919;
            line-height: 30rpx;
		}
	}
    
}
.address-box{
    margin-bottom: 20rpx;
	background: #fff;
	border-radius: 16rpx;
	padding: 28rpx 24rpx 24rpx 24rpx;
    .address-title{
        margin-bottom:18rpx;
    }
    .title-text{
        font-size: 26rpx;
        line-height: 34rpx;
        color: #191919;
    }
    .title-tip{
        font-size: 22rpx;
        color: #999999;
        margin-left: 8rpx;
    }
    .name-mobile-box{
        margin-bottom: 8rpx;
        display: flex;
    }
    .name-mobile-value{
        font-size: 26rpx;
        font-weight: 500;
        color: #191919;
        line-height: 34rpx;
        margin-right: 16rpx;
    }
    .address-text{
        font-size: 26rpx;
        color: #6E6E6E;
    }
    .more-icon{
        width: 32rpx;
        height: 32rpx;
        margin-left: 12rpx;
    }
}
.hint-text {
	background: #FFFFFF;
    border-radius: 16rpx;
    padding: 20rpx 24rpx;
    display: flex;
    align-items: flex-start;
    .hint-icon{
        width: 28rpx;
        height: 28rpx;
        margin: 2rpx 12rpx 0rpx 0rpx;
    }
	.hint-text-content {
        flex: 1;
		font-size: 22rpx;
        color: #6E6E6E;
        line-height: 30rpx;
	}
}
</style>
