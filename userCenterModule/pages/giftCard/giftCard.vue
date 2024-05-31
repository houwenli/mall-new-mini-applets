<template>
  <view class="gift_card">
    <view class="main">
      <view class="my_header">
        <view class="gift_card_balance">
          <view class="card">
            <view class="text">
              <text class="sp_1">礼品卡余额</text>
              <text class="sp_2" @click="instructions = true">使用说明</text>
            </view>
            <view class="num">
              <text style="font-size: 48rpx; margin-right: 10px">¥</text>
              <text style="font-size: 72rpx">{{
                fmoney(giftInfo.price, 2, true)[0]
              }}</text>
              <text style="font-size: 32rpx"
                >.{{ fmoney(giftInfo.price, 2, true)[1] }}</text
              >
            </view>
          </view>
        </view>
        <u-tabs
          :list="list"
          :is-scroll="false"
          :current="current"
          inactive-color="#000"
          active-color="#000"
          :font-size="28"
          :bar-width="56"
          :bar-height="6"
          @change="change"
        ></u-tabs>
      </view>
      <scroll-view
        class="scroll-view"
        :scroll-y="true"
        @scrolltolower="scrolltolower"
      >
        <view class="content">
          <view v-show="current === 0">
            <template v-if="records_0.length">
              <view
                class="min_card"
                v-for="item in records_0"
                :key="item.valueCardCodeId"
              >
                <view class="up">
                  <view class="txt_1">
                    <text>{{ item.cardName }}</text>
                    <text
                      class="sp"
                      @click="usageRecordFun(item.valueCardCodeId)"
                    >
                      使用记录
                    </text>
                  </view>
                  <view class="txt_2">
                    <text>面值: {{ fmoney(item.cardPrice, 2, false) }}元</text>
                    <text>{{ item.validityStartTime | dateFilter }} - {{ item.validityEndTime | dateFilter }}</text>
                  </view>
                </view>
                <view class="down">
                  <view class="left">
                    <view>
                      余额:
                      <text>¥ {{ fmoney(item.balance, 2, false) }}</text>
                    </view>
                    <view>
                      <view style="width: 100%; text-align: left;" v-if="item.permittedType == 0">全平台商品可用</view>
                     <template v-if="item.permittedType == 1">
												<view style="width:100%;color: #999; text-align: left;">
												<text style="font-size: 24rpx;color: #999;">{{`仅${item.marketingName}活动商品可用` | thumbnailString}}</text>
												<van-icon
												size="15px"
												name="info-o"
												@click="explainFun(item)"
												/>
												</view>
												
											</template>
                      <template v-if="item.permittedType == 2">
												<view style="width:100%; text-align: left;">
												<text style="font-size: 24rpx;color: #999;">{{`仅${item.storeNames}店铺的商品可用` | thumbnailString}}</text>
												<u-icon
												size="30rpx"
												name="info-circle"
												@click="explainFun(item)"
												></u-icon>
												</view>
											</template>
                    </view>
                  </view>
                  <view class="right">
                    <view class="btn" @click="employFun(item)">去使用</view>
                  </view>
                </view>
              </view>
            </template>
            <template v-else>
              <view class="default">
                <image
                  style="width: 180rpx; height: 180rpx"
                  src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/77c8114b247648bd1d72c9e3b448b2a5.png"
                />
                <view>暂无可用礼品卡</view>
              </view>
            </template>
          </view>
          <view v-show="current === 1">
            <template v-if="records_1.length">
              <view
                class="min_card"
                v-for="item in records_1"
                :key="item.valueCardCodeId"
              >
                <view class="up" style="background-color: #999">
                  <view class="txt_1">
                    <text>{{ item.cardName }}</text>
                    <text
                      class="sp"
                      @click="usageRecordFun(item.valueCardCodeId)"
                    >
                      使用记录
                      <!-- <van-icon size="15px" color="#fff" name="arrow" /> -->
                    </text>
                  </view>
                  <view class="txt_2">
                    <text>面值: {{ fmoney(item.cardPrice, 2, false) }}元</text>
                    <text
                      >{{ item.validityStartTime | dateFilter }} - {{ item.validityEndTime | dateFilter }}</text
                    >
                  </view>
                </view>
                <view class="down">
                  <view class="left" style="color: #999">
                    <view>
                      余额:
                      <text>¥ {{ fmoney(item.balance, 2, false) }}</text>
                    </view>
                    <view>
                      <view style="width: 100%; text-align: left;" v-if="item.permittedType == 0">全平台商品可用</view>
                      <template v-if="item.permittedType == 1">
                        <text>{{
                          `仅${item.marketingName}活动商品可用`
                            | thumbnailString
                        }}</text>
                        <van-icon
                          size="15px"
                          name="info-o"
                          @click="explainFun(item)"
                        />
                      </template>
                      <template v-if="item.permittedType == 2">
                        <text>{{
                          `仅${item.storeNames}店铺的商品可用` | thumbnailString
                        }}</text>
                        <u-icon
                          size="30rpx"
                          name="info-circle"
                          @click="explainFun(item)"
                        ></u-icon>
                      </template>
                    </view>
                  </view>
                  <view class="right">
                    <image
                      v-if="item.status === 1"
                      src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/d844ed10650d39f8a3e46a6262165568.png"
                    />
                    <image
                      v-if="item.status === 2"
                      src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/aec4900bad335671cead01ac7bad42a7.png"
                    />
                    <image
                      v-if="item.status === 3"
                      src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/ee52c5bf9218cf01463b141567e2b08c.png"
                    />
                  </view>
                </view>
              </view>
            </template>
            <template v-else>
              <view class="default">
                <image
                  style="width: 180rpx; height: 180rpx"
                  src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/77c8114b247648bd1d72c9e3b448b2a5.png"
                />
                <view>暂无不可用礼品卡</view>
              </view>
            </template>
          </view>
        </view>
      </scroll-view>
      <view class="my_footer">
        <view class="tab_bar">
          <view
            class="tab_bar_item"
            v-for="(item, index) in options"
            :key="index"
            @click="skipFun(item)"
          >
            <view class="image"><image :src="item.icon" /></view>
            <view>{{ item.label }}</view>
          </view>
        </view>
      </view>
    </view>
    <u-mask :show="instructions">
      <view class="popup_text">
        <view class="instructions">
          <view class="my_title">
            <text>使用说明</text>
            <image
              @click="instructions = false"
              class="img"
              src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/e130282932de4df76a8123b597879978.png"
              mode="scaleToFill"
              style="width: 32rpx; height: 32rpx"
            />
          </view>
          <view class="my_text">
            <scroll-view :scroll-y="true" style="height: 700rpx">
              <view>
                1、万顺福礼品卡(以下称“礼品卡”)指由武汉万顺福农特产电子商务有限公司发行的，现只存在实体卡形态，可以在万顺福商城（https://m.wsfmall.com/）上购买商城商品。用户可在万顺福商城“我的-礼品卡-绑定新卡”中输入卡密或直接扫描卡密二维码，绑定礼品卡。
              </view>
              <view>
                2、礼品卡分为三类，包括适用于全商城商品、适用于指定商铺商品，适用于指定活动商品等三种，绑卡成功后可在“我的-我的礼品卡”中获取礼品卡可适用范围信息。
              </view>
              <view>
                3、礼品卡可在万顺福商城购买，支付成功后可通过订单详情查询配送和物流轨迹。购买礼品卡支持开具电子普通发票。使用礼品卡购买商品时，订单金额中礼品卡支付的部分，将不再开具发票。
              </view>
              <view>
                4、使用礼品卡支付商品发生退货时，对于非包邮商品产生的运费部分如果物流已经介入且商品在途，则运费部分经由礼卡抵扣将不会退回原礼卡中，作直接扣除处理，反之，物流尚未介入则运费部分原路退回礼卡。
              </view>
              <view>
                5、订单中存在不支持使用礼品卡的商品时，无法使用礼品卡进行支付。
              </view>
            </scroll-view>
          </view>
        </view>
      </view>
    </u-mask>
    <!-- 使用记录 -->
    <u-mask :show="usageRecord">
      <view class="popup_text">
        <view class="instructions" style="padding: 60rpx 0">
          <view class="my_title" style="margin-bottom: 0">
            <view class="u-border-bottom" style="padding-bottom: 10rpx"
              >使用记录</view
            >
            <image
              @click="usageRecord = false"
              class="img"
              src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/e130282932de4df76a8123b597879978.png"
              mode="scaleToFill"
              style="width: 32rpx; height: 32rpx; top: -28rpx; right: 35rpx"
            />
          </view>
          <view class="my_text">
            <view class="usage_record" v-if="giftUsageList.length">
              <scroll-view :scroll-y="true" style="height: 750rpx">
                <view
                  class="u-border-bottom item"
                  v-for="(item, k) in giftUsageList"
                  :key="k"
                >
                  <view class="date">{{ item.createTime }}</view>
                  <view
                    class="order"
                    v-for="(order, index) in item.orderCodeList"
                    :key="index"
                  >
                    <text>订单: {{ order }}</text>
                    <text @click="copyCamilo(order)">复制</text>
                  </view>
                  <view class="money">
                    <text v-if="item.price > 0" style="color: #6bc169">+{{
                      item.price
                    }}</text>
                    <text v-else style="color: #e60113">{{ item.price }}</text>
                    <text style="margin-left: 20px; color: #666"
                      >余: {{ fmoney(item.balance) }}</text
                    >
                  </view>
                </view>
              </scroll-view>
            </view>
            <view class="image" v-else>
              <image
                src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/ca95e84591efdb4d4471abcbc2e82e3b.png"
              />
              <p>暂无使用记录</p>
            </view>
          </view>
        </view>
      </view>
    </u-mask>
    <!-- 去使用 -->
    <u-mask :show="explain">
      <view class="popup_text">
        <view class="instructions">
          <view class="my_title">
            <text>说明</text>
            <image
              @click="explain = false"
              class="img"
              src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/e130282932de4df76a8123b597879978.png"
              mode="scaleToFill"
              style="width: 32rpx; height: 32rpx"
            />
          </view>
          <view class="my_text">
            <text>{{ explainText }}</text>
          </view>
          <view class="btn" @click="explain = false">我知道了</view>
        </view>
      </view>
    </u-mask>
  </view>
