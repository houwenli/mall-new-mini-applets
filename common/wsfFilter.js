import dayjs from 'dayjs'
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
// 退款订单状态
export const backOrderStatusFilter = function(value) {
	let statusName = ''
	value += ''
	switch (value) {
		case '1':
			statusName = "退款申请中";
		break;
		case '2':
			statusName = "退款成功";
		break;
		case '3':
			statusName = "退款拒绝";
		break;
		case '4':
			statusName = "退货申请";
		break;
		case '5':
			statusName = "退货拒绝";
		break;
		case '6':
			statusName = "退货审核通过等待用户填写物流";
		break;
		case '7':
			statusName = "待收货";
		break;
		case '8':
			statusName = "退货完成";
		break;
		case '9':
			statusName = "退货失败";
		break;
		case '10':
			statusName = "发放金额";
		break;
		default: 
			statusName = '异常订单'
		break;
	}
	return statusName
}

/* 手机号加密 */
export const phoneNumberHide = function(value) {
	if(value) {
		let tel = String(value);
		return tel.substr(0,3) + '****' + tel.substr(7);
	}
}

// 银行卡保留前四位后四位其余显示*
export const dealBankNumer = (value) => {
  if (['string', 'number'].includes(typeof value)) {
    return `${value.slice(0, 4)}******${value.slice(value.length - 4, value.length)}`
  }
  return value
}

// 身份证保留前六位后四位其余显示*
export const dealIdCardNumer = (value) => {
  if (['string', 'number'].includes(typeof value)) {
    return `${value.slice(0, 6)}******${value.slice(value.length - 4, value.length)}`
  }
  return value
}
/**
* 获取运输时间-格式化
*/
export const getTransportTime = t => {
  let todayDate = dayjs().date()
  let currentYear = dayjs().year()


  let date = dayjs(t).date()
  let year = dayjs(t).year()

  // 时间为当日
  if (todayDate === date) {
    return dayjs(t).format('HH:mm')
  }

  // 当年
  if (currentYear === year) {
    return dayjs(t).format('MM-DD')
  }

  // 往年
  return dayjs(t).format('YYYY-MM-DD')
}
//  获取金额整数部分
export const getPriceInt =(val)=>{
	return Math.floor(val)
}
// 获取金额小数部分
export const getPricePrecision=(val)=> {
	const num = Number(val).toFixed(2)
	return num.substring(num.length-3, num.length)
}
