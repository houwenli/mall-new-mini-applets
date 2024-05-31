<template>
  <view class="applet-search-wrap">
    <header-search :topSearch="true" title="我的订单"></header-search>      
    <view class="searchBox"   :style="{ top: searchTop }">     
      <view class="inputBox">      
        <slot name="left">
          <image class="left" src="https://wsjc-web.wsecar.com/wsf-mall/home/search.png" mode="widthFix"> </image>
        </slot>
        <input
          :focus="true"
          v-model.trim="keyword"
          class="searchinput"
          type="text"                   
          :placeholder="placeholderText ? placeholderText : '输入商品名称/订单编号'"    
          maxlength="30" 
          placeholder-class="placeholder-style"                                    
        />     
        <view class="right-btn" v-if="keyword"  @click="clearIcon">
          <image class="right" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/search_delete.png"> </image>       
        </view>
      </view>     
      <view class="searchIcon" @click="handleSearch()">搜索</view>
    </view>
    <view class="block" :style="{ top: blockTop }"></view>
      
    <view class="content" :style="{ top }" v-if="searchHistoryList.length>0">
      <view class="card_wrap">
        <view class="header">
          <view class="title">最近搜索</view>
          <view class="right" @click="resetHistory">
            <image
              class="icon"
              :src="ossUrl + 'search-delete-icon.png'"
            ></image>
          </view>
        </view>
        <view class="keywordsList">
          <view
            v-for="(item, index) in searchHistoryList"
            :key="index"
            class="keywordItem"
            @click="handleSearch(item)"
            >
              <view class="keywordItem_content">{{ item }}</view>
            </view
          >         
        </view>
        <view class="search-shade"></view>
      </view>    
    </view>   
     <!-- 轮播图 -->
    <view class="swiper-box" :style="{ top }" v-else>     
      <swipe v-if="swipeContent && swipeContent.list && swipeContent.list.length > 0" :isShowIndicatorDots="false" class="swipe-item" :config="swipeContent"></swipe>
    </view>

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
import headerSearch from "./headerSearch.vue";
import swipe from '@/pages/index/components/swipe/index.vue';
export default {
  components: {
    headerSearch,
    swipe
  },
  data() {
    return {
      ossUrl: this.$oss + "wsf-mall/home/",  
      queryString: "", // 搜索关键词
      keyword: "", // 搜索框输入的关键词
      searchHistoryList: [],
      allsearchRecords: [],    
      showConfirm: false,
      confirmInfo: {
        type: "",
        title: "",
        activeText: "",
        cancelText: "",
      },                                   
      iStatusBarHeight: 0,
      headerIconHeight: 0,
      placeholderText: '',
      swipeContent: null, // 轮播图信息
    };
  },
  mounted(){
    let { height, top } = getApp().globalData.capsule;
    let { statusBarHeight } = uni.getSystemInfoSync()
    this.iStatusBarHeight = statusBarHeight;
    this.headerIconHeight = (top - this.iStatusBarHeight) * 2 + height;
    
  },
  computed: { 
    top() {   
      return this.headerIconHeight + this.iStatusBarHeight + 32 + 6 + 6 + "px";
    },
    blockTop() {
      return this.headerIconHeight + this.iStatusBarHeight + 32 + 6 +  "px";
    },
    searchTop() {    
      return  this.headerIconHeight + this.iStatusBarHeight + "px";
    },
  },
  watch: {
    keyword(val) {
      this.queryString = val;
    },
  },
  onLoad(options) {
    // 判断跳转方式 0 为关闭当前页跳转  1 为修改上一页参数后返回   
    this.placeholderText = options.placeholderText
    this.keyword = options.searchValue || "";    
    this.queryPersonConfigTemp() 
  },
  onShow() {    
    this.loadSearchRecords();    
  },

  methods: {
    // 查询轮播
		queryPersonConfigTemp() {
			this.$u.api.queryPersonConfigTemp(104).then(res => {
				if(res.code === 200) {
					let swipeConfigswipeConfig  = JSON.parse(res.data.content) || {}
          this.swipeContent = swipeConfigswipeConfig.contentList[0] || null
          // 过滤掉没有图片的轮播
					if(this.swipeContent && this.swipeContent.list && this.swipeContent.list.length > 0) {
						this.swipeContent.list = this.swipeContent.list.filter(item => {
							return item.url
						})
					}
				}
			})	
		},
    clearIcon(){
      this.keyword = ''
    },
    clickBackBtn() {     
      uni.navigateBack();
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
      uni.removeStorageSync("orderSearchRecords");     
    },
    // 加载本地存储的搜索记录
    loadSearchRecords() {
      let that = this;
      uni.getStorage({
        key: "orderSearchRecords",
        success: function (res) {
          that.allsearchRecords = JSON.parse(res.data).split(",");
          if (that.allsearchRecords.length > 50) {
            that.searchHistoryList = that.allsearchRecords.slice(0, 50);
          } else {
            that.searchHistoryList = that.allsearchRecords;
          }
          that.searchHistoryList = [...new Set(that.searchHistoryList)];          
        },
        fail: function () {
          that.searchHistoryList = [];
        },
      });
      
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
    handleSearch(val = this.queryString) {
    	if(!val && this.placeholderText){
				val = this.placeholderText
			}
      val = this.$u.trim(val);
      if (this.allsearchRecords.length > 50) {
        this.allsearchRecords = this.allsearchRecords.slice(0, 50);
      }
      if (val) {       
        this.allsearchRecords.unshift(val);       
        this.setStorage("orderSearchRecords", this.allsearchRecords);       
        this.toSpuList(val || this.queryString,  false);
      } else {
        this.showToastError('搜索内容不能为空');
      }         
    },
    showToastError(errMsg, duration = 1500) {
			uni.showToast({
				title: errMsg,
				icon: 'none',
				mask: true,
				duration: duration
			});
		},
    toSpuList(queryString, type = true) {    
      queryString = this.$u.trim(queryString);      
      this.$wsf.go("orderSearchList",{ queryString },"redirectTo");  
      // uni.navigateBack({     
      //   delta: 1,
      // });
    },
  },
};
</script>
<style lang="scss">
.placeholder-style  {         
  color: #C6C6C6;
}
</style>
<style lang="scss" scoped>
.applet-search-wrap {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #F6F6F6;
  .search_wrap {
    margin-left: 88rpx;
    height: 88rpx;
    display: flex;
    align-items: center;
  }
  .content{
    // max-height: 580rpx;
    position: relative;   
    overflow: hidden;   
    border-radius: 0rpx 0rpx 24rpx 24rpx;
    background: #fff;  
    padding-top: 40rpx; 
    padding-bottom: 40rpx;
  }   
  .card_wrap {
    padding: 0 24rpx;
    max-height: 500rpx;
    overflow: hidden;
    // height: calc(100% - 80rpx);
    .header {
      display: flex;
      justify-content: space-between;   
      height: 32rpx;   
      .title {
        font-size: 32rpx;  
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #111111;
        line-height: 1;
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
      max-height: 152rpx;
      overflow: hidden;
    }
    .keywordsList {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;          
      max-height: 456rpx;    
      overflow: hidden;
      .keywordItem {
        max-width: 100%;
        border-radius: 28rpx;
        margin: 24rpx 24rpx 0 0;
        height: 52rpx;
        background-color: #f2f2f2;
        border: none;        
        .keywordItem_content{
          height: 100%;
          line-height: 40rpx;
          padding: 8rpx 24rpx;
          font-size: 24rpx;
          color: #111111;       
          overflow: hidden;
          text-overflow: ellipsis; 
          word-break: break-all;     
          white-space: nowrap;
        }
      }            
    }
    .search-shade{
      width: 100%;
      position: absolute;
      bottom:0;
      left: 0;
      height: 41.5rpx;
      background: #fff;
      border-radius: 0 0 24rpx 24rpx;
    }
  } 
  .block {
    height: 6px;
    background: #FFFFFF;
    position: fixed;
    top: 96px;
    width: 100%;
  }
  .searchBox {
    position: fixed;
    width: 100%;
    padding-left: 24rpx;
    padding-right: 24rpx;  
    padding-top: 12rpx; 
    display: flex;   
    align-items: center;
    background: #FFFFFF;
    height: 38px;   
    .inputBox {
      height: 32px;
      font-size: 28rpx;
      border-radius: 36rpx;
      // width: 100%;   
      flex: 1;  
      padding-left: 16rpx;
      margin-right: 12rpx;
      // background: url('https://wsjc-web.wsecar.com/wsf-mall/home/search.png') no-repeat 16px center #f2f2f2;
      // background-size: 48px;
      display: flex;
      align-items: center;   
      background: #F2F2F2;     
      .left {
        width: 32rpx;
        height: 32rpx;
        display: block;   
        margin-right: 16rpx;    
      }
      .searchinput {
        width: calc(100% - 80rpx);        
        text-align: left;
        color: #111111;                  
        height: 100%;
        background-color: #f2f2f2;
        border: none;
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000;
      }
    
      .right-btn{
        display: flex;
        align-items: center;
        height: 100%;
        .right{
          width: 32rpx;
          height: 32rpx;
          display: block;
          margin-right: 20rpx;
        }
      }
    }
    input.searchinput {
      caret-color: rgba(255, 15, 54, 1);
    }
    .searchIcon {
      width: 108rpx;
      text-align: center;
      height: 56rpx;
      line-height: 56rpx;
      margin: 12rpx 0;      
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #FFFFFF;
      font-weight: 400;
      background: linear-gradient(90deg, #FF6B4E 0%, #FF0A35 100%);
      border-radius: 38rpx;
    }
  } 
}
.swiper-box {
  position: relative;   
  padding-top: 20rpx;
  /deep/ .wrap{
    padding: 0 16rpx;
    image{
      border-radius: 24rpx;
    }
  }
}
/deep/.wsf-confirm-modal-title{
  font-weight: normal;
  font-size: 30rpx;
}
/deep/.wsf-confirm-modal-btn-item{
  font-size: 30rpx;
}
</style>
