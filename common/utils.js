// 路由映射
import routeMapping from './routerMapping.js'

/**
 * 在一个连续操作行为中，每间隔delay的时间触发1次。
 * 函数在一段时间内多次触发只会执行第一次，在这段时间结束前，不管触发多少次也不会执行函数。
 * 频率控制(函数节流) 返回函数连续调用时，func 执行频率限定为 次 / wait
 * @from underscore源码注解 https://www.cnblogs.com/guanine/p/9623325.html
 * @param  {function}   func      传入函数
 * @param  {number}     wait      表示时间窗口的间隔
 * @param  {object}     options   如果想忽略开始边界上的调用，传入{leading: false}。
 *                                如果想忽略结尾边界上的调用，传入{trailing: false}
 * @return {function}             返回客户调用函数
 */
export const throttle = function (func, wait = 300, options) {
    let context, args, result
    let timeout = null
    // 上次执行时间点
    let previous = 0
    if (!options) options = {}
    // 延迟执行函数
    let later = function () {
        // 若设定了开始边界不执行选项，上次执行时间始终为0
        previous = options.leading === false ? 0 : Number(new Date())
        timeout = null
        result = func.apply(context, args)
        if (!timeout) context = args = null
    }
    return function (..._args) {
        let now = Number(new Date())
        // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
        if (!previous && options.leading === false) previous = now
        // 延迟执行时间间隔
        let remaining = wait - (now - previous)
        context = this
        args = _args
        // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
        // remaining大于时间窗口wait，表示客户端系统时间被调整过
        if (remaining <= 0 || remaining > wait) {
            clearTimeout(timeout)
            timeout = null
            previous = now
            result = func.apply(context, args)
            if (!timeout) context = args = null
        //如果延迟执行不存在，且没有设定结尾边界不执行选项
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining)
        }
        return result
    }
}

/**
 * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 * @description 函数防抖，就是指触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
 * @param  {function} func        传入函数，最后一个参数是额外增加的this对象，.apply(this, args) 这种方式，this无法传递进函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，调用触发于开始边界而不是结束边界
 * @return {function}             返回客户调用函数
 */
export const debounce = function (func, wait = 300, immediate = true) {
    let timeout, args, context, timestamp, result
    const later = function () {
        // 据上一次触发时间间隔
        let last = Number(new Date()) - timestamp

        // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last)
        } else {
            timeout = null
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.call(context, ...args, context)
                if (!timeout) {
                context = args = null
                }
            }
        }
    }
    return function (..._args) {
        context = this
        args = _args
        timestamp = Number(new Date())
        const callNow = immediate && !timeout
        // 如果延时不存在，重新设定延时
        if (!timeout) {
            timeout = setTimeout(later, wait)
        }
        if (callNow) {
            result = func.call(context, ...args, context)
            context = args = null
        }

        return result
    }
}

// 获取小数的整数位和小数位，不足保留位数补0
export const getSplitPrice = (price, point = 2) => {
    if (isNaN(price)) {
        return null
    }

    let newPrice = Math.round(price * Math.pow(10, point)) / Math.pow(10, point)
    newPrice = newPrice.toFixed(point); // 补位

    let priceArr = newPrice.split('.') || [];
    let int = priceArr[0] || 0
    let decimal = priceArr[1] || '00'
    return {
        price,
        int,
        decimal
    }
}

// 获取链接参数，?a=1&b=2 转换成{a:1, b:2}
export const getUrlParam =(url) => {
	let arrObj = url.split("?") || []
	let params = Object.create(null) 
	if (arrObj.length > 1) {
		arrObj = arrObj[1].split("&") || []
		arrObj.forEach(item => {
			item = item.split("=") || []
			params[item[0]] = item[1]
		})
	}
	return params;
}

// 闭包缓存映射 path -> router
function getRouteFn() {
	let routerKeys = Object.keys(routeMapping)
	let routers = Object.create(null)
	routerKeys.forEach(item => {
		let router = routeMapping[item]
		routers[router.path] = item
	})
	return (pagePath) => {
		return routers[pagePath] || routers['/' + pagePath] || ''
	}
}

export function getRoute(pagePath) {
	let routeFn = getRouteFn()
	return routeFn(pagePath)
}

// 整数且限制只能输入小数点后num位
export const checkNum = (value, num) => {
  let map = {
    1: /^(\-)*(\d+)\.(\d).*$/, //1位小数
    2: /^(\-)*(\d*)\.(\d\d).*$/, //2位小数
  };
  value = value.replace(/^0*(0\.|[1-9])/, "$1");
  value = value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
  value = value.replace(/^\./g, ""); //验证第一个字符是数字而不是字符
  value = value.replace(/\.{1,}/g, "."); //只保留第一个.清除多余的
  value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
  value = value.replace(map[num], "$1$2.$3"); //只能输入几个小数

  return value;
};
// 分转元
export function fenToYuan(amount, needFixed = true, point = 2) {
    let type = /^[0-9]*[1-9][0-9]*$/
    // 校验正整数
    if (!type.test(amount)) {
        if (needFixed) {
            return 0 .toFixed(point)
        } else {
            return 0
        }
    }

    if (needFixed) {
        return (Number(amount) / 100).toFixed(point)
    } else {
        return (Number(amount) / 100)
    }
    
}

// 元转分
export function yuanToFen(amount) {
    if (!parseFloat(amount)) {
        return 0;
    }
    return Math.round(amount * 100);
}

//获取字符串某段。默认取后4位
export function interceptNum(val, num = -4) {
    if (!val || val.length < Math.abs(num)) return "";
    return val.slice(num) || "";
}

// sleep 函数
export function sleep(time){
    return new Promise((resolve) => setTimeout(resolve, time));
}

// 手机号脱敏
export function phonenumberDim(phone) {
    // 转换成字符串
    phone += ''
    let erg = /(\d{3})\d*(\d{4})/
    return phone.replace(erg, '$1****$2')
}

