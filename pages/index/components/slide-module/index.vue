<template>
  <!-- 滑动区块组件 -->
  <!-- 有背景： 背景颜色/背景图片 -->
  <view
    v-if="config.hasBackground === '1'"
    class="slide_module"
    :style="[getStyle]"
  >
    <view class="module-title" v-if="config.showComTitle == '1'">{{
      config.comTitle
    }}</view>
    <view class="image_list">
      <view class="img_item" v-for="(item, index) in config.list" :key="index">
        <view
          @click.stop="navigate(item, index)"
          class="image"
          :style="{
            'background-image': item.url
              ? `url(${item.url})`
              : 'url(https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/549ce60fc79c20c37ba6c9b5ae879339.png)',
            'background-repeat': 'no-repeat',
            'background-size': 'cover',
            'background-position': 'center',
          }"
        ></view>
      </view>
    </view>
  </view>
  <!-- 无背景颜色 -->
  <view class="no_bg_slide_module" v-else>
    <view class="image_list">
      <view class="img_item" v-for="(item, index) in config.list" :key="index">
        <view
          @click.stop="navigate(item, index)"
          class="image"
          :style="{
            'background-image': item.url
              ? `url(${item.url})`
              : 'url(https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/549ce60fc79c20c37ba6c9b5ae879339.png)',
            'background-repeat': 'no-repeat',
            'background-size': 'cover',
            'background-position': 'center',
          }"
        ></view>
      </view>
    </view>
  </view>
</template>

<script>
import { goPage } from '@/pages/index/helper/index.js'

// 滑动区块组件
export default {
  name: 'SlideModule',
  props: {
    config: {
      type: Object,
      default: () => {},
    },
    isDistribution: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },

  computed: {
    getStyle() {
      if (this.config.bgColor) {
        return {
          backgroundColor: this.config.bgColor,
        };
      }

      return {
        'background-image': `url(${this.config.bgImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      };
    },
  },

  methods: {
    navigate(data, index) {
      // let link;
      // if (this.isDistribution) {
      //   link = data.link.split('~')[1];
      // } else {
      //   link = data.link;
      //   if (!link) return;
      //   if (link.indexOf('/spudetail') !== -1) {
      //     let id = link.split('id=')[1];
      //     link = `productModule/pages/skuDetail/skuDetail?skuId=${id}`;
      //   } else if (link.indexOf('/firstOrder') !== -1) {
      //     let id = link.split('id=')[1];
      //     link = `productModule/pages/firstOrder/firstOrder?id=${id}`;
      //   } else if (link.indexOf('/spulist') !== -1) {
      //     let id = link.split('cateId=')[1];
      //     link = `productModule/pages/spuList/spuList?cateId=${id}`;
      //   }
      // }

      let link =  data.link.split('~')[1] || data.link

      if (!this.isDistribution) {
        let obj = {
          name: '滑动区块',
          type: 7,
          image: data.url || '',
          url: link || '',
          index: index,
        };
        this.$store.dispatch('SETTINGS/advertVisitRequest', obj);
      }

      // this.$wsf.go(link);
      goPage(link)
    },
  },
};
</script>

<style scoped lang="scss">
.no_bg_slide_module {
  margin: 0 24rpx;
  // background: #fff;
}
.slide_module {
  padding: 86rpx 24rpx 24rpx 24rpx;
  border-radius: 24rpx;
  background-color: #fff;
  margin: 0 24rpx;
  box-sizing: border-box;
  position: relative;
  .module-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #222;
    line-height: 38rpx;
    position: absolute;
    left: 24rpx;
    top: 24rpx;
  }
}
.image_list {
  display: flex;
  overflow: auto;
  -ms-overflow-style: none; /* IE 10+ */
  scrollbar-width: none; /* Firefox */
  .img_item {
    box-sizing: border-box;
    margin-right: 16rpx;
    text-align: center;
    .image {
      width: 176rpx;
      height: 176rpx;
      border-radius: 24rpx;
    }
  }
  .img_item:last-child {
    margin-right: 0;
  }
}
.image_list::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>
