const privacyResolves = new Set();
let isNavigating = false;
export default {
  init() {
    // 兼容低版本微信
    if(!wx.onNeedPrivacyAuthorization) {
      return
    }
    wx.onNeedPrivacyAuthorization(resolve => {
      privacyResolves.add(resolve)
      const pages = getCurrentPages();
      if (pages[pages.length - 1].route != 'pages/wxAuthorize/wxAuthorize' && !isNavigating) {
        uni.navigateTo({
          url: '/pages/wxAuthorize/wxAuthorize',
        })
        //防止多次触发跳转
        isNavigating = true;
        setTimeout(() => {
          isNavigating = false;
        }, 1000);
      }
    })

  },
  agree() {
    privacyResolves.forEach(item => {
      item({ buttonId: 'agree-btn', event: 'agree' })
    })
    privacyResolves.clear();
  },
  disagree() {
    privacyResolves.forEach(item => {
      item({ event: 'disagree' })
    })
    privacyResolves.clear();
  },
  exposure() {
    privacyResolves.forEach(item => {
      item({ event: 'exposureAuthorization' })
    })
  }
}
