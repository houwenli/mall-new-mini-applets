<template>
  <view class="wrap">
    <!-- 头部 -->
    <view class="header">
      <smartNavBar title="福气值" bg-color="rgb(85 0 0 / 0)" />
      <viwe class="header--balance">
        <text class="desc">当前余额</text>
        <text class="money">{{ luckValue }}</text>
      </viwe>
    </view>
    <!-- 内容 -->
    <view class="smartcfuqizhi">
      <!-- 加载页 -->
      <smartTransition v-if="isPageLoading" />
      <view class="smartcfuqizhi__content" v-else>
        <!-- <picker mode="date" :value="month" fields="month" @change="bindDateChange"> 
          <input v-model="month" placeholder="请选择月份"/> 
        </picker> -->

			<view class="uni-padding-wrap" @tap="handleMonth">
				<view class="uni-title">{{pickerDay}}</view>
				<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/fuqizhi/arrow_down.png" alt="">
			</view>
		
			<view class="month-picker"  :style="{display: !visible ? 'none' : 'block'}" >		
				<view class="month-before">起始月份
					<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/fuqizhi/fuqizhi_close.png" alt="" 
						@click="visible=false">
				</view>
				<picker-view :indicator-style="indicatorStyle" :value="value" @change="bindChange" class="picker-view" key=""
					@pickstart="isCanClick=false" @pickend="isCanClick=true">
					<picker-view-column>
						<view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item,index) in months" :key="index">{{item}}月</view>
					</picker-view-column>				
				</picker-view>
				<view class="picker-month">
					<u-button
						@click="handleConfirm"
						shape="circle"
						hover-class="none"
						:loading="!isCanClick"
						:custom-style="{ height: '80rpx', width: '100%', color: '#fff', 'font-size': '32rpx','background': 'linear-gradient(90deg, #FE3040 0%, #FF8011 100%)' }"
					>
					确认
					</u-button>
				</view>
			</view>
		

        <!-- 列表 -->
        <fuqizhiList
          v-if="list && list.length && list.length != 0"
          :list="list"
          :loadStatus="loadStatus"
          @getList="getList"
          @reset="reset"
        />
        <!-- 缺省页 -->
        <smartTransition
          v-else
          topHight="130"
          :typeName="emptyMap[emptyType].type"
          :text="emptyMap[emptyType].text"
        />
      </view>
    </view>
  </view>
</template>

