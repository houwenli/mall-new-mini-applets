<template>
  <view data-desc="二级分类" class="category-container">
    <view
      class="applet-template-nav"
      :style="[navBackgroundStyle]"
      v-if="navList && navList.length > 0"
    >
      <swiper
        @change="changeNav"
        class="index-nav"
        :style="{ height: secondFateBoxHeight }"
      >
        <swiper-item
          class="index-nav-wrap"
          v-for="(nav, index) in navList"
          :key="index"
        >
          <template v-for="(item, idx) in nav">
            <view class="index-nav-box" :key="idx" @click="toRouter(item)">
              <image
                class="index-nav-img"
                :src="
                  item.url
                    ? `${item.url}?imageView2/1/w/138`
                    : 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/9b496c274eacdd0606e79714d08d8c1d.png?imageView2/1/w/138'
                "
              ></image>
              <view
                :style="{
                  '--nav-text-color': config.textColor
                    ? config.textColor
                    : '# 000',
                }"
                class="index-nav-txt"
                >{{ clipText(item.text) }}</view
              >
            </view>
          </template>
        </swiper-item>
      </swiper>

      <!-- 指示器 -->
      <view class="box-progress" v-if="navList.length > 1">
        <view class="progress-outter">
          <view
            :style="{
              transform: `translate(${progressWidth}%)`,
              width: progressLineWidth + 'rpx',
            }"
            class="progress-line"
          ></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 首页-金刚区
