<template>
  <view class="smart-position">
    <view class="position-box">
      <view class="search-container">
        <view class="search-input-box">
          <view class="search-input-icon"></view>
          <input
            class="search-input"
            :focus="true"
            @confirm="doneInput"
            type="text"
            confirm-type="search"
            :adjust-position="false"
            @input="onInput"
            placeholder="请输入城市名"
            v-model="searchValue"           
          />
        </view>
      </view>
      <text class="current-position" @tap="back_city(currentPosition.city)" v-if="searchList && searchList.length>0">
        当前城市：{{
        currentPosition.city
      }}</text>

      <view class="current-position-fail" @tap="reloadPosition" v-if="isGetPosition===false">
        <view class="current-position-fail-left">定位失败</view>
        <view class="current-position-fail-right">
          <text>开启定位</text>
          <image class="positon-img" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/samart-position-fail.png" mode=""></image>          
        </view>
      </view>
    </view>
   
    <scroll-view
      class="w100"
      scroll-y="true"
      :scroll-into-view="scrollIntoId"
      :style="{ height: scrollHeight }"
      @touchmove.stop.prevent
      scroll-with-animation    
      @scroll="scroll" 
    >
      <view v-if="!searchValue" >
        <view v-for="(item, index) in list" :id="item.firstLetter" :key="index" class="cityList">
          <view class="letter-header">{{ item.firstLetter }}</view>
          <view class="contents">
            <view
              class="city-div"
              v-for="(city, i) in item['cityList']"
              :key="i"
              @tap="back_city(city)"
            >
              <text class="city">{{ city.name }}</text>
            </view>
          </view>
        </view>
      </view>
      <!-- 搜索结果 -->
      <view v-else class="city-div-result-box">
        <view
          class="city-div city-div-result"
          v-for="(item, index) in searchList"
          :key="index"
          @tap="back_city(item)"          
        >
          <text class="city">{{ item.name }}</text>
        </view>
        </view>
    </scroll-view>

    <!-- 右侧字母 -->   
    <view class="letters letter-city" id="list" v-if="searchValue == ''">
      
      <view>#</view>
      <view class="fmin" v-for="(item, index) in letter" :key="index">
        <view @click="touchStart(item, index)" :class="['fmin-icon', currentIndex == index  ? 'fmin-active' : '']">{{ item.firstLetter }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { Citys } from "./smartPositon.js";
import { qqMap } from "@/common/config.js";
import { GetHomeCityList } from "@/common/smart-api/homeApi";
export default {
  data() {
    return {
      scrollHeight: 0,
      letter: [],
      searchValue: "",
      scrollIntoId: "",
      list: [],
      searchList: [],
      currentPosition: { city: "" }, // 当前定位城市
      hotCityHeight: 0,
      letterBoxHeight: 0,
      currentIndex: 0,
      isGetPosition: null
    };
  }, 
  mounted() {
    
    this.setHeight()    
   
  }, 
  created() {
   
    this.getLocation();
    this.scrollHeight = uni.getSystemInfoSync().windowHeight - 50 + "px";
    this.getCityList()
    
  },
  methods: {
    // 获取定位失败，重新获取定位
    reloadPosition(){
      this.getLocation();
    },
    setHeight(){
      // 获取右侧字母盒子的高度
      let query = wx.createSelectorQuery().in(this);
      query
      .select(".letter-city")
      .boundingClientRect((data) => {       
        this.hotCityHeight = data.height;
      })
      .exec();
      setTimeout(()=>{
        // 获取各个字母分类的块高度      
        query
          .selectAll(".cityList")
          .boundingClientRect((data) => {
            this.letterBoxHeight = data;
            console.log(this.getHeiht(), "各个城市分类的高度");
            this.heightArr = this.getHeiht();
          })
          .exec();  
      }, 1000)
     
    },
    getCityList(){     
      GetHomeCityList({data: {}}).then((res) => {       
        let cityList =  res.data
        if (res.code === 200) {
          this.letter = cityList;
          this.list = cityList;                      
        }
      });
    },
    // 计算每个区域的高度
    getHeiht() {
      let n = this.hotCityHeight;
      let arr = [];
      this.letterBoxHeight.forEach((item) => {
        n = n + item.height;
        arr.push(n);
      });
      return arr;
    },
    calculateIndex(arr, scrollHeight) {
      let index = "";   
      for (let i = 0; i < arr.length; i++) {
        if (scrollHeight >= this.hotCityHeight && scrollHeight < arr[0]) {
          index = 0;
        } else if (scrollHeight >= arr[i - 1] && scrollHeight < arr[i]) {
          index = i;    
        }
      }
      return index;
    },
    // 计算滚动距离
    scroll(e) {
      this.scrollIntoId = ''
      let scrollTop = e.detail.scrollTop + uni.getSystemInfoSync().windowHeight - 100;
      let scrollArr = this.heightArr || [];      
      let index = this.calculateIndex(scrollArr, scrollTop);           
      this.currentIndex = index;
      // this.scrollIntoId = this.list.filter((item,index2)=>{
      //   return index2 == this.currentIndex
      // })[0].firstLetter; 
    },
  
    getLocation() {
      let that = this;
      uni.getFuzzyLocation({
        type: "wgs84",
        success({ latitude, longitude }) {
          qqMap.reverseGeocoder({
            location: {
              latitude,
              longitude,
            },
            success: function (result) {
              that.isGetPosition = true;
              that.currentPosition = { city: result.result.ad_info.city };
            },
            fail: function (error) {
              console.error(error, "error");
              that.isGetPosition = false;
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
                  content: "需要获取您的位置信息，请在设置界面打开相关权限",
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
    },

    back() {
      uni.navigateBack({
        delta: 1,
      });
    },   
    touchStart(letter, index) {    
      this.currentIndex = index;     
      this.scrollIntoId = letter.firstLetter; 
    },

    doneInput() {
      uni.hideKeyboard();
    },

    query(source, text) {
      let res = [];
      var self = this;
      let len = source.length;
      var text = text.toLowerCase();
      for (let i = 0; i < len; i++) {
        //单字母搜索
        if (text.length == 1 && /^[a-zA-Z]$/.test(text)) {
          let arr = [];
          let firstLetter = text.toUpperCase();
          if (firstLetter == source[i].firstLetter) {
            console.log(222, source[i]);
            return source[i].cityList;
          }
        }
        //其它搜索
        if (source[i].cityList) {
          let _len = source[i].cityList.length;
          for (var n = 0; n < _len; n++) {
            let _item = source[i].cityList[n];
            if (new RegExp("^" + text).test(_item.name)) {
              res.push(_item);
              continue;
            }
            if (new RegExp("^" + text).test(_item.city_pinyin)) {
              res.push(_item);
              continue;
            }
            if (new RegExp("^" + text).test(_item.py)) {
              res.push(_item);
              continue;
            }
          }
        }
      }

      return res;
    },

    onInput(e) {
      const value = e.target.value;
      if (value !== "" && this.list) {
        const queryData = this.query(this.list, String(value).trim());
        this.searchList = queryData;
      } else {
        this.searchList = [];
      }
    },

    back_city(item) {     
      uni.switchTab({
        url: "/pages/home/index",
      });
      if (item) {
        uni.setStorageSync("life-position", item.name);
        this.searchValue = "";
      }
      this.back();
    },
  },
};
</script>

<style scoped lang="scss">
.smart-position{
  height: 100%;
  overflow: hidden;
}
.position-box {
  width: 100%;
  background-color: #fff;
  .search-container {
    width: 100%;
    //   height: 64rpx;
    padding: 0 16rpx;
    display: flex;
    align-items: center;
    .search-input-box {
      //   height: 64rpx;
      width: 100%;
      background: #FFFFFF;
      border-radius: 24rpx;
      border: 2rpx solid #111111;
      display: flex;
      align-items: center;        
      margin: 8rpx 0 0;
      .search-input-icon {
        margin: 0 16rpx;
        width: 32rpx;
        height: 32rpx;
        background: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_home_search.png")
          no-repeat center center;
        background-size: 32rpx 32rpx;
      }
      .search-input {
        width: 428rpx;
        height: 80rpx;
        border: 0;
        background: 0;
        color: #999999;
        font-size: 28rpx;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-indent: 0rpx;
        line-height: 62rpx;
      }
    }
  }
  .current-position {
    display: block;
    background: #fff;
    padding: 24rpx;
    font-size: 32rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #191919;
  }
  .current-position-fail{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx;
    &-left{
      font-size: 32rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999;
    }
   
    &-right{
      display:flex;
      align-items: center;    
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      font-size: 26rpx;
      color: #FF450C;
    }
    image{
      width: 32rpx;
      height: 32rpx;
    }
  }
}

.letters {
  position: absolute;
  width: 18rpx;
  top: 25%;
  right: 26rpx;
  text-align: center;
  font-size: 24rpx;
  font-weight: 510;
  .fmin{
   
    line-height: 34rpx;
    &-icon{
      font-size: 24rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #191919;
    }
    &-active{
      font-weight: 500;
      color: #FF450C;
    }
  }
}

.letter-header {  
  padding: 16rpx 24rpx;
  font-size: 28rpx;
  padding-left: 24rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.city-div {
  margin: 0 24rpx;
  padding: 36rpx 0;
  align-items: center;
  border-bottom: 2rpx solid #EEEEEE;
  background: #FFFFFF;
  .city {   
    // padding-left: 24rpx;
    font-size: 32rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #191919;
  }
}
.city-div:last-child{
  border: none;
}
.city-div-result-box{
  margin-top: 24rpx;
  .city-div-result{   
    margin: 0; 
    padding: 36rpx 24rpx;
    border-bottom: none;
  }
}

.contents {
  background-color: #fff;
}
</style>
