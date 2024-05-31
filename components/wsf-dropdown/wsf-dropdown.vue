<template>
	<view class="u-dropdown">
		<view
			class="u-dropdown__menu  u-flex"
			:style="{
				height: $u.addUnit(height)
			}"
			:class="{
				'u-border-bottom': borderBottom
			}"
		>
			<view class="u-dropdown__menu__item  u-flex-1 text-cursor-pointer" v-for="(item, index) in menuList" :key="index" @tap.stop="menuClick(index)">
				<view class="u-flex u-row-center">
					<view style=" display: flex; flex-direction: column; align-items: center;">	
						<text 
							class="u-dropdown__menu__item__text u-text-center"
							:style="{
								color: item.disabled ? '#c0c4cc' : index === current || highlightIndex == index ? activeColor : inactiveColor,
								fontSize: $u.addUnit(titleSize),
								fontWeight: index === current || highlightIndex == index ?'bold':'400'
							}"
						>
							{{ item.title }}
						</text>
						<!-- 下滑条 -->
						<text :class="['tag' , index === current || highlightIndex == index ? 'tag-active':'']" ></text>
					</view>
					<i
						v-if="item.optionsList.length > 1"
						class="u-dropdown__menu__item__icon"
						:class="[{ 'wsf-icon-active': index === current || highlightIndex == index, 'wsf-icon-up': active }]"
					></i>
					<!-- 					<view
						class="u-dropdown__menu__item__arrow"
						:class="{
							'u-dropdown__menu__item__arrow--rotate': index === current
						}"
					>
						<u-icon
							:custom-style="{ display: 'flex' }"
							name="arrow-down"
							size="26"
							:color="index === current || highlightIndex == index ? activeColor : '#c0c4cc'"
						></u-icon>
					</view> -->
				</view>
			</view>
		</view>
		<view @tap.stop.prevent class="wsf-dropdown__content__popup" :style="[popupStyle]"><slot></slot></view>
		<view class="u-dropdown__content"></view>

		<!-- <view
			class="u-dropdown__content"
			:style="[
				contentStyle,
				{
					transition: `opacity ${duration / 1000}s linear`
				}
			]"
			@touchmove.stop.prevent
		>
			<view @tap.stop.prevent class="u-dropdown__content__popup" :style="[popupStyle]"><slot></slot></view>
		</view> -->
	</view>
</template>

