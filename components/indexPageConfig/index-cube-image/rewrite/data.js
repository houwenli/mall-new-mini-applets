import store from '../../../../store/index'
import wsfRoute from '../../../../common/wsfRoute'
/**
 {
  "title":"图文",
  "text":"图片魔方",
  "style":"Number类型 对应的是 code   1-5 对应的魔方风格1-5",
  "icon":"/static/img/magic@2x.2f4366d.png",
  "hasBackground":"1-有背景/0-无背景",
  "bgColor":"背景色",
  "bgImage":"背景图片url",
  "backgroundType":"0 --背景颜色   1-背景图片",
  "showComTitle":"0隐藏名称-1显示名称",
  "comTitle":"组件标题",
   "slideImageList": [
     {
          "url":"图片地址",
          "link":"跳转地址"
     }
   ],
  "list":[
      {
          "url":"图片地址",
          "link":"跳转地址"
      }
  ],
  "id":"u141787542"
}
 */

export const testConfig = [
  {
    title: '图文',
    text: "图片魔方",
    style: 5,
    icon: "/static/img/magic@2x.2f4366d.png",
    hasBackground: '1',
    bgColor: '#FFFFFF',
    bgImage: '',
    backgroundType: 0,
    showComTitle: '1',
    comTitle: '魔方风格1',
    slideImageList: [
      {
        url: '',
        link: 'http://mdev2.wsfmall.com/firstOrder?id=1048',
      },
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/cf21792a1400c11c7e607e7e9d5b1eee.png',
        link: '',
      }
    ],
    list: [
      {
        url: '',
        link: 'http://mdev2.wsfmall.com/firstOrder?id=1048',
      },
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/cf21792a1400c11c7e607e7e9d5b1eee.png',
        link: 'http://mdev2.wsfmall.com/firstOrder?id=1048',
      },
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/cf21792a1400c11c7e607e7e9d5b1eee.png',
        link: 'http://mdev2.wsfmall.com/firstOrder?id=1048',
      }
    ],
  },
]


/**
 * 统一的路径跳转
 * @param {Object} data
 * @returns
 */
export const toPage = (data, index) => {
  console.log(data, index)
  let params = data?.link
  let url = data?.url
  let link;
  if (store.state.isDistribution) {
    link = params.split("~")[1];
  } else {
    link = params;
    if(!link) return
    if(link.indexOf('/spudetail') !== -1) {
      let id = link.split('id=')[1]
      link = `productModule/pages/skuDetail/skuDetail?skuId=${id}`
    } else if(link.indexOf('/firstOrder') !== -1) {
      let id = link.split('id=')[1]
      link = `productModule/pages/firstOrder/firstOrder?id=${id}`
    } else if(link.indexOf('/spulist') !== -1) {
      let id = link.split('cateId=')[1]
      link = `productModule/pages/spuList/spuList?cateId=${id}`
    }
  }
  let obj = {
    name: "图片魔方",
    type: 8,
    image: url || "",
    url: link || "",
    index,
  };
  store.dispatch("SETTINGS/advertVisitRequest", obj);
  // this.$wsf.go(link);
  wsfRoute(link);
}



/* 点击swiper */
export const clickSwiperCurrent = (e, params) => {
  let advert = params[e];
  if (!advert) {
    if (!store.state.isDistribution) {
      let obj = {
        name: "图片魔方",
        type: 8,
        image: params[e].url || "",
        url: "",
        index: e,
      };
      store.dispatch("SETTINGS/advertVisitRequest", obj);
    }

    return;
  } else {
    let link;
    if (store.state.isDistribution) {
      link = advert.link.split("~")[1];
    } else {
      link = advert.link;
      if(!link) return
      if(link.indexOf('/spudetail') !== -1) {
        let id = link.split('id=')[1]
        link = `productModule/pages/skuDetail/skuDetail?skuId=${id}`
      } else if(link.indexOf('/firstOrder') !== -1) {
        let id = link.split('id=')[1]
        link = `productModule/pages/firstOrder/firstOrder?id=${id}`
      } else if(link.indexOf('/spulist') !== -1) {
        let id = link.split('cateId=')[1]
        link = `productModule/pages/spuList/spuList?cateId=${id}`
      }
    }
    if (!store.state.isDistribution) {
      let obj = {
        name: "图片魔方",
        type: 8,
        image: params[e].url || "",
        url: link,
        index: e,
      };
      store.dispatch("SETTINGS/advertVisitRequest", obj);
    }

    // this.$wsf.go(link);
    wsfRoute(link);
  }
}