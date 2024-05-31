<template>
  <view data-desc='智慧生活首页配置模版' class="applet-template-wrap"    :style="{ marginBottom: tabbarHeight + 12 + 'px',
    background: headerData.pageNavBg.backgroundType == '1' ? 
        `url(${headerData.pageNavBg.bgImage}) no-repeat` : headerData.pageNavBg.bgColor, backgroundSize: '100% auto' }">
    <view>
      <!-- 模板改为组件 -->
      <view class="list-group-item" v-for="floor in floorsList" :key="floor.id">
        <!-- <template v-if="floor.text == '热区广告'">
          <hotImage :config="floor"></hotImage>
        </template> -->
   
        <template v-if="floor.text == '左右滑动'">
          <leftRight :config="floor"></leftRight>
        </template>

        <template v-if="floor.text == '上下自增'">
          <downup :config="floor"></downup>
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
      
		  	<!-- 公告** -->
		  	<template v-if="floor.text == '公告'">
          <noticeBar :config='floor'></noticeBar>
		  	</template>
       
      </view>
    </view>
  </view>
</template>

<script>

// 热区广告
// import hotImage from '../hotImage/index.vue';
// 轮播图
import swipe from '../swipe/index.vue';
// 1-4列图
import groupImage from '../groupImage/index.vue';
// 滑动区块
import slideModule from  "../slide-module"
// 魔方组件
import cubeImage from '../cube-image/index.vue';
// 半屏双列图
import doubleColumn from '../double-column/index.vue';
// 公告
import noticeBar from '../noticeBar/index.vue'
// 上下自增
import downup from '../down-up/index.vue';
// 左右滑动
import leftRight from '../left-right/index.vue';

export default {
  components: { 
    // hotImage,  
    swipe,
    groupImage,
    cubeImage,  
    noticeBar,
    doubleColumn,
    slideModule,
    downup,
    leftRight    
  },
  props: {    
    tabbarHeight: {
      type: Number,
      default: 0
    },
    floorsList: {
      type: Array,
      default: []
    },
    headerData: {
      type: Object,
      default: {}
    },
  },
  data() {
		return {				
            
		}
	},  
 
  methods: {     
  }
};
</script>

<style lang="scss" scoped>
.applet-template-wrap {
  position: relative;
  margin: 0 0 120rpx;
  padding-top: 4px;
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
  margin-bottom: 16rpx;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
