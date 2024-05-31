<script>
import Vue from 'vue';
const vm = Vue.prototype;
const app = getApp();
const switchUrl = ['/pages/index/index', 'pages/cart/cart', 'pages/usercenter/usercenter'];
import { sign } from './common/sign.js';
import defaultTemplate from './common/defaultTemplate.js';
import privacyAuthorization from './common/services/privacyAuthorization'

import { unAuthLoginSmart, bindAccountWithNoAuth } from './common/smart-api/loginApi'
export default {
	onLaunch: function(options) {
    console.log(' ')
    console.warn(`****** uview-ui 版本--- ${this.$u.config.version} ********`);
    console.log(' ')
		this.autoUpdate();
		// 全局挂在globalData
		vm.$globalData = this.$scope.globalData;
		console.log('当uni-app 初始化完成时触发（全局只触发一次）');
		// uni.removeStorageSync('token')
		console.log('onLaunch的参数查看', options);
		vm.$globalData.kCode = options.query.k; // H5分销专区拉起小程序识别码
		this.getNavigationSystemInfo();
		this.getMobileInfo();
		this.login(); //自动登录
		/* // 处理模板缓存
    let template;
    try {
      template = JSON.parse(uni.getStorageSync("_wsf_template"));
    } catch (err) {
      template = defaultTemplate;
    }
    this.$store.commit("SETTINGS/CHANGE_WSFFLOORS", template.floors);
    this.$store.commit("SETTINGS/CHANGE_WSFLAYOUT", template.layOutObj); */
		this.queryGrayscale()

		uni.loadFontFace({
			global: true, // 是否全局生效
		    family: 'DINAlternate', // 定义的字体名称
		    source: 'url("https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/mobileFont/DIN%20Alternate%20Bold%202.ttf")'
		})
		// 监听微信隐私操作
		privacyAuthorization.init();
	},
	onShow: function(options) {
		// console.log("当 uni-app 启动，或从后台进入前台显示");
		if (options) {
			vm.$globalData.scene = options.scene || '';
			if (options.scene === 1037) {
				let extraData = options.referrerInfo.extraData ?? {};
				let jumpInAppId = options.referrerInfo.appId || '';
				let storeId = extraData.storeId ?? '';
				let deviceId = extraData.deviceId ?? '';		
				vm.$globalData.phone = extraData.phone ?? '';
				vm.$globalData.passengerId = extraData.userId ?? '';
				vm.$globalData.jumpInAppId = jumpInAppId || '';
				vm.$globalData.storeId = storeId
				vm.$globalData.deviceId = deviceId

				// 从其他小程序直接跳到分享购页面， false则为直接跳转分享购页面  true则为点击wsichTab跳转的
				vm.$globalData.swichDistribution = false
				// vm.$globalData.phone = "13544189262";
				// vm.$globalData.passengerId = "101100008584";
				//万顺叫车用户自动登录
				let checkResult = this.checkFromAppId();
				if (checkResult && this.globalData.phone) {
					let jumpUrl = options.path
					this.wsUserAuthLogin(jumpUrl);
				} else {
					uni.setStorageSync('isWsUser', 0);
				}

				//乘客小程序带精确的定位
				let precisionGPS = {
    			  cityCode: extraData.areaCode,
    			  longitude: extraData.lon,
    			  latitude: extraData.lat,
    			}
    			uni.setStorageSync('precisionGPS', JSON.stringify(precisionGPS));
			}
		}
	},
	onHide: function() {
		// console.log("当 uni-app 从前台进入后台");
    uni.removeStorageSync('isWsUser');
	},
	onError: function(error) {
		// console.log("当 uni-app 报错时触发: ", error);
	},
	globalData: {
		isNeedBottomSpace: false, //是否适配Iphone x等底部有黑条手机留白
		statusBarHeight: 0, // 状态栏头部高度
		safeTopBarHeight: 0, // 头部安全距离
		relScreenWidth: 0, // 窗口宽度
		isLogin: false,
		isLink: false,
		newToken: undefined,
		hasUnionId: undefined,
		// --- 这两个参数在付款成功后,跳转页面时用到  ---
		pageSign: '', //跳转页面标识
		skuId: null, // 商品详情页id
		wsfBaseInfo: {},
		kCode: '', // H5分销专区拉起小程序识别码
		hasDistribution: false // 是否有分销权限
	},
	methods: {
		//获取手机型号
		getMobileInfo() {
			let that = this;
			let model = '';
			uni.getSystemInfo({
				success: function(res) {
					// console.log(res);
					// 获取手机
					model = res.model;
					// console.log(model, "model");
					if (
						model.search('unknown<iPhone13,2>') != -1 ||
						model.search('iPhone X') != -1 ||
						model.search('iPhone XR') != -1 ||
						model.search('iPhone XS Max') != -1 ||
						model.search('iPhone 11') != -1 ||
						model.search('iPhone 12') != -1
					) {
						that.globalData.isNeedBottomSpace = true;
						// console.log(
						//   that.globalData.isNeedBottomSpace,
						//   "model-isNeedBottomSpace"
						// );
					}
					// uni.setStorageSync('modelmes', model)
				}
			});
		},
		bindGetUserInfo(callback) {
			let that = this;
			uni.checkSession({
				success: function() {
					//session_key 未过期，并且在本生命周期一直有效
					console.log('登录状态未过期');
					that.getUserInfo(callback);
				},
				fail: function() {
					console.log('登录状态已过期');
					// session_key 已经失效，需要重新执行登录流程
					that.login().then(() => {
						that.getUserInfo(callback);
					});
				}
			});
		},
		returnRoute(queryParams = {}) {
			// if (!!queryParams.returnUrl) {
			// 	let returnUrl = decodeURIComponent(queryParams.returnUrl)
			// 	if (switchUrl.indexOf(returnUrl) > -1) {
			// 		uni.switchTab({
			// 			url: returnUrl,
			// 		})
			// 	} else {
			// 		uni.redirectTo({
			// 			url: returnUrl,
			// 		})
			// 	}
			// } else {
			// 	this.navigateBack()
			// }
			this.$smart.go('SmartUCenter');
		},
		checkBind(queryParams) {
			let that = this;
			return this.login().then(res => {
				if (res.data.link) {
					setTimeout(function() {
						that.returnRoute(queryParams);
					}, 3000);
					that.showToastError('您的微信已经与其他账户绑定，正在登录已绑定账号...', 3000);
				}
			});
		},
		getUserInfo(callback) {
			// 获取用户信息
			// console.log("#############");
			this.dealUserInfo({}, callback);
			/* wx.getUserProfile({
				lang: 'zh_CN',
				desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
				success: (res) => {
					console.log(res, "微信授权后的信息");
					this.dealUserInfo(res, callback);
				}
			}) */
			/* uni.getSetting({
        success: (res) => {
          if (res.authSetting["scope.userInfo"]) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            uni.getUserInfo({
              success: (res) => {
                console.log(res, "微信授权后的信息");
                // 可以将 res 发送给后台解码出 unionId
                this.dealUserInfo(res, callback);
              },
            });

          }
        },
      }); */
		},
		dealUserInfo(res, callback) {
			callback(res);
		},
		navigateBack: function(timeOut = 0, delta = 1) {
			setTimeout(function() {
				uni.navigateBack({
					delta: delta
				});
			}, timeOut);
		},
		login() {
			let that = this;
			// 登录
			return new Promise(resolve =>
				uni.login({
					success: res => {
						// console.log("获取code: ", res);
						// 发送 res.code 到后台换取 openId, sessionKey, unionId
						let params = {
							code: res.code
						};
						vm.$u.api
							.GetLoginInfo(params)
							.then(res => {
								// console.log(`接口数据(GetLoginInfo): `, res);

								//每次调用 GetLoginInfo 会生成新的token
								uni.setStorageSync('openId', res.data.openId);
								// if (res.data.token) {
								// uni.setStorageSync('token', res.data.token)
								if (uni.getStorageSync('newToken')) {
									// console.log("这是有token");
									// this.globalData.newToken = uni.getStorageSync("newToken")
									that.globalData.isLink = true;
								} else {
									// console.log("这是没有token");
									that.globalData.isLink = false;
								}

								// 进入小程序判断是否有分销权限
								// console.log(
								//   "+--------------是否有登陆",
								//   that.globalData.isLink
								// );
								if (that.globalData.isLink) {
									// 获取用户数据
									vm.$u.api.CustomerDetail().then(res => {
										if (res.code === 200) {
											// 保存全局分销权限字段
											that.globalData.hasDistribution = res.data.hasDistributionPermission;
											// console.log(
											//   "是否有分销权限----------",
											//   that.globalData.hasDistribution
											// );
											// this.$store.commit('SET_LAST_LOGIN_TIME', res.data.lastLoginTime);
										}
									});

									// 2022.10.19 实体店电商项目, 接口影响逻辑不再调用,原有分销弃用
									// 进入小程序判断是否有分销权限
									// vm.$u.api.QueryIsAllowDistribution().then(res => {
									// 	// console.log("进入小程序判断是否有分销权限", res);
									// 	if (res.code == 200) {
									// 		// 设置分销权限
									// 		that.$store.commit('SET_DISTRIBUTION', res.data);
									// 		// console.log(
									// 		//   "store仓库-----是否有分销权限分销权限",
									// 		//   that.$store.getters.getDistribution
									// 		// );
									// 	}
									// });
								}

								// 没有token判断是否为其他小程序跳转自动登录
								// console.log("启动自动登录");
								// let checkResult = that.checkFromAppId();
								// console.log("globalData", that.$globalData);

								// if (
								//   that.globalData.scene === 1037 &&
								//   checkResult &&
								//   that.globalData.phone
								// ) {
								//   let authData = sign(that.globalData.phone, 1);
								//   authData.openId = res.data.openId;
								//   // console.log("authData", authData);
								//   vm.$u.api.UnAuthLogin(authData).then((res) => {
								//     // console.log("res", res);
								//     if (res.code === 200) {
								//       that.globalData.newToken = res.data;
								//       uni.setStorageSync("newToken", res.data);
								//       that.globalData.isLink = true;
								//     }
								//   });
								// }
								// 获取分销权限
								// let ciphertext = "PvRuIlQbeyQqVSP5yd4CQA==";
								// console.log(
								//   "H5分销免密登录",
								//   that.globalData.kCode,
								//   "openId",
								//   res.data.openId
								// );
								// console.log("ciphertext类型", typeof that.globalData.kCode);
								// console.log("openId类型", typeof res.data.openId);
								// 分销的免密登录，目前后台说这个场景不考虑，先不动 2023/07/21
								if (that.globalData.kCode && that.globalData.scene == 1069) {
									let param = {
										ciphertext: that.globalData.kCode.toString(),
										openId: res.data.openId.toString()
									};
									// console.log("param参数", param);
									vm.$u.api.AppletsUnAuthLogin(param).then(res => {
										// console.log("H5分销", res);
										if (res.code === 200) {
											that.globalData.newToken = res.data;
											uni.setStorageSync('newToken', res.data);
											that.globalData.isLink = true;
											// 设置分销权限
											that.$store.commit('SET_DISTRIBUTION', that.globalData.hasDistribution);
											// console.log(
											//   "H5拉起小程序-----是否有分销权限分销权限",
											//   that.globalData.hasDistribution
											// );
											// console.log(
											//   "store仓库-----是否有分销权限分销权限",
											//   that.$store.getters.getDistribution
											// );
											// vm.$u.api.CustomerDetail().then(res => {
											// 	if (res.code === 200) {
											// 		this.$store.commit("SET_DISTRIBUTION",res.data.hasDistributionPermission)
											// 	}
											// });
										}
									});
								}

								// }
								//是否关联用户:关联为true,否则为false
								// that.globalData.isLink = res.data.link || null
								//是否有unionId:有unionId则为true
								// that.globalData.hasUnionId = false
								resolve(res);
								//token是否已经刷新，刷新则为true
								that.globalData.isTokenRefresh = true;
								//首页查询未读消息
								// if (that.indexMessageCallback) {
								// 	that.indexMessageCallback()
								// }
							})
							.catch(error => {
								console.log('请求有问题--> ', error);
							});
						/* // 请求万顺福商城信息
						vm.$u.api
							.GetBaseInfoSet({})
							.then(res => {
								console.log('请求万顺福商城信息', res);
								that.globalData.wsfBaseInfo = res.data;
							})
							.catch(err => {
								that.globalData.wsfBaseInfo = { isShowStore: 0 };
							}); */
					}
				})
			);
		},
		showToastError: function(errMsg, duration = 3000) {
			uni.showToast({
				title: errMsg,
				icon: 'none',
				mask: true,
				duration: duration
			});
		},
		// 获取头部信息
		getNavigationSystemInfo: function() {
			uni.getSystemInfo({
				success: res => {
					this.globalData.windowWidth = res.windowWidth;
					this.globalData.statusBarHeight = res.statusBarHeight;
					this.globalData.safeTopBarHeight = res.statusBarHeight + 44;
					// 能力检测 支付宝小程序上无法使用
					if (!uni.getMenuButtonBoundingClientRect()) {
						return;
					}
					// Todo 支付小程序兼容问题
					let capsule = uni.getMenuButtonBoundingClientRect();
					let windowWidth = res.windowWidth;
					this.globalData.capsule = capsule;
					this.globalData.navigationRightWidth = (windowWidth - capsule.right) * 2 + capsule.width;
					this.globalData.capsuleToRight = windowWidth - capsule.right;
					this.globalData.relScreenWidth = res.screenWidth;
				}
			});
		},
		// 检查来源App是否为白名单
		checkFromAppId() {
			let whiteList = ['wxea6c55b44a247053', 'wx46d563038cdd2a08', 'wx2c4dc6427b1b83ff'];
			return this.globalData.jumpInAppId && whiteList.indexOf(this.globalData.jumpInAppId) >= 0;
		},

		wsUserAuthLogin(jumpUrl) {
			//判断是否获取到openId,没有获取到延时再进行
			let openId = uni.getStorageSync('openId')
			if(!openId) {
				setTimeout(() => {
					this.wsUserAuthLogin(jumpUrl)
				}, 500);
				return
			}
			uni.setStorageSync('isWsUser', 1);
			
			let authData = sign(this.globalData.phone, 1);
			authData.openId = uni.getStorageSync('openId');
			authData.passengerId = this.globalData.passengerId;
			authData.deviceId = this.globalData.deviceId || ''

			// 不需要判断权限了，直接调用免密登录
			bindAccountWithNoAuth(authData).then(res => {
				if (res.code === 200) {
					let data = res.data
					this.globalData.newToken = data.token;
					uni.setStorageSync('newToken', data.token);
					uni.setStorageSync('phone', this.globalData.phone)
					this.globalData.isLink = true;
					this.queryUserInfo()
				}
			}).catch((err = {}) => {
				let data = err.data || {}
				uni.showToast({
					title: data.msg,
					icon: 'none',
				});
			})

			//判断是否有权限 自动登录
			// let conditionData = {
			// 	passengerId: this.globalData.passengerId
			// };
			// vm.$u.api.SelectOneByCondition(conditionData).then(res => {
			// 	if (res.code == 200) {
			// 		let info = res.data;
			// 		if (!info.id) {
			// 			this.$wsf.go("Authorization", { pageType: 1, jumpUrl }, 'redirectTo');
			// 		} else {
			// 			let authData = sign(this.globalData.phone, 1);
			// 			authData.openId = uni.getStorageSync('openId');
			// 			authData.passengerId = this.globalData.passengerId;
			//				vm.$u.api.UnAuthLogin(authData).then(res => {
			// 				if (res.code === 200) {
			// 					this.globalData.newToken = res.data;
			// 					uni.setStorageSync('newToken', res.data);
			// 					uni.setStorageSync('phone', this.globalData.phone)
			// 					this.globalData.isLink = true;
			// 					this.queryUserInfo()
			// 				}
			// 			})
			// 		}
			// 	}
			// });
		},

		/* 获取用户信息 */
		queryUserInfo() {
			vm.$u.api.CustomerDetail().then(res => {
				if (res.code === 200) {
					uni.setStorageSync('userInfo', res.data)
				}
			});
		},

		autoUpdate() {
			var self = this;
			// 获取小程序更新机制兼容
			if (uni.canIUse('getUpdateManager')) {
				const updateManager = uni.getUpdateManager();
				// 小程序分享到朋友圈，打开无法获取检测版本方法
				if (!updateManager) return
				//1. 检查小程序是否有新版本发布
				updateManager.onCheckForUpdate(function(res) {
					// 请求完新版本信息的回调
					// console.log('检测小程序是有有新版本:',res);
					if (res.hasUpdate) {
						//检测到新版本，需要更新，给出提示
						uni.showModal({
							title: '更新提示',
							content: '检测到新版本，是否下载新版本并重启小程序？',
							success: function(res) {
								if (res.confirm) {
									//2. 用户确定下载更新小程序，小程序下载及更新静默进行
									self.downLoadAndUpdate(updateManager);
								} else if (res.cancel) {
									//用户点击取消按钮的处理，如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
									uni.showModal({
										title: '温馨提示',
										content: '本次版本更新涉及到新的功能添加，旧版本可能无法正常访问哦',
										showCancel: false, //隐藏取消按钮
										confirmText: '确定更新', //只保留确定更新按钮
										success: function(res) {
											if (res.confirm) {
												//下载新版本，并重新应用
												self.downLoadAndUpdate(updateManager);
											}
										}
									});
								}
							}
						});
					}
				});
			} else {
				// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
				uni.showModal({
					title: '提示',
					content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
				});
			}
		},
		/**

* 下载小程序新版本并重启应用

*/
		downLoadAndUpdate(updateManager) {
			var self = this;
			uni.showLoading({ title: '更新中!' });
			//静默下载更新小程序新版本
			updateManager.onUpdateReady(function() {
				uni.hideLoading();
				//新的版本已经下载好，调用 applyUpdate 应用新版本并重启
				updateManager.applyUpdate();
			});
			updateManager.onUpdateFailed(function() {
				// 新的版本下载失败
				uni.showModal({
					title: '已经有新版本了哟',
					content: '新版本已经上线啦，请您删除当前小程序，重新搜索打开哟'
				});
			});
		},

		queryGrayscale() {
			uni.request({
        url: "https://wsjc-web.wsecar.com/carMobile/json/wsjc-config.json?t=" + new Date().getTime(),
        method: "get",
        success: (res) => {
					vm.$globalData.isGrayscale = res.data.isGrayscale
        },
      });
		}
	}
};
</script>

<style lang="scss">
@import './static/img/icon/iconfont.css';
// @import 'uview-ui/index.scss';
@import 'uview-v1_1.8.6/index.scss';
@import 'app.css';
</style>
