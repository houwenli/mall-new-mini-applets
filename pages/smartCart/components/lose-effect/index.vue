<template>
  <view class="sku-wraper">
    <view class="loseeffect-wraper">
      <view class="loseeffect-title">
        <view class="loseeffect-title__word">失效宝贝({{ carts.length }})</view>
        <view class="loseeffect-title__clear" @tap="clearFailureGoods()">清空失效宝贝</view>
      </view>
      <view class="loseeffect-list">
        <u-swipe-action
          class="swipe-action"
          :show="item.actionShow"
          v-for="(item, index) in carts"
          :index="index"
          :key="index"
          @click="swipeActioncFun(index)"
          @open="open(index)"
          :options="options"
          btn-width="160"
        >
          <everySku :loseEffect="true" :sku="item" :isLast="index == carts.length-1"></everySku>
        </u-swipe-action>
      </view>
    </view>
    <!-- 确认弹框 -->
		<wsf-confirm v-model="showConfirm" :title="confirmText" @confirm="confirm" @cancel="cancel"></wsf-confirm>
  </view>
</template>

<script>

import wsfConfirm from '@/components/wsf-confirm/wsf-confirm.vue';

import everySku from "../every-sku/index";
export default {
  name: 'skuList',
  components: {
    everySku,
    wsfConfirm
  },
  props: {
    carts: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      // 页面渲染数据
      confirmText: '', // 删除确认文案
      showConfirm: false, // 删除二次确认弹窗
      cartsIndexs: { // 单个删除
        cartsIndex: null,
				index: null
      },

      // u-swipe-action 配置
      options: [{
        text: '删除',
        style: {
          color: '#fff',
          backgroundColor: '#FF0A35',
          margin: '20rpx 0 20rpx 0'
        }
      }],
    };
  },
  created () {

  },
  methods: {
    swipeActioncFun(index) {
      this.cartsIndexs = {
				index
			};
			this.confirmText = `确认要删除已选中的1件商品？`;
			this.showConfirm = true;
    },
    open(index) {
      this.carts.forEach((spu, cartIdx) => {
        if (index == cartIdx) {
          spu.actionShow = true
        } else {
          spu.actionShow = false
        }
      })
    },
    clearFailureGoods() {
			this.confirmText = `确定要一键清空失效商品？`;
			this.showConfirm = true;
		},
    confirm() {
      this.showConfirm = false;
			let ids = null;
			let { index } = this.cartsIndexs;
			if (this.cartsIndexs.index !== null) {
				ids =  this.carts[index].cartId.toString()
			} else {
				ids = this.carts.map(item => item.cartId).toString();
			}
			this.$u.api.DeleteCart({ ids }).then(res => {
        this.$emit('reload')
			});
    },
    cancel() {

    }
  },
};
</script>

<style scoped lang="scss">
.loseeffect-wraper {
  width: 718rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  margin: 16rpx auto 0;
  overflow: hidden;
  .loseeffect-list{
    padding: 4rpx 0rpx;
  }
}
.loseeffect-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64rpx;
  margin: 0 20rpx;
  padding-top: 16rpx;
  &__word {
    font-size: 26rpx;
    font-weight: 500;
    color: #191919;
    line-height: 34rpx;
  }
  &__clear {
    font-size: 22rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FF450C;
    line-height: 30rpx;
  }
}
</style>
