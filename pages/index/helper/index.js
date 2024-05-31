
import wsfRoute from '../../../common/wsfRoute.js'

/**
 * 所有配置的组件统一的跳转方法
 * @param {*} url
 * 埋点的逻辑不要写在这里，都到单独组件里面自己去写
 */
export const goPage = (url) => {
  let link = url.split('~')[1] || url
  let isDistribution = 'distributionModule/pages/distributionIndex/distributionIndex' == link
  // 分销场景
  if (isDistribution) {
    let isLogin = getApp().globalData.isLink;
    if (isLogin) {
      // 跳转到分销的页面
      wsfRoute('distributionIndex');
    } else {
      // 登录
      wsfRoute('QuickLogin', { cartRoute: 'pages/index/index' });
    }
  } else {

    // if(link.indexOf('/spudetail') !== -1) {
    //   let id = link.split('id=')[1]
    //   link = `productModule/pages/skuDetail/skuDetail?skuId=${id}`
    // } else if(link.indexOf('/firstOrder') !== -1) {
    //   let id = link.split('id=')[1]
    //   link = `productModule/pages/firstOrder/firstOrder?id=${id}`
    // } 
    // else if(link.indexOf('/spulist') !== -1) {
    //   let id = link.split('cateId=')[1]
    //   link = `productModule/pages/spuList/spuList?cateId=${id}`
    // }

    // 直接跳转配置商品详情
    wsfRoute(link);
  }

  
}