</template>

<script>
let pageNum_0 = 1,
  pageNum_1 = 1,
  changeonce = false;
export default {
  data() {
    return {
      explain: false, //说明弹窗显示/隐藏
      explainText: "",
      instructions: false, //使用说明
      usageRecord: false, //使用记录
      finished: false, // 数据是否加载完毕
      options: [
        {
          icon: "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/ee375aaaa4c4236463147f9e491f36d5.png",
          label: "购买新卡",
          path: "",
        },
        {
          icon: "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/f5164d067e6dc0453ad0bbd8674ab576.png",
          label: "绑定新卡",
          path: "BindNewGiftCards",
        },
      ],
      listParams: {
        type: 0, //0可用卡 1不可用卡
        pageNum: 1, //当前页数，1是第一页
        pageSize: 10, //每页条数
      },
      list: [
        {
          name: "可用卡(0)",
        },
        {
          name: "不可用卡(0)",
        },
      ],
      current: 0,
      records_0: [], // 可用卡列表
      records_1: [], // 不可用卡列表
      giftUsageList: [], // 礼品卡使用记录
      giftInfo: {
        canNotUseNum: 0, // 不可用卡
        canUseNum: 0, //可用卡
        price: 0,
        thirdCateId: "",
      },
    };
  },
  computed: {},
  watch: {},
  onShow() {
    this.finished = false
    this.listParams = {
      type: 0, //0可用卡 1不可用卡
      pageNum: 1, //当前页数，1是第一页
      pageSize: 10, //每页条数
    }
    this.records_0 = [];
    this.records_1 = [];
    this.valueCardCodeCountFun();
    this.valueCardCodeSelectPageFun();
  },
  methods: {
    employFun(data) {
      if (data.permittedType === 0) {
        //全平台
        this.$wsf.go("Index", {});
      }
      if (data.permittedType === 1) {
        // 指定活动
        this.$wsf.go("firstOrder", {id:data.permittedMarketingId});
      }
      if (data.permittedType === 2) {
        // 指定店铺
        let storeids = data.permittedStoreIds.toString();
        this.$wsf.go("SpuList", {
          storeIds: storeids,
          type: "gift",
          cardPrice: data.cardPrice,
        });
      }
    },
    valueCardCodeCountFun() {
      this.$u.api.valueCardCodeCount().then((res) => {
        console.log(res, "查询礼卡统计信息");
        if (res.code === 200) {
          this.giftInfo = res.data;
          this.list[0].name = `可用卡(${this.giftInfo.canUseNum})`;
          this.list[1].name = `不可用卡(${this.giftInfo.canNotUseNum})`;
        } else {
          // this.$toast('查询礼品卡信息失败!')
        }
      });
    },
    explainFun(item) {
      let txt = "";
      if (item.permittedType == 1) {
        txt = `仅${item.marketingName}活动商品可用`;
      }
      if (item.permittedType == 2) {
        txt = `仅${item.storeNames}店铺的商品可用`;
      }
      this.explainText = txt;
      this.explain = true;
    },
    // 礼品卡使用记录
    usageRecordFun(valueCardCodeId) {
      console.log(valueCardCodeId, "*******");
      let id = valueCardCodeId;
      this.usageRecord = true;
      this.$u.api.giftUsageLog(id).then((res) => {
        if (res.code === 200) {
          console.log(res, "礼品卡使用记录");
          this.giftUsageList = res.data;
        }
      });
    },
    scrolltolower() {
      console.log('触发了');
      // 数据全部加载完毕
      if (this.finished) return;
      this.valueCardCodeSelectPageFun();
    },
    valueCardCodeSelectPageFun() {
      let that = this, type = this.listParams.type
      let params = `${type}/${that.listParams.pageNum}/${that.listParams.pageSize}`;
      that.$u.api.ValueCardCodeSelectPage(params).then((res) => {
        if (res.code === 200) {
          if (res.data.records.length < that.listParams.pageSize) {
            that.finished = true;
          } else {
            if (type == 0) {
              //可用卡数据
              that.listParams.pageNum = pageNum_0+1;
            } else {
              that.listParams.pageNum = pageNum_1+1;
            }
          }
          res.data.records.forEach((item) => {
            console.log(type,'礼卡使用类型');
            if (type == 0) {
              //可用卡数据
              that.records_0.push(item);
            } else {
              that.records_1.push(item);
            }
          });
          console.log(that.listParams,'that.listParams');
        }
      });
    },
    skipFun(item) {
      if (item.path === "BindNewGiftCards") {
        this.$wsf.go(item.path, {});
      } else {
        this.$wsf.go("SpuList", {
          queryString: '',
          cateId: this.giftInfo.thirdCateId,
          storeId: '',
        });
        // this.$router.replace({
        //   path: '/spulist',
        //   query: {
        //     queryString: '',
        //     cateId: '',
        //     storeId: '',
        //   },
        // })
      }
    },
    copyCamilo(data) {
      uni.setClipboardData({ data });
    },
    //格式化金额显示,s为金额数字，n为精确小数位,isAry 是否返回数组形式如: 23.88 ==> [23,88] 默认 false
    fmoney(s, n, isAry = false) {
      n = n > 0 && n <= 20 ? n : 2;
      s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
      let l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1],
        t = "";
      for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? "," : "");
      }
      return isAry
        ? [t.split("").reverse().join(""), r]
        : t.split("").reverse().join("") + "." + r;
    },
    change(index) {
      this.current = index;
      this.listParams.type = index;
      this.records_0 = []
      this.records_1 = []
      pageNum_0 = 1
      pageNum_1 = 1
      this.listParams.pageNum = 1
      this.finished = false
      this.valueCardCodeSelectPageFun();
    },
  },
  filters: {
    dateFilter(value) {
      let arr = value.split(" ")[0];
      let str = arr.split('-').join('.')
      return str;
    },
    thumbnailString(value) {
      if (value && value.length > 15) {
        return value.substring(0, 15) + ". . .";
      }
      return value;
    },
  },
};
</script>

