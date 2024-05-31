<template>
  <view class="safe-area-inset-bottom wrapperBox">
    <wsf-nav-bar
      :fixed="true"
      :status-bar="true"
      :shadow="false"
      color="#red"
      bgSize="100% auto"
      :bgimg="headerData.headerBg.backgroundType == '1' ? headerData.headerBg.bgImage : ''"
      :bgColor="headerData.headerBg.backgroundType == '0' ? headerData.headerBg.bgColor : ''"
    >
      <!-- :bgColor="bgColor" -->
      <!-- :bgimg="
        headerData.bg_header.url
          ? `url(${headerData.bg_header.url}) no-repeat`
          : ''
      " -->
      <!-- <view slot="custom-title" class="nav-search-bar-img">                
        <image
          style="height: 36rpx; width: 98rpx"
          src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/wsf_icon_white.png"
        ></image>
      </view> -->
      <!-- <view v-else slot="searchBar">
        <view class="nav-search-bar-wrap">
          <view class="nav-search-bar" @click="navigationTo('Search')">
            <view class="nav-search-form-icon"></view>
            <view class="nav-search-form-value">请输入搜索关键字</view>
          </view>
        </view>
      </view> -->
      <view slot="searchBar" class="header-advertising-image" @click="goBack">
        <image
          class="img"
          :src="smartMallBack"
        ></image>
        <image
          class="img"
          :src="smartTitleIcon"
        ></image>
      </view>
      <!-- <view slot="searchBar" class="header-advertising">
        
        <swiper class="header-advertising-swiper" :autoplay="isAutoPlay" :interval="3000" :circular="true" :duration="1000" :vertical="true" :disable-touch="true" v-if="headerData.smallAdList && headerData.smallAdList.length">
          <block v-for="(item,index) in headerData.smallAdList" :key='index'>
            <swiper-item :key="index" @tap="navigationTo(item.link)">
              <image :src="item.url" />
            </swiper-item>
          </block>
        </swiper>
      </view> -->
      <view slot="additional">
          <view class="search-container">
            <view class="search-input-box">
              <view class="search-input-icon" @tap="goSearchPage()"></view>
              <input
                class="search-input"
                type="text"
                disabled="true"
                @tap="goSearchPage()" />
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
            <view
                class="message"
                @click="navigationTo('Message')"
              >
                <image
                  class="message-icon"
                  :src="
                    headerData.iconMassageUrl
                      ? headerData.iconMassageUrl
                      : 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com///5416eb3222d73b6e6dfb5bcd0d77c9d5.png'
                  "
                ></image>
                <u-badge
                  v-if="messageCount > 0"
                  size="mini"
                  :is-dot="true"
                  :offset="[4, 4]"
                  type="error"
                  count="7"
                ></u-badge>
              </view>
        </view>
      </view>
    </wsf-nav-bar>

    <!-- 底部导航栏 -->
    <wsfTabBar :selected="0" :isGrayscale="isGrayscale" @change='onChangeTab'></wsfTabBar>


    <view :class="{'grayscale-gray': isGrayscale, 'fixed-mask': fixedMaskFlag}">
      <!-- opacity: headerData.bg_header.opacity, -->
      <!-- <view
        class="mainBox"
        :style="{
          background: `url(${headerData.bg_main.url}) no-repeat left 128rpx`,
          'background-size': '100%',
        }"
      >
      </view> -->
      <!-- <image :style="{position: 'absolute', top:safePaddingHeight+'px',left: 0}" class="mainBox" :src="headerData.bg_main.url"></image> -->

      <!-- main内容区 -->
      <view class="showfixedtop" :style="{background: headerData.pageNavBg.backgroundType == '1' ? `url(${headerData.pageNavBg.bgImage}) no-repeat` : headerData.pageNavBg.bgColor, backgroundSize: '100% auto'}">
        <!-- 滚动头部搜索栏变化 -->
        <!-- :bgOpacity="headerData.bg_header.opacity" -->

        <!-- <view class="top-wrap">
          <view class="header-home-wrapper">
            <swiper
              :autoplay="topSwiperAutoplay"
              :circular="true"
              interval="10000"
              :current="currentSwiper"
              @change="getSwiperCurrent"
              @click="clickSwiperCurrent(headerData.slideshowImageList[currentSwiper].link)"
            >
              <swiper-item v-for="(item,index) in headerData.slideshowImageList" :key="index">
                <image style="height: 290rpx;width: 100%" :src="item.url" />
              </swiper-item>
            </swiper>
          </view>
        </view> -->

        <!-- 占位符 高度是等于顶部背景++搜索区域 -->
        <view data-desc='头部占位符' :style="{height: navPlaceHolder + 'rpx'}"></view>

        <!-- 一级分类
          从其他的tab切换到首页-就重置一下一级分类的高亮等
         -->
        <FirstCategory @onUpdateFirstLevel='onUpdateFirstLevel' :firstCateId='firstCateId'></FirstCategory>

        <!-- 切换到一级分类的兜底颜色 -->
        <view :class="firstCateId ? 'content-gray-bg': ''">

        <!-- 一级分类的广告
          存在一级分类id 说明点击的不是首页
         -->
        <category-ad :firstCateId='firstCateId' v-if='firstCateId !== ""'></category-ad>

        <!-- 配置模板 -->
        <view class="applet-template-container" v-if='firstCateId === ""'>
          <appletTemplate
            :timestamp="timestamp"
            :floors="getFloors"
            :storeid="storeId"
            :hasPower="hasPower"
            :seckill-data="seckillData"
          />
        </view>

        <view class="userActivity-container" v-if="showUserActivity">
          <view class="sign-in-gift">
            <image
              class="coupon-img"
              src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/coupon_icon%402x.png"
              alt=""
            ></image>
            <span class="sign-in-gift-text">登录享优惠，注册即送新人大礼包</span>
          </view>
          <view class="sign-in-btn" @click="navigationTo('Register')"
            >注册领券</view
          >
        </view>
        <!-- 热销商品模块 -->
        <view data-desc='热销商品' class="applet-template-recommend" :class="{'cate-bg': firstCateId}" :style="{display: cateLoading ? 'none':'block'}">
          <view class="recommend-title" :style="{display: firstCateId ? 'block':'none'}">
             <image
              style="height: 32rpx; width: 498rpx"
              :src="ossUrl + 'search-for-recommand-pic-new.png'"
              mode="heightFix"
            ></image>
          </view>
          <wsf-goods-list
            ref="goodslist"
            :list="flowList"
            :loadStatus="loadStatus"
            @goodsClick="goodsClick($event)"
            @clickSwiperCurrent="clickSwiperCurrent"
            @clickAddCart="clickAddCart"
          ></wsf-goods-list>
        </view>

        </view>
      </view>
    </view>

    <!-- 回到顶部 -->
    <!-- <u-back-top
      :scroll-top="scrollTop"
      :icon-style="iconStyle"
      top="5000"
      :bottom="80"
      ><image
        src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/top%402x.png"
        style="width: 80rpx; height: 80rpx"
      ></image
    ></u-back-top> -->

    <!-- 活动弹窗 -->
    <view
      class="index-poster-mask"
      v-if="showPost && modalPost.length"
      @touchmove.stop="stopTouch"
    >
      <view class="index-poster-container">
        <swiper
          v-if="modalPost && modalPost.length > 1"
          :indicator-dots="modalPost && modalPost.length > 1 ? true : false"
          :circular="true"
          indicator-color="#F0EEEE"
          indicator-active-color="#E60113"
          :autoplay="true"
          interval="3000"
          style="height: 100%"
        >
          <swiper-item v-for="(item, index) in modalPost" :key="index">
            <image
              :src="item.windowUrl"
              @click="imgActive(item.jumpAddress)"
            ></image>
          </swiper-item>
        </swiper>
        <image
          v-else-if="modalPost && modalPost.length == 1"
          :src="modalPost[0].windowUrl"
          @click="imgActive(modalPost[0].jumpAddress)"
        ></image>
        <!-- <u-swiper :list="modalPost" height="800" img-mode="none" bg-color="unset" :mode="modalPost.length > 1?'round':'none'" @click="imgActive(modalPost,$event)"></u-swiper> -->

        <!-- <image :src="modalPost" @click="goThematicActivity"></image> -->
        <view class="close-btn" @click="closePost">
          <image :src="closeImg" mode=""></image>
        </view>
      </view>
    </view>

    <!-- 浮动弹窗 -->
    <wsf-float-box :floatBtnData="floatBtnData"></wsf-float-box>
    <wsf-confirm
      v-model="discountGiftDialog"
      title="恭喜您获得新人大礼包"
      activeText="立即查看"
      :showCloseDialogBtn="true"
      :hideCancel="true"
      :isNeedTouchClose="true"
      @confirm="discountGiftConfirm"
      @handleCloseDialog="handleCloseDialog()"
    >
      <view class="discount-gift-container">
        <view class="discount-gift-text">以下优惠券已发放到您的账户中</view>
        <scroll-view scroll-y="true" class="discount-gift-list">
          <view
            class="discount-gift-coupon"
            v-for="(item, index) in platformCouponList"
            :key="index"
          >
            <span class="top-round-corner"></span>
            <span class="bottom-round-corner"></span>
            <view class="stub-ticket">
              <view class="content">
                <span class="text" v-if="item.type != 2">￥</span>
                <span class="price">{{
                  item.type == 2
                    ? parseInt(item.discountRate * 100) / 10
                    : skuPriceInt(item.price)
                }}</span>
                <span class="text" v-if="item.type != 2">{{
                  "." + skuPriceFloat(item.price)
                }}</span>
                <span class="text" v-else>折</span>
              </view>
            </view>
            <view class="main-ticket">
              <view class="content">
                <view class="title" v-if="item.type != 0"
                  >满{{ item.fullPrice }}可用</view
                >
                <view class="title" v-else>无门槛</view>
                <view class="cate">
                  <template v-if="item.permittedType == 0">
                    全平台商品可用
                  </template>
                  <template v-else-if="item.permittedType == 1">
                    平台部分商品可用
                  </template>
                  <template v-else-if="item.permittedType == 2">
                    限平台部分品类商品
                  </template>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </wsf-confirm>


  </view>
  <!-- </view> -->
