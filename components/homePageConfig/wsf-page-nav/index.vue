<template>
  <view>
    <view class="first-cate">
      <scroll-view
        :scroll-x="true"
        class="scroll-x"
        scroll-with-animation
        :scroll-into-view="scrollFCateId"
      >
        <block v-for="(item, index) in firstCateList" :key='index'>
          <view
            class="f-cate-box"
            :class="{ active: activeFCIndex == index }"
            :key="index"
            @tap="tapFirstCate(item, index)"
            :id="'fCate' + index"
          >
            <text class="cate-name">{{ item.name }}</text>
          </view>
        </block>
      </scroll-view>
      <view class="all-cate" @tap="handleCatePopup(catePopup ? false : true)">
        <text class="line"></text>
        <image class="img" :class="{rotate: catePopup}" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/ic_fate_arrow.png" />
        <text class="text">{{catePopup ? "收起" : "全部"}}</text>
      </view>

      <view class="all-cate-popup" v-if="catePopup">
        <view class="all-cate-container">
           <view class="all-cate-scroll">
            <image class="all-cate-image" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/ic_all_cate.png" />
            <block v-for="(item, index) in firstCateList" :key='index'>
              <view class="cate-item cate-item-active" :key="index" v-if="activeFCIndex == index" :class="{'cate-item-no-margin': isLineLastNode(index)}">
                <view class="cate-item-inner">{{ item.name }}</view>
              </view>
               <view class="cate-item" :key="index" v-else @tap="tapFirstCate(item, index)" :class="{'cate-item-no-margin': isLineLastNode(index)}">{{ item.name }}</view>
            </block>
          </view>
        </view>
        <view class="all-cate-mask" @tap="handleCatePopup(false)"></view>
      </view>
    </view>
    <view class="wrap" :class="{'cate-wrap': activeFCIndex != 0}" :style="{display: cateLoading ? 'none':'block'}">
       <view class="applet-template-nav" :style="[navBackgroundStyle]" v-if="showSecondCateList && showSecondCateList.length > 0">
        <scroll-view scroll-x="true" class="index-nav" scroll-with-animation @scroll="scrollNav" :style="{height: secondFateBoxHeight}">
            <view class="index-nav-wrap" v-for="(nav, index) in showSecondCateList" :key="index">
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
                    '--nav-text-color': listData.textColor
                      ? listData.textColor
                      : '# 000',
                  }"
                  class="index-nav-txt"
                  >{{ item.btnText }}</view
                >
              </view>
            </template>
          </view>
        </scroll-view>
        <view class="box-progress" v-if="showSecondCateList.length > 1">
          <view
            class="progress-outter"
          >
            <view
              :style="{ transform: `translate(${progressWidth}%)` }"
              class="progress-line"
            ></view>
          </view>
        </view>
      </view>
    </view>
    <view :style="{display: cateLoading ? 'flex':'none'}" class="loading-box">
      <image class="loading-img" :src="ossUrl + 'wsf-mall/home/loading.gif'" />
      <text class="loading-text">加载中…</text>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  props: {
    listData: {
      type: Object,
    },
    isDistribution: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },
  data() {
    return {
      ossUrl: this.$oss,
      cateLoading: false,
      catePopup: false,
      navList: [],
      progressWidth: 0, // 滚动宽度
      navCurrent: 0,
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
    scrollFCateId() {
      if (this.activeFCIndex <= 1) {
        return "fCate0";
      } else {
        return "fCate" + (this.activeFCIndex - 1);
      }
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
          height = '306rpx'
        }
      } else {
        height = '148rpx'
      }
      return height
    },
		navBackgroundStyle() {
			let background = this.listData.backgroundType == '1' && this.listData.bgImage ? `url(${this.listData.bgImage}) no-repeat` : this.listData.backgroundType == '0' && this.listData.bgColor ? this.listData.bgColor : '#fff'
			return {
				background,
			}
		},
  },
  watch: {
    listData: {
      handler(newVal) {
        let chunk = 10;
        let len = newVal.sildeshowList ? newVal.sildeshowList.length : 0;
        this.indexNavLen = len
        let result = [];
        for (let i = 0; i < len; i += chunk) {
          result.push(newVal.sildeshowList.slice(i, i + chunk)) // 每10项分成一组
        }
        this.navList = result
      },
      immediate: true,
      deep: true
    }
  },
  beforeDestroy() {
    this.$bus.$off("handleCatePopup")
  },
  mounted() {
    this.$bus.$on("handleCatePopup", (flag) => {
      this.catePopup = flag
    });

    this.queryCate()
  },
  methods: {
    // 路由跳转
    toRouter(params, index, item) {
      if(this.activeFCIndex == 0) {
        let link = "";
        if (this.isDistribution) {
          link = params.split("~")[1];
        } else {
          link = params;
        }
        if (!this.isDistribution) {
          // 流量分析埋点
          let obj = {
            name: "页面导航",
            type: 2,
            image: item.url || "",
            url: link || "",
            index: index,
          };
          this.$store.dispatch("SETTINGS/advertVisitRequest", obj);
        }
        this.$wsf.go(link);
      } else {
        let secondCateId = item.id, queryString = item.name
        this.$wsf.go("SpuList", {secondCateId, queryString, isSearchCate: 1});
      }

    },
    /* 检测导航栏滚动 */
    scrollNav(e) {
      console.log(e,"e");
      let scrollLeft = e.detail.scrollLeft;
      let scrollWidth = e.detail.scrollWidth - 351
      this.progressWidth = ((scrollLeft) / scrollWidth) * 100;
    },
    //查询一级分类
    queryCate(parentId = 0, type = 1) {
      //type: 1 查一级分类 2查二级分类 3查三级商品
      let params = {
        parentId,
      };
      this.$u.api.Categorybyparentid(params).then((res) => {
        if (res.code == 200) {
           if (type == 1) {
            let fCateArr = res.data
            fCateArr.forEach(item => {
              if(item.name && item.name.length > 4) {
                item.name = item.name.slice(0,4)
              }
            })
            let list = [{
              name: "首页"
            }]
            this.firstCateList = list.concat(fCateArr);
            this.activeFCIndex = 0;
          } else {
            let resList = res.data.filter(item => {
              item.btnText = item.name
              return item.url
            })
            let chunk = 10;
            let len = resList.length;
            this.FirstCateLen = len
            let result = [];
            for (let i = 0; i < len; i += chunk) {
              result.push(resList.slice(i, i + chunk)) // 每10项分成一组
            }
            this.secondCateList = result
          }
        }
      });
    },
    tapFirstCate(item, index) {
      if(this.activeFCIndex == index) return
      this.handleCatePopup(false)
      if(index == 0) {
        this.$emit("setIndexTemplate")
        this.$bus.$emit("activeTemplate", {type: 'index', id: ''})
      } else {
        this.queryCate(item.id, 2);
        this.getCateTemplate(item.id)
        this.$bus.$emit("activeTemplate", {type: 'cate', id: item.id})
        this.cateLoading = true
        this.$emit("showCateLoading", true)
        this.$bus.$emit("showCateLoading", true)
        setTimeout(() => {
          this.cateLoading = false
          this.$emit("showCateLoading", false)
          this.$bus.$emit("showCateLoading", false)
        }, 500)
      }
      this.activeFCIndex = index;
    },
    handleCatePopup(flag) {
      this.catePopup = flag
      this.$bus.$emit('openFixedMask', flag)
    },
    getCateTemplate(id) {
      this.$u.api.HomeTemplateById({id}).then(res => {
        let json = ''
        if(res.data) {
          json = res.data.indexJson
        }
        this.$emit("setTemplate", json)
      })
    },
    isLineLastNode(index, text) {
      // 第一行特殊处理
      if (index === 3) return true

      if (index > 3) {
        // 从1开始计数
        let i = index + 1
        let lineSize = 5
        // 行号 - 先剔除掉索引（0-3） 这4个元素
        let lineNo = Math.ceil((i - 4) / lineSize) + 1

        /**
         * 全部 1   2    3    4
         * 5   6    7    8   9    行号：2  Math.ceil(9-4)/5 + 1 = 2
         * 10  11   12  13  14    行号：3
         * 15  16   17  18  19    行号：4
         *
         * lineNo = 2  (2-1) * 5 + 4 = 9
         * lineNo = 3  (3-1) * 5 + 4 = 14
         */
        let isLastNode = (lineNo - 1) * lineSize + (lineSize - 1)  === i
        // console.log(isLastNode, 'index---', i,  '-----行号', lineNo, text)
        if (isLastNode) return true
      }

      return false
    }
  },
};
</script>

