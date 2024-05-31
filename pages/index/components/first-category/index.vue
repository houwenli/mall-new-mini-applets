<template>
  <view data-desc='一级分类' class="first-cate">
    <scroll-view
      :scroll-x="true"
      class="scroll-x"
      scroll-with-animation
      :scroll-into-view="scrollFCateId"
    >
      <block v-for="(item, index) in firstCateList" :key="index">
        <view
          class="f-cate-box"
          :class="{ active: activeFCIndex == index }"
          :key="index"
          @click="tapFirstCate(item, index)"
          :id="'fCate' + index"
        >
          <text class="cate-name" :style="{ color: headerData.textColor }">{{
            item.name
          }}</text>
        </view>
      </block>
    </scroll-view>
    <view class="all-cate" @tap="handleCatePopup(catePopup ? false : true)">
      <text class="line"></text>
      <image
        class="img"
        :class="{ rotate: catePopup }"
        src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/ic_fate_arrow.png"
      />
      <text class="text" :style="{ color: headerData.textColor }">{{
        catePopup ? '收起' : '全部'
      }}</text>
    </view>

    <!-- 一级分类的弹窗 -->
    <view data-desc='一级分类弹窗' class="all-cate-popup" v-if="catePopup" :style="{height: getMaskHeight}" @click.capture="handleCatePopup(false)">
      <view class="all-cate-container">
        <view class="all-cate-scroll">
          <image
            class="all-cate-image"
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/ic_all_cate.png"
          />
          <block v-for="(item, index) in firstCateList" :key="index">
            <view
              class="cate-item cate-item-active"
              :key="index"
              v-if="activeFCIndex == index"
              :class="{ 'cate-item-no-margin': isLineLastNode(index) }"
            >
              <view class="cate-item-inner">{{ item.name }}</view>
            </view>
            <view
              class="cate-item"
              :key="index"
              v-else
              @click.capture="tapFirstCate(item, index)"
              :class="{ 'cate-item-no-margin': isLineLastNode(index) }"
              >{{ item.name }}</view
            >
          </block>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 一级分类
export default {
  name: 'first-category',

  props: {
    /**
     * 一级分类id
     */
    firstCateId: {
      type: [Number, String],
      default: ''
    }
  },

  data() {
    return {
      firstCateList: [],
      catePopup: false,

      activeFCIndex: 0,

      // 一级分类底部到手机顶部的距离
      top: null
    };
  },

  watch: {
    categoryInit: function(val) {
      if (val) {
        this.tapFirstCate(this.firstCateList[0], 0)
      }
    }
  },

  computed: {
    // 背景图数据
    headerData() {
      return this.$store.getters['SETTINGS/headerData'];
    },
    /**
     * 通过锚点的方式-实现元素平移到指定位置
     * 只要是一级分类大于1，每次平移，保证左侧有一个元素占位，高亮为第二个，这就是为啥下面的索引要-1
     */
    scrollFCateId() {
      if (this.activeFCIndex <= 1) {
        return 'fCate0';
      } else {
        return 'fCate' + (this.activeFCIndex - 1);
      }
    },

    getMaskHeight() {
      return `calc(100vh - ${this.top})`
    }
  },

  watch: {
    firstCateId(val) {
      if (val === '') {
        this.activeFCIndex = 0
      }
    }
  },

  mounted() {
    // TODO: 迁移到 二级分类里面去做
    this.$bus.$on('handleCatePopup', (flag) => {
      this.catePopup = flag;
    });

    this.queryCate();

    this.getHeaderHeight()
  },

  methods: {
    /**
     * 开启/关闭弹窗
     */
    handleCatePopup(flag) {
      this.catePopup = flag;
      // 让全局不滚动
      this.$bus.$emit('openFixedMask', flag);
    },
    isLineLastNode(index, text) {
      // 第一行特殊处理
      if (index === 3) return true;

      if (index > 3) {
        // 从1开始计数
        let i = index + 1;
        let lineSize = 5;
        // 行号 - 先剔除掉索引（0-3） 这4个元素
        let lineNo = Math.ceil((i - 4) / lineSize) + 1;

        /**
         * 全部 1   2    3    4
         * 5   6    7    8   9    行号：2  Math.ceil(9-4)/5 + 1 = 2
         * 10  11   12  13  14    行号：3
         * 15  16   17  18  19    行号：4
         *
         * lineNo = 2  (2-1) * 5 + 4 = 9
         * lineNo = 3  (3-1) * 5 + 4 = 14
         */
        let isLastNode = (lineNo - 1) * lineSize + (lineSize - 1) === i;
        if (isLastNode) return true;
      }

      return false;
    },

    //查询一级分类
    queryCate(parentId = 0) {
      //type: 1 查一级分类 2查二级分类 3查三级商品
      let params = {
        parentId,
      };
      this.$u.api.Categorybyparentid(params).then((res) => {
        if (res.code == 200) {
          // 一级分类
          let fCateArr = res.data;
          fCateArr.forEach((item) => {
            if (item.name && item.name.length > 4) {
              item.name = item.name.slice(0, 4);
            }
          });
          let list = [
            {
              name: '首页',
            },
          ];
          this.firstCateList = list.concat(fCateArr);
          this.activeFCIndex = 0;
        }
      });
    },

    /**
     * 切换一级分类
     */
    tapFirstCate(item, index) {

      // 当前高亮和点击的是同一个-什么都不处理
      if (index === this.activeFCIndex) return

      // 通知父组件一级分类是什么，作用-刷新二级分类组件
      let id = '';
      if (index !== 0) {
        // 一级分类的id
        id = item.id;
      }
      this.$emit('onUpdateFirstLevel', {
        index: index,
        // 一级分类的id
        id: id,
      });

      // TODO: 看下面的这段逻辑不要，不要控制 setIndexTemplate +  activeTemplate 事件

      this.handleCatePopup(false);
      if (index == 0) {
        this.$emit('setIndexTemplate');
        this.$bus.$emit('activeTemplate', { type: 'index', id: '' });
      } else {
        // this.$bus.$emit('activeTemplate', { type: 'cate', id: item.id });
        // this.cateLoading = true;
        // this.$emit('showCateLoading', true);
        // this.$bus.$emit('showCateLoading', true);
        // setTimeout(() => {
        //   this.cateLoading = false;
        //   this.$emit('showCateLoading', false);
        //   this.$bus.$emit('showCateLoading', false);
        // }, 500);
      }
      this.activeFCIndex = index;
    },

    getHeaderHeight() {
      // 36是一级分类的高度
      let height = (getApp().globalData.statusBarHeight + 44 + 48 + 36) * 2;

      this.top = height + 'rpx';
    }
  },
};
</script>

<style lang="scss" scoped>
.first-cate {
  z-index: 99;
  width: 100%;
  height: 56rpx;
  position: relative;
  margin: -8rpx 0 8rpx;
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
          content: ' ';
          display: block;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 64rpx;
          height: 16rpx;
          background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/home-classify-active-icon.png');
          background-repeat: no-repeat;
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
    top: 56rpx;
    left: 0;
    width: 100vw;

    background-color: rgba(0, 13, 29, 0.4);
    border-radius: 32rpx 32rpx 0 0;


    .all-cate-container {
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
</style>
