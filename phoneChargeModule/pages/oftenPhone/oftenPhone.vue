<template>
  <view
    class="content"
    data-desc="常用手机号"
    :style="!isNeedBottomSpace ? 'padding-bottom:88rpx' : ''"
  >
    <wsf-nav-bar
      @onBackBtnClick="toIndex()"
      :status-bar="true"
      title="常用手机号"
      :hasBack="true"
    ></wsf-nav-bar>
    <u-swipe-action
      v-for="(item, index) in list"
      :key="index"
      :options="options"
      :show="item.isShow"
      :disabled="item.mobileFlag == 1"
      @click="close(item)"
      @open="open(item)"
    >
<view class="item" @click="operate('edit', item.id)" :style="index==0?'margin-top: 22rpx;':''">
        <view class="left">
          <p>
            <text class="nickname">{{ item.nickName || "暂无昵称" }}</text>
            <text class="place">( {{ item.mobileLocation }} )</text>
          </p>
          <p class="ipone">{{ item.mobile }}</p>
        </view>
        <view class="right">
          <image class="next" :src="`${mallImg}/skuDetail/icon-right.png`" />
        </view>
        <span v-if="item.defaultStatus == 1" class="subscript">默认</span>
      </view>
    </u-swipe-action>
    <view class="footerBtn">
      <button @click="operate('add')">添加联系人</button>
    </view>
    <!-- 清空弹窗 -->
    <wsf-confirm
      v-model="showConfirm"
      title="确定删除？"
      context="删除后该号码不会作为常用号码管理"
      activeText="确定"
      cancelText="取消"
      @confirm="deleteCustomerCommonPhone"
      @cancel="showConfirm = false"
    >
    </wsf-confirm>
  </view>
</template>

<script>
import wsfConfirm from "@/components/wsf-confirm/wsf-confirm.vue";
export default {
  components: { wsfConfirm },
  data() {
    return {
      showConfirm: false,
      slectItem: {}, //选中需要删除的信息
      list: [],
      options: [
        {
          text: "删除",
          style: {
            color: "#fff",
            backgroundColor: "#e60113",
          },
        },
      ],
      mallImg: this.$mallImg,
      isNeedBottomSpace: getApp().globalData.isNeedBottomSpace,
    };
  },
  onShow() {
    this.selectCustomerCommonPhoneListAndAdd();
  },
  methods: {
    // 打开删除
    open(item) {
      this.list.forEach((ite) => {
        if (ite.id == item.id) {
          ite.isShow = true;
        } else {
          ite.isShow = false;
        }
      });
    },
    // 添加/去编辑
    operate(name, id) {
      if (name == "add" && this.list.length == 10) {
        return this.showToast("最多可增加10个联系人");
      } else {
        this.$wsf.go("editPhone", { id: id || "" });
      }
    },
    // 删除
    close(item) {
      if (item.defaultStatus == 1) {
        this.showToast("默认充值号码不可删除");
        return;
      }
      this.slectItem = item;
      this.showConfirm = true;
    },
    // 删除常用联系人详情
    async deleteCustomerCommonPhone() {
      let params = {
        id: this.slectItem.id,
      };
      let res = await this.$u.api.deleteCustomerCommonPhone(params);
      this.showConfirm = false;
      if (res && res.code == 200) {
        this.selectCustomerCommonPhoneListAndAdd();
      } else {
        this.showToast(res.msg);
      }
    },
    // 查询常用联系人
    async selectCustomerCommonPhoneListAndAdd() {
      let res = await this.$u.api.selectCustomerCommonPhoneListAndAdd({});
      if (res && res.code == 200) {
        this.list = res.data.map((item) => {
          item.isShow = false;
          return item;
        });
      }
    },
    showToast(errMsg, duration = 1500) {
      uni.showToast({
        title: errMsg,
        icon: "none",
        mask: true,
        duration: duration,
      });
    },
    toIndex() {
      uni.navigateBack();
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding: 0 0 156rpx;
  background: #f6f6f7;
  overflow: hidden;
}
/deep/ .u-swipe-view {
  background: #f6f6f7;
  width: calc(100vw + 150rpx) !important;
}
/deep/ .u-swipe-content {
  width: calc(100vw - 48rpx);
}
/deep/ .u-swipe-del {
  width: 126rpx !important;
  background: #ff0a35;
  border-radius: 24rpx;
  margin: 0 24rpx 24rpx 0;
  font-size: 28rpx;
}
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  width: calc(100vw - 48rpx);
  height: 198rpx;
  padding: 48rpx 24rpx 48rpx 32rpx;
  margin: 0 24rpx 24rpx 24rpx;
  background: #ffffff;
  border-radius: 24rpx;

  .left {
    .nickname {
      color: #191919;
    }
    .place {
      color: #b4b7ba;
    }
    .nickname,
    .place {
      font-size: 30rpx;
      line-height: 38rpx;
    }
    .ipone {
      margin-top: 8rpx;
      font-size: 48rpx;
      font-weight: 600;
      color: #010b2a;
      line-height: 56rpx;
    }
  }
  .right {
    .next {
      width: 32rpx;
      height: 32rpx;
    }
  }
}
.subscript {
  display: inline-block;
  position: absolute;
  top: 0;
  right: 0;
  width: 104rpx;
  height: 40rpx;
  line-height: 40rpx;
  text-align: center;
  color: #2956e1;
  background: rgba(41, 86, 225, 0.12);
  border-radius: 0 24rpx 0 24rpx;
}
.footerBtn {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 8rpx 24rpx;
  text-align: center;
  background: #ffffff;
  box-shadow: 0px -4rpx 20rpx 0 rgba(189, 194, 204, 0.2);
  padding-bottom: calc(constant(safe-area-inset-bottom)); /* 兼容 iOS < 11.2 */
  padding-bottom: calc(env(safe-area-inset-bottom)); /* 兼容 iOS >= 11.2 */
  button {
    width: 702rpx;
    height: 80rpx;
    background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
    border-radius: 40rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #fff9e9;
    line-height: 80rpx;
  }
}
</style>
