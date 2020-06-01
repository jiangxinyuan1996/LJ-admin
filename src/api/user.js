import fetch from '@/config/fetch'

export const login = (data) => fetch('/TSY/home/index/login', data,'POST')
export const setRoles = (data) => fetch('/TSY/home/index/setRole', data,'POST')

export const getInfo = (data) => fetch('/TSY/home/index/getLoginStatus', data)

export const logout = (data) => fetch('/TSY/home/index/getLoginStatus', data)


