import httpInterceptor from '@/common/http.interceptor.js'
const app = getApp();
export const uploadFile = function(filePath) {
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: httpInterceptor.uploadFileUrl,
            filePath: filePath,
			header: {
				"content-type": "multipart/form-data",
				'Authorization': 'Bearer ' + (uni.getStorageSync('newToken') || '')
			},
            name: 'image',
            success(res) {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(res.data))
                } else {
                    uni.showToast({
                    	title: '上传失败',
                    	icon: 'none',
                    	mask: true,
                    	duration: 1500
                    });
                    reject()
                }
            }
        })
    });
};

/**
 * 把小程序码写入本地
 * @param {String} base64Str
 */
export const writeFile = (base64Str => {
  return new Promise((resolve,reject)=>{
    // 后台返回的base64格式数据的回车换行换为空字符''
    let base64Image =  base64Str.split(',')[1].replace(/[\r\n]/g, '');

    // 文件管理器
    const fsm = wx.getFileSystemManager();
    // 文件名
    const FILE_BASE_NAME = 'tmp_base64src';
    // 文件后缀
    const format = 'png';
    // 获取当前时间戳用于区分小程序码，防止多次写进的小程序码图片都一样，建议通过不同的列表ID来区分不同的小程序码
    const timestamp = (new Date()).getTime();
    // base转二进制
    const buffer = wx.base64ToArrayBuffer(base64Image),
    // 文件名
    filePath = `${wx.env.USER_DATA_PATH}/${timestamp}share.${format}`;

    // 写文件
    fsm.writeFile({
      filePath,
      data: buffer,
      encoding: 'binary',
      success() {
        // 读取图片
        wx.getImageInfo({
          src: filePath,
          success: function(res) {
            // 把需要画出来的图片的临时url暴露出去
            resolve(res.path);
          },
          fail(e){
            console.log('读取图片报错');
            console.log(e);
            reject(e)
          }
        })
      },
      fail(e){
        console.log('写临时文件的时候报错');
        console.log(e);
        reject(e)
      }
    })
  })
});


/**
 * 删除存储的垃圾数据
 */
export const removeSave = () =>{
  return new Promise((resolve)=>{
    // 文件管理器
    const fsm = wx.getFileSystemManager();
    // 获取文件列表
    fsm.readdir({
      dirPath: wx.env.USER_DATA_PATH, // 当时写入的文件夹
      success(res){
        res.files.forEach((el) => { // 遍历文件列表里的数据
          // 删除存储的垃圾数据
          if (el !== 'miniprogramLog') { // 过滤掉miniprogramLog
            fsm.unlink({
              filePath: `${wx.env.USER_DATA_PATH}/${el}`, // 文件夹也要加上，如果直接文件名会无法找到这个文件
              fail(e){
                console.log('readdir文件删除失败：', e)
              }
            });
          }
        })
        resolve()
      }
    })
  })
}