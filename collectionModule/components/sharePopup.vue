<template>
  <view>
    <u-popup
      :safe-area-inset-bottom="true"
      v-model="showShareModal"
      mode="bottom"
      border-radius="20"
      @close="cancelShare"
    >
      <view class="share-container">
        <view class="share-title">分享至</view>
        <view class="share-way">
          <button class="share-way-part" open-type="share">
            <image
              class="share-way-image"
              src="@/static/img/icon/WeChat@2x.png"
            ></image>
            <span>微信好友</span>
          </button>
          <button class="share-way-part" @click="handleShareWay()">
            <image
              class="share-way-image"
              src="@/static/img/icon/pt@2x.png"
            ></image>
            <span>生成海报</span>
          </button>
        </view>
        <view class="cancel-btn" @click="cancelShare">取消</view>
      </view>
    </u-popup>
    <r-canvas ref="rCanvas"></r-canvas>
    <view class="share-poster-mask" v-if="showPost" @touchmove.stop="stopTouch">
      <view class="share-poster-container">
        <view class="close-btn" @click="closePost"
          ><image src="@/static/img/icon/close_white@2x.png" mode=""></image
        ></view>
        <image :src="canvasPostImg"></image>
        <view class="save-btn" @click="savePost">保存图片</view>
      </view>
    </view>
  </view>
</template>

