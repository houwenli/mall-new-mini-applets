<template>
  <view class="quick-login">
    <view class="img"
      ><image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/quicklogo.png" mode=""></image
    ></view>
    <view class="login-btn">
      <!-- 有初始化手机号的时候直接走手机号登录，不使用微信获取手机号 -->
      <block v-if="initPhoneNumber">
        <button
          class="btn"
          @click="phoneLoginShow"
        >
          <!-- <u-icon name="weixin-fill" size="44" color="#fff"></u-icon> -->
          <text>手机号快速登录</text>
        </button>
      </block>
      <block v-else>
        <button
          class="btn"
          open-type="getPhoneNumber"
          @getphonenumber="getphonenumber"
        >
          <!-- <u-icon name="weixin-fill" size="44" color="#fff"></u-icon> -->
          <text>手机号快速登录</text>
        </button>
      </block>
    </view>
    <view class="txt">
      <text @click="goLogin">输入手机号登录/注册</text>
    </view>
    <phoneLoginPopup :signal="signal" :initPhoneNumber="initPhoneNumber" @initPhoneLogin="initPhoneLogin"></phoneLoginPopup>
  </view>
</template>

<script>
import { oneClickLogin, oneKeyLoginQueryBindingByOpenid, oneKeyLoginWithMobileOpenid } from '@/common/smart-api/loginApi'
import phoneLoginPopup from './components/phoneLoginPopup.vue'

