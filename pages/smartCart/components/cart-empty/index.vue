<template>
  <view class="cart-isempty" :style="[cartIsemptStyle]" v-if="showEmpty">
    <!-- 无网络 -->
    <view class="cart-isempty__content cart-isempty__nonetwork" v-if="noNetwork">
      <image class="cart-isempty__img" :src="`${smartImg}/cart/no-network.png`"></image>
      <view class="cart-isempty__tips">请检查网络设置或稍后重试</view>
      <view class="cart-isempty__btn-wraper">
        <view class="cart-isempty__btn" @click="retry" >重试</view>
      </view>
    </view>
    <!-- 无数据 -->
    <view class="cart-isempty__content" v-else-if="noData">
      <image class="cart-isempty__img" :src="`${smartImg}/cart/no-data.png`"></image>
      <view class="cart-isempty__tips">还没有加购任何商品，快去选购吧</view>
    </view>
    <!-- 未登录 -->
    <view class="cart-isempty__content" v-else-if="!isLogin">
      <image class="cart-isempty__img" :src="`${smartImg}/cart/no-login.png`"></image>
      <view class="cart-isempty__tips">登录后可查看购物车</view>
      <view class="cart-isempty__btn-wraper">
        <view class="cart-isempty__btn" @click="goLogin" >登录</view>
      </view>
    </view>
    
  </view>
</template>

<script>

// 公告组件
export default {
  name: 'cartEmpty',
  props: {
    // 无网络，接口报错
    noNetwork: {
      type: Boolean,
      default: false
    },
    // 无数据
    noData: {
      type: Boolean,
      default: false
    },
    // 未登录
    isLogin: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number | String,
      default: ''
    }
  },
  data() {
    return {
      smartImg: this.$smartImg,
			statusBarHeight: this.$globalData.statusBarHeight,
    };
  },
  computed: {
    showEmpty() {
      return this.noNetwork || this.noData || !this.isLogin
    },
    isAllScreen() {
      return this.noNetwork
    },
    cartIsemptStyle() {
      let height = typeof this.height === 'string' ? this.height : `${this.height}px`
      return {
        height: this.isAllScreen ? height : 'auto',
        paddingTop: '0rpx',
      }
    }
  },
  created () {
  },
  methods: {
    // 去首页
		goIndex() {
			this.$smart.go('Index')
		},
		// 去登录页
		goLogin() {
			this.$smart.go('QuickLogin', { cartRoute: 'pages/smartCart/smartCart' })
		},
    // 重试
    retry() {
      this.$emit('reload')
    }
  },
};
</script>

<style scoped lang="scss">
.cart-isempty {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin: 120rpx 0;
  }
  &__nonetwork {
    margin-top: -20rpx;
  }
	&__img {
		width: 320rpx;
		height: 320rpx;
	}
	&__tips {
		font-size: 30rpx;
		font-weight: 400;
		color: #999999;
		line-height: 38rpx;
		margin-top: 24rpx;
	}
	&__btn-wraper {
		margin-top: 16rpx
	}
	&__btn {
		width: 192rpx;
		height: 80rpx;
		background: #FFBE0C;
		border-radius: 40rpx;
		font-size: 32rpx;
		font-weight: 500;
		color: #191919;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
</style>
