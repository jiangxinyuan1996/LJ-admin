import fetch from '@/config/fetch'

// 获取待分账明细
export const getPayResult = (data) => fetch('/TSY/home/result/getPayResult', data)

// 获取分账方
export const getUserList = (data) => fetch('/TSY/home/user/getUserList', data)

// 获取分账比例列表
export const getRuleList = (data) => fetch('/TSY/home/rule/getRuleList', data)

// 待分账数据提交
export const submitSubResult = (data) => fetch('/TSY/home/result/submitSubResult', data, 'POST')

// 获取待复核数据
export const getCheckResult = (data) => fetch('/TSY/home/result/getCheckResult', data)

// 汇总待复核批量提交
export const batchCheckResult = (data) => fetch('/TSY/home/result/batchCheckResult', data, 'POST')

// 获取待复核数据明细
export const getCheckResultDetail = (data) => fetch('/TSY/home/result/getCheckResultDetail', data)

// 待复核数据提交
export const submitCheckResult = (data) => fetch('/TSY/home/result/submitCheckResult', data, 'POST')

// 待复核数据驳回
export const refusedCheckResult = (data) => fetch('/TSY/home/result/refusedCheckResult', data, 'POST')

// 添加分账规则
export const addRule = (data) => fetch('/TSY/home/rule/addRule', data, 'POST')

// 删除分账规则
export const deleteRule = (data) => fetch('/TSY/home/rule/deleteRule', data, 'POST')

// 添加分账/被分账方商户
export const addUser = (data) => fetch('/TSY/home/user/addUser', data, 'POST')

// 更新分账/被分账方商户
export const updateUser = (data) => fetch('/TSY/home/user/updateUser', data, 'POST')

// 逻辑删除分账/被分账方商户
export const deleteUser = (data) => fetch('/TSY/home/user/deleteUser', data, 'POST')

//数据查询-->明细查询
export const getSubResult = (data) => fetch('/TSY/home/result/getSubResult', data)
