<template>
  <!-- 分销组件 -->
  <view
    class="distribution"
    v-if="getDistribution"
    @click.self="goDistributionIndex"
    :style="{'margin-top': `${listData.blankHeight*2 || 0}rpx`}"
  >
    <view
      class="image_list"
      :style="{
        height: '200rpx',
        'background-image': listData.bgImage?`url(${listData.bgImage})`:'url(https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/40bee560607cba072f39a1d890510b1e.png)',
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-position': 'center',
      }"
    >
    <template v-for="(item, index) in listData.styles[listData.radio]">
      <image
        @click.stop="navigate(item,index)"
        class="img_item"
        :key="index"
        :src="item.url"
        v-if="item.url"
      />
      <image
        v-else
        @click.stop="navigate(item,index)"
        class="img_item"
        :key="index"
        src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/549ce60fc79c20c37ba6c9b5ae879339.png"
      />
    </template>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  props: {
    hasPower: {
      type: Boolean,
      default: false,
    },
    listData: {
      type: Object,
      default: () => {
        return {
          // 0: 风格1 1: 风格2 2: 风格3
          radio: 0,
          bgImage:
            "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/1a764c3ad0a4f6dbdf3e4f7ecdb80bb3.png",
          styles: [
            [],
            [
              {
                id: 1,
                url: "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/1a764c3ad0a4f6dbdf3e4f7ecdb80bb3.png",
                link: "",
              },
              {
                id: 2,
                url: "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/1a764c3ad0a4f6dbdf3e4f7ecdb80bb3.png",
                link: "",
              },
            ],
            [
              {
                id: 1,
                url: "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/1a764c3ad0a4f6dbdf3e4f7ecdb80bb3.png",
                link: "",
              },
              {
                id: 2,
                url: "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/1a764c3ad0a4f6dbdf3e4f7ecdb80bb3.png",
                link: "",
              },
              {
                id: 3,
                url: "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/1a764c3ad0a4f6dbdf3e4f7ecdb80bb3.png",
                link: "",
              },
            ],
          ],
        };
      },
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    // 是否展示分销专区
    getDistribution() {
      let isLink = getApp().globalData.isLink; // 是否登录
      let getDistribution =
        this.$store.getters.getDistribution || this.hasPower; // 是否有分销权限

      if (isLink && getDistribution) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    //分销商城
    goDistributionIndex() {
      let obj = {
          name:"分销",
          type: 10,
          image:this.listData.bgImage?this.listData.bgImage:'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/40bee560607cba072f39a1d890510b1e.png',
          url:'distributionModule/pages/distributionIndex/distributionIndex'
        }
        this.$store.dispatch("SETTINGS/advertVisitRequest",obj);
      this.$wsf.go("distributionIndex");
    },
    navigate(data,index) {
      let url = this.listData.styles[this.listData.radio][index].link
      if(url.indexOf("~") !== -1){
        url = url.split("~")[1]
      }
      let obj = {
          name:"分销",
          type: 10,
          image:data.url || '',
          url:url || '',
          index:index
        }
        this.$store.dispatch("SETTINGS/advertVisitRequest",obj);
      this.$wsf.go(url);
    },
  },
};
</script>

<style scoped lang="scss">
.distribution {
  margin: 0 24rpx;
  .image_list {
    display: flex;
    justify-content: flex-end;
    border-radius: 20rpx;
    padding: 20rpx 0px;
    background-color: #fff;
    .img_item {
      margin-right: 20rpx;
      border-radius: 20rpx;
      width: 160rpx;
      height: 160rpx;
    }
  }
}
</style>
