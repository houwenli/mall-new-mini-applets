<template>
  <view id="cart-nav" class="cart-nav">
    <view class="cart-nav__fill" :style="[headFillClass]"></view>
    <view class="cart-nav__content" >
      <image class="cart-nav__content-icon" :src="navIconImg"></image>
      <view class="cart-nav__content-edit" :style="[editClass]" @click="altEditState">
        <image class="edit" :src="editImg" v-show="!isEdit"></image>
        <image  class="edit" :src="editCompleteImg" v-show="isEdit"></image>
      </view>
    </view>
  </view>
</template>

<script>

// 购物车nav
export default {
  name: 'cartNav',
  props: {
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 页面中使用图片
      navIconImg: `${this.$smartImg}/cart/cart-title-img.png`,
      editImg: `${this.$smartImg}/cart/edit.png`,
      editCompleteImg: `${this.$smartImg}/cart/edit-complete.png`,

      capsuleRight: 0, // 胶囊右侧距离

      isEdit: false, // 是否编辑
    };
  },
  computed: {
		headFillClass () {
			return {
				height: `${this.$globalData.statusBarHeight}px`
			}
		},
    editClass() {
      let capsule = this.$globalData.capsule || {}

      let { screenWidth } = uni.getSystemInfoSync()
      let capsuleRight = screenWidth - capsule.left

      return {
        height: `${capsule.height}px`,
        top: `${capsule.top}px`,
        right: 0,
        marginRight: `${capsuleRight + 8}px`
			}
    },
	},
  created () {
  },
  mounted() {
    this.initNavBar()
  },
  methods: {
    // 初始化navbar，获取属性参数
    initNavBar() {
      const query = uni.createSelectorQuery().in(this);
      query.select('#cart-nav').boundingClientRect(data => {
        this.$emit('navBarInfo', {
          navHeight: data.height
        })
      }).exec();
    },

    // 修改编辑状态
    altEditState() {
      if (!this.canEdit) {
        this.$u.toast(`当前购物车内没有商品哦~`)
        return
      }
      this.isEdit = !this.isEdit
      this.$emit('emitEdit', this.isEdit)
    }
  },
};
</script>

<style scoped lang="scss">
.cart-nav {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 999;
	&__fill {
		background-color: #fff;
	}
	&__content {
		height: 88rpx;
		background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
	}
	&__content-icon {
		width: 220rpx;
		height: 88rpx;
		margin-left: 16rpx;
	}
  &__content-edit {
    width: 88rpx;
    height: 64rpx;
    background: rgba(255,255,255,0.6);
    border-radius: 50rpx;
    border: 1px solid rgba(151,151,151,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    .edit {
      width: 40rpx;
		  height: 40rpx;
    }
  }
}
</style>
