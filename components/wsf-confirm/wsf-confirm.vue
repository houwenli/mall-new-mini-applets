<template>
	<view v-if="value" class="wsf-confirm" @touchmove.stop  @click="touchClose()">
		<view class="wsf-confirm-modal" :style="{ 'padding-top': headerImg ? '106rpx' : '64rpx' }" @click.stop="stopClick()">
			<image v-if="showCloseDialogBtn" class="close-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/close%402x.png" mode="" @click="touchClose()"></image>
			<view class="wsf-confirm-modal-img" v-if="headerImg"><image style="width: 120rpx;height: 120rpx;" :src="headerImg"></image></view>
			<view v-if="title" class="wsf-confirm-modal-title">{{ title }}</view>
			<template v-if="!$slots.context">
				<view v-if="context && context !== ''" class="wsf-confirm-modal-context" :style="{ 'text-align': contextAlign }">{{ context }}</view>
			</template>
			<!-- 内容插槽 -->
			<view v-else class="wsf-confirm-modal-context"><slot name="context" /></view>
			<slot></slot>
			<view class="wsf-confirm-modal-btn" :style="hideConfirm || hideCancel ? 'justify-content:center' : ''">
				<template v-if="!$slots.button">
					<view class="wsf-confirm-modal-btn-item cancel" :class="{ 'full-box': hideConfirm }" v-if="!hideCancel" @click="cancel">{{ cancelText }}</view>
					<view class="wsf-confirm-modal-btn-item confirm" :class="{ 'full-box': hideCance }" v-if="!hideConfirm" @click="confirm">{{ activeText }}</view>
				</template>
				<slot name="button" v-else />
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		// 是否显示Modal
		value: {
			type: Boolean,
			default: false
		},
		headerImg: {
			type: String,
			default: ''
		},
		title: {
			type: String
		},
		context: {
			type: String
		},
		// 是否隐藏确定按钮
		hideConfirm: {
			type: Boolean,
			default: false
		},
		hideCancel: {
			type: Boolean,
			default: false
		},
		activeText: {
			type: String,
			default: '确定'
		},
		cancelText: {
			type: String,
			default: '取消'
		},
		contextAlign: {
			type: String,
			default: 'left'
		},
		isNeedTouchClose: {
			type: Boolean,
			default: false
		},
		showCloseDialogBtn: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		// 同意的操作 未做自动关闭,方便做确定操作的方法
		confirm() {
			this.$emit('confirm');
		},
		// 拒绝的操作
		cancel() {
			this.$emit('input', false);
			this.$emit('cancel');
		},
		//关闭弹窗
		touchClose() {
			if (this.isNeedTouchClose) {
				this.$emit('handleCloseDialog', false);
			} else {
				return;
			}
		},
		stopClick() {
			return;
		}
	}
};
</script>

<style lang="scss">
.wsf-confirm {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bototm: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 13, 29, 0.5);
	z-index: 9999;
	/* 这里防止当用户长按屏幕，出现的黑色背景色块，以及 iPhone 横平时字体的缩放问题 */
	-webkit-text-size-adjust: 100%;
	-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	display: flex;
	justify-content: center;
	align-items: center;
	&-modal {
		background-color: #fff;
		width: 472rpx;
		padding: 80rpx 32rpx 40rpx 32rpx;
		border-radius: 24rpx;
		position: relative;
		&-img {
			width: 100%;
			height: 120rpx;
			text-align: center;
			position: absolute;
			top: -60rpx;
			left: 0;
		}
		&-title {
			margin-bottom: 44rpx;
			font-size: 32rpx;
			color: #191919;
			font-weight: bold;
			line-height: 38rpx;
			text-align: center;
		}
		&-context {
			margin-bottom: 44rpx;
			font-size: 30rpx;
			line-height: 38rpx;
			text-align: center;
			color: #191919;
		}
		&-btn {
			padding: 0 24rpx;
			height: 60rpx;
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			&-item {
				display: inline-flex;
				justify-content: center;
				align-items: center;
				padding: 24rpx;
				min-width: 168rpx;
				height: 64rpx;
				border-radius: 32rpx;
				text-align: center;
				box-sizing: border-box;
                font-size: 30rpx;
			}
			.cancel {
				color: #000000;
				border: 1px solid rgba(0, 0, 0, 0.2);
				background-color: #fff;
				line-height: 56rpx;
			}
			.confirm {
				background: linear-gradient(90deg, #FF6B4E 0%, #FF0A35 100%);
				color: #fff;
			}
		}
		.close-icon {
			width: 32rpx;
			height: 32rpx;
			position: absolute;
			right: 24rpx;
			top: 24rpx;
		}
	}
}
.full-box {
	width: 100%;
}
</style>
