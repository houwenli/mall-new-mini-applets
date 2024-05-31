// 微信访问根地址
// 电商baseUrl
let baseUrl = 'https://api.wsfmall.com/api/applets';
// 智慧生活baseUrl
let smartBaseUrl = 'https://smartlife.wsfsmart.com'
//  电商 H5 智慧生活地址
let mallUrl = 'https://m.wsfmall.com/app/smartlife'
// #ifdef MP-WEIXIN
const env = __wxConfig.envVersion;

// 小程序AppId
// wx46d563038cdd2a08  线上和uat小程序
// wxea6c55b44a247053  dev和test小程序

switch (env) {
  case 'develop':
    baseUrl = 'https://api-uat1.wsfmall.com/api/applets';
    smartBaseUrl = 'https://smartlife-uat1.wsfsmart.com'
    mallUrl = 'https://m.wsfmall.com/app/smartlife'

    console.log('微信小程序开发版-->baseUrl:' + baseUrl) // 'develop',   //开发版
    break;
  case 'trial':
    baseUrl = 'https://api.wsfmall.com/api/applets';
    smartBaseUrl = 'https://smartlife.wsfsmart.com'
    mallUrl = 'https://m.wsfmall.com/app/smartlife'
    console.log('微信小程序体验版-->baseUrl:' + baseUrl); // 'trial',      //体验版
    break;
  default: // 'release',    //正式版
    baseUrl = 'https://api.wsfmall.com/api/applets';
    smartBaseUrl = 'https://smartlife.wsfsmart.com'
    mallUrl = 'https://m.wsfmall.com/app/smartlife'
    console.log('微信小程序正式版-->baseUrl:' + baseUrl);
    break;
}
// #endif

export {
  baseUrl,
  smartBaseUrl,
  mallUrl
};