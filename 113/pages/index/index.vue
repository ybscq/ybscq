<template>
	<view class="container">
		<view class="welcome-section">
			<text class="main-title">HELLO!</text>
			<text class="sub-title">欢迎登录您的账户</text>
		</view>

		<view class="input-content">
			<view class="input-item">
				<text class="label">账号</text>
				<input 
					type="text" 
					v-model="formData.username" 
					placeholder="请输入邮箱/用户名" 
				/>
			</view>
			
			<view class="input-item">
				<text class="label">密码</text>
				<input 
					type="password" 
					v-model="formData.password" 
					placeholder="请输入密码" 
					@confirm="doLogin"
				/>
			</view>
		</view>

		<button class="confirm-btn" :loading="loading" @click="doLogin">登 录</button>

		<view class="forget-section">
			<text @click="toForget">忘记密码?</text>
			<text class="register" @click="toRegister">立即注册账号</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			formData: { username: '', password: '' },
			loading: false
		};
	},
	methods: {
		validate() {
			if (!this.formData.username) { uni.showToast({ title: '请输入账号', icon: 'none' }); return false; }
			if (this.formData.password.length < 6) { uni.showToast({ title: '密码长度不足', icon: 'none' }); return false; }
			return true;
		},
		doLogin() {
			if (!this.validate()) return;
			this.loading = true;
			
			setTimeout(() => {
				const userList = uni.getStorageSync('user_list') || [];
				const foundUser = userList.find(item => 
					item.email === this.formData.username || item.username === this.formData.username
				);

				if (!foundUser) {
					this.loading = false;
					return uni.showToast({ title: '账号不存在', icon: 'none' });
				}
				if (foundUser.password !== this.formData.password) {
					this.loading = false;
					return uni.showToast({ title: '密码错误', icon: 'none' });
				}

				this.loading = false;
				uni.showToast({ title: '登录成功' });
				uni.setStorageSync('current_user', foundUser);
				
				// 登录成功后直接跳转到 AI 聊天界面
				setTimeout(() => {
					uni.reLaunch({ url: '/pages/chat/layout' });
				}, 1000);
			}, 800);
		},
		toForget() { uni.navigateTo({ url: '/pages/forget/forget' }); },
		toRegister() { uni.navigateTo({ url: '/pages/register/register' }); }
	}
};
</script>

<style lang="scss">
.container { padding: 0 60rpx; background: #fff; min-height: 100vh; }
.welcome-section { padding: 120rpx 0 80rpx; 
	.main-title { font-size: 80rpx; color: #303133; font-weight: bold; display: block; }
	.sub-title { font-size: 32rpx; color: #909399; margin-top: 10rpx; display: block; }
}
.input-content {
	.input-item { display: flex; flex-direction: column; padding: 20rpx 0; height: 120rpx; border-bottom: 2rpx solid #f8f8f8; margin-bottom: 30rpx;
		.label { height: 40rpx; line-height: 40rpx; font-size: 26rpx; color: #606266; }
		input { height: 60rpx; font-size: 30rpx; color: #303133; width: 100%; }
	}
}
.confirm-btn { width: 100%; height: 88rpx; line-height: 88rpx; border-radius: 44rpx; margin-top: 70rpx; background: #1a73e8; color: #fff; font-size: 32rpx; &:after { border: none; } }
.forget-section { display: flex; justify-content: space-between; padding: 40rpx 0; font-size: 26rpx; color: #909399; .register { color: #1a73e8; } }
</style>
