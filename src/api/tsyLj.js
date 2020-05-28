import fetch from '@/config/fetch'

//获取分账方
export const getFromSubUserList = (data) => fetch('/TSY/home/user/getFromSubUserList', data)

//获取被分账方
export const getToSubUserList = (data) => fetch('/TSY/home/user/getToSubUserList', data)

//获取分账比例列表
export const getRuleList = (data) => fetch('/TSY/home/index/getRuleList', data)

//待分账数据提交
export const submitSubResult = (data) => fetch('/TSY/home/result/submitSubResult', data,'POST')

//获取待复核数据
export const getCheckResult = (data) => fetch('/TSY/home/result/getCheckResult', data,'POST')

//获取待复核数据明细
export const getCheckResultDetail = (data) => fetch('/TSY/home/result/getCheckResultDetail', data)

//待复核数据提交
export const submitCheckResult = (data) => fetch('/TSY/home/result/submitCheckResult', data)