</template>

<script>
import closeImg from "@/static/img/icon/post-close.png";
import wsfGoodsList from "@/components/wsf-goods-list/wsf-goods-list.vue";
import wsfNavBar from "@/components/wsf-nav-bar/wsf-nav-bar.vue";
// 首页-模版
import appletTemplate from './components/template/index.vue'
import wsfFloatBox from "@/components/homePageConfig/wsf-float-box/index.vue";
import { priceFilter } from "@/common/wsfFilter.js";
import wsfTabBar from "@/components/wsf-tab-bar/wsf-tab-bar.vue";
import { visit } from "@/common/visit.js";
import { mapGetters } from "vuex";
// 一级分类
import FirstCategory from './components/first-category/index.vue'
// 一级分类下的分类广告
import CategoryAd from './components/category-ad/index.vue'

export default {
  components: {
    wsfNavBar,
    appletTemplate,
    wsfGoodsList,
    wsfTabBar,
    wsfFloatBox,
    FirstCategory,
    CategoryAd
  },
  data() {
    return {
      ossUrl: this.$oss + "wsf-mall/home/",
      firstCateId: '',
      pageType: 1,
      cateLoading: false,
      hotWordCurrent: 0,
      lastHotWordCurrent: -1,
      hotWordList: [],
      isAutoPlay: false, //是否自动轮播
      hotRecommendList: [],
      currentSwiper: 0,
      bgColor: "",
      safePaddingHeight: 0,
      platformCouponList: [],
      discountGiftDialog: false,
      showUserActivity: false,
      closeImg: closeImg,
      scrollTop: 0,
      showPost: false,
      // modalPost:"https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/28c119b06f25afced75df813315956f2.png",
      // modalPost: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/40f4d6187f039e2603e5e064f28aa152.png',
      modalPost: [], // 专区活动
      hasPower: false, //  是否有分销权限
      timestamp: {},
      seckillTime: null, //秒杀读秒
      seckillData: [], //秒杀数据
      showSearchBar: false, // 是否显示头部导航栏
      floors: [], // 模板数据
      storeId: 0, // 店铺ID
      flowList: [], // 瀑布流商品列表
      loadStatus: "loadmore", // 加载更多样式效果
      isLoading: false, // 是否正在加载
      hasMore: true, // 是否拥有更多
      queryForm: {
        // 页码页容量
        pageNum: 0,
        pageSize: 10,
      },
      messageCount: 0, // 消息总数
      priceFilter,
      webviewUrl: "", //  外部链接
      isGrayscale: "",
      topSwiperAutoplay: true,
      fixedMaskFlag: false,

      // 头部图片
      smartMallBack: this.$smartImg + '/home/smart-mall-back.png',
      smartTitleIcon: this.$smartImg + '/home/dianshang.png'
    };
  },
  computed: {
    ...mapGetters(["getRefresh"]),
    // 模板数据
    getFloors() {
      return this.$store.getters["SETTINGS/wsfFloors"];
    },
    // 浮动数据
    floatBtnData() {
      return this.$store.getters["SETTINGS/floatBtnData"];
    },
    // 背景图数据
    headerData() {
      return this.$store.getters["SETTINGS/headerData"];
    },
    navPlaceHolder() {
      let height = (getApp().globalData.statusBarHeight + 44 + 48) * 2
      return height
    }
  },

  watch: {
    headerData: {
      handler(newVal) {
       this.currentSwiper = 0
       this.bgColor = newVal.slideshowImageList?newVal.slideshowImageList[0].bgColor:'';
      },
      immediate: true,
      deep: true
    }
  },

  onPageScroll(e) {
    this.scrollTop = e.scrollTop;

    let showSearchBar = this.showSearchBar;
    if (e.scrollTop > 50 && !showSearchBar) {
      this.showSearchBar = true;
      this.bgColor = ''
    } else if (e.scrollTop < 50 && showSearchBar) {
      this.showSearchBar = false;
      this.bgColor = this.headerData.slideshowImageList[this.currentSwiper].bgColor;
    } else {
      return;
    }
    // console.log("滚动距离为：" + e.scrollTop);
  },

  onLoad(options) {
    this.showActivityPost();
    uni.showShareMenu({
      withShareTicket: true,
    });
    this.getHotRecommend()
    this.GetRecommendList();
    setTimeout(() => {
      this.isGrayscale = getApp().globalData.isGrayscale
    }, 200)
    // 固定页面不滚动的
    this.$bus.$on("openFixedMask", (flag) => {
      this.fixedMaskFlag = flag
    });
    // 更新一级分类 TODO: 待飞废弃 - 夏麒麟
    // this.$bus.$on("activeTemplate", (data) => {
    //   console.log('activeTemplate---切换一级分类', data);
    //   if(data.type == 'cate') {
    //     this.firstCateId = data.id
    //     this.pageType = 9
    //   } else {
    //     this.firstCateId = ''
    //     this.pageType = 1
    //   }
    //   this.resetList()
    // });
    this.$bus.$on("showCateLoading", (flag) => {
      this.cateLoading = flag
    });
  },
  onShow() {
    this.safePaddingHeight = getApp().globalData.statusBarHeight + 44;
    this.topSwiperAutoplay = true
    this.isAutoPlay = true
    // 登录或者退出登录后重新刷新热销商品列表数据
    if (this.getRefresh) {
      // 当登录后重新调用热销商品接口,之后在禁止调用
      this.resetList()
      this.$store.dispatch("refreshFn", false);
    }
    visit(this, "首页");
    this.showUserActivity = false;
    this.getBaseInfoSet();

    if (!getApp().globalData.isLink) {
      this.getUserActivity();
    } else {
      this.showUserActivity = false;
    }
    if (getApp().globalData.isLink && this.$store.getters.getShowCouponDialog) {
      this.$store.commit("SET_INDEXCOUPONOPEN", false);
      setTimeout(() => {
        this.getPlatformCoupon();
      }, 500);
    }

    // 秒杀场次列表数据
    this.querySeckillScene();
    // if (this.flowList && this.flowList.length == 0) {
    /* this.queryForm = {
      // 页码页容量
      pageNum: 0,
      pageSize: 10,
    };
    // this.resetList();
    this.GetRecommendList(); */
    // }
    // if (this.floors && this.floors.length == 0) {
    // this.queryIndexTemplate();
    // }
    if (getApp().globalData.isTokenRefresh) {
      this.loadMessageCount();
    } else {
      // getApp().indexMessageCallback = () => {
      this.loadMessageCount();
      // };
    }

    // 2022.10.19 实体店电商项目, 接口影响逻辑不再调用,原有分销弃用
    // if (getApp().globalData.isLink) {
    //   this.QueryIsAllowDistribution();
    // } else {
    //   this.hasPower = false;
    // }

    // 初始化tabbar
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
      });
    }

    // 查询模板信息(首页配置)
		this.$store.dispatch('SETTINGS/queryIndexTemplate', false);

    this.getHotWordList()
  },
  onHide() {
    this.topSwiperAutoplay = false
    this.isAutoPlay = false
    this.$bus.$emit("handleCatePopup", false)
  },
  onReachBottom() {
    this.GetRecommendList();
  },
  methods: {
    goBack(){
      uni.removeStorageSync('wsf_smart_life_tab');
      // 从智慧生活过来返回智慧生活
      uni.reLaunch({
        url: '/pages/smartIndex/smartIndex',        
      });
    },
    /**
     * 交互场景： 已经在首页-再次点击首页tab，回到顶部，然后一级分类变成首页
     */
    onChangeTab() {
      this.onUpdateFirstLevel({index: 0})

      // 将滚动条回到顶部
      uni.pageScrollTo({
        scrollTop: 0,
        duration: this.duration
      });
    },
    /**
     * 切换一级分类-查询对应一级分类下面的二级分类和热销商品，还有一级分类的分类广告模版
     * @param {Object} data
     * {index: 点击的哪个索引, id: 一级分类id}
     */
    onUpdateFirstLevel(data) {
      if(data.index === 0) {
        // 点击的首页
        this.firstCateId = ''
        this.pageType = 1
      } else {
        // 点击的一级分类
        this.firstCateId = data.id
        this.pageType = 9
      }


      // 切换一级分类-需要重新查询热销商品
      this.resetList()
    },

    handleCloseDialog() {
      this.discountGiftDialog = false;
    },
    skuPriceInt(price) {
      let intPrice = 0,
        floatPrice = 0;
      if (!price) {
        price = 0;
      } else {
        price = price.toFixed(2).split(".")[0];
      }
      return price;
    },
    skuPriceFloat(price) {
      let intPrice = 0,
        floatPrice = 0;
      if (!price) {
        price = 0;
      } else {
        price = price.toFixed(2).split(".")[1];
      }
      return price;
    },
    discountGiftConfirm() {
      this.discountGiftDialog = false;
      this.$wsf.go("UserCoupon", { type: 2 });
    },
    getUserActivity() {
      this.$u.api.getUserActivity({ type: 0 }).then((res) => {
        if (
          res.data &&
          res.data.platformCouponVoList &&
          res.data.platformCouponVoList.length > 0
        ) {
          this.showUserActivity = true;
        } else {
          this.showUserActivity = false;
        }
      });
    },
    getPlatformCoupon() {
      this.$u.api.getDeliered(0).then((res) => {
        if (res.code == 200 && res.data && res.data.length > 0) {
          this.platformCouponList = res.data;
          this.discountGiftDialog = true;
        }
      });
    },

    // 首页活动弹窗
    imgActive(data, index) {
      // console.log(data, "data");
      /* if (data.indexOf("https") != -1) {
        let url = encodeURIComponent(data);
        uni.navigateTo({
          url: "/pages/index/webview?url=" + url,
        });
      } else {
        uni.navigateTo({
          url: "/" + data,
        });
      } */
      this.$wsf.go(data);
    },
    /**
     * 请求万顺福商城信息
     */
    getBaseInfoSet() {
      this.$u.api
        .GetBaseInfoSet({})
        .then((res) => {
          let data = res.data;
          data.isShowStore = 0;
          getApp().globalData.wsfBaseInfo = data;
          getApp().globalData.wsfBaseInfo.isShowStore = 0;
        })
        .catch((err) => {
          getApp().globalData.wsfBaseInfo = { isShowStore: 0 };
        });
    },
    //专题活动
    goThematicActivity() {
      // TODO 调试完要改回来
      // this.$wsf.go("ThematicActivity");
      // this.$wsf.go('WomensDay')
      this.$wsf.go("firstOrder", { id: 145 });
    },
    //展示活动海报
    showActivityPost() {
      //todo: 暂时解决免密登录没有拿到token先调用接口
      // setTimeout(() => {
      this.$u.api.QueryPerformanceFlag().then((res) => {
        if (res.code == 200 && res.data.length > 0) {
          this.modalPost = res.data;
          this.modalPost.forEach((item) => {
            item.image = item.windowUrl;
          });
          this.showPost = true;
        }
        // if (res.data == 1) {
        //   if (this.$store.getters.getThematicPost) {
        //     return;
        //   } else {
        //     this.$store.dispatch("setThematicPost", true);
        //     this.showPost = true;
        //   }
        // }
      });
      // }, 1000);
    },
    closePost() {
      this.showPost = false;
    },
    stopTouch() {
      return false;
    },
    resetList() {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0,
      });
      this.flowList = [];
      this.hasMore = true;
      this.isLoading = false;
      this.loadStatus = "loadmore";
      this.queryForm = {
        // 页码页容量
        pageNum: 0,
        pageSize: 10,
      };
      this.$refs.goodslist.clearList();
      this.GetRecommendList()
    },
    // 秒杀场次列表数据
    querySeckillScene() {
      this.$u.api.Queryseckilldetail().then((res) => {
        if (!res.data.secenes) {
          return;
        }
        // this.mobilePic = res.data.mobilePic
        let data = this.$u.deepClone(res.data.secenes);
        // this.panicBuySeckillscene(data[0].seckillSceneId);

        data = data.splice(0, 4);
        let label = null,
          secen = null,
          arrIndex = 0,
          getHours = new Date().getHours();
        let currentTime = parseInt(new Date().getTime() / 1000); //当前秒级时间戳
        /* for (let i = 0; i < data.length; i++) {

          secen = data[i].secen;
          if (secen.split(":")[0] == getHours) {
            arrIndex = i;
            this.seckillTime = parseInt(
              new Date(data[i].seckillTime.replace(/-/g, "/")).getTime() / 1000
            );
          }
        } */
        this.seckillTime = parseInt(
          new Date(data[0].seckillTime.replace(/-/g, "/")).getTime() / 1000
        );
        // console.log(this.sekillTime, "data[arrIndex].seckillSceneId");
        this.panicBuySeckillscene(data[arrIndex].seckillSceneId);
        this.timestamp = {
          label: "",
          secen: data[0].secen.split(":")[0] + "点场",
        };
        // 当前时间小于给定的场次时间,表示表示还没开始(距离开始还剩)
        if (currentTime < this.seckillTime) {
          this.timestamp.seconds = this.seckillTime - currentTime;
          this.timestamp.label = "距离开始";
        } else {
          //开始了
          this.timestamp.seconds = 3600 - (currentTime - this.seckillTime);
          this.timestamp.label = "距离结束";
        }
      });
    },
    // 查询用户是否有分销权限
    QueryIsAllowDistribution() {
      // 2022.10.19 实体店电商项目, 接口影响逻辑不再调用,原有分销弃用
      this.$u.api.QueryIsAllowDistribution().then((res) => {
        if (res.code == 200) {
          this.hasPower = res.data;
        }
      });
    },
    // 查询秒杀商品列表
    panicBuySeckillscene(seckillSceneId) {
      this.$u.api.PanicBuySeckillscene({ seckillSceneId }).then((res) => {
        this.seckillData = [];
        if (!(res.data && res.data.list.length)) return;
        for (let i = 0; i < res.data.list.length; i++) {
          if (i < 4) {
            this.seckillData.push(res.data.list[i]);
          }
        }
      });
    },
    /* 获取推荐的商品列表 */
    GetRecommendList() {
      if (this.isLoading || !this.hasMore) return;
      this.isLoading = true;
      this.loadStatus = "loading";
      if(this.firstCateId) {
        this.queryForm.firstCateId = this.firstCateId
      }
      this.queryForm.pageType = this.pageType
      this.$u.api.QueryRecommendCommodity(this.queryForm).then((res) => {
        this.isLoading = false;
        this.loadStatus = "loadmore";
        // console.log("res", res);
        if (res.code === 200) {
          // this.flowList = this.flowList.concat(
          res.data.map((item, index) => {
            item = JSON.parse(JSON.stringify(item));
            item.price = this.priceFilter(item.price);
            this.flowList.push(item);
            return item;
          });
          if(!this.firstCateId) {
            this.flowList = this.settleRecommend(this.flowList)
          }
          this.queryForm.pageNum++;
          this.hasMore = res.data.length === 10;
          this.loadStatus = res.data.length === 10 ? "loadmore" : "nomore";
        }
      });
    },
    /* 获取消息总数 */
    loadMessageCount() {
      if (!getApp().globalData.isLink) {
        this.messageCount = 0;
        return;
      }
      this.$u.api.queryNewsReadNums().then((res) => {
        if (res.code == 200) {
          let num = 0;
          res.data.filter((ele) => {
            if (ele.receiverType == 2) {
              num += ele.count;
            }
          });
          this.messageCount = num;
        }
      });
    },

    /* 跳转 */
    navigationTo(sceneName, params) {
      this.$bus.$emit("handleCatePopup", false)
      this.$wsf.go(sceneName, params);
    },
    // 商品跳转
    goodsClick(e) {
      // 专题类型为单页模板时候，直接进入专题
      if (e.skuLable && e.skuLable.thematicLabel && e.skuLable.thematicLabel.templateCode == 107) {
        this.$wsf.go('specialModule', {
          id: e.skuLable.thematicLabel.id,
          spuId: e.spuId
        })
        return
      }

      // console.log("e", e);
      let skuId = e.id || e.skuId
      // this.$wsf.go("SkuDetail", { skuId });
      if(e.goodsSource == 4){
				this.$wsf.go('ToMotor',{skuId});
			} else {
				this.$wsf.go('SkuDetail', { skuId });
			}
    },

    getSwiperCurrent(e) {
      let {current, source} = e.detail
      if(source === 'autoplay' || source === 'touch') {
        this.currentSwiper = current
        if(this.scrollTop < 50) {
          this.bgColor = this.headerData.slideshowImageList[current].bgColor;
        }
      }
    },

    /* 点击swiper */
    clickSwiperCurrent(link) {
      console.log("点击swiper的link----",link);
      if (!link) {
        return;
      } else {
       if(link == "distributionModule/pages/distributionIndex/distributionIndex") {
        let isLogin = getApp().globalData.isLink;
        if(isLogin) {
          this.$wsf.go('distributionIndex')
        } else {
          this.$wsf.go('QuickLogin', { cartRoute: 'pages/index/index' })
        }
       } else {
        this.$wsf.go(link);
       }
      }
    },

    //获取热销榜单和热销广告模块
    getHotRecommend() {
      this.$u.api.QueryAdvertSet({channelType: 3}).then(res => {
        this.hotRecommendList = res.data.map(item => {
          if(item.relatedType == 1) {
            item.currentSwiper = 0
          }
          return item
        })
      })
    },

    //加入购物车
    clickAddCart(item) {
       let data = {
        num: 1,
        skuId: item.skuId,
        sourceType: 1,
        storeId: item.storeId,
      };
      this.$u.api.AddShoppingCart(data).then((res) => {
        if(res.code == 200) {
          this.$u.toast("添加购物车成功");
        }
      })
    },

    //插入热销榜单和热销广告模块
    settleRecommend(list) {
      // console.log( this.hotRecommendList,"hotRecommendList");
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
    changeHotWord(e) {
      this.lastHotWordCurrent = this.hotWordCurrent
      this.hotWordCurrent = e.detail.current
    },
    //首页热词搜索
    handleSearch() {
      this.$bus.$emit("handleCatePopup", false)
      if(this.hotWordList && this.hotWordList.length) {
        let name = this.hotWordList[this.hotWordCurrent].name
        this.$wsf.go("SpuList",{ queryString: name });
      } else {
        this.navigationTo("SpuList")
      }
    },
    goSearchPage() {
      this.$bus.$emit("handleCatePopup", false)
      if(this.hotWordList && this.hotWordList.length) {
        this.navigationTo('Search', {searchValue: this.hotWordList[this.hotWordCurrent].name})
      } else {
        this.navigationTo('Search')
      }
    },
    //获取热词
    async getHotWordList() {
      let list = []
      let records = uni.getStorageSync('searchRecords')
      if(records) {
        list = JSON.parse(records).split(",").map(item => ({name: item}))
      }
      // await uni.getStorage({
      //   key: "searchRecords",
      //   success: (res) => {
      //     let records = JSON.parse(res.data).split(",");
      //     console.log(records, 222);
      //     if(records && records.length) {
      //       list = records.map(item => {
      //         return {
      //           name: item
      //         }
      //       })
      //     }
      //   },
      //   fail: () => {},
      // });
      await this.$u.api.QueryKeyword().then(res => {
        if(res.data && res.data.length) {
          list = list.concat(res.data)
        }
      })
      this.hotWordList = list
    }
  },
  beforeDestroy() {
    this.$bus.$off("openFixedMask")
    this.$bus.$off("activeTemplate")
    this.$bus.$off("showCateLoading")
  }
};
</script>

