<template>
  <view>
    <view class="user-collection">
      <loading v-if="isLoading"></loading>
      <template v-else-if="userCollectionList.length > 0">
        <!-- 头部描述以及操作按钮 -->
        <view class="header flexLay">
          <view class="msg">为您展示最多100个浏览记录商品哟</view>
          <view class="btns flexLay">
            <view class="cls flexLay" @click="close(1)" v-if="isEdit">
              <image
                class="img"
                src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/browse-records/close.png"
              />
              清空
            </view>
            <text
              :class="['edit', 'flexLay', isEdit ? '' : 'ok']"
              @click="edit()"
              >{{ isEdit ? "编辑" : "完成" }}</text
            >
          </view>
        </view>
        <!-- 商品瀑布流 -->
        <view
          class="product-container"
          v-for="(item, index) in userCollectionList"
          :key="index"
        >
          <view class="waterfall_data">{{ item.dateStr }}</view>
          <BrowserWaterfall
            :list="item.browseRecordList"
            :selectList="selectList"
            :isEdit="isEdit"
            @goSkuDetail="goSkuDetail"
            @clickSku="clickSku"
          ></BrowserWaterfall>
        </view>
        <!-- 尾部标识 -->
        <u-loadmore
          v-if="userCollectionList.length > 0"
          ref="backTop"
          bg-color="#f5f5f5"
          font-size="22"
          color="#c3c3c3"
          margin-bottom="40"
          :loadText="loadText"
          :status="loadStatus"
        ></u-loadmore>
      </template>
      <!-- 缺省页 -->
      <template v-else>
        <view class="empty">
          <image
            class="img"
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/browse-records/empty.png"
            style="width: 320rpx; height: 320rpx"
          ></image>
          <view class="txt">
            <text>暂无浏览记录~</text>
          </view>
        </view>
      </template>
      <!-- 回到顶部 -->
      <u-back-top
        :scroll-top="scrollTop"
        top="400"
        :icon-style="iconStyle"
        :bottom="176"
      >
        <image
          src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/back_top.png"
          style="width: 80rpx; height: 80rpx"
        ></image>
      </u-back-top>
    </view>
    <!-- 全选 -->
    <view class="allChecked flexLay" v-if="!isEdit">
      <view
        class="allBtn flexLay"
        @click.stop="userCollectionList.length > 0 ? clickAll() : ''"
      >
        <i :class="isALL ? 'icon_select_ok' : 'icon_select_out'"></i>
        <text>全选</text>
      </view>
      <text
        class="cls flexLay"
        :class="{ isCls: selectListLength }"
        @click.stop="selectListLength ? close(2) : ''"
        >删除</text
      >
    </view>
    <!-- 清空弹窗 -->
    <wsf-confirm
      v-model="showConfirm"
      :title="titieTextMap[isType]"
      activeText="确定"
      cancelText="取消"
      @confirm="activeConfirm"
      @cancel="activeCancel"
    >
    </wsf-confirm>
  </view>
</template>

