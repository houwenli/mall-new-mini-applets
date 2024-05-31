<template>
  <view class="page" @click="handleClick">
    <view class="scroll-content">
      <view
        data-desc="头部占位符"
        :style="{ height: navPlaceHolder + 'px' }"
      ></view>
      <wsf-nav-bar
        :fixed="true"
        :status-bar="true"
        :shadow="false"
        color="#red"
        bgSize="100% auto"
        bgPosition="bottom center"
        :bgimg="headerData.headerBg.backgroundType == '1' ? headerData.headerBg.bgImage : ''"
        :bgColor="headerData.headerBg.backgroundType == '0' ? headerData.headerBg.bgColor : ''"
      >
        <view slot="searchBar" class="header-advertising">
          <!-- <image style="height: 100%; width: 220rpx" :src="headerData.smallAdList[0].url"></image> -->
         
          <swiper class="header-advertising-swiper" :autoplay="isAutoPlay" :interval="3000" :circular="true" :duration="1000" :vertical="true" :disable-touch="true" 
            v-if="headerData.smallAdList && headerData.smallAdList.length && headerData.smallAdList.some(item=>{ return item.url })">
            <view v-for="(item,index) in headerData.smallAdList" :key='index'>
              <swiper-item :key="index" @tap="goPage(item)">
                <image :src="item.url" />
              </swiper-item>
            </view>
          </swiper>
        
          <view class="header-advertising-position" @click="goToPositon">
            <text>{{ homePosition }}</text>           
            <image class="header-advertising-position-down" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_home_down.png" alt=""/>         
          </view>
        </view>
        <view slot="additional">
          <view class="search-container">
            <view class="search-input-box">
              <view class="search-input-icon" @tap="goSearchPage()"></view>
              <input class="search-input" type="text" disabled="true" @tap="goSearchPage()" />
              <view class="search-button" @tap="handleSearch()">搜索</view>
              <view class="swiper-word-box" v-if="hotWordList && hotWordList.length">
                <swiper class="swiper-word" :vertical="true" :autoplay="isAutoPlay" :circular="true"  :duration="1000" interval="3000" :disable-touch="true" :current="hotWordCurrent" @change="changeHotWord">
                  <block v-for="(item,index) in hotWordList" :key="index">
                      <swiper-item class="item" :class="{'fade-out-item': lastHotWordCurrent == index, 'fade-in-item': hotWordCurrent == index}" @tap="goSearchPage()">
                        {{item.name}}
                      </swiper-item>
                  </block>
                </swiper>
              </view>
              <view v-else class="default-placeholder" @tap="goSearchPage()">请输入搜索关键字</view>
            </view>
          </view>
        </view>
      </wsf-nav-bar>
      <view class="showfixedtop transition-flex" v-if="noNetworkMark" :style="queImgHeight">
        <image :src="noNetwork" />
        <text>暂无网络</text>
      </view>
      
      <view :style="{ paddingBottom: tabbarHeight + 'px'}" class="showfixedtop" v-else>
        <smartComp :floorsList="floorsList" v-if="floorsList && floorsList.length" :headerData="headerData" class="smart-comp"></smartComp>
        <!-- 为您推荐列表模块 -->
        <view class="applet-template-recommend" id="recommend" v-if=" ['waterfall', 'column'].includes(showStyle)"> 
          <!-- <view class="header">
            <image
              style="height: 32rpx; width: 498rpx"
              src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_hot_goods.png"
              mode="heightFix"
            ></image>
          </view>               -->
          <wsf-smart-goods-list
            v-if="flowList && flowList.length > 0"
            :list="flowList"
            :loadStatus="loadStatus"
            loadMoreBgColor="#f8f8f8"
            @goodsClick="goodsClick($event)"
            :showStyle="showStyle"          
          ></wsf-smart-goods-list>
        </view>       
      </view>

     
      <!-- 底部导航栏 -->
      <smartTabBar
        :selected="0"
        :isGrayscale="isGrayscale"
        @change="onChangeTab"  
        @tabBarInfo="tabBarInfo"
        @backTop="backTop"
        @scrollToTop="scrollToTop"
        @anchorEl="anchorEl"
        :scrollTop="scrollTop"
        :presetTop="100"
      ></smartTabBar>
    </view>

    <!-- 浮动按钮 -->
    <template v-if="floatBtnData.text == '浮动按钮'">
      <smart-float-box :floatBtnData="floatBtnData"></smart-float-box>
    </template>

    <!-- 回到顶部 -->
    <u-back-top
      :scroll-top="scrollTop"
      :icon-style="iconStyle"
      top="5000"
      :bottom="200"
      ><image
        src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/top%402x.png"
        style="width: 80rpx; height: 80rpx"
      ></image
    ></u-back-top>
  </view>