<script>
// 公共组件
import smartTransition from "@/components/smart/smart-transition/smart-transition.vue";
import smartNavBar from "@/components/smart/smart-nav-bar/smart-nav-bar.vue";
// 公共方法
import { fenToYuan } from "@/common/utils.js";
// 内部组件
import fuqizhiList from "./comm/fuqizhiList.vue";
// 接口
import { GetNewFqzStream, GetCustomerFqz } from "@/common/smart-api/userCenterApi";
const date = new Date()
const years = []
const year = date.getFullYear()
const months = []
const month = date.getMonth() + 1
const day = date.getDate()
for (let i = 1990; i <= date.getFullYear(); i++) {
	years.push(i)
}
for (let i = 1; i <= 12; i++) {
	months.push(i)
}
export default {
  components: { smartTransition, fuqizhiList, smartNavBar },
  data() {
    return {
      loadStatus: "loadmore", // 加载更多样式效果
      isLoading: false, // 是否正在加载(分页)
      isPageLoading: true, // 是否正在加载(主页)
      hasMore: true, // 是否拥有更多
      queryForm: {
        //页码配置
        pageNum: 1,
        pageSize: 10,
				createTime: year + '-' + month
      },
      list: [], //福气值列表
      luckValue: 0, //福气值总额
      emptyType: 1, //过度页类型 0 无网络 1 为空
      emptyMap: {
        0: {
          type: "noNetwork",
          text: "暂无网络",
        },
        1: {
          type: "noHistory",
          text: "暂无流水",
        },
      },		
	
		  title: '起始月份',
			years,
			year,
			months,
			month,		
			// value: [9999, month - 1],
			visible: false,
			indicatorStyle: `height: 50px;`,
			pickerDay: year + '年' + month + '月',
			isCanClick: true, // 防止快速滑动时日期选择问题
			nowVal: []
    };
  },
  onLoad(options) {
		this.luckValue = options.luckValue
    this.reset();
    // this.getTotal();
  },
  onPullDownRefresh() {
    this.reset();
  },
  onReachBottom() {
    this.getList();
  },
	computed:{
		value(){
			console.log(years,this.year,years.indexOf(this.year),'wdddddddd');
		
			return [years.indexOf(this.year)>0 ? years.indexOf(this.year) : 9999, this.month-1]
			// return [9999, month-1]
		}		
	},
  methods: {
		handleConfirm(){
			this.year = this.years[this.nowVal[0]]
			this.month = this.months[this.nowVal[1]]		
			this.pickerDay = this.year + '年' + this.month + '月'
			this.visible = false
			this.loadStatus = "loadmore";
      this.hasMore = true;
      this.isPageLoading = true;
      this.isLoading = false;
			this.list = [];
			this.queryForm.pageNum = 1
			this.getList();
		},
		handleMonth(){		
			this.visible = !this.visible 		
		},
		bindChange: function (e) {		
			const val = e.detail.value	
			this.nowVal = val		
			
		},	
    // 数据初始化
    reset() {
      this.loadStatus = "loadmore";
      this.hasMore = true;
      this.isPageLoading = true;
      this.isLoading = false;
      this.queryForm = {
        pageNum: 1,
        pageSize: 10,
				createTime: year + '-' + month
      };
      this.list = [];
      setTimeout(() => {
        this.getList();
      }, 1000);
    },
    // 获取福气值列表
    getList() {	
			if (this.isLoading || !this.hasMore) return;		
      this.isLoading = true;
      this.loadStatus = "loading";
      this.emptyType = 1;
			const now = new Date();
			const hours = ('0' + now.getHours()).slice(-2);
			const minutes = ('0' + now.getMinutes()).slice(-2);
			const seconds = ('0' + now.getSeconds()).slice(-2);


			this.queryForm.createTime = this.year + '-' + this.month + '-' + day + ' ' + hours + ":" + minutes + ":" + seconds
      GetNewFqzStream(this.queryForm)
        .then((res) => {
          //下拉刷新页面
          uni.stopPullDownRefresh();
          this.isPageLoading = false;
          this.isLoading = false;
          this.loadStatus = "loadmore";
          this.list = this.list.concat(res.data);
          this.queryForm.pageNum++;
          this.hasMore = res.data.length === 10;
          this.loadStatus = res.data.length === 10 ? "loadmore" : "nomore";
        })
        .catch((err) => {
          if (this.queryForm.pageNum === 1) {
            this.isPageLoading = false;
            this.emptyType = 0;
          }
        });
    },
    // 获取福气值总额
    getTotal() {
      GetCustomerFqz()
        .then((res) => {
          const { code, data } = res; 
          if (code === 200) {
            this.luckValue = data.integralPointAvailable;
          }
        })
        .catch((err) => {});
    },
  },
};
</script>

<style scoped lang="scss">
.wrap {
  background: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/fuqizhi/fuqizhi-bg.png")
    no-repeat;
  background-size: 100% 580rpx;
}
.header {
  &--balance {
    display: flex;
    flex-direction: column;
    position: relative;
    height: 398rpx !important;
    box-sizing: border-box;
    padding: 128rpx 78rpx 0;
    .desc {
      font-size: 26rpx;
      font-weight: 400;
      color: #191919;
      line-height: 34rpx;
    }
    .money {
      margin-top: 16rpx;
      font-size: 48rpx;
      font-weight: bold;
      font-family: DINAlternate-Bold, DINAlternate;
      color: #ff0a35;
      line-height: 40rpx;
    }
  }
}
.smartcfuqizhi {
	position: relative;
  margin-top: -86rpx;
  background: #f6f6f6;
  border-radius: 24rpx 24rpx 0rpx 0rpx;
  height: calc(100vh - 482rpx);
  box-sizing: border-box;
  &__content {
    height: 100%;
  }
}
.uni-padding-wrap{
	padding: 24rpx 16rpx;
	font-size: 28rpx;
	font-family: PingFangSC, PingFang SC;
	font-weight: 400;
	color: #191919;
	display: flex;
	align-items: center;
	
	image{
		width: 32rpx;
		height: 32rpx;
	}
}
.month-picker{
	display: block;
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 9999;
	background: #FFFFFF;
	border-radius: 24rpx 24rpx 0rpx 0rpx;
	// padding-bottom: 96rpx;
	.month-before{
		margin-top: 34rpx;
		text-align: center;
		font-size: 28rpx;
		font-family: PingFangSC, PingFang SC;
		font-weight: 600;
		color: #111111;
		line-height: 36rpx;
		position: relative;
		image{
			position: absolute;
			right: 24rpx;
			bottom: 0;
			width: 54rpx;
			height: 40rpx;
		}
	}
	.picker-view {
		width: 750rpx;
		height: 642rpx;
		margin-top: 20rpx;
	}
	.item {
		line-height: 100rpx;
		text-align: center;
	}
	.picker-month{
		height: 96rpx;
		background: #FFFFFF;
		box-shadow: 0rpx -4rpx 20rpx 0rpx rgba(189,194,204,0.2);
		padding: 8rpx 24rpx;
	}
}
</style>
