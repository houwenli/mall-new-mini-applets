<template>
  <div class="single-content" :style="{ height: pageHeight }">
    <swiper class="swiper-box" ref="mySwiper" v-if="list.length > 0" vertical duration="80" easing-function="linear"	:display-multiple-items="displayMultipleItems"
      @change="pageChange">


      <swiper-item v-for="(item, index) in list" :key="item.id" class="swiper-slide" :class="{ 'active-top': index <= 3 && current + 1 === index }">
        <goodsInfo :item="item"></goodsInfo>

        <div class="page-swiper">
          <swiperControl :carouselPics="item.carouselPics" :video="item.video" :videoPic="item.videoPic"></swiperControl>
        </div>


        <div class="foot-box safe_bottom">
          <div class="favouritebox">
            <img :src="`https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-${ !item.hasAtten ? 'yet' : 'yettrue'}.png`" alt @click="favouriteChange(item)" />
            <span class="favourite-text">{{ item.hasAtten ? '已收藏' : '收藏' }}</span>
          </div>
          <div class="foot-bt">
            <button class="add-car" @click="shopping(item, 1, index)">加入购物车</button>
            <button class="buy-now" @click="shopping(item, 2, index)">立即购买</button>
          </div>
        </div>
      </swiper-item>
    </swiper>

    <skuPopup :show.sync="showSkuPopup" :sku-data="skuDetail" @skuConfirm="skuConfirm" @updateSku="shopping" :nowSourceType="nowSourceType" :openType="shoppingType" @goodsImgShow="goodsImgShow"></skuPopup>

    <!-- 规格图片预览 -->
    <u-mask :show="previewImg" @click="previewImg = false" z-index="99999">
      <view style="width: 100%; height: 100%; position: relative">
        <view class="rect" @tap.stop @click="previewImg = false"><u-image :src="previewshowImg" mode="widthFix"></u-image>
        </view>
      </view>
    </u-mask>

  </div>
</template>
<script>


import swiperControl from './components/swiper.vue'


import skuPopup from './components/skuPop.vue'
import goodsInfo from './components/goodsInfo'


