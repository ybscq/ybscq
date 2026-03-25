<template>
	<view class="container">
		<view class="welcome-section">
			<text class="main-title">JOIN US</text>
			<text class="sub-title">创建一个新账号</text>
		</view>

		<view class="input-content">
			<view class="input-item">
				<text class="label">账号</text>
				<input type="text" v-model="regData.username" placeholder="请设置用户名" />
			</view>
			<view class="input-item">
				<text class="label">邮箱</text>
				<input type="text" v-model="regData.email" placeholder="请输入邮箱地址" />
			</view>
			<view class="input-item">
				<text class="label">密码</text>
				<input type="password" v-model="regData.password" placeholder="请设置6-16位密码" />
			</view>
		</view>

		<button class="confirm-btn" @click="handleRegister">注 册</button>
		
		<view class="footer" @click="goBack">
			<text>已有账号？立即登录</text>
		</view>
		
		<button @click="clearTestData" class="clear-btn">清空测试数据</button>
	</view>
</template>

<script>
export default {
	data() {
		return { regData: { username: '', email: '', password: '' } };
	},
	methods: {
		clearTestData() {
			uni.clearStorageSync(); 
			uni.showToast({ title: '数据已清空', icon: 'success' });
		},
		handleRegister() {
			const { username, email, password } = this.regData;
			const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
			
			if (!username) return uni.showToast({ title: '请输入用户名', icon: 'none' });
			if (!emailRegex.test(email)) return uni.showToast({ title: '邮箱格式不正确', icon: 'none' });
			if (password.length < 6) return uni.showToast({ title: '密码不能少于6位', icon: 'none' });
			
			let userList = uni.getStorageSync('user_list') || [];
			if (userList.some(item => item.email === email)) {
				return uni.showToast({ title: '该邮箱已被注册', icon: 'none' });
			}

			userList.push({ username, email, password });
			uni.setStorageSync('user_list', userList);
			uni.showToast({ title: '注册成功', icon: 'success', mask: true });
			setTimeout(() => { this.goBack(); }, 1500);
		},
		goBack() { uni.redirectTo({ url: '/pages/index/index' }); }
	}
};
</script>

<style lang="scss">
.container { padding: 0 60rpx; background: #fff; min-height: 100vh; }
.welcome-section { padding: 120rpx 0 80rpx; .main-title { font-size: 80rpx; color: #303133; font-weight: bold; display: block; } .sub-title { font-size: 32rpx; color: #909399; margin-top: 10rpx; display: block; } }
.input-content { .input-item { display: flex; flex-direction: column; padding: 20rpx 0; height: 120rpx; border-bottom: 2rpx solid #f8f8f8; margin-bottom: 30rpx; .label { height: 40rpx; line-height: 40rpx; font-size: 26rpx; color: #606266; } input { height: 60rpx; font-size: 30rpx; color: #303133; width: 100%; } } }
.confirm-btn { width: 100%; height: 88rpx; line-height: 88rpx; border-radius: 44rpx; margin-top: 70rpx; background: #1a73e8; color: #fff; font-size: 32rpx; &:after { border: none; } }
.footer { margin-top: 40rpx; text-align: center; color: #909399; font-size: 26rpx; }
.clear-btn { margin-top: 60rpx; background: #f5f5f5; color: #ff4d4f; font-size: 28rpx; border-radius: 40rpx;}
</style>