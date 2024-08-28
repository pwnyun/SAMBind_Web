import axios from "axios";
import CryptoJS from "crypto-js";
import localforage from "localforage";

export const validateIdCard = (idCard) => {
  if (typeof idCard !== "string")
    return false;

  if (idCard.length !== 18)
    return false;

  var factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  var checkCode = '10X98765432';
  var sum = 0;

  for (var i = 0; i < 17; i++) {
    sum += parseInt(idCard.charAt(i)) * factors[i];
  }

  var mod = sum % 11;
  var checkDigit = checkCode.charAt(mod);
  return checkDigit === idCard.charAt(17).toUpperCase();
}

export function encrypt(data, key = "WLYW, 0531-89631358") {
  return CryptoJS.AES.encrypt(encodeURI(JSON.stringify(data)), key).toString()
}

export function decrypt(ciphertext, key = "WLYW, 0531-89631358") {
  let hex = CryptoJS.AES.decrypt(ciphertext, key).toString()
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }

  return JSON.parse(decodeURI(str));
}

export function request({url, method, data, params, headers}) {
  if (!data) data = {}
  if (!params) params = {}
  if (!headers) headers = {}

  return new Promise((resolve, reject) => {
    // 添加请求拦截器
    axios.interceptors.request.use(
      function (config) {
        // 在发送请求之前做些什么
        return config;
      },
      function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
      },
    );

    // 添加响应拦截器
    axios.interceptors.response.use(
      function (response) {
        // 对响应数据做点什么
        return response;
      },
      function (error) {
        // 对响应错误做点什么
        return Promise.reject(error);
      },
    );

    axios({method, url, data, params, headers})
      .then(res => {
        if (!res.status || (res.status && res.status === 'fail')) {
          reject(res.data);
        } else {
          resolve(res.data);
        }
      })
      .catch(err => {
        if (err.response) {
          // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
          console.error('axios response error', err);
          resolve({status: 'fail', message: `服务器响应出错：[${err.code}]: ${err.message}。`, data: err});
          reject({status: 'fail', message: `服务器响应出错：[${err.code}]: ${err.message}。`, data: err});
        } else if (err.request) {
          // 请求已经成功发起，但没有收到响应
          // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
          console.error('axios request error', err);
          resolve({status: 'fail', message: `没有收到服务器响应：[${err.code}]: ${err.message}。`, data: err});
          reject({status: 'fail', message: `没有收到服务器响应：[${err.code}]: ${err.message}。`, data: err});
        } else {
          // 发送请求时出了点问题
          console.error('axios other error', err);
          resolve({status: 'fail', message: `其它错误：[${err.code}]: ${err.message}。`, data: err});
          reject({status: 'fail', message: `其它错误：[${err.code}]: ${err.message}。`, data: err});
        }
      });
  });
}

export async function getLoginInfo() {
  try {
    let info = decrypt(await localforage.getItem('login_info'))
    console.debug("info", info)

    if (!info.name || !info.idCard || !info.token) {
      return {status: false}
    }

    return {status: true, ...info}

  } catch (e) {
    console.error('catch getLoginInfo error: ', e);
    await localforage.clear()
    return {status: false, message: "检查身份核验状态失败，请尝试重新进行身份核验。"}
  }
}
