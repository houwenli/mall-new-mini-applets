<template>
  <view
    class="comment-evaluate"
  >
    <view class="module-header" @click="toComments" v-if="commentTotal">
      <view class="num-evaluate">评价<span v-if="commentTotal>=1">({{ commentTotal | filterComment}})</span>
      </view>
      <view class="ofPraise" v-if="goodRate>0">好评率{{ goodRate }}%</view>
    </view>
    <view v-if="commentTotal">
      <view class="friends-item" :class="{'border-bom': commentTotal > 2}" v-for="(item, index) in commentList" :key="index" @click="toComments">
        <view class="comments-head_">
          <img class="head-img" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-hard.png" alt />
          <view class="head-conent">
            <view class="phone-evaluate">
              <view class="phone" v-if="item.isAnonymous == 0">
                <text v-if="item.relename">
                  {{
                    item.relename.length > 1
                      ? item.relename.charAt(0) + '****' + item.relename.charAt(item.relename.length - 1)
                      : item.relename.charAt(0) + '****'
                  }}
                </text>
                <text v-else>
                  {{
                    item.customerName.length > 1
                      ? item.customerName.charAt(0) + '****' + item.customerName.charAt(item.customerName.length - 1)
                      : item.customerName
                      ? item.customerName.charAt(0) + '****'
                      : '******'
                  }}
                </text>
              </view>
              <view class="phone" v-else>
                <text v-if="item.relename">
                  {{ '*****' + item.relename.charAt(item.relename.length - 1) }}
                </text>
                <text v-else>
                  {{ item.customerName ? '*****' + item.customerName.charAt(item.customerName.length - 1) : '******' }}
                </text>
              </view>
              <view class="star">
                <view class="icon-star">
                  <img :src="`https://wsjc-web.wsecar.com/wsf-mall/skuDetail/star-${item.score>=1?'one':'white'}.png`" alt="">
                </view>
                <view class="icon-star">
                  <img :src="`https://wsjc-web.wsecar.com/wsf-mall/skuDetail/star-${item.score>=2?'two':'white'}.png`" alt="">
                </view>
                <view class="icon-star">
                  <img :src="`https://wsjc-web.wsecar.com/wsf-mall/skuDetail/star-${item.score>=3?'three':'white'}.png`" alt="">
                </view>
                <view class="icon-star">
                  <img :src="`https://wsjc-web.wsecar.com/wsf-mall/skuDetail/star-${item.score>=4?'four':'white'}.png`" alt="">
                </view>
                <view class="icon-star">
                  <img :src="`https://wsjc-web.wsecar.com/wsf-mall/skuDetail/star-${item.score>=5?'five':'white'}.png`" alt="">
                </view>
              </view>
            </view>
            <view class="time">{{ item.createTime.split(" ")[0] }}</view>
          </view>
        </view>
        <view class="comments-content_" v-if="item.comment">{{item.comment}}</view>
        <view class="sku_sx">{{ item.skuSpecName }}</view>
        <view class="comments-img_" v-if="item.commentPics.length > 0">
          <scroll-view class="scroll-view_H" scroll-x="true" scroll-left="0">
            <view class="view-flex">
              <view class="scroll-view-img" v-for="(element, imgIndex) in item.commentPics" :key="imgIndex">
                <img :src="element.url" @click.stop="showImg(item.commentPics, imgIndex)" alt="">
              </view>
            </view>
          </scroll-view>
        </view>
        <view class="reply" v-if="item.commentReplies.length">
          <text>商家回复：</text>
          <view class="reply-conent">{{item.commentReplies[0].reply}}</view>
        </view>
      </view>
    </view>
		<view class="all" v-if="commentTotal > 2" @click="toComments">查看全部评价</view>
    <view class="all-botm" v-if="commentTotal > 2"></view>
    <view v-if="commentTotal === 0" class="not-available">暂时还没有评价哦～</view>
		<u-mask :show="showImgDialog" @click="showImgDialog = false">
			<p style="text-align: center;color: #FFFFFF;padding: 20rpx 0;">{{current}}/{{imgList.length}}</p>
				<view class="warp" style="height: 100vh;display: flex;z-index: 111111;align-items: center;justify-content: center;">
					<view class="rect" style="width: 100%;">
						<swiper @change="changeFun" :indicator-dots="imgList.length>0?true:false" indicator-color="#fff" style="height:100vh">
								<swiper-item v-for="(item,i) in imgList" :key='i'>
											<view style="width: 100%;height: 100%; display: flex; align-items: center;">
												<image style="width: 100vw;height: 100vh;" :src="item" mode="aspectFit"></image>
											</view>
								</swiper-item>
						</swiper>
					</view>
				</view>
		</u-mask>
  </view>
</template>

