<template>
  <view class="columns-container" data-desc='双列图'>
    <view class="item" v-for="(item, index) in config.list" :key="index" @click="toPage(item)" >
      <image v-if="item.url" class="pic" :src="item.url" alt="" />
      <image class="pic" v-else src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/b3f409c482e4d194b3784fcc88997042.png" />
    </view>
  </view>
</template>

<script>
import { toPage } from './data.js'
// 魔方图片
export default {
  name: 'style-2',
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          list: []
        }
      },
    },
  },
  data () {
    return {}
  },
  methods: {
    toPage
  }
}
</script>

<style lang="less" scoped>
.columns-container {
  display: flex;
  // margin-bottom: 10rpx;

  .item {
    flex: 1;
    // 这里不可写固定像素，在安卓机上，会表现出2个元素的间距很大
    // width: 158px;
    height: 200rpx;
    border-radius: 24rpx;
    overflow: hidden;

    &:first-child {
      margin-right: 22rpx;
    }

    .pic {
      width: 100%;
      height: 100%;
      border: none;
    }

    img[src=''] {
      opacity: 0;
    }
  }
}
</style>