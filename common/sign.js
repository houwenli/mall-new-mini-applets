import md5 from "@/js_sdk/js-md5/src/md5.js";
const fun_aes = require("./AES");
/**
 * @method 加密手机号
 * @param { Number } phone 手机号
 * @return { Object } 提交的完整数据类型
 */
export const sign = function (phoneNo, userSource) {
  console.log("phoneNo", phoneNo);
  const timeStamp = Date.now();
  const random = getRandomNumberByRange(10, 99);
  const md532 = md5(
    `${timeStamp}@#fd*sa%fagfdgv43532ju76jM${phoneNo}${random}`
  );
  return {
    phoneNo,
    timeStamp,
    userSource,
    sign: `ws${md532}${random}`,
    loginSource: 3,
  };
};
function getRandomNumberByRange(start, end) {
  return Math.floor(Math.random() * (end - start) + start);
}

/* AES加密加密 */
export const encrypt = function (str,ivStr, keyStr) {
  let timeStamp = Date.now()
  let srcs = fun_aes.CryptoJS.enc.Utf8.parse(str)
  let key = fun_aes.CryptoJS.enc.Utf8.parse(keyStr ? keyStr : 'Gbc*%fghijklmn12')
  let iv = fun_aes.CryptoJS.enc.Utf8.parse(ivStr ? ivStr : `wsf${timeStamp}`)
  let encrypted = fun_aes.CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: fun_aes.CryptoJS.mode.CBC,
    padding: fun_aes.CryptoJS.pad.Pkcs7
  });
  return {encryptStr: encrypted.ciphertext.toString(fun_aes.CryptoJS.enc.Base64),timeStamp};
}

//解密
export const decrypt = function (str, ivStr, keyStr) {
  let key = fun_aes.CryptoJS.enc.Utf8.parse(keyStr ? keyStr : 'Gbc*%fghijklmn12')
  let iv = fun_aes.CryptoJS.enc.Utf8.parse(ivStr);
  let decrypted = fun_aes.CryptoJS.AES.decrypt(str,key,{
    iv:iv,
    mode:fun_aes.CryptoJS.mode.CBC,
    padding:fun_aes.CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(fun_aes.CryptoJS.enc.Utf8);
};
