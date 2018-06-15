import Taro from '@tarojs/taro'

const APP_ENV = 'production';

const API_BASE = APP_ENV === 'development' ? "http://vuecms.test/api/" : "https://api.kapeter.com/"


/**
 *  接口返回值状态判断
 *
 * @param {Object} response - 接口返回值
 * @returns {Promise}
 */
function checkStatus(response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
        return Promise.resolve(response.data);
    }
}

/**
 *  请求业务接口基本方法
 *
 * @param {String} [url] - 对应wx.request里url参数
 * @param {Object} [data={}] - 对应wx.request里data参数，也就是query部分
 * @param {Object} [opts={}] - 对应wx.request里其他参数
 * @returns {Promise}
 */
export function fetch (url, data = {}, opts = {}) {
    let requestUrl = API_BASE + url

    return Taro.request({
        url: requestUrl,
        data,
        ...opts
    }).then(checkStatus)
}