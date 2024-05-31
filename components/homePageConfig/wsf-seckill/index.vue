<template>
  <view :style="{'margin-top': `${listData.blankHeight*2 || 0}rpx`}" class="seckill" @click="toRouter" :key="floor.id" v-if="seckillData && seckillData.length > 0">
    <view
      class="main"
      :style="{
        background: `url(${listData.bgImage}) no-repeat center`,
        'background-size': '100%',
        'background-color': `${listData.bgColor}`,
      }"
    >
      <view class="title">
        <view class="title-left">限时秒杀</view>
        <view class="title-right">
          <text class="txt-1">{{
            timestamp.secen ? timestamp.secen : ""
          }}</text>
          <text class="txt-2">{{
            timestamp.label ? "," + timestamp.label : ""
          }}</text>
          <view class="u-margin-left-10 u-margin-right-10">
            <u-count-down
              color="#fff"
              :font-size="20"
              separator-color="#E60113"
              bg-color="#E60113"
              :timestamp="timestamp.seconds"
              :show-days="false"
            ></u-count-down>
          </view>
          <u-icon name="arrow-right"></u-icon>
        </view>
      </view>
      <view class="img-txt">
        <view
          class="img-txt-item"
          v-for="(item, index) in seckillData"
          :key="index"
        >
          <view class="img"
            ><image v-if="item.url" :src="item.url"></image
          ></view>
          <view class="txt">
            <text class="txt-item-1">￥</text>
            <text class="txt-item-2">{{ item.seckillPrice }}</text>
            <!-- 由于显示问题，先屏蔽 -->
            <!-- <text v-if="String(priceFilter(item.price * item.discount)).length < 6" class="txt-item-3"
                   >￥{{ item.price }}</text
                 > -->
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  props: {
    listData: {
      type: Object,
      required: true,
    },
    seckillData: {
      type: Array,
      default: () => [],
      required: true,
    },
    timestamp: {
      type: Object,
      default: () => {
        return { secen: "", label: "", seconds: 86400 };
      },
      required: true,
    },
  },
  methods: {
    toRouter(){
      this.$wsf.go('seckillList')
      let obj = {
          name:"秒杀",
          type: 9,
          image:this.listData.bgImage || '',
          url:'seckillList'
        }
        this.$store.dispatch("SETTINGS/advertVisitRequest",obj);
    }
  },
};
</script>

<style scoped lang="scss">
// 秒杀
.seckill {
  padding: 30rpx 24rpx 0;
  padding-top: 0rpx;
  .main {
    padding: 24rpx 20rpx 26rpx 20rpx;
    background: #ffffff;
    border-radius: 20rpx;
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title-left {
        font-size: 34rpx;
        font-weight: 500;
        color: #000000;
      }
      .title-right {
        display: flex;
        align-items: center;
        .txt-1,
        .txt-2 {
          font-size: 26rpx;
          font-weight: 500;
          color: #000000;
        }
      }
    }
    .img-txt {
      display: flex;
      padding-top: 24rpx;
      .img-txt-item {
        margin-left: 10rpx;
        text-align: center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        .img,
        image {
          width: 150rpx;
          height: 150rpx;
          border-radius: 10rpx;
          background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/shop_default.png');
        }
        .txt {
          margin-top: 10rpx;
          .txt-item-1 {
            text-align: center;
            font-size: 20rpx;
            font-weight: 500;
            color: #e60113;
          }
          .txt-item-2 {
            text-align: center;
            font-size: 28rpx;
            font-weight: 500;
            color: #e60113;
          }
          .txt-item-3 {
            text-align: center;
            font-size: 22rpx;
            font-weight: 400;
            color: #999999;
            text-decoration: line-through;
          }
        }
      }
    }
  }
}
</style>
