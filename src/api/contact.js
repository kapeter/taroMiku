import { fetch } from './api'

/**
 * 提交联系表单
 * 
 * @param {Object} data - 表单内容
 * @returns {Promise}
 */
export function postContactForm(data) {

    return fetch('mail/send',data, {
        method: 'POST'
    })
}