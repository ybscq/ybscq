if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$4 = {
    data() {
      return {
        formData: { username: "", password: "" },
        loading: false
      };
    },
    methods: {
      validate() {
        if (!this.formData.username) {
          uni.showToast({ title: "请输入账号", icon: "none" });
          return false;
        }
        if (this.formData.password.length < 6) {
          uni.showToast({ title: "密码长度不足", icon: "none" });
          return false;
        }
        return true;
      },
      doLogin() {
        if (!this.validate())
          return;
        this.loading = true;
        setTimeout(() => {
          const userList = uni.getStorageSync("user_list") || [];
          const foundUser = userList.find(
            (item) => item.email === this.formData.username || item.username === this.formData.username
          );
          if (!foundUser) {
            this.loading = false;
            return uni.showToast({ title: "账号不存在", icon: "none" });
          }
          if (foundUser.password !== this.formData.password) {
            this.loading = false;
            return uni.showToast({ title: "密码错误", icon: "none" });
          }
          this.loading = false;
          uni.showToast({ title: "登录成功" });
          uni.setStorageSync("current_user", foundUser);
          setTimeout(() => {
            uni.reLaunch({ url: "/pages/chat/layout" });
          }, 1e3);
        }, 800);
      },
      toForget() {
        uni.navigateTo({ url: "/pages/forget/forget" });
      },
      toRegister() {
        uni.navigateTo({ url: "/pages/register/register" });
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "welcome-section" }, [
        vue.createElementVNode("text", { class: "main-title" }, "HELLO!"),
        vue.createElementVNode("text", { class: "sub-title" }, "欢迎登录您的账户")
      ]),
      vue.createElementVNode("view", { class: "input-content" }, [
        vue.createElementVNode("view", { class: "input-item" }, [
          vue.createElementVNode("text", { class: "label" }, "账号"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "text",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.formData.username = $event),
              placeholder: "请输入邮箱/用户名"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.formData.username]
          ])
        ]),
        vue.createElementVNode("view", { class: "input-item" }, [
          vue.createElementVNode("text", { class: "label" }, "密码"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "password",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.formData.password = $event),
              placeholder: "请输入密码",
              onConfirm: _cache[2] || (_cache[2] = (...args) => $options.doLogin && $options.doLogin(...args))
            },
            null,
            544
            /* NEED_HYDRATION, NEED_PATCH */
          ), [
            [vue.vModelText, $data.formData.password]
          ])
        ])
      ]),
      vue.createElementVNode("button", {
        class: "confirm-btn",
        loading: $data.loading,
        onClick: _cache[3] || (_cache[3] = (...args) => $options.doLogin && $options.doLogin(...args))
      }, "登 录", 8, ["loading"]),
      vue.createElementVNode("view", { class: "forget-section" }, [
        vue.createElementVNode("text", {
          onClick: _cache[4] || (_cache[4] = (...args) => $options.toForget && $options.toForget(...args))
        }, "忘记密码?"),
        vue.createElementVNode("text", {
          class: "register",
          onClick: _cache[5] || (_cache[5] = (...args) => $options.toRegister && $options.toRegister(...args))
        }, "立即注册账号")
      ])
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "E:/hub/113/pages/index/index.vue"]]);
  const _sfc_main$3 = {
    data() {
      return { regData: { username: "", email: "", password: "" } };
    },
    methods: {
      clearTestData() {
        uni.clearStorageSync();
        uni.showToast({ title: "数据已清空", icon: "success" });
      },
      handleRegister() {
        const { username, email, password } = this.regData;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!username)
          return uni.showToast({ title: "请输入用户名", icon: "none" });
        if (!emailRegex.test(email))
          return uni.showToast({ title: "邮箱格式不正确", icon: "none" });
        if (password.length < 6)
          return uni.showToast({ title: "密码不能少于6位", icon: "none" });
        let userList = uni.getStorageSync("user_list") || [];
        if (userList.some((item) => item.email === email)) {
          return uni.showToast({ title: "该邮箱已被注册", icon: "none" });
        }
        userList.push({ username, email, password });
        uni.setStorageSync("user_list", userList);
        uni.showToast({ title: "注册成功", icon: "success", mask: true });
        setTimeout(() => {
          this.goBack();
        }, 1500);
      },
      goBack() {
        uni.redirectTo({ url: "/pages/index/index" });
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "welcome-section" }, [
        vue.createElementVNode("text", { class: "main-title" }, "JOIN US"),
        vue.createElementVNode("text", { class: "sub-title" }, "创建一个新账号")
      ]),
      vue.createElementVNode("view", { class: "input-content" }, [
        vue.createElementVNode("view", { class: "input-item" }, [
          vue.createElementVNode("text", { class: "label" }, "账号"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "text",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.regData.username = $event),
              placeholder: "请设置用户名"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.regData.username]
          ])
        ]),
        vue.createElementVNode("view", { class: "input-item" }, [
          vue.createElementVNode("text", { class: "label" }, "邮箱"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "text",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.regData.email = $event),
              placeholder: "请输入邮箱地址"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.regData.email]
          ])
        ]),
        vue.createElementVNode("view", { class: "input-item" }, [
          vue.createElementVNode("text", { class: "label" }, "密码"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "password",
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.regData.password = $event),
              placeholder: "请设置6-16位密码"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.regData.password]
          ])
        ])
      ]),
      vue.createElementVNode("button", {
        class: "confirm-btn",
        onClick: _cache[3] || (_cache[3] = (...args) => $options.handleRegister && $options.handleRegister(...args))
      }, "注 册"),
      vue.createElementVNode("view", {
        class: "footer",
        onClick: _cache[4] || (_cache[4] = (...args) => $options.goBack && $options.goBack(...args))
      }, [
        vue.createElementVNode("text", null, "已有账号？立即登录")
      ]),
      vue.createElementVNode("button", {
        onClick: _cache[5] || (_cache[5] = (...args) => $options.clearTestData && $options.clearTestData(...args)),
        class: "clear-btn"
      }, "清空测试数据")
    ]);
  }
  const PagesRegisterRegister = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "E:/hub/113/pages/register/register.vue"]]);
  const _sfc_main$2 = {
    data() {
      return { email: "", newPassword: "", confirmPassword: "" };
    },
    methods: {
      handleReset() {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(this.email))
          return uni.showToast({ title: "邮箱格式不正确", icon: "none" });
        if (this.newPassword.length < 6)
          return uni.showToast({ title: "新密码不能少于6位", icon: "none" });
        if (this.newPassword !== this.confirmPassword)
          return uni.showToast({ title: "两次输入不一致", icon: "none" });
        let userList = uni.getStorageSync("user_list") || [];
        const userIndex = userList.findIndex((item) => item.email === this.email);
        if (userIndex === -1)
          return uni.showToast({ title: "该邮箱尚未注册", icon: "none" });
        userList[userIndex].password = this.newPassword;
        uni.setStorageSync("user_list", userList);
        uni.showModal({
          title: "重置成功",
          content: "您的密码已更新，请前往登录",
          showCancel: false,
          success: () => {
            this.goBack();
          }
        });
      },
      goBack() {
        uni.redirectTo({ url: "/pages/index/index" });
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "welcome-section" }, [
        vue.createElementVNode("text", { class: "main-title" }, "找回密码"),
        vue.createElementVNode("text", { class: "sub-title" }, "请输入您注册时的邮箱以重置密码")
      ]),
      vue.createElementVNode("view", { class: "input-content" }, [
        vue.createElementVNode("view", { class: "input-item" }, [
          vue.createElementVNode("text", { class: "label" }, "注册邮箱"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "text",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.email = $event),
              placeholder: "请输入您的邮箱地址"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.email]
          ])
        ]),
        vue.createElementVNode("view", { class: "input-item" }, [
          vue.createElementVNode("text", { class: "label" }, "设置新密码"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "password",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.newPassword = $event),
              placeholder: "请输入6-16位新密码"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.newPassword]
          ])
        ]),
        vue.createElementVNode("view", { class: "input-item" }, [
          vue.createElementVNode("text", { class: "label" }, "确认新密码"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "password",
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.confirmPassword = $event),
              placeholder: "请再次输入新密码"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.confirmPassword]
          ])
        ])
      ]),
      vue.createElementVNode("button", {
        class: "confirm-btn",
        onClick: _cache[3] || (_cache[3] = (...args) => $options.handleReset && $options.handleReset(...args))
      }, "重 置 密 码"),
      vue.createElementVNode("view", {
        class: "footer",
        onClick: _cache[4] || (_cache[4] = (...args) => $options.goBack && $options.goBack(...args))
      }, [
        vue.createElementVNode("text", null, "想起密码了？立即登录")
      ])
    ]);
  }
  const PagesForgetForget = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "E:/hub/113/pages/forget/forget.vue"]]);
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const fetchAIResponse = (messages, model) => {
    return new Promise((resolve, reject) => {
      formatAppLog("log", "at services/aiService.js:6", `正在请求模型: ${model}, 上下文长度: ${messages.length}`);
      setTimeout(() => {
        resolve(`[${model}] 已收到你的消息。这是模拟回复内容。`);
      }, 1e3);
    });
  };
  const _sfc_main$1 = {
    data() {
      return {
        isSidebarCollapsed: false,
        currentUser: {},
        currentModel: "豆包 Pro",
        // 默认模型
        // 【新增】可选模型列表
        modelOptions: ["豆包 Pro", "DeepSeek-V3", "GPT-4o", "Gemini"],
        inputText: "",
        scrollTop: 0,
        currentChatIndex: 0,
        historyList: [],
        isTyping: false
      };
    },
    computed: {
      currentMessages() {
        if (this.historyList.length === 0 || this.currentChatIndex === -1)
          return [];
        return this.historyList[this.currentChatIndex].messages;
      }
    },
    onLoad() {
      this.currentUser = uni.getStorageSync("current_user") || {};
      if (!this.currentUser.username) {
        uni.reLaunch({ url: "/pages/index/index" });
        return;
      }
      this.loadHistory();
    },
    methods: {
      // 【新增】切换模型的弹出菜单
      selectModel() {
        uni.showActionSheet({
          itemList: this.modelOptions,
          success: (res) => {
            this.currentModel = this.modelOptions[res.tapIndex];
            uni.showToast({
              title: `已切换至 ${this.currentModel}`,
              icon: "none"
            });
          }
        });
      },
      loadHistory() {
        const storageKey = `chat_history_${this.currentUser.username}`;
        const localData = uni.getStorageSync(storageKey);
        if (localData && localData.length > 0) {
          this.historyList = localData;
          this.currentChatIndex = 0;
        } else {
          this.initDefaultChat();
        }
      },
      saveHistory() {
        const storageKey = `chat_history_${this.currentUser.username}`;
        uni.setStorageSync(storageKey, this.historyList);
      },
      initDefaultChat() {
        this.historyList = [{ id: Date.now(), title: "新对话", preview: "有什么我可以帮你的？", messages: [] }];
        this.currentChatIndex = 0;
      },
      toggleSidebar() {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
      },
      startNewChat() {
        if (this.historyList.length > 0 && this.historyList[0].messages.length === 0) {
          this.currentChatIndex = 0;
          return;
        }
        this.historyList.unshift({ id: Date.now(), title: "新对话", preview: "等待输入...", messages: [] });
        this.currentChatIndex = 0;
        this.saveHistory();
      },
      switchChat(index) {
        this.currentChatIndex = index;
        this.scrollToBottom();
      },
      deleteChat(index) {
        uni.showModal({
          title: "删除对话",
          content: "确定要删除吗？",
          success: (res) => {
            if (res.confirm) {
              this.historyList.splice(index, 1);
              if (this.historyList.length === 0)
                this.initDefaultChat();
              else
                this.currentChatIndex = Math.min(this.currentChatIndex, this.historyList.length - 1);
              this.saveHistory();
            }
          }
        });
      },
      async sendMessage() {
        if (!this.inputText.trim() || this.isTyping)
          return;
        const query = this.inputText;
        this.inputText = "";
        const currentSession = this.historyList[this.currentChatIndex];
        if (currentSession.messages.length === 0) {
          currentSession.title = query.substring(0, 10) + (query.length > 10 ? "..." : "");
        }
        currentSession.preview = "你: " + query.substring(0, 12);
        currentSession.messages.push({ role: "user", content: query });
        this.saveHistory();
        this.scrollToBottom();
        this.isTyping = true;
        try {
          const aiReply = await fetchAIResponse(currentSession.messages, this.currentModel);
          currentSession.messages.push({ role: "assistant", content: aiReply });
          currentSession.preview = "AI: " + aiReply.substring(0, 12);
        } catch (error) {
          uni.showToast({ title: "连接 AI 失败", icon: "none" });
          currentSession.messages.push({ role: "assistant", content: "⚠️ 连接失败。" });
        } finally {
          this.isTyping = false;
          this.saveHistory();
          this.scrollToBottom();
        }
      },
      scrollToBottom() {
        this.$nextTick(() => {
          setTimeout(() => {
            this.scrollTop += 1e4;
          }, 100);
        });
      },
      handleLogout() {
        uni.showModal({
          title: "提示",
          content: "确定退出登录？",
          success: (res) => {
            if (res.confirm) {
              uni.removeStorageSync("current_user");
              uni.reLaunch({ url: "/pages/index/index" });
            }
          }
        });
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "app-layout" }, [
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["sidebar", { "collapsed": $data.isSidebarCollapsed }])
        },
        [
          vue.createElementVNode("view", { class: "sidebar-header" }, [
            vue.createElementVNode("view", {
              class: "menu-btn",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.toggleSidebar && $options.toggleSidebar(...args))
            }, "☰"),
            !$data.isSidebarCollapsed ? (vue.openBlock(), vue.createElementBlock("text", {
              key: 0,
              class: "logo-text"
            }, "AI 助手")) : vue.createCommentVNode("v-if", true)
          ]),
          !$data.isSidebarCollapsed ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "new-chat-btn",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.startNewChat && $options.startNewChat(...args))
          }, [
            vue.createElementVNode("text", { class: "icon" }, "➕"),
            vue.createElementVNode("text", null, "发起新对话")
          ])) : vue.createCommentVNode("v-if", true),
          !$data.isSidebarCollapsed ? (vue.openBlock(), vue.createElementBlock("scroll-view", {
            key: 1,
            "scroll-y": "",
            class: "history-list"
          }, [
            vue.createElementVNode("view", { class: "list-title" }, "近期对话"),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.historyList, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item.id,
                  class: vue.normalizeClass(["history-item", { active: $data.currentChatIndex === index }]),
                  onClick: ($event) => $options.switchChat(index)
                }, [
                  vue.createElementVNode("text", { class: "icon" }, "💬"),
                  vue.createElementVNode("view", { class: "item-info" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "item-title" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "item-preview" },
                      vue.toDisplayString(item.preview),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", {
                    class: "delete-btn",
                    onClick: vue.withModifiers(($event) => $options.deleteChat(index), ["stop"])
                  }, "×", 8, ["onClick"])
                ], 10, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : vue.createCommentVNode("v-if", true)
        ],
        2
        /* CLASS */
      ),
      vue.createElementVNode("view", { class: "main-content" }, [
        vue.createElementVNode("view", { class: "main-header" }, [
          vue.createElementVNode("view", {
            class: "model-selector",
            onClick: _cache[2] || (_cache[2] = (...args) => $options.selectModel && $options.selectModel(...args))
          }, [
            vue.createElementVNode(
              "text",
              { class: "title" },
              vue.toDisplayString($data.currentModel),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "arrow" }, "▼")
          ]),
          vue.createElementVNode("view", { class: "header-actions" }, [
            vue.createElementVNode(
              "view",
              {
                class: "user-avatar",
                onClick: _cache[3] || (_cache[3] = (...args) => $options.handleLogout && $options.handleLogout(...args))
              },
              vue.toDisplayString($data.currentUser.username ? $data.currentUser.username.charAt(0).toUpperCase() : "U"),
              1
              /* TEXT */
            )
          ])
        ]),
        vue.createElementVNode("scroll-view", {
          "scroll-y": "",
          class: "chat-stream",
          "scroll-top": $data.scrollTop,
          "scroll-with-animation": ""
        }, [
          vue.createElementVNode("view", { class: "message-wrapper" }, [
            $options.currentMessages.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "empty-state"
            }, [
              vue.createElementVNode(
                "text",
                { class: "greeting" },
                "你好，" + vue.toDisplayString($data.currentUser.username || "朋友"),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "sub-greeting" },
                "正在使用 " + vue.toDisplayString($data.currentModel) + " 为您服务",
                1
                /* TEXT */
              )
            ])) : vue.createCommentVNode("v-if", true),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($options.currentMessages, (msg, index) => {
                return vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: index,
                    class: vue.normalizeClass(["message-row", msg.role])
                  },
                  [
                    msg.role === "assistant" ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "avatar ai-avatar"
                    }, "✨")) : vue.createCommentVNode("v-if", true),
                    vue.createElementVNode("view", { class: "bubble-content" }, [
                      vue.createElementVNode(
                        "view",
                        { class: "text-block" },
                        vue.toDisplayString(msg.content),
                        1
                        /* TEXT */
                      )
                    ])
                  ],
                  2
                  /* CLASS */
                );
              }),
              128
              /* KEYED_FRAGMENT */
            )),
            $data.isTyping ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "message-row assistant"
            }, [
              vue.createElementVNode("view", { class: "avatar ai-avatar" }, "✨"),
              vue.createElementVNode("view", { class: "bubble-content" }, [
                vue.createElementVNode(
                  "view",
                  { class: "typing-loader" },
                  vue.toDisplayString($data.currentModel) + " 正在思考...",
                  1
                  /* TEXT */
                )
              ])
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { style: { "height": "180px" } })
          ])
        ], 8, ["scroll-top"]),
        vue.createElementVNode("view", { class: "input-area-wrapper" }, [
          vue.createElementVNode("view", { class: "input-box" }, [
            vue.createElementVNode("view", { class: "action-btn" }, "➕"),
            vue.withDirectives(vue.createElementVNode("textarea", {
              class: "text-input",
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.inputText = $event),
              placeholder: "输入你的问题...",
              "auto-height": "",
              maxlength: "-1",
              disabled: $data.isTyping
            }, null, 8, ["disabled"]), [
              [vue.vModelText, $data.inputText]
            ]),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["send-btn", { active: $data.inputText.length > 0 && !$data.isTyping }]),
                onClick: _cache[5] || (_cache[5] = (...args) => $options.sendMessage && $options.sendMessage(...args))
              },
              "➤",
              2
              /* CLASS */
            )
          ]),
          vue.createElementVNode(
            "text",
            { class: "disclaimer" },
            "当前模型：" + vue.toDisplayString($data.currentModel) + "。AI 可能会生成错误信息。",
            1
            /* TEXT */
          )
        ])
      ])
    ]);
  }
  const PagesChatLayout = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "E:/hub/113/pages/chat/layout.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/register/register", PagesRegisterRegister);
  __definePage("pages/forget/forget", PagesForgetForget);
  __definePage("pages/chat/layout", PagesChatLayout);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "E:/hub/113/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
