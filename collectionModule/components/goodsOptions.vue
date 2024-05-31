<template>
  <view class="goods-options">
    <view class="service">
      <view
        class="service-time"
        v-if="
          skuData.sellOut == 1 ||
          skuData.stock == 0 ||
          skuData.shelvesStatus == 0 ||
          skuData.shelvesStatus == 2 ||
          skuData.isGift == '1'
        "
      >
        <view class="flex-time">
          <span>已选</span>
          <view class="selects beyond">{{ chosenSpecAndNum }}</view>
        </view>
        <img
          src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-right.png"
          alt=""
        />
      </view>
      <view class="service-time" v-else @click="openShowBase">
        <view class="flex-time">
          <span>已选</span>
          <view class="selects beyond">{{ chosenSpecAndNum }}</view>
        </view>
        <img
          src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-right.png"
          alt=""
        />
      </view>
      <view class="service-time" @click="showAddressModal = true">
        <view class="flex-time">
          <span>送至</span>
          <img
            v-if="
              (addressList && addressList.length) || addressInfo.addressName
            "
            class="icon-adrs"
            src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/address.png"
            alt=""
          />
          <view
            v-if="
              (addressList && addressList.length) || addressInfo.addressName
            "
            class="selects address_"
            >{{ addressInfo.addressName }}</view
          >
          <view
            v-if="!addressList.length && !addressInfo.addressName"
            class="colors_"
            >请选择您的收货地址</view
          >
        </view>
        <img
          src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-right.png"
          alt=""
        />
      </view>
      <view class="service-time">
        <view class="flex-time">
          <span>运费</span>
          <view class="selects">{{
            !addressList.length && !addressInfo.addressName
              ? "免运费"
              : freightFee
          }}</view>
        </view>
      </view>
    </view>
    <view
      class="serve"
      v-if="spu.spuServiceSupports && spu.spuServiceSupports.length"
    >
      <view class="serve-name" :class="{ packUp: serveShow }">
        <view
          class="flex-name"
          v-for="(item, index) in spu.spuServiceSupports"
          :key="index"
        >
          <image
            class="serve-icon"
            src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-serve.png"
            alt=""
          />
          <span>{{ item.name }}</span>
        </view>
      </view>
      <view class="btn" v-if="serveNameHeight" @click="isServeShow">
        <img
          :src="`https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-${
            serveShow ? 'btn-btom' : 'btn-top'
          }.png`"
          alt=""
        />
      </view>
    </view>

    <wsf-city-select
      v-model="showSelect"
      @city-change="chooseArea"
      :defaultRegion="defaultRegion"
    ></wsf-city-select>
    <popup-address
      v-model="showAddressModal"
      @showCitySelect="showCitySelect"
      @selectedCity="selectedCity"
      @getressList="getressList"
    ></popup-address>
  </view>
</template>

<script>
import wsfCitySelect from "@/components/wsf-city-select/wsf-city-select.vue";
import popupAddress from "./popupAddress.vue";
export default {
  name: "goodsoOptions",
  components: {
    wsfCitySelect,
    popupAddress,
  },
  data() {
    return {
      showSku: false,
      showBase: false,
      showSelect: false,
      showAddressModal: false,
      freight: 0,
      initialSkuu: { color: "2", size: "3" },
      addressName: "地址",
      skuData: {},
      properties: null,
      goods: { picture: "" },
      initialSku: {},
      areas: [], // 地区信息
      isAddress: false,
      cityId: null,
      addressValue: [],
      isAddress_original: false,
      addressList: [], // 收货地址列表
      addressInfo: {
        addressName: "",
        address: "",
        provinceId: "",
        cityId: 200,
        countryId: "",
      },
      defaultRegion: ["广东", "深圳市", "宝安区"],
      serveNameHeight: false,
      serveShow: false,
    };
  },
  props: {
    spu: {
      type: Object,
      default: () => {},
    },
    sku: {
      type: Object,
      default: () => {},
    },
    skuId: {
      type: String,
      default: "",
    },
    skuNum: {
        type: [String,Number],
        default: 1,
    }
  },
  watch: {
    "spu.spuServiceSupports": {
      handler(newVal) {
        if (!(newVal && newVal.length)) {
          return;
        }
        setTimeout(() => {
          let info = uni.createSelectorQuery().in(this).select(".serve-name");
          let that = this;
          info
            .boundingClientRect(function (data) {
              if (data.height > 52) {
                that.serveNameHeight = true;
                that.serveShow = true;
              }
            })
            .exec(function (res) {});
        }, 500);
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    freightFee() {
      if (!this.addressList.length && !this.addressInfo.addressName) {
        return "免运费";
      }
      if (this.freight <= 0) {
        return "免运费";
      }
      return this.freight + "元";
    },
    chosenSpecAndNum() {
      let str = "";
      if (this.sku.skuSpecStr) {
        str = this.sku.skuSpecStr.join(" ") + `${this.skuNum}个`;
      }
      return str;
    },
    // 商品支持的服务
    services() {
      let services = "";
      if (this.spu.spuServiceSupports && this.spu.spuServiceSupports.length > 0) {
        services = this.spu.spuServiceSupports.map((support) => {
            if (support.serviceSupport) {
              return support.serviceSupport.name;
            }
        }).join("  ");
      }
      return services;
    },
  },
  methods: {
    async initAreas() {
      try {
        let res = await getArea();
        if (res.code === 1) {
          let areas = res.data.listVo;
          this.areas = areas;
        }
      } catch (error) {
        console.log(error);
      }
    },

    // 查询运费
    selectFreight() {
      let data = {
        skuId: this.skuId,
        storeId: this.spu.storeId,
        num: this.skuNum,
        cityId: this.addressInfo.cityId,
      };
      this.$u.api.CalculateFreight(data).then((res) => {
        this.freight = res.code == 200 ? res.data.toFixed(2) : "0.00";
      });
    },
    selectedCity(data) {
      let { address, provinceId, cityId, countryId } = data.data;
      this.addressInfo.addressName = address;
      this.addressInfo.address = address;
      this.addressInfo.provinceId = provinceId;
      this.addressInfo.cityId = cityId;
      this.addressInfo.countryId = countryId;
      this.selectFreight();
    },
    showCitySelect() {
      this.showAddressModal = false;
      this.showSelect = true;
    },
    getressList(e) {
      let { list } = e;
      this.isEmpty = !list.length;
      if (list.length) {
        let { address, provinceId, cityId, countryId } = list[0];
        this.addressInfo.addressName = address;
        this.addressInfo.address = address;
        this.addressInfo.provinceId = provinceId;
        this.addressInfo.cityId = cityId;
        this.addressInfo.countryId = countryId;
      }
    },
    // 选择地区
    chooseArea(e) {
      this.addressInfo.addressName = `${e.province.name}${e.city.name}${e.area.name}`;
      this.addressInfo.address = `${e.province.name},${e.city.name},${e.area.name}`;
      this.addressInfo.provinceId = e.province.id;
      this.addressInfo.cityId = e.city.id;
      this.addressInfo.countryId = e.area.id;
      this.selectFreight();
    },
    // 显示规格值弹窗
    openShowBase() {
      this.$emit("openShowBase");
    },
    isServeShow() {
      this.serveShow = !this.serveShow;
    },
  },
};
</script>

<style lang="less" scoped>
.goods-options {
  background: #ffffff;
  border-radius: 10px;
  margin: 0rpx 24rpx 0rpx 24rpx;
  .service {
    padding: 0rpx 24rpx;
  }
  .service-time {
    display: flex;
    justify-content: space-between;
    // align-items: center;
    padding: 18rpx 0;
    .flex-time {
      display: flex;
      // align-items: center;
      span {
        flex-shrink: 0;
        font-size: 26rpx;
        color: #c3c3c3;
        width: 76rpx;
      }
      .icon-adrs {
        width: 32rpx;
        height: 32rpx;
        display: block;
        padding-right: 4rpx;
      }
      .selects {
        font-size: 26rpx;
        color: #191919;
        // line-height: 34rpx;
      }
      .beyond {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 2; /* 2 是控制文字几行 */
        width: 520rpx;
      }
      .colors_ {
        font-size: 26rpx;
        color: #c3c3c3;
      }
      .address_ {
        width: 480rpx;
        overflow: hidden; //超出隐藏
        white-space: nowrap; //不折行
        text-overflow: ellipsis; //溢出显示省略号
      }
    }
    img {
      width: 32rpx;
      height: 32rpx;
      display: block;
      margin-top: 2rpx;
    }
  }
  .serve {
    background-color: rgba(246, 246, 246, 0.5);
    border-radius: 0 0 16rpx 16rpx;
    padding: 20rpx 24rpx;
    .serve-name {
      display: flex;
      flex-wrap: wrap;
    }
    .flex-name {
      display: flex;
      align-items: center;
      padding-right: 16rpx;
      padding-bottom: 8rpx;
    }
    .serve-icon {
      width: 24rpx;
      height: 26rpx;
      display: block;
      flex-shrink: 0;
      padding-right: 4rpx;
    }
    span {
      font-size: 26rpx;
      font-weight: 400;
      color: #999999;
    }
    .packUp {
      height: 80rpx;
      overflow: hidden;
    }
    .btn {
      width: 122rpx;
      height: 32rpx;
      border-radius: 16rpx;
      margin: 0 auto;
      margin-top: 20rpx;
      img {
        width: 121rpx;
        height: 31rpx;
        display: block;
      }
    }
  }
}
</style>
