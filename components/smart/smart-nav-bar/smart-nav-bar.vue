<template>
  <view>
    <view id="smart-nav" class="smart-nav" :style="[smartNavClass]">
      <view class="smart-nav__fill" :style="[headFillClass]"></view>
      <view class="smart-nav__content" :style="[contentClass]">
        <!-- 默认头部 -->
        <template v-if="!hasSlot">
          <view v-if="hasBack" class="smart-nav__title-icon" @click="clickBack">
            <image
              class="smart-nav__back-icon"
              :src="backImg.url || smart"
              mode=""
              :style="[backImgClass]"
            ></image>
          </view>
          <view class="smart-nav__title u-line-1" :style="[titleClass]">
            <text class="smart-nav__title-text" v-if="title">{{ title }}</text>
            <image
              v-else-if="image.url"
              :src="image.url"
              :style="[titleImgClass]"
            ></image>
          </view>
        </template>
        <!-- 完全自定义 -->
        <template v-if="hasSlot">
          <slot name="diy" />
        </template>
      </view>
    </view>
    <!-- 占位区 -->
    <view class="smart-nav__placeholder" :style="[placeholderClass]"></view>
  </view>
</template>

<script>
// 购物车nav
export default {
  name: "smartNav",
  props: {
    // 背景颜色
    bgColor: {
      type: String,
      default: "#fff",
    },
    // 背景图片
    bgimg: {
      type: String,
    },
    // 背景透明度
    bgOpacity: {
      type: [String, Number],
      default: 1,
    },
    // 标题颜色
    color: {
      type: String,
      default: "#000",
    },
    // 标题
    title: {
      type: String,
    },
    // 返回按钮图片
    backImg: {
      type: Object,
      default: {},
    },
    // 标题图片(默认,特殊需走插槽)
    image: {
      type: Object,
      default: {},
    },
    //是否有返回按钮
    hasBack: {
      type: [Boolean, String],
      default: true,
    },
    isCustomBack: {
      type: Boolean,
      default: false
    } // 自定义返回
  },
  data() {
    return {
      // 页面中使用图片
      smart: `${this.$smartImg}/home/smart_arrow_back.png`,

      statusBarHeight: this.$globalData.statusBarHeight, // 当前手机顶部状态栏高度,单位px
      capsule: this.$globalData.capsule, // 右上角胶囊的位置信息，宽高以及相对圆点的四个坐标，单位px
      navigationRightWidth: this.$globalData.navigationRightWidth, // 胶囊宽度加上两倍胶囊距离右边的距离
      capsuleToRight: this.$globalData.capsuleToRight, // 胶囊距离右边的距离
    };
  },
  computed: {
    // 胶囊高度，算上离状态栏的高速
    capsuleHeight() {
      let marginTop = this.capsule.top - this.statusBarHeight;
      return marginTop * 2 + this.capsule.height;
    },
    // 顶部填充区域高度
    headFillClass() {
      return {
        height: `${this.statusBarHeight}px`,
      };
    },

    // 是否有插槽，没有的话就是默认头部
    hasSlot() {
      return Object.keys(this.$slots).length > 0;
    },

    // 导航样式
    smartNavClass() {
      let background = this.bgimg
        ? `url(${this.bgimg}) no-repeat; background-size: 100% 100%;`
        : this.bgColor
        ? this.bgColor
        : "#fff";
      return {
        background,
        opacity: this.bgOpacity,
      };
    },

    // 核心区域样式
    contentClass() {
      return {
        padding: this.hasSlot
          ? `0 ${this.$globalData.navigationRightWidth}px 0 0`
          : `0 ${this.$globalData.navigationRightWidth}px`,
        height: `${this.capsuleHeight}px`,
      };
    },

    // 标题样式
    titleClass() {
      return {
        color: this.color,
      };
    },
    // 标题图片
    titleImgClass() {
      return {
        width: this.image.width,
        height: this.image.height,
      };
    },
    //返回按钮图片样式
    backImgClass() {
      return {
        width: this.backImg.width,
        height: this.backImg.height,
      };
    },

    // 占位区域样式
    placeholderClass() {
      return { height: `${this.statusBarHeight + this.capsuleHeight}px` };
    },
  },
  created() {},
  mounted() {
    this.initNavBar();
  },
  methods: {
    // 初始化navbar，获取属性参数
    initNavBar() {
      const query = uni.createSelectorQuery().in(this);
      query
        .select("#smart-nav")
        .boundingClientRect((data) => {
          this.$emit("navBarInfo", {
            navHeight: data.height,
          });
        })
        .exec();
    },

    // 点击返回
    clickBack(e) {
      if (this.isCustomBack) {
        this.$emit('backFunc')
      } else {
        uni.navigateBack();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.smart-nav {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 999;
  &__content {
    display: flex;
    align-items: center;
    position: relative;
  }
  &__back-icon {
    height: 48rpx;
    width: 48rpx;
  }
  &__title {
    width: 100%;
    text-align: center;
  }
  &__title-text {
    font-size: 36rpx;
    font-weight: 400;
    color: #191919;
  }
  &__title-icon {
    height: 48rpx;
    position: absolute;
    top: 50%;
    left: 20rpx;
    transform: translateY(-50%);
  }
  &__placeholder {
    background-color: transparent;
    width: 750rpx;
    position: relative;
  }
}
</style>
