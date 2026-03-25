/**
 * AI 服务请求封装 (支持多模型路由)
 * @param {Array} messages - 对话历史数组，格式如 [{role: "user", content: "你好"}]
 * @param {String} modelName - 当前选中的模型名称，如 "ChatGPT 4.0" 或 "Gemini 1.5 Pro"
 */
export const fetchAIResponse = (messages, modelName) => {
	return new Promise((resolve, reject) => {
		
		// ⚠️ 同学注意：请在这里填入你部署的后端统一 API 路由地址
		const apiUrl = 'https://你的后端域名.com/api/chat'; 

		uni.request({
			url: apiUrl,
			method: 'POST',
			header: {
				'Content-Type': 'application/json'
				// 'Authorization': 'Bearer ' + uni.getStorageSync('token') // 如果有 Token 校验请放开
			},
			data: {
				model: modelName,    // 后端需根据这个字段决定去调用哪家大厂的 API
				messages: messages,  // 完整的对话上下文
			},
			success: (res) => {
				// ⚠️ 同学注意：这里假设你的后端返回格式是 { code: 200, data: { content: "AI的回复" } }
				// 请根据你实际的 JSON 结构修改 res.data.data.content
				if (res.statusCode === 200 && res.data) {
					// 兼容不同的返回层级，具体以同学后端的实际结构为准
					const replyText = res.data.content || (res.data.data && res.data.data.content) || res.data;
					resolve(replyText);
				} else {
					reject('解析失败，请检查后端返回的 JSON 格式');
				}
			},
			fail: (err) => {
				reject(err);
			}
		});
	});
};