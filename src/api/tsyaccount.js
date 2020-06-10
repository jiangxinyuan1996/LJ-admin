import fetch from '@/config/fetch'
//首页
export const getHomeList = (data) => fetch('/TSY/home/result/getMonthResult', data)
//获取提现列表
export const getList = (data) => fetch('/TSY/home/user/getList', data)
//获取角色列表
export const getRoleList = (data) => fetch('/TSY/home/role/getRoleList', data)
//获取管理人员列表
export const getPeopleList = (data) => fetch('/TSY/home/admin/getAdminList', data)
//新增管理人员
export const addPeople = (data) => fetch('/TSY/home/admin/register ', data,'POST')
//修改管理权限
export const updatePeople = (data) => fetch('/TSY/home/admin/updateRole', data,'POST')
//修改管理权限
export const delPeople = (data) => fetch('/TSY/home/admin/removeAdmin', data,'POST')
//修改密码
export const updatePassword = (data) => fetch('/TSY/home/index/updatePassword', data,'POST')
//提现查询
export const getWithdrawalList = (data) => fetch('/TSY/home/result/getWithdrawResult', data)
//新建提现
export const addWithdrawal = (data) => fetch('/TSY/home/result/withdraw', data,'POST')
//提现申请
export const applyWithdrawal = (data) => fetch('/TSY/home/result/withdrawApply', data,'POST')
//提现复核查询
export const getReviewList = (data) => fetch('/TSY/home/result/getWithdrawDetail ', data)
//获取提现密码
export const getTrancpwd = (data) => fetch('/TSY/home/admin/getPayStatus', data)
//设置提现密码
export const setPassword = (data) => fetch('/TSY/home/admin/setPayPwd ', data,'POST')
//提现复核提交
export const transactionReview = (data) => fetch('/TSY/home/tsy/withdrawApply', data,'POST')
//获取转出方账户余额
export const getBalance = (data) => fetch('/TSY/home/result/getBalanceById', data)
//申请转账
export const applyTransfer = (data) => fetch('/TSY/home/result/applyTransferResult', data,'POST')
//获取待复核调账列表
export const getTransferList = (data) => fetch('/TSY/home/result/getTransferResult ', data)
//调账复核
export const submitTransfer = (data) => fetch('/TSY/home/result/checkTransferResult', data,'POST')









