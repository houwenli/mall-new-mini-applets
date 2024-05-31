<template>
	<view class="wraper">
		<wsf-nav-bar @onBackBtnClick="clickBackBtn" :status-bar="true" title="编辑收货地址" bg-color="#FFFFFF" :hasBack="true">
			<!-- <view slot="title" v-if="showSearchBar">我的</view> -->
		</wsf-nav-bar>
		<view class="applet-address-edit">
			<view class="applet-address-edit-header">
				<!-- 收货人 -->
				<u-field
					class="applet-address-edit-field"
					:border-bottom="false"
					v-model="addressInfo.name"
					label="收货人"
					placeholder="请填写收货人姓名"
					placeholder-style="color:#c3c3c3;"
					@input="hasChange = true"
				></u-field>
				<!-- 手机号码 -->
				<u-field
					@input="hasChange = true"
					class="applet-address-edit-field"
					:border-bottom="false"
					v-model="addressInfo.mobile"
					label="手机号"
					maxlength="11"
					placeholder="请填写收货人手机号"
					placeholder-style="color:#c3c3c3;"
				></u-field>

				<!-- 所在地区 -->
				<u-field
					:border-bottom="false"
					class="applet-address-edit-field address"
					v-model="addressInfo.addressValue"
					:disabled="true"
					label="所在地区"
					placeholder=" "
					:clearable="false"
				></u-field>
				<!-- 详细地址 -->
        <u-field
					class="applet-address-edit-field detail-address"
					:border-bottom="false"
					v-model="addressInfo.detailAddress"
					label="详细地址"
					maxlength="50"
					placeholder="街道楼牌号等"
					placeholder-style="color:#c3c3c3;"
					@input="hasChange = true"
				></u-field>
        <!-- 微信小程序不支持placeholder行高，自定义样式会比较乱 -->
				<!-- <u-field
          type="textarea"
					class="applet-address-edit-field detail-address"
					:border-bottom="false"
					:field-style="textareaStyle"
					v-model="addressInfo.detailAddress"
					label="详细地址"
					maxlength="50"
					placeholder="街道楼牌号等"
					placeholder-style="color: #000; line-height: 78rpx;"
					@input="hasChange = true"
				></u-field> -->
			</view>

			<view class="wsf-btn">
				<u-button :loading="isLoading" :custom-style="customStyle" shape="circle" hover-class="none" :throttle-time="500" @click="$u.debounce(saveAddress, 500)">
					确认
				</u-button>
			</view>
      <wsf-confirm
				v-model="showConfirm"
				:title="confirmContext"
				activeText="保存"
				cancelText="不保存"
				@confirm="activeConfirm"
				@cancel="activeCancel"
			></wsf-confirm>
		</view>
	</view>
</template>

<script>
import wsfNavBar from '@/components/wsf-nav-bar/wsf-nav-bar.vue';
export default {
	components: {
		wsfNavBar,
	},
	data() {
		return {
			addressInfo: {
				name: '', //收货人姓名
        mobile: '', //手机号码
        detailAddress: '', //详细地址
        addressValue: '', // 所在地区
        orderIdList: [], // 订单id集合
			},
			isLoading: false,
			textareaStyle: {
        minHeight: '156rpx',
        lineHeight: '78rpx',
				fontSize: '26rpx',
				verticalAlign: 'top'
			},
			customStyle: {
				backgroundColor: '#E60113',
				marginBottom: '40rpx',
				color: '#FFF'
			},
      showConfirm: false,
			confirmContext: '',
			hasChange: false ,// 是否修改过内容
			
		};
	},
	onLoad(options) {
		this.initQuery(options)
	},
	onShow() {
	},
	methods: {
    // 分析传入数据
    initQuery(options) {

      let orderdetail = {}
      try{
        orderdetail = JSON.parse(options.orderdetail)
      }catch(e) {
        orderdetail = {}
      }

      // 组装地址数据
      this.addressInfo = Object.assign({}, orderdetail)
    },
		// 保存地址
		saveAddress() {
			if (this.isLoading) return;
			// console.log('this.$u.test.isEmpty(this.addressInfo.name)',this.$u.test.isEmpty(this.addressInfo.name));
			if (this.$u.test.isEmpty(this.addressInfo.name)) {
				this.$u.toast('请填写收货人');
				return;
			} else if (this.$u.test.isEmpty(this.addressInfo.mobile)) {
				this.$u.toast('请输入手机号');
				return;
			} else if (!this.$u.test.mobile(this.addressInfo.mobile+'')) {
				this.$u.toast('手机格式不对,请重新输入');
				return;
			} else if (this.$u.test.isEmpty(this.addressInfo.detailAddress)) {
				this.$u.toast('请输入详细地址');
				return;
			} else if (!this.$u.test.rangeLength(this.addressInfo.detailAddress, [1, 50])) {
				this.$u.toast('详细地址最多50个字');
				return;
			}

			this.isLoading = true;
			this.$u.api.updateReceiptInfo(this.addressInfo).then(res => {
				this.isLoading = false;
				if (res.code == 200 && res.data) {
					this.$u.toast('修改成功');
					setTimeout(function() {
            uni.navigateBack({
              delta: 1
            });
          }, 1000);
				}
				
			});
		},
		// 点击了确定按钮
		activeConfirm() {
			this.saveAddress();
		},
    // 点击了取消按钮
		activeCancel() {
			uni.navigateBack({
        delta: 1
      });
		},
    clickBackBtn() {
			if (this.hasChange) {
				this.openModal('是否保存本次编辑结果？', 1);
			} else {
				uni.navigateBack({
					delta: 1
				});
			}
		},
    // 打开模态框
		openModal(context, atv) {
			this.confirmContext = context;
			this.showConfirm = true;
		},
	}
};
</script>

<style lang="scss" scoped>
.wraper {
  min-height: 100vh;
  background: #fff;
}
.applet-address-edit {
	&-header {
		border-radius: 0 0 20rpx 20rpx;
		overflow: hidden;
		margin-bottom: 24rpx;
		background-color: #ffffff;
		/deep/ .u-field {
      line-height: 88rpx;
      padding: 0 24rpx;
      margin-top: 32rpx;
      .u-field-inner {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
      }
			.u-label-text {
				width: 136rpx;
        margin-right: unset;
        color: #191919;  
        font-weight: 500;
        font-size: 26rpx;
			}
      .fild-body {
        width: 566rpx;
        margin-right: unset;
        color: #333;
        border-radius: 16rpx;
        background: rgba(246, 246, 246, 0.5);
        padding: 0 32rpx;
      }
      .u-field__input-wrap {
        background-color: unset;
        height: 88rpx;
      }
		}
    .address /deep/ .u-field {
      .u-field__input-wrap {
        color: #c8c9cc;
      }
    }
	}

	.wsf-btn {
		margin: 0 auto 40rpx;
		width: 678rpx;
		height: 76rpx;
		line-height: 76rpx;
	}
}
</style>
