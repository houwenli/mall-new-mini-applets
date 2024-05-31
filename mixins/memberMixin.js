// 登录注册非空验证提示
export default {
	data() {
		return {
			userNameError: '', //账号为空提示
			passwordError: '', //密码为空提示
			codeError: '', //验证码为空提示
			phoneError: '' // 手机号
		}
	},
	methods: {
		// 账号输入框失去焦点时触发
		userNameBlur(value) {
			if (value == '') {
				this.userNameError = "账号不能为空!"
			} else {
				this.userNameError = ''
			}
		},
		// 密码输入框失去焦点时触发
		passwordBlur(value) {
			if (value == '') {
				this.passwordError = "密码不能为空!"
			} else {
				this.passwordError = ''
			}
		},
		// 验证码输入框失去焦点时触发
		validateCode(value) {
			if (value == '') {
				this.codeError = "请输入验证码!"
			} else {
				this.codeError = ''
			}
		},
		phone(value){
			if (value == '') {
				this.phoneError = "请输入手机号!"
			} else {
				this.phoneError = ''
			}
		}
	},
}
