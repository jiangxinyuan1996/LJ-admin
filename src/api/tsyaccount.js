import fetch from '@/config/fetch'

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
export const getReviewList = (data) => fetch('/TSY/home/result/getCheckWithdrawResult ', data)
//获取交易密码
export const getTrancpwd = (data) => fetch('/TSY/home/admin/getPayStatus', data)
//提现复核提交
export const transactionReview = (data) => fetch('/TSY/home/tsy/withdrawApply ', data,'POST')