</template>

<script>
import smartTabBar from "@/components/smart/smart-tab-bar/smart-tab-bar";
import wsfNavBar from "@/components/wsf-nav-bar/wsf-nav-bar.vue";
import { qqMap } from "@/common/config.js";
import smartComp from "./smartComp/template/index.vue";

import wsfSmartGoodsList from "@/components/wsf-smart-goods-list/wsf-smart-goods-list.vue";
import { priceFilter } from "@/common/wsfFilter.js";
import { floors } from './smartComp/template/smart.js'
import { GetHomeTemplate, GetHometemList } from "@/common/smart-api/homeApi";
// 浮动弹窗
import smartFloatBox from "./smartComp/smart-float-box/index.vue";
// import { smartLifeList } from './smartIndex.js'

export default {
  components: {
    smartTabBar,
    smartComp,
    wsfNavBar,   
    wsfSmartGoodsList,
    smartFloatBox
  },
  data() {
    return {
      isGrayscale: "",
      customSrc: "https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_home_title.png",
      homePosition: "", // 选择的城市
      hotWordList: [],
      isAutoPlay: false, //是否自动轮播
      hotWordCurrent: 0,
      lastHotWordCurrent: -1,
      tabbarHeight: 0,
      flowList: [], // 瀑布流商品列表
      // loadStatus: "nomore", // 加载更多样式效果
      loadStatus: "loadmore", // 加载更多样式效果
      isLoading: false, // 是否正在加载
      hasMore: true, // 是否拥有更多
      queryForm: {
        // 页码页容量
        currentPage: 1,
        pageSize: 10,
      },
      priceFilter,
      showStyle: 'waterfall',
      contentList: [],
      floors,
      // smartLifeList,
      floorsList: [], // 首页模板列表
      pageAssembly: {
        1: '页眉', 2 : '轮播图',  3: '双列图', 4: '三列图', 5: '半屏双列图',
        6: '滑动区块', 7: '四列图', 8: '浮动按钮', 9 :'图片魔方', 10: '公告',
        11: '单列图', 12: '热区广告', 13: '单列商品', 14: '双列商品', 15: '左右滑动',
        16: '上下自增', 17: '底部导航'
      },  
      headerData: {},
      scrollTop: 0,
      floatBtnData: [], // 浮动按钮  
      goodsType: '', // 底部推荐列表是单列还是多列

      // 热销商品距离顶部距离，用于定位
      recommendScrollTop: 0,
      noNetwork: `${this.$smartImg}/comm/blank_network.png`, //暂无网络
      noNetworkMark: false
    };
  },
  mounted(){
    this.queryIndexTemplate()

    // 获取位置信息
    this.getLocation();
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
   
  },
  onLoad: function (option) {
    setTimeout(() => {
      // this.GetRecommendList();
      this.isGrayscale = getApp().globalData.isGrayscale;
    }, 200);
  },
  onShow: function () {
    this.isAutoPlay = true
    // this.getHotWordList()
    if (uni.getStorageSync("life-position")) {
      this.homePosition = uni.getStorageSync("life-position");
    } 
  },
  onHide() {   
    this.isAutoPlay = false   
  },
  onReady() {
    // 动态修改状态栏的颜色
    uni.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ff0000'
    })
  },
  computed: {
    queImgHeight(){
      return `height: calc(100vh - ${this.tabbarHeight + 44+ 48 + 'px'})`
    },
    navPlaceHolder() {      
      return getApp().globalData.statusBarHeight + 44+ 48;
    }   
    
  },
  onPullDownRefresh() {     
    this.queryIndexTemplate();
    setTimeout(()=>{				
      uni.stopPullDownRefresh();//关闭刷新状态
    },1000);	
  },
  onReachBottom() {
    // this.queryIndexTemplate();
    this.GetRecommendList();
  },
  methods: {
    handleClick(){
      // 点击智慧生活首页，存储该字段，进入电商首页有返回按钮
      uni.setStorageSync("wsf_smart_life_tab", "life");
    },
    handleData(data){     
      this.floorsList = data && data.length ? data.map(item=>{                   
        return {...item.context, text: this.pageAssembly[item.pageAssemblyId], pageAssemblyId: item.pageAssemblyId }             
      }) : []           
      // 遍历出13-单列商品， 14-多列商品类型，只存在一个
      let list = this.floorsList.filter(item=>{
        return [13, 14].includes(item.pageAssemblyId)
      })      
      this.goodsType = list && list.length ? list[0]['pageAssemblyId'] : ''           
      // this.flowList = list && list.length > 0 ? list[0].list || [] : []
      this.GetRecommendList();
      this.showStyle = {
        '14': 'waterfall', // 双列
        '13': 'column' // 单列
      }[this.goodsType]    
    },  
    /* 获取模板数据 */
    queryIndexTemplate() {        
      GetHomeTemplate().then((res) => {
        let contentList = res.data?.list || [];
        // let contentList = smartLifeList       
        if (res.code === 200) {      
          let data = contentList
          this.headerData = res.data?.headerData || [];
          this.floatBtnData = res.data?.floatBtnData || []
          this.noNetworkMark = false
          this.handleData(data)                    
        } else {
          this.noNetworkMark = true
        }
      }).catch(err=>{       
        uni.showToast({
          title: err.data.msg,  
          icon: 'none',                 
          duration: 2000
        })
        this.noNetworkMark = true        
      })
    },

    getElementScollTop(selector) {
      return new Promise((resolve, reject) => {
        const query = uni.createSelectorQuery()
        query
          .select(selector)
          .boundingClientRect((data) => {
            let top = data && data.top
            resolve(Math.round(top || 0))
          })
          .exec()
      })
      
    },
    /* 获取推荐的商品列表 */
    GetRecommendList() {
      if (this.isLoading || !this.hasMore) return;
      this.isLoading = true;
      this.loadStatus = "loading";
     
      // this.queryForm.pageType = 1
      this.queryForm.pageModelId = this.goodsType
      GetHometemList(this.queryForm).then((res) => {
        this.isLoading = false;
        this.loadStatus = "loadmore";      
        if (res.code === 200) {     
          if(res.data && res.data.length) {
            res.data.map((item, index) => {
              item = JSON.parse(JSON.stringify(item));
              item.price = this.priceFilter(item.price);
              this.flowList.push(item);
              return item;
            });
          }
          console.log(this.flowList,'this.flowList');
          this.queryForm.currentPage++;
          this.hasMore = this.queryForm.currentPage <= res.pages;
          this.loadStatus = this.queryForm.currentPage <= res.pages ? "loadmore" : "nomore";

          // 获取热销商品位置，只需要计算一次
          if (this.queryForm.currentPage == 2) {
            this.$nextTick(async () => {
              this.recommendScrollTop = await this.getElementScollTop('#recommend')
            })
          }
          
        }
      });
    },
    //插入热销榜单和热销广告模块
    settleRecommend(list) { 
      let hotArr = this.hotRecommendList
      let location
      for(let i in hotArr) {
        if(hotArr[i].relatedType == 1) {
          location = hotArr[i].hotAdvertSet.location - 1
        } else if(hotArr[i].relatedType == 2) {
          location = hotArr[i].listSaleSet.location - 1
        }
        if(location > list.length - 1 || (list[location].relatedId && list[location].id && list[location].relatedId == hotArr[i].relatedId && list[location].id == hotArr[i].id)) continue
        list.splice(location,0,hotArr[i])
      }
      return list
    },
    // 商品跳转
    goodsClick(e) {
      // console.log("e", e);
      let skuId = e.id || e.skuId
      // this.$smart.go("SkuDetail", { skuId });
      if(e.goodsSource == 4){
				this.$smart.go('ToMotor',{skuId});
			} else {
				this.$smart.go('SkuDetail', { skuId });
			}
    },
    tabBarInfo(e){
      this.tabbarHeight = e.tabbarHeight  
    },    
    goPage(data) {     
      this.$smart.go(data.miniAppLink || data.h5Link);
    },
    /* 跳转 */
    navigationTo(sceneName, params) {     
      this.$smart.go(sceneName, params);
    },
    //获取热词
    async getHotWordList() {
      let list = []
      let records = uni.getStorageSync('smartSearchRecords')
      if(records) {
        list = JSON.parse(records).split(",").map(item => ({name: item}))
      }    
      await this.$u.api.QueryKeyword().then(res => {
        if(res.data && res.data.length) {
          list = list.concat(res.data)
        }
      })
      this.hotWordList = list
    },
    changeHotWord(e) {
      this.lastHotWordCurrent = this.hotWordCurrent
      this.hotWordCurrent = e.detail.current
    },
    //首页热词搜索
    handleSearch() {
      this.$bus.$emit("handleCatePopup", false)
      if(this.hotWordList && this.hotWordList.length) {
        let name = this.hotWordList[this.hotWordCurrent].name
        if(['话费', '充值'].includes(name)){
          this.$smart.go("phoneCharge", { queryString: name }, "redirectTo");
        } else {          
          // this.$smart.go("smartSpuList",{ queryString: name });
          this.$smart.go('smartSearch')
        }
      } else {            
        // this.navigationTo("smartSpuList") 
        this.$smart.go('smartSearch')         
      }
    },
    goSearchPage() {    
      if(this.hotWordList && this.hotWordList.length) {
        this.navigationTo('smartSearch', {searchValue: this.hotWordList[this.hotWordCurrent].name})
      } else {
        this.navigationTo('smartSearch')
      }
    },
    /**
     * 交互场景： 已经在首页-再次点击首页tab，回到顶部，然后一级分类变成首页
     */
    onChangeTab() {
      uni.setStorageSync("wsf_smart_life_tab", "life");
      // 将滚动条回到顶部
      uni.pageScrollTo({
        scrollTop: 0,
        duration: this.duration,
      });
    },
    scrollToTop() {
      // 将滚动条回到顶部
      uni.pageScrollTo({
        scrollTop: 0,
        duration: this.duration,
      });
    },
    anchorEl() {
      uni.pageScrollTo({
        scrollTop: this.recommendScrollTop - this.navPlaceHolder,
        duration: this.duration,
      });
    },
    goToPositon() {
      this.$smart.go("smartPositon");
    },
    getLocation() {
      let that = this;
      uni.getSystemInfo({
        success({ locationEnabled, locationAuthorized }) {
          // locationEnabled 判断手机定位服务是否开启
          // locationAuthorized 判断定位服务是否允许微信授权
          if (!locationEnabled && !locationAuthorized) {
            // GPS未开启 与 GPS未给微信授权定位服务
            uni.showModal({
              title: "需要获取地理位置",
              content: "请检查是否开启微信授权",
              showCancel: false,
            });
          } else if (locationEnabled && !locationAuthorized) {
            // GPS已开启 与 GPS未给微信授权定位服务
            uni.showModal({
              title: "需要获取地理位置",
              content: "请检查是否开启微信授权",
              showCancel: false,
            });
          } else if (locationEnabled && locationAuthorized) {
            /*
              GPS已开启 与 GPS已给微信授权定位服务
              判断微信小程序位置信息是否开启
            */
            // 微信小程序位置信息已开启
            uni.getFuzzyLocation({
              type: "wgs84",
              success({ latitude, longitude }) {
                qqMap.reverseGeocoder({
                  location: {
                    latitude,
                    longitude,
                  },
                  success: function (result) {
                    // ad_info = {
                    // 	adcode: "420111",
                    // 	city: "武汉市",
                    // 	city_code: "156420100",
                    // 	district: "洪山区",
                    // 	location: {
                    // 		lat: 30.500642,
                    // 		lng: 114.342664
                    // 	},

                    // 	name: "中国,湖北省,武汉市,洪山区",
                    // 	nation: "中国",
                    // 	nation_code: "156",
                    // 	phone_area_code: "027",
                    // 	province: "湖北省",
                    // }
                    that.homePosition = result.result.ad_info.city;
                  },
                  fail: function (error) {
                    console.error(error, "error");
                    that.homePosition = null;
                  },
                });
              },
              fail() {
                // 微信小程序位置信息未开启
                uni.getSetting({
                  success: (res) => {
                    let authStatus = res.authSetting["scope.userLocation"];
                    if (!authStatus) {
                      uni.showModal({
                        title: "需要获取地理位置",
                        content:
                          "需要获取您的位置信息，请在设置界面打开相关权限",
                        showCancel: false,
                      });
                    } else {
                      uni.showModal({
                        title: "获取位置信息失败",
                        content: "无法获取位置信息",
                        showCancel: false,
                      });
                    }
                  },
                });
              },
            });
          }
        },
        fail(err) {
          let reg = /request:fail/;
          if (reg.test(err.errMsg)) {
            // 无网络
            reject("noNetWork");
          } else {
            // 请求超时'
            reject("requestTimeOut");
          }
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.header-advertising {
  display: flex;
  align-items: center;
  position: absolute;
  left: 24rpx;
  top: 0;
  height: 100%;
  width: 100%;
  &-position {
    margin-left: 12rpx;
    font-size: 26rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #111111;
    line-height: 24rpx;
    display: flex;
    align-items: center;
    margin-top: 24rpx;
    &-down {
      width: 10rpx;
      height: 8rpx;
    }
  }
  .header-advertising-swiper {
    width: 220rpx;
    height: 100%;
    image {
      width: 100%;
      height: 100%;
    }
  }
}
.search-container {
  width: 100%;
  height: 40px;
  margin: 4px 0;
  padding: 0 16rpx;
  display: flex;
  align-items: center;
  .search-input-box {
    width: 100%;
    height: 40px;     
    display: inline-flex;
    align-items: center;
    position: relative;
    background: #FFFFFF;
    border-radius: 24rpx;
    border: 1rpx solid #fe3040;
    .search-input-icon {
      margin: 0 16rpx 0 24rpx;
      width: 32rpx;
      height: 32rpx;
      background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_home_search.png')
        no-repeat center center;
      background-size: 32rpx 32rpx;
    }
    .search-input {
      width: 428rpx;
      height: 36px;
      border: 0;
      background: 0;
      color: #999999;
      font-size: 24rpx;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 36px;
    }
    .search-button {
      position: absolute;
      right: 6rpx;
      top: 50%;
      transform: translateY(-50%);
      width: 124rpx;
      height: 64rpx;
      background: $wsf-linear-bg;
      border-radius: 20rpx;
      line-height: 64rpx;
      text-align: center;
      font-size: 28rpx;
      color: #FFFFFF;
    }
    .swiper-word-box {
       position: absolute;
        left: 80rpx;
        top: 0;
        height: 72rpx;
        width: 410rpx;
        display: flex;
        align-items: center;
      .swiper-word {
        width: 100%;
        height: 40rpx;
        .item {
          width: 100%;
          height: 40rpx;
          color: #6e6e6e;
          line-height: 40rpx;
          font-size: 28rpx;
          display: block;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }
        .fade-in-item {
          animation: fadeIn 0.5s linear;
        }
        .fade-out-item {
          animation: fadeOut 0.5s linear;
        }
        @keyframes fadeIn {
        	from {
        		opacity: 0
        	}

        	to {
        		opacity: 1
        	}
        }
        @keyframes fadeOut {
        	from {
        		opacity: 1
        	}

        	to {
        		opacity: 0
        	}
        }
      }
    }

    .default-placeholder {
      position: absolute;
      left: 80rpx;
      top: 0;
      height: 72rpx;
      width: 250rpx;
      line-height: 72rpx;
      font-size: 28rpx;
      color: #C6C6C6;
    }
  }
  .message {
    width: 48rpx;
    height: 48rpx;
    z-index: 99;
    margin-left: 24rpx;
    .message-icon {
      width: 100%;
      height: 100%;
    }
  }
}
.applet-template-recommend{
  padding: 0 16rpx !important; 
  .header {
    padding: 20rpx 0;
    display: flex;
    justify-content: center;
  } 
}
.showfixedtop{
  // padding-top: 24rpx;
  overflow-x: hidden;
}
/deep/.u-load-more-wrap {
  background: transparent !important;
}
/deep/.u-more-text {
  background: transparent !important;
}
.transition-flex { 
  padding-top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  image{
    width: 320rpx;
    height: 320rpx;
  }
  text {
    margin-top: 4rpx;
    font-size: 10px;
    font-weight: 400;
    color: #90969e;
    line-height: 14px;
  }
}
// .smart-comp{
//   padding: 0 16rpx;
// }
</style>
