import AXIOS from '@/utils/request'
//获取部门列表 或者 信息
export function getDept(params) {
    return AXIOS.get('/dept/dept/', { params })
}
//添加部门
export function addDept(data) {
    return AXIOS.post('/dept/dept/', data)
}
//删除
export function removeDept(data) {
    return AXIOS.post('/dept/dept/?delete', data)
}
//部门信息修改
export function putDept(data) {
    return AXIOS.post('/dept/dept/?01', data)
}
//获取用户列表
export function getUserList() {
    return AXIOS.get('/users/list/')
}
//角色列表
export function getRoles() {
    return AXIOS.get('/role/role/?list')
}
//通过id获取用户角色。或者通过角色id获取用户列表
export function getUsersRole(params) {
    return AXIOS.get('/role/role/', { params })
}
//添加角色
export function addRole(data) {
    return AXIOS.post('/role/role/', data)
}
//修改角色/为角色绑定/解绑用户
export function updateRole(data) {
    return AXIOS.post('/role/role/?01', data)
}
//删除角色
export function removeRole(data) {
    data = {...data, method: 'delete' }
    return AXIOS.post('/role/role/?delete', data)
}