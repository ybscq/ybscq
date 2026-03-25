<template>
	<view class="container">
		<view class="welcome-section">
			<text class="main-title">找回密码</text>
			<text class="sub-title">请输入您注册时的邮箱以重置密码</text>
		</view>

		<view class="input-content">
			<view class="input-item">
				<text class="label">注册邮箱</text>
				<input type="text" v-model="email" placeholder="请输入您的邮箱地址" />
			</view>
			
			<view class="input-item">
				<text class="label">设置新密码</text>
				<input type="password" v-model="newPassword" placeholder="请输入6-16位新密码" />
			</view>
			
			<view class="input-item">
				<text class="label">确认新密码</text>
				<input type="password" v-model="confirmPassword" placeholder="请再次输入新密码" />
			</view>
		</view>

		<button class="confirm-btn" @click="handleReset">重 置 密 码</button>
		
		<view class="footer" @click="goBack">
			<text>想起密码了？立即登录</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			email: '',
			newPassword: '',
			confirmPassword: ''
		};
	},
	methods: {
		handleReset() {
			const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
			
			// 1. 基础校验
			if (!emailRegex.test(this.email)) {
				return uni.showToast({ title: '邮箱格式不正确', icon: 'none' });
			}
			if (this.newPassword.length < 6) {
				return uni.showToast({ title: '新密码不能少于6位', icon: 'none' });
			}
			if (this.newPassword !== this.confirmPassword) {
				return uni.showToast({ title: '两次输入不一致', icon: 'none' });
			}

			// 2. 读取本地用户名单
			let userList = uni.getStorageSync('user_list') || [];
			
			// 3. 查找该邮箱是否存在
			const userIndex = userList.findIndex(item => item.email === this.email);

			if (userIndex === -1) {
				return uni.showToast({ title: '该邮箱尚未注册', icon: 'none' });
			}

			// 4. 更新密码逻辑
			userList[userIndex].password = this.newPassword;

			// 5. 存回本地并提示
			try {
				uni.setStorageSync('user_list', userList);
				uni.showModal({
					title: '重置成功',
					content: '您的密码已更新，请前往登录',
					showCancel: false,
					success: () => {
						this.goBack();
					}
				});
			} catch (e) {
				uni.showToast({ title: '系统错误，请重试', icon: 'none' });
			}
		},
		
		goBack() {
			uni.redirectTo({
				url: '/pages/index/index'
			});
		}
	}
};
</script>

<style lang="scss">
/* 样式保持不变，复用之前的即可 */
.container { padding: 0 60rpx; background: #fff; min-height: 100vh; }
.welcome-section { padding: 120rpx 0 80rpx; 
	.main-title { font-size: 60rpx; color: #333; font-weight: bold; }
	.sub-title { font-size: 28rpx; color: #999; margin-top: 10rpx; }
}
.input-content {
	.input-item { display: flex; flex-direction: column; padding: 20rpx 0; border-bottom: 1rpx solid #eee; margin-bottom: 20rpx;
		.label { font-size: 26rpx; color: #666; }
		input { height: 60rpx; font-size: 30rpx; width: 100%; }
	}
	.code-row { flex-direction: row; align-items: flex-end;
		.flex-1 { flex: 1; }
		.code-btn { font-size: 24rpx; background: #f5f5f5; color: #666; border-radius: 10rpx; height: 60rpx; line-height: 60rpx; margin-left: 20rpx; padding: 0 20rpx;
			&:after { border: none; }
		}
	}
}
.confirm-btn { width: 100%; height: 88rpx; line-height: 88rpx; border-radius: 44rpx; margin-top: 60rpx; background: #333; color: #fff; }
</style>