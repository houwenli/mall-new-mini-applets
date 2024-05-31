<template>
  <view class="container">
    <view v-if="config.hasBackground === '1'" class="group-panel"
      :style="{
        backgroundImage: `url(${config.leftBgImage}) no-repeat center`,
        'background-size': '100% 100%',
        'background-color': `${config.leftBgColor}` || '#FFFFFF',
      }"
    >
      <view v-if="config.hasBackground === '1' && config.showComTitle === '1'" class="title">{{ config.leftTitle }}</view>
      <view class="pic-list">
        <view v-for="(item, index) in leftList" :key="index" class="item" @click="toRouter(item)">
          <image v-if="item.url" class="pic" :src="item.url" />
          <image
            v-else
            class="pic"
            src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/9b496c274eacdd0606e79714d08d8c1d.png"
          />
        </view>
      </view>
    </view>
    <view v-if="config.hasBackground === '1'" class="group-panel"
      :style="{
        backgroundImage: `url(${config.rightBgImage}) no-repeat center`,
        'background-size': '100% 100%',
        'background-color': `${config.rightBgColor}` || '#FFFFFF',
      }"
    >
      <!-- 标题 -->
      <view v-if="config.hasBackground === '1' && config.showComTitle === '1'" class="title">
        {{ config.rightTitle }}
      </view>
      <view class="pic-list">
        <view v-for="(item, index) in rightList" :key="index" class="item" @click="toRouter(item)">
          <image v-if="item.url" class="pic" :src="item.url" />
          <image
            v-else
            class="pic"
            src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/9b496c274eacdd0606e79714d08d8c1d.png"
          />
        </view>
      </view>
    </view>
    <view v-if="config.hasBackground === '0'" class="flex-center">
      <view v-for="(item, index) in config.list" :key="index" class="noBackgeround" @click="toRouter(item)">
        <image v-if="item.url" class="pic" :src="item.url" />
        <image
          v-else
          class="pic"
          src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/9b496c274eacdd0606e79714d08d8c1d.png"
        />
      </view>
    </view>
  </view>
</template>

<script>
import { goPage } from '@/pages/index/helper/index.js'

export default {
  props: {
    config: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {};
  },
  computed: {
    leftList() {
      return this.config.list.filter((item, index) => index < 2)
    },
    rightList() {
      return this.config.list.filter((item, index) => index > 1)
    }
  },
  methods: {
      // 路由跳转
    toRouter(params) {
			// let link
			// if(this.isDistribution) {
			// 	link = params.link.split('~')[1]
			// } else {
			// 	link = params.link
      //   if(!link) return
      //   if(link.indexOf('/spudetail') !== -1) {
      //     let id = link.split('id=')[1]
      //     link = `productModule/pages/skuDetail/skuDetail?skuId=${id}`
      //   } else if(link.indexOf('/firstOrder') !== -1) {
      //     let id = link.split('id=')[1]
      //     link = `productModule/pages/firstOrder/firstOrder?id=${id}`
      //   } else if(link.indexOf('/spulist') !== -1) {
      //     let id = link.split('cateId=')[1]
      //     link = `productModule/pages/spuList/spuList?cateId=${id}`
      //   }
			// }
      // this.$wsf.go(link);
      goPage(params.link)
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: space-between;
  margin: 0 24rpx;
  .title {
    font-size: 30rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #222222;
    margin-bottom: 16rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .item {
    width: 148rpx;
    height: 148rpx;
    border-radius: 24rpx;
    overflow: hidden;

    .pic {
      width: 100%;
      height: 100%;
    }
  }
  .noBackgeround{
    width: 160rpx;
    height: 160rpx;
    border-radius: 24rpx;
    overflow: hidden;

    .pic {
      width: 100%;
      height: 100%;
    }
  }
  .group-panel {
    border-radius: 32rpx;
    width: 340rpx;
    height: 244rpx;
    padding: 24rpx 16rpx 16rpx 16rpx;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    .pic-list {
      display: flex;
      justify-content: space-between;
    }
  }
  .flex-center{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