export default {
  name: 'PageNav',
  props: {
    /**
     * 二级分配这个配置实际上构建了一个对象 = 首页的颜色信息 + 查询二级分类接口的list数据
     */
    config: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // 总内容
      allList: [],
      // 分组后的列表
      navList: [],
      progressWidth: 0, // 滚动宽度
    };
  },
  computed: {
    progressLineWidth() {
      return 80 / this.navList.length;
    },

    secondFateBoxHeight() {
      let height;

      if (this.allList.length > 5) {
        if (this.navList.length > 1) {
          // 超过1屏
          height = '320rpx';
        } else {
          // 只有一组内容
          height = '312rpx';
        }
      } else {
        // 一屏幕的内容
        height = '148rpx';
      }

      return height;
    },
    navBackgroundStyle() {
      if (this.config.backgroundType === '0') {
        return {
          backgroundColor: this.config.bgColor,
        };
      }

      return {
        backgroundImage: `url(${this.config.bgImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      };
    },
  },

  created() {
    this.allList = this.$u.deepClone(this.config.list);

    this.navList = this.getTwoGroup(this.config.list, 10);
  },

  methods: {
    // 路由跳转
    toRouter(item) {
      let secondCateId = item.id;
      let queryString = item.name;
      this.$smart.go('SpuList', { secondCateId, queryString, isSearchCate: 1 });
    },
    /* 检测导航栏滚动 */
    changeNav(e) {
      let current = e.detail.current;
      let total = this.navList.length - 1;
      this.progressWidth = (current / total) * 100;
    },

    getTwoGroup(array, subGroupLength) {
      let index = 0;
      let newArray = [];
      while (index < array.length) {
        newArray.push(array.slice(index, (index += subGroupLength)));
      }
      return newArray;
    },

    /**
     * 设计稿最多展示4个字
     */
    clipText(text) {
      if (text.length > 4) {
        return text.substring(0, 4);
      }

      return text;
    },
  },
};
</script>

<style scoped lang="scss">
.category-container {
  margin-left: 24rpx;
  margin-right: 24rpx;
}
.applet-template-nav {
  padding: 24rpx 10rpx;
  position: relative;
  border-radius: 32rpx;
  background-size: 100% 100%;
  background-position: top center;
  .index-nav {
    white-space: nowrap;
    ::-webkit-scrollbar {
      width: 0 !important;
      height: 0 !important;
      color: transparent !important;
      display: none;
    }
    .index-nav-wrap {
      display: inline-flex;
      flex-wrap: wrap;
      text-decoration: none;
      width: 100vw;

      .index-nav-box {
        display: inline-block;
        width: 128rpx;
        height: 146rpx;
        flex-shrink: 0;
        text-align: center;
        margin-right: 10rpx;
        box-sizing: content-box;
        &:nth-child(5n) {
          margin-right: 0;
        }
        &:nth-child(n + 6) {
          margin-top: 16rpx;
        }
        .index-nav-img {
          width: 104rpx;
          height: 104rpx;
          border-radius: 24rpx;
        }
        .index-nav-txt {
          margin-top: 8rpx;
          font-size: 24rpx;
          height: 26rpx;
          text-overflow: ellipsis;
          overflow: hidden;
          line-height: 26rpx;
          color: var(--nav-text-color);
        }
        // &:first-child {
        //   padding-left: 24rpx;
        // }
        // &:last-child {
        //   padding-right: 24rpx;
        // }
      }
    }
  }

  .box-progress {
    width: 100%;
    display: flex;
    justify-content: center;
    background-color: transparent;
    position: absolute;
    left: 0;
    bottom: 8rpx;
    // background-color: #f5f5f5;
    .progress-outter {
      height: 16rpx;
      background-color: #f4f5f9;
      width: 80rpx;
      border-radius: 8rpx;
      .progress-line {
        height: 100%;
        background-color: #fd302c;
        width: 20rpx;
        border-radius: 8rpx;
      }
    }
  }
}

.first-cate {
  z-index: 99;
  width: 100%;
  height: 72rpx;
  position: relative;
  ::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
    color: transparent;
  }
  .scroll-x {
    width: 618rpx;
    box-sizing: border-box;
    white-space: nowrap;
    margin: 0 20rpx 0 10rpx;
    .f-cate-box {
      vertical-align: top;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 14rpx;
      height: 72rpx;
      position: relative;
      &.active {
        .cate-name {
          color: #fff;
          font-weight: bold;
          font-size: 32rpx;
        }
        &:after {
          content: ' ';
          display: block;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 68rpx;
          height: 28rpx;
          background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/index-ic_fate_active.png') center
            no-repeat;
          background-size: 100% 100%;
        }
      }
      .cate-name {
        line-height: 42rpx;
        font-size: 30rpx;
        color: #fff;
      }
    }
  }
  .all-cate {
    height: 72rpx;
    width: 120rpx;
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    align-items: center;
    .line {
      width: 2rpx;
      height: 100%;
      background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/index-ic_cate_line.png') center center
        no-repeat;
      background-size: 100% 100%;
    }
    .text {
      font-size: 28rpx;
      color: #fff;
      line-height: 40rpx;
    }
    .img {
      margin: 0 8rpx 0 6rpx;
      width: 24rpx;
      height: 24rpx;
      -webkit-transition: 0.3s;
      transition: 0.3s;
      transform: rotate(180deg);
    }
    .rotate {
      transform: rotate(0);
    }
  }
  .all-cate-popup {
    position: absolute;
    top: 72rpx;
    left: 0;
    width: 100vw;

    .all-cate-mask {
      position: absolute;
      top: 40rpx;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 13, 29, 0.4);
      z-index: -1;
    }
    .all-cate-container {
      z-index: 1;
      // min-height: 420rpx;
      max-height: 924rpx;
      background: #ffffff;
      border-radius: 32rpx;
      padding: 32rpx 24rpx;
      .all-cate-scroll {
        height: 100%;
        overflow: auto;
        .all-cate-image {
          margin-right: 8rpx;
          width: 134rpx;
          height: 52rpx;
        }
        .cate-item-no-margin {
          margin-right: 0 !important;
        }
        .cate-item {
          vertical-align: top;
          margin-right: 8rpx;
          margin-top: 24rpx;
          width: 134rpx;
          height: 52rpx;
          background: #f5f5f8;
          border-radius: 28rpx;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 22rpx;
          color: #111;
          &:nth-child(-n + 5) {
            margin-top: 0;
          }
        }
        .cate-item-active {
          background: linear-gradient(
            270deg,
            rgba(240, 50, 88, 1),
            rgba(254, 134, 4, 1)
          );
          padding: 1rpx;
          .cate-item-inner {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 131rpx;
            height: 49rpx;
            background: #fff1f3;
            border-radius: 28rpx;
            font-weight: bold;
            color: #ff0a35;
            font-size: 22rpx;
          }
        }
      }
    }
  }
}
.loading-box {
  border-radius: 32rpx 32rpx 0 0;
  padding-top: 370rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  background-color: #f5f5f5;
  .loading-img {
    width: 160rpx;
    height: 80rpx;
  }
  .loading-text {
    font-size: 20rpx;
    color: #90969e;
    line-height: 28rpx;
    color: #90969e;
    margin-top: 8rpx;
  }
}

::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  color: transparent;
}
</style>
