<template>
  <view class="floatBox" v-if="floatBtnData.showConfig">
      <view class="floatBtn">
        <image
          :src="floatBoxIcon"
          mode=""
          class="iconbox"
          @click="showFun"
        ></image>
        <image
          :src="floatBtnData.url || 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/dae7a941e28fc339bd5991257778a99c.png'"
          mode=""
          style="width: 120rpx; height: 120rpx"
          @click="floatBtnFun(floatBtnData.link,floatBtnData)"
        ></image>
      </view>
    </view>
</template>

<script>
// 浮动按钮
import floatBoxIcon from "@/static/img/icon/float-box-close.png";
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
			floatBoxIcon: floatBoxIcon
		}
  },
  methods: {
    showFun(){
      if(this.isDistribution){
        this.$store.dispatch('SETTINGS/distributionFloatBtnIsShow',false)
      }else {
        this.$store.dispatch('SETTINGS/floatBtnIsShow',false)
      }
    },
      // 浮动模块
    floatBtnFun(data,item) {
			let link
			if(this.isDistribution) {
				link = data.split('~')[1]
			} else {
				link = data
			}
			let obj = {
          name:"浮动按钮",
          type: 11,
          image:item.url || '',
          url:link || ''
        }
        this.$store.dispatch("SETTINGS/advertVisitRequest",obj);
      this.$wsf.go(link);
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
      width: 40rpx;
      height: 40rpx;
      position: absolute;
      right: 0;
      top: -40rpx;
    }
  }
}
</style>
