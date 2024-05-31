<template>
  <view class="motor-box">
    <view v-if="!isOpen" class="no-positon">
      <image
        src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/no_position.png"
      />
      <text> 您当前未开启位置权限，开启后为您展示您所在地的在售车型 </text>
      <view @click="handleSet"> 去设置 </view>
    </view>
    <view v-if="isOpen">
      <view v-if="motorList && motorList.length <= 0" class="no-positon">
        <image
          src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/no_position.png"
        ></image>
        <text>您当前所在地暂未开通售卖电动车业务，敬请期待~</text>
      </view>

      <!-- <view
        v-else-if="motorList && motorList.length <= 0"
        class="applet-empty u-flex flex-column"
      >
        <image
          src="@/static/img/isEmpty-icon/cart.png"
          style="width: 180rpx; height: 180rpx"
          mode=""
        ></image>
        <view class="applet-empty-tips">还没有电动车哦~</view>
      </view> -->

      <template v-else>
        <view class="motor-box-content">
          <view class="swiper-head">
            <swiper
                class="swiper"
                :autoplay="true"
                :circular="true"
                :duration="1000"
                interval="3000"
                :indicator-dots="false"
                @change="handleChange">
                <swiper-item class="swiper-item" v-for="(item,index) in bannerList" :key="index">
                    <image :src="item"></image>
                </swiper-item>
            </swiper>
            <view class="dotList">
              <view :class="currentDot == index ? 'dotItem dotRed': 'dotItem'" v-for="(item,index) in bannerList.length" :key="index"></view>
            </view>
          </view>
          <view
            v-for="(item, index) in motorList"
            :key="index"
            class="motor-box-content-item"
            @click="goToDetail(item.id)"
          >
            <view class="bannerBox">
              <swiper
                class="swiper"
                :interval="3000"
                :circular="true"
                :autoplay="false"
                :current="item.swiperCurrent"
                :indicator-dots="false"
                @change="bannerChange($event, item)"
              >
                <swiper-item class="swiper-items">
                  <image
                    :src="item.imageUrl"
                    mode="aspectFill"
                    class="swiper-img"
                    @tap="previewImg(index, item.imageUrl)"
                  />
                </swiper-item>
                <!-- <swiper-item
                  class="swiper-items"
                  v-for="(ele, index) in item.spuImages"
                  :key="index"
                >
                  <video
                    style="width: 100%; height: 100%"
                    id="videoBanner"
                    ref="videoBanner"
                    :poster="item.spuVideoPic"
                    :src="item.spuVideo"
                    :show-center-play-btn="true"
                    :show-loading="false"
                    object-fit="fill"
                    :controls="controlsShow"
                    :seeked="true"
                    class="bannerVideo"
                    v-if="item.bannerCurrent == 0 && item.spuVideo"
                    @play="play()"
                    @ended="endVideo()"
                  ></video>
                  <image
                    :src="ele"
                    mode="aspectFill"
                    class="swiper-img"
                    @tap="previewImg(index, item.spuImages)"
                  ></image>
                </swiper-item>  -->
              </swiper>
              <view
                class="currentBox"
                v-if="item.spuImages && item.spuImages.length"
              >
                {{ item.bannerCurrent + 1 }}/{{
                  item.spuImages && item.spuImages.length
                }}
              </view>
            </view>

            <!-- <view class="price-box">
              <p class="current-price">
                <template
                  v-if="item.shelvesStatus == 0 || item.shelvesStatus == 2"
                >
                  <text>暂无售价</text>
                </template>
                <template v-else>
                  <view>
                    <i>￥</i>
                    <span>{{ skuPriceFloat(item, item.price)[0] }}</span>
                    <text class="u-font-text">{{
                      "." + skuPriceFloat(item, item.price)[1]
                    }}</text>
                  </view>
                  <view
                    v-if="item.afterCouponPrice && item.sourceType == 1"
                    class="reduced-price"
                  >
                    <span>券后</span>
                    <i>￥</i>
                    <text class="txt1">{{
                      skuPriceFloat(item, item.afterCouponPrice)[0]
                    }}</text>
                    <text class="txt2">{{
                      "." + skuPriceFloat(item, item.afterCouponPrice)[1]
                    }}</text>
                  </view>
                </template>
              </p>
            </view> -->
            <view class="info-box">
              <view class="skuName">{{item.motorcycleTypeName}}</view>
              <view class="storePosition">
                <view class="storeIcon">门店</view>
                <view class="storeName">{{item.enterpriseAgencyAddressVo.orgName}}</view>
                <view class="address">
                  <template v-if="item.enterpriseAgencyAddressVo.distance">约{{item.enterpriseAgencyAddressVo.distance | filterDistance}} |</template>
                  <template v-if="item.enterpriseAgencyAddressVo.address">{{item.enterpriseAgencyAddressVo.address}}</template>
                </view>
              </view>
              <view class="moreStore">
                <view class="icon-item" @click.stop="openMap(item)">
                  <image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/navigation.png"></image>
                  <view>导航</view>
                </view>
                <!-- <view class="icon-item mgl12" @click.stop="openPhone">
                  <image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store_icon_call.png"></image>
                  <view>电话</view>
                </view> -->
                <view class="moreBtn" @click.stop="handleStore">更多门店</view>
              </view>
            </view>
          </view>
        </view>
      </template>

      <u-loadmore
        v-if="motorList && motorList.length > 0"
        ref="backTop"
        bg-color="#f5f5f5"
        font-size="22"
        color="#c3c3c3"
        margin-bottom="40"
        :loadText="loadText"
        :status="loadStatus"
      ></u-loadmore>

      <wsf-popup
        class="store-popup"
        v-model="showAll"
        mode="bottom"
        z-index="10186"
        height="1280rpx"
        title="选择提车门店"
      >
        <scroll-view class="store-box" scroll-y='true' @scrolltolower="getMoreStores">
          <view class="store-view">
            <store-item
            v-for="(item, index) in storeList"
            :key="index"
            :storeItem="item"
            :sendStore="sendStore"
            :mobile="mobile"
          ></store-item>
          <p class="more-tip">更多门店正在筹备中，敬请期待</p>
          </view>
        </scroll-view>
      </wsf-popup>

      <!-- 联系门店 -->
	    <motorPhone 
	    	:motorPhoneShow="motorPhoneShow"
	    	@handleCloseDialog="motorPhoneShow=false"
	    	:mobile="mobile" 
	    	:idNumber="storeItem.idNumber"
	    	:cityCode="sendStore.cityCode"
	    >
	    </motorPhone>
    </view>
  </view>
