<template>
  <view class="columns-container" data-desc='四列图'>
    <!-- :style="getStyle" -->
    <view class="item" v-for="(item, index) in config.list" :key="index" @click="toPage(item)" >
      <image v-if="item.url" class="pic" :src="item.url" alt="" />
      <image class="pic" v-else src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/9b496c274eacdd0606e79714d08d8c1d.png" />
    </view>
  </view>
</template>

<script>
import { toPage } from './data.js'
// 魔方图片
export default {
  name: 'style-4',
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

  .item {
    flex: 1;
    width: 100%;
    width: 148rpx;
    height: 148rpx;
    border-radius: 24rpx;
    overflow: hidden;
    margin-right: 20rpx;

    &:last-child {
      margin-right: 0;
    }

    .pic {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
}
</style>