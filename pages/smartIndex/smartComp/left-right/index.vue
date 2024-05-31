<template>

  <view class="wrap cate-wrap" data-desc='左右滑动'>
    <view class="applet-template-nav" :style="[navBackgroundStyle]" v-if="navList && navList.length > 0">             
      <view class="scroll-style">
       
          <view :class="['index-nav-wrap', config.style==1 ? 'index-nav-wrap-1': 'index-nav-wrap-2']" v-for="(item, index) in navList" :key="index">        
            <view :class="['flex-style']"   @click="toRouter(item)">
              <view class="index-nav-img flex-style"  v-if="item.url" > 
                <image
                  style="width:100%;height:100%"         
                  :src="`${item.url}?imageView2/1/w/138`"                                  
                ></image>
              </view>
              <view class="index-nav-img flex-style bg-gray" v-else>      
                <image class="pic-que"  src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/component-no-pic-default.png" />
              </view>
            </view>
            <text class="index-nav-txt">
              {{ item.text }}
            </text>
          </view>                      
       			
      </view>
    </view>
  </view>   

</template>

<script>

// 首页-金刚区
export default {
  name: 'LeftRight',
  props: {
    config: {
      type: Object,
      default: () => {}
    },  
  },
  data() {  
    return { 			   
      navList: []                     
    };
  },
  computed: {          
		navBackgroundStyle() {
			let background = this.config.backgroundType == '1' && this.config.bgImage ? `url(${this.config.bgImage}) no-repeat` : this.config.backgroundType == '0' && this.config.bgColor ? this.config.bgColor : '#fff'
			return {
				background,
			}
		},
  },

  created() {        
    this.navList = this.config.list
  },

  methods: {   
    // 路由跳转
    toRouter(params) {          
      this.$smart.go(params.miniAppLink || params.h5Link);    
    },
  
  },
};
</script>

<style scoped lang="scss">
.wrap{
  margin: 0 16rpx;  
}
.scroll-style{
  // height: 198rpx;
  width: 686rpx;
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  .index-nav-wrap { 
    // height: 166rpx;      
    text-align: center;
    flex-shrink: 0;
    .index-nav-img {        
      width: 124rpx;
      height: 124rpx;
      .pic-que{           
        width: 46rpx;
        height: 24rpx;
      }
      image{
        border-radius: 24rpx;
      }
    }        
    .index-nav-txt {
      margin-top: 8rpx;
      height: 34rpx;
      font-size: 26rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #191919;
      line-height: 34rpx;
      text-overflow: ellipsis;
      overflow: hidden;     
    }
      
  }
  .index-nav-wrap-1{
    width: 20%;
  }
  .index-nav-wrap-2{
    width: 25%;
  }
  
}

::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
  color: transparent !important;
  display: none;
}

.applet-template-nav {
  padding: 16rpx;  
  border-radius: 25rpx;
  background-size: 100% 100%;
  background-position: top center;
  
}
 


</style>
