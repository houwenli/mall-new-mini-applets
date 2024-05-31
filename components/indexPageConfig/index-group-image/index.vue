<template>
  <!-- 多列图 -->
  <view style="margin:0 24rpx">
     <view class="bg_img_list_box" v-if="listDataOptions.hasBackground == '1'"  :style="{height: hasBgStyle[row - 1].boxHeight + 'rpx', background: listDataOptions.backgroundType == '1' ? `url(${listDataOptions.bgImage}) no-repeat center center` : '#fff', backgroundColor: listDataOptions.backgroundType == '0' ? listDataOptions.bgColor : '#fff'}">
      <view class="module_title">
        <text v-if="listDataOptions.showComTitle == '1'">{{listDataOptions.comTitle}}</text>
      </view>
      <view class="img_list" style="padding: 0 24rpx">
        <view class="image" v-for="(item, index) in listDataOptions.sildeshowList" :key="index">
          <image
            v-if="item.url"
            :style="{
              width: hasBgStyle[row - 1].width + 'rpx',
              height: hasBgStyle[row - 1].height + 'rpx',
            }"
            :src="item.url"
            @click="toRouter(item,index)"
          />
          <image
            v-else
            :style="{
              width: hasBgStyle[row - 1].width + 'rpx',
              height: hasBgStyle[row - 1].height + 'rpx',
            }"
            :src="imageArr[row - 1].sildeshowList[index]['url_' + listDataOptions.radio]"
            @click="toRouter(item,index)"
          />
        </view>
      </view>
    </view>
    <view class="img_list" v-else>
      <view class="image" v-for="(item, index) in listDataOptions.sildeshowList" :key="index">
        <image
           v-if="item.url"
          :style="{
            width: noBgStyle[row - 1].width + 'rpx',
            height: noBgStyle[row - 1].height + 'rpx',
          }"
          :src="item.url"
          @click="toRouter(item,index)"
        />
        <image
          v-else
          :style="{
            width: noBgStyle[row - 1].width + 'rpx',
            height: noBgStyle[row - 1].height + 'rpx',
          }"
          :src="imageArr[row - 1].sildeshowList[index]['url_' + listDataOptions.radio]"
          @click="toRouter(item,index)"
        />
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
			isDistribution: {
			  type: Boolean,
			  required: false,
			  default: () => false,
			},
      row: {
        type: Number,
        default: 1,
        required: false,
      },
      listData: {
        type: Array,
        default: () => [
          {
            radio: 72,
            sildeshowList: [],
          },
          {
            radio: 100,
            sildeshowList: [],
          },
          {
            radio: 100,
            sildeshowList: [],
          },
          {
            radio: 100,
            sildeshowList: [],
          },
        ],
        required: true,
      },
    },
    data() {
      return {
        listDataOptions:[],
        noBgStyle: [
          {
            width: 702,
            height: 200,
          },
          {
            width: 340,
            height: 200,
          },
          {
            width: 220,
            height: 220,
          },
          {
            width: 160,
            height: 160,
          },
        ],
        hasBgStyle:  [
          {
            boxHeight: 304,
            width: 654,
            height: 200,
          },
          {
            boxHeight: 304,
            width: 316,
            height: 200,
          },
          {
            boxHeight: 308,
            width: 204,
            height: 204,
          },
          {
            boxHeight: 252,
            width: 148,
            height: 148,
          },
        ],
        imageArr: [
          {
            sildeshowList: [
              {
                id: 'u763419801',
                url_72: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/40bee560607cba072f39a1d890510b1e.png',
                url_120: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/f4ab976c42c8839cd18889776801a6ee.png',
                url_140: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/16f7e6e4e2f8df712b7ed9b088e9e91b.png',
              },
            ],
          },
          {
            sildeshowList: [
              {
                id: 'u147542210',
                url_100: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/7969652262ea22bd87217d1e834c800c.png',
                url_120: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/3e04fa9f2e487d701b0a978db89f086d.png',
                url_140: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/4ff35b4dd400a1a45e79f63c8c777f45.png',
              },
              {
                id: 'u061424050',
                url_100: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/7969652262ea22bd87217d1e834c800c.png',
                url_120: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/3e04fa9f2e487d701b0a978db89f086d.png',
                url_140: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/4ff35b4dd400a1a45e79f63c8c777f45.png',
              },
            ],
          },
          {
            sildeshowList: [
              {
                id: 'u230297030',
                url_100: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/b2b177e6a991e4d84d14ab3d7e35b95c.png',
                url_120: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/623b23d7675dca56b719da22291353ad.png',
                url_140: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/efe1d17d8029ed4b982ed0f0a37dafe7.png',
              },
              {
                id: 'u028196068',
                url_100: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/b2b177e6a991e4d84d14ab3d7e35b95c.png',
                url_120: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/623b23d7675dca56b719da22291353ad.png',
                url_140: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/efe1d17d8029ed4b982ed0f0a37dafe7.png',
              },
              {
                id: 'u214342952',
                url_100: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/b2b177e6a991e4d84d14ab3d7e35b95c.png',
                url_120: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/623b23d7675dca56b719da22291353ad.png',
                url_140: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/efe1d17d8029ed4b982ed0f0a37dafe7.png',
              },
            ],
          },
          {
            sildeshowList: [
              {
                id: 'u738913719',
                url_100: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/1659aa73068d6a0aab735f4c85a6e255.png',
                url_120: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/175b62346b46cc7aba0be3d900ccc868.png',
                url_140: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/c69e4b4249c65748f9dc5ed4cdb1199b.png',
              },
              {
                id: 'u712080121',
                url_100: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/1659aa73068d6a0aab735f4c85a6e255.png',
                url_120: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/175b62346b46cc7aba0be3d900ccc868.png',
                url_140: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/c69e4b4249c65748f9dc5ed4cdb1199b.png',
              },
              {
                id: 'u386134174',
                url_100: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/1659aa73068d6a0aab735f4c85a6e255.png',
                url_120: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/175b62346b46cc7aba0be3d900ccc868.png',
                url_140: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/c69e4b4249c65748f9dc5ed4cdb1199b.png',
              },
              {
                id: 'u386155308',
                url_100: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/1659aa73068d6a0aab735f4c85a6e255.png',
                url_120: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/175b62346b46cc7aba0be3d900ccc868.png',
                url_140: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/c69e4b4249c65748f9dc5ed4cdb1199b.png',
              },
            ],
          },
        ],
      }
    },
    mounted(){
      this.listDataOptions = this.listData[this.row - 1]
    },
    methods: {
      toRouter(item,index) {
          let i = this.row - 1
          let url = this.listData[i].sildeshowList[index].link || null,link
          // 流量分析埋点
          let titleArr = ["单列图","双列图","三列图","四列图"],
              type = [3,4,5,6],
              image = item['url_' + this.listData[this.row - 1].radio]
          if(!url) {
            if(!this.isDistribution){
              let obj = {
                name:titleArr[this.row-1],
                type: type[this.row-1],
                image:image || '',
                url:'',
                index:index
              }
              this.$store.dispatch("SETTINGS/advertVisitRequest",obj);
            }
            
           return
          }
					if(this.isDistribution) {
						link = url.split('~')[1]
					} else {
						link = url
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
              name:titleArr[this.row-1],
              type: type[this.row-1],
              image:image || '',
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
  .img_list {
    overflow: hidden;
    width: 100%;
    display: flex;
    .image {
      width: 100%;
      margin-left: 10rpx;
      image {
        border-radius: 24rpx;
        display: block;
      }
    }
    .image:first-child {
      margin-left: 0rpx;
    }
  }
  .bg_img_list_box {
    width: 100%;
    height: 304rpx;
    border-radius: 24rpx;
    background-size: 100% 100%;
    .module_title {
      padding: 24rpx 24rpx 16rpx;
      font-size: 30rpx;
      font-weight: 600;
      color: #222;
      line-height: 40rpx;
      height: 40rpx;
      box-sizing: content-box;
    }
  }
</style>
