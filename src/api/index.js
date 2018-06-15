import { fetch } from './api'

/**
 * 获取文章列表
 * 
 * @param {Int} category - 栏目ID
 * @param {Int} page - 当前页数
 * @param {Int} per_page - 每页个数
 * @returns {Promise}
 */
export function fetchPost(category = 0, page = 1, per_page = 6) {
    return fetch('post', {
        category,
        page,
        per_page
    })
}

/**
 * 获取文章栏目
 */
export function fetchCategory() {
    return fetch('category');
}