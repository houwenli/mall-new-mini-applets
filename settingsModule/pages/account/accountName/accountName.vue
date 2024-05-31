<template>
	<view class="container">
		<view class="input-style u-border-top">
			<u-input style="width: 100%;" v-model="nickName" :type="text" :disabled="isUpdate" :border="false" maxlength="20" :placeholder="placeholder" />
		</view>
		<view class="hint__title">{{ hintTitle }}</view>
		<view v-if='hintTitle2' class="hint__title">{{ hintTitle2 }}</view>
		
		<view v-if="!isUpdate" class="page__bd">
			<!-- <u-button type="warning" @click="saveNickName">保存</u-button> -->
			<wsf-btn @click="saveNickName">确定</wsf-btn>
		</view>
	</view>
</template>

<script>
import wsfBtn from '@/components/wsf-btn/wsf-btn.vue'
const app = getApp()
let nameSign = 'nickName'
let id = null
export default {
	components: {
		wsfBtn,
	},
	data() {
		return {
			placeholder: '请输入昵称',
			hintTitle: '不超过20个字符,可由中英文、数字、"-"和"_"组成',
			hintTitle2:null,
			nickName: '',
			gender: '',
			isUpdate: false
		}
	},
	onLoad(option) {
		
		if (option.id) {
			if(option.isUpdate == 1){
				this.isUpdate = true
			}
			this.nickName = option.userName
			id = option.id
			nameSign = 'userName'
			this.placeholder = '请输入用户名'
			this.hintTitle = '不超过20个字符,可由中英文,数字组成'
			this.hintTitle2 = '用户名仅供修改一次，后续不可修改，请谨慎操作'
			uni.setNavigationBarTitle({
				title: '用户名修改',
			})
		}else {
			nameSign = 'nickName'
			this.nickName = option.nickName
			this.gender = option.gender
		}
	},
	methods: {
		btnFun() {
			console.log('确定了')
		},
		saveNickName() {
			if (nameSign === 'userName') {
				//用户名修改
				let data = JSON.stringify({ userName: this.nickName, id })
				this.$u.api.EditCustomerUserName(data).then((res) => {
					if (res.code == 200) {
						app.navigateBack()
					} else {
						uni.showToast({
							title: '更新用户信息失败',
							icon: 'none',
							mask: true,
							duration: 1500,
						})
					}
				})
			} else {
				let data = JSON.stringify({ nickName: this.nickName, gender: this.gender })
				this.$u.api.UpdateCustomerInfo(data).then((res) => {
					if (res.code == 200) {
						app.navigateBack()
					} else {
						uni.showToast({
							title: '更新用户信息失败',
							icon: 'none',
							mask: true,
							duration: 1500,
						})
					}
				})
			}
		},
	},
}
</script>

<style scoped lang="scss">
.container {
	// padding: 15px;
	.input-style {
		padding: 0 40rpx;
		display: flex;
		align-items: center;
		height: 100rpx;
		background: #ffffff;
	}
	.hint__title {
		padding: 0 40rpx;
		margin-top: 0.77em;
		margin-bottom: 0.3em;
		color: #999;
		font-size: 14px;
	}

	.page__bd {
		padding-top: 15px;
		padding-left: 20px;
		padding-right: 20px;
	}
}
</style>
