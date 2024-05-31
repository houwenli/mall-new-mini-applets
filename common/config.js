import QQMapWX from './qqmap-wx-jssdk.min.js';

const qqMap = new QQMapWX({
    key: 'M26BZ-3P6KH-OICDF-WFOUI-LE73H-QABHH' // 必填
});
// 电商
const mallImg = `https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall`
// 智慧生活
const smartImg = `https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life`

const appVersion = require('../package.json').version

export {
    qqMap,
    mallImg,
    smartImg,
    appVersion
}