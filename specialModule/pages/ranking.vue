<template>
	<view class="ranking-container" :style="{paddingTop: fillPadding + 'px'}">
    <!--返回按钮 -->
    <customHeader v-if="paramsCode == MODULETYPE.customization || paramsCode == MODULETYPE.singlePage" :paramsCode="paramsCode" :iStatusBarHeight="iStatusBarHeight" :boxTopHeight="boxTopHeight" :config="config" :pageTitle="config.pageTitle"></customHeader>
    <headerCom v-if="![MODULETYPE.customization, MODULETYPE.singlePage].includes(paramsCode)" :iStatusBarHeight="iStatusBarHeight" :boxTopHeight="boxTopHeight" :pageTitle="config.pageTitle"></headerCom>


    <view v-if="isInit">
      <!-- 分享按钮 -->
      <button v-if="[MODULETYPE.xiaoshoupaihang, MODULETYPE.pingleirexiao].includes(paramsCode)" open-type="share" class="share">分享</button>

      <specialGoods v-if="paramsCode == MODULETYPE.xiaoshoupaihang" :moduleData="moduleData" :config="config"></specialGoods>
      <hotCategory v-else-if="paramsCode == MODULETYPE.pingleirexiao" :moduleData="moduleData" :config="config"></hotCategory>
      <customization v-else-if="paramsCode == MODULETYPE.customization" :config="config" :moduleData="moduleData" :reachBottom="reachBottom" :rankingId="id"></customization>
      <singlePage v-else-if="paramsCode == MODULETYPE.singlePage" :config="config" :spuId="spuId" :fillPadding="fillPadding"></singlePage>
      <emptyView v-else></emptyView>
      <!-- 热销商品 -->
      <view v-if="[MODULETYPE.xiaoshoupaihang, MODULETYPE.pingleirexiao].includes(paramsCode)" class="applet-template-recommend u-padding-left-24 u-padding-right-24">
        <wsf-goods-list ref="goodslist" title="hot" :list="flowList" :loadStatus="loadStatus" @goodsClick="goodsClick($event)"></wsf-goods-list>
      </view>
      <!-- 回到顶部 -->
      <image v-if="showReturnTop" class="back-top-btn" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/special-subject/backtop.png" @tap="backTop()" />
    </view>
	</view>
</template>

<script>
import hotCategory from './comp/hotCategory/hotGoods.vue' // 品类热销
import specialGoods from './comp/special/specialGoods.vue' // 排行专题
import emptyView from './comp/common/emptyView.vue' // 无排行
import wsfGoodsList from '@/components/wsf-goods-list/wsf-goods-list.vue'; // 底部精选好物
import headerCom from './comp/common/headerCom.vue';
import customHeader from './comp/common/customHeader.vue';
import singlePage from './comp/singlePage/index.vue'
import customization from './comp/customization/index.vue'

import { pageEnums } from './data.js'
import { priceFilter } from '@/common/wsfFilter.js';

import { dealError } from '../common/dealError'
import { MODULETYPE } from '../common/constants'

