import fetch from '@/config/fetch'

// 获取待分账明细
export const getPayResult = (data) => fetch('/TSY/home/result/getPayResult', data)

// 获取服务商(区分服务商和合作伙伴)
export const getUserList = (data) => fetch('/TSY/home/user/getUserList', data)

// 获取全部服务商(不区分)
export const getUserListByAll = (data) => fetch('/TSY/home/user/getUserListByAll', data)

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
export const batchCheckResultByNo = (data) => fetch('/TSY/home/result/batchCheckResultByNo', data, 'POST')

// 待复核数据驳回
export const refusedCheckResult = (data) => fetch('/TSY/home/result/refusedCheckResult', data, 'POST')

// 添加分账规则
export const addRule = (data) => fetch('/TSY/home/rule/addRule', data, 'POST')

// 删除分账规则
export const deleteRule = (data) => fetch('/TSY/home/rule/deleteRule', data, 'POST')

// 添加分账/合作伙伴商户
export const addUser = (data) => fetch('/TSY/home/user/addUser', data, 'POST')

// 更新分账/合作伙伴商户
export const updateUser = (data) => fetch('/TSY/home/user/updateUser', data, 'POST')

// 逻辑删除分账/合作伙伴商户
export const deleteUser = (data) => fetch('/TSY/home/user/deleteUser', data, 'POST')

// 数据查询-->明细查询
export const getSubResult = (data) => fetch('/TSY/home/result/getSubResult', data)

// 获取验证码
export const getCode = (data) => fetch('/TSY/home/user/getCode', data, 'POST')

// 绑定手机
export const bindPhone = (data) => fetch('/TSY/home/user/bindPhone', data, 'POST')

// 实名制
export const setRealName = (data) => fetch('/TSY/home/user/setRealName', data, 'POST')

// 绑定银行卡
export const bindBankCard = (data) => fetch('/TSY/home/user/bindBankCard', data, 'POST')

// 获取电子签约配置
export const signContract = (data) => fetch('/TSY/home/tsy/signContract', data, 'POST')

// 判断服务商审核状态
export const getMemberInfo = (data) => fetch('/TSY/home/tsy/getMemberInfo', data, 'POST')

// 更新会员实名/企业认证状态
export const passRealName = (data) => fetch('/TSY/home/user/passRealName', data, 'POST')

// 查询对账单明细(合作伙伴)
export const getStatementByPartner = (data) => fetch('/TSY/home/result/getStatementByPartner', data)

// 查询对账单明细(本公司)
export const getStatementByServer = (data) => fetch('/TSY/home/result/getStatementByServer', data)

// 账户余额查询
export const getBalanceById = (data) => fetch('/TSY/home/result/getBalanceById', data)

//设置交易密码
export const setPayPwd = (data) => fetch('/TSY/home/tsy/setPayPwd', data, 'POST')
