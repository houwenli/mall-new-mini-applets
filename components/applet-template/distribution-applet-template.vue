<template>
  <view data-desc='分销首页配置模版' class="applet-template-wrap">
    <view >
      <!-- 模板改为组件 -->
      <view class="list-group-item" v-for="floor in floors" :key="floor.id">
        <template v-if="floor.text == '金刚区'">
          <page-nav :config="floor"></page-nav>
        </template>

        <!-- 轮播图组件 -->
        <template v-if="floor.text == '轮播图'">
          <swipe :config="floor"></swipe>
        </template>
         <!-- 半屏双列图 -->
        <template v-if="floor.text == '半屏双列图'">
          <doubleColumn :config="floor"></doubleColumn>
        </template>
        <!-- 1-4列图 -->
        <template v-if="['单列图','双列图','三列图','四列图'].includes(floor.text)">
          <groupImage :config="floor"></groupImage>
		  	</template>

        <!-- 滑块区块 -->
		  	<template v-if="floor.text == '滑动区块'">
          <slideModule :config='floor'></slideModule>
		  	</template>
		  	<!-- 图片魔方 -->
		  	<template v-if="floor.text == '图片魔方'">
          <cubeImage :config='floor'></cubeImage>
		  	</template>
        <!-- TODO: -->
        <!-- 限时秒杀暂时不处理-->
        <template v-if="floor.text == '秒杀'">
          <wsf-seckill :key="floor.id" :listData="floor.list" :seckillData="seckillData" :timestamp="timestamp"></wsf-seckill>
        </template>
		  	<!-- 公告** -->
		  	<template v-if="floor.text == '公告'">
          <noticeBar :config='floor'></noticeBar>
		  	</template>
        <!-- 分销专区 -->
        <!-- TODO:暂时不处理 -->
        <template v-if="floor.text == '分销'">
          <wsf-distribution :key="floor.id" :listData="floor.list" :hasPower="hasPower"></wsf-distribution>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
import wsfSeckill from '../homePageConfig/wsf-seckill'
import wsfDistribution from '../homePageConfig/wsf-distribution'

// 轮播图
import swipe from '@/pages/index/components/swipe/index.vue';
// 金刚区
import PageNav from '@/pages/index/components/page-nav/index.vue';
// 1-4列图
import groupImage from '@/pages/index/components/groupImage/index.vue';

// 滑动区块
import slideModule from  "@/pages/index/components/slide-module"
// 魔方组件
import cubeImage from '@/pages/index/components/cube-image/index.vue';
// 半屏双列图
import doubleColumn from '@/pages/index/components/double-column/index.vue';
// 公告
import noticeBar from '@/pages/index/components/noticeBar/index.vue'

export default {
  components: {
    // 首页-金刚区
    PageNav,
    swipe,
    groupImage,
    cubeImage,

    wsfSeckill,
    wsfDistribution,
    noticeBar,

    doubleColumn,
    slideModule
  },
  props: {
    floors: {
      type: Array,
    },
    hasPower: {
      type: Boolean,
      default: false,
    },
    seckillData: {
      type: Array,
      required: [],
    },
    timestamp: {
      type: Object,
      required: { secen: "", label: "", seconds: 86400 },
    }
  }
};
</script>

<style lang="scss" scoped>
.applet-template-wrap {
  position: relative;
  &::after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-image: var(--bgi);
    opacity: var(--opacity);
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position-y: 166rpx;
    z-index: -99;
  }
	.u-indicator-item-round-active{
		background-color:'#E60113' !important;
	}
}
::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  color: transparent;
}

.list-group-item {
  padding-top: 20rpx;
}
</style>
