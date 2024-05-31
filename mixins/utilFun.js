// 登录注册非空验证提示
export const debounce = {
	data() {
		return {
			timer: '', // 节流函数时间戳
		}
	},
	methods: {
		// 防抖函数
		debounce(timer,func, wait) {
			console.log('触发防抖函数')
			let that = this
			return function() {
				let context = this; // 注意 this 指向
				let args = arguments; // arguments中存着e
				
				if (timer) clearTimeout(timer);

				timer = setTimeout(() => {
					func.apply(this, args)
				}, wait)
			}
		}
	},
}


const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// 传入时间戳计算年月日
export function parseTimeData(time) {
  const days = Math.floor(time / DAY);
  const hours = Math.floor((time % DAY) / HOUR);
  const minutes = Math.floor((time % HOUR) / MINUTE);
  const seconds = Math.floor((time % MINUTE) / SECOND);
  const milliseconds = Math.floor(time % SECOND);

  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  };
}
