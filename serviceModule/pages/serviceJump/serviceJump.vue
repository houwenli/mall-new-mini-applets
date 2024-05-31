<template>
  <div>正在加载中...请稍后</div>
</template>

<script>
export default {
  data() {
    return {
      params: {},
    };
  },
  onLoad(params) {
    this.params = params;
  },
  onShow() {
		let myPluginInterface = requirePlugin("qiyu");
    // test环境appId = 1HCOMZQdSrl
    // uat 线上环境appId = WgNt7qCklET

    // 线上
    myPluginInterface.__configAppId("WgNt7qCklET");
    myPluginInterface._$configAppKey("c08d7f587048a45a4714a8c48841fbd6");
    /* // 测试
		myPluginInterface.__configAppId('E7M0o9EGsmT')
		myPluginInterface._$configAppKey('ee412c80e4e10237a4fffbafc6a679f6') */
    if (uni.getStorageSync("YSFDATA")) {
      let ysfData = JSON.parse(uni.getStorageSync("YSFDATA"));
      // 商品卡片配置
      let product = {
        title: ysfData.title,
        desc: ysfData.desc,
        picture: ysfData.picture,
        note: ysfData.note,
        isShow: 1,
        sendByUser: false, //是否需要用户手动发送	默认为false，当为 true 的时候，商品的下面讲出现一个按钮，用户可以点击该按钮发送商品
        tags: [
          {
            label: `查看${this.params.tit ? this.params.tit : "订单"}详情`, // 按钮名字
            url: ysfData.tagsurl, // 跳转客户端商品详情页面
          },
        ],
        extraParam: {
          ysfData: ysfData,
        },
      };
      if (ysfData.staffid) {
        myPluginInterface._$configStaffId(ysfData.staffid); //自定义分配客服
      }
      if (!(this.params.isproduct == "isproduct")) {
        myPluginInterface._$configProduct(product);
        myPluginInterface._$configAutoCopy(false); //链接的复制操作
        myPluginInterface._$onClickAction((data = "", navigateTo) => {
          let ysfData = data.extraParam.ysfData;
          navigateTo({
            url: ysfData.navigateToUrl,
          });
        });
      }
    }

    uni.redirectTo({
      url: "plugin://qiyu/chat",
    });
  },
  methods: {},
};
</script>

<style></style>
