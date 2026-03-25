<template>
	<view class="app-container" @click="closeAllMenus">
		<view class="sidebar" :class="{ 'sidebar-collapsed': isSidebarCollapsed }" @click.stop>
			<view class="sidebar-header">
				<view class="menu-icon" @click="isSidebarCollapsed = !isSidebarCollapsed">≡</view>
			</view>

			<view class="new-chat-pill" @click="startNewChat">
				<text class="edit-icon">✎</text>
				<text class="pill-text" v-if="!isSidebarCollapsed">发起新对话</text>
			</view>

			<scroll-view scroll-y class="history-area" v-if="!isSidebarCollapsed">
				<view class="history-label">最近对话</view>
				<view 
					v-for="(item, index) in historyList" 
					:key="item.id" 
					:class="['history-item', { active: currentChatIndex === index }]"
					@click="switchChat(index)"
				>
					<text class="item-title">{{ item.title || '新对话' }}</text>
					<text class="item-del" @click.stop="confirmDelete(index)">×</text>
				</view>
			</scroll-view>
		</view>

		<view class="main-stage">
			<view class="top-bar">
				<view class="model-dropdown-container">
					<view class="model-trigger" @click.stop="aiMenuVisible = !aiMenuVisible">
						<text class="model-name">{{ currentModel }}</text>
						<text class="arrow-icon" :class="{ rotate: aiMenuVisible }">▼</text>
					</view>
					
					<view class="dropdown-list" v-if="aiMenuVisible">
						<view 
							v-for="m in modelOptions" :key="m" 
							class="dropdown-item" 
							:class="{ selected: currentModel === m }"
							@click="selectModel(m)"
						>
							{{ m }}
						</view>
					</view>
				</view>
				
				<view class="user-container">
					<view class="user-avatar" @click.stop="userMenuVisible = !userMenuVisible">
						{{ currentUser.username.charAt(0).toUpperCase() }}
					</view>
					
					<view class="user-card" v-if="userMenuVisible" @click.stop>
						<view class="card-info">
							<text class="info-name">{{ currentUser.username }}</text>
							<text class="info-email">{{ currentUser.email }}</text>
						</view>
						<view class="card-divider"></view>
						<view class="card-action" @click="handleLogout">
							<text class="logout-text">退出登录</text>
						</view>
					</view>
				</view>
			</view>

			<scroll-view scroll-y class="chat-viewport" :scroll-top="scrollTop" scroll-with-animation>
				<view class="chat-inner">
					<view v-if="currentMessages.length === 0" class="welcome-section">
						<text class="welcome-text">你好，{{ currentUser.username }}</text>
						<text class="welcome-sub">准备好开始新的探索了吗？</text>
					</view>

					<view v-for="(msg, index) in currentMessages" :key="index" :class="['msg-row', msg.role]">
						<view class="msg-bubble">{{ msg.content }}</view>
					</view>

					<view v-if="isTyping" class="msg-row assistant">
						<view class="typing-status">{{ currentModel }} 正在思考...</view>
					</view>
					<view style="height: 160px;"></view>
				</view>
			</scroll-view>

			<view class="input-area">
				<view class="input-box">
					<view class="plus-btn" @click="handleUpload">➕</view>
					<textarea 
						class="main-input" 
						v-model="inputText" 
						placeholder="在这里输入..." 
						auto-height 
						maxlength="-1"
						:disabled="isTyping"
						@confirm="sendMessage" 
					/>
					<view class="send-btn" :class="{ active: inputText.trim() && !isTyping }" @click="sendMessage">↑</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { fetchAIResponse } from '@/services/aiService.js';

