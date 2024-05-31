<template>
  <!-- 温馨提示页 -->
  <view class="tips">
    <view class="tips-text" v-html="content"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      content:''
    }
  },
  onShow() {
    this.getTips()
  },
  methods: {
    async getTips() {
      let res = await this.$u.api.queryRechargeDescription({})
      this.content = res.data.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ')
    }
  }
}
</script>

<style lang="less" scoped>
.tips {
  height: 100%;
  background: #FAFAFB;
  padding: 24rpx 30rpx 0 34rpx;
  .tips-text {
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #000d1d;
    line-height: 58rpx;
  }
}
</style>