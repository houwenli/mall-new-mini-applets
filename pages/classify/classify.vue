<template>
    <view class="page" @touchend="pageTouchend">
    <wsf-nav-bar
      :placeholder="true"
      :fixed="true"
      :status-bar="true"
      :shadow="false"
      color="#red"
    >
      <view slot="searchBar">
        <view class="nav-search-bar-wrap">
          <view class="nav-search-bar" @tap="navigationTo('Search')">
            <view class="nav-icon-box">
              <image class="icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/wsf_logo%402x.png" />
            </view>
            <view class="nav-search-form-icon"></view>
            <view class="nav-search-form-value">请输入搜索关键字</view>
          </view>
        </view>
      </view>
    </wsf-nav-bar>

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
            <image class="cate-image" :src="item.url" v-if="item.url" />
            <view class="empty-image" v-else>
              <image src="/static/img/wsf_logo_white.png" />
            </view>
            <text class="cate-name">{{ item.name }}</text>
          </view>
        </block>
      </scroll-view>
      <view class="all-cate" @tap="catePopup = true">
        <text class="text">全部</text>
        <image class="img" src="/static/img/cate_all.png" />
      </view>
    </view>

    <view class="container">
      <view class="second-cate">
        <view
          class="s-cate-box"
          :class="{ active: activeSCIndex == index }"
          v-for="(item, index) in secondCateList"
          :key="index"
          @tap="tapSecondCate(item, index)"
          >
          {{ item.name }}
          <view class="top-corner corner" v-show="activeSCIndex == index">
            <view class="corner-inner"></view>
          </view>
          <view class="bottom-corner corner" v-show="activeSCIndex == index">
            <view class="corner-inner"></view>
          </view>
          </view
        >
      </view>
      <view class="third-cate" id="third-cate">
        <view class="third-cate-header">
          <!-- 商品列表头部 - 导航搜索框模块 -->
          <view class="applet-shops-navbar">
            <view class="applet-shops-navbar-dropdown">
              <wsf-dropdown
                height="72"
                inactive-color="#333"
                active-color="#e60113"
                v-model="searchParams.sortItems"
                @change="sortItemChange"
              >
                <wsf-dropdown-item
                  title="综合"
                  :options="sortItems.priceFilter"
                  type="price"
                ></wsf-dropdown-item>
                <wsf-dropdown-item
                  title="销量"
                  :options="sortItems.saleNum"
                ></wsf-dropdown-item>
                <wsf-dropdown-item
                  title="最新上架"
                  :options="sortItems.skuUpTime"
                ></wsf-dropdown-item>
              </wsf-dropdown>
            </view>
            <!-- <view
              class="applet-shops-navbar-filter-btn"
              :class="[{ acitve: isFilter }]"
              @click="openFilterPopup"
            >
              筛选
              <image
                style="height: 22rpx; width: 22rpx"
                src="@/static/img/screening@2x.png"
                mode=""
              ></image>
            </view> -->
          </view>
        </view>
        <swiper
          vertical="true"
          circular="false"
          current="0"
          bindchange="onSlideChangeEnd"
          style="flex: 1;"
        >
          <swiper-item id="navigation">
            <scroll-view
              :show-scrollbar="false"
              scroll-with-animation
              scroll-anchoring
              :scroll-y="true"
              lower-threshold="80"
              class="third-cate-goods-list"
              @scrolltolower="getSearchList()"
              v-if="flowList && flowList.length > 0"
            >
              <block v-for="(item, index) in flowList" :key='index'>
                <view
                  class="goods"
                  :key="index"
                  @tap="navigationTo('SkuDetail', { skuId: item.skuId, sourceType: item.sourceType, storeIdNumber: item.storeId })"
                >
                  <image
                    class="goods-img"
                    :src="item.url + '?imageView2/1/w/513'"
                  />
                  <view class="goods-info">
                    <view class="name">{{ item.name || item.skuName }}</view>
                    <view class="price">
                      <text class="yuan">¥</text>
                      {{ item.finalPrice | priceFilter }}
                    </view>
                  </view>
                </view>
              </block>
            </scroll-view>
            <view class="list-empty" v-else>
              <image
                class="image"
                src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/isEmpty-icon/classify-empty.png"
              />
              <view class="text">该类目暂无商品上滑查看更多</view>
            </view>
          </swiper-item>
        </swiper>
      </view>
    </view>

    <!-- 底部导航栏 -->
    <wsfTabBar id="tabbar" :selected="2"></wsfTabBar>

    <!-- 遮罩层模块 -->
    <u-mask :show="maskShow" :mask-click-able="false"></u-mask>

    <!-- 筛选弹窗模块 -->
    <u-popup
      v-model="screenPopup"
      z-index="10999"
      mode="right"
      width="620rpx"
      safe-area-inset-bottom
    >
      <view class="applet-spulist-filter">
        <!-- 内容区域 -->
        <scroll-view style="height: 100%" :scroll-y="true">
          <!-- 快捷筛选模块 -->
          <view class="filterHeaderBox">
            <view class="serverBox"> 服务/折扣 </view>
            <view
              class="applet-spulist-filter-model applet-spulist-filter-quick"
            >
              <view
                :class="[
                  { active: freeShipping },
                  'applet-spulist-filter-model-click-item',
                ]"
                @click="this.freeShipping = !this.freeShipping"
                >包邮</view
              >
              <view
                :class="[
                  { active: promotion },
                  'applet-spulist-filter-model-click-item',
                ]"
                @click="this.promotion = !this.promotion"
                >促销</view
              >
              <view
                :class="[
                  { active: hasStock },
                  'applet-spulist-filter-model-click-item',
                ]"
                @click="hasStock = !hasStock"
                >仅看有货</view
              >
            </view>
            <!-- <view :class="[{ active: isWsfStore }, 'applet-spulist-filter-model-click-item']" @click="isWsfStore = !isWsfStore">商城自营</view> -->
          </view>
          <view class="filterHeaderBox">
            <view class="serverBox"> 价格区间 </view>
            <view
              class="applet-spulist-filter-model applet-spulist-filter-quick"
              style="padding-bottom: 24rpx"
            >
              <u-input
                input-align="center"
                type="number"
                v-model.number="priceRange.min"
                class="inputBox"
                clearable="false"
                placeholder="最低价"
                placeholder-style="text-align:center;color:#999;gont-size:22rpx;"
              />
              <text style="color: #666; margin: 0 10rpx">—</text>
              <u-input
                input-align="center"
                type="number"
                v-model.number="priceRange.max"
                class="inputBox"
                clearable="false"
                placeholder="最高价"
                placeholder-style="text-align:center;color:#999;gont-size:22rpx;"
              />
            </view>
            <!-- <view :class="[{ active: isWsfStore }, 'applet-spulist-filter-model-click-item']" @click="isWsfStore = !isWsfStore">商城自营</view> -->
          </view>
          <!-- 筛选模块遍历 -->
          <template v-for="(val, key, i) in aggRes">
            <view
              class="applet-spulist-filter-model"
              :key="key"
              v-if="val.length !== 0"
            >
              <view class="applet-spulist-filter-model-title">{{ key }}</view>
              <!-- <u-line class="u-line" margin="0 0 20rpx 0"></u-line> -->
              <view class="applet-spulist-filter-model-list">
                <template v-for="(item, index) in val">
                  <view
                    :key="index"
                    class="applet-spulist-filter-model-click-item u-line-1"
                    :class="[{ active: iscChooseBrandName(key, item, val) }]"
                    @click="filtersClick(key, item)"
                  >
                    {{ item }}
                  </view>
                </template>
              </view>
            </view>
          </template>
        </scroll-view>
        <!-- 品牌列表 -->
        <!-- <view class="applet-spulist-filter-model">
					<view class="applet-spulist-filter-model-title">品牌</view>
					<u-line class="u-line" margin="0 0 20rpx 0"></u-line>
					<view class="applet-spulist-filter-model-list">
						<template v-for="(item, index) in brandList">
							<view :key="index" class="applet-spulist-filter-model-click-item u-line-1">{{ item.brandName }}</view>
						</template>
					</view>
				</view>
 -->
        <!-- 按钮区域 -->
        <view class="applet-spulist-filter-btn">
          <view
            class="applet-spulist-filter-btn-reset"
            @click="resetFilterPopup"
            >重置</view
          >
          <view
            class="applet-spulist-filter-btn-comfirm"
            @click="confirmFilterPopup"
            >确认</view
          >
        </view>
      </view>
    </u-popup>

    <u-popup v-model="catePopup" z-index="10999" mode="top">
      <wsf-nav-bar
        :placeholder="true"
        :fixed="true"
        :status-bar="true"
        :shadow="false"
        color="#red"
      >
        <view slot="searchBar">
          <view class="nav-search-bar-wrap">
            <view class="nav-search-bar" @tap="navigationTo('Search')">
              <view class="nav-icon-box">
                <image class="icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/wsf_logo%402x.png" />
              </view>
              <view class="nav-search-form-icon"></view>
              <view class="nav-search-form-value">请输入搜索关键字</view>
            </view>
          </view>
        </view>
      </wsf-nav-bar>
      <view class="cate-popup-container">
        <view class="popup-title"> 全部分类 </view>
        <view class="cate-box">
          <block v-for="(item, index) in firstCateList"  :key='index'>
            <view
              class="f-cate"
              :class="{ active: activeFCIndex == index }"
              :key="index"
              @tap="tapFirstCate(item, index)"
            >
              <image class="cate-image" :src="item.url" v-if="item.url" />
              <view class="empty-image" v-else>
                <image src="/static/img/wsf_logo_white.png" />
              </view>
              <text class="cate-name">{{ item.name }}</text>
            </view>
          </block>
        </view>
        <view class="pack-up" @tap="catePopup = false">
          收起 <text class="triangle-up"></text>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import wsfTabBar from "@/components/wsf-tab-bar/wsf-tab-bar.vue";