<script>
export default {
  data() {
    return {
			current:1,
      goodRate: 0,
      commentTotal: '',
      commentList: [],
			showImgDialog:false,
			imgList:[]
    };
  },
  props: {
    skuId: {
      type: String,
      default() {
        return "";
      },
    },
  },
  filters: {
    filterComment(val, make) {
        console.log(val, make,'val, make');
        if(val<=100){
          return val + '条'
        }else if(val > 100 && val < 999){
          var baiwei=parseInt(val/100);
          return baiwei + '00+条'
        } else {
          return '999+条'
        }
      }
  },
  methods: {
		changeFun(e){
			console.log(e,"&&&&&&");
			this.current = e.detail.current + 1
		},
		// 预览
		showImg(list,imgindex) {
			let imgList = list.map((item) => {
				return item.url
			})
			// console.log("imgList",imgList)
			this.imgList = imgList
			this.showImgDialog = true;
		},
    initData() {
      this.queryCommentSummarize();
      this.loadComments();
    },
    // 查询评价概括
    queryCommentSummarize() {
      this.$u.api.Querycommentsummarize({ skuId: this.skuId }).then((res) => {
        this.commentSummarize = res.data;
        this.commentTotal = res.data.allCommentCount;
        if (this.commentTotal > 0) {
          let good = res.data.goodCommentCount,
            all = res.data.allCommentCount;
          this.goodRate = parseInt((good / all) * 100);
        }
      });
    },
    //评价
    loadComments() {
      let that = this;
      let data = {
        skuId: this.skuId,
        type: -1,
        pageSize: 10,
        pageNum: 0,
        star: 0
      };
      this.$u.api.Queryskucomments(data).then((res) => {
        let list = res.data.list,
          total = res.data.recordsTotal;
        if (total > 2) {
          this.commentList = list.slice(0, 2);
        } else if (total > 0) {
          this.commentList = list;
        } else {
          this.commentList = [];
        }
      });
    },
    //评价页
    toComments() {
      this.$wsf.go("evaluation", { skuId: this.skuId });
    },
  },
};
</script>

<style scoped lang="scss">
.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24rpx;
  padding-bottom: 14rpx;
  border-bottom: 1rpx solid #EEEEEE;
  .num-evaluate {
    font-size: 26rpx;
    color: #191919;
    font-weight: 600;
    span {
      font-size: 22rpx;
      color: #6E6E6E;
      font-family: PingFangSC-Regular, PingFang SC;
    }
  }
  .ofPraise {
    font-size: 22rpx;
    color: #999999;
  }
}

.friends-item {
  margin-top: 18rpx;
  padding: 0 24rpx;
  padding-bottom: 22rpx;
  &:first-child {
    border-bottom: 1rpx solid #EEEEEE;
  }
}
.border-bom {
  border-bottom: 1rpx solid #EEEEEE;
}
.all {
  width: 196rpx;
  height: 50rpx;
  border-radius: 30rpx;
  border: 1px solid #C3C3C3;
  color: #6E6E6E;
  font-size: 26rpx;
  line-height: 48rpx;
  margin: 0 auto;
  text-align: center;
  margin-top: 20rpx;
}
.all-botm {
  height: 32rpx;
}
.not-available {
  color: #6E6E6E;
  font-size: 26rpx;
  padding-left: 24rpx;
  padding-top: 14rpx;
  padding-bottom: 30rpx;
}
.comments-head_{
  display: flex;
  padding-bottom: 20rpx;
  .head-img {
    width: 64rpx;
    height: 64rpx;
    display: block;
    border-radius: 50%;
  }
  .head-conent {
    display: flex;
    flex-direction: column;
    padding-left: 16rpx;
    padding-top: 2rpx;
    .phone-evaluate {
      display: flex;
      .phone {
        font-size: 26rpx;
        color: #444444;
        // font-weight: 600;
        padding-right: 8rpx;
      }
      .star {
        display: flex;
        align-items: center;
        .icon-star {
          width: 24rpx;
          height: 24rpx;
          img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }
      }
    }
    .time {
      color: #999999;
      font-size: 22rpx;
      font-family: ArialMT;
      line-height: 30rpx;
    }
  }
}
.comments-content_ {
  color: #191919;
  font-size: 26rpx;
  line-height: 34rpx;
  margin-bottom: 10rpx;
  width: 100%;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 这里是超出几行省略 */
  overflow: hidden;
}
.comments-img_ {
  padding-bottom: 20rpx;
  .scroll-view_H {
    width: 100%;
    white-space: nowrap;
    .view-flex {
      display: flex;
        .scroll-view-img {
          width: 160rpx;
          height: 159rpx;
          border-radius: 16rpx;
          margin-right: 8rpx;
          flex-shrink: 0;
          img {
            width: 100%;
            height: 100%;
            display: block;
            border-radius: 16rpx;
          }
        }
    }
	}
}
.reply {
  padding: 12rpx 16rpx;
  background: #F6F6F6;
  border-radius: 16rpx;
  opacity: 0.5;
  text {
    font-size: 26rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #999999;
    line-height: 34rpx;
  }
  .reply-conent {
    font-size: 26rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #6E6E6E;
    line-height: 34rpx;
    padding-top: 8rpx;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2; /* 2 是控制文字几行 */
    width: 638rpx;
  }
}
.sku_sx {
  font-size: 22rpx;
  color: #999999;
  padding-bottom: 12rpx;
}
.comment-evaluate {
  padding: 16rpx 0 0 0;
}
</style>
