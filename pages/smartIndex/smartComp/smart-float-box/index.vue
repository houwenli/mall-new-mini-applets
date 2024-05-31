<template>
  <view class="floatBox" v-if="floatBtnData.showConfig && showFloat">
      <view class="floatBtn">
        <!-- ui验收需要去除此图标 暂时注释 后续不要可删除 -->
        <!-- <view class="iconbox">
          <image
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_close.png"
            mode=""
          
            @click="showFun"       
          ></image>
        </view> -->
       
        <image
          :src="floatBtnData.url"
          mode=""
          style="width: 120rpx; height: 120rpx"
          @click="floatBtnFun(floatBtnData)"
          v-if="floatBtnData.url"
        ></image>
        <view class="flex-style bg-gray"   style="width: 120rpx; height: 120rpx" v-else>          
         <image class="pic-que"  src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/component-no-pic-default.png" />
        </view>
      </view>
    </view>
</template>

<script>
export default {
  name: 'floatButton',
  props: {
      isDistribution: {
        type: Boolean,
        required: false,
        default: () => false,
      },
      floatBtnData: {
        type: Object,
        required: true
      }
  },
  data() {
    return {		
      showFloat: true
		}
  },
  methods: {
    showFun(){
      this.showFloat = false
    },
      // 浮动模块
    floatBtnFun(data) {			
      this.$smart.go(data.miniAppLink || data.h5Link);
    },
  }
}
</script>

<style scoped lang="scss">
.floatBox {
  position: fixed;
  right: 24rpx;
  bottom: 300rpx;
  width: 120rpx;
  height: auto;
	z-index: 10;
  .floatBtn {
    position: relative;
    text-align: right;   
    .iconbox {    
      position: absolute;
      right: 0;
      top: 128rpx;
      width: 56rpx;
      height: 48rpx;
      background: #000D1D;
      border-radius: 24rpx;
      opacity: 0.3;
      border: 1rpx solid #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      image{
        width: 24rpx;
        height: 24rpx;
      }
    }
  }
  .pic-que{
    width: 64rpx;
    height: 32rpx;
  }
}
</style>
