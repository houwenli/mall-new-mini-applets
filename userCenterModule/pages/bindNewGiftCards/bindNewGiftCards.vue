<template>
  <view class="bind_new_gift_cards">
    <view class="title">请输入礼品卡卡密</view>
    <view class="gift_input">
		<u-input class="my_input" :maxlength="15" v-model="cardKey" :height="80" :border="false" />
		<u-icon name="scan" color="#666" size="48rpx" @click="scanCode"></u-icon>
    </view>
	<view class="btn" @click="bindFun">绑定</view>
  </view>
</template>

<script>
import {encrypt, decrypt } from '../../../common/sign.js'
export default {
  data() {
    return {
		cardKey:''
	};
  },
  methods: {
	   valueCardCodeBandingFun(){
		// 加密
		let cardKey = encodeURIComponent(encrypt(this.cardKey,'wsfvaluecardkey2').encryptStr)
		this.$u.api.valueCardCodeBanding({cardKey}).then(res => {
			if(res.code === 200){
			this.$u.toast("绑定成功")
			setTimeout(() => {
				uni.navigateBack()
			}, 700);
			}else {
			this.$toast(res.description)
			}
		})
		},
	  bindFun(){
      if(!this.cardKey) {
        this.$toast('请输入卡密')
      }
      this.valueCardCodeBandingFun()
    },
	  scanCode(){
		  let that = this;
		  wx.scanCode({
			  onlyFromCamera:false,
			  success: function(res){
				  console.log(res);
				//解密卡密
				let cardKey = res.result.split('cardKey=')[1]
				console.log('cardKey-->',cardKey);
				cardKey = decrypt(cardKey,'wsfvaluecardkey1')
				that.cardKey = cardKey
				console.log('解密后的密文: -->', that.cardKey);
			  },
			  fali: function(error){
				  that.$toast("绑卡失败!")
			  }
		  })
	  }
  },
};
</script>

<style scoped lang="scss">
.bind_new_gift_cards {
  height: 100vh;
  background-color: #fff;
  box-sizing: border-box;
  padding: 60rpx 36rpx;
  .gift_input {
	  margin-top: 24rpx;
	  padding: 0 20rpx;
	  background-color: #F5F5F5;
	  border-radius: 10rpx;
	  display: flex;
	  align-items: center;
	  .my_input {
		  margin-right: 20rpx;
		  flex: 1;
	  }
  }
  .btn {
      width: 100%;
      height: 76rpx;
      line-height: 76rpx;
      background-color: #E60113;
      font-size: 32rpx;
      color: #fff;
      margin-top: 120rpx;
      border-radius: 50rpx;
      text-align: center;
    }
}
</style>
