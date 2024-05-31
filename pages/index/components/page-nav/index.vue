<template>
  <view>
    <view class="wrap" :class="{'cate-wrap': activeFCIndex != 0}">
       <view class="applet-template-nav" :style="[navBackgroundStyle]" v-if="showSecondCateList && showSecondCateList.length > 0">
        <swiper :current="navCurrent" @change="changeNav" class="index-nav" :style="{height: secondFateBoxHeight}">
          <swiper-item class="index-nav-wrap" v-for="(nav, index) in showSecondCateList" :key="index">
            <template v-for="(item, idx) in nav">
              <view
                class="index-nav-box"
                :key="idx"
                @click="toRouter(item.link, idx, item)"
              >
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
                  >{{ item.text }}</view
                >
              </view>
            </template>
          </swiper-item>
        </swiper>
        <view class="box-progress" v-if="showSecondCateList.length > 1">
          <view
            class="progress-outter"
          >
            <view
              :style="{ transform: `translate(${progressWidth}%)`, width: progressLineWidth+'rpx' }"
              class="progress-line"
            ></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { goPage } from '@/pages/index/helper/index.js'

// 首页-金刚区
export default {
  name: 'PageNav',
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    // TODO:
    return {
      catePopup: false,
      navList: [],
      progressWidth: 0, // 滚动宽度
      navCurrent: 0,
      // 一级分类列表
      firstCateList: [],
      activeFCIndex: 0,
      secondCateList: [],
      indexNavLen: 0,
      FirstCateLen: 0,
    };
  },
  computed: {
    progressLineWidth() {
      return 80 / this.showSecondCateList.length
    },
    showSecondCateList() {
      if(this.activeFCIndex == 0) {
        return this.navList
      } else {
        return this.secondCateList
      }
    },
    secondFateBoxHeight() {
      let height
      if((this.activeFCIndex == 0 && this.indexNavLen > 5) || (this.activeFCIndex > 0 && this.FirstCateLen > 5)) {
        if(this.showSecondCateList && this.showSecondCateList.length > 1) {
          height = '320rpx'
        } else {
          height = '312rpx'
        }
      } else {
        height = '148rpx'
      }
      return height
    },
		navBackgroundStyle() {
			let background = this.config.backgroundType == '1' && this.config.bgImage ? `url(${this.config.bgImage}) no-repeat` : this.config.backgroundType == '0' && this.config.bgColor ? this.config.bgColor : '#fff'
			return {
				background,
			}
		},
  },
  // TODO:
  // watch: {
  //   config: {
  //     handler(newVal) {
  //       console.log('新值', newVal);
  //       let chunk = 10;
  //       let len = newVal.sildeshowList ? newVal.sildeshowList.length : 0;
  //       this.indexNavLen = len
  //       let result = [];
  //       for (let i = 0; i < len; i += chunk) {
  //         result.push(newVal.sildeshowList.slice(i, i + chunk)) // 每10项分成一组
  //       }
  //       this.navList = result
  //     },
  //     immediate: true,
  //     deep: true
  //   }
  // },

  created() {
    this.setPageNav()
  },

  // TODO:
  // beforeDestroy() {
  //   this.$bus.$off("handleCatePopup")
  // },
  // TODO:
  // mounted() {
  //   this.$bus.$on("handleCatePopup", (flag) => {
  //     this.catePopup = flag
  //   });
  //   this.queryCate()
  // },
  methods: {
    // 路由跳转
    toRouter(params, index, item) {
      if(this.activeFCIndex == 0) {
        let link = "";

          link = params;

          // 流量分析埋点
          let obj = {
            name: "页面导航",
            type: 2,
            image: item.url || "",
            url: link || "",
            index: index,
          };
          this.$store.dispatch("SETTINGS/advertVisitRequest", obj);

        // this.$wsf.go(link);
        goPage(link)
      } else {
        let secondCateId = item.id, queryString = item.name
        this.$wsf.go("SpuList", {secondCateId, queryString, isSearchCate: 1});
      }

    },
    /* 检测导航栏滚动 */
    changeNav(e) {
      let current = e.detail.current;
      let total = this.showSecondCateList.length - 1
      this.progressWidth = (current / total) * 100;
      this.navCurrent = current
    },

    setPageNav() {
      let chunk = 10;
      let len = this.config.list ? this.config.list.length : 0;
      this.indexNavLen = len
      let result = [];
      for (let i = 0; i < len; i += chunk) {
        result.push(this.config.list.slice(i, i + chunk)) // 每10项分成一组
      }

      this.navList = result
    }
  },
};
</script>

<style scoped lang="scss">
.wrap {
  padding-left: 24rpx;
  padding-right: 24rpx;
}
.cate-wrap {
  border-radius: 32rpx 32rpx 0 0;
  background-color: #f5f5f5;
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
        background-color: #FD302C;
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
            content: " ";
            display: block;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 68rpx;
            height: 28rpx;
            background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/index-ic_fate_active.png') center no-repeat;
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
        background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/index-ic_cate_line.png') center center no-repeat;
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
        background-color: rgba(0,13,29,0.4);
        z-index: -1;
      }
      .all-cate-container {
        z-index: 1;
        // min-height: 420rpx;
        max-height: 924rpx;
        background: #FFFFFF;
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
            background: #F5F5F8;
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
            background: linear-gradient(270deg, rgba(240, 50, 88, 1), rgba(254, 134, 4, 1));
            padding: 1rpx;
            .cate-item-inner {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 131rpx;
              height: 49rpx;
              background: #FFF1F3;
              border-radius: 28rpx;
              font-weight: bold;
              color: #FF0A35;
              font-size: 22rpx;
            }
          }
        }
      }
    }
  }
  ::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
    color: transparent;
  }
</style>
