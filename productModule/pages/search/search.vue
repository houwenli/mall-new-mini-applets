<template>
  <view class="applet-search-wrap">
    <wsf-nav-bar
      :status-bar="true"
      :shadow="false"
      :hasBack="true"
      backIconType="white"
      bgSize="100% auto"
      :bgimg="headerBgUrl"
      @onBackBtnClick="clickBackBtn"
    >
      <view slot="searchBar" class="search_wrap">
        <wsf-search
          style="width: 100%"
          v-model="keyword"
          :clearable="false"
          :focus="true"
          :placeholder="placeholder"
          @confirm="search"
        ></wsf-search>
      </view>
      <view class="block" slot="additional"> </view>
    </wsf-nav-bar>
    <scroll-view
      class="content"
      :style="{ top }"
      @scrolltolower="scrolltolower"
      scroll-y="true"
    >
      <view v-if="searchHistoryList.length" class="card_wrap">
        <view class="header">
          <view class="title">搜索历史</view>
          <view class="right" @click="resetHistory">
            <image
              class="icon"
              :src="ossUrl + 'search-delete-icon.png'"
            ></image>
          </view>
        </view>
        <view class="tags">
          <view
            v-for="(item, index) in searchHistoryList"
            :key="index"
            class="tag overLine"
            @click="search(item)"
            >{{ item }}</view
          >
          <view
            v-if="allsearchRecords.length > 8"
            class="showmore"
            @click="toggle"
          >
            <image
              class="arrow"
              :src="
                ossUrl +
                (showmore
                  ? 'search-putAway-icon.png'
                  : 'search-open-arrow-icon.png')
              "
            ></image>
          </view>
        </view>
      </view>
      <view v-if="findList.length" class="card_wrap">
        <view class="header">
          <view class="title">探索发现</view>
          <view class="right" @click="debounceRefresh">
            <text>换一批</text>
            <image
              :class="{ 'animate-spin': animation }"
              class="icon"
              :src="ossUrl + 'search-refresh-icon.png'"
            ></image>
          </view>
        </view>
        <view class="tags find">
          <view
            v-for="(item, index) in findList"
            :key="item.id"
            class="tag"
            @click="toSpuList(item.name)"
            >{{ item.name }}</view
          >
        </view>
      </view>

      <!-- 为您推荐列表模块 -->
      <view v-if="showRecommend" class="applet-template-recommend">
        <view class="header">
          <image
            style="height: 30rpx; width: 136rpx"
            :src="ossUrl + 'search_recommand.png'"
            mode="heightFix"
          ></image>
        </view>
        <wsf-goods-list
          :list="flowList"
          :loadStatus="loadStatus"
          loadMoreBgColor="#f8f8f8"
          @goodsClick="goodsClick($event)"
        ></wsf-goods-list>
      </view>
    </scroll-view>
    <!-- 确认删除模块 -->
    <wsf-confirm
      v-model="showConfirm"
      :title="confirmInfo.title"
      :activeText="confirmInfo.activeText"
      :cancelText="confirmInfo.cancelText"
      @confirm="activeConfirm"
    ></wsf-confirm>
  </view>
</template>

<script>
import { priceFilter } from "@/common/wsfFilter.js";
import wsfGoodsList from "@/components/wsf-goods-list/wsf-goods-list.vue";

