<template>
  <view class="wrap">
    <!-- 头部 -->
    <smartNavBar title="银行卡" />
    <!-- 内容 -->
    <view class="bankcard">
      <!-- 加载页 -->
      <smartTransition v-if="isLoading" />
      <view v-else class="bankcard__content">
        <bankCardList
          v-if="list && list.length > 0"
          :list="list"
          :loadStatus="loadStatus"
          @operate="operate"
        />
        <!-- 缺省页 -->
        <smartTransition v-else :topHight="396" :typeName="'noBankCard'" text="暂无银行卡">
          <template>
            <view class="empty__btn--add" @click="operate('add')">
              添加银行卡
            </view>
          </template>
        </smartTransition>
      </view>
    </view>
    <!-- 确认弹窗 -->
    <smartConfirm
      :show="showConfirm"
      :title="'解绑确认'"
      :contentText="'解绑后。磁卡将不能用于支付或者提现，需重新绑定才能使用。'"
      :cancelText="'再考虑一下'"
      :confirmText="'确认解绑'"
      @cancel="cancel()"
      @confirm="confirm()"
    />
  </view>
</template>

<script>
// 公共组件
import smartTransition from "@/components/smart/smart-transition/smart-transition.vue";
import smartConfirm from "@/components/smart/smart-confirm/smart-confirm.vue";
import smartNavBar from "@/components/smart/smart-nav-bar/smart-nav-bar.vue";
// 内部组件
import bankCardList from "./comm/bankCardList.vue";
// 接口
import { BankCardList, UnbindBankCard } from "@/common/smart-api/userCenterApi";

export default {
  components: { smartTransition, bankCardList, smartConfirm, smartNavBar },
  data() {
    return {
      smartImg: this.$smartImg,
      loadStatus: "loadmore", // 加载更多样式效果
      isLoading: true, // 是否正在加载
      showConfirm: false, //是否显示确认弹窗
      list: [], //银行卡列表
      selectItem: {}, //选择的银行卡信息
    };
  },
  onShow() {
    this.reset();
  },
  methods: {
    // 初始化
    reset() {
      this.isLoading = true;
      this.list = [];
      this.getBankCardList();
    },
    //操作
    operate(name, item) {
      if (name == "add") {
        this.$smart.go("smartEditBankCard");
      } else if (name == "secure") {
        this.selectItem = item;
        this.showConfirm = true;
      }
    },
    //获取银行卡列表
    getBankCardList() {
      this.isLoading = true;
      BankCardList()
        .then((res) => {
          this.list = res.data || [];
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
        });
    },
    //取消
    cancel() {
      this.showConfirm = false;
    },
    //确定
    confirm() {
      this.showConfirm = false;
      let params = {
        bankCardId: this.selectItem.bankId,
      };
      UnbindBankCard(params).then((res) => {
        this.reset();
      });
    },
  },
};
</script>

<style scoped lang="scss">
.empty__btn--add {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20rpx;
  width: 260rpx;
  height: 80rpx;
  background: linear-gradient(90deg, #FF8011 0%, #FE3040 100%);
  border-radius: 40rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 40rpx;
}
.bankcard {
  height: calc(100vh - 168rpx);
  &__content {
    height: 100%;
  }
}
</style>
