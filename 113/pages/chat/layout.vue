<template>
	<view class="app-container">
		<!-- 侧边栏 -->
		<view class="sidebar" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
			<view class="sidebar-header">
				<view class="toggle-btn" @click="isSidebarCollapsed = !isSidebarCollapsed">
					<text class="icon">≡</text>
				</view>
			</view>

			<view class="new-chat" @click="startNewChat">
				<text class="icon">+</text>
				<text class="text" v-if="!isSidebarCollapsed">新对话</text>
			</view>

			<scroll-view scroll-y class="history-list" v-if="!isSidebarCollapsed">
				<view 
					v-for="(chat, index) in historyList" 
					:key="chat.id"
					class="history-item"
					:class="{ active: currentChatIndex === index }"
					@click="switchChat(index)"
				>
					<text class="title">{{ chat.title || '新对话' }}</text>
					<text class="delete" @click.stop="deleteChat(index)">×</text>
				</view>
			</scroll-view>
		</view>

		<!-- 主内容区 -->
		<view class="main-content">
			<!-- 顶部栏 -->
			<view class="top-bar">
				<view class="model-selector">
					<text class="model-name">{{ currentModel }}</text>
				</view>
				
				<view class="user-info" @click="showUserMenu = !showUserMenu">
					<view class="avatar">{{ currentUser.username.charAt(0).toUpperCase() }}</view>
					<view class="user-popover" v-if="showUserMenu">
						<text class="name">{{ currentUser.username }}</text>
						<text class="email">{{ currentUser.email }}</text>
						<view class="divider"></view>
						<view class="menu-item logout" @click="handleLogout">退出登录</view>
					</view>
				</view>
			</view>

			<!-- 聊天视窗 -->
			<scroll-view 
				scroll-y 
				class="chat-view" 
				:scroll-top="scrollTop" 
				scroll-with-animation
			>
				<view class="chat-inner">
					<view v-if="currentMessages.length === 0" class="empty-state">
						<text class="welcome">你好，我是你的 AI 助手</text>
						<text class="hint">今天有什么可以帮你的吗？</text>
					</view>

					<view 
						v-for="(msg, index) in currentMessages" 
						:key="index"
						class="message-row"
						:class="msg.role"
					>
						<view class="bubble">{{ msg.content }}</view>
					</view>

					<view v-if="isTyping" class="message-row assistant">
						<view class="bubble typing">思考中...</view>
					</view>
					<view style="height: 100rpx;"></view>
				</view>
			</scroll-view>

			<!-- 输入区 -->
			<view class="input-area">
				<view class="input-wrapper">
					<textarea 
						v-model="inputText" 
						class="textarea" 
						auto-height 
						maxlength="-1"
						placeholder="输入消息..." 
						:disabled="isTyping"
						@confirm="sendMessage"
					/>
					<view 
						class="send-btn" 
						:class="{ active: inputText.trim() && !isTyping }"
						@click="sendMessage"
					>
						<text class="icon">↑</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { fetchAIResponse } from '@/services/aiService.js';

const isSidebarCollapsed = ref(false);
const showUserMenu = ref(false);
const currentUser = ref(uni.getStorageSync('current_user') || { username: 'G', email: '' });
const currentModel = ref('AI 智能模型');
const inputText = ref('');
const isTyping = ref(false);
const scrollTop = ref(0);
const currentChatIndex = ref(0);
const historyList = ref([]);

const currentMessages = computed(() => {
	if (historyList.value.length === 0) return [];
	return historyList.value[currentChatIndex.value]?.messages || [];
});

onMounted(() => {
	const saved = uni.getStorageSync('chat_history_v2');
	if (saved && saved.length > 0) {
		historyList.value = saved;
	} else {
		startNewChat();
	}
});

const saveHistory = () => {
	uni.setStorageSync('chat_history_v2', historyList.value);
};

const startNewChat = () => {
	historyList.value.unshift({
		id: Date.now(),
		title: '新对话',
		messages: []
	});
	currentChatIndex.value = 0;
	saveHistory();
};

const switchChat = (index) => {
	currentChatIndex.value = index;
	scrollToBottom();
};

const deleteChat = (index) => {
	historyList.value.splice(index, 1);
	if (historyList.value.length === 0) {
		startNewChat();
	} else {
		currentChatIndex.value = 0;
	}
	saveHistory();
};

const scrollToBottom = () => {
	nextTick(() => {
		setTimeout(() => {
			scrollTop.value += 1000 + Math.random();
		}, 100);
	});
};

