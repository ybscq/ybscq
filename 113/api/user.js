import request from '@/utils/request.js';

/**
 * 发送注册验证码
 */
export const sendRegisterCode = (email) => {
  return request({
    url: '/login/sendRegisterCode',
    method: 'POST',
    data: { email },
    contentType: 'form'
  });
};

/**
 * 发送登录验证码
 */
export const sendLoginCode = (email) => {
  return request({
    url: '/login/sendLoginCode',
    method: 'POST',
    data: { email },
    contentType: 'form'
  });
};

/**
 * 用户注册
 */
export const registerUser = (userData) => {
  return request({
    url: '/login/reg',
    method: 'POST',
    data: userData,
    contentType: 'json'
  });
};

/**
 * 用户登录
 */
export const loginUser = (loginData) => {
  const { usernameOrEmail, password, code } = loginData;
  return request({
    url: '/login/login',
    method: 'POST',
    data: { usernameOrEmail, password, code },
    contentType: 'form'
  });
};

/**
 * 归一化用户信息
 */
export const normalizeUser = (source = {}, fallback = {}) => ({
  id: source.id || fallback.id || '',
  username: source.username || source.userName || fallback.username || fallback.usernameOrEmail || '',
  email: source.email || fallback.email || '',
  token: source.token || source.accessToken || fallback.token || ''
});
