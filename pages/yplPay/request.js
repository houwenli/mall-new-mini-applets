
import httpInterceptor from '@/common/http.interceptor.js'
const getUUID = (e) => {
    var uuid = uni.getStorageSync("deviceId");
    if (!uuid) {
      var d = new Date().getTime();
      uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      uni.setStorageSync("deviceId", uuid);
    }
    return uuid
}

export default {
    post(url,data,options={}) {
        if(url.indexOf("http") !== 0){
            url = httpInterceptor.baseUrl + url;
        }                   
        return new Promise((resolve, reject) => {
            data = {
                channel: '10600003',
                deviceId: getUUID(),
                platform: '3',
                softVersion: 'min', // 微信版本号
                sysVersion: 'min', // 系统版本号
                data: typeof data === "string" ? data : JSON.stringify(data),
                ...options
            }     
            console.log(httpInterceptor,'wwwwwwwwwww');      
            this.$u.post(            
                url,
                data,               
            ).then((res)=>{               
                const jsonData = res.data?.data;
                if (jsonData && typeof jsonData === "string") {
                    try {
                        res.data.data = JSON.parse(jsonData);
                    } catch {}
                }
                resolve(res);               
            }).catch((err)=>{
                reject(err);
            })
        })
    }
}