export default {
    components: { 
      wsfGoodsList,
      specialGoods,
      emptyView,
      hotCategory,
      headerCom,
      customization,
      customHeader,
      singlePage
    },
    data() {
      return {
        enterType: "", //进入落地页的类型share表示从分享进
        ossUrl: this.$oss,
        showReturnTop: false,
        // 常量
        MODULETYPE,
        isInit: false, // 判断页面是否初始化完成

        // 上部不同类型专题区域
        moduleData: null, // 模块数据
        paramsCode: '', // 模块类型
        config: {}, // 配置

        // 底部公共商品区域
        queryForm: {
          // 页码页容量
          pageType: '',
          pageNum: 0,
          pageSize: 10
        },
        flowList: [], // 瀑布流商品列表
        hasMore: true, // 是否拥有更多
        loadStatus: 'loadmore', // 加载更多样式效果
        isLoading: false, // 是否正在加载
        priceFilter,

        // 自定义导航区
        iStatusBarHeight: 0,
        searchBarTop: 0, //胶囊距顶部
        searchBarHeight: 0, //胶囊高度
        mallImg: this.$mallImg,
        showOverlay: false,
        scrollTopObj: {
          scrollTop: 0
        },
        reachBottom: false,
        id: null,
        spuId: null
      }
    },
    provide(){
      return {
        scrollTopObj: this.scrollTopObj
      }
    },
    computed: {
      // 计算填充高度，胶囊高度加上两侧编剧
      boxTopHeight () {
        return (this.searchBarTop - this.iStatusBarHeight) * 2 + this.searchBarHeight
      },
      // 计算页面偏移高度
      fillPadding () {
        return this.boxTopHeight + this.iStatusBarHeight
      }
    },
    onLoad(option){
      console.log('-----专题页面参数-----', option)

      this.enterType = option.enterType;

      // 获取专题id
      this.id = parseInt((option || {}).id);
      this.spuId = option.spuId
    },
    onReachBottom() {
      console.log('----------触底了--------------');
      this.reachBottom = true
      this.$refs.goodslist && this.GetRecommendList();
    },
    onPageScroll(e) {
      this.scrollTopObj.scrollTop = e.scrollTop
      this.scrollTop = e.scrollTop;
      if (this.scrollTop > 500) {
        this.showReturnTop = true
      } else {
        this.showReturnTop = false
      }

      if (this.reachBottom) {
        this.reachBottom = false
      }
    },

    onShow() {
      // 初始化
      this.init()
      let menuButtonInfo = uni.getMenuButtonBoundingClientRect();
      this.searchBarTop = menuButtonInfo.top;
      this.searchBarHeight = menuButtonInfo.height;
      this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    },

    // 分享到朋友圈
    onShareTimeline() {
      return this.shareInfo || {
        title: "更多好物，等你挑选",
        path: "pages/index/index",
        imageUrl: `${this.mallImg}/activity/women-Day/share-img200.jpg`,
      };
    },
    //   分享给好友
    onShareAppMessage() {
      return this.shareInfo || {
        title: "更多好物，等你挑选",
        path: "pages/index/index",
        imageUrl: `${this.mallImg}/activity/women-Day/share-img54.jpg`,
      };
    },
    methods: {
      // 初始化，获取专题详情
      // 获取配置文件，分享信息
      init() {
        this.getSubjectDetail()
      },
      // 根据专题id获取专题详情，配置文件，分享信息等
      getSubjectDetail() {
        let param = {
          id: this.id
        }
        this.$u.api.selectSubjectById(param).then(res => {
          this.isInit = true;
          const {
            code,
            data = {},
            msg
          } = res || {}
          if (code === 200) {
            let {
              templateCode,
              content
            } = data
            // templateCode = 106
            // 主页面对不同专题不做处理，数据传递进组件
            this.paramsCode = templateCode;
            this.moduleData = data
            // JSON.parse要用try包起来防止出错
            try {
              this.config = JSON.parse(content)

            } catch(err) {
              dealError(code, msg)
            }

            console.log(66666, this.moduleData, this.config )
            // 处理主页公共逻辑
            if ([MODULETYPE.xiaoshoupaihang, MODULETYPE.pingleirexiao].includes(this.paramsCode)) {
              this.dealMainCommon()
            }
          } else {
            // 接口异常兜底提示
            dealError(code, msg)
          }
        }).catch(err => {
          // 接口异常兜底提示
          dealError(err.code, err.msg)
        })
      },

      // 处理主页公共逻辑
      dealMainCommon() {
        // 获取分享信息
        this.getShareInfo();
        // 设置页面标题
        this.setPageTitle();
        // 获取底部的热销商品
        const {
          recommendGoodsSource
        } = this.config
        this.queryForm.pageType = recommendGoodsSource
        this.GetRecommendList();

       
      },

      // 获取分享信息
      getShareInfo() {
        const {
          shareText: title,
          landPageAppUrl: path,
          imgUrl: imageUrl,
        } = this.moduleData
        this.shareInfo = {
          title,
          path,
          imageUrl,
        }
      },

      // 设置页面标题
      setPageTitle() {
        const {
          pageTitle
        } = this.config
        // 设置页面标题
        uni.setNavigationBarTitle({
          title: pageTitle || '万顺福商城'
        });
      },
      // 商品跳转
      goodsClick(e) {
        console.log('e', e);
        this.$wsf.go('SkuDetail', { skuId: e.id });
      },
      /* 获取推荐的商品列表 */
      GetRecommendList() {      
        if (this.isLoading || !this.hasMore) return;
        this.isLoading = true;
        this.loadStatus = 'loading';
        this.$u.api.QueryRecommendCommodity(this.queryForm).then(res => {
          this.isLoading = false;
          this.loadStatus = 'loadmore';
          console.log('res', res);
          if (res.code === 200) {
            // this.flowList = this.flowList.concat(
              res.data.map((item,index) => {
                item = JSON.parse(JSON.stringify(item))
                item.price = this.priceFilter(item.price);
                this.flowList.push(item)
                return item;
              })
            // );
            this.queryForm.pageNum++;
            this.hasMore = res.data.length === 10;
            this.loadStatus = res.data.length === 10 ? 'loadmore' : 'nomore';
          }
        });
      },
      getCurrentTab(){
        let obj = pageEnums.find(item=>{
          return item.id == this.paramsCode
        })
        return obj && obj.name ? obj.name : 'emptyView'
      },
      //返回顶部
      backTop() {
        uni.pageScrollTo({
          duration: 300,
          scrollTop: 0,
        });
      },
      
      
      openShare() {
        this.showShare = true;
      },
      cancelShare() {
        this.showShare = false;
      },
      
    },
}
</script>

<style scoped lang="less">
.ranking-container{
  .applet-template-recommend {
    padding-bottom: calc(env(safe-area-inset-bottom) + 40rpx);
    .applet-template-recommend-title {
      margin: 40rpx 0 20rpx;
      text-align: center;
    }
  }
}

.share {
  position: absolute;
  width: 62rpx;
  height: 62rpx;
  line-height: 62rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid #fff;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  font-size: 20rpx;
  color: #fff;
  top: 190rpx;
  right: 24rpx;
  z-index: 9;
  padding: 0;
}

.back-top-btn {
  width: 74rpx;
  height: 74rpx;
  position: fixed;
  right: 12rpx;
  bottom: 150rpx;
}



 
</style>
