<template>
  <view class="listBox">
    <block>
      <view class="title" v-if="storeList.length > 0">
        共订阅<text>{{ storeList.length }}</text>个店铺
      </view>
      <loading v-if="isLoading"></loading>

      <view v-else>
        <view v-if="storeList.length > 0">
          <view
            v-for="(item, index) in storeList"
            :key="index"
            class="card"
            hover-class="u-hover-class"
            @click="navigationTo('StoreIndex', { storeId: item.idNumber })"
          >
            <view class="card_top">
              <view class="card_top_img">
                <image
                  class="icon"
                  :src="
                    item.imageUrl ||
                    'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/myStore/store.png'
                  "
                ></image>
              </view>
              <view class="card_top_name">
                <view class="name ellipsis">
                  {{ item.storeName }}
                </view>
                <view class="follow" v-if="item.focusCount && item.focusCount != 0">
                  订阅数{{ item.focusCount | filterFraction }}
                </view>
              </view>
            </view>
            <view
              class="card_content"
              v-if="item.skuList && item.skuList.length != 0"
            >
              <view
                v-for="(ite, idx) in item.skuList"
                :key="idx"
                class="card_conten_img"
              >
                <image :src="ite.url || 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/myStore/prestrain.png'"></image>
              </view>
            </view>
          </view>
        </view>

        <!-- 缺省页 -->
        <view v-else class="no-empty">
          <image
            class="img"
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/myStore/empty.png"
            alt=""
          />
          <view class="text">没有关注的实体店~</view>
        </view>

      </view>

    </block>

  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      storeList: [],
      isLoading: true, // 是否正在加载
    };
  },
  filters: {
    filterFraction(val) {
      if (val === null || isNaN(val)) {
        return "";
      }
      if (val * 1 < 10000) {
        return val;
      } else {
        return (val / 10000).toFixed(1) + "万";
      }
    },
  },
  onLoad(option) {
    this.isMy = option.type == 1;
    uni.setNavigationBarTitle({
      title: this.isMy ? "我的店铺" : "订阅店铺",
    });
    this.getStoreList();
  },
  methods: {
    /* 跳转 */
    navigationTo(sceneName, params) {
      this.$wsf.go(sceneName, { ...params, type: this.isMy ? 1 : 2 });
    },
    getStoreList() {
      if (this.isMy) {
        this.$u.api.GetMyStores().then((res) => {
          this.storeList = res.data || [];
          this.isLoading=false
        });
      } else {
        this.$u.api.FocusList().then((res) => {
          this.storeList = res.data || [];
          this.isLoading=false
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
page {
  background-color: #ffffff !important;
}
.listBox {
  padding: 6rpx 16rpx 26rpx;
  .card {
    background: #ffffff;
    border-radius: 16rpx;
    padding: 22rpx 0rpx 24rpx;
    margin-top: 20rpx;
    .card_top {
      display: flex;
      align-items: center;
      padding: 0 22rpx;
      .card_top_img {
        margin-right: 24rpx;
        .icon {
          width: 68rpx;
          height: 68rpx;
          border-radius: 34rpx;
        }
      }
      .card_top_name {
        font-weight: 400;
        color: #191919;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span {
          display: block;
        }
        .name {
          font-size: 26rpx;
          line-height: 34rpx;
        }
        .follow {
          display: inline-block;
          padding: 0 8rpx;
          height: 28rpx;
          line-height: 28rpx;
          background: #ffe7eb;
          border-radius: 8rpx;
          font-size: 20rpx;
          color: #ff0a35;
        }
      }
    }
    .card_content {
      display: flex;
      justify-content: flex-start;
      padding: 22rpx 22rpx 0;
      .card_conten_img {
        width: 25%;
        height: 148rpx;
      }
      image {
        width: 148rpx;
        height: 148rpx;
        border-radius: 16rpx;
      }
    }
  }
}
.title {
  font-size: 22rpx;
  color: #999999;
  line-height: 30rpx;
  padding: 28rpx 16rpx 0;
  text {
		padding: 0 4rpx;
    color: #ff0a35;
  }
}
.no-empty {
  position: fixed;
  left: 50vw;
  top: calc(50vh - 68rpx);
  transform: translate(-50%, -50%);
  text-align: center;
  image {
    width: 320rpx;
    height: 320rpx;
  }
  view {
    margin-top: 16rpx;
    text-align: center;
    font-size: 26rpx;
    color: #444;
  }
}
</style>