<script>
import BrowserWaterfall from "../../compontents/browser-waterfall/browser-waterfall.vue";
import wsfConfirm from "@/components/wsf-confirm/wsf-confirm.vue";
export default {
  components: {
    BrowserWaterfall, //瀑布流
    wsfConfirm, //弹窗
  },
  provide() {
    return {
      selectList: this.selectList,
    };
  },
  data() {
    return {
      selectList: [], //勾选的数据
      userCollectionList: [], //放置返回数据的数组
      loadText: {
        loadmore: "上拉加载更多",
        loading: "努力加载中",
        nomore: "我也是有底线的~",
      },
      loadStatus: "loadmore", // 加载更多样式效果
      isLoading: false, // 是否正在加载
      isEdit: true, //是否是编辑
      showConfirm: false, //是否开启弹窗
      scrollTop: 0,
      isType: 1,
      titieTextMap: {
        1: "确定清空浏览记录？",
        2: "确定删除所选浏览记录？",
      },
    };
  },
  computed: {
    selectListLength() {
      return this.selectList.length > 0;
    },
    list() {
      return this.userCollectionList.reduce((list, item) => {
        return list.concat(
          item.browseRecordList.map((val) => {
            return val.id;
          })
        );
      }, []);
    },
    //是否全选
    isALL() {
      return this.selectList.length == this.list.length;
    },
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  onLoad() {
    this.loadUserCollectionList();
  },
  onShow() {
    this.loadUserCollectionList();
  },
  onReachBottom() {
    // this.loadUserCollectionList();
  },
  watch: {},
  methods: {
    //编辑
    edit() {
      this.isEdit = !this.isEdit;
      this.selectList.splice(0, this.selectList.length);
    },
    //删除
    close(type) {
      this.isType = type;
      this.showConfirm = true;
    },
   //确认弹窗
    activeConfirm() {
      let type = this.isType;
      this.showConfirm = true;
      switch (type) {
        case 1: //清空
          this.$u.api.Emptybrowserecords().then((res) => {
            this.selectList.splice(0, this.selectList.length);
            this.activeCancel();
						this.showToastError("删除成功");
            this.loadUserCollectionList();
          });
          break;
        case 2: //单个多个删除
          let params = {
            ids: [...this.selectList],
          };
          this.$u.api.DeleteBrowseRecordById(params).then((res) => {
            this.isEdit = true;
						this.activeCancel();
            this.showToastError("删除成功");
            this.loadUserCollectionList();
          });
          break;
        default:
          break;
      }
    },
    //关闭弹窗
    activeCancel() {
      this.showConfirm = false;
    },
    //全选
    clickAll() {
      if (!this.isALL) {
        this.list.forEach((id) => {
          !this.selectList.includes(id) && this.selectList.push(id);
        });
      } else {
        this.selectList.splice(0, this.selectList.length);
      }
    },
    // 勾选
    clickSku(item) {
      let index = this.selectList.findIndex((val) => {
        return item.id === val;
      });
      if (index >= 0) {
        this.selectList.splice(index, 1);
      } else {
        this.selectList.push(item.id);
      }
    },
    // 详情
    goSkuDetail(item) {
      if (item.sku.status == 4) {
        return false;
      } else {
        if (item.goodsSource == 4) {
          this.$wsf.go("ToMotor", { skuId: item.skuId });
        } else {
          this.$wsf.go("SkuDetail", {
            skuId: item.skuId,
            storeIdNumber: item.storeId,
            sourceType: item.sourceType,
          });
        }
      }
    },
    /* 加载浏览记录 */
    loadUserCollectionList() {
      if (this.isLoading) return;
      this.selectList.splice(0, this.selectList.length);
      this.isLoading = true;
      this.loadStatus = "loading";
      this.$u.api.Querybrowserecords().then((res) => {
        if (res.code == 200) {
          this.loadStatus = "nomore";
          this.isLoading = false;
          this.userCollectionList = res.data;
          uni.stopPullDownRefresh();
        }
      });
    },
    //提示
    showToastError(errMsg, duration = 1500) {
      uni.showToast({
        title: errMsg,
        icon: "none",
        mask: true,
        duration: duration,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.flexLay {
  display: flex;
  align-items: center;
}
.header {
  justify-content: space-between;
  margin-bottom: 20rpx;
  height: 44rpx;
  font-size: 22rpx;
  color: #999999;
  .msg {
    font-size: 22rpx;
  }
  .btns {
    .cls {
      justify-content: center;
      margin-right: 16rpx;
      width: 104rpx;
      height: 44rpx;
      line-height: 44rpx;
      background: #ffffff;
      border-radius: 28rpx;
      font-size: 22rpx;
      .img {
        width: 32rpx;
        height: 32rpx;
        margin-right: 4rpx;
      }
    }
    .edit {
      justify-content: center;
      color: #444444;
      width: 76rpx;
      height: 44rpx;
      background: #ffffff;
      border-radius: 28rpx;
      font-size: 22rpx;
    }
    .ok {
      color: #ff0a35;
    }
  }
}
.user-collection {
  width: 100%;
  height: 100%;
  background: #f6f6f6;
  padding: 28rpx 24rpx 140rpx;
  .empty {
    position: fixed;
    left: 50vw;
    top: calc(50vh - 84rpx);
    transform: translate(-50%, -50%);
    text-align: center;
    .txt {
      margin-top: 16rpx;
      text-align: center;
      font-size: 26rpx;
      font-weight: 400;
      color: #444;
      width: 100%;
    }
  }
  .cart-group {
    position: relative;
    font-size: 28rpx;
    background: #fff;
    border-bottom: 1px solid #eee;
    &:first-of-type {
      margin-top: 0;
      border-bottom: 1px solid #eee;
    }
    .cart-group:first-of-type {
      border-top: 0;
      border-bottom: 1px solid #eee;
    }
    .cart-group {
      margin: 0;
      border-bottom: 0;
      border-top: 1px solid #eee;
    }
    .price {
      vertical-align: middle;
      color: #e4393c;
      text-indent: -0.5rpx;
    }
  }

  .details {
    display: -webkit-box;
    position: relative;
    padding: 25rpx 20rpx;
    font-size: 30rpx;
    image {
      display: block;
      margin-right: 20rpx;
      width: 252rpx;
      height: 252rpx;
      border: 1px solid #dcdcdc;
    }
    view {
      display: -webkit-box;
      -webkit-box-flex: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      .p {
        height: 36rpx;
        line-height: 36rpx;
        white-space: nowrap;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
        margin-right: 50rpx;
      }
    }
  }
  .product-container {
    margin-bottom: 20rpx;
    .waterfall_data {
      font-size: 32rpx;
      color: #111111;
      font-weight: 600;
      line-height: 40rpx;
    }
  }
  .u_swipe_action {
    /deep/ .u-swipe-view {
      background-color: #f6f6f6;
    }
    /deep/ .u-btn-text {
      width: 40px;
      font-size: 14px;
      text-align: center;
    }
  }
}
.allChecked {
  z-index: 2;
  position: fixed;
  justify-content: space-between;
  bottom: -2rpx;
  width: 100%;
  height: 120rpx;
  background: #ffffff;
  padding: 20rpx 24rpx;
  font-size: 32rpx;
  box-shadow: 0rpx -4rpx 20rpx 0rpx rgba(189, 194, 204, 0.2);
  .allBtn {
    position: relative;
    height: 60px;
    line-height: 60rpx;
    font-size: 26rpx;
    text {
      padding-left: 16rpx;
    }
  }
  .icon_select_ok,
  .icon_select_out {
    display: inline-block;
    width: 32rpx;
    height: 32rpx;
  }
  // 勾选
  .icon_select_ok {
    background-image: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-selected-2x.png");
    background-size: 32rpx;
    background-repeat: no-repeat;
  }
  // 未勾选
  .icon_select_out {
    background-image: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/browse-records/no.png");
    background-size: 32rpx;
    background-repeat: no-repeat;
  }
  .cls {
    justify-content: center;
    width: 260rpx;
    height: 100%;
    line-height: 20px;
    background: #eeeeee;
    border-radius: 40rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #c3c3c3;
  }
  .isCls {
    background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
    color: #fff9e9;
  }
}
/deep/ .wsf-confirm {
  background-color: rgba(0, 13, 29, 0.5) !important;
  .wsf-confirm-modal-title {
    font-size: 30rpx;
    font-weight: 400;
  }
  .cancel,
  .confirm {
    font-size: 30rpx;
  }
}
</style>
