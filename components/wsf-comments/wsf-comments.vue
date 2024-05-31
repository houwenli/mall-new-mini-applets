<template>
	<view :class="showTotal ? 'total-introduce' : 'detailed-introduce'">
		<view class="intro-content" :title="introduce" ref="desc">
			<span class="merchant-desc" v-if="introduce">{{ introduce }}</span>
			<view class="unfold" @click="showTotalIntro" v-if="showExchangeButton">
				<img v-if="exchangeButton" src="@/static/img/Unfold@2x.png" alt style="width: 10px;height: 5px;background: #FFFFFF;" />
				<img v-else src="@/static/img/stop@2x.png" alt style="width: 10px;height: 5px;background: #FFFFFF;" />
			</view>
		</view>
	</view>
</template>
<script>
export default {
	name: 'comments',
	props: {
		introduce: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			// 是否展示所有文本内容
			showTotal: true,
			// 显示展开还是收起
			exchangeButton: true,
			// 是否显示展开收起按钮
			showExchangeButton: false,
			rem: '',
			windowWidth: 0,
			windowHeight: 0
		};
	},
	watch: {
		introduce: {
			immediate: true,
			handler() {
				this.$nextTick(
					function() {
						const query = uni.createSelectorQuery().in(this);
						let descHeight;
						query
							.select('.intro-content')
							.boundingClientRect(data => {
								descHeight = data.height
								if (descHeight > 88) {
									console.log('超过了四行')
									// 显示展开收起按钮
									this.showExchangeButton = true;
									this.exchangeButton = true;
									// 不是显示所有
									this.showTotal = false;
								} else {
									// 不显示展开收起按钮
									this.showExchangeButton = false;
									// 没有超过四行就显示所有
									this.showTotal = true;
								}
							})
							.exec();						
					}.bind(this)
				);
			}
		}
	},
	methods: {
		showTotalIntro() {
			// console.log(this.showTotal)
			this.showTotal = !this.showTotal;
			this.exchangeButton = !this.exchangeButton;
		},
	}
};
</script>
<style lang="scss">
.content {
	width: 100%;
}
.OverContent {
	height: 88px;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 4;
	-webkit-box-orient: vertical;
}
.top-prove {
	height: 100px;
	width: 100%;
	background: #dddddd;
	text-align: center;
	line-height: 100px;
}
.total-introduce {
	height: auto;
	overflow: hidden;
	font-size: 14px;
	color: #434343;
	.intro-content {
		.merchant-desc {
			width: 100%;
			line-height: 21px;
		}
	}
	.unfold {
		display: block;
		z-index: 11;
		float: right;
		width: 20px;
		height: 21px;
		text-align: center;
		p {
			margin: 0;
			line-height: 21px;
			color: #7fbe87;
		}
	}
}
.detailed-introduce {
	font-size: 14px;
	color: #434343;
	position: relative;
	overflow: hidden;
	.intro-content {
		// 最大高度设为4倍的行间距
		max-height: 84px;
		line-height: 21px;
		word-wrap: break-word;
		/*强制打散字符*/
		word-break: break-all;
		// background: #ffffff;
		/*同背景色*/
		// color: #ffffff;
		overflow: hidden;
		.merchant-desc {
			width: 100%;
			line-height: 21px;
		}
		.unfold {
			z-index: 11;
			width: 20px;
			height: 21px;
			outline: 0;
			position: absolute;
			right: 0;
			bottom: 0;
			text-align: center;
			p {
				margin: 0;
				line-height: 21px;
				color: #7fbe87;
			}
			img {
				width: 10px;
				height: 5px;
			}
		}
	}
}
.bottom-prove {
	height: 100px;
	width: 100%;
	background: #dddddd;
	text-align: center;
	line-height: 100px;
}
.change-buttom {
	font-size: 14px;
	color: #2371be;
	.long {
		text-align: 21px;
		text-align: center;
		height: 21px;
	}
	.short {
		text-align: 21px;
		text-align: center;
		height: 20px;
	}
}
</style>
