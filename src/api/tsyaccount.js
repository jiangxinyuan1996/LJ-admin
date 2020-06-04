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

