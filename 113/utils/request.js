const BASE_URL = 'http://127.0.0.1:8080';

/**
 * 序列化对象为 form-urlencoded 字符串
 */
const buildFormData = (data = {}) => {
  return Object.keys(data)
    .filter(key => data[key] !== undefined && data[key] !== null && data[key] !== '')
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
};

/**
 * 统一请求工具
 */
const request = (options) => {
  const { url, method = 'GET', data = {}, header = {}, contentType = 'json' } = options;
  
  // 设置默认 Content-Type
  const headers = { ...header };
  if (contentType === 'form') {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  } else if (contentType === 'json') {
    headers['Content-Type'] = 'application/json';
  }

  // 如果是 form 类型，转换 data
  const finalData = contentType === 'form' && typeof data === 'object' ? buildFormData(data) : data;

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}${url}`,
      method,
      data: finalData,
      header: headers,
      success: (res) => {
        const { statusCode, data: resData } = res;
        
        // 兼容不同的成功状态码
        const isSuccess = statusCode >= 200 && statusCode < 300;
        const bizSuccess = resData && (resData.code === 0 || resData.code === 200 || typeof resData.code === 'undefined');

        if (isSuccess && bizSuccess) {
          resolve(resData);
        } else {
          const errMsg = resData?.msg || resData?.message || '请求失败';
          uni.showToast({ title: errMsg, icon: 'none' });
          reject(new Error(errMsg));
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络异常，请稍后重试', icon: 'none' });
        reject(err);
      }
    });
  });
};

export default request;
