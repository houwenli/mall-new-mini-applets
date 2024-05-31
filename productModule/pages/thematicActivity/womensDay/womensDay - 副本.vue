<template>
  <div class="boxWrapper">
		
    <div class="bannerBox">
      <img :src="bannerUrl" />
    </div>

    <div style="padding-bottom: 68rpx; position: relative">
      <div class="contentBox">
        <div
          class="goodsBox"
          v-for="(item, index) in list"
          :key="index"
          @click="goSpuDetail(item.skuId)"
        >
          <div class="imgBox">
            <!-- <img :src="spuImgUrl[index]" /> -->
            <img v-if="item.skuImages" :src="item.skuImages[0].url" alt="" />
          </div>
          <div class="goodsInfoBox">
            <div class="goodsTitle doubleoverline">{{ item.skuName }}</div>
            <div class="goodsEffect overline">{{ spuTitle[index] }}</div>
            <div class="goodsMoneyBox">
              <div class="money_l">
                <div class="salePrice">
                  ¥
                  <span>
                    {{ parseInt(item.finalPrice) }}
                  </span>
                  {{
                    item.finalPrice % 1 != 0
                      ? "." +
                        (item.finalPrice % 1)
                          .toFixed(2)
                          .toString()
                          .split(".")[1]
                      : ".00"
                  }}
                </div>
                <div class="oldPrice" v-if="item.price">¥{{ item.price.toFixed(2) }}</div>
              </div>
              <div class="buynow">立即抢购</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分享 -->
    <button open-type="share" class="share-btn">
      <image :src="shareIcon"></image>
    </button>
    <!--  <div class="share-btn" v-if="isShowShareIcon" @click="goShare">
      <img :src="shareIcon" />
    </div> -->
  </div>
</template>

<script>
// import { selectPerformanceSkuBySpuId } from "@/api/activities/thematicActivity";
// import { encrypt } from "@/utils/sign";
import httpInterceptor from "@/common/http.interceptor.js";
import {visit} from '@/common/visit.js'
export default {
  data() {
    return {
      isShowShareIcon: true,
			bannerUrl: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/52e7803da822d55cc8855d786b56b89a.png',
      shareIcon:"https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/e5f81918971f644df3870bb7a23598d6.png",
			shareImg: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/e03e341331bf635d49e753e27eccc597.png',
      list: [],
			spuImgUrl:[],
			spuTitle: [
				'滴滴润养 水嫩Q弹',
				'无菌防层更透气',
				'抑菌杀菌 口气更清新',
				'风车郁金香  迷情风车梦',
				'全方位缓压  舒适靠枕',
				'流光磁吸  一触即插',
				'家庭装强力去污',
				'为薄而生 与众不同',
			],
    };
  },
  onShareAppMessage(options) {
    let url = "productModule/pages/thematicActivity/womensDay/womensDay";
    return {
      title: "女王节狂欢，全场3.8折起",
      desc: "",
      imageUrl: this.shareImg,
      path: url,
    };
  },
  onLoad() {
    this.getInfo();
  },
	onShow(){
		visit(this,"女王节日活动页")
	},
  computed: {
    userId() {
      return this.$store.getters.userId;
    },
  },
  methods: {
    goSpuDetail(id) {
      this.$wsf.go("SkuDetail", { skuId: id });
    },
    getInfo() {
      let arr;
      if (httpInterceptor.baseUrl == "https://api-test.wsfmall.com/api/applets") {
        arr = ['388',"285", "295", "285", "295"];
      } else if (httpInterceptor.baseUrl == "https://api-uat.wsfmall.com/api/applets") {
        arr = ['84',"85", "87", "89", "229"];
      } else if (httpInterceptor.baseUrl == "https://api.wsfmall.com/api/applets") {
        arr = ['540', '416', '361', '298', '456', '536', '163', '36'];
      }
      this.$u.api.SelectPerformanceSkuBySpuId(arr).then((res) => {
        if (res.code == 200) {
          this.list = res.data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 240rpx;
  height: 240rpx;
  background-color: #fff;
}
.boxWrapper {
  background-color: #d21650;
}
.bannerBox {
  width: 100%;
  height: 564rpx;
  // margin-top: 88rpx;
  z-index: -1;
  img {
    width: 100%;
    height: 100%;
  }
}
.overline {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.doubleoverline {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.contentBox {
  margin: -40rpx 28rpx 0px;
  .goodsBox {
    padding: 14rpx 24rpx 14rpx 14rpx;
    margin: 20rpx 0;
    background-color: #ffeee0;
    border: 6rpx solid #f1ba8d;
    border-radius: 20rpx;
    display: flex;
		.imgBox {
			display: block;
			width: 300rpx;
			height: 300rpx;
			background: #fafafa;
			img {
				width: 300rpx;
				height: 300rpx;
				border-radius: 10rpx;
			}
		}
    .goodsInfoBox {
      width: 328rpx;
      margin-left: 20rpx;
      margin-right: 20rpx;
      padding: 26rpx 0;
      .goodsTitle {
        font-size: 32rpx;
        color: #000;
        font-weight: bold;
        height: 80rpx;
        line-height: 40rpx;
      }
      .goodsEffect {
        margin: 8rpx 0 44rpx;
        font-size: 24rpx;
        color: #999;
      }
      .goodsMoneyBox {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .money_l {
          .salePrice {
            font-size: 24rpx;
            color: #e60113;
            font-weight: bold;
            span {
              display: inline-block;
              font-size: 40rpx;
              // margin: 0 -2rpx 0 -2rpx;
            }
          }
          .oldPrice {
            color: #999;
            text-decoration: line-through;
          }
        }
        .buynow {
          width: 140rpx;
          height: 60rpx;
          border-radius: 40rpx;
          line-height: 60rpx;
          // background-color: #ffa000;
          background: linear-gradient(180deg, #ffa000 0%, #c82b1d 100%);
          text-align: center;
          font-size: 26rpx;
          font-weight: bold;
          color: #fff;
        }
      }
    }
  }
}
.share-btn {
  padding: 0;
  position: fixed;
  right: 0;
  bottom: 200rpx;
  width: 100rpx;
  height: 70rpx;
  image {
    width: 100%;
    height: 100%;
  }
}
button {
  border-radius: 0;
  padding: 0;
  margin: 0;
  background-color: transparent;
  line-height: 24rpx;
  outline: none;
}
button::after {
  border: none;
}
// .share-btn {
//   position: fixed;
//   right: 0;
//   bottom: 100px;
//   width: 50px;
//   height: 35px;
//   z-index: 999;
//   img {
//     width: 100%;
//     height: 100%;
//   }
// }
</style>