<template>
  <view class="popup-container">
    <image
      class="result-image"
      :style="{ height: type === 'isNotActivity' ? '584rpx' : '716rpx' }"
      :src="imgUrl"
    ></image>
  </view>
</template>

<script>
export default {
  name: "answerResultPopup",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "fail",
    },
  },
  computed: {
    imgUrl() {
      // 没有活动或者没有卡券
      if (this.type === "isNotActivity") {
        return `${this.mallImg}/activity/women-Day/isNotActivity.png`;
      }
      // 答对了
      if (this.type === "success") {
        return `${this.mallImg}/activity/women-Day/dati_zhengque.png`;
      } else {
        // 答题错了
        // this.type === "fail"
        return `${this.mallImg}/activity/women-Day/dati_cuowu.png`;
      }
    },
  },
  mounted() {
    this.timer = setTimeout(() => {
      this.$emit("update:show", false);
      this.$emit("closePopup");
    }, 1000);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  data() {
    return {
      timer: null,
      mallImg: this.$mallImg,
    };
  },
};
</script>

<style lang="scss" scoped>
.popup-container {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8) !important;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  .result-image {
    width: 750rpx;
  }
}
</style>
