<template>
  <view class="wrap" data-desc="常用手机号">
    <!-- 头部 -->
    <smartNavBar title="常用联系人" />
    <!-- 内容 -->
    <view class="smartcontacts">
      <!-- 加载页 -->
      <smartTransition v-if="isLoading" />
      <view class="smartcontacts__content" v-else>
        <!-- 联系人列表 -->
        <contactsList
          v-if="!isError"
          :list="list"
          @close="close"
          @open="open"
          @operate="operate"
        />
        <!-- 缺省页 -->
        <smartTransition v-else :typeName="'noNetwork'" :text="`暂无网络`" />
      </view>
    </view>
    <!-- 底部按钮 -->
    <view class="footer">
      <text class="footer-btn" @click="operate('add')">添加联系人</text>
    </view>
    <!-- 清空弹窗 -->
    <smartConfirm
      :show="showConfirm"
      :title="'确定删除？'"
      :contentText="'删除后该号码不会作为常用号码管理'"
      :cancelText="'取消'"
      :confirmText="'确定'"
      @cancel="showConfirm = false"
      @confirm="delPhone"
    />
  </view>
</template>

<script>
// 公共组件
import smartTransition from "@/components/smart/smart-transition/smart-transition.vue";
import smartNavBar from "@/components/smart/smart-nav-bar/smart-nav-bar.vue";
import smartConfirm from "@/components/smart/smart-confirm/smart-confirm.vue";
// 内部组件
import contactsList from "./comm/contactsList.vue";
// 接口
import {
  SelectCustomerCommonPhoneListAndAdd,
  DeleteCustomerCommonPhone,
} from "@/common/smart-api/userCenterApi";
export default {
  components: { smartConfirm, contactsList, smartTransition, smartNavBar },
  data() {
    return {
      smartImg: this.$smartImg,
      isLoading: false, // 是否正在加载
      showConfirm: false, //是否显示弹窗
      isError: false, //是否接口错误
      slectItem: {}, //选中需要删除的信息
      list: [],
    };
  },
  onShow() {
    this.getList();
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
        this.$smart.go("smartEditContacts", { id: id || "" });
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
    delPhone() {
      let params = {
        id: this.slectItem.id,
      };
      DeleteCustomerCommonPhone(params)
        .then((res) => {
          this.showConfirm = false;
          this.getList();
        })
        .catch((err) => {});
    },
    // 查询常用联系人
    async getList() {
      if (this.isLoading) return;
      this.isError = false;
      this.isLoading = true;
      try {
        let res = await SelectCustomerCommonPhoneListAndAdd();
        this.isLoading = false;
        //添加是否可以删除标识
        this.list = res.data.map((item) => {
          item.isShow = false;
          return item;
        });
      } catch (error) {
        this.isLoading = false;
        this.isError = true;
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
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  background: #f6f6f7;
}
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 8rpx 24rpx;
  background: #ffffff;
  box-shadow: 0rpx -4rpx 20rpx 0rpx rgba(189, 194, 204, 0.2);
  z-index: 2000;
  &-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80rpx;
    background: linear-gradient(90deg, #ff8011 0%, #fe3040 100%);
    border-radius: 40rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #ffffff;
    line-height: 40rpx;
  }
  padding-bottom: calc(
    constant(safe-area-inset-bottom) + 8rpx
  ); /* 兼容 iOS < 11.2 */
  padding-bottom: calc(
    env(safe-area-inset-bottom) + 8rpx
  ); /* 兼容 iOS >= 11.2 */
}
.smartcontacts {
  height: calc(100vh - 168rpx);
  &__content {
    height: 100%;
  }
}
</style>
