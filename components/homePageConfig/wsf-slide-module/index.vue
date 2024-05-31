<template>
  <!-- 滑动区块组件 -->
  <view
    v-if="listData.hasBackground == '1'"
    @click.stop="navigate(listData.bgImageData)"
    class="slide_module"
    :style="{ backgroundImage: listData.bgImage?`url(${listData.bgImage})`:'',backgroundColor: listData.bgColor ? listData.bgColor:'#fff', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }"
  >
    <view class="module-title" v-if="listData.showComTitle == '1'">{{listData.comTitle}}</view>
    <view class="image_list">
      <view class="img_item" v-for="(item, index) in listData.sildeshowList" :key="index">
        <view
          @click.stop="navigate(item,index)"
          class="image"
          :style="{
            'background-image': item.url?`url(${item.url})`:'url(https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/549ce60fc79c20c37ba6c9b5ae879339.png)',
            'background-repeat': 'no-repeat',
            'background-size': 'cover',
            'background-position': 'center',
          }"
        ></view>
      </view>
    </view>
  </view>
  <view class="no_bg_slide_module" v-else>
     <view class="image_list">
      <view class="img_item" v-for="(item, index) in listData.sildeshowList" :key="index">
        <view
          @click.stop="navigate(item,index)"
          class="image"
          :style="{
            'background-image': item.url?`url(${item.url})`:'url(https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/549ce60fc79c20c37ba6c9b5ae879339.png)',
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
  export default {
    props: {
      listData: {
        type: Object,
        default: () => {
          return {
            bgImageData: {
              url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/ebd08cffe35e4c899fc9daf5c8790ead.png',
              link: '',
            },
            sildeshowList: [],
          }
        },
      },
			isDistribution: {
			  type: Boolean,
			  required: false,
			  default: () => false,
			},
    },
    methods: {
      navigate(data,index) {
				let link
				if(this.isDistribution) {
					link = data.link.split('~')[1]
				} else {
					link = data.link
          if(!link) return
          if(link.indexOf('/spudetail') !== -1) {
            let id = link.split('id=')[1]
            link = `productModule/pages/skuDetail/skuDetail?skuId=${id}`
          } else if(link.indexOf('/firstOrder') !== -1) {
            let id = link.split('id=')[1]
            link = `productModule/pages/firstOrder/firstOrder?id=${id}`
          } else if(link.indexOf('/spulist') !== -1) {
            let id = link.split('cateId=')[1]
            link = `productModule/pages/spuList/spuList?cateId=${id}`
          }
				}
        if(!this.isDistribution){
          let obj = {
            name:"滑动区块",
            type: 7,
            image:data.url || '',
            url:link || '',
            index:index
          }
          this.$store.dispatch("SETTINGS/advertVisitRequest",obj);
        }

        this.$wsf.go(link);
      },
    },
  }
</script>

<style scoped lang="scss">
  .no_bg_slide_module {
    margin: 0 24rpx;
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
