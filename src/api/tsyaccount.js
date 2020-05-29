import fetch from '@/config/fetch'

//获取提现列表
export const getList = (data) => fetch('/TSY/home/user/getList', data)