</template>
<script>
import { qqMap } from "@/common/config.js";
import StoreItem from "./components/store-item.vue";
import motorPhone from "./components/motorPhone.vue";
export default {
  components: {
    StoreItem,
    motorPhone
  },
  data() {
    return {
      swiperCurrent: 0,
      bannerCurrent: 0,
      controlsShow: true,      
      motorList: [],
      queryForm: {
        pageNum: 0, // 设置起始页码
        pageSize: 10, //返回每页数据的个数
      },
      sendData: {},
      loadText: {
        loadmore: "上拉加载更多",
        loading: "努力加载中",
        nomore: "有更多车型正在筹备中，敬请期待~",
      },
      loadStatus: "loadmore", // 加载更多样式效果
      isLoading: false, // 是否正在加载
      hasMore: true, // 是否拥有更多

      isOpen: true, // 是否开启定位
      longitude: "",
      latitude: "",
      showAll: false,
      isStoreLoading: false, // 是否正在加载
      hasStoreMore: false, // 是否拥有更多
      motorPhoneShow: false,
      bannerList:['https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/motor_swiperA.png','https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/motor_swiperS.png'],
      storeList:[],
      queryStoreForm: {
        currentPageNum: 1, // 设置起始页码
        pageSize: 10, //返回每页数据的个数
      },
      mobile: '',
      choosedItem:[],
      currentDot: 0,
      //精确定位参数
      precisionGPS: {
        areaCode: '',
        longitude: '',
        latitude: '',
      }
    };
  },
  filters: {
    filterDistance(val) {
      if(val){
        if(val > 1000){
          return (val/1000).toFixed(1) + 'km'
        } else {
          val = String(val)
          let index = val.indexOf('.')
          if(index>-1){
            return val.slice(0, index) + 'm'
          } else {
            return val + 'm'
          }
        }
      } else {
        return ''
      }
    }
  },
  onShow() {
    console.log(uni.getStorageSync('precisionGPS'), 'ioio');
    this.precisionGPS = uni.getStorageSync('precisionGPS') ? JSON.parse(uni.getStorageSync('precisionGPS')) : {}
    this.getLocation();
  },
  onLoad(option) {
    let userInfo = uni.getStorageSync("userInfo");
    this.mobile = userInfo.mobile;
  },
  onPullDownRefresh() {
    this.queryForm.pageNum = 0,
    this.isLoading = false, // 是否正在加载
    this.hasMore = true, // 是否拥有更多
		this.motorList = [];
		this.loadUserCollectionList()
	},
  onReachBottom() {
    this.loadUserCollectionList();
  },
  methods: {
    goToDetail(skuId) {
      this.$wsf.go("ToMotor", { skuId });
    },
    skuPriceFloat(item, sPrice) {
      let price = 0;
      if (item && sPrice) {
        price = sPrice;
      }
      price = price.toFixed(2).split(".");
      return price;
    },
    previewImg(index, images) {
      uni.previewImage({
        current: index,
        urls: images,
        indicator: "default",
      });
    },
    play() {
      this.controlsShow = true;
    },

    // 视频播放完
    endVideo() {
      console.log(123, "播放结束");
      // this.controlsShow = false
    },
    // 轮播切换
    bannerChange(data, item) {
      console.log(data, item, "data");
      item.bannerCurrent = data.target.current;
      item.swiperCurrent = data.target.current;
    },
    handleSet() {
      let that = this;
      // 微信小程序位置信息未开启
      uni.getSetting({
        success: (res) => {
          	let authStatus = res.authSetting["scope.userLocation"];
			if (!authStatus) {						
				uni.openSetting();				
			} else{
				uni.showModal({
					title: "需要获取地理位置",
					content: "请检查是否开启微信授权",
					showCancel: false,
				});
				that.isOpen = false;
			}
		},
      });
    },
    getLocation() {
      let that = this;
      uni.getSystemInfo({
        success({ locationEnabled, locationAuthorized }) {
          // locationEnabled 判断手机定位服务是否开启
          // locationAuthorized 判断定位服务是否允许微信授权
          if (!locationEnabled && !locationAuthorized) {
            // GPS未开启 与 GPS未给微信授权定位服务
            that.isOpen = false;
            uni.showModal({
              title: "需要获取地理位置",
              content: "请检查是否开启微信授权",
              showCancel: false,
            });			
          } else if (locationEnabled && !locationAuthorized) {
            // GPS已开启 与 GPS未给微信授权定位服务
            that.isOpen = false;
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
			    	type: 'wgs84',
			    	success({ latitude, longitude }) {					
					that.longitude = longitude;
					that.latitude = latitude;
					that.isOpen = true;

					qqMap.reverseGeocoder({
						location: {
							latitude,
							longitude,
						},
						success: function (result) {
							that.sendData = {
							  cityCode: String(result.result.ad_info.adcode).slice(0, 4) + "00",
							  longitude,
							  latitude,
							  sourceType: 2, // 0万顺福实体店wsforg 1- applets 2-mobile 来源入口
							};
              that.initData()
						},
						fail: function (error) {
							console.error(error, "error");
							that.sendStore.cityCode = null;
						},
					});
			    	},
			    	fail() {
					// 微信小程序位置信息未开启
					uni.getSetting({
						success: (res) => {
							let authStatus = res.authSetting["scope.userLocation"];
							if (!authStatus) {
								that.isOpen = false;
								uni.showModal({
									title: "需要获取地理位置",
									content: "需要获取您的位置信息，请在设置界面打开相关权限",									
									showCancel: false,
								});							
							} else {
								that.isOpen = false;
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
								
            // uni.authorize({
            //   scope: "scope.userLocation",
            //   success() {                
            //   },              
            // });
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
    loadUserCollectionList() {
      console.log('1111');
      if (this.isLoading || !this.hasMore) return;
      console.log('2222');
      this.isLoading = true;
      this.loadStatus = "loading";
      let data = { ...this.queryForm, ...this.sendData };
      //乘客小程序传来的精确定位 有就用
      data.cityCode = this.precisionGPS.cityCode ? this.precisionGPS.cityCode.slice(0, 4) + "00" : data.cityCode
      data.longitude = this.precisionGPS.longitude ? this.precisionGPS.longitude : data.longitude
      data.latitude = this.precisionGPS.latitude ? this.precisionGPS.latitude : data.latitude 
      delete data.sourceType
      this.$u.api.QueryEleCar(data).then((res) => {;
        this.isLoading = false;
        this.loadStatus = "loadmore";
        if (res.code == 200) {
          this.motorList = this.motorList.concat(res.data.list);
          this.motorList.forEach((item) => {
            item.bannerCurrent = 0;
            item.swiperCurrent = 0;
          });

          this.queryForm.pageNum++;
          this.hasMore = res.data.list.length === 10;
          this.loadStatus = res.data.list.length === 10 ? "loadmore" : "nomore";
          console.log(res, "商品收藏数据");
        }
      });
    },
    handleStore() {
      this.showAll = true
    },
    getMoreStores() {
      if (this.isStoreLoading || this.hasStoreMore) return;
      this.isStoreLoading = true;
      let data = {
        ...this.sendData,
        ...this.queryStoreForm
      }
      delete data.sourceType
      //乘客小程序传来的精确定位 有就用
      data.cityCode = this.precisionGPS.cityCode ? this.precisionGPS.cityCode.slice(0, 4) + "00" : data.cityCode
      data.longitude = this.precisionGPS.longitude ? this.precisionGPS.longitude : data.longitude
      data.latitude = this.precisionGPS.latitude ? this.precisionGPS.latitude : data.latitude
      this.$u.api.QueryNearbyStores(data).then((res) => {
        this.isStoreLoading = false;
        if (res.code == 200) {
          this.storeList = this.storeList.concat(res.data);
          this.queryStoreForm.currentPageNum++;
          this.hasStoreMore = this.storeList.length == res.total;
        }
      }).catch(err => {})
    },
    initData() {
      this.loadUserCollectionList();
      this.getMoreStores()
    },
    openMap(item) {
      this.storeItem = item.enterpriseAgencyAddressVo
      if(!this.storeItem.longitude || !this.storeItem.latitude) {
        uni.showToast({
					title: '暂无门店定位！',
					icon: 'none'
				});
        return
      }
			uni.openLocation({
				name: this.storeItem.orgName,
        address: this.storeItem.address,
				longitude: Number(this.storeItem.longitude),
				latitude: Number(this.storeItem.latitude),
				scale: 12,
				success: function () {},
			});
		},
    openPhone() {		
			this.motorPhoneShow = true			
		},
    handleChange(e) {
      this.currentDot = e.detail.current
    }
  },
};
</script>
<style lang="scss">
.motor-box {
  width: 100%;
  // height: 100%;
  overflow-y: auto;
  .motor-box-content {
    padding: 24rpx;
    .swiper-head {
      margin-bottom: 16rpx;
      position: relative;
      .swiper {
        height: 200rpx !important;
        .swiper-item {
          height: 200rpx !important;
          border-radius: 24rpx;
          image {
            width: 100%;
            height: 100%;
            border-radius: 24rpx;
          }
        }
      }
      .dotList {
        position: absolute;
        display: flex;
        bottom: 16rpx;
        left: 50%;
        transform: translateX(-50%);
        .dotItem {
          width: 24rpx;
          height: 6rpx;
          background-color: #FFBCBB;
          margin-right: 2px;
          border-radius: 4rpx;
        }
        .dotRed {
          background-color: #DE3A38;
        }
      }
    }
    .motor-box-content-item {
      margin-bottom: 24rpx;
      background: #ffffff;
      border-radius: 24rpx;
      padding-bottom: 24rpx;

      .bannerBox {
        position: relative;
        .currentBox {
          position: absolute;
          right: 32rpx;
          bottom: 32rpx;
          color: #fff;
          height: 40rpx;
          display: inline-flex;
          align-items: center;
          padding: 0 16rpx;
          border-radius: 24rpx;
          background: rgba(0, 0, 0, 0.8);
          font-size: 24rpx;
        }
        .swiper {
          width: 100%;
          height: 702rpx;
          .swiper-img {
            width: 100%;
            height: 100%;
            border-radius: 24rpx;
          }
        }
        .swiper-items {
          border-radius: 0rpx 0rpx 24rpx 24rpx;
        }
        .bannerVideo {
          position: absolute;
          width: 100%;
          height: 375px;
          z-index: 1;
        }
      }
      .price-box {
        margin: 20rpx 24rpx;
        .current-price {
          color: #ff0a35;
          font-weight: 600;
          display: flex;
          height: 60rpx;
          line-height: 60rpx;
          i {
            display: inline;
            font-size: 32rpx;
            font-family: DINAlternate-Bold, DINAlternate;
            color: #ff0a35;
          }
          span {
            font-size: 60rpx;
            font-family: DINAlternate-Bold, DINAlternate;
          }
          .u-font-text {
            font-size: 32rpx;
            font-family: DINAlternate-Bold, DINAlternate;
          }
          .reduced-price {
            height: 60rpx;
            line-height: 60rpx;
            background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
            border-radius: 30rpx 30rpx 30rpx 4rpx;
            padding: 0 16rpx;
            color: #fff;
            font-weight: 600;
            margin-left: 8rpx;
            span {
              font-size: 22rpx;
              font-weight: 500;
              font-family: PingFangSC-Medium, PingFang SC;
            }
            i {
              font-size: 26rpx;
              padding-left: 4rpx;
              font-family: DINAlternate-Bold, DINAlternate;
              color: #ffffff;
            }
            .txt1 {
              font-size: 40rpx;
              font-family: DINAlternate-Bold, DINAlternate;
            }
            .txt2 {
              font-size: 26rpx;
              font-family: DINAlternate-Bold, DINAlternate;
            }
          }
          .discount-price {
            font-size: 24rpx;
            font-weight: 500;
            color: #999999;
            text-decoration: line-through;
          }
          .performance-mark {
            vertical-align: bottom;
            margin-left: 16rpx;
            margin-bottom: 20rpx;
            padding: 0 8rpx;
            display: inline-flex;
            align-items: center;
            height: 32rpx;
            border-radius: 4rpx;
            border: 1rpx solid #fd302c;
            color: #fd302c;
            font-size: 20rpx;
          }
        }
      }
      .info-box {
        padding: 20rpx 24rpx 0;
        .skuName {
          font-weight: 500;
          font-size: 16px;
          color: #111111;
          margin-bottom:8rpx;
        }
        .storePosition {
          display: flex;
          align-items: center;
          margin-bottom:8rpx;
          .storeIcon {
            font-size: 11px;
            color: #fff;
            background-color: #FE3040;
            border-radius: 8rpx;
            width: 60rpx;
            text-align: center;
            padding: 1px 0;
          }
          .storeName {
            font-size: 13px;
            color: #191919;
            margin: 0 8rpx;
          }
          .address {
            flex: 1;
            font-size: 11px;
            color: #999999;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .moreStore {
          display: flex;
          align-items: center;
          padding: 8rpx 0;
          justify-content: space-between;
          .icon-item {
            display: flex;
            flex-direction: column;
            margin-right: 24rpx;
            image {
              width: 40rpx;
              height: 40rpx;
            }
            view {
              color: #999999;
              font-size: 11px;
            }
          }
          .mgl12 {
            margin-left: 24rpx;
          }
          .moreBtn {
            flex: 3;
            font-size: 16px;
            font-weight: 500;
            padding: 20rpx 0;
            color: #FFFFFF;
            background: linear-gradient(270deg, #FE3040 0%, #FF8011 100%);
            border-radius: 20px;
            text-align: center;
          }
        }
      }

    }
  }
  .store-popup {
    // background: #F6F6F6;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    .store-popup-title {
      text-align: center;
      color: #000d1d;
      font-size: 32rpx;
      line-height: 44rpx;
      position: relative;
      padding-top: 24rpx;
      padding-bottom: 24rpx;
      // background: #fff;
      > image {
        position: absolute;
        right: 48rpx;
        top: 30rpx;
        height: 40rpx;
        width: 54rpx;
      }
    }
    .store-box {
      background: #f6f6f6;
      border-radius: 24rpx 24rpx 0 0;
      position: relative;
      flex: 1;
      box-sizing: border-box;
      height: 100%;
      .store-view {
        padding: 24rpx 32rpx;
        padding-bottom: 120rpx;
      }
      .more-tip {
        margin-top: 32rpx;
        color: #999;
        font-size: 26rpx;
        text-align: center;
        line-height: 34rpx;
      }
    }
  }
  .no-positon {
    image {
      display: block;
      margin: 280rpx auto 16rpx;
      width: 320rpx;
      height: 320rpx;
    }
    text {
      margin: 0 auto;
      display: block;
      width: 476rpx;
      height: 68rpx;
      font-size: 26rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #444444;
      line-height: 34rpx;
      text-align: center;
    }
    view {
      margin: 0 auto;
      width: 192rpx;
      height: 72rpx;
      line-height: 72rpx;
      background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
      border-radius: 40rpx;
      text-align: center;
      margin-top: 20rpx;
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
    }
  }
}
</style>