<script>
export default {
	name: 'u-dropdown',
	props: {
		// 菜单标题和选项的激活态颜色
		activeColor: {
			type: String,
			default: '#2979ff'
		},
		// 菜单标题和选项的未激活态颜色
		inactiveColor: {
			type: String,
			default: '#606266'
		},
		// 点击遮罩是否关闭菜单
		closeOnClickMask: {
			type: Boolean,
			default: true
		},
		// 点击当前激活项标题是否关闭菜单
		closeOnClickSelf: {
			type: Boolean,
			default: true
		},
		// 过渡时间
		duration: {
			type: [Number, String],
			default: 300
		},
		// 标题菜单的高度，单位任意，数值默认为rpx单位
		height: {
			type: [Number, String],
			default: 80
		},
		// 是否显示下边框
		borderBottom: {
			type: Boolean,
			default: false
		},
		// 标题的字体大小
		titleSize: {
			type: [Number, String],
			default: 28
		}
	},
	data() {
		return {
			showDropdown: true, // 是否打开下来菜单,
			menuList: [], // 显示的菜单
			active: false, // 下拉菜单的状态
			// 当前是第几个菜单处于激活状态，小程序中此处不能写成false或者""，否则后续将current赋值为0，
			// 无能的TX没有使用===而是使用==判断，导致程序认为前后二者没有变化，从而不会触发视图更新
			current: 0,
			// 让某个菜单保持高亮的状态
			highlightIndex: 0
		};
	},
	computed: {
		// 下拉出来部分的样式
		popupStyle() {
			let style = {};
			// 进行Y轴位移，展开状态时，恢复原位。收齐状态时，往上位移100%，进行隐藏
			style.transform = `translateY(${this.active ? '100%' : 0})`;
			// style.height= this.active? '100%': 0
			style.opacity = this.active ? 1 : 0;
			return style;
		},
		contentStyle() {
			let style = {};
			// 进行Y轴位移，展开状态时，恢复原位。收齐状态时，往上位移100%，进行隐藏
			// style.transform = `translateY(${this.active ? 0 : '-100%'})`
			style.height = `${this.active ? '100%' : 0}`;

			style.opacity = this.active ? 1 : 0;
			return style;
		}
	},
	created() {
		// 引用所有子组件(u-dropdown-item)的this，不能在data中声明变量，否则在微信小程序会造成循环引用而报错
		this.children = [];
	},
	watch: {
		ssortItemType: {
			handler(newVal, oldVal) {
				console.log('newVal', newVal);
			},
			deep: true
		}
	},
	methods: {
		init() {
			// 当某个子组件内容变化时，触发父组件的init，父组件再让每一个子组件重新初始化一遍
			// 以保证数据的正确性
			this.menuList = [];
			this.children.map(child => {
				child.init();
			});
		},
		// 点击菜单
		menuClick(index) {
			// 判断是否被禁用
			if (this.menuList[index].disabled) return;

			// 判断是否拥有超过1个的子元素,否则视为单选
			if (this.menuList[index].optionsList.length <= 1) {
				this.current = index;
				this.highlightIndex = index;
				this.$emit('change', this.menuList[index].optionsList);
				this.$emit('input', this.menuList[index].optionsList);
				this.close();
				// 等动画结束后，再移除下拉菜单中的内容，否则直接移除，也就没有下拉菜单收起的效果了
				setTimeout(() => {
					this.children[index].active = false;
				}, this.duration);
				return;
			}

			// 如果点击时的索引和当前激活项索引相同，意味着点击了激活项，需要收起下拉菜单
			if (index === this.current && this.closeOnClickSelf) {
				this.close();
				// 等动画结束后，再移除下拉菜单中的内容，否则直接移除，也就没有下拉菜单收起的效果了
				setTimeout(() => {
					this.children[index].active = false;
				}, this.duration);
				return;
			}
			this.open(index);
		},
		// 打开下拉菜单
		open(index) {
			// 重置高亮索引，否则会造成多个菜单同时高亮
			this.highlightIndex = 9999;
			// 展开时，设置下拉内容的样式
			// this.contentStyle = {
			// 	zIndex: 11,
			// 	opacity: 1
			// }
			// 标记展开状态以及当前展开项的索引
			this.active = true;
			this.current = index;
			// 历遍所有的子元素，将索引匹配的项标记为激活状态，因为子元素是通过v-if控制切换的
			// 之所以不是因display: none，是因为nvue没有display这个属性
			this.children.map((val, idx) => {
				val.active = index == idx ? true : false;
			});
			this.$emit('open', this.current);
		},
		// 设置下拉菜单处于收起状态
		close(chooseItem) {
			// 判断是否属于选中子选项的关闭操作
			if (chooseItem) {
				this.highlightIndex = this.current;
			}
			this.$emit('close', this.current);
			// 设置为收起状态，同时current归位，设置为空字符串
			this.active = false;
			this.current = 99999;
			// 下拉内容的样式进行调整，不透明度设置为0
			// this.contentStyle = {
			// 	zIndex: -1,
			// 	opacity: 0
			// }
		},
		// 外部手动设置某个菜单高亮
		highlight(index = undefined) {
			this.highlightIndex = index !== undefined ? index : 99999;
		}
	}
};
</script>

<style scoped lang="scss">
.tag{
	display: inline-block;
	margin-top: 10rpx;
	border-radius: 10rpx;
	background: #fff;
	width: 52rpx;
	height: 6rpx;
}
.tag-active{
	background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/search-list/slither.png');
	background-size: 52rpx 8rpx;
}
.u-dropdown {
	flex: 1;
	width: 100%;
	background-color: #fff;
	&__menu {
		position: relative;
		z-index: 11;
		height: 80rpx;

		&__item {
			flex: 1;
			justify-content: center;
			align-items: center;

			&__text {
				font-size: 28rpx;
				color: $u-content-color;
			}

			&__arrow {
				margin-left: 6rpx;
				transition: transform 0.3s;
				align-items: center;

				&--rotate {
					transform: rotate(180deg);
				}
			}
		}
	}

	&__content {
		position: absolute;
		height: 0%;
		width: 100%;
		left: 0px;
		overflow: hidden;
		background: rgba(0, 0, 0, 0.3);
		opacity: 0;
		z-index: -1;
		transition: all 0.3s;
		&__popup {
			transition: all 0.3s;
			transform: translate3D(0, -100%, 0);
		}
	}
}
.wsf-dropdown__content__popup {
	position: absolute;
	height: 0%;
	width: 100%;
	left: 0;
	right: 0;
	bottom: 0;
	opacity: 0;
	z-index: -1;
	transition: all 0.3s;
	transform: translateY(0);
}
.u-dropdown__menu__item__icon {
	transition: all 0.3s;
	margin-left: 8rpx;
	margin-bottom: 20rpx;
	&::after {
		content: '';
		display: inline-block;
		width: 8rpx;
		height: 8rpx;
		background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/search-list/down.png');
		background-size: 100% 100%;
		-webkit-transform: rotate(0deg);
		transition: all 1s;
		transform: rotate(0deg);
	}
}
.wsf-icon-up {
	&::after {
		-webkit-transform: rotate(180deg);
		transform: rotate(180deg);
	}
}
</style>
