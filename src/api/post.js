import { fetch } from './api'

/**
 * 获取文章列表
 * 
 * @param {Int} ID - 文章ID
 * @returns {Promise}
 */
export function fetchContent(id = 0) {
    let url = "post/" + id

    return fetch(url)
}