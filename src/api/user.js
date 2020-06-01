import fetch from '@/config/fetch'
import request from '@/utils'

export const login = (data) => fetch('/TSY/home/index/login', data,'POST')
export const setRoles = (data) => fetch('/TSY/home/index/setRole', data,'POST')

export const getInfo = (data) => fetch('/TSY/home/index/getLoginStatus', data)

export const logout = (data) => fetch('/TSY/home/index/getLoginStatus', data)

// export function getInfo(token) {
//   return request({
//     url: '/vue-element-admin/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

// export function logout() {
//   return request({
//     url: '/TSY/home/index/getLoginStatus',
//     method: 'post'
//   })
// }
