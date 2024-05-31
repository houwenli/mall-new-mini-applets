<template>
	<view class="wsf-switch" :class="[value == true ? 'u-switch--on' : '', disabled ? 'u-switch--disabled' : '']" @tap="onClick" :style="[switchStyle]">
		<view
			class="wsf-switch__node"
			:style="{
				width: $u.addUnit(this.activeSize),
				height: $u.addUnit(this.activeSize)
			}"
		>
			<u-loading :show="loading" class="u-switch__loading" :size="size * 0.6" :color="loadingColor" />
		</view>
	</view>
</template>

<script>
/**
 * switch 开关选择器
 * @description 选择开关一般用于只有两个选择，且只能选其一的场景。
 * @tutorial https://www.uviewui.com/components/switch.html
 * @property {Boolean} loading 是否处于加载中（默认false）
 * @property {Boolean} disabled 是否禁用（默认false）
 * @property {String Number} size 开关尺寸，单位rpx（默认50）
 * @property {String} active-color 打开时的背景色（默认#2979ff）
 * @property {Boolean} inactive-color 关闭时的背景色（默认#ffffff）
 * @property {Boolean | Number | String} active-value 打开选择器时通过change事件发出的值（默认true）
 * @property {Boolean | Number | String} inactive-value 关闭选择器时通过change事件发出的值（默认false）
 * @event {Function} change 在switch打开或关闭时触发
 * @example <wsf-switch v-model="checked" active-color="red" inactive-color="#eee"></wsf-switch>
 */
export default {
	name: 'wsf-switch',
	props: {
		// 是否为加载中状态
		loading: {
			type: Boolean,
			default: false
		},
		// 是否为禁用装填
		disabled: {
			type: Boolean,
			default: false
		},
		// 开关尺寸，单位rpx
		width: {
			type: [Number, String],
			default: 72
		},
		// 开关尺寸，单位rpx
		height: {
			type: [Number, String],
			default: 42
		},
		// 开关按钮的尺寸,单位rpx
		activeSize: {
			type: [Number, String],
			default: 26
		},
		// 打开时的背景颜色
		activeColor: {
			type: String,
			default: '#E60113'
		},
		// 关闭时的背景颜色
		inactiveColor: {
			type: String,
			default: '#DDDDDD'
		},
		// 通过v-model双向绑定的值
		value: {
			type: Boolean,
			default: false
		},
		// 是否使手机发生短促震动，目前只在iOS的微信小程序有效(2020-05-06)
		vibrateShort: {
			type: Boolean,
			default: false
		},
		// 打开选择器时的值
		activeValue: {
			type: [Number, String, Boolean],
			default: true
		},
		// 关闭选择器时的值
		inactiveValue: {
			type: [Number, String, Boolean],
			default: false
		},
    // 虚拟商品无法操作返回购物车按钮
    isShowCatSwitch:{
      type:Boolean,
      default:false
    }
	},
	data() {
		return {};
	},
	computed: {
		switchStyle() {
			let style = {};
			style.backgroundColor = this.value ? this.activeColor : this.inactiveColor;
			style.fontSize = this.$u.addUnit(this.height);
			style.height = this.$u.addUnit(this.height);
			style.width = this.$u.addUnit(this.width);
			style.justifyContent =  this.value ? 'flex-end' : 'flex-start';
			style.padding = '0 8rpx'
			return style;
		},
		loadingColor() {
			return this.value ? this.activeColor : null;
		}
	},
	methods: {
		onClick() {
      if(this.isShowCatSwitch){
        this.value = false;
        this.$u.toast('虚拟商品暂不支持加购');
        return;
      }
			if (!this.disabled && !this.loading) {
				// 使手机产生短促震动，微信小程序有效，APP(HX 2.6.8)和H5无效
				if (this.vibrateShort) uni.vibrateShort();
				this.$emit('input', !this.value);
				// 放到下一个生命周期，因为双向绑定的value修改父组件状态需要时间，且是异步的
				this.$nextTick(() => {
					this.$emit('change', this.value ? this.activeValue : this.inactiveValue);
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.wsf-switch {
	position: relative;
	border-radius: 30rpx;
	transition: background-color 0.3s;
	display: flex;
	align-items: center;
}
.wsf-switch__node {
	border-radius: 100%;
	z-index: 1;
	background-color: #fff;
	box-shadow: 0 3px 1px 0 rgba(0, 0, 0, 0.05), 0 2px 2px 0 rgba(0, 0, 0, 0.1), 0 3px 3px 0 rgba(0, 0, 0, 0.05);
	box-shadow: 0 3px 1px 0 rgba(0, 0, 0, 0.05), 0 2px 2px 0 rgba(0, 0, 0, 0.1), 0 3px 3px 0 rgba(0, 0, 0, 0.05);
	transition: transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05);
	transition: transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05), -webkit-transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05);
	transition: transform cubic-bezier(0.3, 1.05, 0.4, 1.05);
	transition: transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05);
}
</style>