import wsfNavBar from "@/components/wsf-nav-bar/wsf-nav-bar.vue";
import wsfDropdown from "@/components/wsf-dropdown/wsf-dropdown.vue";
import wsfDropdownItem from "@/components/wsf-dropdown-item/wsf-dropdown-item.vue";
import { priceFilter } from "@/common/wsfValidate.js";
export default {
  components: {
    wsfTabBar,
    wsfNavBar,
    wsfDropdown,
    wsfDropdownItem,
  },
  props: {},
  data() {
    return {
      catePopup: true,
      searchParams: {
        // 搜索请求
        cateId: -1, // 分类
        storeId: -1, // 店铺
        storeCateId: -1, // 店铺分类
        queryString: "", // 关键字
        pageNum: 0, // 页码
        pageSize: 10, // 页容量
        sortItems: [], // 排序状态
        attributes: [], // 分类
        brandNames: [], // 品牌
        stockFilter: 0,
        freeShipping: -1,
        promotion: -1,
        priceRange: {
          min: "",
          max: "",
        },
        secondCateId: "",
      },
      maskShow: false, // 遮罩层
      flowList: [], // 商品数据
      loadStatus: "loadmore", // 商品数据加载状态
      aggRes: [], // 筛选条件列表
      sortItems: {
        priceFilter: [
          // 价格过滤
          {
            label: "综合排序",
            value: -1,
            aliases: "综合",
          },
          {
            label: "价格从低到高",
            value: 0,
            aliases: "价格升序",
          },
          {
            label: "价格从高到低",
            value: 1,
            aliases: "价格降序",
          },
        ],
        saleNum: [
          {
            field: "saleNum",
            order: 1,
          },
        ],
        skuUpTime: [
          {
            field: "skuUpTime",
            order: 1,
          },
        ],
      },
      screenPopup: false, // 筛选弹窗组件
      priceRange: {
        min: "",
        max: "",
      }, //  价格区间
      chooseBrandNames: [], // 选中的品牌
      chooseAttributes: [], // 选中的分类
      freeShipping: false, // 包邮过滤
      promotion: false, // 促销过滤
      hasStock: false, // 是否仅看有货
      firstCateList: [],
      secondCateList: [],
      activeFCIndex: 0,
      firstCateMaxIdx: 0,
      activeSCIndex: 0,
      secondCateMaxIdx: 0,
      isLoading: false, // 是否正在加载
    };
  },
  computed: {
    scrollFCateId() {
      if (this.activeFCIndex > 2) {
        return "fCate" + (this.activeFCIndex - 2);
      } else if (this.activeFCIndex > 1) {
        return "fCate" + (this.activeFCIndex - 1);
      } else {
        return "fCate" + this.activeFCIndex;
      }
    },
  },
  onLoad() {
    this.queryCate(0);
  },
  methods: {
    clearList() {
      this.loadStatus = "loadmore";
      this.searchParams.pageNum = 0;
      this.flowList = [];
    },
    tapFirstCate(item, index) {
      this.catePopup = false;
      this.clearList();
      this.queryCate(item.id, 2);
      this.activeFCIndex = index;
    },
    tapSecondCate(item, index) {
      this.clearList();
      this.activeSCIndex = index;
      this.searchParams.secondCateId = this.secondCateList[index].id;
      this.getSearchList();
    },
    queryCate(parentId = 0, type = 1) {
      //type: 1 查一级分类 2查二级分类 3查三级商品
      let params = {
        parentId,
      };
      this.$u.api.Categorybyparentid(params).then((res) => {
        if (res.code == 200) {
          console.log(type, "type");
          if (type == 1) {
            this.firstCateList = res.data;
            if (parentId == 0) {
              this.activeFCIndex = 0;
              this.firstCateMaxIdx = res.data.length - 1;
              let id = res.data[0].id;
              this.queryCate(id, 2);
            }
          } else {
            this.secondCateList = res.data;
            this.activeSCIndex = 0;
            this.secondCateMaxIdx = res.data.length - 1;
            this.searchParams.secondCateId = res.data[0].id;
            this.clearList();
            this.getSearchList();
          }
        }
      });
    },
    navigationTo(sceneName, params) {
      this.$wsf.go(sceneName, params);
    },
    // 重置搜索条件
    resetSearchParams() {
      console.log("重置搜索条件");
      this.loadStatus = "loadmore";
      let cateId = this.searchParams.secondCateId;
      this.searchParams = {
        // 搜索请求
        cateId: -1, // 分类
        storeId: this.defaultStoreId || -1, // 店铺
        storeCateId: -1, // 店铺分类
        queryString: this.searchParams.queryString, // 关键字
        pageNum: 0, // 页码
        pageSize: 10, // 页容量
        sortItems: [], // 排序状态
        attributes: [], //
        brandNames: [], //
        stockFilter: 0,
        priceRange: {
          min: "",
          max: "",
        },
      };
      this.flowList = [];
    },
    // 打开筛选
    openFilterPopup() {
      // this.hasStock = this.searchParams.stockFilter === 0;
      this.chooseBrandNames = this.searchParams.brandNames;
      this.chooseAttributes = this.searchParams.attributes;
      this.screenPopup = true;
    },
    // 当排序条件改变时
    sortItemChange(e) {
      this.searchParams.sortItems = e
      this.searchParams.pageNum = 0;
      this.loadStatus = "loadmore";
      this.flowList = [];
      this.getSearchList();
    },
    getSearchList() {
      if (this.loadStatus === "loading" || this.loadStatus === "nomore") return;
      this.loadStatus = "loading";
      if (this.type === "gift") {
        this.searchParams.storeIds = this.storeIds;
      }
      this.$u.api.SearchSpu(this.searchParams).then((res) => {
        // 判断是否搜索到了店铺
        this.canSearchShops =
          this.isShowStore > 0 ? !!res.data.storeInfo : false;
        this.storeInfo = res.data.storeInfo;
        this.loadStatus = "loadmore";
        this.isLoading = false;
        if (
          res.data.esSearchResponse.datas &&
          res.data.esSearchResponse.datas.length > 0
        ) {
          this.flowList = this.flowList.concat(res.data.esSearchResponse.datas);
        }
        // if(this.showAggRes){
        this.aggRes = res.data.esSearchResponse.aggRes;
        // this.showAggRes = false
        // }
        if (res.data.esSearchResponse.datas === null) {
          // res.data.esSearchResponse.datas.length < 10
          // this.loadStatus = "nomore";
        } else {
          this.searchParams.pageNum++;
        }
      });
    },
    //下拉刷新,上拉到底,分类没有商品跳转其他分类列表
    goOtherCateList(type = "down") {
      console.log(type, "type");
      let idx =
        type == "down" ? this.activeSCIndex + 1 : this.activeSCIndex - 1;
      console.log(idx, "idx");
      if (
        (type == "down" && idx > this.secondCateMaxIdx) ||
        (type == "up" && idx < 0)
      ) {
        //二级分类到底了,跳转一级分类
        //判断一级分类是否到底
        let firstIdx =
          type == "down" ? this.activeFCIndex + 1 : this.activeFCIndex - 1;
        console.log(firstIdx, "firstIdx");
        if (type == "down" && firstIdx > this.firstCateMaxIdx) {
          this.loadStatus = "nomore";
        } else if (type == "up" && firstIdx < 0) {
          this.clearList();
          this.getSearchList();
        } else {
          this.activeFCIndex = firstIdx;
          this.queryCate(this.firstCateList[firstIdx].id, 2);
        }
        this.isLoading = false;
      } else {
        this.clearList();
        this.activeSCIndex = idx;
        this.searchParams.secondCateId = this.secondCateList[idx].id;
        this.getSearchList();
      }
    },
    pageTouchend(event) {
      // 灵敏度
      let num = 200;
      uni
        .createSelectorQuery()
        .select("#navigation")
        .boundingClientRect((rect) => {
          this.goodListHeight = rect.top;
          console.log(rect, "rect");
          if (this.goodListHeight - 70 > num) {
            //上拉触发
            console.log("上拉触发");
            if (this.isLoading) return;
            this.isLoading = true;
            this.goOtherCateList("up");
          } else if (this.goodListHeight - num < -70) {
            //下拉触发
            console.log("下拉触发");
            if (this.isLoading) return;
            this.isLoading = true;
            this.goOtherCateList("down");
          }
        })
        .exec();
    },
    // 筛选条件点击事件
    filtersClick(key, item) {
      if (key === "品牌") {
        let keyIdx = this.chooseBrandNames.indexOf(item);
        if (keyIdx < 0) {
          this.chooseBrandNames.push(item);
        } else {
          this.chooseBrandNames.splice(keyIdx, 1);
        }
      } else {
        let keyIdx = this.chooseAttributes.findIndex((el) => {
          return el.name === key;
        });
        if (keyIdx < 0) {
          this.chooseAttributes.push({ name: key, values: [item] });
        } else {
          let valIdx = this.chooseAttributes[keyIdx].values.indexOf(item);
          if (valIdx < 0) {
            this.chooseAttributes[keyIdx].values.push(item);
          } else {
            this.chooseAttributes[keyIdx].values.splice(valIdx, 1);
          }
        }
      }
    },
    // 确定筛选条件
    confirmFilterPopup() {
      console.log(this.priceRange.min, "this.priceRange.min+++");
      console.log(this.priceRange.max, "this.priceRange.max+++");
      if (
        this.priceRange.min &&
        this.priceRange.max &&
        this.priceRange.min > this.priceRange.max
      ) {
        this.$u.toast(`最高价不得小于最低价`);
        this.priceRange.min = "";
        this.priceRange.max = "";
        return false;
      }
      this.resetSearchParams();
      this.searchParams.storeId = this.isWsfStore ? 0 : this.defaultStoreId;
      // this.searchParams.stockFilter = this.hasStock ? 0 : -1;
      this.searchParams.brandNames = this.chooseBrandNames;
      this.searchParams.attributes = this.chooseAttributes;

      this.searchParams.freeShipping = this.freeShipping ? 1 : -1;
      this.searchParams.promotion = this.promotion ? 1 : -1;
      this.searchParams.priceRange = this.priceRange;

      this.screenPopup = false;

      if (
        this.searchParams.attributes.length == 0 &&
        this.searchParams.brandNames.length == 0 &&
        this.searchParams.stockFilter == -1 &&
        !this.searchParams.priceRange.min &&
        !this.searchParams.priceRange.max &&
        this.searchParams.freeShipping == -1 &&
        this.searchParams.promotion == -1
      ) {
        this.isFilter = false;
      }

      this.getSearchList();
    },
    // 重置筛选条件
    resetFilterPopup() {
      this.searchParams.brandNames = this.chooseBrandNames = [];
      this.searchParams.attributes = this.chooseAttributes = [];
      this.searchParams.freeShipping =
        this.searchParams.promotion =
        this.searchParams.stockFilter =
          -1;
      this.freeShipping = this.promotion = this.hasStock = false;
      this.searchParams.priceRange = this.priceRange = {
        min: "",
        max: "",
      };
      this.isWsfStore = false;
      this.loadStatus = "loadmore";
      this.searchParams.pageNum = 0;
      this.flowList = [];
      this.isFilter = false;

      // this.resetSearchParams()
      this.getSearchList();
    },
    // 返回筛选条件是否已经点击
    iscChooseBrandName(key, item, val) {
      if (key === "品牌") {
        return this.chooseBrandNames.indexOf(item) >= 0 || false;
      } else {
        let keyIdx = this.chooseAttributes.findIndex((el) => {
          return el.name === key;
        });
        if (keyIdx >= 0) {
          return (
            this.chooseAttributes[keyIdx].values.indexOf(item) >= 0 || false
          );
        } else {
          return false;
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.page {
  background-color: #fff;
  max-height: 100vh;
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
    display: flex;
    .nav-icon-box {
      width: 140rpx;
      margin: 14rpx 0;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      border-right: 2rpx solid #d8d8d8;
      .icon {
        width: 80rpx;
        height: 30rpx;
      }
    }
  }
  .nav-search-form-icon {
    position: absolute;
    top: 6rpx;
    left: 164rpx;
    width: 48rpx;
    height: 48rpx;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAQlBMVEUAAAC7u7u3t7e8vLy6urqysrK7u7u6urq6urq7u7u6urq6urq6urq7u7u5ubm6urq8vLy5ubmzs7O7u7u7u7u6urqsP6AOAAAAFXRSTlMA6gRKHQ6S3vjk4sWxk4BkVIQKqDgqvjYYAAAA5klEQVRIx+2USw7DIAxEMb+SECA/7n/VjhopUloXhNhkkbeJZBg7Y8Di4aZIZT05R94qKeqYSPmEoqntnylfoLm8f8lgDEpLqVUYM1hK+zdsGJI83aQBga2cfzIXR1OpxoxF+x20CP7xYQj5f8OoQXyvIv6fWTHwEdnzQoHELSSU4E5QoZ+SzYTuKnwZd0GwBKYXwB95+NqeCcOC5gUaJpiwy1nyApmz6xXUf6nXdL2tvQdXvxqdl69+vbseUP2Jkm4aAuClW8YMMYriINMvRlEclYdibRjGH8UuGoACFVpY91U83Is3K0EUsCfLDXUAAAAASUVORK5CYII=)
      no-repeat right center;
    background-size: 48rpx 48rpx;
  }
  .nav-search-form-value {
    text-align: left;
    padding-left: 80rpx;
    color: #999999;
    font-size: 24rpx;
  }

  .first-cate {
    z-index: 1;
    width: 100%;
    height: 220rpx;
    background: linear-gradient(180deg, #ffffff 0%, #fff0ed 100%);
    position: relative;
    padding: 12rpx 72rpx 70rpx 0;
    .scroll-x {
      white-space: nowrap;
      .f-cate-box {
        vertical-align: top;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 118rpx;
        margin: 0 11rpx;
        &.active {
          .cate-name {
            color: #fff;
            background-color: #e60113;
            border-radius: 16rpx;
          }
        }
        .cate-image {
          width: 92rpx;
          height: 92rpx;
          border-radius: 32rpx;
        }
        .empty-image {
          width: 92rpx;
          height: 92rpx;
          border-radius: 32rpx;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #dbdbdb;
          image {
            width: 72rpx;
            height: 28rpx;
          }
        }
        .cate-name {
          width: 100%;
          height: 32rpx;
          display: block;
          line-height: 32rpx;
          text-align: center;
          margin-top: 14rpx;
          font-size: 24rpx;
          color: #333;
        }
      }
    }
    .all-cate {
      height: 220rpx;
      width: 72rpx;
      padding-bottom: 44rpx;
      position: absolute;
      right: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      background: linear-gradient(180deg, #ffffff 0%, #feeeec 100%);
      box-shadow: -4rpx 0px 24rpx 0px rgba(255, 67, 33, 0.08);
      .text {
        width: 26rpx;
        font-size: 24rpx;
        color: #333;
        line-height: 34rpx;
      }
      .img {
        margin-top: 14rpx;
        width: 20rpx;
        height: 16rpx;
      }
    }
  }

  .container {
    z-index: 2;
    margin-top: -44rpx;
    height: 100%;
    display: flex;
    padding-bottom: 100rpx;
    margin-bottom: env(safe-area-inset-bottom);
    border-radius: 24rpx 24rpx 0 0;
    .second-cate {
      width: 160rpx;
      background: #f2f2f2;
      height: 100%;
      border-radius: 24rpx 0 0 0;
      overflow: hidden;
      .s-cate-box {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
        font-size: 24rpx;
        padding: 10rpx 20rpx;
        height: 88rpx;
        line-height: 34rpx;
        position: relative;
        .corner {
          width: 8rpx;
          height: 8rpx;
          background: #fff;
          position: absolute;
          right: 0;
          .corner-inner {
            width: 8rpx;
            height: 8rpx;
            background: #F2F2F2;
          }
        }
        .top-corner {
          top: -8rpx;
          .corner-inner {
            border-radius:0 0 8rpx 0;
          }
        }
        .bottom-corner {
          bottom: -8rpx;
          .corner-inner {
            border-radius: 0 8rpx 0 0;
          }
        }
        &.active {
          background: #fff;
          font-weight: bold;
          color: #e60113;
          position: relative;
          &::before {
            content: " ";
            width: 4rpx;
            height: 44rpx;
            background: #e60113;
            border-radius: 2rpx;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }
    .third-cate {
      flex: 1;
      border-radius: 0 24rpx 0 0;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      .third-cate-header {
        border-radius: 0 24rpx 0 0;
        background-color: #fff;
        z-index: 10080;
        position: sticky;
        top: 176rpx;
        left: 0;
        transition: all 0.3s;
        height: 76rpx;
        border: 1rpx solid #f0f0f0;
        // 导航栏样式
        .applet-shops-navbar {
          border-radius: 0 24rpx 0 0;
          z-index: 10080;
          height: 72rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          .applet-shops-navbar-dropdown {
            border-radius: 0 24rpx 0 0;
            flex: 1;
            text-align: center;
            /deep/ .u-dropdown__menu__item__text {
              font-size: 24rpx !important;
              color: #333;
            }
            /deep/ .u-dropdown {
              border-radius: 0 24rpx 0 0;
            }
          }
          .applet-shops-navbar-filter-btn {
            width: 160rpx;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24rpx;
            color: #333;
          }
          .acitve {
            color: $wsf-color-red;
          }
        }
      }
      .list-empty {
        background-color: #fff;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: -72rpx;
        .image {
          width: 360rpx;
          height: 360rpx;
        }
        .text {
          text-align: center;
          margin-top: 20rpx;
          width: 212rpx;
          font-size: 30rpx;
          color: #999;
          line-height: 42rpx;
        }
      }
      .third-cate-goods-list {
        background-color: #fff;
        height: 100%;
        .goods {
          padding: 24rpx;
          height: 218rpx;
          border-bottom: 1rpx solid #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .goods-img {
            width: 136rpx;
            height: 136rpx;
            border-radius: 8rpx;
          }
          .goods-info {
            display: inline-flex;
            flex-direction: column;
            justify-content: space-between;
            width: 370rpx;
            height: 100%;
            .name {
              font-size: 28rpx;
              overflow: hidden;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              color: #333;
              line-height: 40rpx;
            }
            .price {
              font-size: 32rpx;
              color: #e60113;
              .yuan {
                font-size: 24rpx;
              }
            }
          }
        }
      }
    }
  }
  // 筛选弹出层样式
  .applet-spulist-filter {
    background-color: #f6f6f6;
    position: relative;
    height: 100%;
    padding-bottom: 88rpx;
    padding-top: 180rpx;
    &-model {
      background-color: #fff;
      margin-bottom: 20rpx;
      padding-left: 20rpx;
      border-radius: 0 0 20rpx 20rpx;
      .active {
        // background-color: $wsf-color-red;
        // color: #fff;
        border-color: #e60113;
        color: #e60113;
      }
      &-title {
        font-size: 28rpx;
        color: #000;
        height: 96rpx;
        line-height: 96rpx;
        font-weight: bold;
      }
      &-click-item {
        width: 180rpx;
        height: 60rpx;
        line-height: 60rpx;
        margin-right: 20rpx;
        margin-bottom: 20rpx;
        text-align: center;
        font-size: 24rpx;
        color: #000000;
        border-radius: 10rpx;
        padding: 0 10rpx;
        box-sizing: border-box;
        background-color: #f2f2f2;
        border-radius: 30rpx;
        border: 2rpx solid #f2f2f2;
      }

      &-list {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
      }
    }
    &-quick {
      display: flex;
      padding: 20rpx 0 0 20rpx;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
    }

    &-btn {
      background-color: #fff;
      position: absolute;
      height: 100rpx;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 36rpx 16rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-comfirm {
        flex: 1;
        text-align: center;
        font-size: 28rpx;
        color: #fff;
        background-color: $wsf-color-red;
        width: 276rpx;
        height: 68rpx;
        line-height: 68rpx;
        border-radius: 36rpx;
        margin-left: 16rpx;
      }
      &-reset {
        flex: 1;
        text-align: center;
        font-size: 28rpx;
        color: #000;
        // background-color: #fff;
        // background-color: $wsf-color-red;
        border: 1rpx solid #666666;
        width: 276rpx;
        height: 68rpx;
        line-height: 68rpx;
        border-radius: 34rpx;
        margin-left: 36rpx;
      }
    }
  }
  .filterHeaderBox {
    background-color: #fff;
    border-radius: 0 0 20rpx 20rpx;
    .serverBox {
      font-weight: bold;
      font-size: 28rpx;
      color: #000;
      padding-left: 20rpx;
      height: 80rpx;
      line-height: 110rpx;
    }
    .inputBox {
      width: 150rpx;
      height: 60rpx;
      line-height: 60rpx;
      background: #f2f2f2;
      border-radius: 30rpx;
      padding-left: 24rpx;
      padding-right: 24rpx;
    }
  }
}

.cate-popup-container {
  .popup-title {
    padding: 12rpx 0 16rpx 26rpx;
    font-size: 28rpx;
    color: #333;
    line-height: 40rpx;
  }
  .cate-box {
    padding: 0 24rpx 24rpx 24rpx;
    .f-cate {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 118rpx;
      margin: 36rpx 28rpx 0 0;
      vertical-align: top;
      &:nth-child(5n) {
        margin-right: 0;
      }
      &.active {
        .cate-name {
          color: #fff;
          background-color: #e60113;
          border-radius: 16rpx;
        }
      }
      .cate-image {
        width: 92rpx;
        height: 92rpx;
        border-radius: 32rpx;
      }
      .empty-image {
        width: 92rpx;
        height: 92rpx;
        border-radius: 32rpx;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #dbdbdb;
        image {
          width: 72rpx;
          height: 28rpx;
        }
      }
      .cate-name {
        width: 100%;
        height: 32rpx;
        display: block;
        line-height: 32rpx;
        text-align: center;
        margin-top: 14rpx;
        font-size: 24rpx;
        color: #333;
      }
    }
  }
  .pack-up {
    height: 92rpx;
    border-top: 1rpx solid #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #333;
    .triangle-up {
      width: 0;
      height: 0;
      border-left: 6rpx solid transparent;
      border-right: 6rpx solid transparent;
      border-bottom: 6rpx solid #333;
      margin-left: 12rpx;
    }
  }
}
</style>
