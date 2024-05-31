<template>
  <view
    :style="{ borderRadius: radius + 'px', backgroundColor: bgColor }"
    class="search-box"
    @tap="clickHandler"
  >
    <slot name="left">
      <image class="left" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_home_search.png" mode="widthFix"> </image>
    </slot>
    <input
      v-model="searchVal"
      class="input"
      type="text"
      confirm-type="search"
      :focus="focus"
      :disabled="disabled"
      :placeholder="placeholder"
      :placeholderStyle="placeholderStyle"
      placeholder-class="placeholder-class"
      :style="{ backgroundColor: inputBgColor }"
      @focus="getFocus"
      @blur="blur"
      @confirm="confirm"
    />
    <slot v-if="clearable && isVal" name="clearIcon">
      <view class="clear-icon">
        <u-icon
          :name="clearIcon"
          :size="clearSize"
          :color="rightIconColor"
          @click="clear"
        ></u-icon>
      </view>
    </slot>
    <slot v-if="showRight" name="right">
      <button
        class="u-reset-button search-btn"
        hover-class="u-hover-class"
        :style="{ background: rightBtnColor }"
        @click="confirm"
      >
        搜索
      </button>
    </slot>
    <view v-else style="width:32rpx"></view>
  </view>
</template>

<script>
export default {
  name: "WsfSearch",
  props: {
    value: [Number, String],
    placeholder: {
      type: String,
      default: "请输入搜索关键字",
    },
    radius: {
      type: [Number, String],
      default: 24,
    },
    bgColor: {
      type: String,
      default: "#ffffff",
    },
    inputBgColor: {
      type: String,
      default: "#ffffff",
    },
    placeholderStyle: String,
    clearable: {
      type: Boolean,
      default: true,
    },
    trim: {
      type: [Boolean, String],
      default: true,
    },
    // 是否自动聚焦
    focus: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    leftIcon: {
      type: String,
      default: "search.png",
    },
    clearSize: {
      type: [Number, String],
      default: 32,
    },
    clearIcon: {
      type: String,
      default: "close-circle-fill",
    },
    showRight: {
      type: Boolean,
      default: true,
    },
    rightIconColor: {
      type: String,
      default: "#c0c4cc",
    },
    rightBtnColor: {
      type: String,
      default: "linear-gradient(90deg, #FF6B4E 0%, #FF0A35 100%);",
    },
  },
  computed: {
    // 输入框内是否有值
    isVal() {
      const searchVal = this.searchVal;
      // fixed by mehaotian 处理值为0的情况，字符串0不在处理范围
      if (searchVal || searchVal === 0) {
        return true;
      }
      return false;
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(nVal) {
        this.searchVal = nVal;
      },
    },
    searchVal(newVal, oldVal) {
      this.$emit("input", newVal);
      this.$emit('change', newVal);
    },
  },
  data() {
    return {
      show: false,
      searchVal: "",
      ossUrl: this.$oss + "wsf-mall/home/",
    };
  },
  methods: {
    clear() {
      this.searchVal = "";
      // 延后发出事件，避免在父组件监听clear事件时，value为更新前的值(不为空)
      this.$nextTick(() => {
        this.$emit("clear");
      });
    },
    confirm() {
      this.$emit("confirm", this.searchVal);
      // 收起键盘
      uni.hideKeyboard();
    },
    blur() {
      this.$emit("blur", this.searchVal);
    },
    getFocus(e) {
      this.$emit("focus", e.detail);
    },
    // 点击搜索框，只有disabled=true时才发出事件，因为禁止了输入，意味着是想跳转真正的搜索页
    clickHandler() {
      this.disabled && this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 8px;
  height: 32px;
  border-radius: 19px;
  z-index: 99;
  border: 1px solid #191919;
  .left {
    width: 16px;
    height: 16px;
    display: block;
    margin-right: 8px;
  }
  .input {
    flex: 1;
    height: 30px;
    border: 0;
    text-align: left;
    color: #111111;
    font-size: 14px;
  }
  .search-btn {
    display: flex;
    align-items: center;
    height: 28px;
    padding: 8rpx 34rpx;
    font-size: 28rpx;
    color: #fff; 
    margin: 2px;
    border-radius: 37rpx;
    border: 1rpx solid #191919;
  }
  .clear-icon {
    padding: 4px;
  }
}
.placeholder-class {
  color: #c6c6c6;
  font-size: 14px;
}
</style>