export default {
  name: 'singlePage',
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      },
    },

    fillPadding: {
      type: Number,
      default: 0
    },

    spuId: {
      type: [String, Number],
      default: ''
    }
  },

  components: {
    swiperControl,
    skuPopup,
    goodsInfo
  },

  data() {
    return {
      // height: window.innerHeight,
      list: [],

      skuShow: false,
      skuInfo: {},
      current: 0,

      loadding: true,
      finished: false,
      showSkuPopup: false,
      mySwiper: null,

      pageNum: 0,
      pageSize: 10,

      shoppingType: 1,
      skuDetail: {},

      previewImg: false,
      previewshowImg: '',
      nowSourceType: 1,
      displayMultipleItems: 1.1,
      current: 0
    }
  },

  computed: {
    pageHeight({ fillPadding }) {
      return `calc(100vh - ${fillPadding}px)`
    }
  },

  created() {
    this.queryList()
  },

  methods: {
    isCouponLable(data) {
      return data && data.couponLable && data.couponLable.length != 0 && data.couponLable[0].afterCouponPrice
    },
    pageChange({ detail }) {
      let index = detail.current
      this.displayMultipleItems = index > 2 ? 1 : 1.1
      this.current = index
      if (index === this.list.length - 1 && !this.loadding && !this.finished) {
        this.queryList()
      }
    },

    openSkuPop(item, index) {
      let skuId = item.id || item.skuId,
        sourceType = this.nowSourceType,
        params = {
          skuId,
          sourceType
        }
      this.$u.api.QuerySpuDetail(params).then(res => {
        if (res.code == 200 && index === this.current) {
          this.skuDetail = res.data;
          this.showSkuPopup = true
        }
      })
    },

    shopping(item, isFrom, index) {
      this.shoppingType = isFrom || this.shoppingType
      this.nowSourceType = item.sourceType || item.goodsType || 1
      this.openSkuPop(item, index)
    },

    async queryList() {
      this.loadding = true
      let param = {
        spuId: this.spuId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        recommendNum: this.config.showNum,
      }
      try {
        let res = await this.$u.api.getsiglePageSpuList(param)
        if (res.code === 200) {
          let data = (res.data || []).map((item) => {
            return this.dataConfig(item)
          })
          this.list = this.list.concat(data)
          this.pageNum++

          if (data.length < this.pageSize) {
            this.finished = true
          }
        }
      } catch (error) {
        console.log(error)
      }
      this.loadding = false
    },

    // 加入购物车
    handleAddCart(data) {
      this.$u.api.AddShoppingCart(data).then((res) => {
          if (res.code == 200) {
            this.$u.toast("添加购物车成功");
            this.showSkuPopup = false
          }
        })
        .catch(() => {
          // this.loading = false;
        });
    },

    async handleBugNow(data) {
      let buyNowRequestList = [];

			buyNowRequestList.push(data);
			buyNowRequestList = JSON.stringify(buyNowRequestList);
			this.$wsf.go("Settlement", {
				buyNowRequestList
			});
			
    },

    skuConfirm(data) {
      if (this.shoppingType === 1) {
        this.handleAddCart(data)
      } else if (this.shoppingType === 2) {
        this.handleBugNow(data)
      }
    },

    goodsImgShow(data) {
      this.previewImg = true;
      this.previewshowImg = data;
    },

    dataConfig(data) {
      // 轮播图片
      let carouselPics = (data.spuImages || [{ url: data.url }]).map((item) => {
        let image = item.url.split('?')[0]
        let imgUrl = image.split('/')
        let img = imgUrl.join('/')
        img += '?imageView2/1/w/750'
        return img
      })

      let video = data.video
      let videoPic = ''
      if (video) {
        videoPic = carouselPics[0]
        carouselPics.unshift(videoPic)
      }

      return {
        carouselPics,
        id: data.skuId,
        ...data,
        video,
        videoPic
      }
    },



    // 收藏或者取消收藏商品
    favouriteChange(item) {
      // 收藏或者取消收藏商品
      let params = {
        skuId: item.id,
        sourceType: item.sourceType || 1,
        storeId: item.storeId,
      }


      if (item.hasAtten) {
        this.$u.api.CancelSkuAttention(params).then((res) => {
          if (res.code == 200) {
            this.$u.toast("已取消收藏");
            item.hasAtten = false
          } else {
            this.$u.toast(res.msg)
          }
        }).catch(res=> {
          this.$u.toast('取消收藏失败')
        })
      } else {
        this.$u.api.AddSkuAttention(params).then((res) => {
          if (res.code == 200) {
            this.$u.toast("收藏成功");
            item.hasAtten = true;
          }
        }).catch(res=> {
          this.$u.toast('收藏失败')
        })
      }

    },
  },
}
</script>
<style lang="less" scoped>
.single-content {
  // height: 100vh;
  overflow-y: hidden;
  background: #fff;
  // background: rgba(0, 0, 0, 0.1);
}

.swiper-box {
  height: 100%;
}

.swiper-slide {
  display: flex;
  flex-direction: column;

  .page-swiper {
    flex: 1;
    width: 100%;
  }
}

.active-top {
  background-color: #fff;
  border-radius: 48rpx 48rpx 0 0;
  overflow: hidden;
}

.foot-box {
  width: 100%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding-right: 12px;
  padding-left: 8px;
  box-sizing: content-box;

  .favouritebox {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    img {
      width: 21px;
      height: 20px;
    }

    .favourite-text {
      font-size: 11px;
      color: #999999;
      line-height: 15px;
    }
  }

  .foot-bt {
    display: flex;
    padding-right: 24rpx;

    .add-car,
    .buy-now {
      padding: 0;
      width: 130px;
      height: 40px;
      line-height: 40px;
      color: #fff9e9;
      text-align: center;
      border-radius: 40rpx;
      font-weight: 500;
      font-size: 32rpx;

      &::after {
        display: none;
      }
    }

    .add-car {
      background-color: #ffbe0c;
      margin-right: 10rpx;

    }

    .buy-now {
      background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
    }
  }
}
.rect {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	width: 100%;
}
</style>