export default {
	data() {
		return {
			isSidebarCollapsed: false,
			aiMenuVisible: false,
			userMenuVisible: false,
			// 获取真实登录用户信息
			currentUser: uni.getStorageSync('current_user') || { username: 'Guest', email: 'guest@example.com' },
			currentModel: '豆包 Pro',
			modelOptions: ['豆包 Pro', 'ChatGPT', 'Gemini', 'DeepSeek'],
			inputText: '',
			scrollTop: 0,
			isTyping: false,
			currentChatIndex: 0,
			historyList: []
		};
	},
	computed: {
		currentMessages() { 
			return (this.historyList.length > 0 && this.historyList[this.currentChatIndex]) 
				? this.historyList[this.currentChatIndex].messages : []; 
		}
	},
	onLoad() {
		this.initHistory();
	},
	methods: {
		// --- 历史记录持久化逻辑 ---
		initHistory() {
			const saved = uni.getStorageSync('chat_history');
			if (saved && saved.length > 0) {
				this.historyList = saved;
			} else {
				this.startNewChat();
			}
		},
		saveToLocal() {
			uni.setStorageSync('chat_history', this.historyList);
		},
		switchChat(index) {
			this.currentChatIndex = index;
			this.scrollToBottom();
		},
		startNewChat() {
			const newChat = { id: Date.now(), title: '新对话', messages: [] };
			this.historyList.unshift(newChat);
			this.currentChatIndex = 0;
			if (this.isSidebarCollapsed) this.isSidebarCollapsed = false;
			this.saveToLocal();
		},
		confirmDelete(index) {
			uni.showModal({
				title: '删除对话',
				content: '确定要删除这段历史记录吗？',
				success: (res) => {
					if (res.confirm) {
						this.historyList.splice(index, 1);
						if (this.historyList.length === 0) this.startNewChat();
						else this.currentChatIndex = 0;
						this.saveToLocal();
					}
				}
			});
		},

		// --- 核心对话逻辑 ---
		async sendMessage() {
			if (!this.inputText.trim() || this.isTyping) return;
			
			const query = this.inputText;
			this.inputText = '';
			const session = this.historyList[this.currentChatIndex];
			
			// 自动生成标题
			if (session.messages.length === 0) {
				session.title = query.substring(0, 12);
			}
			
			session.messages.push({ role: 'user', content: query });
			this.saveToLocal();
			this.scrollToBottom();
			
			this.isTyping = true;
			try {
				// 与后端 service 结合
				const res = await fetchAIResponse(session.messages, this.currentModel);
				session.messages.push({ role: 'assistant', content: res });
				this.saveToLocal();
			} catch (e) {
				session.messages.push({ role: 'assistant', content: '服务连接失败，请检查后端 API' });
			} finally {
				this.isTyping = false;
				this.scrollToBottom();
			}
		},

		// --- UI 交互逻辑 ---
		selectModel(m) {
			this.currentModel = m;
			this.aiMenuVisible = false;
		},
		closeAllMenus() {
			this.aiMenuVisible = false;
			this.userMenuVisible = false;
		},
		handleLogout() {
			uni.showLoading({ title: '正在退出...' });
			uni.removeStorageSync('current_user');
			setTimeout(() => {
				uni.hideLoading();
				uni.reLaunch({ url: '/pages/index/index' });
			}, 800);
		},
		handleUpload() {
			uni.showToast({ title: '功能开发中', icon: 'none' });
		},
		scrollToBottom() {
			this.$nextTick(() => {
				setTimeout(() => {
					this.scrollTop = this.scrollTop + 1000 + Math.random();
				}, 100);
			});
		}
	}
};
</script>

