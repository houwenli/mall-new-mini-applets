<template>
  <view class="stores-card">
    <view class="stores-card-wrapper">
      <view class="stores-left">
        <text class="store-title">{{storeTitle}}</text>
        <view class="stores-right" v-if="!isPay">
          <view class="stores-right-wrapper" @click="openAllStorePage">
            <text>附近门店</text>
            <image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store_right_icon.png" alt="" />
          </view>
        </view>
      </view>
      <view :class="['store-address', isPay ? 'store-address-pay' : '']">
        <view class="basic-address">
          <view>
            <text>{{ choosedItem.orgName}}</text>
            <view v-if="isPay && choosedItem.isMin" class="basic-address-j">最近</view>
          </view>
          <view v-if="isPay">
            <view class="basic-address-distance">{{ choosedItem.distance | filterDistance }}</view>
            <image
              src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store_right_icon.png"
              alt=""
              @click="openAllStorePage"
            />
          </view>
        </view>
        <view class="detail-address">{{ choosedItem.address }}</view>
      </view>
    </view>    
  </view>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    isPay: {
      type: Boolean,
      default: false,
    },
    choosedItem: {
      type: Object,
      default: () => {},
    },
    storeTitle: {
      type: String,
      default: '自提门店'
    }
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
    openAllStorePage() {
      this.$emit("openAllStorePage", true);
    },
    openAllStore() {
      this.$emit("handleGoToStores", true);
    },
  },
};
</script>

<style lang="less" scoped>
.stores-card {
  background: #fff;
  padding: 20rpx 24rpx;
  border-radius: 24rpx;
  .stores-card-wrapper {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    color: #999;
    font-size: 26rpx;
    .store-title {
      margin-right: 20rpx;
      font-size: 32rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #191919;
    }
    .stores-left {
      display: flex;
      justify-content: space-between;
      line-height: 1;
      .stores-right {
        .stores-right-wrapper {
          display: flex;
          align-items: center;
          > text {
            font-size: 26rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #c3c3c3;
          }
          > image {
            width: 32rpx;
            height: 32rpx;
          }
        }
      }
    }

    .store-address {
      border-radius: 24rpx;
      border: 0.5rpx solid #ff450c;
      padding: 20rpx 24rpx;
      margin-top: 20rpx;
      background: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/shop.png") 100% 100% no-repeat;
      background-size: 120rpx 120rpx;     
      .basic-address {
        font-size: 30rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        color: #ff450c;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;     
        line-height: 38rpx; 
        > view {
          display: flex;
          align-items: center;
          text {
            font-size: 30rpx;
            font-weight: 600;
          }       
          .basic-address-j {
            color: #191919;
            font-size: 26rpx;
            margin-left: 4rpx;
          }
          .basic-address-distance{
            white-space: nowrap;
            font-size: 24rpx;
          }
        }
        image {
          width: 32rpx;
          height: 32rpx;
        }
      }
      .detail-address {
        font-size: 26rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 34rpx;
      }
    }
    .store-address-pay {
      .basic-address {
        > view:first-of-type {
          align-items: flex-start;
          width: 470rpx;
          > view {
            width: 90rpx;
          }
        }
      }
    }
  }
  .store-popup {
    // background: #F6F6F6;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    .store-popup-title {
      text-align: center;
      color: #000d1d;
      font-size: 32rpx;
      line-height: 44rpx;
      position: relative;
      padding-top: 24rpx;
      padding-bottom: 24rpx;
      // background: #fff;
      > image {
        position: absolute;
        right: 48rpx;
        top: 30rpx;
        height: 40rpx;
        width: 54rpx;
      }
    }
    .store-box {
      background: #f6f6f6;
      border-radius: 24rpx 24rpx 0 0;
      position: relative;
      padding: 24rpx 32rpx;
      flex: 1;
      overflow-y: auto;
      .more-tip {
        margin-top: 32rpx;
        color: #999;
        font-size: 26rpx;
        text-align: center;
        line-height: 34rpx;
      }
    }
  }
}
</style>
