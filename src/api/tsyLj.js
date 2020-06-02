import fetch from '@/config/fetch'

// 获取分账方
export const getUserList = (data) => fetch('/TSY/home/user/getUserList', data)

// 获取分账比例列表
export const getRuleList = (data) => fetch('/TSY/home/rule/getRuleList', data)

// 待分账数据提交
export const submitSubResult = (data) => fetch('/TSY/home/result/submitSubResult', data, 'POST')

// 获取待复核数据
export const getCheckResult = (data) => fetch('/TSY/home/result/getCheckResult', data)

// 获取待复核数据明细
export const getCheckResultDetail = (data) => fetch('/TSY/home/result/getCheckResultDetail', data)

// 待复核数据提交
export const submitCheckResult = (data) => fetch('/TSY/home/result/submitCheckResult', data, 'POST')

// 添加分账规则
export const addRule = (data) => fetch('/TSY/home/rule/addRule', data, 'POST')

// 删除分账规则
export const deleteRule = (data) => fetch('/TSY/home/rule/deleteRule', data, 'POST')
