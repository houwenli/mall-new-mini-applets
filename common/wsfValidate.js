/* 修复数字小数点后两位 只能传入Number */
export const priceFilter = function(value) {
	let realVal = ''
	if (!isNaN(value) && value !== '') {
		// 截取当前数据到小数点后两位
		realVal = parseFloat(value).toFixed(2)
	} else {
		realVal = '--'
	}
	return realVal
}