export default {
  components: {
    wsfGoodsList
  },
  data() {
    return {
      ossUrl: this.$oss + "wsf-mall/home/",
      giftType: "",
      queryString: "", // 搜索关键词
      keyword: "", // 搜索框输入的关键词
      searchHistoryList: [],
      showmore: false, // 是否展示更多数据
      allsearchRecords: [],
      searchType: 0,
      storeId: "", // 是否搜索店铺

      showConfirm: false,
      confirmInfo: {
        type: "",
        title: "",
        activeText: "",
        cancelText: "",
      },
      flowList: [], // 推荐商品瀑布流
      findList: [], // 探索发现列表
      animation: false,
      queryForm: {
        pageType: 8,
        pageNum: 0,
        pageSize: 10,
      },
      loadStatus: "loadmore", // 加载更多样式效果
      isEmpty: false, // 缺省状态
      hasMore: true, // 是否还有更多
      isLoading: false, // 正在加载
      enterQuery: {},
      headerBgUrl: this.$oss + "wsf-mall/home/headerBg.png",
      fromPage: "",
      agencyStoreId: "", //实体店id
      showRecommend: true,
      promoteId: null
    };
  },
  computed: {
    placeholder() {
      let str = this.enterQuery.searchValue || "请输入搜索关键字";
      if (this.enterQuery.giftType === "gift") {
        str = "在结果中搜索商品";
      }
      return str;
    },
    top() {
      let statusBarHeight = getApp().globalData.statusBarHeight;
      return statusBarHeight + 44 + 22 - 16 + "px";
    },
  },
  watch: {
    keyword(val) {
      this.queryString = val;
    },
  },
  onLoad(options) {
    // 判断跳转方式 0 为关闭当前页跳转  1 为修改上一页参数后返回
    this.enterQuery = options;
    this.searchType = options.type || 0;
    this.storeId = options.storeId || "";
    this.queryString = options.searchValue || "";

    this.giftType = options.giftType;
    // 来自xxx页面
    if (options.fromPage) {
      this.fromPage = options.fromPage;
      this.agencyStoreId = options.agencyStoreId || "";
    }

    if(options.promoteId) {
      this.promoteId = options.promoteId
    }

    // this.showRecommend = options.fromPage != 'distributionIndex' && options.fromPage != 'distributionUserPage'
    // 为您推荐
    this.loadRecommend();
    // 探索发现
    this.getFindList();
  },
  onShow() {
    this.loadSearchRecords();
    console.log("搜索历史1", this.searchHistoryList);
  },
  // onReachBottom() {
  // 	// 加载推荐列表
  // 	this.loadRecommend();
  // },
  methods: {
    clickBackBtn() {
      // this.$wsf.go('Index')
      // uni.getCurrentPages()
      uni.navigateBack();
    },
    // 滚动到容器底部
    scrolltolower() {
      this.loadRecommend();
    },
    // 商品跳转
    goodsClick(e) {
      console.log("e", e);
      // this.$wsf.go("SkuDetail", { skuId: e.id });
      if(e.goodsSource == 4){			
				this.$wsf.go('ToMotor',{skuId: e.id});
			} else {
				this.$wsf.go('SkuDetail', { skuId: e.id });
			}
    },
    // 获取推荐商品列表
    loadRecommend() {
      if (this.isLoading || !this.hasMore) return;
      this.isLoading = true;
      this.loadStatus = "loading";
      this.$u.api.QueryRecommendCommodity(this.queryForm).then((res) => {
        this.isLoading = false;
        this.loadStatus = "loadmore";
        console.log("res", res);
        if (res.code === 200) {
          this.flowList = this.flowList.concat(
            res.data.map((item) => {
              item.price = priceFilter(item.price);
              return item;
            })
          );
          this.queryForm.pageNum++;
          this.hasMore = res.data.length === 10;
          this.loadStatus = res.data.length === 10 ? "loadmore" : "nomore";
        }
      });
    },
    // 查询探索发现
    getFindList() {
      this.$u.api.QueryKeyword({ name: this.queryString }).then((res) => {
        console.log("res", res);
        if (res.code === 200) {
          // 随机排序
          // this.findList = (res.data || []).sort(() => Math.random() - 0.5);

          this.findList = res.data || []
        }
      });
    },
    debounceRefresh() {
      return this.$u.debounce(this.refresh, 1000, true);
    },
    // 探索发现换一批
    refresh() {
      if (this.animation) {
        return;
      }
      this.animation = true;
      try {
        this.getFindList();
        let timer = setTimeout(() => {
          this.animation = false;
          clearTimeout(timer);
        }, 1000);
      } catch (e) {
        this.animation = false;
      }
    },
    // 清空搜索历史
    resetHistory() {
      if (this.searchHistoryList.length > 0) {
        this.confirmInfo.title = "确认删除搜索历史？";
        this.confirmInfo.activeText = "确认";
        this.confirmInfo.cancelText = "取消";
        this.showConfirm = true;
      }
    },
    // 弹窗确认
    activeConfirm() {
      this.searchHistoryList = [];
      this.allsearchRecords = [];
      this.showConfirm = false;
      if (this.fromPage == "distributionIndex") {
        uni.removeStorageSync("distributionIndexSearchRecords");
      } else if (this.fromPage == "distributionUserPage") {
        uni.removeStorageSync("distributionUserSearchRecords");
      } else if (this.fromPage == "storeIndex") {
        uni.removeStorageSync("storeIndexSearchRecords");
      } else {
        uni.removeStorageSync("searchRecords");
      }
    },
    // 加载本地存储的搜索记录
    loadSearchRecords() {
      let that = this;
      let fromPage = this.fromPage;
      if (fromPage) {
        uni.getStorage({
          key:
            fromPage == "distributionIndex"
              ? "distributionIndexSearchRecords"
              : fromPage == "storeIndex"
              ? "storeIndexSearchRecords"
              : "distributionUserSearchRecords",
          success: function (res) {
            that.allsearchRecords = JSON.parse(res.data).split(",");
            if (that.allsearchRecords.length > 8 && !that.showmore) {
              that.searchHistoryList = that.allsearchRecords.slice(0, 8);
            } else {
              that.searchHistoryList = that.allsearchRecords;
            }
            that.searchHistoryList = [...new Set(that.searchHistoryList)];
            // console.log("搜索历史",that.searchHistoryList)
          },
          fail: function () {
            that.searchHistoryList = [];
          },
        });
      } else {
        uni.getStorage({
          key: "searchRecords",
          success: function (res) {
            that.allsearchRecords = JSON.parse(res.data).split(",");
            if (that.allsearchRecords.length > 8 && !that.showmore) {
              that.searchHistoryList = that.allsearchRecords.slice(0, 8);
            } else {
              that.searchHistoryList = that.allsearchRecords;
            }
            that.searchHistoryList = [...new Set(that.searchHistoryList)];
            // console.log("搜索历史",that.searchHistoryList)
          },
          fail: function () {
            that.searchHistoryList = [];
          },
        });
      }
    },
    // 切换展示状态
    toggle() {
      this.loadSearchRecords();
      this.showmore = !this.showmore;
    },
    // 存储数据到本地缓存
    setStorage(key, data) {
      if (!data || !data.length) return;
      // 去重
      data = [...new Set(data)];
      data = data.join(",");

      // 确保数组序列化识别正确
      uni.setStorageSync(key, JSON.stringify(data));
    },
    // 搜索
    search(val = this.queryString) {
      val = this.$u.trim(val);
      if (this.allsearchRecords.length > 20) {
        this.allsearchRecords = this.allsearchRecords.slice(0, 20);
      }
      if (val) {
        // 搜索词埋点
        this.searchType == 1 && this.$u.api.searchWordsVisit({
          searchName: val
        })
        this.allsearchRecords.unshift(val);
        if (this.fromPage) {
          if (this.fromPage == "distributionIndex") {
            this.setStorage(
              "distributionIndexSearchRecords",
              this.allsearchRecords
            );
          } else if (this.fromPage == "distributionUserPage") {
            this.setStorage(
              "distributionUserSearchRecords",
              this.allsearchRecords
            );
          } else if (this.fromPage == "storeIndex") {
            this.setStorage("storeIndexSearchRecords", this.allsearchRecords);
          }
        } else {
          this.setStorage("searchRecords", this.allsearchRecords);
        }
      }
      if (this.fromPage) {
        if (this.fromPage == "storeIndex") {
          // let pages = getCurrentPages();
          // let prevPage = pages[pages.length - 2]; //上一个页面
          // prevPage.$vm.queryForm.spuName = this.queryString
          // uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
          // 	delta: 1
          // });

          this.$wsf.go(
            "MyStore",
            {
              queryString: val,
              storeId: this.storeId,
              agencyStoreId: this.agencyStoreId,
            },
            "redirectTo"
          );
          // this.toSpuList(val);
        } 
        // else if (
        //   this.fromPage == "distributionIndex" ||
        //   this.fromPage == "distributionUserPage"
        // ) {
        //   this.$wsf.go(
        //     "DistributionSpuList",
        //     {
        //       queryString: val,
        //       storeId: this.storeId,
        //       fromPage: this.fromPage,
        //     },
        //     "redirectTo"
        //   );
        // } 
        else {
          this.toSpuList(val || this.queryString, false);
        }
      } else {
        this.toSpuList(val || this.queryString,  false);
      }
    },
    toSpuList(queryString, type = true) {
      // this.searchType 0 关闭当前页传递参数跳转  常用于其他页面跳入搜索页
      queryString = this.$u.trim(queryString);
      
      // 搜索词埋点   type判断搜索发现进入的， false为search进入的，防止二次埋点
      if (queryString && type) {
        this.$u.api.searchWordsVisit({
          searchName: queryString
        })
      }

      // if (
      //     this.fromPage == "distributionIndex" ||
      //     this.fromPage == "distributionUserPage"
      //   ) {
      //     this.$wsf.go(
      //       "DistributionSpuList",
      //       {
      //         queryString,
      //         storeId: this.storeId,
      //         fromPage: this.fromPage,
      //       },
      //       "redirectTo"
      //     );
      //     return
      //   }

      if (!this.searchType) {
        // Todo 商铺搜索
        let query = { queryString, storeId: this.storeId, isSearchCate: 0, fromPage: this.fromPage, }
        if(this.promoteId) {
          query.promoteId = this.promoteId
        }

        this.$wsf.go("SpuList", query, "redirectTo");
        return;
      }

      // this.searchType 1 通过更新上一页参数后返回  常用于搜索结果页跳入搜索页,更新搜索关键字后跳回搜索页更新

      // 返回上一页,并更新上一页的参数
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2]; //上一个页面
      prevPage.$vm.isSearchCate = 0;
      prevPage.$vm.queryString = queryString;

      uni.navigateBack({
        //uni.navigateTo跳转的返回，默认1为返回上一级
        delta: 1,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.applet-search-wrap {
  display: flex;
  flex-direction: column;
  height: 100vh;
  /deep/ .u-load-more-inner {
    margin-bottom: 40rpx;
  }
  // background-color: #F8F8F8;
  .search_wrap {
    margin-left: 88rpx;
    height: 88rpx;
    display: flex;
    align-items: center;
  }
  .block {
    height: 44rpx;
  }
  .content {
    flex: 1;
    position: absolute;
    z-index: 200;
    overflow: scroll;
    // top: 144rpx;
    bottom: 0;
    border-radius: 32rpx;
    background: #f8f8f8;
    ::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
      color: transparent;
    }
  }
  .card_wrap {
    padding: 0 24rpx;
    .header {
      display: flex;
      justify-content: space-between;
      padding: 24rpx 0;
      .title {
        font-size: 32rpx;
        font-weight: bold;
        color: #111111;
      }
      .right {
        display: flex;
        align-items: center;
        font-size: 52rpx;
        color: #c5c5c5;
        .icon {
          display: inline-block;
          width: 32rpx;
          height: 32rpx;
          margin-left: 6rpx;
        }
      }
      @keyframes spin {
        from {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
        }
        to {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }
      .animate-spin {
        animation: spin 1s linear infinite;
      }
    }
    .find {
      position: relative;
      max-height: 152rpx;
      overflow: hidden;
      &::after {
        content: '';
        display: block;
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 8rpx;
        background-color: #f8f8f8;
      }
    }
    .tags {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;
      .tag {
        padding: 8rpx 24rpx;
        line-height: 36rpx;
        margin-right: 24rpx;
        margin-bottom: 24rpx;
        background-color: #f2f2f2;
        font-size: 26rpx;
        color: #111111;
        border-radius: 28rpx;
      }
      .overLine {
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        white-space: nowrap;
      }
      .showmore {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 18rpx;
        background: #f2f2f2;
        border-radius: 50%;
      }
      .arrow {
        width: 16rpx;
        height: 16rpx;
      }
    }
  }
  .applet-template-recommend {
    padding: 0 24rpx;
    background: #f8f8f8;
    .header {
      padding: 24rpx 0 20rpx;
    }
  }
}
</style>
