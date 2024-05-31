<template>
	<wsf-popup
		v-model="motorPhoneShow"
		mode="bottom"
		:safe-area-inset-bottom="true"
		@close="handleCloseDialog"
		height="496rpx"
		z-Index="22222"
	>
		<view class="motor-phone" v-if="motorPhoneShow">
			<image
				src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/basic_close_icon.png"
				alt=""
				@click="handleCloseDialog"
			/>
			<view class="motor-phone-content">
				<view class="text1">您将使用以下手机号码进行呼叫</view>
				<view class="text2">{{ mobile }}</view>

				<!-- <view class="motor-phone-change" @click="goToChangeMobile">
					<view class="text1">更改呼叫手机号</view>
					<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store_right_icon.png"></image>
				</view>	 -->

				<view class="motor-phone-btn" @click="handleConfirm">
					<view class="motor-phone-btn-text1">确认呼叫</view>
					<view class="motor-phone-btn-text2">(电话号码加密，保障您的隐私)</view>					
				</view>	
			</view>		
				
		</view>		
	</wsf-popup>
</template>
<script>
export default {
  props: {
    motorPhoneShow: {
		type: Boolean,
		default: false,
    },
	mobile: {
		type: String,
		default: '',
    },
	idNumber: {
		type: String,
      	default: '',
	},
	cityCode: {
		type: String,
      	default: '',
	},
  },
  data() {
    return {
		bindId: ''
    };
  },
  onLoad() {
	   
  },
  methods: {
	
	handleConfirm(){
		this.$u.api.QueryMotorBindPhone({
			idNumber: this.idNumber,
			mobile: this.mobile,
			cityCode: this.cityCode
		}).then((res) => {
        
			if (res.data) {	
				this.bindId = res.data.bindId	
				// this.mobile = res.data.telX	
				uni.makePhoneCall({
					phoneNumber: res.data.telX, //仅为示例
				});
			} 
        });
	},
	goToChangeMobile(){
  		this.$wsf.go("MobieChange",{
			mobile: this.mobile,
			idNumber: this.idNumber,
			cityCode: this.cityCode  
        });
	},
    handleCloseDialog() {
      this.$emit("handleCloseDialog");
    },   
  },
};
</script>

<style lang="scss" scoped>
.motor-phone{
	padding: 24rpx;
	>image{
		position: absolute;
        right: 48rpx;
        top: 30rpx;
        height: 40rpx;
        width: 54rpx;
	}
	.motor-phone-content{
		margin-top: 72rpx;
		.text1{
			font-size: 30rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #191919;
			line-height: 38rpx;
			text-align: center;
		}
		.text2{
			font-size: 48rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #FF450C;
			line-height: 66rpx;
			margin: 32rpx 8rpx;
			text-align: center;
		}
		.motor-phone-change{
			display: flex;
			align-items: center;
			justify-content: center;
			image{
				width: 24rpx;
				height: 24rpx;
			}
		}
		.motor-phone-btn{
			width: 100%;
			height: 88rpx;
			background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
			border-radius: 44rpx;
			display: flex;
			align-items: center;
			flex-direction: column;
			justify-content: center;
			margin-top: 62rpx;
			&-text1{
				font-size: 32rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #FFF9E9;
				line-height: 40rpx;
				margin-top: -5rpx;
			}
			&-text2{
				font-size: 22rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 30rpx;
			}
		
		}
	}
	
}
</style>