<style scoped lang="scss">
/deep/ .u-tab-bar {
  background-color: #e60113 !important;
}
.gift_card {
  width: 100vw;
  height: 100vh;
  .main {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    .my_header {
      background-color: #fff;
      .gift_card_balance {
        background-color: #fff;
        padding: 12rpx 24rpx 0 24rpx;
        .card {
          color: #fff;
          box-sizing: border-box;
          padding: 52rpx 16rpx 28rpx 32rpx;
          width: 100%;
          // height: 4.16rem;
          background: linear-gradient(25deg, #ffa504 0%, #ffbc25 100%);
          border-radius: 20rpx;
          .text {
            display: flex;
            justify-content: space-between;
            .sp_1 {
              font-size: 26rpx;
            }
            .sp_2 {
              font-size: 24rpx;
            }
          }
          .num {
            margin-top: 20rpx;
            line-height: 72rpx;
            color: #fff;
          }
        }
      }
    }
    .scroll-view {
      height: calc(100vh - 91px - 156px)
    }
    .content {
      overflow-y: scroll;
      flex: 1;
      padding: 24rpx 24rpx 0 24rpx;
      .min_card {
        margin-bottom: 24rpx;
        overflow: hidden;
        width: 100%;
        border-radius: 20rpx;
        .up {
          color: #fff;
          background-color: #7689df;
          box-sizing: border-box;
          padding: 24rpx;
          .txt_1 {
            display: flex;
            justify-content: space-between;
            font-size: 30rpx;
            .sp {
              font-size: 24rpx;
              display: flex;
              align-items: center;
            }
          }
          .txt_2 {
            margin-top: 20rpx;
            display: flex;
            justify-content: space-between;
            text:nth-child(1) {
              font-size: 26rpx;
            }
            text:nth-child(2) {
              font-size: 22rpx;
            }
          }
        }
        .down {
          background-color: #fff;
          box-sizing: border-box;
          padding: 40rpx 24rpx;
          display: flex;
          .left {
            flex: 0.7;
            view:nth-child(1) {
              font-size: 24rpx;
              text {
                font-size: 36rpx;
              }
            }
            view:nth-child(2) {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 20rpx;
              font-size: 24rpx;
              color: #999;
            }
          }
          .right {
            flex: 0.3;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            image {
              width: 140rpx;
              height: 140rpx;
            }
            .btn {
              height: 60rpx;
              line-height: 60rpx;
              padding: 0 40rpx;
              background-color: #e60113;
              border-radius: 30rpx;
              font-size: 24rpx;
              color: #fff;
            }
          }
        }
      }
      .default {
        padding-top: 160rpx;
        text-align: center;
        font-size: 28rpx;
        color: #999;
      }
    }
    .my_footer {
      background-color: #fff;
      padding-bottom: env(safe-area-inset-bottom);
      .tab_bar {
        display: flex;
        padding: 10rpx 0 8rpx 0;
        .tab_bar_item {
          font-size: 20rpx;
          text-align: center;
          flex: 1;
          image {
            width: 48rpx;
            height: 48rpx;
          }
        }
      }
    }
  }
  .popup_text {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 95%;
    .instructions {
      border-radius: 20rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 60rpx;
      background-color: #fff;
      width: 632rpx;
      max-height: 900rpx;
      min-height: 900rpx;
      .my_title {
        position: relative;
        text-align: center;
        margin-bottom: 44rpx;
        .img {
          position: absolute;
          top: -28rpx;
          right: -28rpx;
        }
      }
      .my_text {
        flex: 1;
        // overflow-y: scroll;
        .usage_record {
          font-size: 28rpx;
          color: #333;
          margin-bottom: 74rpx;
          box-sizing: border-box;
          .item {
            padding: 0 60rpx;
            .date {
              font-size: 26rpx;
              color: #000;
              margin-top: 30rpx;
            }
            .order {
              margin: 24rpx 0;
              text:nth-child(1) {
                font-size: 26rpx;
                color: #666;
              }
              text:nth-child(2) {
                padding: 6rpx 12rpx;
                border-radius: 22rpx;
                display: inline-block;
                font-size: 22rpx;
                color: #000;
                background-color: #f5f5f5;
              }
            }
            .money {
              padding-bottom: 30rpx;
            }
          }
        }
        .image {
          text-align: center;
          padding: 150rpx 0;
          image {
            width: 180rpx;
            height: 180rpx;
          }
        }
      }
      .btn {
        margin: 0 auto;
        margin-top: 128rpx;
        margin-bottom: 40rpx;
        width: 300rpx;
        text-align: center;
        height: 60rpx;
        padding: 10rpx 92rpx;
        background-color: #e60113;
        border-radius: 30rpx;
        font-size: 24rpx;
        color: #fff;
      }
    }
  }
}
</style>
