<template>
	<view class="store-card-wrap u-padding-top-40 u-padding-bottom-40">
		<view class="store-card-header">
			<wsfCheckBtn @checked="storeChecked" v-model="storeData.checked" />
      <!-- 店铺图标 -->
			<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/Shop%402x.png"></image>
			<view class="store-card-header-name">{{ storeData.storeName }}</view>
			<u-icon name="arrow-right" :size="25" color="#666"></u-icon>
		</view>
		<view class="store-cart-body">
			<u-swipe-action
				class="swipe_action"
				:show="item.show"
				v-for="(item, index) in storeData.normalSkus"
				:index="index"
				:key="item.id"
				@click="click"
				@open="open"
				:options="options"
				btn-width="140"
			>
				<view class="item u-padding-top-30">
					<wsf-check-btn class="wsf-check-btn" @checked="storeChecked" v-model="item.checked"></wsf-check-btn>
					<image mode="aspectFill" :src="item.image" />
					<view class="content u-margin-right-36">
						<view class="title-wrap">
							<text class="title u-line-2">{{ item.name }}</text>
						</view>
						<view class="sign">要选择的内容</view>
						<view class="price_btn">
							<view class="left">
								<text class="price_item">￥</text>
								<text class="btn_item">10.08</text>
							</view>
							<view class="right">
								<u-number-box
									v-model="numGoods"
									:index="index"
									:disabled-input="true"
									@change="valChange"
									@minus="minus"
									@plus="plus"
									:min="1"
									:max="100"
								></u-number-box>
							</view>
						</view>
					</view>
				</view>
			</u-swipe-action>
		</view>
	</view>
</template>
<script>
import wsfCheckBtn from '../../../components/wsf-check-btn/wsf-check-btn.vue'
export default {
	props: ['cartsItem','carts', 'parentIndex'],
	components: {
		wsfCheckBtn,
	},
	data() {
		return {
			storeData: {},
			disabled: false,
			btnWidth: 180,
			show: false,
			numGoods: 1, //步进器初始值
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#e60113',
						margin: '30rpx 0 0 0',
					},
				},
			],
		}
	},
	created() {
		this.storeData = this.cartsItem
		console.log(this.cartsItem, 'this.storeData1111')
	},
	watch: {
	  cartsItem: {
	    handler(newVal, oldvalue) {
	      console.log("监听器::",newVal);
		  this.storeData = newVal
	    },
	    // immediate: true,
	    deep: true
	  }
	},
	methods: {
		storeChecked(e) {
			this.storeData.normalSkus.map((item, index) => {
				item.checked = true
			})
			this.$emit('cartItemData', this.storeData,this.parentIndex)
		},
		click(index, index1) {
			if (index1 == 1) {
				this.list.splice(index, 1)
				this.$u.toast(`删除了第${index}个cell`)
			} else {
				this.list[index].show = false
				this.$u.toast(`收藏成功`)
			}
		},
		// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
		open(index) {
			// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
			// 原本为'false'，再次设置为'false'会无效
			this.list[index].show = true
			this.list.map((val, idx) => {
				if (index != idx) this.list[idx].show = false
			})
		},
		// 步进器
		valChange(e) {
			console.log('当前值为: ' + e.value)
		},
		// 步进器 -
		minus(e) {
			console.log(e)
		},
		// 步进器 +
		plus(e) {
			console.log(e)
		},
	},
}
</script>

<style lang="scss" scoped>
.store-card-wrap {
	background-color: #fff;
	border-radius: 20rpx;
	.store-card-header {
		image {
			width: 28rpx;
			height: 28rpx;
			margin-left: 20rpx;
		}
		padding-left: 32rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		&-name {
			margin-left: 6rpx;
			margin-right: 14rpx;
		}
	}
	.store-cart-body {
		.item {
			display: flex;
			.wsf-check-btn {
				display: flex;
				align-items: center;
				padding-left: 32rpx;
				padding-right: 20rpx;
			}
		}

		image {
			width: 200rpx;
			height: 200rpx;
			flex: 0 0 200rpx;
			margin-right: 24rpx;
			border-radius: 12rpx;
		}
		.content {
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.title {
				text-align: left;
				font-size: 28rpx;
				color: $u-content-color;
			}
			.price_btn {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
			}
		}
	}
}
</style>