const sendMessage = async () => {
	if (!inputText.value.trim() || isTyping.value) return;

	const content = inputText.value;
	inputText.value = '';
	
	const chat = historyList.value[currentChatIndex.value];
	if (chat.messages.length === 0) {
		chat.title = content.substring(0, 15);
	}
	
	chat.messages.push({ role: 'user', content });
	saveHistory();
	scrollToBottom();

	isTyping.value = true;
	try {
		const reply = await fetchAIResponse(chat.messages, currentModel.value);
		chat.messages.push({ role: 'assistant', content: reply });
		saveHistory();
	} catch (e) {
		chat.messages.push({ role: 'assistant', content: '服务响应异常，请重试' });
	} finally {
		isTyping.value = false;
		scrollToBottom();
	}
};

const handleLogout = () => {
	uni.removeStorageSync('current_user');
	uni.reLaunch({ url: '/pages/index/index' });
};
</script>

<style lang="scss" scoped>
.app-container {
	display: flex;
	height: 100vh;
	background-color: #ffffff;
}

.sidebar {
	width: 260px;
	background-color: #f9f9f9;
	border-right: 1px solid #eee;
	transition: width 0.3s;
	display: flex;
	flex-direction: column;
	&.sidebar-collapsed {
		width: 60px;
	}
	
	.sidebar-header {
		padding: 30rpx;
		.toggle-btn {
			font-size: 40rpx;
			color: #666;
		}
	}
	
	.new-chat {
		margin: 20rpx;
		padding: 20rpx;
		background-color: #fff;
		border: 1px solid #eee;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		.icon { margin-right: 10rpx; font-weight: bold; }
		.text { font-size: 28rpx; }
	}
	
	.history-list {
		flex: 1;
		padding: 20rpx;
		.history-item {
			padding: 20rpx;
			border-radius: 8rpx;
			margin-bottom: 10rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			&.active { background-color: #e6f7ff; color: #1890ff; }
			.title { font-size: 26rpx; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
			.delete { color: #ccc; margin-left: 10rpx; }
		}
	}
}

.main-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	position: relative;
}

.top-bar {
	height: 100rpx;
	padding: 0 40rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid #f0f0f0;
	.model-name { font-weight: 600; font-size: 30rpx; }
	.user-info {
		position: relative;
		.avatar {
			width: 64rpx; height: 64rpx; border-radius: 32rpx;
			background-color: #1890ff; color: #fff;
			display: flex; align-items: center; justify-content: center;
			font-weight: bold;
		}
		.user-popover {
			position: absolute; top: 80rpx; right: 0;
			width: 300rpx; background: #fff; box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
			padding: 20rpx; border-radius: 12rpx; z-index: 100;
			display: flex; flex-direction: column;
			.name { font-weight: bold; font-size: 28rpx; }
			.email { font-size: 22rpx; color: #999; margin-top: 4rpx; }
			.divider { height: 1px; background: #f0f0f0; margin: 16rpx 0; }
			.logout { color: #ff4d4f; font-size: 26rpx; }
		}
	}
}

.chat-view {
	flex: 1;
	.chat-inner {
		max-width: 1200rpx; margin: 0 auto; padding: 40rpx;
	}
	.empty-state {
		margin-top: 200rpx; text-align: center;
		.welcome { font-size: 40rpx; font-weight: bold; color: #333; display: block; }
		.hint { font-size: 28rpx; color: #999; margin-top: 20rpx; }
	}
	.message-row {
		display: flex; margin-bottom: 40rpx;
		&.user { justify-content: flex-end; .bubble { background-color: #1890ff; color: #fff; border-radius: 20rpx 20rpx 4rpx 20rpx; } }
		&.assistant { justify-content: flex-start; .bubble { background-color: #f0f2f5; color: #333; border-radius: 20rpx 20rpx 20rpx 4rpx; } }
		.bubble { max-width: 80%; padding: 20rpx 30rpx; font-size: 30rpx; line-height: 1.6; }
		.typing { font-style: italic; color: #999; }
	}
}

.input-area {
	padding: 40rpx;
	background-color: #fff;
	.input-wrapper {
		max-width: 1000rpx; margin: 0 auto;
		background-color: #f5f5f5; border-radius: 40rpx;
		padding: 20rpx 40rpx; display: flex; align-items: flex-end;
		.textarea { flex: 1; min-height: 40rpx; max-height: 300rpx; font-size: 30rpx; }
		.send-btn {
			width: 64rpx; height: 64rpx; border-radius: 32rpx;
			background-color: #ddd; color: #fff;
			display: flex; align-items: center; justify-content: center;
			margin-left: 20rpx; transition: 0.3s;
			&.active { background-color: #1890ff; }
			.icon { font-size: 32rpx; font-weight: bold; }
		}
	}
}
</style>