<style scoped lang="scss">
.wrapperBox {
  overflow-x: hidden;
}
.mainBox {
  width: 100vw;
  z-index: -1;
}
.applet-template-background {
  width: 750rpx;
  height: 168rpx;
  // background-color: #fff;
  margin-bottom: -166rpx;
}
.showfixedtop {
  width: 100%;
  background-position: top center;
  // 设置距离底部的高度
  margin-bottom: 100rpx;

}
.top-wrap {
  position: relative;
  height: 290rpx;
  // background-color: red;
  // &::after {
  //   content: "";
  //   display: block;
  //   position: absolute;
  //   left: 0;
  //   right: 0;
  //   bottom: 0;
  //   top: 0;
  //   background-color: #fff;
  //   background-image: var(--bgi);
  //   opacity: var(--opacity);
  //   background-repeat: no-repeat;
  //   background-size: 100% 100%;
  //   // z-index: -99;
  // }
}
.nav-search-bar-img {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
}

.header-home-wrapper {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: auto;
  z-index: 10;
}
.header-advertising-image{
  height: 44px;
  position: absolute;
  left: 24rpx;
  top: 0; 
  display: flex;
  align-items: center;
  margin-left: -20rpx;
  padding: 24rpx;
  .img:first-child {
    height: 40rpx;
    width: 40rpx;
  }
  .img:last-child {
    width: 172rpx;
    height: 32rpx;
    margin-left: 8rpx;
  }
}
.header-advertising {
  position: absolute;
  left: 80rpx;
  top: 6rpx;
  // width: 188rpx;
  // height: 88rpx;
  width: 172rpx;
  height: 40rpx;
  .img {
    width: 100%;
    height: 100%;
  }
  .header-advertising-swiper {
    width: 100%;
    height: 100%;
    image {
      width: 100%;
      height: 100%;
    }
  }
}
.header-advertising-swiper-left{
  left: 60rpx;
}

