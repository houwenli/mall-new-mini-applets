<template>
  <view class="store-item" :class="{ 'choose-item': storeItem.checked }">
    <view class="store-detail">
		<view class="store-image">
			<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store-default.png" alt="" />
		</view>
		<view class="detail-right">
			<view class="store-name">{{ storeItem.orgName }}</view>
			<view class="store-address">
			<text v-if="storeItem.distance" class="distance">约{{ storeItem.distance | filterDistance }}</text>
			<text class="detail-address">{{ storeItem.address }}</text>
			</view>
		</view>
    </view>
    <view class="store-helper">
		<view class="helper-item" @click="openMap">
			<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/navigation.png" alt="" />
			<text>导航</text>
		</view>
		<!-- <view class="helper-item" @click.stop.prevent="openPhone">
			<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/phone-icon.png" alt="" />
			<text>电话联系</text>
		</view> -->
    </view>
    <image
		class="checked-icon"
		v-if="storeItem.checked"
		src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store-checked.png"
		alt=""
    />	
	
	<!-- 联系门店 -->
	<motorPhone 
		:motorPhoneShow="motorPhoneShow"
		@handleCloseDialog="motorPhoneShow=false"
		:mobile="mobile" 
		:idNumber="storeItem.idNumber"
		:cityCode="sendStore.cityCode"
	>
	</motorPhone>
  </view>
</template>

<script>
import motorPhone from "./motorPhone.vue";
export default {
	components: {    
		motorPhone
	},
	props: {
		storeItem: {
			type: Object,
			default: () => {},
		},
		sendStore: {
			type: Object,
			default: () => {},
		},
		mobile: {
			type: String,
			default: '',
		}
	},
	data() {
		return {
			motorPhoneShow: false,			
		};
	},
	onShow(){
		
	},
  filters: {
    filterDistance(val) {
      if(val){
        if(val > 1000){
          return (val/1000).toFixed(1) + 'km'
        } else {
          val = String(val)
          let index = val.indexOf('.')
          if(index>-1){
            return val.slice(0, index) + 'm'
          } else {
            return val + 'm'
          }
        }
      } else {
        return ''
      }
    }
  },
	methods: {
		openPhone() {			
			this.motorPhoneShow = true			
		},
		openMap() {
			console.log(this.storeItem,'storeItem============');
      if(!this.storeItem.longitude || !this.storeItem.latitude) {
        uni.showToast({
					title: '暂无门店定位！',
					icon: 'none'
				});
        return
      }
			uni.openLocation({
				name: this.storeItem.orgName,
        address: this.storeItem.address,
				longitude: Number(this.storeItem.longitude),
				latitude: Number(this.storeItem.latitude),
				scale: 12,
				success: function () {
					console.log("success");
				},
			});
		},
	},
};
</script>

<style lang="less" scoped>
.store-item {
  background: #fff;
  border-radius: 24rpx;
  margin-bottom: 20rpx;
  padding: 32rpx 32rpx 24rpx;
  position: relative;
  border: 1rpx solid transparent;
  &.choose-item {
    border: 0.5rpx solid #ff0a35;
  }
  .store-detail {
    display: flex;
    align-items: center;
    padding-bottom: 24rpx;
    overflow: hidden;
    position: relative;
    &::after {
      content: "";
      width: 100%;
      height: 1rpx;
      position: absolute;
      left: 0;
      bottom: 0;
      background: #eaeaea;
      opacity: 0.6;
    }
    .store-image {
      width: 120rpx;
      height: 120rpx;
      margin-right: 16rpx;
      > image {
        width: 120rpx;
        height: 120rpx;
      }
    }
    .detail-right {
      flex: 1;
      overflow: hidden;
      .store-name {
        color: #191919;
        font-size: 32rpx;
        line-height: 40rpx;
        width: 100%;
        font-weight: bold;
        overflow: hidden; /*超出部分隐藏*/
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /*规定段落中的文本不进行换行 */
      }
      .store-address {
        font-size: 26rpx;
        color: #999;
        display: flex;
        .distance {
          margin-right: 18rpx;
          position: relative;
          display: flex;
          align-items: center;
		 
          &::after {
            content: "";
            position: absolute;
            width: 1rpx;
            height: 24rpx;
            background: #c3c3c3;
            right: -10rpx;
			      top: 55%;
            transform: translateY(-50%);
          }
        }
        .detail-address {
          flex: 1;		 
          overflow: hidden; /*超出部分隐藏*/
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /*规定段落中的文本不进行换行 */          
        }
      }
    }
  }
  .store-helper {
    padding-top: 24rpx;
    display: flex;
    position: relative;
    .helper-item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      > image {
        width: 40rpx;
        height: 40rpx;
        margin-right: 8rpx;
      }
      > text {
        color: #646a72;
        font-size: 24rpx;
      }
    }
    &::after {
      content: "";
      position: absolute;
      width: 1rpx;
      height: 32rpx;
      background: #eaeaea;
      left: 50%;
      top: 28rpx;
      transform: translateX(-50%);
      opacity: 0.6;
    }
  }
  .checked-icon {
    position: absolute;
    top: -1rpx;
    right: -1rpx;
    width: 32rpx;
    height: 32rpx;
  }
}
</style>