<style lang="scss">
.app-container { display: flex; height: 100vh; background: #fff; overflow: hidden; }

/* 侧边栏：紧凑美观 */
.sidebar {
	width: 260px; background: #f0f4f9; transition: all 0.3s ease; display: flex; flex-direction: column; border-right: 1px solid #e5e7eb;
	&.sidebar-collapsed { width: 68px; }
	.sidebar-header { padding: 20px; .menu-icon { font-size: 24px; cursor: pointer; color: #444; } }
	.new-chat-pill {
		display: flex; align-items: center; width: fit-content; margin: 0 12px 10px;
		padding: 10px 16px; background: #dde3ea; border-radius: 24px; cursor: pointer;
		&:hover { background: #d3d9e0; }
		.edit-icon { font-size: 18px; margin-right: 10px; }
		.pill-text { font-size: 14px; font-weight: 500; white-space: nowrap; }
	}
	.history-area { 
		flex: 1; padding: 10px;
		.history-label { font-size: 12px; color: #5f6368; padding: 10px; font-weight: bold; }
		.history-item {
			display: flex; justify-content: space-between; align-items: center;
			padding: 12px 15px; border-radius: 12px; margin-bottom: 4px; cursor: pointer;
			&.active { background: #d3e3fd; color: #0b57d0; }
			&:hover:not(.active) { background: #e9eef6; }
			.item-title { font-size: 14px; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
			.item-del { font-size: 18px; color: #999; padding-left: 5px; &:hover { color: #d93025; } }
		}
	}
}

/* 主操作区 */
.main-stage {
	flex: 1; display: flex; flex-direction: column; position: relative;
	.top-bar {
		padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; z-index: 100;
		.model-trigger {
			display: flex; align-items: center; padding: 8px 12px; border-radius: 8px; cursor: pointer;
			&:hover { background: #f1f3f4; }
			.model-name { font-size: 18px; font-weight: 600; color: #1f1f1f; }
			.arrow-icon { font-size: 10px; margin-left: 8px; transition: 0.3s; &.rotate { transform: rotate(180deg); } }
		}
		.dropdown-list {
			position: absolute; top: 55px; left: 24px; width: 180px; background: #fff; 
			box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 12px; padding: 6px 0;
			.dropdown-item {
				padding: 12px 16px; font-size: 14px;
				&:hover { background: #f5f5f5; }
				&.selected { color: #0b57d0; font-weight: bold; background: #f0f7ff; }
			}
		}
		.user-container {
			position: relative;
			.user-avatar { 
				width: 34px; height: 34px; background: #6baf50; color: #fff; 
				border-radius: 50%; display: flex; align-items: center; justify-content: center; 
				font-weight: bold; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.1);
			}
			.user-card {
				position: absolute; top: 45px; right: 0; width: 220px; background: #fff; 
				box-shadow: 0 8px 30px rgba(0,0,0,0.15); border-radius: 16px; padding: 16px;
				.info-name { display: block; font-size: 16px; font-weight: bold; color: #1f1f1f; }
				.info-email { display: block; font-size: 13px; color: #5f6368; margin-top: 4px; }
				.card-divider { height: 1px; background: #eee; margin: 15px 0; }
				.card-action { 
					padding: 10px; text-align: center; border-radius: 8px; cursor: pointer;
					&:hover { background: #fff0f0; }
					.logout-text { color: #d93025; font-size: 14px; font-weight: 500; }
				}
			}
		}
	}
}

/* 聊天内容区：优化滚动和气泡显示 */
.chat-viewport {
	flex: 1; 
	.chat-inner { max-width: 850px; margin: 0 auto; padding: 0 20px; }
	.welcome-section {
		margin-top: 12vh; text-align: center;
		.welcome-text { display: block; font-size: 42px; font-weight: bold; color: #4285f4; margin-bottom: 10px; }
		.welcome-sub { display: block; font-size: 42px; font-weight: bold; color: #c4c7c5; }
	}
	.msg-row {
		display: flex; margin-bottom: 30px;
		&.user { justify-content: flex-end; .msg-bubble { background: #f0f4f9; border-radius: 20px 20px 4px 20px; } }
		&.assistant { justify-content: flex-start; .msg-bubble { background: transparent; } }
		.msg-bubble { max-width: 85%; padding: 12px 20px; font-size: 16px; line-height: 1.6; color: #1f1f1f; }
		.typing-status { font-size: 14px; color: #999; font-style: italic; }
	}
}

/* 底部输入框：确保露出且美观 */
.input-area {
	padding: 0 20px 30px; display: flex; justify-content: center; background: linear-gradient(to top, #fff 80%, rgba(255,255,255,0));
	.input-box {
		width: 100%; max-width: 800px; background: #f0f4f9; border-radius: 32px; 
		display: flex; align-items: flex-end; padding: 10px 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);
		.plus-btn { padding: 8px; font-size: 22px; color: #5f6368; cursor: pointer; }
		.main-input { flex: 1; padding: 10px 12px; font-size: 16px; min-height: 24px; max-height: 200px; }
		.send-btn {
			width: 40px; height: 40px; background: #e2e8f0; border-radius: 50%; 
			display: flex; align-items: center; justify-content: center; margin-left: 10px; transition: 0.3s;
			&.active { background: #0b57d0; color: #fff; transform: scale(1.05); cursor: pointer; }
		}
	}
}
</style>