.search-container {
  width: 100%;
  height: 72rpx;
  padding: 0 24rpx;
  display: flex;
  align-items: center;
  margin-top: 8rpx;
  .search-input-box {
    width: 630rpx;
    height: 72rpx;
    background: #FFF;
    border-radius: 37rpx;
    display: inline-flex;
    align-items: center;
    position: relative;
    border: 1rpx solid #FF1538;
    box-shadow: 0 0 0 2rpx #FFBCBB;
    .search-input-icon {
      margin: 0 16rpx 0 24rpx;
      width: 32rpx;
      height: 32rpx;
      background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/ic_index_search.png')
        no-repeat center center;
      background-size: 32rpx 32rpx;
    }
    .search-input {
      width: 428rpx;
      height: 72rpx;
      border: 0;
      background: 0;
      color: #999999;
      font-size: 24rpx;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 72rpx;
    }
    .search-button {
      position: absolute;
      right: 6rpx;
      top: 50%;
      transform: translateY(-50%);
      width: 124rpx;
      height: 64rpx;
      background: linear-gradient(90deg, #FF6B4E 0%, #FF0A35 100%);
      border-radius: 37rpx;
      line-height: 64rpx;
      text-align: center;
      font-size: 28rpx;
      color: #fff;
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

/**
* 头部导航栏搜索框样式
*/
.nav-search-bar-wrap {
  width: 100%;
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
  padding-top: 6px;
  padding-left: 12px;
}
.nav-search-bar-wrap .nav-search-bar {
  height: 32px;
  line-height: 32px;
  background-color: #ededed;
  border-radius: 16px;
  position: relative;
}
.nav-search-form-icon {
  position: absolute;
  top: 6rpx;
  left: 22rpx;
  width: 48rpx;
  height: 48rpx;
  background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/ic-search.png')
    no-repeat center center;
  background-size: 32rpx 32rpx;
}
.nav-search-form-value {
  text-align: left;
  padding-left: 40px;
  color: #999999;
  font-size: 14px;
}

.applet-template-recommend {
  // 形成BFC
  overflow: auto;
  padding: 0 24rpx;
  margin-top: 24rpx;
  .recommend-title {
    // 形成BFC
    overflow: hidden;
    margin-bottom: 20rpx;
    text-align: center;
  }
}

.cate-bg {
  background-color: #f5f5f5;
}

.index-poster-mask {
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}
.index-poster-container {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600rpx;
  height: 800rpx;
  background-color: transparent;
  border-radius: 20rpx;
  image {
    width: 100%;
    height: 100%;
    border-radius: 20rpx;
  }
  .close-btn {
    width: 48rpx;
    height: 48rpx;
    position: absolute;
    left: 50%;
    bottom: -104rpx;
    transform: translate(-50%, 0);
    image {
      width: 100%;
      height: 100%;
    }
  }
  .save-btn {
    width: 482rpx;
    height: 76rpx;
    border-radius: 50rpx;
    background-color: #e60113;
    font-size: 32rpx;
    color: #fff;
    text-align: center;
    line-height: 76rpx;
    position: absolute;
    left: 0;
    bottom: -124rpx;
  }
}

.userActivity-container {
  margin-bottom: env(safe-area-inset-bottom);
  position: fixed;
  z-index: 999;
  bottom: 100rpx;
  width: 100%;
  height: 80rpx;
  background: rgba(0, 0, 0, 0.7);
  padding: 0 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  .sign-in-gift {
    display: inline-flex;
    align-items: center;
    .coupon-img {
      width: 40rpx;
      height: 40rpx;
    }
    .sign-in-gift-text {
      margin-left: 20rpx;
      font-size: 28rpx;
    }
  }
  .sign-in-btn {
    width: 152rpx;
    height: 56rpx;
    background: #e60113;
    border-radius: 38rpx;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 26rpx;
  }
}

.discount-gift-container {
  width: 100%;
  .discount-gift-text {
    text-align: center;
    font-size: 28rpx;
    color: #666;
    margin: 16rpx 0;
  }
  .discount-gift-list {
    padding: 0 36rpx;
    height: 560rpx;
    width: 560rpx;

    .discount-gift-coupon {
      position: relative;
      width: 100%;
      background: #fef4f4;
      border-radius: 20rpx;
      display: flex;
      height: 140rpx;
      margin-top: 16rpx;
      .top-round-corner {
        background-color: #fff;
        position: absolute;
        top: -16rpx;
        left: 210rpx;
        transform: translate(-50%, 0);
        height: 28rpx;
        width: 28rpx;
        border-radius: 0 0 50% 50%;
        z-index: 2;
      }
      .bottom-round-corner {
        background-color: #fff;
        position: absolute;
        bottom: -16rpx;
        left: 210rpx;
        transform: translate(-50%, 0);
        height: 28rpx;
        width: 28rpx;
        border-radius: 50% 50% 0 0;
        z-index: 2;
      }
      .stub-ticket {
        width: 210rpx;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border-right: 2rpx dashed #faccd0;
        .content {
          display: inline-flex;
          align-items: baseline;
          color: #e60113;
          font-weight: 600;
          .text {
            font-size: 28rpx;
            line-height: 40rpx;
          }
          .price {
            font-size: 60rpx;
            line-height: 76rpx;
          }
        }
      }
      .main-ticket {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        .content {
          margin-left: 36rpx;
          .title {
            font-size: 28rpx;
            font-weight: 500;
            color: #000;
            line-height: 40rpx;
          }
          .cate {
            margin-top: 4rpx;
            color: #666;
            line-height: 32rpx;
            font-size: 22rpx;
          }
        }
      }
    }
  }
}

.grayscale-gray {
  -webkit-filter: grayscale(100%);
   filter: grayscale(100%);
}
.fixed-mask {
  overflow: hidden;
  position:fixed;
  height: 100%;
  width: 100%;
}

// 在其他一级分类的时候-用这个颜色兜底，首页情况，使用配置的颜色兜底
.content-gray-bg {
  background: #F5F5F8;
  border-radius: 32rpx 32rpx 0 0;
}
/deep/.u-back-top{
  bottom: 80 !important;
}
</style>