<style scoped lang="scss">
.wrap {
  padding: 0 24rpx;
}
.cate-wrap {
  padding: 16rpx 24rpx 0;
  border-radius: 24rpx 24rpx 0 0;
  background-color: #f5f5f5;
  min-height: 24rpx;
}
.applet-template-nav {
  padding: 24rpx 0;
  position: relative;
  border-radius: 24rpx;
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
      width: 692rpx;
      box-sizing: border-box;

      .index-nav-box {
        display: inline-block;
        width: 104rpx;
        height: 140rpx;
        flex-shrink: 0;
        text-align: center;
        margin-left: 34rpx;
        box-sizing: content-box;
        &:nth-child(1), &:nth-child(6) {
          margin-left: 24rpx;
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
    .progress-outter {
      height: 16rpx;
      background-color: #f4f5f9;
      width: 80rpx;
      border-radius: 8rpx;
      .progress-line {
        height: 100%;
        background-color: #FD302C;
        border-radius: 8rpx;
        width: 40rpx;
      }
    }

  }
}

  .first-cate {
    z-index: 99;
    width: 100%;
    height: 56rpx;
    position: relative;
    margin-bottom: 8rpx;
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
        height: 56rpx;
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
            bottom: 0rpx;
            left: 50%;
            transform: translateX(-50%);
            width: 64rpx;
            height: 16rpx;
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
      height: 56rpx;
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
      top: 64rpx;
      left: 0;
      width: 100vw;
      z-index: 100;
      height: calc(100vh - 64rpx);

      .all-cate-mask {
        position: absolute;
        top: 40rpx;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0,13,29,0.4);
        z-index: -1;
      }
      .all-cate-container {
        // z-index: 1;
        // min-height: 420rpx;
        max-height: 924rpx;
        background: #FFFFFF;
        border-radius: 24rpx;
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
            padding: 2rpx;
            .cate-item-inner {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 130rpx;
              height: 48rpx;
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
  .loading-box {
    border-radius: 24rpx 24rpx 0 0;
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
      color: #90969E;
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
