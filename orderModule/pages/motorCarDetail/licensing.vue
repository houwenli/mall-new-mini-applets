<template>
  <view class="licensing-box">

	<view v-if='!showDetail'>
        <view
          v-if="licensingList.length <= 0"
          class="applet-empty u-flex flex-column"
        >
          <image
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/cart.png"
            style="width: 180rpx; height: 180rpx"
            mode=""
          ></image>
          <view class="applet-empty-tips">还没有上牌指引哦~</view>
        </view>
        <template v-else>
			<view class="licensing-box-content">
				<view
				v-for="(item, index) in licensingList"
				:key="index"
				class="licensing-box-content-item"
				@click="goTo(item)"
				>
				<image :src="item.guidanceImage" />
				<view>
					<text> {{ item.guidanceTitle }} </text>
					<!-- <view> {{ item.contentConfig }} </view> -->
					<!-- <rich-text :nodes="item.contentConfig" class="rich-text"></rich-text> -->
				</view>
				</view>
			</view>
		</template>
	</view>
	<view class="licensing-box-content" v-else>    
		<rich-text :nodes="contentConfig" class="licensing-box-content-item"></rich-text>        
	</view>


    <u-loadmore
      v-if="licensingList.length > 0 && !showDetail"
      ref="backTop"
      bg-color="#f5f5f5"
      font-size="22"
      color="#c3c3c3"
      margin-bottom="40"
      :loadText="loadText"
      :status="loadStatus"
    ></u-loadmore>
  </view>
</template>
<script>
export default {
  data() {
    return {
      licensingList: [
        // {
        //   title: "【深圳】电动车上牌指引",
        //   content:
        //     "正文缩写至卡片首页，最多展示3行，超出…正文缩写至卡片首页，最多展示3行，最多展示3行最多展示3行最多展示3行最多展示3行，最多展示3行最多展示3行最多展示3行最多展示3行，最多展示3行最多展示3行最多展示3行最多展示3行，最多展示3行最多展示3行最多展示3行",
        // },
      ],
      queryForm: {
        pageNum: 0, // 设置起始页码
        pageSize: 10, //返回每页数据的个数
      },
      loadText: {
        loadmore: "上拉加载更多",
        loading: "努力加载中",
        nomore: "我也是有底线的~",
      },
      loadStatus: "loadmore", // 加载更多样式效果

      isLoading: false, // 是否正在加载
      hasMore: true, // 是否拥有更多
	  showDetail: false,
	  contentConfig: ''
    };
  },
  onLoad(option) {
	this.showDetail = option.showDetail
	this.contentConfig = option.contentConfig
    this.loadUserCollectionList();
  },
  /* onShow() {
		// 加载收藏信息
		this.loadUserCollectionList();
	}, */
  onReachBottom() {
    this.loadUserCollectionList();
  },
  methods: {
    goTo(item){		
      	this.$wsf.go("Licensing", { showDetail: true, contentConfig: item.contentConfig });
    },
    onBackBtnClick() {
      uni.navigateBack();
    },
    loadUserCollectionList() {
      if (this.isLoading || !this.hasMore) return;
      this.isLoading = true;
      this.loadStatus = "loading";
      let data = this.queryForm;
      this.$u.api.QueryLicence(data).then((res) => {
        this.isLoading = false;
        this.loadStatus = "loadmore";
        if (res.code == 200) {
          // res.data.list.map((item, index) => {
          //   res.data.list[index].show = false;
          // });
          this.licensingList = this.licensingList.concat(res.data.list);
          this.queryForm.pageNum++;
          this.hasMore = res.data.list.length === 10;
          this.loadStatus = res.data.list.length === 10 ? "loadmore" : "nomore";
          console.log(res, "商品收藏数据");
        }
      });
    },
  },
};
</script>
<style lang="scss">
.licensing-box {
  width: 100%;
  .licensing-box-content {
    padding: 24rpx;
    .licensing-box-content-item {
      margin-bottom: 24rpx;
      padding: 20rpx;
      display: flex;
      justify-content: space-between;
      background: #ffffff;
      border-radius: 24rpx;
      image {
        width: 300rpx;
        height: 160rpx;
        margin-right: 8rpx;
        border-radius: 20rpx;
      }
      > view {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        margin-left: 8px;
        width: calc(100% - 300rpx);
        text {
          font-size: 32rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #111111;
          line-height: 40rpx;
        }
        view {
          font-size: 26rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;

          overflow: hidden;
          /*超出内容隐藏*/
          text-overflow: ellipsis;
          /*超出内容为省略号*/
          display: -webkit-box;
          /*内容不换行*/
          -webkit-line-clamp: 3;
          /*超出几行*/
          -webkit-box-orient: vertical;
          /*从上到下垂直排列子元素*/
          word-break: break-all;
        }
      }
      .rich-text{
        word-break: break-all;
      }
    }
  }
}
</style>
