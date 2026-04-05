<template>
	<view class="page-wrapper">
		<view class="container">
			<view class="header">
				<text class="title">加入我们</text>
				<text class="subtitle">创建一个新账号，开启智能之旅</text>
			</view>

			<view class="form-container">
				<view class="input-group">
					<text class="label">用户名</text>
					<input 
						type="text" 
						v-model="regData.username" 
						class="input"
						placeholder="设置您的用户名" 
						placeholder-class="placeholder"
					/>
				</view>

				<view class="input-group">
					<text class="label">邮箱</text>
					<input 
						type="text" 
						v-model="regData.email" 
						class="input"
						placeholder="您的常用邮箱" 
						placeholder-class="placeholder"
					/>
				</view>
				
				<view class="input-group">
					<text class="label">密码</text>
					<input 
						type="password" 
						v-model="regData.password" 
						class="input"
						placeholder="6-16 位安全密码" 
						placeholder-class="placeholder"
					/>
				</view>

				<view class="input-group">
					<text class="label">验证码</text>
					<view class="code-row">
						<input 
							type="text" 
							v-model="regData.code" 
							class="input code-input"
							placeholder="邮箱验证码" 
							placeholder-class="placeholder"
						/>
						<button 
							class="send-code-btn" 
							:disabled="countdown > 0 || codeLoading" 
							@click="handleSendCode"
						>
							{{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
						</button>
					</view>
				</view>
			</view>

			<button class="reg-btn" :loading="loading" @click="handleRegister">
				注 册
			</button>
			
			<view class="footer" @click="goBack">
				<text>已有账号？<text class="link">立即登录</text></text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { sendRegisterCode, registerUser } from '@/api/user.js';

const regData = ref({
	username: '',
	email: '',
	password: '',
	code: ''
});

const loading = ref(false);
const codeLoading = ref(false);
const countdown = ref(0);
let timer = null;

const clearTimer = () => {
	if (timer) {
		clearInterval(timer);
		timer = null;
	}
};

onUnmounted(clearTimer);

const startCountdown = () => {
	clearTimer();
	countdown.value = 60;
	timer = setInterval(() => {
		if (countdown.value <= 1) {
			clearTimer();
			countdown.value = 0;
			return;
		}
		countdown.value--;
	}, 1000);
};

const handleSendCode = async () => {
	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	if (!emailRegex.test(regData.value.email)) {
		return uni.showToast({ title: '邮箱格式不正确', icon: 'none' });
	}
	
	codeLoading.value = true;
	try {
		const res = await sendRegisterCode(regData.value.email);
		uni.showToast({ title: res?.msg || '验证码已发送', icon: 'success' });
		startCountdown();
	} catch (e) {}
	finally {
		codeLoading.value = false;
	}
};

const handleRegister = async () => {
	const { username, email, password, code } = regData.value;
	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

	if (!username) return uni.showToast({ title: '请输入用户名', icon: 'none' });
	if (!emailRegex.test(email)) return uni.showToast({ title: '邮箱格式不正确', icon: 'none' });
	if (password.length < 6) return uni.showToast({ title: '密码至少 6 位', icon: 'none' });
	if (!code) return uni.showToast({ title: '请输入验证码', icon: 'none' });

	loading.value = true;
	try {
		await registerUser(regData.value);
		uni.showToast({ title: '注册成功', icon: 'success' });
		setTimeout(() => {
			uni.navigateBack();
		}, 1500);
	} catch (e) {}
	finally {
		loading.value = false;
	}
};

const goBack = () => uni.navigateBack();
</script>

<style lang="scss" scoped>
.page-wrapper {
	background-color: #f5f7fa;
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40rpx 0;
}

.container {
	width: 90%;
	max-width: 800rpx;
	padding: 64rpx;
	background-color: #ffffff;
	border-radius: 24rpx;
	box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.05);
	display: flex;
	flex-direction: column;
}

.header {
	margin-bottom: 80rpx;
	.title {
		font-size: 56rpx;
		font-weight: 700;
		color: #1a1a1a;
		display: block;
		margin-bottom: 16rpx;
	}
	.subtitle {
		font-size: 26rpx;
		color: #999;
		display: block;
	}
}

.form-container {
	.input-group {
		margin-bottom: 40rpx;
		.label {
			font-size: 24rpx;
			color: #666;
			margin-bottom: 12rpx;
			display: block;
			font-weight: 500;
		}
		.input {
			height: 90rpx;
			border-bottom: 1px solid #f0f0f0;
			font-size: 32rpx;
			color: #1a1a1a;
			width: 100%;
		}
		.placeholder {
			color: #ccc;
		}
		.code-row {
			display: flex;
			align-items: center;
			.code-input {
				flex: 1;
			}
			.send-code-btn {
				margin-left: 24rpx;
				height: 72rpx;
				line-height: 72rpx;
				padding: 0 32rpx;
				font-size: 24rpx;
				background-color: #f5f7fa;
				color: #409eff;
				border-radius: 36rpx;
				&::after { border: none; }
				&:disabled {
					color: #999;
					background-color: #f8f8f8;
				}
			}
		}
	}
}

.reg-btn {
	margin-top: 60rpx;
	height: 100rpx;
	line-height: 100rpx;
	background: linear-gradient(135deg, #409eff, #007aff);
	color: #fff;
	font-size: 32rpx;
	font-weight: 600;
	border-radius: 50rpx;
	box-shadow: 0 8rpx 20rpx rgba(0, 122, 255, 0.2);
	&::after { border: none; }
}

.footer {
	margin-top: 64rpx;
	text-align: center;
	font-size: 26rpx;
	color: #999;
	.link {
		color: #409eff;
		font-weight: 500;
		margin-left: 8rpx;
	}
}
</style>