<script>
import httpInterceptor from "@/common/http.interceptor.js";
import { writeFile, removeSave } from "@/common/uploadFile.js";
import { pathToBase64 } from "@/components/r-canvas/image-tools/index.js";
export default {
  name: "sharePopup",
  data() {
    return {
      showShareModal: false,
      showPost: false,
      filePostImg: null,
      canvasPostImg: null,
    };
  },
  props: {
    sku: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    openShareModal() {
      this.showShareModal = true;
    },
    cancelShare() {
      this.showShareModal = false;
    },
    handleShareWay(type) {
      uni.showLoading({
        title: "长图生成中",
        mask: true,
      });
      this.showPost = false;
      this.showShareModal = false;
      let codeData = {
        scene: true,
        page: "collectionModule/pages/skuDetail/skuDetail",
        width: 60,
        autoColor: false,
        isCyaline: "true",
        data: {
          skuId: this.sku.skuId,
          enterPriseId: uni.getStorageSync("enterpriseAgencyId"),
        },
      };
      let header = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      if (getApp().globalData.isLink) {
        header["Authorization"] = "Bearer " + uni.getStorageSync("newToken");
      }
      uni.request({
        url: httpInterceptor.baseUrl + "/enterPriseGoods/share/code",
        header: header,
        data: codeData,
        responseType: "arraybuffer",
        method: "POST",
        success: (res) => {
          this.shareQrcode =
            "data:image/png;base64," + uni.arrayBufferToBase64(res.data);
          console.log(
            "data:image/png;base64," + uni.arrayBufferToBase64(res.data),
            "uniBase64"
          );
          this.removeBeforeFiles();
        },
      });
    },
    removeBeforeFiles() {
      removeSave()
        .then(() => {
          this.getUseCode();
        })
        .catch((e) => {
          uni.hideLoading();
          console.log(e);
        });
    },
    getUseCode() {
      writeFile(this.shareQrcode)
        .then((img) => {
          // codeUrl为base64格式的小程序码
          this.creatCanvasPost();
        })
        .catch((e) => {
          uni.hideLoading();
          console.log(e);
        });
    },
    creatCanvasPost() {
      let skuName = this.sku.skuName;
      if (skuName.length > 30) {
        skuName = skuName.substr(0, 30) + "…";
      }
      let that = this;
      this.$nextTick(async () => {
        // 初始化
        await that.$refs.rCanvas
          .init({
            canvas_id: "rCanvas",
            canvas_width: "241",
            canvas_height: "380",
            hidden: true,
          })
          .catch((err_msg) => {
            this.showToastError("海报生成失败，请稍后重试");
          });

        // 画图
        await that.$refs.rCanvas
          .drawImage({
            url: this.sku.skuImages[0],
            x: 12,
            y: 12,
            w: 217,
            h: 217,
          })
          .catch((err_msg) => {
            this.showToastError("海报生成失败，请稍后重试");
          });

        // 画文字
        await that.$refs.rCanvas
          .drawText({
            text: "￥",
            x: 12,
            y: 254,
            font_color: "#E60113",
            font_size: 12,
            font_weight: "bold",
          })
          .catch((err_msg) => {
            this.showToastError("海报生成失败，请稍后重试");
          });

        await that.$refs.rCanvas
          .drawText({
            text: this.sku.entPurchasePrice.toFixed(2),
            x: 24,
            y: 254,
            font_color: "#E60113",
            font_size: 17,
            font_weight: "bold",
          })
          .catch((err_msg) => {
            this.showToastError("海报生成失败，请稍后重试");
          });

        await that.$refs.rCanvas
          .drawText({
            text: "价格具有时效性",
            x: 12,
            y: 270,
            font_color: "#666",
            font_size: 9,
            font_weight: "lighter",
          })
          .catch((err_msg) => {
            this.showToastError("海报生成失败，请稍后重试");
          });

        await that.$refs.rCanvas
          .drawText({
            text: skuName,
            max_width: 130,
            x: 12,
            y: 296,
            font_color: "#333333",
            font_size: 13,
            line_height: 19,
            font_weight: "lighter",
          })
          .catch((err_msg) => {
            this.showToastError("海报生成失败，请稍后重试");
          });

        await that.$refs.rCanvas
          .drawText({
            text: "-长按或扫码购买-",
            x: 156,
            y: 332,
            font_color: "#666",
            font_size: 9,
          })
          .catch((err_msg) => {
            this.showToastError("海报生成失败，请稍后重试");
          });

        await that.$refs.rCanvas
          .drawRect({
            x: 0,
            y: 360,
            w: 241,
            h: 20,
            color: "#FEF0F1",
          })
          .catch((err_msg) => {
            this.showToastError("海报生成失败，请稍后重试");
          });

        // 画图
        await that.$refs.rCanvas
          .drawImage({
            url: "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com///198ad539297fc070566ba83685372bb9.png",
            x: 103,
            y: 364,
            w: 36,
            h: 12,
          })
          .catch((err_msg) => {
            this.showToastError("海报生成失败，请稍后重试");
          });
        console.log(this.shareQrcode, "this.shareQrcode");
        // 画图
        await that.$refs.rCanvas
          .drawImage({
            url: this.shareQrcode,
            x: 163,
            y: 254,
            w: 60,
            h: 60,
          })
          .catch((err_msg) => {
            this.showToastError("海报生成失败，请稍后重试");
          });

        // 生成海报
        await that.$refs.rCanvas.draw((res) => {
          this.filePostImg = res.tempFilePath;
          //res.tempFilePath：生成成功，返回base64图片
          pathToBase64(res.tempFilePath)
            .then((base64) => {
              this.canvasPostImg = base64;
              this.showPost = true;
              this.showShareModal = false;
              uni.hideLoading();
            })
            .catch((err_msg) => {
              uni.hideLoading();
              this.showToastError("海报生成失败，请稍后重试");
            });
        });
      });
    },
    savePost() {
      uni.saveImageToPhotosAlbum({
        filePath: this.filePostImg,
        success() {
          uni.showToast({
            title: "保存成功",
            icon: "none",
          });
        },
        fail() {
          uni.showToast({
            title: "保存失败,请重试",
            icon: "none",
          });
        },
      });
    },
    closePost() {
      this.showPost = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.share-container {
  height: 388rpx;
  .share-title {
    text-align: center;
    padding: 34rpx 0;
    color: #666;
  }
  .share-way {
    margin-bottom: 40rpx;
    display: flex;
    justify-content: space-around;
    button {
      padding: 0;
      margin: 0;
      background-color: #fff;
      line-height: 24rpx;
      outline: none;
    }
    button::after {
      border: none;
    }
    .share-way-part {
      width: 96rpx;
      text-align: center;
      .share-way-image {
        width: 92rpx;
        height: 92rpx;
        margin-bottom: 24rpx;
      }
      span {
        color: #000;
        font-size: 24rpx;
      }
    }
  }
  .cancel-btn {
    border-top: 1px solid #f2f2f2;
    height: 96rpx;
    line-height: 96rpx;
    text-align: center;
    font-size: 32rpx;
    color: #000;
  }
}
.share-poster-mask {
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}
.share-poster-container {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 760rpx;
  width: 482rpx;
  background-color: transparent;
  border-radius: 20rpx;
  image {
    width: 100%;
    height: 100%;
    border-radius: 20rpx;
  }
  .close-btn {
    width: 48rpx;
    height: 48rpx;
    position: absolute;
    right: 0;
    top: -64rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .save-btn {
    width: 482rpx;
    height: 76rpx;
    border-radius: 50rpx;
    background-color: #e60113;
    font-size: 32rpx;
    color: #fff;
    text-align: center;
    line-height: 76rpx;
    position: absolute;
    left: 0;
    bottom: -124rpx;
  }
}
</style>
