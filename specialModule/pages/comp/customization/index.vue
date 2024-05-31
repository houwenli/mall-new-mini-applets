<template>
  <div :style="[getPageStyle]" class="page-box">
    <div v-for="(element, index) in contentList" :key="element.id" class="list-group">
      <div v-if="index <= renderIndex || renderIndex === -1" class="list-group-item">
        <template v-if="element.text === '轮播图'">
          <swipe :config="element"></swipe>
        </template>

        <template v-else-if="element.text === '半屏双列图'">
          <double-column :config="element" />
        </template>

        <!-- 1-4列图 -->
        <template v-else-if="showGroupImageComponent(element)">
          <groupImage :config="element" showComTitle></groupImage>
        </template>

        <template v-else-if="element.text === '滑动区块'">
          <slideModule :config="element" />
        </template>
        <template v-else-if="element.text === '图片魔方'">
          <cubeImage :config="element" />
        </template>
        <template v-else-if="element.text === '公告'">
          <notice-bar :config="element"></notice-bar>
        </template>
        <template v-else-if="element.text === '辅助空白'">
          <blank :listData="element"></blank>
        </template>
        <template v-else-if="['单列商品', '双列商品', '三列商品'].includes(element.text)">
          <singleListProducts :listData="element" :index="index" :reachBottom="reachBottom" :config="element"
            :goodsParticipateNum="goodsParticipateNum" :renderProductNum.sync="renderProductNum" @finished="onFinished"
            :rankingId="rankingId"></singleListProducts>
        </template>
      </div>
    </div>
    
    <!-- 浮动按钮 -->
    <view class="floatBox" v-if="floatBtnData.showConfig && showConfig">
      <view class="floatBtn">
        <image
          :src="floatBoxIcon"
          mode=""
          class="iconbox"
          @click="showConfig = false"
        ></image>
        <image
          :src="floatBtnData.url || 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/dae7a941e28fc339bd5991257778a99c.png'"
          mode=""
          style="width: 120rpx; height: 120rpx"
          @click="floatBtnFun(floatBtnData.link)"
        ></image>
      </view>
    </view>

  </div>
</template>
<script>

// 轮播图
import swipe from '@/pages/index/components/swipe/index.vue';

// 1-4列图
import groupImage from '@/pages/index/components/groupImage/index.vue';

// 滑动区块
import slideModule from "@/pages/index/components/slide-module"
// 魔方组件
import cubeImage from '@/pages/index/components/cube-image/index.vue';
// 半屏双列图
import doubleColumn from '@/pages/index/components/double-column/index.vue';
// 公告
import noticeBar from '@/pages/index/components/noticeBar/index.vue'
import singleListProducts from './components/listProducts/index.vue'
// 浮动按钮
import wsfFloatBox from "@/components/homePageConfig/wsf-float-box/index.vue";

import { goPage } from '@/pages/index/helper/index.js'
export default {
  props: {
    config: {
      type: Object,
      default: () => { },
    },
    reachBottom: {
      type: Boolean,
      default: false
    },
    rankingId: {
      type: Number,
      default: null
    },
    moduleData: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  components: {
    singleListProducts,

    swipe,
    groupImage,
    cubeImage,
    noticeBar,
    doubleColumn,
    slideModule,
    wsfFloatBox
  },

  data() {
    return {
      finishedList: [],
      renderIndex: -1,
      renderProductNum: 0,
      showConfig: true,
      floatBoxIcon: require('@/static/img/icon/float-box-close.png')
    }
  },

  computed: {
    goodsParticipateNum() {
      console.log(this.moduleData)
      let data = this.moduleData || {}
      return data.goodsParticipateNum
    },
    contentList({ config }) {
      return config.contentList
    },

    /**
     * 获取页面的背景图片配置
     */
    getPageStyle({ config }) {
      let { headerData } = config,
        { pageNavBg } = headerData,
        { backgroundType, bgImage = '', bgColor } = pageNavBg
      if (String(backgroundType) === '1') {
        // 默认为图片， 但是没传背景图的话，就设置为白色
        if (bgImage === '') {
          return { background: '#fff' }
        }

        return {
          backgroundImage: `url(${bgImage})`,
        }
      }

      if (String(backgroundType) === '0') {
        return {
          background: bgColor,
        }
      }

      return {}
    },

    floatBtnData({ config }) {
      return config.floatBtnData || {}
    }
  },

  created() {
    this.config.contentList.forEach((item, index) => {
      // 记录下拉加载索引位置
      if (['单列商品', '双列商品', '三列商品'].includes(item.text)) {
        this.finishedList.push(index)
      }
    })
    this.renderIndex = this.finishedList.length > 0 ? this.finishedList[0] : -1
  },

  methods: {
    showGroupImageComponent(item) {
      return ['单列图', '双列图', '三列图', '四列图'].includes(item.text)
    },

    onFinished() {
      this.finishedList.shift()
      this.renderIndex = this.finishedList.length > 0 ? this.finishedList[0] : -1
    },

    floatBtnFun(link) {
      if (!link) {
        return
      }
      goPage(link);
    },
  },
}
</script>
<style lang="less" scoped>
.header-container {
  position: fixed;
  top: 0;
  width: 100%;
  height: 44px;
  padding-left: 12px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  z-index: 10;

  .config-icon {
    margin-right: 8px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .header-title {
    flex: 1;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #000;
    font-size: 18px;
  }

  .placeholder {
    width: 40px;
  }
}

.page-box {
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
  background: #f6f6f6;
  background-repeat: no-repeat;
  background-size: 100% auto;
}

.list-group-item {
  padding-bottom: 10px;
  width: 100vw;
  overflow: hidden;
}

.list-group:first-of-type .list-group-item {
  padding-top: 10px;
}

/deep/ .shop-card {
  margin-top: 10px;
  margin-bottom: 0 !important;

  &:first-child {
    margin-top: 0;
  }
}
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
