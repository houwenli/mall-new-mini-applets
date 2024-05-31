<template>
	<view class="mobie-box">
		<view class="mobie-box-text1">更改本次呼叫电话</view>
		<view class="mobie-box-text2">当前呼叫号码 +86 {{ mobile }}</view>
		<wsf-input 						
			:custom-style="{ 'font-size': '32rpx','background': '#fff','border-radius': '24rpx','height': '96rpx', 'padding-left': '24rpx' }"
			v-model="password"			
			type="number"
			placeholder="请输入手机号码"
			placeholder-style="color:#999;font-size:32rpx">
		</wsf-input>
		<view :class="['mobie-btn',password.length>0? 'mobie-btn-active' : 'mobie-btn-disabled']" @click="handleConfirm">	
			<uni-icons type="spinner-cycle" size="16" v-if="isLoading"></uni-icons>
			<text>确认更改</text>
		</view>
	</view>
</template>
<script>

export default {
  data() {
    return {
		mobile: '',
		password: '',
		isLoading: false,
		idNumber: '',
		cityCode: ''  
    };
  },
  onLoad(params) {
	console.log(params,'params')
	let { mobile , idNumber, cityCode } = params
	this.mobile = mobile
	this.idNumber = idNumber
	this.cityCode = cityCode
  },
  onShow() {
   
  },
  onReachBottom() {
   
  },
  computed: {},
  methods: {
	handleConfirm(){
		console.log(this.password[0],'this.password[0]');
		if(!this.password){
			return
		}
		if(this.password.length!=11 || this.password[0]!=1){
			return this.$u.toast('手机号格式不正确');		
		}
		this.isLoading = true
		this.$u.api.QueryMotorUpdateBindPhone({
			idNumber: this.idNumber,
			mobile: this.password,
			cityCode: this.cityCode
		}).then((res) => {   
			this.isLoading = false     
			if (res.data) {	
				uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
					delta: 1
				});
			} 
        }).catch((error)=>{
			this.isLoading = false			
		});
	}   
  },
};
</script>
<style lang="scss" scoped>
.mobie-box {
  width: 100%;
  padding: 88rpx 48rpx;
  background: rgba(246, 246, 246, 1);
  &-text1{
	font-size: 36rpx;
	font-family: PingFangSC-Semibold, PingFang SC;
	font-weight: 600;
	color: #191919;
	line-height: 44rpx;
	margin-bottom: 16rpx;
  }
  &-text2{
	font-size: 26rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #6E6E6E;
	line-height: 34rpx;	
	margin-bottom: 48rpx;
  }
  .mobie-btn{
	width: 100%;
	height: 80rpx;		
	border-radius: 40rpx;
	margin-top: 88rpx;
	font-size: 32rpx;
	font-family: PingFangSC-Medium, PingFang SC;
	font-weight: 500;	
	display: flex;
	align-items: center;
	justify-content: center;
  }
  .mobie-btn-active{
	background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);	
	color: #FFF9E9;
  }
  .mobie-btn-disabled{
	background-color: #f2f2f2;
	border: 1px solid #f2f2f2;
	color: #bababa;
  }
  text{	
	margin-left: 4rpx;
  }
 
}
</style>