let code = "";
let interval = "";
export default {
  components: {
    phoneLoginPopup
  },
  data() {
    return {
      backUrlParams: "",
      curRoute: "",
			cartRoute:'',
      // 登录弹窗是否展示
      loginInfo: {}, // 登录信息
      code: '', // 小程序临时登录凭证
      initPhoneNumber: '',
      signal: 0
    };
  },
  onLoad(option) {
    clearInterval(interval);
    console.log("登录页面卸载");

    console.log("option----", option);
    let temp;
		this.curRoute = option.curRoute ? option.curRoute : '' ;
		this.cartRoute = option.cartRoute ? option.cartRoute : '';
    this.webViewBackUrl = option.webViewBackUrl || ''
		console.log("cartRoute   ------------ ", this.cartRoute);
    if (option.backUrlParams) {

      let curParam = JSON.parse(option.backUrlParams);
      console.log("curParam***********", curParam);
      for (let key in curParam) {
        temp += "&" + key + "=" + curParam[key];
      }
    }
    if (option.returnUrl) {
      temp = decodeURIComponent(option.returnUrl);
    }
    console.log("temp***********", temp);
    // console.log("temp.includes(undefined)", temp.includes("undefined"));
    if (temp && temp.includes("undefined")) {
      temp = temp.replace("undefined", "");
    }
    this.backUrlParams = temp ? temp.replace("&", "?") : '';
    console.log("this.backUrlParams***********", this.backUrlParams);
  },
  onShow() {
    this.getCode();
		this.getBaseInfoSet()
  },
  mounted() {
    this.initGetPhonenumber()
  },
  methods: {
    /**
     * 初始化根据openId获取手机号
     */
    async initGetPhonenumber() {
      let openId = uni.getStorageSync('openId')
      // 第一次进入时，获取openid是异步，可能获取不到
      // 此时重新获取
      if(!openId) {
        let loginInfo = await this.getLoginInfo().catch(() => {})
        if(loginInfo) {
          openId = loginInfo.openId || ''
        }
      }
      if(!openId) {
        return
      }
      let data = {
        openId
      };
      oneKeyLoginQueryBindingByOpenid(data).then(ret => {
        let data = ret.data || {}
        this.initPhoneNumber = data.mobile
      })
    },
    phoneLoginShow() {
      this.signal = Math.random()
    },

    // 使用初始手机号登录
    initPhoneLogin() {
      let openId = uni.getStorageSync('openId')
      let params = {
        openId,
        mobile: this.initPhoneNumber
      }
      oneKeyLoginWithMobileOpenid(params).then(ret => {
        this.loginSuccess(ret)
      }).catch(err => {
        console.log(err)
        this.$u.toast(err.msg);
      })
    },
		getBaseInfoSet(){
			let that = this
			// 请求万顺福商城信息
			this.$u.api
				.GetBaseInfoSet({})
				.then(res => {
					console.log('请求万顺福商城信息', getApp().globalData);
					getApp().globalData.wsfBaseInfo = res.data;
					getApp().globalData.wsfBaseInfo.isShowStore = 0
				})
				.catch(err => {
					getApp().globalData.wsfBaseInfo = { isShowStore: 0 };
				});
		},
    // 获取微信临时登录凭证
    // 临时登录凭证只能使用一次
    getTempCode() {
      return new Promise((resolve, reject) => {
        uni.login({
          success(res) {
            resolve(res.code);
          },
          file: (error) => {
            reject(error)
          },
        });
      })
    },

    // 获取登录信息，这个不缓存了，有些信息可能需要取最新的
    getLoginInfo() {
      return new Promise(async (resolve, reject) => {
        let code = await this.getTempCode().catch(ret => {
          this.$u.toast("获取code失败!");
        })
        if(!code) {
          reject()
        }

        let loginInfo = await this.$u.api.GetLoginInfo({ code }).catch(err => {
          console.log("请求有问题--> ", error);
          reject()
        })
        if(loginInfo) {
          console.log(`接口数据(GetLoginInfo): `, loginInfo);
          uni.setStorageSync("openId", loginInfo.data.openId);
          resolve(loginInfo.data)
        }
      })
    },

    getCode() {
      let that = this;
      clearInterval(interval);
      this.uniLoginCode();
      interval = setInterval(function () {
        that.uniLoginCode();
      }, 1000 * 60 * 4);
    },
    uniLoginCode() {
      let that = this
      uni.login({
        success(res) {
          that.code = code = res.code;
        },
        file: (error) => {
          that.$u.toast("获取code失败!");
        },
      });
    },
    async getphonenumber(e) {
      if (e.detail.errMsg == "getPhoneNumber:ok") {
        let that = this;
        let loginInfo = await this.getLoginInfo().catch(() => {})
        if(loginInfo) {
          let data = {
            sessionKeyB64: loginInfo.sessionKey,
            openId: loginInfo.openId,
            encryptDataB64: e.detail.encryptedData,
            ivB64: e.detail.iv,
          };
          that.oneKeyLogin(data);
        }
      } else {
        console.log("用户不同意");
      }
    },

    // 手机号登录
    goLogin() {
      this.$wsf.go("TextLogin");
    },
    // 一键登录
    oneKeyLogin(data) {
      // this.$u.api.OneKeyLogin(data).then((resp) => {
      oneClickLogin(data).then((resp) => {
        console.log(resp, "resp");
        this.loginSuccess(resp)
      })
    },

    // 登陆成功后处理
    loginSuccess(resp) {
      if (resp.code === 200) {
        clearInterval(interval);
        uni.setStorageSync("newToken", resp.data.token);
        getApp().globalData.isLink = true;
        this.$store.dispatch('refreshFn',true)
        this.$u.api.CustomerDetail().then(res => {
          if (res.code === 200) {
            uni.setStorageSync('phone', res.data.mobile)
            uni.setStorageSync('userInfo', res.data)

            // 不需要授权了
            if (this.webViewBackUrl) {
              this.$wsf.go(this.webViewBackUrl, {token: resp.data}, 'redirectTo')
              return
            }
            if (this.backUrlParams || this.curRoute == "pages/index/index" || this.curRoute == "pages/distributionIndex/distributionIndex") {
              uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
                delta: 1
              });
            } else if (this.cartRoute) {
              uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
                delta: 2
              });
            } else {
              this.$smart.go('SmartUCenter');
            }
            // let conditionData = {
            // 	phone: res.data.mobile
            // }
            // this.$u.api.SelectOneByCondition(conditionData).then(res => {
            //   if(res.code == 200) {
            //     let info = res.data
            //     if(!info.id && info.passengerPhone) {
            //       this.$wsf.go("Authorization",{pageType: 2},'redirectTo');
            //     } else {
            //       if (this.webViewBackUrl) {
            //         this.$wsf.go(this.webViewBackUrl, {token: resp.data}, 'redirectTo')
            //         return
            //       }
            //       if (this.backUrlParams || this.curRoute == "pages/index/index" || this.curRoute == "pages/distributionIndex/distributionIndex") {
            //       	uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
            //       		delta: 1
            //       	});
            //       } else if (this.cartRoute) {
            //       	uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
            //       		delta: 2
            //       	});
            //       } else {
            //         uni.switchTab({
            //           url: "/pages/usercenter/usercenter",
            //         });
            //       }
            //     }
            //   }
            // })
          }
        });
      }
    }
  },
};
</script>

<style scoped lang="scss">
.quick-login {
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  .img {
    padding: 120rpx 0 160rpx 0;
    text-align: center;
    image {
      width: 180rpx;
      height: 180rpx;
    }
  }
  .login-btn {
    padding: 0 50rpx 40rpx 50rpx;
    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100rpx;
      background: $wsf-linear-bg;
      border-radius: 50rpx;
      text {
        margin-left: 12rpx;
        font-size: 32rpx;
        font-weight: 500;
        color: #ffffff;
      }
    }
  }
  .txt {
    text-align: center;
    font-size: 24rpx;
    font-weight: 400;
    color: #666666;
  }
}
</style>
