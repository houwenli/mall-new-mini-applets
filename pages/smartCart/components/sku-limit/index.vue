<template>
  <!--限购商品列表 -->
  <view class="sku-limit">
    <u-mask :show="showModal" @click="cancel">
			<view class="warp">
				<view class="rect" @tap.stop>
					<view class="title"><text>您购买的商品已超出限购范围！</text></view>
					<view class="list">
						<scroll-view scroll-y="true" class="scroll-Y">
							<view class="limit-item" v-if="limitSkuList.length">
								<view class="content u-margin-bottom-40" v-for="(item, index) in limitSkuList" :key="index">
									<view class="left u-margin-right-20"><image :src="item.image"></image></view>
									<view class="right">
										<view class="txt-1 u-line-2">{{ item.name }}</view>
										<view class="limit-num">限购{{ item.limitNumFromMarketing }}件</view>
									</view>
								</view>
							</view>
              <block v-if="limitFirstList.length">
                <view v-for="(item, index) in limitFirstList" :key="index" class="limit-item" >
                  <view class="limit-item-kind" v-if="item.limitKind">
                    限购{{ item.limitKind }}款
                  </view>
                  <view v-for="(sItem, idx) in item.specialAreaLimitList" :key="idx" class="content u-margin-bottom-40">
                    <view class="left u-margin-right-20"><image :src="sItem.image"></image></view>
                    <view class="right">
                      <view class="txt-1 u-line-2">{{ sItem.name }}</view>
                      <view class="limit-num">限购{{ sItem.marketingVos[0].specialArea.limitNum }}件</view>
                    </view>
                  </view>
                </view>
              </block>
						</scroll-view>
					</view>
					<view class="btn"><view class="btn-item" @click="confirm">我知道了</view></view>
				</view>
			</view>
		</u-mask>
  </view>
</template>

<script>

// 超限商品弹窗
export default {
  name: 'cartNav',
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    limitSkuList: {
      type: Array,
      default: []
    },
    limitFirstList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      
    };
  },
  computed: {
		
	},
  created () {
  },
  mounted() {
    
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    confirm() {
      this.$emit('confirm')
    }
  },
};
</script>

<style scoped lang="scss">
.rect {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	width: 100%;
}
.warp {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	padding: 100rpx;
	.rect {
		width: 550rpx;
		background-color: #fff;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 60rpx 0rpx 40rpx 0rpx;
		.title {
			width: 100%;
			text-align: center;
			font-size: 32rpx;
			font-weight: 500;
			color: #000000;
		}
		.list {
			width: 100%;
			margin-top: 60rpx;
			margin-bottom: 65rpx;
			.scroll-Y {
				max-height: 600rpx;
			}
			.limit-item::after {
				content: '';
				height: 0.4rem;
				background-color: #f2f2f2;
				width: 100%;
				display: inline-block;
				margin-bottom: 18px;
			}
			.limit-item:last-child::after {
				display: none;
			}
      .limit-item-kind {
        margin-bottom: 20rpx;
        padding-left: 50rpx;
        color: #e60113;
        font-size: 24rpx;
      }
			.content {
				width: 100%;
				display: flex;
				padding: 0 50rpx;
				.left {
					width: 120rpx;
					height: 120rpx;
					image {
						width: 120rpx;
						height: 120rpx;
					}
				}
				.right {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					width: 100%;
					.txt-2 {
						color: #e60113;
					}
					.limit-num {
						font-size: 24rpx;
						color: #e60113;
					}
				}
			}
		}
		.btn {
			width: 100%;
			display: flex;
			justify-content: center;
			.btn-item {
				width: 320rpx;
				height: 60rpx;
				border: 1rpx solid #e60113;
				font-size: 24rpx;
				font-weight: 500;
				color: #e60113;
				text-align: center;
				line-height: 60rpx;
				border-radius: 60rpx;
			}
		}
	}
}
</style>
